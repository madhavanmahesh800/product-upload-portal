"use client"

import { useState } from "react"
import { useModels } from "@/hooks/useModels"

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

export default function ModelsPage() {
  const [email, setEmail] = useState("")
  const [searchEmail, setSearchEmail] = useState("")
  const { models, loading, error } = useModels(searchEmail || undefined)

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
      <h1 className="text-3xl font-bold mb-6">3D Models</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Models</CardTitle>
          <CardDescription>Enter an email address to filter models by seller</CardDescription>
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
        <div className="text-center py-8">Loading models...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : models.length === 0 ? (
        <div className="text-center py-8">No models found</div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {searchEmail ? `Models for ${searchEmail}` : "All Models"}
              <Badge className="ml-2">{models.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of all 3D models</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Seller Email</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.id.slice(0, 8)}...</TableCell>
                    <TableCell>{model.sellerEmail}</TableCell>
                    <TableCell>{model.fileName.split('/').pop()}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(model.status)}>{model.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <a 
                        href={model.modelUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-2 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90"
                      >
                        View Model
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