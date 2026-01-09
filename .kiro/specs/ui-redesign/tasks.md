# Implementation Plan: UI Redesign

## Overview

Cloud Font Agent의 UI를 현대적인 사이드바 네비게이션과 그룹화된 폰트 목록으로 재설계합니다. 기존 코드를 점진적으로 개선하면서 새로운 컴포넌트를 추가합니다.

## Tasks

- [x] 1. 프로젝트 구조 및 스타일 시스템 설정

  - 새로운 CSS 변수 및 스타일 가이드 정의
  - 컴포넌트 디렉토리 구조 생성
  - 로그인 페이지 및 메인 애플리케이션 공통 스타일
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1_

- [x] 1.5. 로그인 페이지 구현

  - [x] 1.5.1 LoginPage HTML 구조 및 스타일 작성

    - 중앙 정렬 레이아웃
    - "Kerning City" 타이틀
    - 이메일/비밀번호 입력 필드
    - 로그인 버튼
    - 회원가입/아이디 찾기 링크
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 1.5.2 LoginForm 로직 구현

    - 이메일 형식 검증
    - 로그인 버튼 활성화/비활성화
    - 에러 메시지 표시
    - _Requirements: 10.2, 10.4_

  - [x] 1.5.3 인증 API 연동
    - 로그인 요청 처리
    - 토큰 저장
    - 메인 페이지로 전환
    - _Requirements: 10.1, 10.3, 10.5_

- [ ]\* 1.5.4 LoginPage 속성 기반 테스트

  - **Property 9: Login form validation**
  - **Validates: Requirements 10.4**

- [ ]\* 1.5.5 LoginPage 속성 기반 테스트

  - **Property 10: Authentication state consistency**
  - **Validates: Requirements 10.1**

- [ ]\* 1.5.6 LoginPage 속성 기반 테스트

  - **Property 11: Login error handling**
  - **Validates: Requirements 10.2**

- [ ]\* 1.5.7 LoginPage 단위 테스트

  - 폼 렌더링 테스트
  - 이메일 검증 테스트
  - 로그인 플로우 테스트
  - 에러 처리 테스트
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 10.1, 10.2, 10.4_

- [x] 1.6. OAuth 버튼 준비 (미래 확장)

  - [x] 1.6.1 OAuthButtons 컴포넌트 구조 작성
    - Google, Apple, Naver 버튼 레이아웃
    - 비활성화 상태로 표시 (준비 중)
    - _Requirements: 9.5_

- [x] 2. Header 컴포넌트 구현

  - [x] 2.1 Header HTML 구조 및 스타일 작성
    - macOS 윈도우 컨트롤 버튼 추가
    - "Kerning City" 타이틀 중앙 배치
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]\* 2.2 Header 컴포넌트 단위 테스트

  - 렌더링 테스트
  - 타이틀 표시 테스트
  - _Requirements: 6.1, 6.2_

- [x] 3. Sidebar 컴포넌트 구현

  - [x] 3.1 Sidebar HTML 구조 및 스타일 작성

    - 네비게이션 아이콘 (홈, 메시지, 클라우드) 추가
    - 하단 설정 버튼 추가
    - 활성 상태 스타일 정의
    - _Requirements: 1.1, 1.5_

  - [x] 3.2 Sidebar 네비게이션 로직 구현
    - 클릭 이벤트 핸들러
    - 활성 아이템 상태 관리
    - _Requirements: 1.2, 1.3, 1.4_

- [ ]\* 3.3 Sidebar 컴포넌트 단위 테스트

  - 네비게이션 아이템 렌더링 테스트
  - 클릭 이벤트 테스트
  - 활성 상태 변경 테스트
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 4. SearchBar 컴포넌트 구현

  - [ ] 4.1 SearchBar HTML 구조 및 스타일 작성

    - 검색 아이콘 추가
    - 입력 필드 스타일링
    - _Requirements: 2.1, 2.3_

  - [ ] 4.2 SearchBar 필터링 로직 구현
    - 실시간 검색 이벤트 핸들러
    - 대소문자 무시 검색
    - 한글/영문 지원
    - _Requirements: 2.2, 2.4, 2.5_

