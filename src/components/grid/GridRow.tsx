/**
 * 그리드 행 컴포넌트
 * - 사용자 정보 표시
 * - 행 선택 기능
 * - 툴팁 표시
 */
import React, { useState } from "react";
import { Person, PersonKey } from "../../types";
import { Tooltip } from "./Tooltip";

interface GridRowProps {
  person: Person;
  columns: PersonKey[];
  selected: boolean;
  onSelect: (id: number) => void;
  onClick: () => void;
}

export function GridRow({
  person,
  columns,
  selected,
  onSelect,
  onClick,
}: GridRowProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // 마우스 오버시 툴팁 표시 (텍스트가 잘린 경우)
  const handleMouseEnter = (content: string, event: React.MouseEvent) => {
    const cell = event.currentTarget as HTMLDivElement;
    if (cell.scrollWidth > cell.clientWidth) {
      setTooltipContent(content);
      setTooltipPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setShowTooltip(true);
    }
  };

  return (
    <>
      <div
        className={`grid grid-cols-[50px_repeat(6,1fr)] hover:bg-gray-50 cursor-pointer
                  ${selected ? "bg-blue-50" : "bg-white"}`}
        onClick={onClick}
      >
        <div className="p-3 flex items-center justify-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(person.id)}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
        </div>
        {columns.map((column) => (
          <div
            key={column}
            className="p-3 text-sm text-gray-700 truncate"
            onMouseEnter={(e) =>
              handleMouseEnter(String(person[column as keyof Person]), e)
            }
            onMouseLeave={() => setShowTooltip(false)}
          >
            {String(person[column as keyof Person])}
          </div>
        ))}
      </div>
      {showTooltip && (
        <Tooltip
          content={tooltipContent}
          position={tooltipPosition}
          onClose={() => setShowTooltip(false)}
        />
      )}
    </>
  );
}
