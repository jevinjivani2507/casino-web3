import { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { CustomButton, NFTCard } from "../components";

import { useRouter } from "next/router";
import { ethers } from "ethers";

const NFT = () => {
  const router = useRouter();

  const { state, connectWallet, currentAccount } = useStateContext();

  const [inputValue, setInputValue] = useState("");
  const [nftNumber, setNftNumber] = useState("");
  const [nftList, setNftList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await connectWallet();
    };
    fetchData();
  }, []);

  const withdrawAmount = async () => {
    console.log(nftNumber);
    const withdraw = await state.dynamicNFTContract.exchangeNFTForToken(nftNumber);
    console.log(withdraw);
  };

  useEffect(() => {
    (async () => {
      if (!state.signer) return;
      const nftList = await state.dynamicNFTContract.getNFT(currentAccount);
      const parsedNftList = nftList.map((nft) => {
        return ethers.BigNumber.from(nft._hex).toNumber();
      });
      setNftList(parsedNftList);
    })();
  }, [state.signer]);

  const handleCreate = async () => {
    const createNFT = await state.dynamicNFTContract.mint(inputValue);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
          NFT Amount
        </h4>
        <div className="flex items-center space-x-5">
          <input
            placeholder="Bet Amount"
            className="content-end w-fit py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#E00000] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <div className="flex justify-center items-center text-[#3a3a43] text-[20px]">
            =
          </div>
          <CustomButton
            btnType="button"
            title="Mint NFT"
            styles="w-fit bg-[#E00000]"
            handleClick={handleCreate}
          />
        </div>
      </div>
      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
        My NFTs
      </h4>
      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {nftList.map((nft) => (
          <NFTCard key={nft} nft={nft} />
        ))}
      </div>
      <div className="space-y-3">
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
          Withdraw NFT Amount
        </h4>
        <div className="flex items-center space-x-5">
          <input
            placeholder="NFT Number"
            className="content-end w-fit py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#E00000] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
            value={nftNumber}
            onChange={(e) => setNftNumber(e.target.value)}
          />

          <div className="flex justify-center items-center text-[#3a3a43] text-[20px]">
            =
          </div>
          <CustomButton
            btnType="button"
            title="Withdraw"
            styles="w-fit bg-[#E00000]"
            handleClick={withdrawAmount}
          />
        </div>
      </div>
    </div>
  );
};

export default NFT;
