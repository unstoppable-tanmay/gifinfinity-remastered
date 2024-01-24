import React from "react";
import GifCard from "./GifCard";
import { gif_data } from "@/app/(home)/data";
import { Gif } from "@/types/giftypes";

// Trending Data
async function getTrendingData() {
  var response = await fetch(
    `https://api.giphy.com/v1/gifs/trending?limit=${20}&api_key=${
      process.env.GIPHY_API_KEY
    }`
  );

  const data = await response.json();

  console.log(data);

  return data;
}

const Featured = () => {
  // On Arrival The Data From Trending Comes to the client from the server fetch.
  // const response:GifResponse = await getTrendingData();
  // const data = await response.data

  const data: any = gif_data;
  return (
    <div className="featured flex flex-col gap-5 items-center justify-center">
      <div className="header font-bold text-2xl text-slate-700">
        Featured GIFS
      </div>
      <div className="trendingWrapper max-w-[80vw] rounded-xl flex flex-wrap items-center justify-center gap-5 bg-slate-100 shadow-2xl p-7">
        {data &&
          data.map((gif: Gif, ind: number) => {
            return <GifCard key={ind} gif={gif} />;
          })}
      </div>
    </div>
  );
};

export default Featured;
