import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    // 🔹 Remove the token cookie by setting it to empty and expired
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0), // Set cookie expiry to past date to delete
      path: "/", 
    });

    console.log("✅ User logged out successfully");

    return response;
  } catch (error) {
    console.error("❌ Error during logout:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during logout" },
      { status: 500 }
    );
  }
}
