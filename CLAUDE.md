# KoInfo Project Guidelines

## Project Overview
KoInfo(koinfo.kr)는 한국에 거주하는 외국인을 위한 다국가 통합 정보 플랫폼입니다.
서브도메인(mong.koinfo.kr, indo.koinfo.kr 등)으로 국가별 사이트를 제공합니다.

## Architecture
- **Single codebase, multi-site**: 하나의 HTML/CSS/JS 코드베이스를 공유하며, `js/site-config.js`의 SITES 설정과 `sites/{국가}/lang.js` 번역 파일로 국가별 차이를 구현
- **국가별 리소스**: `sites/{국가코드}/` 폴더에 hero 이미지, 번역(lang.js) 보관
- **공용 코드**: `js/`, `css/`, `api/`, 루트 HTML 파일들은 모든 국가가 공유
- **TravelKo 분리**: travel.koinfo.kr은 별도 레포(lee-monster/travel-planner)로 관리

## Active Sites
| 코드 | 사이트명 | 대상국가 | 도메인 |
|------|---------|---------|--------|
| mong | MongKo (몽코) | 몽골 | mong.koinfo.kr |
| indo | IndoKo (인도코) | 인도네시아 | indo.koinfo.kr |
| viet | VietKo (비엣코) | 베트남 | viet.koinfo.kr |
| malay | MalayKo (말코) | 말레이시아 | malay.koinfo.kr (준비중) |

## Critical Rule: Multi-Country Consistency
**모든 변경사항은 반드시 모든 국가에 동일하게 적용되어야 합니다.**
- HTML 구조, CSS, JS 로직 변경 → 공용 코드이므로 자동 적용
- 번역 키 추가/변경 → 모든 `sites/*/lang.js` 파일에 해당 키 추가/변경
- site-config.js 속성 추가 → 모든 SITES 항목에 해당 속성 추가
- 새 페이지 추가 → 모든 lang.js에 관련 번역 추가
- **각 국가의 번역은 해당 국가 언어로 자연스럽게 작성** (몽골어, 인도네시아어, 말레이어 등)

## Tech Stack
- Vanilla HTML/CSS/JS (no framework)
- Vercel 배포
- Notion API 연동 (뉴스/게시판)
- i18n: data-i18n 속성 기반 자체 번역 시스템

## File Structure
```
├── index.html, study.html, work.html, visa.html, life.html, community.html, news.html  (공용 페이지)
├── business.html          (비활성 - 네비게이션에서 제거됨)
├── landing.html          (koinfo.kr 메인 랜딩)
├── css/style.css         (공용 스타일)
├── js/
│   ├── site-config.js    (국가별 설정 - SITES 객체)
│   ├── main.js           (공용 JS - i18n, 테마 등)
│   ├── news.js           (뉴스 기능)
│   └── board.js          (게시판 기능)
├── sites/
│   ├── mong/lang.js      (몽골어/한국어 번역)
│   ├── indo/lang.js      (인도네시아어/한국어 번역)
│   ├── viet/lang.js      (베트남어/한국어 번역)
│   └── {국가}/images/    (국가별 히어로 이미지)
├── api/
│   ├── news.js           (뉴스 API)
│   └── sitemap.js        (동적 sitemap)
└── images/               (공용 이미지)
```

## Workflow: Session Start Protocol
새 작업 시작 전, 반드시 아래 순서로 현재 상태를 파악한다:
1. `git status` — 커밋되지 않은 변경사항/untracked 파일 확인
2. `git diff` — 진행 중이던 수정 내용 파악
3. `git log --oneline -5` — 최근 커밋 히스토리 확인
4. 위 결과를 사용자에게 요약 보고 후, 새 작업 진행

## Language
- 사용자와의 소통: 한국어
- 코드 주석: 영어
- 커밋 메시지: 영어