- [ ]\* 4.3 SearchBar 속성 기반 테스트

  - **Property 1: Search filtering consistency**
  - **Validates: Requirements 2.2**

- [ ]\* 4.4 SearchBar 단위 테스트

  - 입력 이벤트 테스트
  - 필터링 로직 테스트
  - 빈 검색어 처리 테스트
  - _Requirements: 2.2, 2.4, 2.5_

- [ ] 5. ToggleSwitch 컴포넌트 구현

  - [ ] 5.1 ToggleSwitch HTML 구조 및 스타일 작성

    - 활성/비활성 상태 스타일 (녹색/회색)
    - 애니메이션 효과
    - _Requirements: 4.4_

  - [ ] 5.2 ToggleSwitch 상태 관리 로직 구현
    - 클릭 이벤트 핸들러
    - 상태 변경 콜백
    - 비활성화 상태 처리
    - _Requirements: 4.2, 4.3, 4.5_

- [ ]\* 5.3 ToggleSwitch 속성 기반 테스트

  - **Property 2: Toggle state synchronization**
  - **Validates: Requirements 4.2, 4.3**

- [ ]\* 5.4 ToggleSwitch 속성 기반 테스트

  - **Property 8: Toggle failure state consistency**
  - **Validates: Requirements 4.5**

- [ ]\* 5.5 ToggleSwitch 단위 테스트

  - 상태 변경 테스트
  - 비활성화 상태 테스트
  - 스타일 변경 테스트
  - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [ ] 6. FontItem 컴포넌트 구현

  - [ ] 6.1 FontItem HTML 구조 및 스타일 작성

    - 폰트 이름 및 버전 표시
    - 정보 아이콘 추가
    - ToggleSwitch 통합
    - _Requirements: 5.3_

  - [ ] 6.2 FontItem 이벤트 핸들러 구현
    - 토글 변경 이벤트
    - 정보 버튼 클릭 이벤트
    - _Requirements: 4.2, 4.3, 5.2_

- [ ]\* 6.3 FontItem 단위 테스트

  - 렌더링 테스트
  - 이벤트 핸들러 테스트
  - _Requirements: 5.3, 4.2, 5.2_

- [ ] 7. ProviderGroup 컴포넌트 구현

  - [ ] 7.1 ProviderGroup HTML 구조 및 스타일 작성

    - 제공업체 이름 (한글/영문) 표시
    - 접기/펼치기 아이콘
    - FontItem 목록 컨테이너
    - _Requirements: 3.2, 3.3_

  - [ ] 7.2 ProviderGroup 접기/펼치기 로직 구현
    - 클릭 이벤트 핸들러
    - 애니메이션 효과
    - 상태 저장
    - _Requirements: 3.4, 3.5_

- [ ]\* 7.3 ProviderGroup 속성 기반 테스트

  - **Property 3: Provider grouping completeness**
  - **Validates: Requirements 3.1, 3.2**

- [ ]\* 7.4 ProviderGroup 속성 기반 테스트

  - **Property 4: Collapse state persistence**
  - **Validates: Requirements 3.4, 3.5**

- [ ]\* 7.5 ProviderGroup 단위 테스트

  - 렌더링 테스트
  - 접기/펼치기 테스트
  - FontItem 목록 테스트
  - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [ ] 8. FontInfoModal 컴포넌트 구현

  - [ ] 8.1 FontInfoModal HTML 구조 및 스타일 작성

    - 모달 오버레이
    - 폰트 상세 정보 레이아웃
    - 닫기 버튼
    - _Requirements: 5.2, 5.4_

  - [ ] 8.2 FontInfoModal 표시/숨김 로직 구현
    - show/hide 메서드
    - ESC 키 이벤트 핸들러
    - 외부 클릭 이벤트 핸들러
    - _Requirements: 5.2, 5.5_

- [ ]\* 8.3 FontInfoModal 속성 기반 테스트

  - **Property 6: Modal interaction isolation**
  - **Validates: Requirements 5.5**

- [ ]\* 8.4 FontInfoModal 단위 테스트

  - 렌더링 테스트
  - show/hide 테스트
  - 이벤트 핸들러 테스트
  - _Requirements: 5.2, 5.4, 5.5_

