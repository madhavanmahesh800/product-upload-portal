"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function TrackPage() {
  const { toast } = useToast()
  const [token, setToken] = useState("")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || token.length !== 6) {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid 6-digit token number",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // Simulate API call to fetch order details
    setTimeout(() => {
      setOrderDetails({
        token,
        productName: "Sample Product",
        category: "Electronics",
        status: "Processing",
        timestamp: new Date().toLocaleString(),
        steps: [
          { name: "Order Received", completed: true, date: "2025-03-05" },
          { name: "Processing", completed: true, date: "2025-03-06" },
          { name: "Ready for Pickup", completed: false, date: null },
          { name: "Completed", completed: false, date: null },
        ],
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Track Your Order</h1>

        <Card>
          <CardHeader>
            <CardTitle>Enter Your Token Number</CardTitle>
            <CardDescription>
              Enter the 6-digit token number you received after submitting your product.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Token Number</Label>
                <div className="flex space-x-2">
                  <Input
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter 6-digit token"
                    maxLength={6}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Searching..." : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </form>

            {loading && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}

            {orderDetails && !loading && (
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Order Details</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-sm text-muted-foreground">Token Number:</p>
                    <p className="text-sm font-medium">{orderDetails.token}</p>

                    <p className="text-sm text-muted-foreground">Product:</p>
                    <p className="text-sm font-medium">{orderDetails.productName}</p>

                    <p className="text-sm text-muted-foreground">Category:</p>
                    <p className="text-sm font-medium">{orderDetails.category}</p>

                    <p className="text-sm text-muted-foreground">Status:</p>
                    <p className="text-sm font-medium">{orderDetails.status}</p>

                    <p className="text-sm text-muted-foreground">Submitted on:</p>
                    <p className="text-sm font-medium">{orderDetails.timestamp}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Progress</h3>
                  <div className="space-y-4">
                    {orderDetails.steps.map((step: any, index: number) => (
                      <div key={index} className="flex items-start">
                        <div
                          className={`rounded-full h-6 w-6 flex items-center justify-center mt-0.5 ${
                            step.completed ? "bg-green-500" : "bg-gray-200"
                          }`}
                        >
                          {step.completed ? (
                            <svg
                              className="h-4 w-4 text-white"
                              fill="none"
                              height="24"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              width="24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <span className="text-xs text-gray-500">{index + 1}</span>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${step.completed ? "" : "text-gray-500"}`}>{step.name}</p>
                          {step.date && <p className="text-xs text-gray-500">{step.date}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

