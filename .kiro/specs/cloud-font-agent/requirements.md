# Requirements Document

## Introduction

클라우드 폰트 에이전트는 사용자가 결제한 폰트를 웹 서버 API로부터 조회하고, 동기화 버튼을 통해 일괄 다운로드하여 macOS 시스템에서 임시로 사용할 수 있게 하는 위젯 형태의 Electron 기반 데스크톱 애플리케이션입니다. 폰트 저작권 보호를 위해 애플리케이션이 실행 중일 때만 폰트가 활성화되며, 종료 시 자동으로 비활성화 및 삭제됩니다.

## Glossary

- **Cloud Font Agent**: Electron과 Swift를 활용한 위젯 형태의 폰트 관리 데스크톱 애플리케이션
- **Font API Server**: 사용자가 결제한 폰트 목록과 다운로드 URL을 제공하는 웹 API 서버
- **Widget Window**: 작은 크기의 항상 위에 표시되는 애플리케이션 창
- **CTFontManager**: macOS에서 폰트를 동적으로 등록/해제하는 시스템 API
- **Native Module**: Electron에서 호출 가능한 Objective-C++로 작성된 네이티브 확장 모듈
- **Temporary Font Activation**: 파일 시스템에 영구 설치하지 않고 프로세스 수명 동안만 폰트를 활성화하는 방식
- **Font Cache Directory**: 다운로드한 폰트 파일을 임시로 저장하는 로컬 디렉토리
- **Sync Operation**: 서버에서 폰트 목록을 조회하고 모든 폰트를 일괄 다운로드 및 등록하는 작업

## Requirements

### Requirement 1

**User Story:** 사용자로서, 내가 결제한 폰트 목록을 위젯에서 확인하고 싶습니다.

#### Acceptance Criteria

1. WHEN Cloud Font Agent가 시작되면, THE Cloud Font Agent SHALL Font API Server에 결제한 폰트 목록을 요청한다
2. WHEN 폰트 목록 조회가 완료되면, THE Cloud Font Agent SHALL 폰트 목록을 Widget Window에 표시한다
3. THE 폰트 목록 SHALL 각 폰트의 이름과 동기화 상태를 포함한다
4. IF 폰트 목록 조회가 실패하면, THEN THE Cloud Font Agent SHALL 오류 메시지를 사용자에게 표시한다
5. THE Cloud Font Agent SHALL HTTPS 프로토콜을 사용하여 Font API Server와 통신한다

### Requirement 2

**User Story:** 사용자로서, 동기화 버튼을 눌러 모든 폰트를 한 번에 다운로드하고 활성화하고 싶습니다.

#### Acceptance Criteria

1. WHEN 사용자가 동기화 버튼을 클릭하면, THE Cloud Font Agent SHALL 폰트 목록의 모든 폰트를 Font API Server로부터 다운로드한다
2. WHEN 각 폰트 다운로드가 완료되면, THE Cloud Font Agent SHALL 해당 폰트 파일을 Font Cache Directory에 저장한다
3. WHEN 폰트 파일이 Font Cache Directory에 저장되면, THE Native Module SHALL CTFontManager API를 사용하여 해당 폰트를 시스템에 등록한다
4. WHEN 모든 폰트 동기화가 완료되면, THE Cloud Font Agent SHALL 동기화 완료 상태를 사용자에게 표시한다
5. WHILE 동기화가 진행 중이면, THE Cloud Font Agent SHALL 진행률을 사용자에게 표시한다
6. IF 일부 폰트 다운로드 또는 등록이 실패하면, THEN THE Cloud Font Agent SHALL 성공한 폰트는 유지하고 실패한 폰트만 오류로 표시한다

### Requirement 3

**User Story:** 사용자로서, 동기화된 폰트가 macOS의 모든 애플리케이션에서 즉시 사용 가능하기를 원합니다.

#### Acceptance Criteria

1. WHEN 폰트가 시스템에 등록되면, THE 등록된 폰트 SHALL macOS의 모든 애플리케이션에서 즉시 사용 가능하다
2. WHILE Cloud Font Agent가 실행 중이면, THE 등록된 폰트 SHALL 계속 사용 가능한 상태를 유지한다
3. THE Cloud Font Agent SHALL Widget Window에서 각 폰트의 동기화 상태를 표시한다
4. IF 폰트 등록이 실패하면, THEN THE Cloud Font Agent SHALL 해당 폰트 파일을 Font Cache Directory에서 삭제한다

