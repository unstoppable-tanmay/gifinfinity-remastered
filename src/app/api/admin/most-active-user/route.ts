import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";

// Get Data Request
export async function GET(req: NextRequest) {
  // Prisma Client
  const prisma = new PrismaClient();

  const token = cookies().get("admintoken");
  try {

    if (!token) Response.json({ data: false, err: "Login Expired" });

    // Decoding The Token From The Cookies
    const jwt_token = decode(token?.value!)?.toString();

    if (!jwt_token)
      return Response.json({ data: false, err: "Not Valid Token" });

    // Generating User
    const user = await prisma.admin.findUnique({ where: { id: jwt_token } });

    // If No user Found
    if (!user) Response.json({ data: false, err: "You Are Not Permitted" });

    const aggregateMostActiveUser = await prisma.search.aggregateRaw({
      pipeline: [
        {
          $group: {
            _id: "$userId",
            totalSearches: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "Like",
            localField: "_id",
            foreignField: "userId",
            as: "likes",
          },
        },
        {
          $lookup: {
            from: "User",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $project: {
            _id: 1,
            totalSearches: 1,
            totalLikes: { $size: "$likes" },
            user: { $arrayElemAt: ["$user", 0] },
          },
        },
        { $limit: 20 },
      ],
    });

    // lookup the Search table then unwind then group by Search table userId with _id

    // Response
    return Response.json({
      data: {
        aggregateMostActiveUser,
      },
      err: false,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  } finally {
    prisma.$disconnect();
  }
}
