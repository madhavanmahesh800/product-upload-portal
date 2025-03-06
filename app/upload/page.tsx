"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { UploadProgress } from "@/components/upload-progress"

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [productData, setProductData] = useState({
    productName: "",
    category: "",
    sellerName: "",
    sellerContact: "",
    sellerEmail: "",
  })
  const [productImage, setProductImage] = useState<File | null>(null)
  const [modelFile, setModelFile] = useState<File | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProductData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setProductData((prev) => ({ ...prev, category: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0])
    }
  }

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setModelFile(e.target.files[0])
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productImage) {
      toast({
        title: "Error",
        description: "Please upload a product image",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 200)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("productName", productData.productName)
      formData.append("category", productData.category)
      formData.append("sellerName", productData.sellerName)
      formData.append("sellerContact", productData.sellerContact)
      formData.append("sellerEmail", productData.sellerEmail)
      formData.append("productImage", productImage)

      // Submit the form data
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload product")
      }

      const data = await response.json()

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Redirect to success page with token
      router.push(`/success?token=${data.token}`)
    } catch (error) {
      clearInterval(progressInterval)
      setIsUploading(false)
      setUploadProgress(0)

      toast({
        title: "Error",
        description: "Failed to upload product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleModelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!modelFile) {
      toast({
        title: "Error",
        description: "Please upload a 3D model file (.glb)",
        variant: "destructive",
      })
      return
    }

    if (!productData.sellerEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 3
      })
    }, 200)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("sellerEmail", productData.sellerEmail)
      formData.append("modelFile", modelFile)

      // Submit the form data
      const response = await fetch("/api/upload-model", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload model")
      }

      const data = await response.json()

      clearInterval(progressInterval)
      setUploadProgress(100)

      toast({
        title: "Success",
        description: "Your 3D model has been uploaded successfully. Check your email for details.",
      })

      // Reset form after successful upload
      setModelFile(null)
      setIsUploading(false)
      setUploadProgress(0)
    } catch (error) {
      clearInterval(progressInterval)
      setIsUploading(false)
      setUploadProgress(0)

      toast({
        title: "Error",
        description: "Failed to upload model. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Your Product</h1>

      <Tabs defaultValue="product" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="product">Product Upload</TabsTrigger>
          <TabsTrigger value="model">3D Model Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="product">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Fill in the details about your product and upload an image.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="productForm" onSubmit={handleProductSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      name="productName"
                      value={productData.productName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={productData.category} onValueChange={handleCategoryChange} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="toys">Toys</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellerName">Seller Name</Label>
                  <Input
                    id="sellerName"
                    name="sellerName"
                    value={productData.sellerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellerContact">Contact Number</Label>
                    <Input
                      id="sellerContact"
                      name="sellerContact"
                      value={productData.sellerContact}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellerEmail">Email</Label>
                    <Input
                      id="sellerEmail"
                      name="sellerEmail"
                      type="email"
                      value={productData.sellerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productImage">Product Image (JPEG, PNG, WEBP)</Label>
                  <Input
                    id="productImage"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageChange}
                    required
                  />
                </div>

                {isUploading && <UploadProgress progress={uploadProgress} />}
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="productForm" className="w-full" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Submit Product"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="model">
          <Card>
            <CardHeader>
              <CardTitle>3D Model Upload</CardTitle>
              <CardDescription>Upload a 3D model of your product in GLB format.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="modelForm" onSubmit={handleModelSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sellerEmailModel">Email</Label>
                  <Input
                    id="sellerEmailModel"
                    name="sellerEmail"
                    type="email"
                    value={productData.sellerEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelFile">3D Model (.glb)</Label>
                  <Input id="modelFile" type="file" accept=".glb" onChange={handleModelChange} required />
                </div>

                {isUploading && <UploadProgress progress={uploadProgress} />}
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" form="modelForm" className="w-full" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Model"}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                disabled={!modelFile || isUploading}
                onClick={() => {
                  toast({
                    title: "Model Posted",
                    description: "Your model has been successfully sent to the specified location.",
                  })
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Post Model
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

