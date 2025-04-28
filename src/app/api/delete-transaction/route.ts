import { NextRequest, NextResponse } from "next/server";
import { TransactionModel } from "../../../../models/transactionSchema";  // Import transaction schema
import { FinancialUserModel } from "../../../../models/fianancialUserSchema"; // Import user schema
import { dbconnect } from "../../../../dbconfig/dbconnect";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function DELETE(request: NextRequest) {
    try {
        // Step 1: Extract transaction ID from the request URL
        const { transactionId } = await request.json();  // Assuming the transactionId is passed as a query parameter

        // Step 2: Validate transaction ID
        if (!transactionId) {
            return NextResponse.json(
                { success: false, message: "Transaction ID is required." },
                { status: 400 }
            );
        }


        const tokenCookie = request.cookies.get("token");  // Get token from cookies
                if (!tokenCookie) {
                    return NextResponse.json(
                        { success: false, message: "Authorization token is required." },
                        { status: 401 }
                    );
                }
        
                const token = tokenCookie.value;  // Extract the value from the RequestCookie object
        
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload; // Typecast as JwtPayload

        const userId = decoded.id as JwtPayload;  // Extract user ID from decoded token

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token." },
                { status: 401 }
            );
        }

        // Step 4: Connect to the database
        await dbconnect();
        console.log("✅ Connected to DB");

        // Step 5: Find the transaction by ID
        const transaction = await TransactionModel.findById(transactionId);

        // Step 6: Check if the transaction exists and belongs to the current user
        if (!transaction) {
            return NextResponse.json(
                { success: false, message: "Transaction not found." },
                { status: 404 }
            );
        }

        if (transaction.user.toString() !== userId) {
            return NextResponse.json(
                { success: false, message: "You are not authorized to delete this transaction." },
                { status: 403 }
            );
        }

        // Step 7: Delete the transaction
        await TransactionModel.findByIdAndDelete(transactionId);

        console.log("✅ Transaction deleted:", transaction);

        // Step 8: Remove the transaction from the user's transactions array
        await FinancialUserModel.findByIdAndUpdate(userId, {
            $pull: { transactions: transactionId },
        });

        console.log("✅ Transaction removed from user's transactions array");

        // Step 9: Return success message
        return NextResponse.json(
            { success: true, message: "Transaction deleted successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error in deleting transaction:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }
}