### Requirement 4

**User Story:** 사용자로서, 폰트 저작권 보호를 위해 애플리케이션 종료 시 모든 폰트가 자동으로 삭제되기를 원합니다.

#### Acceptance Criteria

1. WHEN Cloud Font Agent가 종료되기 시작하면, THE Swift Native Module SHALL CTFontManager API를 사용하여 등록된 모든 폰트를 시스템에서 해제한다
2. WHEN 모든 폰트가 시스템에서 해제되면, THE Cloud Font Agent SHALL Font Cache Directory의 모든 폰트 파일을 삭제한다
3. WHEN Cloud Font Agent가 완전히 종료되면, THE Font Cache Directory SHALL 비어있는 상태여야 한다
4. IF 폰트 파일 삭제가 실패하면, THEN THE Cloud Font Agent SHALL 다음 실행 시 해당 파일을 삭제한다
5. THE Cloud Font Agent SHALL 비정상 종료 시에도 다음 실행 시 Font Cache Directory를 정리한다

### Requirement 5

**User Story:** 사용자로서, 위젯이 작업에 방해되지 않도록 적절한 크기와 위치에 표시되기를 원합니다.

#### Acceptance Criteria

1. THE Widget Window SHALL 400픽셀 너비와 600픽셀 높이의 크기로 표시된다
2. THE Widget Window SHALL 항상 다른 창 위에 표시된다
3. THE Widget Window SHALL 사용자가 드래그하여 위치를 이동할 수 있다
4. THE Widget Window SHALL 최소화 및 닫기 버튼을 제공한다
5. WHEN 사용자가 Widget Window를 닫으면, THE Cloud Font Agent SHALL 종료된다

### Requirement 6

**User Story:** 개발자로서, Electron과 Native Module 간의 안정적인 통신을 통해 폰트 관리 기능을 구현하고 싶습니다.

#### Acceptance Criteria

1. THE Cloud Font Agent SHALL Electron의 IPC 메커니즘을 사용하여 메인 프로세스와 렌더러 프로세스 간 통신한다
2. THE Native Module SHALL Electron의 메인 프로세스에서 호출 가능한 인터페이스를 제공한다
3. WHEN Electron이 Native Module을 호출하면, THE Native Module SHALL 작업 결과를 동기적 또는 비동기적으로 반환한다
4. IF Native Module 호출이 실패하면, THEN THE Cloud Font Agent SHALL 오류를 적절히 처리하고 사용자에게 알린다
5. THE Native Module SHALL macOS 10.13 이상에서 동작한다

### Requirement 7

**User Story:** 사용자로서, 애플리케이션이 안전하게 폰트를 관리하고 시스템에 영향을 주지 않기를 원합니다.

#### Acceptance Criteria

1. THE Cloud Font Agent SHALL Font Cache Directory를 애플리케이션의 사용자 데이터 디렉토리 내에 생성한다
2. THE Cloud Font Agent SHALL 시스템 폰트 디렉토리(/Library/Fonts)를 수정하지 않는다
3. THE Native Module SHALL 폰트 등록 시 사용자 권한만으로 동작 가능한 방식을 사용한다
4. WHEN 폰트 파일을 다운로드하면, THE Cloud Font Agent SHALL 파일 무결성을 검증한다
5. THE Cloud Font Agent SHALL 다운로드한 폰트 파일에 대한 읽기 전용 권한을 설정한다

### Requirement 8

**User Story:** 개발자로서, 실제 서버 API가 없는 상황에서도 개발과 테스트를 진행하고 싶습니다.

#### Acceptance Criteria

1. THE Cloud Font Agent SHALL Mock API를 사용하여 폰트 목록을 조회한다
2. THE Mock API SHALL 실제 API와 동일한 응답 형식을 반환한다
3. THE Mock API SHALL 최소 3개 이상의 샘플 폰트 정보를 제공한다
4. THE Mock API SHALL 각 폰트의 이름과 다운로드 URL을 포함한다
5. THE Mock API SHALL 로컬 또는 공개 폰트 파일 URL을 제공한다
