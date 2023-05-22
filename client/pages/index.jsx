import React, { useState, useEffect } from "react";

import { DisplayGames, Modal } from "../components";
import { useStateContext } from "../context";

import { useRouter } from "next/router";
import { ethers } from "ethers";

import { games as Games } from "../constants";

import { baccaratContractABI, crapsContractABI } from "../utils/constants";

export default function Home() {
  const router = useRouter();

  const { search } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState();

  const { state, getCrapsGames, getBaccaratGames } = useStateContext();

  const fetchGames = async () => {
    if(!state) return;
    console.log("here2");
    // setIsLoading(true);
    if(!state.crapsFactoryContract && !state.baccaratFactoryContract) return;
    const crapsGames = await getCrapsGames();
    const baccaratGames = await getBaccaratGames();
    console.log(baccaratGames);
    console.log(typeof crapsGames);
    
    let fetchedGames = [...crapsGames, ...baccaratGames];

    console.log(games);

    setGames(fetchedGames);

    
    setIsLoading(false);
  };
  
  console.log(games);
  useEffect(() => {
    console.log(state);
    if (state) {
      console.log("here3");
      fetchGames();
    }
  }, [state]);

  const buttonClicked = async () => {
    console.log(state);

    const data3 = await state.baccaratFactoryContract.getBaccaratGames();
    console.log(data3);

    const data = await state.crapsFactoryContract.getCrapsGames();
    console.log(data);

    // console.log(data[2]);

    // const data6 = await state.baccaratFactoryContract.getStruct();
    // console.log(data6);

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
      <DisplayGames title={"All Games"} isLoading={isLoading} games={games || []} />
    </div>
  );
}
