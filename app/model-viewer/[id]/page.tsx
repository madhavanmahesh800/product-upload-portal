"use client"

import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
}

export default function ModelViewerPage({ params }: { params: { id: string } }) {
  const [modelUrl, setModelUrl] = useState<string>("/assets/3d/duck.glb")
  const [loading, setLoading] = useState(true)
  const [modelDetails, setModelDetails] = useState<any>(null)

  useEffect(() => {
    // In a real app, fetch the model URL from the database using the ID
    // For this example, we'll use the sample duck model
    setTimeout(() => {
      setModelDetails({
        id: params.id,
        name: "Sample 3D Model",
        uploadedBy: "john@example.com",
        uploadDate: "2025-03-06",
      })
      setLoading(false)
    }, 1000)
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[500px]">
            <CardContent className="p-0 h-full">
              <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Model url={modelUrl} />
                <OrbitControls />
              </Canvas>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Model Details</CardTitle>
              <CardDescription>Information about the 3D model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Model Name</h3>
                  <p>{modelDetails.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Uploaded By</h3>
                  <p>{modelDetails.uploadedBy}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Upload Date</h3>
                  <p>{modelDetails.uploadDate}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full">Download Model</Button>
              <Button variant="outline" className="w-full">
                Post Model
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

