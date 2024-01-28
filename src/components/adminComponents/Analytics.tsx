"use client";

import React from "react";
import SearchGraph from "./SearchGraph";
import useAdmin from "@/store/useAdmin";
import TopKeywords from "./TopKeywords";
import TopGifs from "./TopGifs";
import TopUsers from "./TopUsers";

const Analytics = () => {
  const { isAdmin } = useAdmin();
  return (
    <>
      {isAdmin ? (
        <div className="analytics flex flex-wrap p-6 w-full min-h-screen gap-6">
          {/* Search Graph */}
          <SearchGraph />
          <TopKeywords />
          <TopGifs />
          <TopUsers />
        </div>
      ) : (
        <div className="font-semibold text-xl w-full min-h-[85vh] flex items-center justify-center">
          You Need To Login As Admin To View{" "}
        </div>
      )}
    </>
  );
};

export default Analytics;
