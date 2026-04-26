# 🎡 도로랜드 스마트 가이드 (Doroland Smart Guide)

**"도로랜드 정보국 신입 요원 훈련 포털 및 스마트 가이드 실습 저장소입니다."**

이 프로젝트는 초중등 학생들을 대상으로 **공공데이터(기상청, 에어코리아) API**를 활용하여 실제 작동하는 웹 애플리케이션을 직접 만들어보는 훈련 코스를 제공합니다. 학생들은 뼈대 코드(Skeleton)를 바탕으로 미션을 해결하며 "공동 제작자(and You)"로서 프로젝트를 완성하게 됩니다.

---

## 🌟 프로젝트 라이브 (GitHub Pages)
👉 **[도로랜드 훈련 포털 접속하기](https://xylito.github.io/doroland-smart-guide/)**
> **Note:** 레포지토리를 Fork하신 후 `Settings > Pages`에서 배포를 활성화해야 위 링크가 작동합니다. (주소의 ID 부분을 자신의 아이디로 변경하세요.)

---

## 📁 훈련 단계 및 프로젝트 구조

저장소는 총 3단계의 웹 특수 요원 훈련 과정으로 설계되어 있습니다.

### 1️⃣ `api-test/` | API 해킹 연습장 (Protocol Lab)
실제 공공데이터 서버와 통신하며 데이터를 해독(Parsing)하는 기초 훈련을 수행합니다.
*   **날씨 예보:** 기상청 초단기 강수 예측 API 연동 및 데이터 분석
*   **공기 질:** 에어코리아 실시간 대기오염 정보 API 연동 테스트

### 2️⃣ `agent-training/` | 웹 특수작전팀 훈련소 (Core Training)
HTML, CSS, JS 요원의 안내를 받아 웹의 3요소를 정복합니다.
*   **HTML 요원:** 문서의 뼈대와 구조 구축 (Semantic HTML)
*   **CSS 요원:** 세련된 디자인과 레이아웃 설계 (Modern CSS)
*   **JS 요원:** 생동감 넘치는 동적 로직 구현 (Vanilla JS)

### 3️⃣ `smart-guide-web/` | 스마트 가이드 프로토타입 (Final Mission)
훈련을 통해 배운 기술을 집약하여 완성할 '도로랜드 스마트 안내 시스템'의 최종 모델입니다.
*   학생들은 메인 포털에서 **`smart-guide-skeleton.zip`**을 다운로드하여 자신만의 안내 시스템을 구축합니다.

---

## ✨ 주요 특징 (Premium Features)

도로랜드 스마트 가이드는 교육적 목적과 함께 최신 웹 기술 표준을 준수합니다.

*   **지능형 테마 시스템 (Smart Theme):**
    *   사용자 시스템 설정(Windows/Mac/iOS/Android 다크모드)을 자동 감지합니다.
    *   모든 페이지 간의 주/야간 모드 설정이 실시간으로 동기화(localStorage Persistence)됩니다.
*   **표준화된 UI/UX:**
    *   **고가독성 폰트:** 가독성이 뛰어난 `Pretendard Variable` 폰트를 전 시스템에 적용했습니다.
    *   **통합 컨트롤러:** 모든 페이지 우측 상단에 포털 이동 및 테마 토글 버튼을 배치하여 일관된 내비게이션을 제공합니다.
    *   **커스텀 스크롤바:** 각 페이지의 테마와 아이덴티티에 맞춘 프리미엄 스크롤 디자인을 적용했습니다.
*   **참여자 존중 크레딧:** 최종 제작물인 **`smart-guide-web`** 폴더 내 파일 하단에는 코드를 완성한 학생들을 위한 공동 제작자 표기(`© 2026 XYLO & DORO Inc. & You.`)가 포함되어 있습니다.

---

## 🛠 사용 기술 및 데이터
*   **Language:** HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+)
*   **Typography:** Pretendard Variable (CDN)
*   **Public Data API:** 
    *   기상청 단기예보 조회 서비스
    *   한국환경공단 에어코리아 대기오염정보
*   **Tools:** Swagger UI (for API Testing)

---

## 👨‍💻 교육 대상 및 활용
*   웹 개발의 기본 개념을 배우고 싶은 초등학교 고학년 ~ 중학생
*   실제 공공데이터 API를 활용한 프로젝트 기반 학습(PBL)을 선호하는 교육자
*   '정보국 특수 요원' 세계관 속에서 재미있게 코딩을 시작하고 싶은 모든 예비 요원

---

**"요원 여러분, 도로랜드의 스마트 가이드를 완성할 준비가 되셨습니까?"**
Designed by [XYLO](https://github.com/xylito) & [DORO Inc.](https://doroedu.net)
