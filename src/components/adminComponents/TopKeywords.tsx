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
import { DatePicker } from "antd";

type TopKeywordsType = {
  [keyword: string]: {
    like: number;
    search: number;
    date: string;
  };
};

const TopKeywords = () => {
  const { keyword, setKeyword, setLoading } = useAdmin();
  var top_keyword_data: TopKeywordsType = {};
  const [dataForGraph, setDataForGraph] = useState<
    { keyword: string; like: number; search: number; date: string }[]
  >([]);
  const [ltDate, setLtDate] = useState("");
  const [gtDate, setGtDate] = useState("");

  const getUserSearchTimeLine = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/admin/top-search-like?ltDate=${ltDate}&gtDate=${gtDate}`, {
        credentials: "include"
      }
    );

    const response_data = await response.json();

    const data = response_data.data;

    console.log(data);

    setKeyword(data);
    setLoading(false);
  };

  useEffect(() => {
    getUserSearchTimeLine();
  }, [ltDate, gtDate]);

  function addToMap(
    property: "like" | "search",
    value: number,
    keyword: string,
    date: string
  ) {
    // Check if the date already exists in the map
    if (!top_keyword_data[keyword]) {
      // If the date doesn't exist, create a new entry with default values
      top_keyword_data[keyword] = { like: 0, search: 0, date };
      top_keyword_data[keyword][property] = value;
    }

    // Update the specified property with the new value
    top_keyword_data[keyword][property] = value;
  }

  useEffect(() => {
    keyword &&
      keyword.aggregateTopLikeData.map((e) =>
        addToMap("like", e.count, e._id, e.date)
      );
    keyword &&
      keyword.aggregateTopSearchData.map((e) =>
        addToMap("search", e.count, e._id, e.date)
      );

    const arrayFromMap = Object.entries(top_keyword_data).map(
      ([keyword, values]) => ({
        keyword,
        ...values,
      })
    );

    setDataForGraph(arrayFromMap);

    console.log(arrayFromMap);
  }, [keyword]);

  return (
    <div className="search_graph border-2 border-gray-100 p-4 rounded-xl shadow-xl flex gap-4 flex-col items-center justify-center self-center flex-1 min-w-[38%]">
      <div className="heading font-semibold text-xl">
        Top Keyword Of Like & Searches
      </div>
      <div
        className="search_graph"
        style={{ width: "100%", height: "300px", maxWidth: "90vw" }}
      >
        <ResponsiveContainer>
          <LineChart data={dataForGraph}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="keyword" />
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
      <div className="date w-full flex justify-between px-3 flex-wrap gap-4">
        <DatePicker
          placeholder="Greater Than Date"
          onChange={(date, dateString) => {
            dateString && setGtDate(new Date(dateString).toISOString());
          }}
        />
        <DatePicker
          placeholder="Lower Than Date"
          onChange={(date, dateString) => {
            dateString && setLtDate(new Date(dateString).toISOString());
          }}
        />
      </div>
    </div>
  );
};

export default TopKeywords;
