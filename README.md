# 🌏 GlobalNomad

다양한 체험 활동을 예약하고 관리할 수 있는 플랫폼

## 📌 프로젝트 소개

GlobalNomad는 사용자가 판매자와 체험자 모두 될 수 있는 체험 예약 플랫폼입니다.
캘린더 뷰와 지도 뷰 SDK를 활용하여 예약 가능한 날짜를 직관적으로 확인하고,
다양한 카테고리의 체험 상품을 예약할 수 있습니다.

### 주요 특징

- 🗓️ 캘린더 기반 예약 시스템
- 🗺️ 지도를 통한 체험 위치 확인
- 👤 판매자/체험자 듀얼 모드
- 🎯 문화·예술, 식음료, 스포츠, 투어, 관광, 웰빙 등 다양한 카테고리

## ✨ 주요 기능

### 1. 체험 검색 및 예약

- 카테고리별 체험 상품 검색
- 가격, 평점 기반 정렬
- 체험 상세 정보 및 리뷰 확인
- 캘린더를 통한 예약 날짜 선택

### 2. 내 정보 관리

- 프로필 정보 수정 (닉네임, 이메일, 비밀번호)
- 예약 내역 조회 및 관리
- 내가 등록한 체험 상품 관리
- 내 체험에 대한 예약 신청 관리

### 3. 체험 등록 및 관리

- 새로운 체험 등록
- 예약 가능 날짜 설정
- 체험 정보 수정/삭제
- 예약 현황 월별 확인

## 🛠️ 기술 스택

- **Frontend**: [사용한 프레임워크 - Next.js]
- **Styling**: [Tailwind CSS]
- **SDK**:
  - 캘린더 뷰 SDK
  - 지도 뷰 SDK
  - 주소 검색 API

## 🚀 시작하기

### 필수 요구사항

- Node.js 버전
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone [repository-url]

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

개발 서버 실행 후 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 📁 프로젝트 구조

```
GlobalNomad/
├── app/
│   ├── (auth)/              # 인증 관련 페이지 그룹
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/              # 메인 페이지 그룹
│   │   ├── page.tsx         # 홈페이지
│   │   ├── experiences/     # 체험 목록 및 상세
│   │   └── mypage/          # 내 정보 관리
│   ├── api/                 # Route Handlers
│   │   ├── experiences/
│   │   ├── reservations/
│   │   └── auth/
│   ├── actions/             # Server Actions
│   │   ├── experience.ts
│   │   ├── reservation.ts
│   │   └── user.ts
│   ├── layout.tsx           # 루트 레이아웃
│   └── globals.css
├── components/
│   ├── client/              # 클라이언트 컴포넌트
│   │   ├── Calendar/
│   │   ├── Map/
│   │   └── Form/
│   ├── server/              # 서버 컴포넌트
│   │   ├── ExperienceList/
│   │   └── UserProfile/
│   └── shared/              # 공통 컴포넌트
│       ├── Header/
│       ├── Footer/
│       └── Button/
├── lib/
│   ├── utils.ts             # 유틸리티 함수
│   ├── validations.ts       # 유효성 검증
│   └── constants.ts         # 상수
├── types/
│   ├── experience.ts        # 타입 정의
│   ├── user.ts
│   └── reservation.ts
├── public/                  # 정적 파일
│   ├── images/
│   └── icons/
├── .env.example             # 환경 변수
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 주요 디렉토리 설명

- **app/**: Next.js App Router 기반 라우팅
  - **(auth)/, (main)/**: 라우트 그룹으로 레이아웃 분리
  - **api/**: REST API Route Handlers
  - **actions/**: Server Actions으로 서버 사이드 로직 처리

- **components/**: 재사용 가능한 컴포넌트
  - **client/**: 'use client' 지시어를 사용하는 클라이언트 컴포넌트
  - **server/**: 서버 컴포넌트 (기본값)
  - **shared/**: 클라이언트/서버 공통 컴포넌트

## 🏗️ 아키텍처 특징

### Next.js App Router 활용

- **서버 컴포넌트 (RSC)**: 비공개 토큰/쿠키 접근 등 서버 전용 로직을 처리하고, 결과만 클라이언트 컴포넌트에 props로 내려줍니다.
- **클라이언트 컴포넌트**: 폼, 캘린더 등 상호작용과 상태 관리를 담당
- **서버 액션**: 로그인·예약 생성/취소 등 **데이터 쓰기(뮤테이션)** 를 서버에서 안전하게 실행. (쿠키 설정/검증을 여기서 처리합니다.)
- **라우트 핸들러**: 외부 웹훅·OAuth 콜백·파일 업로드 등 **엔드포인트가 필요한 경우**에 사용

## 🎯 학습 목표

이 프로젝트를 통해 다음을 경험할 수 있습니다:

1. **SDK 리서치 및 활용 능력**
   - 외부 SDK 문서 분석 및 적용
   - 캘린더, 지도, 주소 검색 API 통합

2. **복잡한 UI/UX 관리**
   - 다중 역할(판매자/체험자) 인터페이스 구현
   - 페이지 간 상태 관리 및 데이터 흐름 제어

3. **실무 중심 개발 경험**
   - 예약 시스템 로직 구현
   - 사용자 권한에 따른 기능 분기
   - 반응형 디자인 적용

## 👥 팀원

| 팀원       | 공통 컴포넌트                | 주요 페이지/기능                |
| ---------- | ---------------------------- | ------------------------------- |
| **김해빈** | `Input`                      | 회원가입 / 로그인 / 간편 로그인 |
| **박지원** | `Button`, `Dropdown`         | 내 체험 관리 / 등록 / 수정      |
| **심예진** | `Modal`, `ProfileCard`       | 예약 현황 / 알림                |
| **지현영** | `Header`, `Footer`, `Review` | 메인화면 / 체험상세             |
| **한유선** | `Filter`, `Chips`, `DateBox` | 내 정보 / 예약 내역 / 후기 작성 |
