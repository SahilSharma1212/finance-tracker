import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "../../../../dbconfig/dbconnect";
import { FinancialUserModel } from "../../../../models/fianancialUserSchema";
import { BudgetModel } from "../../../../models/budgetSchema"; // naya import
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const { timeframe, categories } = await request.json();

        if (!timeframe || !categories || !Array.isArray(categories)) {
            return NextResponse.json({ success: false, message: "Missing required fields." });
        }

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

        // ➔ Step 1: Create new Budget document
        const newBudget = new BudgetModel({
            user: userId,
            timeframe,
            startDate: new Date(), // abhi ke time
            categories,
        });

        const savedBudget = await newBudget.save();
        console.log("✅ Budget saved:", savedBudget);

        // ➔ Step 2: Push Budget _id into User's budgets array
        await FinancialUserModel.findByIdAndUpdate(userId, {
            $push: { budgets: savedBudget._id },
        });

        console.log("✅ Budget ID added to User");

        return NextResponse.json({ success: true, message: "Budget created successfully", budget: savedBudget });

    } catch (error) {
        console.error("❌ Error in Create Budget API:", error);
        return NextResponse.json({ success: false, message: "Internal server error." });
    }
}
