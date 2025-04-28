import { NextRequest, NextResponse } from "next/server";
import { FinancialUserModel} from "../../../../models/fianancialUserSchema";
import { dbconnect } from "../../../../dbconfig/dbconnect";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        // Step 1: Get token from cookies
        const tokenCookie = request.cookies.get("token");
        if (!tokenCookie) {
            return NextResponse.json(
                { success: false, message: "Authorization token missing." },
                { status: 401 }
            );
        }

        const token = tokenCookie.value;
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
        const userId = decoded.id;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token." },
                { status: 401 }
            );
        }

        // Step 2: Connect to DB
        await dbconnect();
        console.log("✅ Connected to DB");

        // Step 3: Fetch user info
        const user = await FinancialUserModel.findById(userId).select("-password -transactions"); 
        // ⬆️ Hide sensitive fields if needed (password, transactions, etc.)

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        // Step 4: Return user info
        return NextResponse.json(
            { success: true, message: "User information retrieved successfully.", user },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error in getting user info:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
