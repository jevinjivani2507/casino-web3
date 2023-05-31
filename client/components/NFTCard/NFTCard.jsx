import { useState, useEffect } from "react";

import Image from "next/image";
import { daysLeft } from "../../utils";
import styles from "./nftCard.module.css";
import { SVGNFT } from "..";
import { logo } from "../../assets";
import { useStateContext } from "../../context";

import { ethers } from "ethers";

const NFTCard = ({ nft }) => {
  console.log(nft);

  const { state, currentAccount } = useStateContext();

  const [nFTName, setNFTName] = useState("");
  const [nFTLink, setNFTLink] = useState("");
  const [nFTColor, setNFTColor] = useState("");
  const [nFTValue, setNFTValue] = useState("");

  useEffect(() => {
    (async () => {
      if (!state.signer) return;
      const NFTName = await state.dynamicNFTContract.getLinkName(nft);
      setNFTName(NFTName);
      const NFTLink = await state.dynamicNFTContract.getLink(nft);
      setNFTLink(NFTLink);
      const NFTColor = await state.dynamicNFTContract.getNFTColor(nft);
      setNFTColor(NFTColor);
      const NFTValue = await state.dynamicNFTContract.nftToValue(nft);
      const parsedNFTValue = ethers.BigNumber.from(NFTValue._hex).toNumber();
      setNFTValue(parsedNFTValue);
    })();
  }, [state.signer]);

  return (
    <div
      className={
        `sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer` +
        " " +
        styles.fundCard
      }
      // onClick={handleClick}
    >
      {/* <Image
        src={`https://res.cloudinary.com/demo/image/fetch/${image}`}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-[15px]"
        width={288}
        height={158}
      /> */}
      <div className="flex justify-center items-center">
        <SVGNFT fill={nFTColor} />
      </div>

      <div className="flex flex-col p-4">
        {/* <div className="flex flex-row items-center mb-[18px]">
          <img
            src={tagType}
            alt="tag"
            className="w-[17px] h-[17px] object-contain"
          />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">
            Education
          </p>
        </div> */}

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">
            {nFTName}
          </h3>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {`${nFTLink.slice(0, 15)}...${nFTLink.slice(nFTLink.length - 4)}`}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Link
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
              {nFTValue}
            </h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">
              Value
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <Image
              src={logo}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">
            {/* by <span className="text-[#b2b3bd]">{shortenAddress(owner)}</span> */}
            by <span className="text-[#b2b3bd]">{currentAccount}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
