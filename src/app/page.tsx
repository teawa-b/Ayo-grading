'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'

export default function Home() {
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [newImage, setNewImage] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Image Grading Tool
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUpload
            label="Reference Image"
            image={referenceImage}
            onImageChange={setReferenceImage}
          />
          
          <ImageUpload
            label="New Image Grade"
            image={newImage}
            onImageChange={setNewImage}
          />
        </div>
      </div>
    </main>
  )
}
