import { NextRequest, NextResponse } from "next/server";
import { TransactionModel } from "../../../../models/transactionSchema";
import { dbconnect } from "../../../../dbconfig/dbconnect";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        // Step 1: Extract token from cookies
        const tokenCookie = request.cookies.get("token");
        if (!tokenCookie) {
            return NextResponse.json(
                { success: false, message: "Authorization token is required." }
            );
        }

        const token = tokenCookie.value;  // Extract token value

        // Step 2: Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
        } catch (error) {
            console.log('error - ',error)
            return NextResponse.json(
                { success: false, message: "Invalid or expired token." }
            );
        }
        const userId = decoded.id;  // Extract user ID

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token." }
            );
        }

        // Step 3: Connect to the database
        try {
            await dbconnect();
            console.log("✅ Connected to DB");
        } catch (dbError) {
            console.error("❌ Error connecting to DB:", dbError);
            return NextResponse.json(
                { success: false, message: "Database connection failed." }
            );
        }

        // Step 4: Retrieve transactions for the user
        let transactions;
        try {
            transactions = await TransactionModel.find({ user: userId }).sort({ date: -1 });
        } catch (dbError) {
            console.error("❌ Error querying transactions:", dbError);
            return NextResponse.json(
                { success: false, message: "Error retrieving transactions." }
            );
        }

        if (transactions.length === 0) {
            return NextResponse.json(
                { success: false, message: "No transactions found." }
            );
        }

        // Step 5: Return the transactions
        return NextResponse.json(
            { success: true, message: "Transactions retrieved successfully.", transactions }
        );
    } catch (error) {
        console.error("❌ Error in retrieving transactions:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error." }
        );
    }
}
