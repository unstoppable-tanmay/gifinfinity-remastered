import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";

// Prisma Client
const prisma = new PrismaClient();

// Login With JWT Request
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

    // Gifs Likes By User
    const liked_gif_by_user = await prisma.like.findMany({
      where: { userId: user?.id, status: true },
    });

    // Response
    return Response.json({
      data: user,
      liked_gifs: liked_gif_by_user,
      err: false,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  }
}
