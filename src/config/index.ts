/**
 * API 관련 설정
 * - BASE_URL: API 서버 기본 주소
 * - ENDPOINTS: API 엔드포인트
 */
export const API_CONFIG = {
  BASE_URL: "https://fakerapi.it/api/v2",
  ENDPOINTS: {
    PERSONS: "/persons",
  },
} as const;

/**
 * 그리드 관련 설정
 * - INITIAL_LOAD_SIZE: 첫 로드시 가져올 데이터 수
 * - BATCH_SIZE: 스크롤시 추가로 가져올 데이터 수
 * - DEFAULT_QUERY: API 요청시 기본 쿼리 파라미터
 */
export const GRID_CONFIG = {
  INITIAL_LOAD_SIZE: 100,
  BATCH_SIZE: 20,
  DEFAULT_QUERY: {
    gender: "female",
    birthday_start: "2005-01-01",
  },
} as const;

/**
 * 검색 관련 설정
 * - FIELDS: 검색 가능한 필드 목록과 표시 이름
 */
export const SEARCH_CONFIG = {
  FIELDS: {
    firstname: "First Name",
    lastname: "Last Name",
    email: "Email",
    phone: "Phone",
    birthday: "Birthday",
    gender: "Gender",
  },
} as const;
