import Image from "next/image";
import { coins } from "../assets";

import { diamonds, clubs, hearts, spades } from "../assets/card";

const Winner = (props) => {
  return (
    <>
      <h4 className="font-epilogue font-semibold text-[15px] leading-[30px] text-white ml-1">
        {props.title}
      </h4>
      <div className="flex">
        <Image
          src={props.suit1[props.number1]}
          alt="user"
          className="w-[20%] h-[80%] object-contain"
        />
        <Image
          src={props.suit2[props.number2]}
          alt="user"
          className="w-[20%] h-[80%] object-contain"
        />
        
      </div>
    </>
  );
};

export default Winner;
