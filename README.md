# DO-IT

> 멘토-멘티 매칭과 커뮤니티 기능을 제공하는 풀스택 웹 애플리케이션

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [License](#license)

## Overview

DO-IT은 React와 Cloudflare의 서버리스 아키텍처를 활용한 현대적인 웹 애플리케이션입니다. 사용자 인증, 게시판, 댓글 시스템을 포함하고 있으며, Edge Computing을 통해 빠른 응답 속도를 제공합니다.

**Live Demo:** [https://doit.kalpha.kr](https://doit.kalpha.kr)

## Features

### Authentication
- JWT 기반 사용자 인증
- 회원가입 및 로그인
- 세션 지속성 (localStorage)
- 아이디 중복 체크

### Community Board
- CRUD 작업 (생성, 조회, 수정, 삭제)
- 실시간 조회수 추적
- 댓글 시스템
- 작성자 권한 검증
- 게시글 검색 (제목, 내용)

### User Experience
- SPA (Single Page Application)
- 반응형 디자인
- 클라이언트 사이드 라우팅
- 한국 시간대 (KST) 지원

## Tech Stack

### Frontend
```
React 19.1.1
React Router DOM 7.13.0
Vite 7.1.2
```

### Backend & Infrastructure
```
Cloudflare Workers (Serverless Functions)
Cloudflare D1 (SQLite Database)
Cloudflare Pages (Static Hosting)
```

### Development Tools
```
ESLint
Wrangler CLI
Git
```

## Architecture

```
┌─────────────────┐
│   React SPA     │
│  (Client-side)  │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────────────────────────────────┐
│       Cloudflare Pages                      │
│  ┌──────────────────────────────────────┐   │
│  │   Static Assets + SPA Routing        │   │
│  └──────────────────────────────────────┘   │
└────────┬────────────────────────────────────┘
         │
         │ API Calls
         │
┌────────▼────────────────────────────────────┐
│       Cloudflare Workers                    │
│  ┌──────────────────────────────────────┐   │
│  │   API Routes Handler (worker/index)  │   │
│  │   - Auth APIs                        │   │
│  │   - Post APIs                        │   │
│  │   - Comment APIs                     │   │
│  └────────────┬─────────────────────────┘   │
└───────────────┼─────────────────────────────┘
                │
                │ SQL Queries
                │
┌───────────────▼─────────────────────────────┐
│         Cloudflare D1 Database              │
│  ┌──────────────────────────────────────┐   │
│  │   SQLite Tables:                     │   │
│  │   - users                            │   │
│  │   - community_post                   │   │
│  │   - community_comment                │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18 이상
- npm 또는 yarn
- Git
- Cloudflare 계정 (배포 시 필요)

### Installation

1. 저장소 클론
```bash
git clone https://github.com/gguatit/DO-IT-mains.git
cd DO-IT-main
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 브라우저에서 접속
```
http://localhost:5173
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 시작 (localhost:5173) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run preview` | 빌드된 결과물 미리보기 |
| `npm run lint` | ESLint 코드 검사 |
| `npm run deploy` | Cloudflare에 배포 |

## Database Schema

### users

사용자 계정 정보를 저장합니다.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| user_id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 사용자 고유 ID |
| username | TEXT | NOT NULL, UNIQUE | 로그인 아이디 |
| email | TEXT | UNIQUE | 이메일 주소 |
| password | TEXT | NOT NULL | 비밀번호 (평문 저장) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 계정 생성 시각 |

### community_post

게시글 데이터를 저장합니다.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| post_id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 게시글 고유 ID |
| title | TEXT | NOT NULL | 게시글 제목 |
| content | TEXT | NOT NULL | 게시글 본문 |
| user_id | INTEGER | FOREIGN KEY | 작성자 ID |
| view_count | INTEGER | DEFAULT 0 | 조회수 |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 작성 시각 |
| updated_at | DATETIME | | 수정 시각 |
| deleted_at | DATETIME | | 삭제 시각 (soft delete) |

### community_comment

댓글 데이터를 저장합니다.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| comment_id | INTEGER | PRIMARY KEY, AUTOINCREMENT | 댓글 고유 ID |
| content | TEXT | NOT NULL | 댓글 내용 |
| post_id | INTEGER | NOT NULL, FOREIGN KEY | 게시글 ID |
| user_id | INTEGER | FOREIGN KEY | 작성자 ID |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 작성 시각 |
| deleted_at | DATETIME | | 삭제 시각 (soft delete) |

### Database Setup

Cloudflare D1 콘솔에서 다음 SQL을 실행하세요:

```sql
-- 테이블 삭제 (초기화)
DROP TABLE IF EXISTS community_comment;
DROP TABLE IF EXISTS community_post;
DROP TABLE IF EXISTS users;

-- users 테이블 생성
CREATE TABLE users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
  username TEXT NOT NULL UNIQUE, 
  email TEXT UNIQUE, 
  password TEXT NOT NULL, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- community_post 테이블 생성
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

-- community_comment 테이블 생성
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

## API Reference

### Authentication Endpoints

#### POST /api/auth/signup
회원가입 API

**Request Body:**
```json
{
  "username": "string",
  "nickname": "string",
  "password": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "user_id": 1,
    "username": "string",
    "email": "string"
  }
}
```

#### POST /api/auth/login
로그인 API

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "user_id": 1,
    "username": "string",
    "email": "string"
  }
}
```

### Post Endpoints

#### GET /api/posts
게시글 목록 조회

**Response:**
```json
[
  {
    "post_id": 1,
    "title": "string",
    "content": "string",
    "user_id": 1,
    "view_count": 10,
    "created_at": "2026-01-31 00:00:00",
    "comment_count": 5
  }
]
```

#### POST /api/posts
게시글 작성 (인증 필요)

**Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "user_id": 1
}
```

#### GET /api/post/:id
게시글 상세 조회 (조회수 자동 증가)

#### PUT /api/post/:id
게시글 수정 (작성자만 가능)

#### DELETE /api/post/:id
게시글 삭제 (작성자만 가능, soft delete)

### Comment Endpoints

#### GET /api/post/:id/comments
댓글 목록 조회

#### POST /api/post/:id/comments
댓글 작성 (인증 필요)

## Deployment

### Cloudflare Pages 배포

1. wrangler.jsonc 설정 확인
```jsonc
{
  "name": "doit",
  "main": "worker/index.js",
  "compatibility_date": "2025-09-27",
  "assets": {
    "not_found_handling": "single-page-application"
  },
  "d1_databases": [
    {
      "binding": "D1_DB",
      "database_name": "doit",
      "database_id": "YOUR_DATABASE_ID"
    }
  ]
}
```

2. 빌드 및 배포
```bash
npm run deploy
```

### Environment Variables

필요한 환경 변수 없음 (D1 바인딩 사용)

### Build Settings (Cloudflare Pages)

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `dist/client` |
| Root directory | `/` |

## Security Notes

현재 구현은 학습 및 프로토타입 목적입니다. 프로덕션 환경에서는 다음 사항을 개선해야 합니다:

- [ ] 비밀번호 해싱 (bcrypt, argon2)
- [ ] JWT 토큰 기반 인증
- [ ] CSRF 보호
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] SQL injection 방어 강화
- [ ] XSS 방어
- [ ] HTTPS 강제
- [ ] 환경 변수 관리

## Project Structure

```
DO-IT-main/
├── functions/              # Cloudflare Functions
│   └── api/
│       ├── auth/          # 인증 API
│       ├── posts/         # 게시글 목록 API
│       └── post/          # 게시글 상세 API
├── src/                   # React 소스
│   ├── components/        # UI 컴포넌트
│   ├── pages/            # 페이지 컴포넌트
│   ├── contexts/         # React Context
│   ├── css/              # 스타일시트
│   └── App.jsx           # 루트 컴포넌트
├── worker/               # Worker 설정
│   └── index.js         # API 라우터
├── public/              # 정적 파일
├── package.json         # 프로젝트 메타데이터
├── vite.config.js      # Vite 설정
└── wrangler.jsonc      # Cloudflare 설정
```

## Contributing

이슈와 풀 리퀘스트를 환영합니다.

## License

이 프로젝트는 교육 목적으로 제작되었습니다.

## Contact

프로젝트 관련 문의: [GitHub Issues](https://github.com/gguatit/DO-IT-mains/issues)
