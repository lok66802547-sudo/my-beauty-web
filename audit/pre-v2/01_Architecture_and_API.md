# EC Beauty Future Skin Simulator：V0 → V1 架構審計

審計日期：2026-09-16  
比較範圍：`dac19a2`（V1 前基線／本文稱 V0）→ `9ab0354`（V1）  
性質：唯讀審計；沒有修改或部署網站。

## 結論摘要

V1 **有新增真正的 Canvas 影像處理模組**，並非純粹替 V0 加年份按鈕；但它的主要視覺基礎仍是整張照片的全局色調改變。V0 本身沒有老化影像處理引擎，只有原相、CSS 儀器外框、`TIME × CARE` 訊號層及問卷／時間控制。V1 新增年份、Slider、問卷 modifiers、Export，以及 Canvas overlays，但沒有 Face Landmark、Face Mesh、皮膚分割或真正 Face Mask。

## 1. Version 0 Processing Architecture

V0 位於打包後的 `tightening-dna-preview-dist/app.js` 與 `app.css`：

- 相片直接以 `<img src={uploadedBlobUrl}>` 顯示。
- `Time` 與 `Care` 只計算 CSS custom properties：`--age`、`--care`、`--intensity`。
- `--intensity` 亦用作 `.skin-journey__scanner-signal` 的 opacity。
- `.skin-journey__capsule-glass` 是固定透明漸層外框，沒有影像濾鏡。
- `.skin-journey__scanner-instrument img` 沒有動態 Canvas 處理、區域遮罩或幾何變形。
- 原頁文案更明確表示該 Scanner「不使用……視覺濾鏡」，用途是教育性 `Time × Care` 探索。

因此，V0 的所謂未來肌齡體驗是 **UI／概念展示**，不是 pixel-level aging renderer。它並不存在一套可殘留到 V1 的「變暗老化算法」。

## 2. Version 1 Processing Architecture

V1 在 commit `9ab0354` 新增獨立模組：

- `tightening-dna-preview-dist/future-simulator.js`
- `tightening-dna-preview-dist/future-simulator.css`
- `tightening-dna-preview-ecb2026/index.html` 只新增上述 JS/CSS 引用

V1 沒有改動原有 `app.js` 或 `app.css`。它以 `MutationObserver` 等待原 V0 的 `.skin-journey__time` 出現，再插入新的 Simulator UI，並以 CSS 隱藏 V0 的 time UI。架構屬於 **add-on overlay module**，不是重構原 React source。

處理流程：

1. 取得客人上載的 Blob 圖片。
2. `createImageBitmap()` 解碼，長邊最多縮至 1280px。
3. 將原相畫入 `sourceCanvas`。
4. 根據 0／2／5／10 年 config 加上問卷文字關鍵字 modifier。
5. 在 `futureCanvas` 執行全局 filter、全圖 tone overlay、固定座標 overlays、細紋 paths、全圖 noise。
6. 以 clipping rectangle 組合「現在 ↔ 未來」Slider。
7. Export 時把原相和未來相畫入另一張 1400×900 Canvas。

## 3. V0 → V1 Code Diff

Git diff 顯示只涉及 3 個檔案、192 行新增：

| 項目 | V0 | V1 |
|---|---|---|
| 原相顯示 | `<img>` | Canvas copy |
| 2/5/10 年 | 概念性 Time control | 有獨立 config |
| 問卷影響 | UI/profile | 文字關鍵字 modifiers |
| 全局 filter | 無 | brightness/saturation/contrast/sepia |
| 色斑 | 無 | 固定矩形範圍內隨機橢圓 |
| 細紋 | 無 | 固定百分比 Canvas 曲線 |
| 眼周／法令 | 無 | 固定百分比橢圓陰影 |
| Texture | 無 | 全圖 pseudo-random noise |
| Face Landmark | 無 | 無 |
| Face Mask | 無 | 無 |
| 幾何變形 | 無 | 無 |
| Slider / Export | 無 | 有 |

### A. V1 是否真正更換 Image Processing Engine？

