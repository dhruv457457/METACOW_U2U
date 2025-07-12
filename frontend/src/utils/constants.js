import Factory from "../abis/Factory.json";
import Pair from "../abis/Pair.json";

// 🏭 DEX Constants
export const FACTORY_ADDRESS = "0x524Fec22546B087E91D198745CdD6ea94C057D79";
export const FACTORY_ABI = Factory.abi;
export const PAIR_ABI = Pair.abi;

// 🪙 Token List with decimals and optional logos
export const tokenList = [
  {
    symbol: "TKA",
    address: "0xD7c6cDFE1EB47fb74F2682F672B84c70A1891c93",
    decimals: 18,
    logoURI: "/logos/tka.png",
  },
  {
    symbol: "TKB",
    address: "0x23CB54C5083DCeF3877a32409727cCb9afC4d333",
    decimals: 18,
    logoURI: "/logos/tkb.png",
  },
  {
    symbol: "USDT",
    address: "0x35f7F94224ed0fE995f391CeC8FA7dEe64107Bf1",
    decimals: 18,
    logoURI: "/logos/usdt.png",
  },
  {
    symbol: "MOC", // ✅ must match the symbol inside token contract
    address: "0x26F9Ec14564B73DC95a79898bce62656a9A5503D",
    decimals: 18,
    logoURI: "/logos/moc.png",
  },
];

