# Advanced Methods &amp; Algorithms — Interactive Tutorial

## 中文簡介

進階方法演算法互動式教學。收錄不會出現在教科書、但實際做 scRNA-seq / 空間轉錄體 / 多體學 / scLLMs 時很有殺傷力的數據方法與演算法——14 個主題，繁體中文 / 英文雙語並陳。

**章節：**

1. Chatterjee's ξ Correlation — 新型秩相關，捕捉任意函數依賴
2. HSIC &amp; Distance Correlation — 核方法與距離方法的獨立性檢定
3. Mutual Information — KSG、MINE、PIDC
4. Optimal Transport — Sinkhorn、Waddington-OT、MOSCOT
5. Persistent Homology (TDA) — 細胞狀態空間的拓撲結構
6. Manifold Learning — Diffusion Maps、PHATE、MDE
7. RNA Velocity &amp; Dynamics — scVelo、Dynamo、CellRank
8. Cycle-following — Tricycle、Cyclum、reCAT（循環軌跡）
9. Graph Signal Processing &amp; GNN — SpaGCN、STAGATE
10. Spatial Statistics — Moran's I、SPARK、nnSVG、BayesSpace
11. Variational Inference (VAE) — scVI / totalVI / MultiVI
12. Diffusion Models — scDiffusion、EvoDiff、RFdiffusion
13. scLLMs — scGPT、Geneformer、scFoundation + 2025 benchmark
14. Causal Inference — Perturb-seq、GEARS、CausalCell

每章包含：核心概念、演算法直覺、互動模擬、生物應用、R/Python 程式碼、自我檢測題。

直接在瀏覽器開啟 `index.html` 即可使用，無需安裝、無需伺服器。

## English Description

A bilingual (繁體中文 / English) interactive tutorial on advanced methods and algorithms for scRNA-seq, spatial transcriptomics, multi-omics, and scLLMs — 14 topics, covering everything from Chatterjee correlation to scLLM tokenization. Each chapter includes concept, algorithm intuition, interactive simulation, biological applications, R/Python code, and self-check quizzes.

Just open `index.html` in any modern browser — no build step, no server required.

## 檔案結構

```
advanced-methods-interactive-tutorial/
├── index.html                    # Hub 首頁
├── styles.css                    # 共用樣式（來自 scrna 教程模板）
├── i18n.js                       # 中英雙語切換
├── chatterjee.html               # Ch 1
├── hsic-dcor.html                # Ch 2
├── mutual-information.html       # Ch 3
├── optimal-transport.html        # Ch 4
├── persistent-homology.html      # Ch 5
├── manifold-learning.html        # Ch 6
├── rna-velocity.html             # Ch 7
├── cycle-following.html          # Ch 8
├── graph-signal-gnn.html         # Ch 9
├── spatial-statistics.html       # Ch 10
├── variational-inference.html    # Ch 11
├── diffusion-models.html         # Ch 12
├── scllms.html                   # Ch 13
├── causal-inference.html         # Ch 14
├── references/
│   └── index.html                # 14 章核心論文索引
└── quiz/
    └── index.html                # 互動式考題（含進度保存）
```

## 設計理念

這個科目（J_Advanced_Methods_進階方法演算法）的定位是「方法工具箱」，補足主流教科書與 scRNA-seq 標準流程之外的進階武器。每個主題的選取標準：

1. **不在標準教科書出現** — 是「酷招」而非基本功
2. **對 scRNA-seq / 空間 / 多體學 / scLLMs 有實際用處** — 不是純理論
3. **有對應軟體套件可用** — 學了能直接做
4. **有最新（2023–2026）論文支持** — 不是過時方法

未來可持續新增主題（例如 Neural ODE、Flow Matching、State-space models 等）作為 Ch 15+。
