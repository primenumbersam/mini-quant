---
# Core
title: "2-Factor Bernoulli Expected Return & Kelly Calculator"
description: "Interactive quantitative dashboard calculating 4-state expected return, weighted risk-reward ratio, and optimal Kelly fraction based on macro and micro binary probabilities."
author: "gitsam"
ai_model: "gemini"
date_created: "2026-10-14"
date_updated: "2026-10-14"
status: "done"

# Design
style_view: "both"
style_theme: "both"
style_art: "Minimalist"
style_color: "Achromatic (--bg: #0a0a0a; --fg: #fafafa; --muted: #737373; --accent: #ffffff;)"
style_font: "System Native (font-sans: system-ui, -apple-system, sans-serif; font-mono: ui-monospace, SFMono-Regular, monospace;)"

# Tech Stack
tech_stack:
  - Vanilla JS (ES6+)
  - UnoCSS
  - Chart.js
  - KaTeX
---

# Expected Return Calculator

거시(Macro) 및 미시(Micro) 이항 확률을 결합한 4개 상태(State) 기반의 기대수익률과 켈리 베팅 비율을 계산하는 순수 클라이언트 정량 분석 도구이다.

## 핵심 기능

1. 4개 상태 결합 확률 모델: 독립적 사건에 대한 확률 가정을 통한 4개 상태 시나리오 자동 연산
2. 손익비 가중 기대값 도출: 비대칭 손익비 조건 하에서의 확률적 우위(Edge) 검증
3. 뉴턴-랩슨(Newton-Raphson) 켈리 배분 비율 계산기: 연속 복리 성장률 극대화를 위한 최적 배분 비율 산출
4. 반응형 민감도 차트: 확률 변화에 따른 기대수익률 곡면 시각화
