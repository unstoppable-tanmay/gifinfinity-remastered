"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Gif } from "@/types/giftypes";
import useUser from "@/store/useUser";
import { motion } from "framer-motion";
import { toast } from "../ui/use-toast";

type _Props = {
  string_gif: string;
  searchString?: string;
};

const GifCard = ({ string_gif, searchString }: _Props) => {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { user, liked_gifs, setLikedGifs } = useUser();

  const gif: Gif = JSON.parse(string_gif);

  const getLike = async () => {
    const response = await fetch("/api/like", {
      credentials: "include"
    });
    const response_data = await response.json();
    if (!response_data.err) {
      setLikedGifs(response_data.likes);
    }
  };

  const handleLike = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (liked) {
      // Delete From Liked
      const gifId = liked_gifs.map((e) => {
        const gif_from_liked = JSON.parse(e.gif);
        if (gif_from_liked.id == gif.id) return e.id;
        else return "";
      })[0];

      // toast({title:gifId})

      const response = await fetch("/api/like", {
        credentials: "include",
        method: "DELETE",
        body: JSON.stringify({
          id: gifId,
        }),
      });

      const response_data = await response.json();
      console.log(response_data);

      if (response_data.data) {
        setLiked(false);
        getLike();
        toast({ title: "DisLiked 🤍" });
      } else {
        setLiked(true);
        console.log(response_data.err);
        toast({ title: "Can't Removed " + response_data.err });
      }
    } else {
      // Add Like
      const response = await fetch("/api/like", {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({
          gif: string_gif,
          userId: user.id,
          searchString,
        }),
      });

      const response_data = await response.json();
      console.log(response_data);

      if (response_data.data) {
        setLiked(true);
        getLike();
        toast({ title: "Liked ❤" });
      } else {
        setLiked(false);
        toast({ title: "Can Not Liked ", description: response_data.err });
      }
    }
  };

  useEffect(() => {
    var ids: string[] = [];
    liked_gifs.map((e) => {
      const gif = JSON.parse(e.gif);
      ids.push(gif.id);
    });
    if (ids.includes(gif.id)) setLiked(true);
    else setLiked(false);
  }, [liked_gifs, gif]);

  useEffect(() => {}, [user]);

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="w-[210px] aspect-square max-w-[80vw] rounded-xl bg-white overflow-hidden relative"
          onMouseEnter={(e) => setHovered(true)}
          onMouseLeave={(e) => setHovered(false)}
        >
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="like_wrapper absolute w-full h-full bg-black/30 flex items-center justify-center"
            >
              <div
                className={`like text-4xl active:scale-110 hover:scale-125 duration-200 ${
                  liked ? "text-red-500" : "text-white"
                } cursor-crosshair`}
                onClick={(e) => handleLike(e)}
              >
                ❤
              </div>
            </motion.div>
          )}
          <img
            src={gif.images.original.url}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[400px] rounded-lg aspect-square p-0 overflow-hidden border-none bg-black">
        <div className="item w-full h-full relative">
          <img
            src={gif.images.original.url}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="top_overlay absolute w-full h-[50%] bottom-0 left-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="text_content absolute bottom-0 left-0 flex flex-col gap-3 p-3 pb-6">
            <div className="name text-white text-md font-medium">
              {gif.title}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GifCard;
