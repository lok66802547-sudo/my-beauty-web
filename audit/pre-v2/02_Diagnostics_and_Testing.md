# Diagnostics and Testing

## 審計方法

- 比較 Git commits `dac19a2..9ab0354`。
- 檢查 V0 打包後 React DOM、CSS selectors 與 CSS custom properties。
- 逐行檢查 V1 Canvas compositing、坐標、alpha、blend mode 及問卷 modifier。
- 檢查 dependency/use sites，搜尋 face landmark、mesh、segmentation、mask、MediaPipe、TensorFlow.js。
- 沒有修改或部署網站。

## 「10 年後只是變暗」Root Cause

根因不是單一 bug，而是視覺權重與定位架構共同造成：

1. **最先套用、覆蓋面積最大的效果就是全局 brightness / saturation。** 10Y 基礎 radiance 為 0.23，因此單這一步 brightness 已降至約 0.931；問卷 modifier 可再加深。
2. tone 同時降低全圖 saturation、增加 sepia，再疊全圖 multiply 啡紫漸層，所以整體容易灰暗。
3. 局部效果 alpha 很低。例如 10Y 基礎 fine-lines stroke alpha 約 `0.40 × 0.13 = 0.052`；eye shadow 中央 alpha 約 `0.38 × 0.13 = 0.0494`，視覺重量遠低於全圖色調改變。
4. 局部效果使用固定圖片百分比位置。自拍裁切、頭部角度或人臉位置一變，線條與陰影便可能離開正確皮膚區域，令其看似沒有生效。
5. 色斑與 noise 沒有 skin mask，部分效果可能落在頭髮、背景或衣服上，不能形成可信的「皮膚老化」。
6. firmness 只是下方大橢圓陰影，沒有 jawline mask、mesh warp 或局部輪廓運算，不能真正表達鬆弛。

## 逐項 Render 判定

### Fine Lines

有真正呼叫 Canvas path/stroke，也會隨年份增加重複線數；因此不是空變數。但位置固定於假定的眼周、額頭及法令區，沒有對齊真人 landmarks，alpha 又偏低，所以可見度及可信度有限。

### Pigmentation

有真正生成 deterministic soft ellipses，並用 multiply 疊加。但分布只受整張圖的矩形範圍限制，不會避開眼白、嘴唇、頭髮或背景，也不會跟面部旋轉。

### Eye / Nasolabial Effects

有畫橢圓陰影，但「localized」只是固定 canvas coordinates；不是 face-localized。斜臉、近鏡或自拍偏位時會錯位。

### Texture

有真正逐 pixel 生成 noise layer，然後以 soft-light 合成。但它覆蓋全圖，不是 skin texture mask。

### Firmness

沒有真正輪廓或幾何變化；只有固定 jaw 下方陰影 cue。

## Option A / B / C 評估

| 方向 | 能否改善現況 | 成本 | 主要限制 | 判斷 |
|---|---|---:|---|---|
| A Global Filter + Texture | 只能小幅改善 | 低 | 仍不知道眼／法令／jawline 在哪裡 | 不建議作 V2 主線 |
| B Browser Face Landmark + Masks | 能精準放置局部效果 | 中 | 模型下載、WASM、手機效能與 WebView 相容 | **建議** |
| C External Generative AI | 可做更大外觀變化 | 高且持續 | 成本、隱私、identity drift、等待時間 | 暫不採用 |

## Option B 可行性

可在目前前端實現。MediaPipe 官方 Web/JS 版本透過 `@mediapipe/tasks-vision` 提供 Face Landmarker，結果包含每張臉的 landmark mesh；官方示例資料顯示每張臉可有 478 landmarks。它很適合為眼周、額頭、面頰、法令與 jawline 建立 polygon masks。[Google Face Landmarker for Web](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js)

但要注意官方亦明確指出 `detect()` / `detectForVideo()` 是同步操作，會阻塞 UI thread；如做影片應使用 Web Worker。今次是單張自拍，風險較低，但仍應在 resize 後只推論一次、顯示 loading，並視實機結果決定是否移入 worker。[Google Face Landmarker performance note](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js#run_the_task)

## Mobile Performance Risk

風險等級：中等，可控。

- 首次下載 WASM 與 model 會增加載入時間；應 lazy-load，只在進入 simulator 後下載並同源快取。
- iOS Safari、Android Chrome 及微信內置 WebView 的 WASM／memory／camera 行為需分別實測。
- 1280px 全圖 noise 每次重建會分配大量 `ImageData`；V2 應把推論圖縮至 512–768px，顯示／Export renderer 可另用較高解像度。
- 不要在 Slider 的每一個 `input` event 重跑 landmarks 或重建 noise；cache base、landmarks、masks及各年份結果。
- WebView memory 緊張時應釋放 bitmap、object URL、temporary canvases。
- 多人或無人臉要有明確 fallback，不應偷偷改回全局變暗模式。

## V2 驗收建議

1. 正面、45°、不同臉部大小、偏左偏右自拍各一張。
2. Overlay debug mode 顯示 forehead/eyes/cheeks/nasolabial/jaw masks，先驗證定位。
3. 以 pixel-diff 驗證背景與衣服基本不變，變化主要集中面部 skin regions。
4. NOW 與 10Y 的全圖平均亮度差設上限，避免再以 exposure 充當老化。
5. 眼紋、額紋、色斑各有獨立開關，做 ablation screenshot，證明每層真的 Render。
6. 375/390/430px，在 iPhone Safari、Android Chrome、微信 WebView 測試載入、切換與 Export。
7. 若 landmark confidence 太低、多人、遮擋或側臉超出支援範圍，停止模擬並提示重新拍攝。
