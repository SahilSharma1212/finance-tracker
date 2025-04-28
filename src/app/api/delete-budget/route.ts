import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "../../../../dbconfig/dbconnect";
import { FinancialUserModel } from "../../../../models/fianancialUserSchema";
import { BudgetModel } from "../../../../models/budgetSchema"; // import
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const { budgetId } = await request.json();

        if (!budgetId) {
            return NextResponse.json({ success: false, message: "Budget ID is required." });
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

        // ➔ Step 1: Delete Budget Document
        await BudgetModel.findByIdAndDelete(budgetId);
        console.log("✅ Budget document deleted");

        // ➔ Step 2: Remove BudgetId from User's budgets array
        await FinancialUserModel.findByIdAndUpdate(userId, {
            $pull: { budgets: budgetId },
        });

        console.log("✅ Budget ID removed from User");

        return NextResponse.json({ success: true, message: "Budget deleted successfully" });

    } catch (error) {
        console.error("❌ Error in Delete Budget API:", error);
        return NextResponse.json({ success: false, message: "Internal server error." });
    }
}
