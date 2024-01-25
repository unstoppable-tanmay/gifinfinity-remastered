import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { decode } from "jsonwebtoken";
import { cookies } from "next/headers";

// Prisma Client
const prisma = new PrismaClient();

// SignUp Request
export async function GET(req: NextRequest) {
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
    if (!user)
      Response.json({ data: false, err: "No User Found User May Deleted" });
    // Response
    return Response.json({ data: user, err: false });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  }
}
