# Changelog and Backups

## 版本證據

- V0 基線：commit `dac19a2`，訊息 `Harden five-step journey asset loading`
- V1：commit `9ab0354`，訊息 `Add local future skin visual simulator`
- V1 diff：3 files changed，192 insertions

## V1 新增／改動檔案

- 新增 `tightening-dna-preview-dist/future-simulator.js`
- 新增 `tightening-dna-preview-dist/future-simulator.css`
- 修改 `tightening-dna-preview-ecb2026/index.html`，只加入上述 asset references

## 未改動的核心檔案

- V1 沒有修改 `tightening-dna-preview-dist/app.js`
- V1 沒有修改 `tightening-dna-preview-dist/app.css`

這證明 V1 是疊加於既有 V0 bundle 的獨立功能層，而不是把 V0 renderer 改寫；亦證明 V0 原 UI code 仍留在現行 bundle。

## 本次 Audit 變更

只新增本審計文件：

- `audit/pre-v2/01_Architecture_and_API.md`
- `audit/pre-v2/02_Diagnostics_and_Testing.md`
- `audit/pre-v2/03_Changelog_and_Backups.md`

沒有修改 simulator、CSS、HTML、圖片、Production 或 Preview build；沒有部署；沒有開始 V2。

## Rollback / Backup

本次不需要網站 rollback，因為沒有網站變更。若不需要保留報告，只需移除 `audit/pre-v2/` 三份文件；網站執行結果完全不受影響。
