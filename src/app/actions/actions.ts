"use server";

import { PrismaClient } from "@prisma/client";
import { decode, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function getSearchData(searchString: string) {
  try {
    const Checking = await checkUser();

    if (!Checking) return { data: [], err: "You Must Login" };

    var data = await fetch(
      `https://api.giphy.com/v1/gifs/search?limit=${40}&q=${searchString}&api_key=${
        process.env.GIPHY_API_KEY
      }`
    );

    data = await data.json();

    return { data: data, err: false };
  } catch (err) {
    console.log(err);
    return { data: [], err };
  }
}

const checkUser = async () => {
  try {
    const token = cookies().get("token");

    if (!token) return false;

    // Decoding The Token From The Cookies
    const jwt_verified = verify(
      token?.value!,
      process.env.JWT_SECRETE || "tanmay_jwt_secrete"
    );

    if (!jwt_verified) return false;

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
