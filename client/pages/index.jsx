import React, { useState, useEffect } from "react";

import { DisplayGames } from "../components";
import { useStateContext } from "../context";

import { useRouter } from "next/router";
import { daysLeft } from "../utils";

import { ethers } from "ethers";

import { games as Games } from "../constants";

export default function Home() {
  const router = useRouter();

  const { search } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [searchGames, setSearchGames] = useState([]);
  const [parsedGames, setParsedGames] = useState([]);

  const { address, contract, getGames, state, currentAccount } =
    useStateContext();

  console.log(currentAccount);

  const fetchGames = async () => {
    setIsLoading(true);
    const data = await getGames();
    setGames(data);
    console.log(data);

    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchGames();
  }, [address, contract]);

  useEffect(() => {
    setParsedGames(
      games
        .filter((campaign) => +daysLeft(campaign.deadline) > 0)
        .filter((campaign) => campaign.amountCollected < campaign.target)
    );
    setSearchGames(
      parsedGames.filter((campaign) =>
        campaign.title
          .toLowerCase()
          .includes(search ? search[0].toLowerCase() : "")
      )
    );
  }, [games, search]);

  const buttonClicked = async () => {
    console.log("clicked");
    const num = 0.1;
    const data = await state.transactionsContract.exchangeMaticForToken({
      value: ethers.utils.parseEther("0.00000000000000001"),
    });
    console.log("clicked");
    const balance = await state.transactionsContract.balanceOf(currentAccount);
    // hex to decimal
    console.log("clicked");
    const decimal = parseInt(balance._hex, 16);
    
    console.log(decimal);
    console.log(data);
  };

  return (
    <div>
      {/* <button onClick={buttonClicked}>ClickMe</button> */}
      <DisplayGames
        title={
          search
            ? "Found " + searchGames.length + " for " + search
            : "All Games " + "(" + parsedGames.length + ")"
        }
        isLoading={isLoading}
        games={Games}
      />
      
    </div>
  );
}
