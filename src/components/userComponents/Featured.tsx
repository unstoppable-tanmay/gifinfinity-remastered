import React, { useEffect, useState } from "react";
import GifCard from "./GifCard";
import { gif_data } from "@/app/(home)/data";
import { Gif, GifResponse } from "@/types/giftypes";
import { getTrendingData } from "@/app/actions/actions";

const Featured = () => {
  // On Arrival The Data From Trending Comes to the client from the server fetch.
  const [data, setData] = useState([]);

  const getData = async () => {
    const response: any = await getTrendingData();
    const local_data = await response.data;
    setData(local_data);
    console.log(data);
  };

  useEffect(() => {
    getData();
  }, []);

  // const data: any = gif_data;
  return (
    <div className="featured flex flex-col gap-5 items-center justify-center">
      <div className="header font-bold text-2xl text-slate-700">
        Featured GIFS
      </div>
      <div className="trendingWrapper max-w-[80vw] rounded-xl flex flex-wrap items-center justify-center gap-5 bg-slate-100 shadow-2xl p-7">
        {data &&
          data.map((gif: Gif, ind: number) => {
            return <GifCard key={ind} string_gif={JSON.stringify(gif)} />;
          })}
      </div>
    </div>
  );
};

export default Featured;
