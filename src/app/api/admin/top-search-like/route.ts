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

    const gtDate = req.nextUrl.searchParams.get("gtDate");
    const ltDate = req.nextUrl.searchParams.get("ltDate");

    // if (gtDate && ltDate)
    //   console.log(
    //     new Date(gtDate!).toISOString(),
    //     new Date(ltDate!).toISOString()
    //   );

    const aggregateTopSearchData = await prisma.search.aggregateRaw({
      pipeline: [
        ltDate && gtDate
          ? {
              $match: {
                searchedAt: {
                  $gte: { $date: gtDate },
                  $lt: { $date: ltDate },
                },
              },
            }
          : { $match: {} },
        {
          $unwind: {
            path: "$searchString",
          },
        },
        {
          $group: {
            _id: "$searchString",
            date: {
              $first: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$searchedAt",
                },
              },
            },
            count: {
              $sum: 1,
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

    const aggregateTopLikeData = await prisma.like.aggregateRaw({
      pipeline: [
        ltDate && gtDate
          ? {
              $match: {
                likedAt: {
                  $gte: { $date: gtDate },
                  $lt: { $date: ltDate },
                },
              },
            }
          : { $match: {} },
        {
          $unwind: {
            path: "$searchString",
          },
        },
        {
          $group: {
            _id: "$searchString",
            date: {
              $first: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$likedAt",
                },
              },
            },
            count: {
              $sum: 1,
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
      data: { aggregateTopSearchData, aggregateTopLikeData },
      err: false,
    });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  } finally {
    prisma.$disconnect();
  }
}
