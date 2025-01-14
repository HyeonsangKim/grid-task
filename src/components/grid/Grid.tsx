/**
 * 데이터 그리드 컴포넌트
 * - 사용자 데이터를 테이블 형태로 표시
 * - 정렬, 검색, 무한 스크롤, 행 확장 기능
 */
import React, { useState, useRef, useCallback, useMemo } from "react";
import { Person, PersonKey } from "../../types";
import { GridHeader } from "./GridHeader";
import { GridRow } from "./GridRow";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

interface GridProps {
  data: Person[]; // 표시할 데이터 배열
  onLoadMore: () => void; // 추가 데이터 로드 함수
  loading: boolean; // 로딩 상태
  searchTerm: string; // 검색어
  searchField: PersonKey | "all"; // 검색 필드
  sortConfig: {
    // 정렬 설정
    key: PersonKey | "";
    direction: "asc" | "desc" | null;
  };
  onSort: (key: PersonKey) => void; // 정렬 핸들러
}

export function Grid({
  data,
  onLoadMore,
  loading,
  searchTerm,
  searchField,
  sortConfig,
  onSort,
}: GridProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set()); // 선택된 행
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set()); // 확장된 행
  const observerRef = useRef<HTMLDivElement>(null); // 무한 스크롤 관찰 대상

  const columns: PersonKey[] = [
    "firstname",
    "lastname",
    "email",
    "phone",
    "birthday",
    "gender",
  ];

  /**
   * 검색 필터링된 데이터
   * - 검색어와 검색 필드에 따라 데이터 필터링
   * - 전체 필드 검색 또는 특정 필드 검색 지원
   */
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return data;

    return data.filter((person) => {
      if (searchField === "all") {
        const searchableValues = [
          person.firstname,
          person.lastname,
          person.email,
          person.phone,
          person.birthday,
          person.gender,
          person.address.street,
          person.address.city,
          person.address.country,
        ];

        // 어떤 필드든 검색어로 시작하는 값이 있으면 true
        return searchableValues.some((value) =>
          String(value).toLowerCase().startsWith(term)
        );
      }

      // 특정 필드가 검색어로 시작하면 true
      return String(person[searchField]).toLowerCase().startsWith(term);
    });
  }, [data, searchTerm, searchField]);

  // 무한 스크롤 설정
  useInfiniteScroll({
    targetRef: observerRef,
    onIntersect: () => {
      // 검색중에는 추가 데이터를 로드하지 않음
      if (!searchTerm.trim()) {
        onLoadMore();
      }
    },
  });

  /**
   * 행 선택 핸들러
   * - 체크박스 클릭시 행 선택/해제
   */
  const handleRowSelect = useCallback((id: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  /**
   * 전체 선택 핸들러
   * - 헤더 체크박스 클릭시 전체 행 선택/해제
   */
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allIds = filteredData.map((person) => person.id);
        setSelectedRows(new Set(allIds));
      } else {
        setSelectedRows(new Set());
      }
    },
    [filteredData]
  );

  /**
   * 행 클릭 핸들러
   * - 행 클릭시 상세 정보 토글
   */
  const handleRowClick = useCallback((id: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="min-w-full divide-y divide-gray-200">
        {/* 그리드 헤더 */}
        <GridHeader
          columns={columns}
          sortConfig={sortConfig}
          onSort={onSort}
          onSelectAll={handleSelectAll}
          allSelected={
            filteredData.length > 0 &&
            filteredData.every((person) => selectedRows.has(person.id))
          }
        />
        <div className="divide-y divide-gray-200">
          {filteredData.map((person) => (
            <React.Fragment key={person.id}>
              {/* 기본 행 정보 */}
              <GridRow
                person={person}
                columns={columns}
                selected={selectedRows.has(person.id)}
                onSelect={handleRowSelect}
                onClick={() => handleRowClick(person.id)}
              />
              {/* 확장된 행 상세 정보 */}
              {expandedRows.has(person.id) && (
                <div className="bg-blue-50 px-4 py-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pl-[50px]">
                    <div>
                      <div className="text-xs font-medium text-gray-500">
                        Street
                      </div>
                      <div className="text-sm text-gray-900">
                        {person.address.street}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">
                        City
                      </div>
                      <div className="text-sm text-gray-900">
                        {person.address.city}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">
                        Zipcode
                      </div>
                      <div className="text-sm text-gray-900">
                        {person.address.zipcode}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">
                        Country
                      </div>
                      <div className="text-sm text-gray-900">
                        {person.address.country}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
          <div
            ref={observerRef}
            className="h-16 flex items-center justify-center border-t border-gray-200"
          >
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading more...
              </div>
            )}
            {!loading && searchTerm && (
              <div className="text-sm text-gray-500">
                Showing {filteredData.length} results
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
