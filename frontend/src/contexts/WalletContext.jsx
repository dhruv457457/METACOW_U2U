import React, { createContext, useContext, useState, useEffect } from "react";
import MetaMaskSDK from "@metamask/sdk";
import { ethers } from "ethers";

const WalletContext = createContext();

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "MetaCow",
    url: typeof window !== "undefined" ? window.location.origin : "",
  },
  checkInstallationImmediately: false,
});

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState({
    address: null,
    signer: null,
    provider: null,
    chainId: null,
    balance: "0",
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const ethereum = MMSDK.getProvider();

      if (!ethereum) {
        throw new Error("MetaMask not found");
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const ethersProvider = new ethers.BrowserProvider(ethereum);
      const signer = await ethersProvider.getSigner();
      const network = await ethersProvider.getNetwork();
      const balance = await ethersProvider.getBalance(accounts[0]);

      setWalletData({
        address: accounts[0],
        signer,
        provider: ethersProvider,
        chainId: network.chainId.toString(),
        balance: ethers.formatEther(balance),
      });

      return { success: true };
    } catch (err) {
      console.error("connectWallet failed:", err);
      return { success: false, error: err.message };
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWalletData({
      address: null,
      signer: null,
      provider: null,
      chainId: null,
      balance: "0",
    });
  };

  return (
    <WalletContext.Provider
      value={{
        walletData,
        setWalletData,
        connectWallet,
        disconnect,
        isConnecting,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
