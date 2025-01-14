/**
 * 검색바 컴포넌트
 * - 검색어 입력 필드
 */
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Search
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter..."
        className="block w-full rounded-md border-gray-300 shadow-sm 
                   focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  );
}
