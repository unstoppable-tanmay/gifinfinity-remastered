"use server";

import { PrismaClient } from "@prisma/client";
import { decode, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function getTrendingData() {
  try {
    var data = await fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=${
        process.env.GIPHY_API_KEY
      }&limit=15`
    );

    data = await data.json();

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}