import { NextRequest, NextResponse } from "next/server";
import { TransactionModel } from "../../../../models/transactionSchema";  // Import transaction schema
import { FinancialUserModel } from "../../../../models/fianancialUserSchema"; // Import user schema
import { dbconnect } from "../../../../dbconfig/dbconnect";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        // Step 1: Extract data from request body
        const { amount, date, description, category } = await request.json();

        // Step 2: Validate input data
        if (!amount || !date || !description || !category) {
            return NextResponse.json(
                { success: false, message: "Missing required fields. Please check your input." }
            );
        }

        // Step 3: Extract the user ID from the JWT token stored in the cookies
        const tokenCookie = request.cookies.get("token");  // Get token from cookies

        if (!tokenCookie) {
            return NextResponse.json(
                { success: false, message: "Authorization token is required." }
            );
        }

        const token = tokenCookie.value;  // Extract the value from the RequestCookie object

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload; // Typecast as JwtPayload
        } catch (error) {
            console.error("JWT verification failed:", error);
            return NextResponse.json({ success: false, message: "Invalid or expired token." });
        }

        const userId = decoded.id;  // Extract user ID from decoded token

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token. User ID not found." }
            );
        }

        // Step 4: Connect to the database
        try {
            await dbconnect();
            console.log("✅ Connected to DB");
        } catch (dbError) {
            console.error("❌ DB connection error:", dbError);
            return NextResponse.json({ success: false, message: "Database connection failed." });
        }

        // Step 5: Create the new transaction
        const newTransaction = new TransactionModel({
            amount,
            date,
            description,
            category,
            user: userId,  // Referencing the user ID
        });

        // Step 6: Save the transaction to the database
        let savedTransaction;
        try {
            savedTransaction = await newTransaction.save();
            console.log("✅ Transaction saved:", savedTransaction);
        } catch (saveError) {
            console.error("❌ Error saving transaction:", saveError);
            return NextResponse.json({ success: false, message: "Error saving the transaction. Please try again later." });
        }

        if (!savedTransaction || !savedTransaction._id) {
            return NextResponse.json(
                { success: false, message: "Transaction creation failed. Could not save transaction." }
            );
        }

        // Step 7: Update the user's transactions array
        try {
            await FinancialUserModel.findByIdAndUpdate(userId, {
                $push: { transactions: savedTransaction._id },
            });
            console.log("✅ Transaction added to user's transactions array");
        } catch (updateError) {
            console.error("❌ Error updating user with transaction ID:", updateError);
            return NextResponse.json({ success: false, message: "Error updating user data. Please try again." });
        }

        // Step 8: Return success message
        return NextResponse.json(
            { success: true, message: "Transaction created successfully.", transaction: savedTransaction }
        );
    } catch (error) {
        console.log("❌ Error in creating transaction:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error. Please try again later." }
        );
    }
}
