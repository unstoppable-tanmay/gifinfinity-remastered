import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { hashSync, genSaltSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

// Prisma Client
const prisma = new PrismaClient();

// Body Type
type Body = {
  name: string;
  email: string;
  password: string;
};

// SignUp Request
export async function POST(req: NextRequest) {
  try {
    const body: Body = await req.json();

    // If any field has not send with the body
    if (!body.email || !body.name || !body.password)
      return Response.json({ data: false, error: "404 request error" });

    // Checking For Not Filled Data
    if (!body.name)
      return Response.json({
        data: false,
        err: "Name Is Required!!",
      });
    if (!body.email)
      return Response.json({
        data: false,
        err: "Email Is Required!!",
      });
    if (!body.password)
      return Response.json({
        data: false,
        err: "Password Is Required!!",
      });

    const { email, name, password } = body;

    //   Hashing password
    const password_hashed = hashSync(password, genSaltSync(10));

    // Generating User
    const user = await prisma.admin.create({
      data: { email, name, password: password_hashed },
    });

    // Setting Cookies
    cookies().set(
      "admintoken",
      sign(user.id, process.env.JWT_SECRETE || "tanmay_jwt_secrete")
    );

    // Response
    return Response.json({ data: user, err: false });
  } catch (err) {
    console.log(err);
    return Response.json({ data: false, err });
  }
}
