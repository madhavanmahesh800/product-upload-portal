import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Extract form data
    const sellerEmail = formData.get("sellerEmail") as string
    const modelFile = formData.get("modelFile") as File

    if (!modelFile) {
      return NextResponse.json({ error: "Model file is required" }, { status: 400 })
    }

    if (!sellerEmail) {
      return NextResponse.json({ error: "Seller email is required" }, { status: 400 })
    }

    // Upload model to Vercel Blob
    const blob = await put(`models/${Date.now()}-${modelFile.name}`, modelFile, {
      access: "public",
    })

    // In a real application, you would store the data in Firestore
    // For this example, we'll just return the model URL

    // Send email notification (in a real app)
    // await sendEmail({
    //   to: sellerEmail,
    //   subject: "3D Model Uploaded",
    //   body: `Your 3D model has been uploaded successfully. View your model here: ${blob.url}`
    // })

    return NextResponse.json({
      success: true,
      modelUrl: blob.url,
      message: "Model uploaded successfully",
    })
  } catch (error) {
    console.error("Error uploading model:", error)
    return NextResponse.json({ error: "Failed to upload model" }, { status: 500 })
  }
}

