import { useState, useContext, createContext } from 'react';
import { ethers } from 'ethers';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //------Template Code------//
  const [state, setState] = useState({
    provider: null,
    signer: null,
    transactionsContract: null,
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
        console.log(account);
        setCurrentAccount(account[0]);
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const transactionsContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setState({ provider, signer, transactionsContract });
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
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);