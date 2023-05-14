import { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { useStateContext } from "../../context";
import { CustomButton, CountBox, Loader, Winner } from "../../components";

import { logo, coins } from "../../assets";

import { diamonds, clubs, hearts, spades } from "../../assets/card";

import { baccaratContractABI } from "../../utils/constants";

import { ethers } from "ethers";

const BacarratGameNo = () => {
  const { state, connectWallet } = useStateContext();
  const router = useRouter();
  const { query } = useRouter();
  console.log(query);

  if (!state.provider) connectWallet();

  useEffect(() => {
    setGameOwner(query.ownerAddress);
  }, [query]);

  const [gameOwner, setGameOwner] = useState("");

  const [gameContract, setGameContract] = useState();

  const buttonClicked = async () => {
    // console.log(state);

    const baccaratGame = new ethers.Contract(
      query.BacarratGameNo,
      baccaratContractABI,
      state.signer
    );

    setGameContract(baccaratGame);

    const getBetAmount = await baccaratGame.betAmount();
    console.log(getBetAmount);

    // hex to decimal
    const decimal = ethers.BigNumber.from(getBetAmount._hex).toString();
    console.log(decimal);

    setBetAmount(decimal);

    const getRegisteredPlayers = await baccaratGame.getTokenBalance();
    console.log(getRegisteredPlayers);

    const decimal2 = ethers.BigNumber.from(getRegisteredPlayers._hex).toString();
    console.log(decimal2);

    console.log(baccaratGame);
  };

  const [betAmount, setBetAmount] = useState(0);
  const [registeredPlayers, setRegisteredPlayers] = useState(0);

  // useEffect(() => {
  //   const getGameContract = async () => {
  //     try {
  //       const baccaratGame = new ethers.Contract(
  //         query.BacarratGameNo,
  //         baccaratContractABI,
  //         state.signer
  //       );
  //       return baccaratGame;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   if(!state.provider) connectWallet();
  //   if(state.provider){
  //     const gameContract = getGameContract();
  //     setGameContract(gameContract);
  //   }
  // }, [query.BacarratGameNo, state.provider, state.signer]);

  useEffect(() => {
    console.log(gameContract);
    console.log(betAmount);
    // const gameBetAmount = gameContract.betAmount();
    // setBetAmount(gameBetAmount);
  }, [gameContract]);

  useEffect(() => {
    if(!gameContract) return;
    const getBetAmount = gameContract.betAmount();
    console.log(getBetAmount);
  }, [gameContract]);


  

  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    console.log("paisa aapo");
  };

  // token -> exchange matic
  //crapsfactory -> create game
  //craps -> set player bet
  //craps ->

  return (
    <div>
      {isLoading && <Loader />}

      <button onClick={buttonClicked}>ClickMe</button>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div className="flex justify-between">
            <div>
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Creator
              </h4>
              <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
                <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                  <Image
                    src={logo}
                    alt="user"
                    className="w-[60%] h-[60%] object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                    {gameOwner}
                    {/* 0x1C61FeFAA240C08B9D11bE13f599467baAb303F3 */}
                  </h4>
                  <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                    Game Owner
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Amount
              </h4>
              <h4 className="font-epilogue font-semibold text-[40px] text-[#808191] uppercase">
                {betAmount} X 5
              </h4>
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Your Cards
            </h4>
            <div className="flex">
              <Image
                src={diamonds[1]}
                alt="user"
                className="w-[15%] h-[60%] object-contain"
              />
              <Image
                src={diamonds[13]}
                alt="user"
                className="w-[15%] h-[60%] object-contain"
              />
            </div>
          </div>
          <>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Winnings
            </h4>
            <div className="flex space-x-2">
              <div className="flex justify-center items-center text-[20px] font-semibold text-white">
                20
              </div>
              <Image src={coins} alt="fund_logo" className="" />
              <CustomButton
                btnType="button"
                title="Withdraw"
                styles="w-fit bg-[#E00000]"
                handleClick={handleWithdraw}
              />
            </div>
          </>
        </div>

        <div className="flex-1">
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[18px] leading-[30px] text-center text-[#808191]">
              Winners
            </p>
            <div className="space-y-3">
              <Winner
                title="First Winner"
                suit1={diamonds}
                number1={2}
                suit2={diamonds}
                number2={4}
              />
              <Winner
                title="Second Winner"
                suit1={diamonds}
                number1={2}
                suit2={diamonds}
                number2={4}
              />
              <Winner
                title="Third Winner"
                suit1={diamonds}
                number1={2}
                suit2={diamonds}
                number2={4}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacarratGameNo;
