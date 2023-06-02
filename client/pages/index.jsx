import React, { useState, useEffect } from "react";
import { DisplayGames, Loader } from "../components";
import { useStateContext } from "../context";

export default function Home() {
  const [crapsGames, setCrapsGames] = useState();
  const [baccaratGames, setBaccaratGames] = useState();

  const { state, connectWallet, isLoading, setIsLoading } = useStateContext();

  useEffect(() => {
    const fetchData = async () => {
      await connectWallet();
    };
    fetchData();
  }, []);

  const getCrapsGames = async () => {
    if (!state.crapsFactoryContract) return;
    const data = await state.crapsFactoryContract.getStruct();

    const parsedData = data.map((game) => {
      return {
        type: "Craps",
        gameAddress: game.gameAddress,
        ownerAddress: game.ownerAddress,
      };
    });

    return parsedData;
  };

  const getBaccaratGames = async () => {
    if (!state.baccaratFactoryContract) return;
    const data = await state.baccaratFactoryContract.getStruct();

    const parsedData = data.map((game) => {
      return {
        type: "Baccarat",
        gameAddress: game.gameAddress,
        ownerAddress: game.ownerAddress,
      };
    });

    return parsedData;
  };

  const fetchGames = async () => {
    if (!state) return;
    if (!state.crapsFactoryContract && !state.baccaratFactoryContract) return;
    const crapsGames = await getCrapsGames();
    const baccaratGames = await getBaccaratGames();

    crapsGames.reverse();
    baccaratGames.reverse();
    setCrapsGames(crapsGames);
    setBaccaratGames(baccaratGames);
  };

  useEffect(() => {
    if (state) {
      fetchGames();
    }
  }, [state]);

  return (
    <div className="space-y-10">
      {isLoading && <Loader />}

      <DisplayGames
        title={"Craps Games"}
        isLoading={isLoading}
        games={crapsGames || []}
      />
      <DisplayGames
        title={"Baccarat Games"}
        isLoading={isLoading}
        games={baccaratGames || []}
      />
    </div>
  );
}
