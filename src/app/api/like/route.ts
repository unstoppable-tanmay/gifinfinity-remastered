import { PrismaClient } from "@prisma/client";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// Prisma Client
const prisma = new PrismaClient();

// Body Type
type Body = {
  gif: string;
  userId: string;
  searchString: string;
};

// Like Request
export async function POST(req: NextRequest) {
  const token = cookies().get("token");
  try {

    if (!token) return Response.json({ data: false, err: "Login Expired" });

    // Decoding The Token From The Cookies
    const jwt_token = decode(token?.value!)?.toString();

    if (!jwt_token)
      return Response.json({ data: false, err: "Not Valid Token" });

    // Generating User
    const user = await prisma.user.findUnique({ where: { id: jwt_token } });

    // If No user Found
    if (!user)
      return Response.json({
        data: false,
        err: "No User Found User May Deleted",
      });

    const body: Body = await req.json();

    // Checking For Not Given Data
    if (!body.gif)
      return Response.json({
        data: false,
        err: "gif Is Required",
      });
    if (!body.userId)
      return Response.json({
        data: false,
        err: "userId Is Required!!",
      });

    const { gif, userId, searchString } = body;

    // Create Like
    const created_like = await prisma.like.create({
      data: {
        gif,
        userId,
        searchString: searchString ? searchString.split(" ") : [],
        gifId: JSON.parse(gif).id,
      },
    });

    // if Not Created
    if (!created_like)
      return Response.json({
        data: false,
        err: "Can Not Like" + JSON.parse(gif).id || "- Gif Is Error",
      });

    // Response
    return Response.json({
      data: true,
      err: false,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  }
}

// Remove From Like Request
export async function DELETE(req: NextRequest) {
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
      return Response.json({
        data: false,
        err: "No User Found User May Deleted",
      });

    const body: { id: string } = await req.json();

    // Checking For Not Given Data
    if (!body.id)
      return Response.json({
        data: false,
        err: "GifId Is Required!!",
      });

    const { id } = body;

    // Update The status Of like
    const updated_like = await prisma.like.update({
      data: { status: false },
      where: { id },
    });

    if (!updated_like)
      return Response.json({ data: false, err: "Can Not UnLike" + id });

    // Response
    return Response.json({
      data: true,
      err: false,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get("token");

    if (!token) return Response.json({ data: false, err: "Login Expired" });

    // Decoding The Token From The Cookies
    const jwt_token = decode(token?.value!)?.toString();

    if (!jwt_token)
      return Response.json({ data: false, err: "Not Valid Token" });

      // Getting The Likes Of a User
    const likes = await prisma.like.findMany({
      where: { userId: jwt_token, status: true },
    });

    // Response
    return Response.json({
      likes: likes,
      err: false,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  }
}
