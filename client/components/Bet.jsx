import Image from "next/image";
import { coins } from "../assets";

const Bet = (props) => {
  return (
    <>
      <h4 className="font-epilogue font-semibold text-[15px] leading-[30px] text-white ml-1">
        {props.title}
      </h4>
      <div className="flex space-x-4">
        {props.betPlaced == "true" ? (
          <div className="w-fit py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]">
            {props.number}
          </div>
        ) : (
          <input
            onChange={(e) =>
              props.setBet({ ...props.bet, bet: e.target.value })
            }
            className="w-[60px] py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
          />
        )}
        {props.double &&
          (props.betPlaced == "true" ? (
            <div className="w-fit py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]">
              {props.number2}
            </div>
          ) : (
            <input
              onChange={(e) =>
                props.setBet({ ...props.bet, bet2: e.target.value })
              }
              className="w-[60px] py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
            />
          ))}
        <div className="flex justify-center items-center text-[#3a3a43]">X</div>
        <div className="flex space-x-2">
          {props.betPlaced == "true" ? (
            <div className="flex justify-center items-center text-[20px] font-semibold text-white">
              {props.amount}
            </div>
          ) : (
            <input
              onChange={(e) =>
                props.setBet({ ...props.bet, amount: e.target.value })
              }
              className="w-[60px] py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
            />
          )}
          <Image src={coins} alt="fund_logo" className="" />
        </div>
        <div className="flex justify-center items-center text-[#3a3a43]">X</div>
        <div className="flex justify-center items-center text-[20px] font-semibold text-white">
          {props.Multiplier}
        </div>
        
      </div>
    </>
  );
};

export default Bet;
