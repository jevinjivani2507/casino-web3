import React from "react";

import { ethers } from "ethers";

import { useStateContext } from "../context";

const test = () => {
  const { address, contract, getGames, state, currentAccount } =
    useStateContext();

  const buttonClicked = async () => {
    console.log("clicked");
    console.log(state);

    const data = await state.tokenContract.exchangeMaticForToken({
      value: ethers.utils.parseEther("0.1"),
    });
    console.log("clicked");
    const balance = await state.tokenContract.balanceOf(currentAccount);
    // hex to decimal
    console.log("clicked");
    const decimal = parseInt(balance._hex, 16);

    console.log(decimal);
    // console.log(data);
  };

  const buttonClicked2 = async () => {
    console.log("clicked");
    console.log(state);

    const balance = await state.tokenContract.balanceOf(currentAccount);
    // hex to decimal
    console.log("clicked");
    const decimal = parseInt(balance._hex, 16);

    console.log(decimal);
  };

  return (
    <div>
      <button onClick={buttonClicked}>ClickMe</button>
      <button onClick={buttonClicked2}>ClickMe2</button>
    </div>
  );
};

export default test;
