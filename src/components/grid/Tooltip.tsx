/**
 * 툴팁 컴포넌트
 * - 마우스 오버시 추가 정보 표시
 */
import React from "react";

interface TooltipProps {
  content: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export function Tooltip({ content, position, onClose }: TooltipProps) {
  return (
    <div
      className="fixed z-50 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-2 
                 rounded shadow-lg text-xs max-w-xs"
      style={{
        left: position.x,
        top: position.y + 20,
      }}
      onMouseLeave={onClose}
    >
      {content}
    </div>
  );
}
