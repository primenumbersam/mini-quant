# 평단가 및 목표손익비 계산기 (Pre-Trading RRR Calculator)

빌드 과정 없이 단일 HTML 파일로 즉시 실행되는 zero-build SFA(Single File Application) 기반의 매매 전 손익비(Risk/Reward Ratio) 및 포지션 계산기다.

## 해결한 문제

1. 분할 진입과 파생상품 규격을 함께 반영하는 사전 계산의 부재
   기존 단순 손익비 계산기는 단일 진입가만 다루어 물타기·불타기 등 분할 진입 시 평균 진입가와 총 포지션 규모를 파악하기 어려웠다. 반대로 암호화폐 전용 평단가 계산기는 국채·통화·주가지수 선물 등에 필요한 계약 승수(Multiplier)나 내재 레버리지, 유지증거금율(MMR)을 유연하게 반영하기 어려웠다.
2. 가격(Level)과 수익률(Rate) 기준 전환의 번거로움
   차트 가격 기준으로 목표가를 잡다가 투입 증거금 대비 수익률(ROE %) 기준으로 시뮬레이션을 바꿀 때마다 값을 다시 입력해야 하는 불편이 있었다.
3. 별도 빌드·서버 의존성
   트레이딩 전 빠르게 열어 계산해야 하는 도구 특성상 패키지 설치나 번들링, 백엔드 서버 없이 브라우저만으로 즉시 동작해야 한다.

## 해결법

- 범용 파생상품 파라미터 통합: 자산명(Ticker), 레버리지(소수점 허용), 유지증거금율(%), 계약 승수(Multiplier)를 단일 입력으로 받아 암호화폐 선물, 국내 국채·통화·주가지수 선물, 현물까지 동일한 수식으로 처리한다.
- 분할 진입 매매이력표 및 실시간 요약: 차순, 진입 가격, 진입 수량, 삭제 구조의 테이블에서 평균 진입가, 포지션 청산가, 총 포지션 가치, 총 필요 증거금을 즉시 산출한다.
- Level ↔ Rate 양방향 자동 환산: Unit 전환 시 기존에 입력된 익절가/손절가와 목표 수익률/허용 손실률(ROE %)을 평균 진입가 및 레버리지 기준으로 상호 자동 변환한다.
- CSV 기반 선물 기본 정보 모달: 국내 파생상품 선물(근원물) 거래승수 및 증거금률 데이터를 HTML 하드코딩 대신 JS 내부 CSV 문자열로 분리해 유지보수를 단순화했다.
- 한국 시장 색상 관행 및 다크 테마 지원: Long/수익을 Red, Short/손실을 Blue로 표시하고, Gray 팔레트 기반 Light/Dark 테마 전환과 `localStorage` 상태 유지를 제공한다.

## 사용 기술 스택

- Markup & Logic: HTML5, Vanilla JavaScript (ES6+)
- Styling: UnoCSS Runtime CDN (`@unocss/runtime`), `@unocss/reset/tailwind.min.css`, Custom CSS (`html.dark` Gray Palette)
- Icons & Typography: Lucide Icons (`lucide`), Inter Font (Google Fonts)
- Persistence: Web `localStorage` (테마 설정 저장)
