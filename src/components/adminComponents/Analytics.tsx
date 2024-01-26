"use client";

import React from "react";
import SearchGraph from "./SearchGraph";
import useAdmin from "@/store/useAdmin";
import TopKeywords from "./TopKeywords";

const Analytics = () => {
  const { isAdmin } = useAdmin();
  return (
    isAdmin && (
      <div className="analytics flex flex-wrap p-6 w-full min-h-screen gap-6">
        {/* Search Graph */}
        <SearchGraph />
        <TopKeywords/>
      </div>
    )
  );
};

export default Analytics;
