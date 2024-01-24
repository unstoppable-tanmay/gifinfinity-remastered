import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { compareSync, genSaltSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

// Prisma Client
const prisma = new PrismaClient();

// Body Type
type Body = {
  email: string;
  password: string;
};

// SignUp Request
export async function POST(req: NextRequest) {
  try {
    const body: Body = await req.json();

    // If any field has not send with the body
    if (!body.email || !body.password)
      return Response.json({ data: false, error: "404 request error" });

    const { email, password } = body;

    // Checking For Not Filled Data
    if (!email)
      return Response.json({
        data: false,
        err: "Email Is Required!!",
      });
    if (!password)
      return Response.json({
        data: false,
        err: "Password Is Required!!",
      });

    // Generating User
    const user = await prisma.user.findUnique({ where: { email } });

    // If No user Found
    if (!user) Response.json({ data: false, err: "No User Found" });

    //   Hashing password
    const password_compared = compareSync(password, user?.password!);

    // Checking Password
    if (password_compared)
      Response.json({ data: false, err: "Given Password is Wrong" });

    // Setting Cookies
    cookies().set(
      "token",
      sign(user!.id, process.env.JWT_SECRETE || "tanmay_jwt_secrete")
    );

    // Response
    return Response.json({ data: user, err: false });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  }
}
