---
# Core
title: "BTC Option Curvature & Asymmetry Analysis Dashboard"
description: "Interactive analytics dashboard examining BTC option chain pricing curvature, call-put implied volatility skew, and smile asymmetry."
author: "gitsam"
ai_model: "gemini"
date_created: "2026-10-14"
date_updated: "2026-10-14"
status: "done"

# Design
style_view: "both"
style_theme: "dark"
style_art: "Terminal & HUD"
style_color: "Quant Emerald (--bg: #090d16; --fg: #e2e8f0; --accent: #10b981; --danger: #f43f5e;)"
style_font: "Modern Geometric (font-sans: 'Inter', 'Pretendard', sans-serif; font-mono: 'Fira Code', monospace;)"

# Tech Stack
tech_stack:
  - Vanilla JS (ES6+)
  - UnoCSS
  - Chart.js
---

# BTC Option Dashboard

비트코인(BTC) 옵션 체인의 내가격/외가격 행사가격별 프리미엄 곡률 및 내재변동성 스마일의 비대칭성을 추적하는 분석 대시보드이다.

## 핵심 기능

1. 옵션 체인 2계 미분 곡률 계산: 행사가격에 따른 옵션 가격 곡면의 볼록성(Convexity) 측정
2. 콜/풋 내재변동성 비대칭 왜도(Skew) 분석: 시장 참여자들의 상방 콜 대비 하방 풋 헤지 수요 정량화
3. CSV 파일 및 샘플 데이터 즉각 렌더링: 외부 서버 없이 로컬 CSV 파싱 및 동적 차트 갱신
4. 반응형 다크 테마 HUD 인터페이스: 고대비 색상을 통한 거래 신호 판독성 확보
