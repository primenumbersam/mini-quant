목적: 100% Client-Side Computing: 퀀트용 마이크로 툴킷

미국 주식/암호화폐 현재가 조회 

제약: Rust 언어를 사용해서 단일 바이너리로 패키징되는 크로스 OS 웹 앱. directory structure 는 최대한 flatten.


### Tech Stack

- Runtime & Execution Environment
  - Single-File (Zero-Build): Self-contained binary file or `.html` architecture integrating markup, styles, and scripts without external bundlers or server dependencies. Maximizes crawlability and immediate machine readability for both SEO (Search Engine Optimization) and GEO (Generative Engine Optimization / AI agent ingestion) via zero-latency semantic markup parsing.

- CSS Framework
  - UnoCSS: High-performance on-demand utility-first CSS via runtime CDN compiler.
  - Bootstrap CSS: Standardized layout and component framework via CDN.

- Reactive & Logic Engine
  - Alpine.js: Lightweight reactive state and DOM interaction controller via CDN.

- Data & Math Visualization
  - Chart.js: Canvas-based general-purpose charting library for rendering statistical and dashboard data via CDN.
  - KaTeX: Fast, lightweight LaTeX math typesetting library for rendering quantitative formulas via CDN.

- Motion & Effect Engine
  - GSAP (GreenSock Animation Platform): High-performance UI animation and timeline engine via CDN.

- 3D Visual Engine
  - Three.js: WebGL-based advanced 3D graphics and immersive background engine via CDN.

### Frontmatter Schema (`README.md`)

