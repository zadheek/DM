import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function POST(request) {
  try {
    const data = await request.json()
    const { name, email, password, phone, address } = data

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Create new user (password is already hashed from client)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Already hashed
        phone: phone || null,
        address: address || null,
        role: "USER", // Default role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
