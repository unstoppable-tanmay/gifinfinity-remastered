import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";

// Get Data Request
export async function GET(req: NextRequest) {
  // Prisma Client
  const prisma = new PrismaClient();
  try {
    const token = cookies().get("admintoken");

    if (!token) Response.json({ data: false, err: "Login Expired" });

    // Decoding The Token From The Cookies
    const jwt_token = decode(token?.value!)?.toString();

    if (!jwt_token)
      return Response.json({ data: false, err: "Not Valid Token" });

    // Generating User
    const user = await prisma.admin.findUnique({ where: { id: jwt_token } });

    // If No user Found
    if (!user) Response.json({ data: false, err: "You Are Not Permitted" });

    const aggregateTopLikedGifData = await prisma.like.aggregateRaw({
      pipeline: [
        {
          $group: {
            _id: "$gifId",
            count: {
              $sum: 1,
            },
            gif: {
              $first: "$gif",
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $limit: 20,
        },
      ],
    });

    // Response
    return Response.json({
      data: { aggregateTopLikedGifData },
      err: false,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  } finally {
    prisma.$disconnect();
  }
}
