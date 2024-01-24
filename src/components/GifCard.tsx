/* eslint-disable @next/next/no-img-element */

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Gif } from "@/types/giftypes";

const GifCard = ({ gif }: { gif: any }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="w-[210px] aspect-square max-w-[80vw] rounded-xl bg-white overflow-hidden">
          <img
            src={gif.images.fixed_height.url}
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
