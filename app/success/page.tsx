"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // Simulate fetching order details
      setTimeout(() => {
        setOrderDetails({
          token,
          productName: "Sample Product",
          status: "Received",
          timestamp: new Date().toLocaleString(),
        })
        setLoading(false)
      }, 1000)
    }
  }, [token])

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Order Received!</CardTitle>
            <CardDescription>Your order has been received. We will contact you shortly.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">Your Token Number</p>
                <p className="text-3xl font-bold">{token}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Product:</p>
                  <p className="text-sm font-medium">{orderDetails.productName}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Status:</p>
                  <p className="text-sm font-medium">{orderDetails.status}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Submitted on:</p>
                  <p className="text-sm font-medium">{orderDetails.timestamp}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">
                  A confirmation email has been sent to your email address with all the details.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/upload">Upload Another Product</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

