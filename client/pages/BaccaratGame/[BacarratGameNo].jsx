import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { useStateContext } from "../../context";
import { CustomButton, Loader, Winner } from "../../components";

import { logo, coins } from "../../assets";
import { card } from "../../assets/card";
import { ethers } from "ethers";

import tickIcon from "../../assets/icons/tick.svg";
import copyIcon from "../../assets/icons/copy.svg";

const BacarratGameNo = () => {
  const router = useRouter();

  const {
    currentAccount,
    state,
    connectWallet,
    getBaccaratGameContract,
    isLoading,
    setIsLoading,
  } = useStateContext();

  const [gameOwner, setGameOwner] = useState("");
  const [gameContract, setGameContract] = useState();
  const [gameContractBalance, setGameContractBalance] = useState(0);
  const [gameAddress, setGameAddress] = useState("");
  const [playerRegistered, setPlayerRegistered] = useState(false);
  const [betAmount, setBetAmount] = useState(0);
  const [winningAmount, setWinningAmount] = useState(0);
  const [top3Winners, setTop3Winners] = useState([]);

  const [isPlayerRegistered, setIsPlayerRegistered] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const [playerCards, setPlayerCards] = useState({
    card1: 0,
    card2: 0,
    suit1: "",
    suit2: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      await connectWallet();
    };
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      if (!router.query.BacarratGameNo) return;
      const baccaratGame = await getBaccaratGameContract(
        router.query.BacarratGameNo
      );
      setGameAddress(router.query.BacarratGameNo);
      setGameContract(baccaratGame);
    })();
  }, [state.signer, router.query.BacarratGameNo]);

  useEffect(() => {
    (async () => {
      if (!gameContract) return;
      const contractOwner = await gameContract.getOwner();
      setGameOwner(contractOwner);
    })();
  }, [gameContract]);

  useEffect(() => {
    (async () => {
      if (!gameContract) return;
      const contractOwner = await gameContract.getOwner();
      setGameOwner(contractOwner);

      const getBetAmount = await gameContract.betAmount();
      const parsedBetAmount = ethers.BigNumber.from(
        getBetAmount._hex
      ).toString();
      setBetAmount(parsedBetAmount);

      const getContractBalance = await gameContract.getTokenBalance();
      const parsedContractBalance = ethers.BigNumber.from(
        getContractBalance._hex
      ).toString();
      setGameContractBalance(parsedContractBalance);

      const isPlayerRegistered = await gameContract.isPlayerRegistered(
        currentAccount
      );
      setIsPlayerRegistered(isPlayerRegistered);

      const isGameStarted = await gameContract.getGameStatus();
      console.log(isGameStarted);
      setIsGameStarted(isGameStarted);

      if (isGameStarted) {
        const { card1, card2, suit1, suit2 } = await getPlayerCards(
          currentAccount
        );

        setPlayerCards({
          card1,
          card2,
          suit1,
          suit2,
        });

        const getWinningAmount = await gameContract.getWinningAmount(
          currentAccount
        );
        const parsedWinningAmount = ethers.BigNumber.from(
          getWinningAmount._hex
        ).toString();
        setWinningAmount(parsedWinningAmount);

        const top3Winners = await gameContract.getTop3Players();
        console.log(top3Winners);
        setTop3Winners(top3Winners);
      }
    })();
  }, [gameContract]);

  const handleWithdraw = async () => {
    setIsLoading(true);
    const withdrawAmount = await gameContract.withdrawWinningAmount();
    console.log(withdrawAmount);
    withdrawAmount.wait();
    window.location.reload();
    setIsLoading(false);
  };

  const registerPlayer = async () => {
    setIsLoading(true);
    const registerPlayer = await gameContract.registerPlayer();
    setPlayerRegistered(true);
    registerPlayer.wait();
    window.location.reload();
    setIsLoading(false);
  };

  const distribitedCards = async () => {
    setIsLoading(true);
    const distribitedCards = await gameContract.distributeCards();
    distribitedCards.wait();
    window.location.reload();
    setIsLoading(false);
  };

  const getPlayerCards = async (address) => {
    const getPlayerCards = await gameContract.playerCards(address);
    const card1 = ethers.BigNumber.from(getPlayerCards[0][0]._hex).toString();
    const card2 = ethers.BigNumber.from(getPlayerCards[1][0]._hex).toString();
    const suit1 = getPlayerCards[0][1].toLowerCase();
    const suit2 = getPlayerCards[1][1].toLowerCase();
    console.log(card1, card2);
    console.log(suit1, suit2);

    return {
      card1,
      card2,
      suit1,
      suit2,
    };
  };

  const [copied, setCopied] = useState("");

  const handleCopy = () => {
    setCopied(gameAddress);
    navigator.clipboard.writeText(gameAddress);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <>
            <div className="flex space-x-3">
              <h4 className="font-epilogue font-semibold text-[23px] text-[#a8aabd] break-all">
                {gameAddress ? gameAddress : "Loading..."}
              </h4>
              <div className="copy_btn" onClick={handleCopy}>
                <Image
                  src={copied === gameAddress ? tickIcon : copyIcon}
                  alt={copied === gameAddress ? "tick_icon" : "copy_icon"}
                  width={12}
                  height={12}
                />
              </div>
            </div>
            <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
              Game Address
            </p>
          </>
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
                  </h4>
                  <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                    Game Owner
                  </p>
                </div>
              </div>

              {gameOwner.toLowerCase() === currentAccount && !isGameStarted && (
                <CustomButton
                  btnType="button"
                  title="Distribute Cards"
                  styles="w-fit bg-[#E00000] mt-5"
                  handleClick={distribitedCards}
                />
              )}
            </div>
            <div className="text-right">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                Amount
              </h4>
              <h4 className="font-epilogue font-semibold text-[40px] text-[#808191] uppercase">
                {betAmount} X {gameContractBalance / betAmount || 0}
              </h4>
            </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Your Cards
            </h4>
            {isPlayerRegistered ? (
              isGameStarted ? (
                <div className="flex">
                  {playerCards.suit1 && (
                    <>
                      {" "}
                      <Image
                        src={card[playerCards.suit1][playerCards.card1]}
                        alt="user"
                        className="w-[15%] h-[60%] object-contain"
                      />
                      <Image
                        src={card[playerCards.suit2][playerCards.card2]}
                        alt="user"
                        className="w-[15%] h-[60%] object-contain"
                      />
                    </>
                  )}
                </div>
              ) : (
                <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] break-all">
                  Game is not started yet!
                </h4>
              )
            ) : (
              <>
                {!isPlayerRegistered && !isGameStarted ? (
                  <>
                    <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] break-all">
                      You have not Registered Yet!
                    </h4>
                    <CustomButton
                      btnType="button"
                      title="Register"
                      styles="w-fit bg-[#E00000]"
                      handleClick={registerPlayer}
                    />
                  </>
                ) : (
                  <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] break-all">
                      Game Has been played!!
                    </h4>
                )}
              </>
            )}
          </div>
          <>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              Winnings
            </h4>
            <div className="flex space-x-2">
              <div className="flex justify-center items-center text-[20px] font-semibold text-white">
                {winningAmount}
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
              {top3Winners.map((winner, index) => (
                <Winner
                  key={index}
                  address={winner}
                  title={`${winner}`}
                  getPlayerCards={getPlayerCards}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacarratGameNo;
