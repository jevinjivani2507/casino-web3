import { useState, useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";

import {
  tokenContractAddress,
  crapsFactoryContractAddress,
  baccaratFactoryContractAddress,
  dynamicNFTAddress,
  tokenContractABI,
  crapsFactoryContractABI,
  baccaratFactoryContractABI,
  crapsContractABI,
  baccaratContractABI,
  dynamicNFTABI,
} from "../utils/constants";

export const TransactionContext = createContext();

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);

  //------Template Code------//
  const [state, setState] = useState({
    provider: null,
    signer: null,
    tokenContract: null,
    crapsFactoryContract: null,
    baccaratFactoryContract: null,
    dynamicNFTContract: null,
  });

  const connectWallet = async () => {
    // const contractAddress = contractAddress;
    // const contractABI = contractABI;
    try {
      const { ethereum } = window;

      if (ethereum) {
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(account[0]);
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        tokenContractABI,
        signer
      );

      const crapsFactoryContract = new ethers.Contract(
        crapsFactoryContractAddress,
        crapsFactoryContractABI,
        signer
      );

      const baccaratFactoryContract = new ethers.Contract(
        baccaratFactoryContractAddress,
        baccaratFactoryContractABI,
        signer
      );

      const dynamicNFTContract = new ethers.Contract(
        dynamicNFTAddress,
        dynamicNFTABI,
        signer
      );

      await getTokenBalance();

      setState({
        provider,
        signer,
        tokenContract,
        crapsFactoryContract,
        baccaratFactoryContract,
        dynamicNFTContract,
      });

    } catch (error) {
      console.log(error);
    }
  };

  const getTokenBalance = async () => {
    try {
      if (!state.tokenContract) return;
      const balance = await state.tokenContract.balanceOf(currentAccount);
      const decimal = parseInt(balance._hex, 16);
      setTokenBalance(decimal);
    } catch (error) {
      console.log(error);
    }
  };

  const createBaccaratContract = async (betAmount) => {
    if (!state.baccaratFactoryContract) return;
    const tx = await state.baccaratFactoryContract.createBaccaratGame(
      betAmount
    );
    await tx.wait();
    console.log("Game Created");
  };

  const createCrapsGame = async () => {
    if (!state.crapsFactoryContract) return;
    const tx = await state.crapsFactoryContract.createCrapsGame();
    await tx.wait();
    console.log("Game Created");
  };

  const getCrapsGameContract = async (gameAddress) => {
    try {
      const crapsGameContract = new ethers.Contract(
        gameAddress,
        crapsContractABI,
        state.signer
      );
      return crapsGameContract;
    } catch (error) {
      console.log(error);
    }
  };

  const getBaccaratGameContract = async (gameAddress) => {
    try {
      const baccaratGameContract = new ethers.Contract(
        gameAddress,
        baccaratContractABI,
        state.signer
      );
      return baccaratGameContract;
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <StateContext.Provider
      value={{
        currentAccount,
        connectWallet,
        setCurrentAccount,
        tokenBalance,
        getTokenBalance,
        setTokenBalance,
        // getCrapsGames,
        // getBaccaratGames,
        state,
        createBaccaratContract,
        createCrapsGame,
        getCrapsGameContract,
        getBaccaratGameContract,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
