import { useState, useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";

import {
  tokenContractAddress,
  crapsFactoryContractAddress,
  baccaratFactoryContractAddress,
  crapsContractAddress,
  baccaratContractAddress,
  tokenContractABI,
  crapsFactoryContractABI,
  baccaratFactoryContractABI,
  crapsContractABI,
  baccaratContractABI,
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
        // console.log(account);
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

      await getTokenBalance();

      setState({
        provider,
        signer,
        tokenContract,
        crapsFactoryContract,
        baccaratFactoryContract,
      });

    } catch (error) {
      console.log(error);
    }
  };

  const getTokenBalance = async () => {
    if (!state.tokenContract) return;
    const balance = await state.tokenContract.balanceOf(currentAccount);
    const decimal = parseInt(balance._hex, 16);
    setTokenBalance(decimal);
    // console.log(tokenBalance);
  };

  useEffect(() => {
    // console.log(tokenBalance);
  }, [tokenBalance]);

  const getCrapsGames = async () => {
    if (!state.crapsFactoryContract) return;
    const data = await state.crapsFactoryContract.getStruct();

    const parsedData = data.map((game) => {
      return {
        type: "Craps",
        gameAddress: game.gameAddress,
        ownerAddress: game.ownerAddress,
      };
    });
    // console.log(parsedData);
    return parsedData;
  };

  const getBaccaratGames = async () => {
    if (!state.baccaratFactoryContract) return;
    const data = await state.baccaratFactoryContract.getStruct();
     
    const parsedData = data.map((game) => {
      return {
        type: "Baccarat",
        gameAddress: game.gameAddress,
        ownerAddress: game.ownerAddress,
      };
    });

    return parsedData;
  };

  const createBaccaratContract = async (betAmount) => {
    if (!state.baccaratFactoryContract) return;
    const tx = await state.baccaratFactoryContract.createBaccaratGame(betAmount);
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
      // if (!state.crapsContractABI) return;

      const crapsGameContract = new ethers.Contract(
        gameAddress,
        crapsContractABI,
        state.signer
      );

      // await crapsGameContract.wait();

      return crapsGameContract;

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
        getCrapsGames,
        getBaccaratGames,
        state, 
        createBaccaratContract,
        createCrapsGame,
        getCrapsGameContract,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
