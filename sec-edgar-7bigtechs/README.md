---
# Core
id: "sec-edgar-7bigtechs"
title: "빅테크 조정 잉여현금흐름(Corrected FCF) 마진 계산기"
description: "SEC EDGAR 10-K 공시 원본 데이터를 기반으로 주식기준보상(SBC), 금융리스, 서버 내용연수 왜곡, 순환금융을 조정한 실질 FCF 마진 분석기"
author: "sam"
date: "2026-10-17"
tags: ["Quant", "FCF", "BigTech", "SEC-EDGAR", "UnoCSS", "KaTeX", "ChartJS"]

# Design
style_view: "both"
style_theme: "both"
style_art: "Editorial & Swiss"
style_color: "Warm Editorial (--bg: #fbfbf9; --fg: #1c1c1a; --border: #e5e4df; --accent: #ef4444;)"
style_font: "Editorial KR (font-sans: 'Noto Sans KR', sans-serif; font-mono: 'JetBrains Mono', monospace;)"
---

## SEC EDGAR Financial Statement Analyzer (7 Big Techs)

1. 실행 및 데이터 로드:
- 데이터 갱신 시: 로컬에서 `node data-fetch.js`로 `data.json`을 새로 생성
- 웹 서버(Cloudflare Pages 등) 배포 환경에서는 접속 시 `data.json`이 자동 비동기 로드된다.
- 로컬 컴퓨터 환경:
  - 추천 방식: 초경량 로컬 웹서버 앱 [200 OK Web Server](https://ok200.app/)를 실행하고 폴더를 지정하면 터미널이나 VS Code 없이 클릭 한 번으로 로컬 주소가 열리며 `data.json`이 자동 연동된다.
  - 무설치 방식: HTML 파일을 더블클릭(`file:///`)하여 브라우저 CORS 차단 배너가 표시되면 상단의 `[JSON 로드]` 버튼을 눌러 동봉된 `data.json`을 직접 메모리에 로드한다. 한 번 로드된 데이터는 브라우저 캐시에 보관된다.

2. 분석 기업 및 공시 연도 선택:
- 상단 탭에서 7개 빅테크(MSFT, AMZN, GOOG, META, AAPL, NVDA, TSLA) 중 하나를 선택한다.
- 10-K 공시 회계연도(최근 3개년) 버튼을 클릭하여 기준 시점을 전환한다.

3. 공시 지표 vs 조정 지표 대조:
- 상단 지표 카드에서 공시 수치와 조정 수치(FCF 마진, FCF 금액, 매출액, 감가상각 차이)를 비교한다.
- 마진 축소폭(bp) 및 총 현금 유출 차감 규모를 확인한다.

4. 회계적 왜곡 모수 민감도 조절:
- 주식기준보상(SBC) 현금 유출 인정 비율(0~100%)을 조정한다.
- 금융리스 원리금 상환액 차감 비율(0~100%)을 지정한다.
- 서버 장부 내용연수(Useful Life)를 AI 하드웨어 실질 수명(1~6년)으로 단축하여 유지 설비투자 추가분을 반영한다.
- 지분투자사 연계 순환금융 매출 할인율(0~15%)과 파트너사 마켓플레이스 테이크레이트(5~30%)를 조절하여 분모 거품을 제거한다.
- 모수를 초기 상태로 되돌리려면 기본값 복원 버튼을 클릭한다.

5. 차트 및 공시 원본 추적(Audit Trail):
- 좌측 듀얼 축 차트로 최근 3개년 공시 대비 조정 FCF 및 마진율 궤적을 파악한다.
- 우측 워터폴 차트로 공시 CFO에서 조정 FCF에 이르는 단계별 차감 내역을 확인한다.
- 하단 감사 추적 테이블에서 US-GAAP 정규 XBRL 태그, 공시 원본 수치, 세부 회계 조정 근거를 대조 검증한다.

---

## 사양서

### 1. 개요

미국 증권거래위원회(SEC) 전자공시시스템(EDGAR) 10-K 데이터를 기반으로 빅테크 7개 사(MSFT, AMZN, GOOG, META, AAPL, NVDA, TSLA)의 실질 잉여현금흐름(Free Cash Flow, FCF) 마진을 산출하는 단일 실행형 분석 시스템이다.

구글 파이낸스나 단순 공시 보도자료의 명목 현금흐름에서 주식기준보상(SBC), 금융리스 원금 상환액, 인위적으로 늘린 서버 내용연수(Useful Life), 순환금융(Circular Financing) 매출 왜곡을 조정한다.

최종 사용자가 `index.html` 단일 파일만 브라우저로 열면 사전 정제된 7개 빅테크의 최신 재무 데이터셋이 즉시 로드되며, 실시간 슬라이더 시뮬레이션, 2축 마진 비교 및 워터폴 차트, 주석 감사 추적 그리드가 100% 클라이언트 사이드에서 구동된다.

### 2. 구조

단순성을 극대화하기 위해 다계층 디렉터리를 배제하고 단일 폴더 평탄화(Flat) 구조를 유지한다.

```text
sec-edgar-7bigtechs/
├── sec-edgar-7bigtechs.md        # 구현 사양서
├── data-fetch.js             # Node.js 1회성 데이터 수집 및 경량 프리셋 추출기
├── data.json                 # 7개 빅테크 정제 재무 데이터 (독립 모듈, 수십 KB)
└── index.html                # 브라우저 실행용 분석 대시보드 (data.json 비동기 로드 및 파일 업로드 폴백)
```

### 3. 대상 (빅테크 7개) 식별 코드 (CIK)

- MSFT (Microsoft Corporation): CIK 0000789019
- AMZN (Amazon.com Inc): CIK 0001018724
- GOOG (Alphabet Inc): CIK 0001652044
- META (Meta Platforms Inc): CIK 0001326801
- AAPL (Apple Inc): CIK 0000320193
- NVDA (NVIDIA Corporation): CIK 0001045810
- TSLA (Tesla Inc): CIK 0001318605

### 4. 수집 및 정제 명세 (`data-fetch.js`)

Node.js 내장 `fetch`와 `fs` 모듈만 사용하며 외부 npm 패키지는 0개다.

- 엔드포인트: `https://data.sec.gov/api/xbrl/companyfacts/CIK{cik_10digits}.json`
- 필수 선언 헤더: `User-Agent: SampleInvestLab research@sampleinvestlab.com`
- 수집 항목: 최근 3개 회계연도(10-K, Annual)의 CFO, CapEx, Revenue, SBC, 금융리스 원금 상환, 자산화 소프트웨어, 유형자산(PPE)
- 메타데이터 및 래핑 구조:
  수집 일자(`updatedAt: YYYY-MM-DD`)와 출처 정보를 최상위에 기록하여 `data.json`으로 독립 저장한다.
  ```json
  {
    "updatedAt": "2026-10-17",
    "source": "SEC EDGAR 10-K Company Facts API",
    "companies": {
      "MSFT": { ... },
      "AMZN": { ... }
    }
  }
  ```

### 5. 조정 계산 모델

1) 기본 표면적 지표:

$$\text{Reported FCF} = \text{CFO} - \text{CapEx}$$

$$\text{Reported FCF Margin} = \frac{\text{Reported FCF}}{\text{Reported Revenue}}$$

2) 조정 FCF(분자) 산출 모델:

$$\text{Corrected FCF} = \text{CFO} - \text{CapEx} - \text{SBC} - \Delta \text{Dep}_{\text{server}} - \text{Finance Lease}$$

3) 서버 내용연수(Useful Life) 정상화 모델:
장부상 기재된 서버 내용연수를 하드웨어 진부화 주기인 3년으로 재조정하여 추가 감가상각 유지비를 산출한다.

$$\Delta \text{Dep} = NBV_{server} \times \left( \frac{1}{L_{adj}} - \frac{1}{L_{rep}} \right)$$

$$\text{Adjusted Maintenance CapEx} = \text{Reported CapEx} + \max(0, \Delta \text{Dep})$$

4) 조정 매출액(분모) 산출 모델:
ASC 606 대리인 기준을 적용하여 외부 플랫폼 거래 총액을 순액으로 전환하고 순환금융 거래분을 차감한다.

$$\text{Corrected Revenue} = \text{Direct Revenue} + \text{Net Partner Distribution} - \text{Circular Financing Revenue}$$

$$\text{Corrected FCF Margin} = \frac{\text{Corrected FCF}}{\text{Corrected Revenue}}$$

### 6. 대시보드 UI 명세 (`index.html`)

- 디자인 및 폰트: UnoCSS 런타임, JetBrains Mono, Noto Sans KR, 다크/라이트 테마 토글
- 아이콘: Lucide Icons CDN
- 수식 표기: KaTeX CDN
- 차트 시각화: Chart.js CDN (보고된 FCF vs 조정 FCF 비교, 워터폴 현금 유출 분석)
- 상태 뱃지: 상단 바에 `Updated: YYYY-MM-DD` 갱신 일자 표시 및 `[JSON 로드]` 파일 입력 버튼 연동
- 인터랙션:
  - 7개 빅테크 티커 탭 원클릭 전환
  - 회계연도(FY) 선택 버튼
  - 실시간 슬라이더 시뮬레이션 (서버 내용연수, 순환금융 비중, 마켓플레이스 정산 수수료율)
  - 주석 감사 추적(Audit Trail) 테이블 (XBRL 원본 태그, 값, 조정 사유)