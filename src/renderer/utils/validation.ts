/**
 * Validation Utility Functions
 */

/**
 * 이메일 형식 검증
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 검증 (최소 길이)
 */
export function isValidPassword(
  password: string,
  minLength: number = 6
): boolean {
  return password.length >= minLength;
}

/**
 * 빈 문자열 또는 공백만 있는지 확인
 */
export function isEmpty(value: string): boolean {
  return !value || value.trim().length === 0;
}

/**
 * 한글 포함 여부 확인
 */
export function containsKorean(text: string): boolean {
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return koreanRegex.test(text);
}

/**
 * 영문 포함 여부 확인
 */
export function containsEnglish(text: string): boolean {
  const englishRegex = /[a-zA-Z]/;
  return englishRegex.test(text);
}

/**
 * 검색어 정규화 (대소문자 무시, 공백 제거)
 */
export function normalizeSearchQuery(query: string): string {
  return query.toLowerCase().trim();
}

/**
 * 텍스트가 검색어를 포함하는지 확인 (대소문자 무시)
 */
export function matchesSearch(text: string, query: string): boolean {
  if (!query) return true;
  const normalizedText = text.toLowerCase();
  const normalizedQuery = normalizeSearchQuery(query);
  return normalizedText.includes(normalizedQuery);
}