- [ ] 9. FontList 컴포넌트 통합

  - [ ] 9.1 FontList 데이터 구조 설계

    - 폰트 데이터를 제공업체별로 그룹화
    - 검색 필터링 적용
    - _Requirements: 3.1, 2.2_

  - [ ] 9.2 FontList 렌더링 로직 구현
    - ProviderGroup 컴포넌트 생성
    - 검색 결과 업데이트
    - 스크롤 처리
    - _Requirements: 3.1, 2.2, 7.3_

- [ ]\* 9.3 FontList 속성 기반 테스트

  - **Property 5: Search result ordering**
  - **Validates: Requirements 2.2, 3.1**

- [ ]\* 9.4 FontList 통합 테스트

  - 전체 폰트 목록 렌더링 테스트
  - 검색 필터링 통합 테스트
  - 제공업체 그룹화 테스트
  - _Requirements: 3.1, 2.2_

- [ ] 10. 반응형 레이아웃 구현

  - [ ] 10.1 CSS Grid/Flexbox 레이아웃 설정

    - Sidebar 고정 너비
    - MainContent 가변 너비
    - 최소 윈도우 크기 설정
    - _Requirements: 7.1, 7.2, 7.4, 7.5_

  - [ ] 10.2 스크롤 처리 구현
    - 스크롤바 스타일링
    - 헤더 고정
    - _Requirements: 7.3, 6.5_

- [ ]\* 10.3 반응형 레이아웃 속성 기반 테스트

  - **Property 7: Window resize layout preservation**
  - **Validates: Requirements 7.1, 7.2**

- [ ]\* 10.4 반응형 레이아웃 단위 테스트

  - 윈도우 크기 변경 테스트
  - 최소 크기 제약 테스트
  - 스크롤 동작 테스트
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 11. 폰트 등록/해제 로직 통합

  - [ ] 11.1 ToggleSwitch와 FontManager 연결

    - 토글 on → registerFont 호출
    - 토글 off → unregisterFont 호출
    - 에러 처리
    - _Requirements: 4.2, 4.3, 4.5_

  - [ ] 11.2 상태 동기화 구현
    - UI 상태와 시스템 상태 동기화
    - 에러 발생 시 UI 롤백
    - _Requirements: 4.2, 4.3, 4.5_

- [ ]\* 11.3 폰트 등록/해제 통합 테스트

  - 전체 플로우 테스트
  - 에러 시나리오 테스트
  - _Requirements: 4.2, 4.3, 4.5_

- [ ] 12. Checkpoint - 기본 UI 동작 확인

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. 기존 UI 제거 및 새 UI 적용

  - [ ] 13.1 기존 renderer.js 코드 정리

    - 기존 UI 코드 제거
    - 새 컴포넌트 import
    - _Requirements: All_

  - [ ] 13.2 index.html 업데이트
    - 새 레이아웃 구조 적용
    - 필요한 CSS 파일 링크
    - _Requirements: All_

- [ ] 14. 시각적 개선 및 폴리싱

  - [ ] 14.1 호버 효과 추가

    - 버튼 호버 스타일
    - 폰트 아이템 호버 스타일
    - _Requirements: 8.4_

  - [ ] 14.2 애니메이션 추가

    - 모달 페이드 인/아웃
    - 접기/펼치기 애니메이션
    - 토글 스위치 애니메이션
    - _Requirements: 8.3, 8.4_

  - [ ] 14.3 아이콘 추가
    - SVG 아이콘 생성 또는 아이콘 라이브러리 사용
    - 네비게이션 아이콘
    - 정보 아이콘
    - 검색 아이콘
    - _Requirements: 1.1, 2.3, 5.1_

- [ ]\* 14.4 시각적 회귀 테스트

  - 각 컴포넌트 스크린샷 캡처
  - 베이스라인과 비교
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 15. 최종 통합 테스트

  - [ ] 15.1 전체 사용자 플로우 테스트

    - 검색 → 제공업체 선택 → 폰트 토글 → 정보 보기
    - _Requirements: All_

  - [ ] 15.2 엣지 케이스 테스트
    - 빈 폰트 목록
    - 검색 결과 없음
    - 네트워크 오류
    - _Requirements: All_

- [ ] 16. Final checkpoint - 모든 테스트 통과 확인
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
