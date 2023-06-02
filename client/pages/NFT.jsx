import { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { CustomButton, NFTCard, Loader } from "../components";

import { useRouter } from "next/router";
import { ethers } from "ethers";

const RadioButton = ({ id, name, value, label, selectedOption, onChange }) => {
  const isChecked = selectedOption === value;

  return (
    <div className="flex items-center mb-4">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        className={`relative float-left mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#E00109] `}
        checked={isChecked}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className="ml-2 text-[20px] text-gray-300 dark:text-gray-100"
      >
        {label}
      </label>
    </div>
  );
};

const NFT = () => {
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    console.log(event.target.value);
    setSelectedOption(event.target.value);
  };

  const [selectedNFT, setSelectedNFT] = useState();

  const handleNFTChange = (event) => {
    console.log(event.target.value);
    setSelectedNFT(event.target.value);
  };

  const { state, connectWallet, currentAccount, isLoading, setIsLoading } = useStateContext();

  const [nftNumber, setNftNumber] = useState("");
  const [nftList, setNftList] = useState([]);

  const [inputNFTName, setInputNFTName] = useState("");
  const [inputNFTLink, setInputNFTLink] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await connectWallet();
    };
    fetchData();
  }, []);

  const withdrawAmount = async () => {
    setIsLoading(true);
    const withdraw = await state.dynamicNFTContract.exchangeNFTForToken(
      selectedNFT
    );
    await withdraw.wait();
    window.location.reload();
    setIsLoading(false);
  };

  const updateNFT = async () => {
    setIsLoading(true);
    const update = await state.dynamicNFTContract.update(
      nftNumber,
      inputNFTLink,
      inputNFTName
    );
    await update.wait();
    window.location.reload();
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      if (!state.dynamicNFTContract || !currentAccount) return;
      const nftList = await state.dynamicNFTContract.getNFT(currentAccount);
      const parsedNftList = nftList.map((nft) => {
        return ethers.BigNumber.from(nft._hex).toNumber();
      });
      const filteredNftList = parsedNftList.filter((nft) => nft !== 0);
      setNftList(filteredNftList);
    })();
  }, [state.dynamicNFTContract,currentAccount]);

  const _mintNFT = async () => {
    setIsLoading(true);
    const createNFT = await state.dynamicNFTContract.mint(selectedOption);
    await createNFT.wait();
    window.location.reload();
    setIsLoading(false);
  };

  return (
    <div className="space-y-10">
      {isLoading && <Loader />}
      <div className="space-y-3">
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
          NFT Amount
        </h4>
        <div className="flex items-center space-x-5">
          <div className="flex justify-center items-center space-x-3 mt-4">
            <RadioButton
              id="option1"
              name="radioButtons"
              value="5"
              label="5"
              selectedOption={selectedOption}
              onChange={handleOptionChange}
            />
            <RadioButton
              id="option2"
              name="radioButtons"
              value="50"
              label="50"
              selectedOption={selectedOption}
              onChange={handleOptionChange}
            />
            <RadioButton
              id="option3"
              name="radioButtons"
              value="500"
              label="500"
              selectedOption={selectedOption}
              onChange={handleOptionChange}
            />
          </div>

          <div className="flex justify-center items-center text-[#3a3a43] text-[20px]">
            =
          </div>
          <CustomButton
            btnType="button"
            title="Mint NFT"
            styles="w-fit bg-[#E00000]"
            handleClick={_mintNFT}
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
          <div className="flex justify-center items-center space-x-3 pt-3">
            {nftList.map((nft) => (
              <RadioButton
                key={nft}
                id={"nft" + nft}
                name="nftNameButtons"
                value={nft}
                label={nft}
                selectedOption={selectedNFT}
                onChange={handleNFTChange}
              />
            ))}
          </div>

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
      <div className="space-y-3">
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
          Update NFT
        </h4>
        <div className="flex items-center space-x-5">
          <input
            placeholder="NFT Number"
            className="content-end w-fit py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#E00000] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
            value={nftNumber}
            onChange={(e) => setNftNumber(e.target.value)}
          />
          <input
            placeholder="New NFT Name"
            className="content-end w-fit py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#E00000] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
            value={inputNFTName}
            onChange={(e) => setInputNFTName(e.target.value)}
          />
          <input
            placeholder="New NFT Link"
            className="content-end w-fit py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#E00000] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
            value={inputNFTLink}
            onChange={(e) => setInputNFTLink(e.target.value)}
          />

          <div className="flex justify-center items-center text-[#3a3a43] text-[20px]">
            =
          </div>
          <CustomButton
            btnType="button"
            title="Update"
            styles="w-fit bg-[#E00000]"
            handleClick={updateNFT}
          />
        </div>
      </div>
    </div>
  );
};

export default NFT;
