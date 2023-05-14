import { useState } from "react";
import { useStateContext } from "../context";

import { CustomButton } from "../components";

import { useRouter } from "next/router";

const CreateBaccaratGame = () => {

    const router = useRouter();

  const { state, createBaccaratContract } = useStateContext();

    const [inputValue, setInputValue] = useState("");

    const handleCreate = async () => {
        console.log(inputValue);
        console.log(state);
        await createBaccaratContract(inputValue);
        router.push("/");
    };

  return (
    <div>
      <div className="space-y-3">
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
          Exchange MATIC for Tokens
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
            title="Transfer"
            styles="w-fit bg-[#E00000]"
            handleClick={handleCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateBaccaratGame;
