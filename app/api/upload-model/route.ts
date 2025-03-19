import { NextResponse } from "next/server"
import { storage, db } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { FirebaseError } from "firebase/app"

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
    const sellerEmail = formData.get("sellerEmail") as string
    const modelFile = formData.get("modelFile") as File

    if (!modelFile) {
      return NextResponse.json({ error: "Model file is required" }, { status: 400 })
    }

    if (!sellerEmail) {
      return NextResponse.json({ error: "Seller email is required" }, { status: 400 })
    }

    // Log the file details for debugging
    console.log("Model file details:", {
      name: modelFile.name,
      type: modelFile.type,
      size: modelFile.size
    })

    try {
      // Upload model to Firebase Storage with a more specific path
      const timestamp = Date.now()
      const fileName = `models/${timestamp}-${modelFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const storageRef = ref(storage, fileName)
      
      // Convert File to Uint8Array
      const modelArrayBuffer = await modelFile.arrayBuffer()
      const modelBuffer = new Uint8Array(modelArrayBuffer)
      
      console.log("Attempting to upload model to path:", fileName)
      
      const uploadResult = await uploadBytes(storageRef, modelBuffer, {
        contentType: modelFile.type,
        customMetadata: {
          uploadedBy: sellerEmail,
          originalName: modelFile.name
        }
      })
      
      console.log("Model upload successful:", uploadResult)

      // Get the download URL
      const modelUrl = await getDownloadURL(uploadResult.ref)
      console.log("Model download URL obtained:", modelUrl)

      // Store the model data in Firestore
      const modelData = {
        sellerEmail,
        modelUrl,
        fileName,
        originalName: modelFile.name,
        fileSize: modelFile.size,
        uploadDate: serverTimestamp(),
        status: "pending"
      }

      // Add a new document to the "models" collection
      const docRef = await addDoc(collection(db, "models"), modelData)
      console.log("Model document written with ID:", docRef.id)

      return NextResponse.json({
        success: true,
        modelUrl,
        message: "Model uploaded successfully",
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
    console.error("Error uploading model:", finalError)
    return NextResponse.json({ 
      error: "Failed to upload model",
      details: finalError.message
    }, { status: 500 })
  }
}