```text
---
# 1. Core
title: "2-Factor Bernoulli Expected Return & Kelly Calculator"
description: "Interactive quantitative dashboard calculating 4-state expected return, weighted risk-reward ratio, and optimal Kelly fraction based on macro and micro binary probabilities."
author: "gitsam"
ai_model: "gemini" # Gemini, Claude, ChatGPT
date_updated: "2026-10-14"
status: "done" # draft | done

# 2. Design
style_view: "both" # desktop | mobile | both (responsive viewport optimization)
style_theme: "both" # dark | light | both (theme switching support)

style_art: "Minimalist" 
# Allowed Values:
# 1. Minimalist          (극단적 여백과 단순 조형 중심)
# 2. Editorial & Swiss   (Editorial + Swiss Typography + Line Art 격자/보고서 양식 통합)
# 3. Bento Grid          (모듈형 대시보드 및 카드 구획 양식)
# 4. Neo-Brutalism       (굵은 외곽선, 원색 대비, 거친 그림자 효과)
# 5. Glassmorphism       (반투명 배경 블러 및 다층 레이어 깊이감)
# 6. Terminal & HUD      (Futuristic 구체화: 다크 관제 화면, CLI, 트레이딩 터미널 감성)
# 7. Voxel & Pixel       (Isometric Pixel Art + Minecraft 통합: 복셀 및 도트 3D 조형)
# 8. Kinetic & Shader    (Three.js WebGL 셰이더, 파티클 및 GSAP 고밀도 모션 특화)

style_color: "Achromatic (--bg: #0a0a0a; --fg: #fafafa; --muted: #737373; --accent: #ffffff;)"
# Allowed Palette Presets (CSS Custom Property Syntax for IDE Color Picker):
# 1. Achromatic         (--bg: #0a0a0a; --fg: #fafafa; --muted: #737373; --accent: #ffffff;)
#    - 무채색 명도 대비만 사용하는 극단적 미니멀 및 기대수익률/히트맵 계산기 표준
# 2. Paper Sepia        (--bg: #f5efe6; --fg: #2b2520; --border: #dcd3c4; --accent: #c85a17;)
#    - 양장본·수제 종이 질감의 웜 베이지와 에스프레소 브라운, 테라코타 포인트를 결합한 클래식 에디토리얼 테마
# 3. Bloomberg Amber    (--bg: #000000; --fg: #ff9900; --muted: #555555; --accent: #00ff66;)
#    - 순수 블랙 배경에 호박색(Amber)과 형광 그린을 배합한 클래식 금융 터미널 및 CLI 스크래퍼 테마
# 4. Quant Green Red    (--bg: #1c1c1c; --fg: #e2e8f0; --accent: #10b981; --danger: #f43f5e;)
#    - Charcoal 배경 위에 매수/수익(에메랄드 그린)과 매도/손실(로즈 레드)의 양방향 시인성을 극대화한 트레이딩 테마
# 5. Swiss International (--bg: #f4f4f0; --fg: #111111; --muted: #888888; --accent: #ff3300;)
#    - 오프화이트 배경과 강렬한 버밀리온(주홍색) 포인트를 결합한 스위스 타이포그래피 및 그리드 레이아웃 테마
# 6. Neo-Brutal Pop     (--bg: #fffdf5; --fg: #000000; --accent: #ffde00; --secondary: #3b82f6;)
#    - 칠흑 같은 외곽선(#000000)과 고채도 원색(옐로우/블루) 면 분할을 활용한 네오 브루탈리즘 테마
# 7. Cybernetic Neon    (--bg: #050508; --fg: #f8fafc; --accent: #00f0ff; --secondary: #7000ff;)
#    - Three.js 셰이더, 파티클 및 WebGL 3D 아티팩트의 발광(Glow) 효과를 극대화하는 사이버펑크 네온 테마
# 8. Frosted Slate      (--bg: #0f172a; --fg: #f8fafc; --surface: rgba(255, 255, 255, 0.08); --accent: #38bdf8;)
#    - 반투명 레이어(rgba)와 슬레이트 블루 톤을 결합한 글래스모피즘 및 모던 SaaS 대시보드 테마

style_font: "System Native (font-sans: system-ui, -apple-system, sans-serif; font-mono: monospace;)"
# Allowed Font Pairings (Primary / Secondary UI Font + Monospace Tabular/Code):
# --- Global / English Presets (EN) ---
# 1. System Native (EN)      (font-sans: system-ui, -apple-system, sans-serif; font-mono: monospace;)
#    - 외부 네트워크 로딩(Zero-Latency) 없이 OS 기본 산세리프와 고정폭 숫자를 사용하는 초경량 계산기 및 확장 프로그램 표준
# 2. Modern Geometric (EN)  (font-sans: 'Inter', sans-serif; font-mono: monospace;)
#    - 글로벌 SaaS 대시보드 및 Bento Grid 레이아웃에 최적화된 중립적이고 정교한 기하학적 산세리프 표준
# 3. Swiss Grotesque (EN)   (font-sans: 'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif; font-mono: monospace;)
#    - 강렬한 헤드라인 대비와 기하학적 그로테스크 감성을 결합한 스위스 인터내셔널 및 네오 브루탈리즘 전용 조합
# 4. Academic Serif (EN)    (font-serif: 'Newsreader', Georgia, serif; font-mono: monospace;)
#    - 영문 학술 논문, 퀀트 백테스팅 저널 및 KaTeX 수식 조판과 어우러지는 권위 있는 세리프 조합

# --- Korean Dedicated Presets (KR) ---
# 5. Editorial KR (KR)       (font-sans: 'Noto Sans KR', sans-serif; font-mono: monospace;)
#    - 한글 본문 가독성이 검증된 노토 산스와 고정폭 수치를 결합한 한국어 정량 분석 및 SEC 10-K 공시 리포트 표준
# 6. Neo Gothic KR (KR)      (font-sans: 'Pretendard', -apple-system, sans-serif; font-mono: monospace;)
#    - 시스템 폰트와 유려하게 맞물리는 현대적 완성형 고딕으로 모바일 웹 앱 및 핀테크 대시보드에 최적화된 조합
# 7. Literary Paper KR (KR)  (font-serif: 'Noto Serif KR', serif; font-mono: monospace;)
#    - 단아한 전통 한글 명조를 기반으로 긴 호흡의 칼럼, 에세이, 정밀 연구 문서에 적합한 인문학적 조합
# 8. Terminal Mono (ALL)     (font-mono: 'JetBrains Mono', monospace;)
#    - 본문과 헤드라인, 수치 구분 없이 100% 모노스페이스로 단일화하여 개발자 터미널 및 HUD 인터페이스를 구현하는 테마

---
```

