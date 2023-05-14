import { useEffect, useState } from "react";

import { ethers } from "ethers";

import { useStateContext } from "../context";

import { CustomButton } from "../components";

const ExchangeTokens = () => {
  const { state, currentAccount, tokenBalance ,getTokenBalance, setTokenBalance } = useStateContext();

  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");

  const handleTransfer = async () => {
    console.log(inputValue);
    console.log(state);
    const data = await state.tokenContract.exchangeMaticForToken({
      value: ethers.utils.parseEther(inputValue),
    });
    console.log(data);

    setTokenBalance(tokenBalance + inputValue*1000);
    // getTokenBalance();
    console.log(tokenBalance);
    console.log("done");
  };

  const handleTransfer2 = async () => {
    console.log(inputValue);
    console.log(state);
    const data = await state.tokenContract.exchangeTokenForMatic(inputValue2);
    console.log(data);
    
    getTokenBalance();
    console.log(tokenBalance);
    console.log("done");
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
          Exchange MATIC for Tokens
        </h4>
        <div className="flex items-center space-x-5">
          <input
            placeholder="Enter MATIC amount"
            className="content-end w-fit py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#E00000] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="flex justify-center items-center text-[#3a3a43]">
            X
          </div>
          <div className="flex justify-center items-center text-white font-semibold text-[20px] ">
            1000
          </div>
          <div className="flex justify-center items-center text-[#3a3a43] text-[20px]">
            =
          </div>
          <CustomButton
            btnType="button"
            title="Transfer"
            styles="w-fit bg-[#E00000]"
            handleClick={handleTransfer}
          />
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
          Exchange MATIC for Tokens
        </h4>
        <div className="flex items-center space-x-5">
          <input
            placeholder="Enter MATIC amount"
            className="content-end w-fit py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#E00000] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
            value={inputValue2}
            onChange={(e) => setInputValue2(e.target.value)}
          />
          <div className="flex justify-center items-center text-[#3a3a43]">
            /
          </div>
          <div className="flex justify-center items-center text-white font-semibold text-[20px] ">
            1000
          </div>
          <div className="flex justify-center items-center text-[#3a3a43] text-[20px]">
            =
          </div>
          <CustomButton
            btnType="button"
            title="Transfer"
            styles="w-fit bg-[#E00000]"
            handleClick={handleTransfer2}
          />
        </div>
      </div>
    </div>
  );
};

export default ExchangeTokens;
