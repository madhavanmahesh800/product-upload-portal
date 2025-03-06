import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

// Generate a random 6-digit token
function generateToken() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Extract form data
    const productName = formData.get("productName") as string
    const category = formData.get("category") as string
    const sellerName = formData.get("sellerName") as string
    const sellerContact = formData.get("sellerContact") as string
    const sellerEmail = formData.get("sellerEmail") as string
    const productImage = formData.get("productImage") as File

    if (!productImage) {
      return NextResponse.json({ error: "Product image is required" }, { status: 400 })
    }

    // Generate a unique token
    const token = generateToken()

    // Upload image to Vercel Blob
    const blob = await put(`products/${token}-${productImage.name}`, productImage, {
      access: "public",
    })

    // In a real application, you would store the data in Firestore
    // For this example, we'll just return the token and image URL

    // Send email notification (in a real app)
    // await sendEmail({
    //   to: sellerEmail,
    //   subject: "Order Received",
    //   body: `Your order has been received and will be processed soon. Your order number is ${token}. Contact 996557628 for more details.`
    // })

    return NextResponse.json({
      success: true,
      token,
      imageUrl: blob.url,
      message: "Product uploaded successfully",
    })
  } catch (error) {
    console.error("Error uploading product:", error)
    return NextResponse.json({ error: "Failed to upload product" }, { status: 500 })
  }
}

