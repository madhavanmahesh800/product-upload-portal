"use client"

import { useState } from "react"
import Image from "next/image"
import { useOrders } from "@/hooks/useOrders"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function OrdersPage() {
  const [email, setEmail] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const { orders, loading, error } = useOrders(searchEmail || undefined)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchEmail(email)
  }

  const handleClearSearch = () => {
    setEmail("")
    setSearchEmail("")
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "outline" as const
      case "rejected":
        return "destructive" as const
      default:
        return "secondary" as const
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
          <CardDescription>Enter an email address to filter orders by seller</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="email"
              placeholder="Seller Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
            {searchEmail && <Button variant="outline" onClick={handleClearSearch}>Clear</Button>}
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">No orders found</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {searchEmail ? `Orders for ${searchEmail}` : "All Orders"}
              <Badge className="ml-2">{orders.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of all product orders</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Image</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.token}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell>
                      {order.sellerName}
                      <div className="text-xs text-gray-500">{order.sellerEmail}</div>
                      <div className="text-xs text-gray-500">{order.sellerContact}</div>
                    </TableCell>
                    <TableCell>{order.category}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <a href={order.imageUrl} target="_blank" rel="noopener noreferrer">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image 
                            src={order.imageUrl} 
                            alt={order.productName}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="64px"
                          />
                        </div>
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 