"use client";

import useAdmin from "@/store/useAdmin";
import React, { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type TimeLineGraphDataMapType = {
  [date: string]: {
    like: number;
    search: number;
    user: number;
  };
};

const SearchGraph = () => {
  const { setTimeLine, timeline } = useAdmin();
  var search_graph_data: TimeLineGraphDataMapType = {};
  const [dataForGraph, setDataForGraph] = useState<
    { like: number; search: number; user: number; date: string }[]
  >([]);

  const getUserSearchTimeLine = async () => {
    const response = await fetch(
      "http://localhost:3000/api/admin/user-search-like-timeline"
    );

    const response_data = await response.json();

    const data = response_data.data;

    console.log(data);

    setTimeLine(data);
  };

  useEffect(() => {
    getUserSearchTimeLine();
  }, []);

  function addToMap(
    property: keyof TimeLineGraphDataMapType[string],
    value: number,
    date: string
  ) {
    // Check if the date already exists in the map
    if (!search_graph_data[date]) {
      // If the date doesn't exist, create a new entry with default values
      search_graph_data[date] = { like: 0, search: 0, user: 0 };
      search_graph_data[date][property] = value;
    }

    // Update the specified property with the new value
    search_graph_data[date][property] = value;
  }

  useEffect(() => {
    timeline &&
      timeline.aggregateLikeTimelineData.map((e) =>
        addToMap("like", e.totalLikes, e.date)
      );
    timeline &&
      timeline.aggregateSearchTimelineData.map((e) =>
        addToMap("search", e.totalSearches, e.date)
      );
    timeline &&
      timeline.aggregateUserTimelineData.map((e) =>
        addToMap("user", e.totalUser, e.date)
      );

    const arrayFromMap = Object.entries(search_graph_data).map(
      ([date, values]) => ({
        date,
        ...values,
      })
    );

    setDataForGraph(arrayFromMap);

    console.log(arrayFromMap);
  }, [timeline]);

  return (
    <div className="search_graph border-2 border-gray-100 p-4 rounded-xl shadow-xl flex gap-4 flex-col items-center justify-center self-center min-w-[58%]">
      <div className="heading font-semibold text-xl">User, Searches & Like TimeLine</div>
      <div
        className="search_graph"
        style={{ width: "100%", height: "300px", maxWidth: "90vw" }}
      >
        <ResponsiveContainer>
          <LineChart data={dataForGraph}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="like"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="search" stroke="#82ca9d" />
            <Line type="monotone" dataKey="user" stroke="#B85A4C" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SearchGraph;
