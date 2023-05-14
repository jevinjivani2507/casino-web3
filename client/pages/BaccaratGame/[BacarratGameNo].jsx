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
  const router = useRouter();
  const { state } = useStateContext();

  console.log(state.provider);

  if(!state.provider) return <div> Loading... </div>;

  const { query } = useRouter();

  const [gameOwner, setGameOwner] = useState("");

  // get path from query
  const path = router.asPath.split("/");
  console.log(typeof path[2]);

  useEffect(() => {
    setGameOwner(query.ownerAddress);
  }, [query]);

  const getGameContract = async (address) => {
    const baccaratGame = new ethers.Contract(
      address,
      baccaratContractABI,
      state.signer
    );
    return baccaratGame;
  };

  useEffect(() => {
    console.log(state);
    console.log(path[2]);
    
    const baccaratGame = getGameContract(path[2]);
    console.log(baccaratGame);

    const owner = baccaratGame.getOwner();
    console.log(owner);
    setGameOwner(owner);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    console.log("paisa aapo");
  };

  return (
    <div>
      {isLoading && <Loader />}

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
                200 X 5
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
