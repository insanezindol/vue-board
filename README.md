# Vue 게시판 (Vue Board)

Vue.js로 구축된 간단한 게시판 웹 애플리케이션입니다.

## 📋 프로젝트 소개

이 프로젝트는 Vue.js 2.5를 사용하여 제작된 기본적인 게시판 기능을 제공하는 싱글 페이지 애플리케이션(SPA)입니다. 사용자는 게시글을 조회, 작성, 수정할 수 있습니다.

## ✨ 주요 기능

- 📖 **게시글 목록 조회**: 모든 게시글을 테이블 형태로 확인할 수 있습니다
- ✍️ **게시글 작성**: 새로운 게시글을 작성할 수 있습니다
- 📝 **게시글 수정**: 기존 게시글을 수정할 수 있습니다
- 👁️ **게시글 상세 보기**: 개별 게시글의 상세 내용을 확인할 수 있습니다

## 🛠️ 기술 스택

- **프론트엔드**: Vue.js 2.5.2
- **라우터**: Vue Router 3.0.1
- **빌드 도구**: Webpack
- **테스트**: Jest
- **언어**: JavaScript (ES6+)

## 📁 프로젝트 구조

```
vue-board/
├── src/
│   ├── App.vue                 # 루트 컴포넌트
│   ├── main.js                 # 애플리케이션 진입점
│   ├── components/             # Vue 컴포넌트들
│   │   ├── Create.vue          # 게시글 작성/수정 컴포넌트
│   │   ├── Read.vue            # 게시글 목록 컴포넌트
│   │   └── Detail.vue          # 게시글 상세 보기 컴포넌트
│   ├── data/                   # 데이터 관리
│   │   └── index.js            # 게시판 데이터
│   ├── router/                 # 라우팅 설정
│   │   └── index.js            # 라우터 구성
│   └── assets/                 # 정적 자원
├── build/                      # 빌드 설정 파일들
├── config/                     # 환경 설정 파일들
├── test/                       # 테스트 파일들
└── static/                     # 정적 파일들
```

## 🚀 시작하기

### 필수 요구사항

- Node.js (v8.0 이상)
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**

   ```bash
   git clone <repository-url>
   cd vue-board
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **개발 서버 실행**

   ```bash
   npm run dev
   # 또는
   npm start
   ```

4. **브라우저에서 확인**
   - 개발 서버가 실행되면 브라우저에서 `http://localhost:8080`으로 접속합니다

### 빌드

프로덕션 빌드를 생성하려면:

```bash
npm run build
```

빌드된 파일들은 `dist/` 폴더에 생성됩니다.

### 테스트

단위 테스트를 실행하려면:

```bash
npm run test
# 또는
npm run unit
```

## 📱 사용법

1. **게시글 목록 보기**: 메인 페이지에서 모든 게시글을 확인할 수 있습니다
2. **게시글 작성**: "글쓰기" 버튼을 클릭하여 새 게시글을 작성합니다
3. **게시글 상세 보기**: 목록에서 게시글을 클릭하면 상세 내용을 볼 수 있습니다
4. **게시글 수정**: 상세 보기에서 수정 버튼을 클릭하여 게시글을 편집할 수 있습니다

## 🔧 개발 스크립트

- `npm run dev`: 개발 서버 시작
- `npm run build`: 프로덕션 빌드
- `npm run test`: 테스트 실행
- `npm start`: 개발 서버 시작 (dev와 동일)

## 📝 컴포넌트 설명

### Read.vue

- 게시글 목록을 테이블 형태로 표시
- 각 게시글 클릭 시 상세 보기로 이동
- 새 게시글 작성 버튼 제공

### Create.vue

- 새 게시글 작성 폼
- 게시글 수정 폼 (라우트 파라미터에 따라 동적 변경)
- 글쓴이, 제목, 내용 입력 필드 제공

### Detail.vue

- 개별 게시글의 상세 정보 표시
- 수정 및 삭제 기능 제공

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 개인 프로젝트로 제작되었습니다.

## 👨‍💻 작성자

**딘** - [jhlee@lunasoft.co.kr](mailto:jhlee@lunasoft.co.kr)

---

**Note**: 이 프로젝트는 Vue.js 학습 및 연습을 위한 기본적인 게시판 애플리케이션입니다.
