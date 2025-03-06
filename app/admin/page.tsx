"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setOrders([
        {
          id: "1",
          token: "123456",
          productName: "Wireless Headphones",
          category: "Electronics",
          sellerName: "John Doe",
          sellerEmail: "john@example.com",
          status: "Processing",
          date: "2025-03-05",
        },
        {
          id: "2",
          token: "234567",
          productName: "Coffee Table",
          category: "Furniture",
          sellerName: "Jane Smith",
          sellerEmail: "jane@example.com",
          status: "Received",
          date: "2025-03-06",
        },
        {
          id: "3",
          token: "345678",
          productName: "Leather Jacket",
          category: "Clothing",
          sellerName: "Mike Johnson",
          sellerEmail: "mike@example.com",
          status: "Completed",
          date: "2025-03-04",
        },
      ])

      setModels([
        {
          id: "1",
          fileName: "headphones.glb",
          sellerEmail: "john@example.com",
          fileSize: "2.4 MB",
          status: "Uploaded",
          date: "2025-03-05",
        },
        {
          id: "2",
          fileName: "table.glb",
          sellerEmail: "jane@example.com",
          fileSize: "5.1 MB",
          status: "Posted",
          date: "2025-03-06",
        },
      ])

      setLoading(false)
    }, 1500)
  }, [])

  const filteredOrders = orders.filter(
    (order) =>
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.token.includes(searchQuery) ||
      order.sellerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredModels = models.filter(
    (model) =>
      model.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.sellerEmail.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Posted":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by product name, token, or seller..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Product Orders</TabsTrigger>
          <TabsTrigger value="models">3D Models</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Product Orders</CardTitle>
              <CardDescription>Manage all product submissions and their statuses.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No orders found matching your search.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.token}</TableCell>
                          <TableCell>{order.productName}</TableCell>
                          <TableCell>{order.category}</TableCell>
                          <TableCell>{order.sellerName}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                <DropdownMenuItem>Send Email</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <Card>
            <CardHeader>
              <CardTitle>3D Models</CardTitle>
              <CardDescription>Manage all uploaded 3D models and their statuses.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredModels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No models found matching your search.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Seller Email</TableHead>
                        <TableHead>File Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredModels.map((model) => (
                        <TableRow key={model.id}>
                          <TableCell className="font-medium">{model.fileName}</TableCell>
                          <TableCell>{model.sellerEmail}</TableCell>
                          <TableCell>{model.fileSize}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                          </TableCell>
                          <TableCell>{model.date}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Model</DropdownMenuItem>
                                <DropdownMenuItem>Download</DropdownMenuItem>
                                <DropdownMenuItem>Post Model</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

