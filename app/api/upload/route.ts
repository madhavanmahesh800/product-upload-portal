import { NextResponse } from "next/server"
import { storage, db } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { FirebaseError } from "firebase/app"

// Generate a random 6-digit token
function generateToken() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

interface StorageError extends FirebaseError {
  customData?: {
    serverResponse: string;
  };
  status_?: number;
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

    // Log the file details for debugging
    console.log("File details:", {
      name: productImage.name,
      type: productImage.type,
      size: productImage.size
    })

    // Generate a unique token
    const token = generateToken()

    try {
      // Upload image to Firebase Storage with a more specific path
      const timestamp = Date.now()
      const fileName = `${token}-${timestamp}-${productImage.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const storageRef = ref(storage, `products/${fileName}`)
      
      // Convert File to Uint8Array
      const imageArrayBuffer = await productImage.arrayBuffer()
      const imageBuffer = new Uint8Array(imageArrayBuffer)
      
      console.log("Attempting to upload to path:", `products/${fileName}`)
      
      const uploadResult = await uploadBytes(storageRef, imageBuffer, {
        contentType: productImage.type,
        customMetadata: {
          uploadedBy: sellerEmail,
          originalName: productImage.name
        }
      })
      
      console.log("Upload successful:", uploadResult)

      // Get the download URL
      const imageUrl = await getDownloadURL(uploadResult.ref)
      console.log("Download URL obtained:", imageUrl)

      // Store the product data in Firestore
      const productData = {
        productName,
        category,
        sellerName,
        sellerContact,
        sellerEmail,
        imageUrl,
        token,
        fileName,
        createdAt: serverTimestamp(),
        status: "pending"
      }

      // Add a new document to the "products" collection
      const docRef = await addDoc(collection(db, "products"), productData)
      console.log("Document written with ID:", docRef.id)

      return NextResponse.json({
        success: true,
        token,
        imageUrl,
        message: "Product uploaded successfully",
      })
    } catch (error) {
      const storageError = error as StorageError
      console.error("Storage error details:", {
        code: storageError.code,
        message: storageError.message,
        serverResponse: storageError.customData?.serverResponse,
        status: storageError.status_
      })
      
      throw new Error(`Storage error: ${storageError.message}`)
    }
  } catch (error) {
    const finalError = error as Error
    console.error("Error uploading product:", finalError)
    return NextResponse.json({ 
      error: "Failed to upload product",
      details: finalError.message
    }, { status: 500 })
  }
}

