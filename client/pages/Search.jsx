import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FundCard } from "../components";
import { loader } from "../assets";

import { useStateContext } from "../context";

const Search = () => {
  const router = useRouter();
  const { search } = router.query;
  console.log(search);


  return <div>Search</div>;
};

export default Search;