是，V1 新增了 V0 沒有的 Canvas renderer。但它不是以 Face-aware engine 取代舊 engine，因為 V0 根本沒有 pixel processor。準確說法是：**V1 在 V0 UI 上外掛第一代 Canvas renderer**。

### B. V0 哪些 code 仍存在？

原本 React journey、上載流程、問卷、原相 `<img>`、Time/Care UI、scanner glass/signal 全部仍在 bundle；V1 只隱藏部分舊 UI並讀取其 Blob 圖片。這些殘留主要影響 DOM 與 UI，不會再替 V1 相片疊加 brightness 或 saturation。

### C. 是否有舊 filter 繼續影響 V1？

沒有證據顯示 V0 有舊的相片 brightness／contrast／saturation／sepia／opacity filter。現在看到的全局濾鏡全部來自 V1 `future-simulator.js`。

## 4. Current Global Filter List

V1 在未來圖整張 Canvas 上先執行：

```text
brightness(1 - radiance × 0.30)
saturate(1 - tone × 0.28)
contrast(1 + texture × 0.08)
sepia(tone × 0.13)
```

然後再以 `multiply` 疊一層覆蓋整張照片的啡紫線性漸層。沒有 `hue-rotate`；沒有整張輸出 opacity，但每個 overlay 有自己的 alpha。

## 5. Current Local Aging Effect List

| 效果 | 是否 Render | 定位方法 | 真正 Face-localized？ |
|---|---|---|---|
| Fine Lines | 是 | 固定 normalized Canvas quadratic paths | 否 |
| Pigmentation | 是 | x=25–75%、y=20–74% 隨機 soft ellipses | 否 |
| Eye Shadow | 是 | 固定 x=38/62%、y=43% 橢圓 | 否 |
| Nasolabial | 是 | 固定 x=45/55%、y=61% 橢圓 | 否 |
| Texture | 是 | 整張相 `ImageData` noise + soft-light | 否 |
| Firmness | 只有陰影 cue | 固定 x=50%、y=79% 大橢圓 | 否；沒有輪廓變形 |

「局部」只表示程式把圖形畫在畫布某個固定區域；它不等於已辨識客人的眼、面頰或 jawline。

## 6. Face Landmark / Face Mask

**NO FACE LANDMARK。** 目前沒有 MediaPipe、TensorFlow.js face landmarks、Face Mesh、browser detector 或等效 library。

**NO FACE MASK。** 目前沒有由 landmarks 建立的 forehead、eye、cheek、nasolabial、jawline polygon，也沒有 skin segmentation。所有位置都以整張圖片寬高的固定比例推算。

## 7. 建議 V2 Architecture（Option B）

推薦 Browser-side Face Landmark + Regional Masks + Procedural Rendering：

```text
自拍／上載
  → resize 至推論尺寸
  → 單次 Face Landmark inference
  → 將 landmark 映射回原圖座標
  → 建立 forehead / eye / cheek / nasolabial / jawline masks
  → 年份 config × 問卷 modifier
  → 每區域獨立 procedural layers
  → compositing（Exposure 基本鎖定）
  → Slider / Export
```

建議使用 `@mediapipe/tasks-vision` 的 Face Landmarker；官方 Web API能在單張圖片輸出 3D face landmarks，亦可提供 facial transformation matrix，適合 effects rendering。V2 只需對上載相片跑一次 `IMAGE` mode，再 cache landmarks；不應把 inference 放在每次 Slider 移動或年份切換中。[Google Face Landmarker for Web](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js)

### 建議新增檔案

- `face-landmark-engine.js`：模型載入、單次偵測、confidence/error handling
- `face-regions.js`：landmarks → 五個區域 polygons/masks
- `aging-config.js`：年份與問卷 parameter vector
- `aging-renderer.js`：regional texture/lines/pigment/shadow compositing
- `aging-worker.js`：必要時移走推論／重繪工作
- `face_landmarker.task`：同源託管模型 asset
- 對應 unit、visual regression、mobile smoke tests

V2 初版仍不建議做大型幾何下垂。可先以 landmark-aligned jaw/cheek masks 加局部 softness/shadow；若日後做 mesh warp，必須另設 identity-preservation QA。
