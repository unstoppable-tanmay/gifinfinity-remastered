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

    const aggregateMostActiveUser = await prisma.search.aggregateRaw({
      pipeline: [
        {
          $lookup: {
            from: "Search",
            localField: "userId",
            foreignField: "userId",
            as: "searches",
          },
        },
        {
          $group: {
            _id: "$userId",
            totalSearches: {
              $sum: 1,
            },
            totalLikes: {
              $sum: {
                $cond: {
                  if: "$status",
                  then: 1,
                  else: 0,
                },
              },
            },
          },
        },
        {
          $sort: {
            totalLikes: -1,
          },
        },
        {
          $limit: 20,
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
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            totalLikes: 1,
            totalSearches: 1,
            name: "$user.name",
          },
        },
      ],
    });

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
