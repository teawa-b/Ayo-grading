'use client'

import { useRef, ChangeEvent } from 'react'

interface ImageUploadProps {
  label: string
  image: string | null
  onImageChange: (image: string | null) => void
}

export default function ImageUpload({ label, image, onImageChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = () => {
    onImageChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div>
      <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">{label}</p>

      <div
        onClick={handleClick}
        className="group relative rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors cursor-pointer aspect-[4/3] flex items-center justify-center overflow-hidden"
      >
        {image ? (
          <>
            <img
              src={image}
              alt={label}
              className="w-full h-full object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRemove()
              }}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900/80 dark:bg-white/90 text-white dark:text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6">
            <div className="w-10 h-10 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Drop image here</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">or click to browse</p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  )
}
