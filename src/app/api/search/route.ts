import { PrismaClient } from "@prisma/client";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// Prisma Client
const prisma = new PrismaClient();

// Search Request
export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("token");

    if (!token) return Response.json({ data: false, err: "Login Expired" });

    // Decoding The Token From The Cookies
    const jwt_token = decode(token?.value!)?.toString();

    if (!jwt_token)
      return Response.json({ data: false, err: "Not Valid Token" });

    // Generating User
    const user = await prisma.user.findUnique({ where: { id: jwt_token } });

    // If No user Found
    if (!user)
      return Response.json({ data: false, err: "No User Found User May Deleted" });

    
    const searchString = req.nextUrl.searchParams.get("searchString");
    const userId = req.nextUrl.searchParams.get("userId");

    if (!searchString)
      return Response.json({ data: false, err: "Not A Valid Request" });

    if (!userId)
      return Response.json({ data: false, err: "Please Login First" });

    var data = await fetch(
      `https://api.giphy.com/v1/gifs/search?limit=${40}&q=${searchString}&api_key=${
        process.env.GIPHY_API_KEY
      }`
    );

    data = await data.json();

    const added_search = await prisma.search.create({
      data: { searchString: searchString.split(" "), userId: userId! },
    });

    if (!added_search) {
      return Response.json({
        data: false,
        err: "error in adding to search table",
      });
    }

    return Response.json({ data, err: false });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  }
}
