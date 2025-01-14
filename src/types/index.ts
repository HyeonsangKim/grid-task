export interface Address {
  id: number;
  street: string; // 거리명
  streetName: string; // 도로명
  buildingNumber: string; // 건물번호
  city: string; // 도시
  zipcode: string; // 우편번호
  country: string; // 국가
  country_code: string; // 국가코드
  latitude: number; // 위도
  longitude: number; // 경도
}
export interface Person {
  id: number;
  firstname: string; // 이름
  lastname: string; // 성
  email: string; // 이메일
  phone: string; // 전화번호
  birthday: string; // 생년월일
  gender: string; // 성별
  address: Address; // 주소 정보
  website: string; // 웹사이트
  image: string; // 프로필 이미지
}
export interface ApiRes {
  status: string; // 응답 상태
  code: number; // 응답 코드
  total: number; // 총 데이터 수
  data: Person[]; // 사용자 데이터 배열
}
/**
 * Person 타입에서 address, id, website, image를 제외한 키값들의 유니온 타입
 */
export type PersonKey = keyof Omit<
  Person,
  "address" | "id" | "website" | "image"
>;
