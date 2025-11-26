'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'

export default function Home() {
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [targetImage, setTargetImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGradeTransfer = async () => {
    if (!referenceImage || !targetImage) {
      setErrorMessage('Please upload both images first.')
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)
    setResultImage(null)

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referenceImage,
          targetImage,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error ?? 'Color transfer failed')
      }

      setResultImage(data.outputUrl)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong'
      setErrorMessage(message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-neutral-950/95">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-2 border-neutral-200 dark:border-neutral-800 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-neutral-900 dark:border-t-white rounded-full animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-neutral-900 dark:text-white text-sm font-medium tracking-tight">Processing</p>
              <p className="text-neutral-500 text-xs mt-1">Applying color grade...</p>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* Nav */}
        <nav className="border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">Grade</span>
              <span className="text-xs text-neutral-400">Color Transfer Tool</span>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Header */}
          <div className="max-w-2xl mb-10 sm:mb-14">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              Transfer color grading
            </h1>
            <p className="mt-2 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
              Match the look and feel of any reference image
            </p>
          </div>

          {/* Image Upload Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <ImageUpload
              label="Reference"
              image={referenceImage}
              onImageChange={setReferenceImage}
            />

            <ImageUpload
              label="Target"
              image={targetImage}
              onImageChange={setTargetImage}
            />
          </div>

          {/* Action Area */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <button
              onClick={handleGradeTransfer}
              disabled={!referenceImage || !targetImage || isProcessing}
              className="h-11 px-6 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Apply Grade
            </button>

            {errorMessage && (
              <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
            )}
          </div>

          {/* Result Section */}
          {resultImage && (
            <div className="mt-12 sm:mt-16 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Output</p>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mt-1">Result</h2>
                </div>
                <a
                  href={resultImage}
                  download="graded-image.png"
                  className="h-9 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download
                </a>
              </div>
              <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <img
                  src={resultImage}
                  alt="Graded result"
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
