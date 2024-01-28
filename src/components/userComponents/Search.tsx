"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Gif } from "@/types/giftypes";
import GifCard from "./GifCard";
import { motion } from "framer-motion";
import { Pagination } from "antd";
import useUser from "@/store/useUser";
import { useToast } from "../ui/use-toast";

const Search = () => {
  const [firstTime, setFirstTime] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [page, setPage] = useState(1);

  const { user, setLoading } = useUser();

  const { toast } = useToast();

  // Debouncing
  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
    } else {
      const timeoutSearchDebouncing = setTimeout(async () => {
        console.log(searchString);
        if (searchString.length) {
          setLoading(true);
          const response = await fetch(
            `/api/search?searchString=${searchString}&userId=${user.id}`, {
              credentials: "include"
            }
          );

          var data = await response.json();

          if (data.err) return toast({ title: data.err });

          setGifs(data.data.data);
          setLoading(false);
        } else setGifs([]);
      }, 800);

      return () => clearTimeout(timeoutSearchDebouncing);
    }
  }, [searchString, firstTime, user.id, setLoading, toast]);

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
          <div className="gif_container_wrapper flex flex-col w-full items-center justify-center">
            <div className="gif_container flex flex-wrap w-full justify-center gap-5 max-w-[90vw] p-5">
              {gifs &&
                gifs.slice(page * 15 - 15, page * 15).map((gif, ind) => {
                  return (
                    <GifCard
                      key={ind}
                      string_gif={JSON.stringify(gif)}
                      searchString={searchString}
                    />
                  );
                })}
            </div>
            <Pagination
              defaultCurrent={page}
              pageSize={15}
              onChange={(e) => {
                setPage(e);
              }}
              total={gifs.length}
            />
          </div>
        ) : (
          <></>
        )}
      </motion.div>
    </div>
  );
};

export default Search;
