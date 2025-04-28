
import { NextRequest, NextResponse } from "next/server";
import { FinancialUserModel } from "../../../../models/fianancialUserSchema"; // Import user model
import bcrypt from "bcryptjs"; // For password hashing
import jwt from "jsonwebtoken";
import { dbconnect } from "../../../../dbconfig/dbconnect";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // Step 1: Validate the input data
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    // Step 2: Connect to the database
    await dbconnect();
    console.log("✅ Connected to DB");

    // Step 3: Check if the user already exists
    const userExists = await FinancialUserModel.findOne({ $or: [{ username }, { email }] });

    if (userExists) {
      return NextResponse.json(
        { success: false, message: "User already exists. Please use a different username or email." }
      );
    }

    // Step 4: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Create a new user
    const newUser = new FinancialUserModel({
      username,
      email,
      password: hashedPassword,
      transactions: [],
    });

    // Step 6: Save the new user
    await newUser.save();

    // Step 7: Generate a JWT token (if needed for auto-login or later use)
    const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

    // Step 8: Send a response back
    return NextResponse.json(
      { success: true, message: "Account created successfully!", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error in user signup:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
