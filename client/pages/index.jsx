import React, { useState, useEffect } from "react";

import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context";

import { useRouter } from "next/router";
import { daysLeft } from "../utils";
export default function Home() {
  const router = useRouter();

  const { search } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [searchCampaigns, setSearchCampaigns] = useState([]);
  const [parsedCampaigns, setParsedCampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    console.log(data);

    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  useEffect(() => {
    setParsedCampaigns(
      campaigns
        .filter((campaign) => +daysLeft(campaign.deadline) > 0)
        .filter((campaign) => campaign.amountCollected < campaign.target)
    );
    setSearchCampaigns(
      parsedCampaigns.filter((campaign) =>
        campaign.title
          .toLowerCase()
          .includes(search ? search[0].toLowerCase() : "")
      )
    );
    // console.log(parsedCampaigns.forEach((campaign) => console.log(campaign.remainingDays)));
    console.log(parsedCampaigns);
  }, [campaigns, search]);

  return (
    <div>
      <DisplayCampaigns
        title={
          search
            ? "Found " + searchCampaigns.length + " for " + search
            : "All Campaigns " + "(" + parsedCampaigns.length + ")"
        }
        isLoading={isLoading}
        campaigns={search ? searchCampaigns : parsedCampaigns}
      />
    </div>
  );
}
