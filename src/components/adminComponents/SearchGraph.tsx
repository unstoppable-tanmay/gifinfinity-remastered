"use client";

import useAdmin from "@/store/useAdmin";
import { DatePicker } from "antd";
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
// import DatePicker from "../DatePicker";

type TimeLineGraphDataMapType = {
  [date: string]: {
    like: number;
    search: number;
    user: number;
  };
};

const SearchGraph = () => {
  const { setTimeLine, timeline, loading, setLoading } = useAdmin();
  var search_graph_data: TimeLineGraphDataMapType = {};
  const [dataForGraph, setDataForGraph] = useState<
    { like: number; search: number; user: number; date: string }[]
  >([]);
  const [ltDate, setLtDate] = useState("");
  const [gtDate, setGtDate] = useState("");

  const getUserSearchTimeLine = async () => {
    setLoading(true);
    const response = await fetch(
      `/api/admin/user-search-like-timeline?ltDate=${ltDate}&gtDate=${gtDate}`, {
        credentials: "include"
      }
    );

    const response_data = await response.json();

    const data = response_data.data;

    console.log(data);

    setTimeLine(data);
    setLoading(false);
  };

  useEffect(() => {
    getUserSearchTimeLine();
  }, [ltDate, gtDate]);

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

  const compareDates = (date1: string, date2: string) => {
    const [day1, month1, year1] = date1.split("-").map(Number);
    const [day2, month2, year2] = date2.split("-").map(Number);

    if (year1 !== year2) {
      return year1 - year2;
    }
    if (month1 !== month2) {
      return month1 - month2;
    }
    return day1 - day2;
  };

  useEffect(() => {
    setLoading(true);
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

    var arrayFromMap = Object.entries(search_graph_data).map(
      ([date, values]) => ({
        date,
        ...values,
      })
    );

    if (arrayFromMap.length) {
      arrayFromMap = arrayFromMap.sort((a, b) => compareDates(a.date, b.date));

      setDataForGraph(arrayFromMap);

      console.log(arrayFromMap);
    }else{
      console.log(arrayFromMap,"arrayFromMap length is short")
    }

    setLoading(false);
  }, [timeline]);

  return (
    <div className="search_graph border-2 border-gray-100 p-4 rounded-xl shadow-xl flex gap-4 flex-col items-center justify-center self-center min-w-[58%] max-w-[90vw]">
      <div className="heading font-semibold text-xl">
        User, Searches & Like TimeLine
      </div>
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

export default SearchGraph;
