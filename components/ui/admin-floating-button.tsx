'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminFloatingButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

export function AdminFloatingButton({ onClick, isOpen = false }: AdminFloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300 ease-in-out",
          "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
          "border-2 border-white/20 backdrop-blur-sm",
          isOpen && "rotate-180",
          isHovered && "scale-110 shadow-xl"
        )}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Shield className="h-6 w-6 text-white" />
        )}
      </Button>
      
      {/* Tooltip */}
      <div
        className={cn(
          "absolute bottom-16 right-0 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg",
          "transition-all duration-200 pointer-events-none whitespace-nowrap",
          "before:content-[''] before:absolute before:top-full before:right-4",
          "before:border-4 before:border-transparent before:border-t-gray-900",
          isHovered && !isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        Admin Panel
      </div>
    </div>
  );
}