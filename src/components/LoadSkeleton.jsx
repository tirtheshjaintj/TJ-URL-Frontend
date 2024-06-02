import React from 'react'

function LoadSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{Array.from({ length: 12 }).map((_,i) => (
        <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md p-4"></div>
      ))}    
</div>
  )
}

export default LoadSkeleton