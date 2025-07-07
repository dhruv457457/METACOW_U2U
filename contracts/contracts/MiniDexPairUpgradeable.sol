// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract MiniDexPairUpgradeable is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    address public tokenA;
    address public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalLPSupply;

    uint256 public constant FEE_RATE = 3; // 0.3%
    address public feeRecipient;

    mapping(address => uint256) public LPbalances;
    mapping(address => uint256) public userRewardDebt;
    mapping(address => uint256) public claimableRewards;

    uint256 public totalRewardPool;
    uint256 public lastVolumeTimestamp;
    uint256 public volume24h;
mapping(address => uint256) public totalInput;
mapping(address => uint256) public totalOutput;

    event Swapped(address indexed user, address indexed inputToken, address indexed outputToken, uint256 inputAmount, uint256 outputAmount);
    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 lpMinted);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB, uint256 lpBurned);
    event RewardClaimed(address indexed user, uint256 rewardAmount);
    event ReserveSynced(uint256 reserveA, uint256 reserveB);

    function initialize(address _tokenA, address _tokenB, address _owner) public initializer {
        require(_tokenA != _tokenB, "Identical addresses");
        require(_tokenA != address(0) && _tokenB != address(0), "Zero address");
        __Ownable_init(_owner);
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        tokenA = _tokenA;
        tokenB = _tokenB;
        feeRecipient = _owner;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function addLiquidity(uint256 amountA, uint256 amountB) external nonReentrant {
        require(amountA > 0 && amountB > 0, "Invalid input");

        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        uint256 lpToMint = totalLPSupply == 0 ? sqrt(amountA * amountB)
            : min((amountA * totalLPSupply) / reserveA, (amountB * totalLPSupply) / reserveB);

        require(lpToMint > 0, "Zero LP minted");

        _updateRewards(msg.sender);

        LPbalances[msg.sender] += lpToMint;
        totalLPSupply += lpToMint;

        _updateReserve();

        emit LiquidityAdded(msg.sender, amountA, amountB, lpToMint);
    }

    function removeLiquidity(uint256 lpAmount) external nonReentrant {
        require(lpAmount > 0 && lpAmount <= LPbalances[msg.sender], "Invalid LP amount");

        _updateRewards(msg.sender);

        uint256 amountA = (lpAmount * reserveA) / totalLPSupply;
        uint256 amountB = (lpAmount * reserveB) / totalLPSupply;

        LPbalances[msg.sender] -= lpAmount;
        totalLPSupply -= lpAmount;

        IERC20(tokenA).transfer(msg.sender, amountA);
        IERC20(tokenB).transfer(msg.sender, amountB);

        _updateReserve();

        emit LiquidityRemoved(msg.sender, amountA, amountB, lpAmount);
    }

    function swap(uint256 inputAmount, address inputToken) external nonReentrant {
        require(inputAmount > 0, "Zero input");
        require(inputToken == tokenA || inputToken == tokenB, "Invalid input token");

        address outputToken = inputToken == tokenA ? tokenB : tokenA;

        uint256 outputAmount = getAmountOut(inputAmount, inputToken);
        require(outputAmount > 0, "Zero output");

        IERC20(inputToken).transferFrom(msg.sender, address(this), inputAmount);

        uint256 fee = (inputAmount * FEE_RATE) / 1000;
        totalRewardPool += fee;

        IERC20(outputToken).transfer(msg.sender, outputAmount);
totalInput[msg.sender] += inputAmount;
totalOutput[msg.sender] += outputAmount;

        _updateReserve();
        _updateVolume(inputAmount);

        emit Swapped(msg.sender, inputToken, outputToken, inputAmount, outputAmount);
    }

    function _updateVolume(uint256 amountIn) internal {
        if (block.timestamp - lastVolumeTimestamp > 1 days) {
            volume24h = amountIn;
            lastVolumeTimestamp = block.timestamp;
        } else {
            volume24h += amountIn;
        }
    }

    function claimRewards() external nonReentrant {
        _updateRewards(msg.sender);
        uint256 reward = claimableRewards[msg.sender];
        require(reward > 0, "No rewards");
        claimableRewards[msg.sender] = 0;
        IERC20(tokenA).transfer(msg.sender, reward);
        emit RewardClaimed(msg.sender, reward);
    }

    function _updateRewards(address user) internal {
        if (totalLPSupply == 0) return;
        uint256 userShare = (LPbalances[user] * totalRewardPool) / totalLPSupply;
        uint256 debt = userRewardDebt[user];
        if (userShare > debt) {
            claimableRewards[user] += (userShare - debt);
        }
        userRewardDebt[user] = userShare;
    }

    function getAmountOut(uint256 inputAmount, address inputToken) public view returns (uint256 outputAmount) {
        bool isTokenA = inputToken == tokenA;
        (uint256 inputReserve, uint256 outputReserve) = isTokenA ? (reserveA, reserveB) : (reserveB, reserveA);

        uint256 inputWithFee = inputAmount * (1000 - FEE_RATE);
        uint256 numerator = inputWithFee * outputReserve;
        uint256 denominator = (inputReserve * 1000) + inputWithFee;
        outputAmount = numerator / denominator;
    }

    function _updateReserve() private {
        reserveA = IERC20(tokenA).balanceOf(address(this));
        reserveB = IERC20(tokenB).balanceOf(address(this));
        emit ReserveSynced(reserveA, reserveB);
    }

    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    // -------- Frontend Getters --------
    function getLPBalance(address user) external view returns (uint256) {
        return LPbalances[user];
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

function getClaimableRewards(address user) external view returns (uint256) {
    if (totalLPSupply == 0) return 0;

    uint256 userShare = (LPbalances[user] * totalRewardPool) / totalLPSupply;
    uint256 debt = userRewardDebt[user];
    return claimableRewards[user] + (userShare > debt ? userShare - debt : 0);
}


    function getTVL() external view returns (uint256) {
        return reserveA + reserveB;
    }

    function get24hVolume() external view returns (uint256) {
        return volume24h;
    }

    function getAPR() external view returns (uint256) {
        if (totalLPSupply == 0 || reserveA + reserveB == 0) return 0;
        uint256 yearlyFees = (volume24h * FEE_RATE / 1000) * 365;
        uint256 tvl = reserveA + reserveB;
        return (yearlyFees * 10000) / tvl; // APR in basis points (1250 = 12.5%)
    }
function claimAndReinvest(uint256 amountB) external nonReentrant {
    _updateRewards(msg.sender);

    uint256 reward = claimableRewards[msg.sender];
    require(reward > 0, "No rewards");
    claimableRewards[msg.sender] = 0;

    IERC20(tokenB).transferFrom(msg.sender, address(this), amountB); // User provides tokenB only

    uint256 lpToMint;

    if (totalLPSupply == 0 || reserveA == 0 || reserveB == 0) {
        lpToMint = sqrt(reward * amountB);
    } else {
        lpToMint = min(
            (reward * totalLPSupply) / reserveA,
            (amountB * totalLPSupply) / reserveB
        );
    }

    require(lpToMint > 0, "Zero LP minted");

    LPbalances[msg.sender] += lpToMint;
    totalLPSupply += lpToMint;

    _updateReserve();

    emit RewardClaimed(msg.sender, reward);
    emit LiquidityAdded(msg.sender, reward, amountB, lpToMint);
}
function getReputationScore(address user) external view returns (uint256) {
    uint256 lpShare = LPbalances[user];
    uint256 rewards = claimableRewards[user];

    uint256 lpWeight = totalLPSupply == 0 ? 0 : (lpShare * 1e18) / totalLPSupply;

    uint256 score = (lpWeight / 1e14) // 10,000 max
                  + (rewards / 1e16); // 1 point = 0.01 token

    if (totalOutput[user] > totalInput[user]) {
        score += (totalOutput[user] - totalInput[user]) / 1e16;
    } else {
        uint256 diff = (totalInput[user] - totalOutput[user]) / 1e16;
        if (diff > score) {
            score = 0;
        } else {
            score -= diff;
        }
    }

    return score;
}



}
