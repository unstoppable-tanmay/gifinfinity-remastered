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

    const aggregateSearchTimelineData = await prisma.search.aggregateRaw({
      pipeline: [
        {
          $match: {
            searchedAt: {
              $gte: {$date:"2024-01-20T00:00:00Z"},
              $lt: {$date:"2024-01-28T00:00:00Z"},
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$searchedAt",
              },
              month: {
                $month: "$searchedAt",
              },
              day: {
                $dayOfMonth: "$searchedAt",
              },
            },
            totalSearches: {
              $sum: 1,
            },
          },
        },
        {
          $addFields: {
            date: {
              $concat: [
                {
                  $toString: "$_id.day",
                },
                "-",
                {
                  $toString: "$_id.month",
                },
                "-",
                {
                  $toString: "$_id.year",
                },
              ],
            },
          },
        },
      ],
    });

    const aggregateUserTimelineData = await prisma.user.aggregateRaw({
      pipeline: [
        {
          $match: {
            createdAt: {
              $gte: {$date:"2024-01-20T00:00:00Z"},
              $lt: {$date:"2024-01-28T00:00:00Z"},
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
              day: {
                $dayOfMonth: "$createdAt",
              },
            },
            totalUser: {
              $sum: 1,
            },
          },
        },
        {
          $addFields: {
            date: {
              $concat: [
                {
                  $toString: "$_id.day",
                },
                "-",
                {
                  $toString: "$_id.month",
                },
                "-",
                {
                  $toString: "$_id.year",
                },
              ],
            },
          },
        },
      ],
    });

    const aggregateLikeTimelineData = await prisma.like.aggregateRaw({
      pipeline: [
        {
          $match: {
            likedAt: {
              $gte: {$date:"2024-01-20T00:00:00Z"},
              $lt: {$date:"2024-01-28T00:00:00Z"},
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$likedAt",
              },
              month: {
                $month: "$likedAt",
              },
              day: {
                $dayOfMonth: "$likedAt",
              },
            },
            totalLikes: {
              $sum: 1,
            },
          },
        },
        {
          $addFields: {
            date: {
              $concat: [
                {
                  $toString: "$_id.day",
                },
                "-",
                {
                  $toString: "$_id.month",
                },
                "-",
                {
                  $toString: "$_id.year",
                },
              ],
            },
          },
        },
      ],
    });

    // Response
    return Response.json({
      data: {
        aggregateSearchTimelineData,
        aggregateUserTimelineData,
        aggregateLikeTimelineData,
      },
      err: false,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  }finally{
    prisma.$disconnect()
  }
}
