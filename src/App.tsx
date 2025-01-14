/**
 * 메인 애플리케이션 컴포넌트
 * - 사용자 데이터를 관리하고 표시하는 그리드 시스템 구현
 * - 무한 스크롤, 검색, 정렬 기능 제공
 */
import React, { useState, useCallback, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { Grid } from "./components/grid/Grid";
import { ApiRes, Person, PersonKey } from "./types";
import { API_CONFIG, GRID_CONFIG, SEARCH_CONFIG } from "./config";

const { INITIAL_LOAD_SIZE, BATCH_SIZE, DEFAULT_QUERY } = GRID_CONFIG;
const { BASE_URL, ENDPOINTS } = API_CONFIG;

const buildUrl = (quantity: number) => {
  const params = new URLSearchParams({
    _quantity: quantity.toString(),
    _gender: DEFAULT_QUERY.gender,
    _birthday_start: DEFAULT_QUERY.birthday_start,
  });

  return `${BASE_URL}${ENDPOINTS.PERSONS}?${params}`;
};

const App: React.FC = () => {
  const [data, setData] = useState<Person[]>([]); // 사용자 데이터 배열
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [searchField, setSearchField] = useState<PersonKey | "all">("all"); // 검색 필드
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 초기 로딩 상태
  const [sortConfig, setSortConfig] = useState<{
    key: PersonKey | "";
    direction: "asc" | "desc" | null;
  }>({ key: "", direction: null }); // 정렬 설정

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const response = await fetch(buildUrl(INITIAL_LOAD_SIZE));
        const result: ApiRes = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadInitialData();
  }, []);

  /**
   * 추가 데이터 로드 함수
   * - 무한 스크롤시 호출되어 새로운 데이터를 가져옴
   * - 새 데이터에 고유 ID 부여하고 기존 데이터와 병합
   */
  const loadMore = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(buildUrl(BATCH_SIZE));
      const result: ApiRes = await response.json();

      // 새로운 데이터에 고유한 ID 부여
      const newData = result.data.map((person, index) => ({
        ...person,
        id: Date.now() + index, // 현재 시간 + 인덱스로 고유 ID 생성
      }));

      setData((prevData) => {
        const combinedData = [...prevData, ...newData];
        // 정렬이 적용된 상태면 새로운 데이터도 정렬
        if (sortConfig.key && sortConfig.direction) {
          return sortData(
            combinedData,
            sortConfig.key as PersonKey,
            sortConfig.direction
          );
        }
        return combinedData;
      });
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, sortConfig]);

  /**
   * 데이터 정렬 함수
   */
  const sortData = (
    items: Person[],
    key: PersonKey,
    direction: "asc" | "desc"
  ) => {
    return [...items].sort((a, b) => {
      const aValue = String(a[key]).toLowerCase();
      const bValue = String(b[key]).toLowerCase();
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  /**
   * 정렬 상태 변경 핸들러
   * - 컬럼 헤더 클릭시 호출
   * - 같은 컬럼 재클릭시 오름차순/내림차순 토글
   */
  const handleSort = useCallback((key: PersonKey) => {
    setSortConfig((prev) => {
      const newDirection =
        prev.key === key ? (prev.direction === "asc" ? "desc" : "asc") : "asc";

      setData((prevData) => sortData(prevData, key, newDirection));

      return {
        key,
        direction: newDirection,
      };
    });
  }, []);

  // 초기 로딩 화면
  if (loading && isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
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
          <span className="text-gray-600">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            User List
          </h1>
          {/* 검색 필드 선택 및 검색바 */}
          <div className="flex gap-4 items-end">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Field
              </label>
              <select
                value={searchField}
                onChange={(e) =>
                  setSearchField(e.target.value as PersonKey | "all")
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {Object.entries(SEARCH_CONFIG.FIELDS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </div>
          </div>
        </div>
        {/* 데이터 그리드 */}
        <Grid
          data={data}
          onLoadMore={loadMore}
          loading={loading}
          searchTerm={searchTerm}
          searchField={searchField}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export default App;
