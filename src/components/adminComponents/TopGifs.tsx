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

const TopGifs = () => {
  const { topgifs, setTopGifs,setLoading } = useAdmin();

  const getUserSearchTimeLine = async () => {setLoading(true)
    const response = await fetch(
      "/api/admin/top-liked-gifs"
    );

    const response_data = await response.json();

    const data = response_data.data;

    console.log(data.aggregateTopLikedGifData);

    setTopGifs(data.aggregateTopLikedGifData);setLoading(false)
  };

  useEffect(() => {
    getUserSearchTimeLine();
  }, []);

  return (
    <div className="search_graph border-2 border-gray-100 p-4 rounded-xl shadow-xl flex gap-4 flex-col items-center justify-center self-center flex-1 min-w-[100%]">
      <div className="heading font-semibold text-xl">Top Gifs By Like</div>
      <div
        className="like table w-full max-w-[90vw]"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gif Name</TableHead>
              <TableHead>Gif Id</TableHead>
              <TableHead>Gif Likes</TableHead>
            </TableRow>
          </TableHeader>
          {topgifs.length &&
            topgifs.map((e, ind) => (
              <TableBody key={ind}>
                <TableRow>
                  <TableCell className="font-medium">
                    {JSON.parse(e.gif).title.split(' ').slice(0,2).join(' ')}
                  </TableCell>
                  <TableCell>{e._id}</TableCell>
                  <TableCell>{e.count}</TableCell>
                </TableRow>
              </TableBody>
            ))}
        </Table>
      </div>
    </div>
  );
};

export default TopGifs;
