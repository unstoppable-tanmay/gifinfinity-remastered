"use client";

import useAdmin from "@/store/useAdmin";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TopUsers = () => {
  const { topusers, setTopUsers, setLoading } = useAdmin();

  const compareFunction = (a: any, b: any) => {
    // Sort by totalSearches
    if (a.totalSearches !== b.totalSearches) {
      return b.totalSearches - a.totalSearches; // Sort in descending order
    }
    // If totalSearches are the same, sort by totalLikes
    return b.totalLikes - a.totalLikes; // Sort in descending order
  };

  const getUserSearchTimeLine = async () => {
    setLoading(true);
    const response = await fetch(
      "http://localhost:3000/api/admin/most-active-user"
    );

    const response_data = await response.json();

    var { aggregateMostActiveUser } = response_data.data;

    aggregateMostActiveUser = aggregateMostActiveUser.sort(compareFunction);

    console.log(aggregateMostActiveUser);

    setTopUsers(aggregateMostActiveUser);
    setLoading(false);
  };

  useEffect(() => {
    getUserSearchTimeLine();
  }, []);

  return (
    <div className="search_graph border-2 border-gray-100 p-4 rounded-xl shadow-xl flex gap-4 flex-col items-center justify-center self-center flex-1 min-w-[100%]">
      <div className="heading font-semibold text-xl">Most Active User</div>
      <div className="like table w-full max-w-[90vw]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Searches</TableHead>
              <TableHead>Likes</TableHead>
            </TableRow>
          </TableHeader>
          {topusers.length &&
            topusers.map((e, ind) => (
              <TableBody key={ind}>
                <TableRow>
                  <TableCell className="font-medium">{e.user.name}</TableCell>
                  <TableCell>{e.totalSearches}</TableCell>
                  <TableCell>{e.totalLikes}</TableCell>
                </TableRow>
              </TableBody>
            ))}
        </Table>
      </div>
    </div>
  );
};

export default TopUsers;
