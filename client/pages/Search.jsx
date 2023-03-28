import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Search = () => {
  const router = useRouter();
  const { search } = router.query;

  return <div>Search</div>;
};

export default Search;
