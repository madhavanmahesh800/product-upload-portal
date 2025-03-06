interface UploadProgressProps {
  progress: number
}

export function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span>Uploading...</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

