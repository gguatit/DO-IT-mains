# DO-IT 프로젝트

DO-IT은 멘토-멘티 매칭과 커뮤니티 기능을 제공하는 웹 애플리케이션입니다.

## 프로젝트 소개

이 프로젝트는 React와 Cloudflare Pages를 사용하여 만든 웹사이트입니다. 사용자들이 서로 멘토와 멘티로 연결되고, 커뮤니티에서 자유롭게 소통할 수 있는 플랫폼입니다.

## 주요 기능

### 1. 회원 시스템
- 회원가입: 아이디, 비밀번호, 이메일로 가입
- 로그인/로그아웃: 로그인 상태 유지 기능
- 아이디 중복 체크
- 모든 회원 정보는 Cloudflare D1 데이터베이스에 저장

### 2. 커뮤니티 게시판
- 게시글 작성: 로그인한 사용자만 작성 가능
- 게시글 조회: 누구나 볼 수 있음
- 게시글 수정/삭제: 본인이 작성한 글만 가능
- 조회수 자동 증가
- 댓글 작성 및 조회

### 3. 기타 기능
- 반응형 디자인
- 검색 기능 (제목, 내용 검색)
- 한국 시간(KST) 표시

## 기술 스택

### 프론트엔드
- React 19.1.1
- React Router DOM 7.13.0
- Vite 7.1.2 (빌드 도구)

### 백엔드
- Cloudflare Workers (서버리스)
- Cloudflare D1 (SQLite 데이터베이스)
- Cloudflare Pages (호스팅)

### 개발 도구
- ESLint (코드 품질 검사)
- Wrangler (Cloudflare 배포 도구)

## 프로젝트 구조

```
DO-IT-main/
├── functions/           # Cloudflare Functions (백엔드 API)
│   └── api/
│       ├── auth/        # 인증 관련 API
│       │   ├── signup.js    # 회원가입
│       │   └── login.js     # 로그인
│       ├── posts/       # 게시글 목록
│       │   └── index.js
│       └── post/        # 게시글 상세
│           ├── [id].js          # 상세/수정/삭제
│           └── [id]/comments.js # 댓글
├── src/                 # 프론트엔드 소스
│   ├── components/      # React 컴포넌트
│   │   ├── Header.jsx
│   │   ├── Post.jsx
│   │   ├── Posts.jsx
│   │   └── PostCreate.jsx
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── Main.jsx
│   │   ├── Login.jsx
│   │   └── MemberInput.jsx
│   ├── contexts/        # React Context
│   │   └── AuthContext.jsx  # 로그인 상태 관리
│   ├── css/             # 스타일시트
│   └── App.jsx          # 메인 앱
├── worker/              # Cloudflare Worker 설정
│   └── index.js         # API 라우팅
├── public/              # 정적 파일
│   └── images/          # 이미지 파일
├── package.json         # 프로젝트 설정
├── vite.config.js       # Vite 설정
└── wrangler.jsonc       # Cloudflare 설정
```

## 데이터베이스 구조

### users 테이블 (사용자 정보)
- user_id: 사용자 고유 번호 (자동 증가)
- username: 아이디
- email: 이메일
- password: 비밀번호
- created_at: 가입 일시

### community_post 테이블 (게시글)
- post_id: 게시글 번호 (자동 증가)
- title: 제목
- content: 내용
- user_id: 작성자 번호
- view_count: 조회수
- created_at: 작성 일시
- updated_at: 수정 일시
- deleted_at: 삭제 일시 (삭제 시에만 값 입력)

### community_comment 테이블 (댓글)
- comment_id: 댓글 번호 (자동 증가)
- content: 댓글 내용
- post_id: 게시글 번호
- user_id: 작성자 번호
- created_at: 작성 일시
- deleted_at: 삭제 일시

## API 엔드포인트

### 인증 API
- POST /api/auth/signup - 회원가입
- POST /api/auth/login - 로그인

### 게시판 API
- GET /api/posts - 게시글 목록 조회
- POST /api/posts - 게시글 작성
- GET /api/post/:id - 게시글 상세 조회
- PUT /api/post/:id - 게시글 수정
- DELETE /api/post/:id - 게시글 삭제
- GET /api/post/:id/comments - 댓글 목록 조회
- POST /api/post/:id/comments - 댓글 작성

## 설치 및 실행 방법

### 1. 프로젝트 클론
```bash
git clone https://github.com/gguatit/DO-IT-mains.git
cd DO-IT-main
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 http://localhost:5173 으로 접속

### 4. 빌드
```bash
npm run build
```

### 5. 배포 (Cloudflare Pages)
```bash
npm run deploy
```

## Cloudflare 설정

### D1 데이터베이스 설정
Cloudflare 대시보드에서 D1 데이터베이스 생성 후, 다음 SQL을 실행하세요:

```sql
-- users 테이블
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  username TEXT NOT NULL UNIQUE, 
  email TEXT UNIQUE, 
  password TEXT NOT NULL, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- community_post 테이블
CREATE TABLE community_post (
  post_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  title TEXT NOT NULL, 
  content TEXT NOT NULL, 
  user_id INTEGER, 
  view_count INTEGER DEFAULT 0, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
  updated_at DATETIME, 
  deleted_at DATETIME, 
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- community_comment 테이블
CREATE TABLE community_comment (
  comment_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  content TEXT NOT NULL, 
  post_id INTEGER NOT NULL, 
  user_id INTEGER, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
  deleted_at DATETIME, 
  FOREIGN KEY (post_id) REFERENCES community_post(post_id), 
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### wrangler.jsonc 설정
`database_id`를 본인의 D1 데이터베이스 ID로 변경하세요.

## 주요 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # 코드 품질 검사
npm run deploy       # Cloudflare에 배포
```

## 보안 참고사항

현재 버전은 학습 및 데모 목적으로 만들어졌습니다. 실제 서비스에서는 다음 사항을 개선해야 합니다:

1. 비밀번호 암호화 (현재 평문 저장)
2. JWT 토큰 기반 인증
3. HTTPS 강제 사용
4. SQL Injection 방어
5. XSS 공격 방어
6. CSRF 토큰 사용
7. Rate Limiting (요청 제한)

## 라이선스

이 프로젝트는 개인 학습 목적으로 만들어졌습니다.

## 문의

프로젝트 관련 문의사항은 Issues 탭에 남겨주세요.
