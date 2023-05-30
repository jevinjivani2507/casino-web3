import Image from "next/image";
import { coins } from "../assets";
import { useState, useEffect } from "react";

import { diamonds, clubs, hearts, spades, card } from "../assets/card";

const Winner = (props) => {

  if(props.address === "0x0000000000000000000000000000000000000000") return null;

  const [playerCards, setPlayerCards] = useState({
    card1: 0,
    card2: 0,
    suit1: "",
    suit2: "",
  });

  useEffect(() => {
    (async () => {
      const { card1, card2, suit1, suit2 } = await props.getPlayerCards(
        props.address
      );
      setPlayerCards({ card1, card2, suit1, suit2 });
    })();
  }, []);



  return (
    <>
      <h4 className="font-epilogue font-semibold text-[15px] leading-[30px] text-white ml-1">
        {props.title}
      </h4>
      <div className="flex">
        {playerCards.suit1 && playerCards.suit2 && (
          <>
            <Image
              src={card[playerCards.suit1][playerCards.card1]}
              alt="user"
              className="w-[20%] h-[80%] object-contain"
            />
            <Image
              src={card[playerCards.suit2][playerCards.card2]}
              alt="user"
              className="w-[20%] h-[80%] object-contain"
            />
          </>
        )}
      </div>
    </>
  );
};

export default Winner;
