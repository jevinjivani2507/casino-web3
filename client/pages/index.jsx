import React, { useState, useEffect } from "react";

import { DisplayGames } from "../components";
import { useStateContext } from "../context";

import { useRouter } from "next/router";
import { daysLeft } from "../utils";

import { games as Games } from "../constants";

export default function Home() {
  const router = useRouter();

  const { search } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [searchGames, setSearchGames] = useState([]);
  const [parsedGames, setParsedGames] = useState([]);

  const { address, contract, getGames } = useStateContext();

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
    // console.log(parsedGames.forEach((campaign) => console.log(campaign.remainingDays)));
    // console.log(parsedGames);
  }, [games, search]);

  return (
    <div>
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
