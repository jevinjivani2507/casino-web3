import React, { useState, useEffect } from "react";

import { DisplayGames, Modal } from "../components";
import { useStateContext } from "../context";

import { useRouter } from "next/router";
import { daysLeft } from "../utils";

import { ethers } from "ethers";

import { games as Games } from "../constants";

import { baccaratContractABI, crapsContractABI } from "../utils/constants";

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
    console.log(state);

    // const data3 = await state.baccaratFactoryContract.createBaccaratGame();
    // console.log(data3);

    const data = await state.baccaratFactoryContract.getBaccaratGames();
    console.log(data);

    // console.log(data[2]);

    const data6 = await state.baccaratFactoryContract.getStruct();
    console.log(data6);

    // const baccaratGame = new ethers.Contract(
    //   data[2],
    //   baccaratContractABI,
    //   state.signer
    // );

    // const data2 = await baccaratGame.getOwner();

    // console.log(data2);

    // console.log(baccaratGame);
  };

  return (
    <div>
      <button onClick={buttonClicked}>ClickMe</button>
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
