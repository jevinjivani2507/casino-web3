import React, { useState, useEffect } from "react";

import { DisplayGames, Modal } from "../components";
import { useStateContext } from "../context";

import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const { search } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState();

  const { state } = useStateContext();

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
    let fetchedGames = [...crapsGames, ...baccaratGames];
    setGames(fetchedGames);
  };

  useEffect(() => {
    if (state) {
      fetchGames();
    }
  }, [state]);

  return (
    <div>
      <DisplayGames
        title={"All Games"}
        isLoading={isLoading}
        games={games || []}
      />
    </div>
  );
}
