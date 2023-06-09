import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { useStateContext } from "../../context";
import { CustomButton, Loader, Bet } from "../../components";

import { logo, coins } from "../../assets";
import { one, two, three, four, five, six } from "../../assets/die";

import tickIcon from "../../assets/icons/tick.svg";
import copyIcon from "../../assets/icons/copy.svg";

const CrapsGameNo = () => {
  const router = useRouter();

  const {
    currentAccount,
    state,
    connectWallet,
    getCrapsGameContract,
    isLoading,
    setIsLoading,
  } = useStateContext();

  console.log(isLoading);

  const [gameContract, setGameContract] = useState();
  const [playerRegistered, setPlayerRegistered] = useState(false);
  const [gameOwner, setGameOwner] = useState("");
  const [gameAddress, setGameAddress] = useState("");
  const [betArray, setBetArray] = useState([]);
  const [isGamePlayed, setIsGamePlayed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await connectWallet();
    };
    fetchData();
  }, []);

  useEffect(() => {
    (async () => {
      const crapsGame = await getCrapsGameContract(router.query.CrapsGameNo);
      setGameAddress(router.query.CrapsGameNo);
      setGameContract(crapsGame);
    })();
  }, [state.signer]);

  useEffect(() => {
    (async () => {
      if (!gameContract) return;
      const contractOwner = await gameContract.getOwner();
      setGameOwner(contractOwner);
      const playerBet = await gameContract.playerBet(currentAccount);
      const parsedArray = playerBet.map((item) => {
        return parseInt(item._hex);
      });
      console.log(parsedArray);
      const sum = parsedArray.reduce((a, b) => a + b, 0);
      setPlayerRegistered(sum > 0 ? true : false);
      setBetArray(parsedArray);

      const getDiceArray = await gameContract.getDice();

      if (getDiceArray.length > 0) {
        setIsGamePlayed(true);
        const parsedArray = getDiceArray.map((item) => {
          return parseInt(item._hex);
        });
        setDieArray(parsedArray);
        _winningAmount();
      }
    })();
  }, [gameContract]);

  const handleWithdraw = async () => {
    setIsLoading(true);
    const withdraw = await gameContract.distributeWinningAmount();
    console.log(withdraw);
    await withdraw.wait();
    window.location.reload();
    setIsLoading(false);
  };

  const placeBet = async () => {
    const placedBet = [
      parseInt(dieSum.bet),
      parseInt(dieSum.amount),
      parseInt(dieParity.bet),
      parseInt(dieParity.amount),
      parseInt(dieNumber.bet),
      parseInt(dieNumber.amount),
      parseInt(dicesNumber.bet),
      parseInt(dicesNumber.bet2),
      parseInt(dicesNumber.amount),
    ];

    setIsLoading(true);
    const placePlayerBet = await gameContract.setPlayerBet(placedBet);
    await placePlayerBet.wait();
    window.location.reload();
    setIsLoading(false);
  };

  const [dieSum, setDieSum] = useState({
    bet: 0,
    amount: 0,
  });

  const [dieParity, setDieParity] = useState({
    bet: 0,
    amount: 0,
  });

  const [dieNumber, setDieNumber] = useState({
    bet: 0,
    amount: 0,
  });

  const [dicesNumber, setDicesNumber] = useState({
    bet: 0,
    bet2: 0,
    amount: 0,
  });

  const [dieArray, setDieArray] = useState([]);

  const rollDice = async () => {
    setIsLoading(true);
    try {
      if (gameOwner.toLowerCase() === currentAccount.toLowerCase()) {
        const rollDice = await gameContract.rollDice();
        console.log(rollDice);

        await rollDice.wait();
      }
    } catch (err) {
      console.log(err);
    }
    const getDiceArray = await gameContract.getDice();
    const parsedArray = getDiceArray.map((item) => {
      return parseInt(item._hex);
    });
    setDieArray(parsedArray);
    _winningAmount();
    // window.location.reload();
    setIsLoading(false);
  };

  const [winningAmount, setWinningAmount] = useState(0);

  const _winningAmount = async () => {
    const winningAmount = await gameContract.getPlayerWinningAmount(
      currentAccount
    );
    const parsedAmount = parseInt(winningAmount._hex);
    setWinningAmount(parsedAmount);
    console.log(winningAmount);
  };

  const dies = {
    1: one,
    2: two,
    3: three,
    4: four,
    5: five,
    6: six,
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
          <div className="flex justify-between items-center">
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
                    {gameOwner ? gameOwner : "Loading..."}
                  </h4>
                  <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                    Game Owner
                  </p>
                </div>
              </div>
            </div>
            {gameOwner.toLowerCase() === currentAccount && !isGamePlayed && (
              <CustomButton
                btnType="button"
                title="RollDice"
                styles="w-fit bg-[#E00000]"
                handleClick={rollDice}
              />
            )}
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
              OUTCOMES
            </h4>
            {playerRegistered ? (
              dieArray.length > 0 ? (
                <div className="flex">
                  <Image
                    src={dies[dieArray[0]]}
                    alt="user"
                    className="w-[15%] h-[60%] object-contain"
                  />
                  <Image
                    src={dies[dieArray[1]]}
                    alt="user"
                    className="w-[15%] h-[60%] object-contain"
                  />
                </div>
              ) : (
                <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] break-all">
                  Die Not Rolled Yet
                </h4>
              )
            ) : (
              <h4 className="font-epilogue font-semibold text-[14px] text-[#808191] break-all">
                You Have Not Placed Any Bet
              </h4>
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
              Your Bet X Amount X Multiplier
            </p>
            <div className="space-y-3">
              <Bet
                title="Sum"
                number={betArray[0]}
                Multiplier="1.7"
                amount={betArray[1]}
                winning="10"
                betPlaced={playerRegistered ? "true" : "false"}
                bet={dieSum}
                double={false}
                setBet={setDieSum}
              />
              <Bet
                title="Sum Odd/Even"
                number={betArray[2]}
                Multiplier="1.9"
                amount={betArray[3]}
                winning="10"
                betPlaced={playerRegistered ? "true" : "false"}
                bet={dieParity}
                double={false}
                setBet={setDieParity}
              />
              <Bet
                title="One Die"
                number={betArray[4]}
                Multiplier="2.5"
                amount={betArray[5]}
                winning="10"
                betPlaced={playerRegistered ? "true" : "false"}
                double={false}
                bet={dieNumber}
                setBet={setDieNumber}
              />
              <Bet
                title="Two Die"
                number={betArray[6]}
                Multiplier="10"
                number2={betArray[7]}
                amount={betArray[8]}
                winning="10"
                double={true}
                betPlaced={playerRegistered ? "true" : "false"}
                bet={dicesNumber}
                setBet={setDicesNumber}
              />
            </div>
          </div>
          {!playerRegistered && (
            <div className="flex mt-5 space-x-3">
              <h4 className="flex justify-center items-center font-epilogue font-semibold text-[30px] text-white break-all">
                Total Bet:{" "}
                {parseInt(dieSum.amount) +
                  parseInt(dieParity.amount) +
                  parseInt(dieNumber.amount) +
                  parseInt(dicesNumber.amount)}
              </h4>
              <CustomButton
                btnType="button"
                title="Place Bet"
                styles="w-fit bg-[#E00000] "
                handleClick={placeBet}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrapsGameNo;
