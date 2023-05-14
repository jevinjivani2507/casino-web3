import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { useStateContext } from "../../context";
import { CustomButton, CountBox, Loader, Bet } from "../../components";

import { logo, coins } from "../../assets";
import { one, two, three, four, five, six } from "../../assets/die";

import { crapsContractABI } from "../../utils/constants";

import { ethers } from "ethers";

const CrapsGameNo = () => {
  const router = useRouter();

  const { state, connectWallet, getCrapsGameContract } = useStateContext();

  if (!state.provider) connectWallet();

  const { query } = useRouter();
  console.log(query);

  const [gameContract, setGameContract] = useState();

  const buttonClicked = async () => {
    // console.log(state);

    const crapsGame = new ethers.Contract(
      query.CrapsGameNo,
      crapsContractABI,
      state.signer
    );

    setGameContract(crapsGame);

    const getBetAmount = await crapsGame.getDice();
    console.log(getBetAmount);

    // // hex to decimal
    // const decimal = ethers.BigNumber.from(getBetAmount._hex).toString();
    // console.log(decimal);

    // setBetAmount(decimal);

    // const getRegisteredPlayers = await baccaratGame.getTokenBalance();
    // console.log(getRegisteredPlayers);

    // const decimal2 = ethers.BigNumber.from(getRegisteredPlayers._hex).toString();
    // console.log(decimal2);

    console.log(crapsGame);
  };

  // useEffect(() => {
  //   console.log(query.CrapsGameNo);
  //   const GameContract = getCrapsGameContract(query.CrapsGameNo);
  //   console.log(GameContract);
  //   setGameContract(GameContract);
  // }, [query]);

  useEffect(() => {
    console.log(gameContract);
  }, [gameContract]);

  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {

    console.log("paisa aapo");
  };

  return (
    <div>
      {isLoading && <Loader />}
      <button onClick={buttonClicked}>ClickMe</button>
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
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
                  {/* {query.owner} */}
                  0x1C61FeFAA240C08B9D11bE13f599467baAb303F3
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  Game Owner
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              OUTCOMES
            </h4>
            <div className="flex">
              <Image
                src={three}
                alt="user"
                className="w-[15%] h-[60%] object-contain"
              />
              <Image
                src={four}
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
              Your Bet X Amount X Multiplier = Payout
            </p>
            <div className="space-y-3">
              <Bet
                title="Sum"
                number="7"
                Multiplier="1.8"
                amount="20"
                winning="10"
              />
              <Bet
                title="Sum Odd/Even"
                number="0"
                Multiplier="1.8"
                amount="20"
                winning="10"
              />
              <Bet
                title="One Die"
                number="3"
                Multiplier="1.8"
                amount="20"
                winning="10"
              />
              <Bet
                title="Two Die"
                number="3"
                Multiplier="1.8"
                number2="4"
                amount="20"
                winning="10"
              />
            </div>
          </div>
          <CustomButton
            btnType="button"
            title="Place Bet"
            styles="w-fit bg-[#E00000] mt-5"
            handleClick={handleWithdraw}
          />
        </div>
      </div>
    </div>
  );
};

export default CrapsGameNo;
