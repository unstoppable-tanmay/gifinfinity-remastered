"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getSearchData } from "@/app/actions/actions";
import { Gif } from "@/types/giftypes";
import GifCard from "./GifCard";
import { motion } from "framer-motion";

const Search = () => {
  const [firstTime, setFirstTime] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);

  const handleSearchData = async (searchString: string) => {
    const response = await getSearchData("hello");
    console.log(response);
  };

  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
    } else {
      const timeoutSearchDebouncing = setTimeout(async () => {
        if (searchString.length) {
          const response: any = await getSearchData(searchString);

          console.log(response)

          if(response.err) return alert(response.err)

          setGifs(response.data.data);
        } else setGifs([]);
      }, 800);

      return () => clearTimeout(timeoutSearchDebouncing);
    }
  }, [searchString, firstTime]);
  return (
    <div className="search min-h-[80vh] flex w-full items-center justify-center mx-10 mb-20">
      <motion.div
        layout
        style={{ width: `${gifs && gifs.length ? 900 : 500}px` }}
        className="search_box p-4 rounded-lg bg-white max-w-[90vw] shadow-2xl flex items-center justify-center flex-col gap-5"
      >
        <Input
          placeholder="Gifs Are Infinity"
          className="border-none w-full bg-slate-100"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        {gifs && gifs.length ? (
          <div className="gif_container flex flex-wrap w-full justify-center gap-5 max-w-[90vw] p-5">
            {gifs &&
              gifs.map((gif, ind) => {
                return <GifCard key={ind} gif={gif} />;
              })}
          </div>
        ) : (
          <></>
        )}
      </motion.div>
    </div>
  );
};

export default Search;
