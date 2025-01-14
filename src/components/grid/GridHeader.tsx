/**
 * 그리드 헤더 컴포넌트
 * - 컬럼 제목 표시
 * - 정렬 기능
 * - 전체 선택 체크박스
 */
import { PersonKey } from "@/types";

interface GridHeaderProps {
  columns: PersonKey[];
  sortConfig: {
    key: PersonKey | "";
    direction: "asc" | "desc" | null;
  };
  onSort: (key: PersonKey) => void;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}

export function GridHeader({
  columns,
  sortConfig,
  onSort,
  onSelectAll,
  allSelected,
}: GridHeaderProps) {
  return (
    <div className="bg-gray-50 grid grid-cols-[50px_repeat(6,1fr)]">
      {/* 전체 선택 체크박스 */}
      <div className="p-3 flex items-center justify-center">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
        />
      </div>
      {/* 컬럼 헤더 */}
      {columns.map((column) => (
        <div
          key={column}
          onClick={() => onSort(column)}
          className="p-3 text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 
                   flex items-center gap-1 transition-colors duration-150"
        >
          {column.charAt(0).toUpperCase() + column.slice(1)}
          {/* 정렬 방향 표시 */}
          {sortConfig.key === column && (
            <span className="text-blue-500">
              {sortConfig.direction === "asc" ? "↑" : "↓"}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
