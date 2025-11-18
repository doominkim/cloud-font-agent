# Implementation Plan - MVP

## 목표: 위젯에서 폰트 목록 조회 → 동기화 버튼 → 포토샵/일러스트 사용 검증

- [ ] 1. 프로젝트 초기 설정

  - Electron + TypeScript 프로젝트 초기화
  - 기본 의존성 설치 (electron, typescript, node-addon-api, node-gyp)
  - 디렉토리 구조 생성 (src/main, src/renderer, native)
  - package.json 스크립트 설정
  - _Requirements: 6.1, 6.2_

- [-] 2. Native Module - 폰트 등록/해제만

  - [x] 2.1 Objective-C++ 브릿지 설정

    - binding.gyp 작성
    - CoreText, Foundation 프레임워크 링크
    - node-addon-api 설정
    - _Requirements: 6.2, 6.5_

  - [x] 2.2 폰트 등록/해제 함수 구현
    - RegisterFont: CTFontManagerRegisterFontsForURL (kCTFontManagerScopeProcess)
    - UnregisterFont: CTFontManagerUnregisterFontsForURL
    - UnregisterAllFonts: 모든 등록된 폰트 해제
    - 에러 처리 및 Node.js 반환값 변환
    - _Requirements: 2.2, 3.1, 3.2_

- [ ] 3. Electron Main - 핵심 로직

  - [x] 3.1 위젯 창 설정

    - BrowserWindow 생성 (400x600, alwaysOnTop: true)
    - Preload 스크립트 설정
    - before-quit 이벤트 핸들러
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 3.2 Mock API Client 구현

    - fetchPurchasedFonts: 하드코딩된 폰트 목록 반환
    - 3개 샘플 폰트 (Noto Sans KR, Roboto, Open Sans)
    - 공개 GitHub URL 사용
    - _Requirements: 1.1, 1.2, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 3.3 FontManager 구현

    - registerFont: Native Module 호출 + 상태 관리
    - getRegisteredFonts: 등록된 폰트 목록 반환
    - cleanup: 모든 폰트 해제 + 파일 삭제
    - Font Cache Directory 생성 (~/.cloud-font-agent/.cache/)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 7.1, 7.2, 7.3_

  - [x] 3.4 SyncManager 구현

    - syncAllFonts: 순차적으로 다운로드 + 등록
    - 다운로드: axios 또는 https 모듈 사용
    - 진행률 계산 및 Renderer에 이벤트 전송
    - 부분 실패 처리 (일부 성공해도 계속 진행)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 3.5 IPC 핸들러 구현
    - fonts:fetch (Mock API 호출)
    - fonts:registered (등록된 폰트 목록)
    - fonts:sync (동기화 시작)
    - sync:progress 이벤트 발생
    - _Requirements: 1.1, 6.1_

- [ ] 4. Renderer - 위젯 UI

  - [x] 4.1 HTML/CSS 작성

    - 헤더 (제목 + 동기화 버튼)
    - 폰트 목록 (이름, 상태, 파일 크기)
    - 진행률 바
    - 간단한 스타일링
    - _Requirements: 1.2, 1.3, 5.1, 5.2, 5.3_

  - [x] 4.2 Preload 스크립트

    - contextBridge로 IPC API 노출
    - fetchFonts, getRegisteredFonts, syncFonts
    - onSyncProgress 이벤트 리스너
    - _Requirements: 6.1_

  - [x] 4.3 Renderer JavaScript
    - 초기 로드 시 폰트 목록 조회
    - 폰트 목록 렌더링 (동기화 상태 표시)
    - 동기화 버튼 클릭 핸들러
    - 진행률 업데이트 UI
    - _Requirements: 1.2, 1.3, 2.4, 2.5, 3.3_

- [-] 5. 앱 생명주기 관리

  - before-quit에서 FontManager.cleanup() 호출
  - Font Cache Directory 초기화
  - 모든 폰트 해제 및 파일 삭제
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 6. 수동 테스트
  - 앱 실행 → 폰트 목록 표시 확인
  - 동기화 버튼 → 다운로드 진행률 확인
  - 포토샵/일러스트에서 폰트 사용 가능 확인
  - 앱 종료 → 폰트 사라지는지 확인
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 4.2_
