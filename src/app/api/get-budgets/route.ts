import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "../../../../dbconfig/dbconnect";
import { BudgetModel } from "../../../../models/budgetSchema";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        const tokenCookie = request.cookies.get("token");
        if (!tokenCookie) {
            return NextResponse.json({ success: false, message: "Authorization token is required." });
        }

        const token = tokenCookie.value;
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
        } catch (error) {
            console.error("JWT verification failed:", error);
            return NextResponse.json({ success: false, message: "Invalid or expired token." });
        }

        const userId = decoded.id;
        if (!userId) {
            return NextResponse.json({ success: false, message: "Invalid token." });
        }

        await dbconnect();
        console.log("✅ Connected to DB");

        // ➔ Fetch budgets of the logged-in user
        const budgets = await BudgetModel.find({ user: userId }).sort({ startDate: -1 }); // latest first

        return NextResponse.json({ success: true, budgets });

    } catch (error) {
        console.error("❌ Error in Get Budgets API:", error);
        return NextResponse.json({ success: false, message: "Internal server error." });
    }
}
