'use client';

import { Loader2 } from 'lucide-react';

export default function AdminLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4">
        <div className="h-8 w-48 rounded-md bg-blue-800 animate-pulse" />
        <div className="h-4 w-64 rounded-md bg-blue-800 animate-pulse" />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="h-32 rounded-lg bg-blue-800 animate-pulse"
            />
          ))}
        </div>
        
        <div className="mt-8 h-64 w-full rounded-lg bg-blue-800 animate-pulse" />
      </div>
    </div>
  );
}