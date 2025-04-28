import { NextRequest, NextResponse } from "next/server";
import { FinancialUserModel } from "../../../../models/fianancialUserSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbconnect } from "../../../../dbconfig/dbconnect";

export async function POST(request: NextRequest) {
    try {
        const { identifier, password } = await request.json();

        // 🔹 Check if both identifier and password are provided
        if (!identifier || !password) {
            return NextResponse.json(
                { success: false, message: "Identifier (email/username) and password are required." },
                { status: 400 }
            );
        }

        await dbconnect();
        console.log("✅ Connected to DB");

        // 🔹 Find user by email OR username
        const user = await FinancialUserModel.findOne({
            $or: [{ email: identifier }, { username: identifier }],
        });

        console.log("✅ User found:", user);

        // 🔹 Check if user does not exist
        if (!user) {
            return NextResponse.json(
                { success: false, message: "No such user found" },
                { status: 401 }
            );
        }

        // 🔹 Compare password with stored hash
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { success: false, message: "Invalid password." },
                { status: 401 }
            );
        }

        // 🔹 Create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        // 🔹 Create JWT token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

        // 🔹 Set token in HTTP-only cookie
        const response = NextResponse.json(
            { success: true, message: "Login successful" , user:user}
        );

        // 🔹 Set the token cookie
        response.cookies.set("token", token, {
            httpOnly: true,  // Prevent access via JavaScript (XSS protection)
            secure: process.env.NODE_ENV === "production",  // Use secure cookies in production
            sameSite: "strict",  // CSRF protection
            path: "/", // Cookie is valid for the entire app
            maxAge: 24 * 60 * 60 * 1000, // Token expires in 1 day (24 hours)
        });

        console.log('✅ JWT Token:', token);
        return response;
        
    } catch (error) {
        console.error("❌ Error in sign-in:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
