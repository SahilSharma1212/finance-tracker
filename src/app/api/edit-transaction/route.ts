import { NextRequest, NextResponse } from "next/server";
import { TransactionModel } from "../../../../models/transactionSchema"; // Import transaction schema
import { dbconnect } from "../../../../dbconfig/dbconnect";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function PUT(request: NextRequest) {
  try {
    // Step 1: Extract data from request body
    const { transactionId, amount, date, description, category } =
      await request.json();

    // Step 2: Validate input data
    if (!transactionId || !amount || !date || !description || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Step 3: Extract the user ID from the JWT token
    const tokenCookie = request.cookies.get("token"); // Get token from cookies
    if (!tokenCookie) {
      return NextResponse.json(
        { success: false, message: "Authorization token is required." },
        { status: 401 }
      );
    }

    const token = tokenCookie.value; // Extract the value from the RequestCookie object

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload; // Typecast as JwtPayload
    const userId = decoded.id; // Extract user ID from decoded token

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid token." },
        { status: 401 }
      );
    }

    // Step 4: Connect to the database
    await dbconnect();
    console.log("✅ Connected to DB");

    // Step 5: Find the transaction by ID and check if the user is authorized to modify it
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found." },
        { status: 404 }
      );
    }

    if (transaction.user.toString() !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to edit this transaction.",
        },
        { status: 403 }
      );
    }

    // Step 6: Update the transaction
    transaction.amount = amount;
    transaction.date = date;
    transaction.description = description;
    transaction.category = category;
    transaction.updatedAt = Date.now(); // Set updatedAt field

    // Save the updated transaction
    const updatedTransaction = await transaction.save();

    console.log("✅ Transaction updated:", updatedTransaction);

    // Step 7: Return success message
    return NextResponse.json(
      {
        success: true,
        message: "Transaction updated successfully.",
        transaction: updatedTransaction,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in updating transaction:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
