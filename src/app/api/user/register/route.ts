import userModel from "@/models/user";
import connect from "@/utils/mongodb/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { email, password, name } = await req.json();

  await connect();

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      { message: "Email already exist" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new userModel({
    email,
    password: hashedPassword,
    name,
  });

  try {
    await newUser.save();
    return NextResponse.json(
      { message: "Successfully Registered" },
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse(err, { status: 500 });
  }
};
