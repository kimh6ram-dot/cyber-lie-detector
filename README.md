# 사이버 거짓말 탐지기 (Cyber Lie Detector)

친구에게 질문을 읽어준 뒤 손가락을 화면(지문 센서)에 올리게 하고, 실제로 분석하는 것처럼
연출한 다음 **랜덤 결과**를 보여주는 오락용(장난용) 웹 앱입니다.

> ⚠️ 실제로 생체정보·심박수를 측정하지 않습니다. 카메라/마이크/위치 등 어떤 권한도 요구하지
> 않으며, 모든 수치와 결과는 화면 연출용 가상 데이터입니다.

## 기술 스택

- React 18 + Vite 5 (JavaScript)
- 순수 CSS (프레임워크 없음), 모바일 우선 반응형
- 백엔드·데이터베이스 없음 → 정적 배포 가능
- 효과음은 Web Audio API로 브라우저에서 직접 생성(외부 음원 파일 불필요)

## 로컬 실행

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

## 화면 구성 (SPA · URL 이동 없음)

1. **시작 화면** — 진지한 사이버 수사 장비 톤. 원형 스캐너 그래픽 + `탐지 시작하기`
2. **질문 선택** — 4개 카테고리 + 직접 입력 + 랜덤 질문 뽑기 + 최근 사용 질문(최대 3개)
3. **손가락 스캔** — 센서를 3.5초 이상 길게 누르면 진행률·심박수·심전도 애니메이션이 진행
4. **결과** — 확률 기반 랜덤 결과. 분위기별 연출(흔들림/노이즈/체크/잠금) + 공유/복사

## 배포 방법

`vite.config.js`의 `base: './'` 설정 덕분에 아래 두 방식 모두 그대로 동작합니다.

### Vercel

1. GitHub에 저장소를 올립니다.
2. Vercel에서 `Import Project` → 프레임워크 자동 감지(Vite).
3. Build Command `npm run build`, Output Directory `dist` (자동). 배포 완료.

### GitHub Pages

```bash
npm run build
# dist/ 폴더 내용을 gh-pages 브랜치로 배포
npx gh-pages -d dist
```

또는 저장소 Settings → Pages에서 GitHub Actions(Vite 템플릿)를 사용해도 됩니다.

## 자주 수정하는 부분

| 수정 대상 | 파일 |
| --- | --- |
| **질문 목록 / 카테고리 추가·변경** | [src/data/questions.js](src/data/questions.js) |
| **결과 문구 / 확률(가중치)** | [src/utils/resultGenerator.js](src/utils/resultGenerator.js) |
| **공유 문구 형식** | [src/utils/share.js](src/utils/share.js) |
| **효과음** | [src/utils/sound.js](src/utils/sound.js) |
| **색상·디자인 토큰** | [src/styles/global.css](src/styles/global.css) |

### 질문 추가 예시

`src/data/questions.js`의 원하는 카테고리 `questions` 배열에 문자열을 추가하면 됩니다.

### 결과 확률 변경 예시

`src/utils/resultGenerator.js`의 각 결과 `weight` 값을 조정하면 확률이 바뀝니다.
(현재: 거짓말 35 / 의심 25 / 비밀 20 / 진실 15 / 판독불가 5)

## 폴더 구조

```
src/
├─ App.jsx                 # 화면 전환(SPA) 상태 관리
├─ main.jsx                # 진입점
├─ data/
│  └─ questions.js         # 기본 질문 목록
├─ utils/
│  ├─ resultGenerator.js   # 확률 기반 랜덤 결과
│  ├─ share.js             # 공유/복사
│  └─ sound.js             # Web Audio 효과음
├─ components/
│  ├─ StartScreen.jsx
│  ├─ QuestionScreen.jsx
│  ├─ ScanScreen.jsx
│  ├─ ResultScreen.jsx
│  └─ common/              # TopBar, 아이콘, 지문/심전도 그래픽
└─ styles/                 # 전역·애니메이션·화면 스타일
```
