(function () {
  "use strict";

  const answerKey = "ecb-skin-sim-answers-v1";
  const config = {
    0:  { radiance: 0,    tone: 0,    pigment: 0,    lines: 0,    eyes: 0,    nasolabial: 0,    texture: 0,    firmness: 0 },
    2:  { radiance: .07,  tone: .05,  pigment: .13,  lines: .10,  eyes: .10,  nasolabial: .06,  texture: .10,  firmness: .05 },
    5:  { radiance: .14,  tone: .11,  pigment: .27,  lines: .24,  eyes: .23,  nasolabial: .16,  texture: .24,  firmness: .14 },
    10: { radiance: .23,  tone: .19,  pigment: .44,  lines: .40,  eyes: .38,  nasolabial: .30,  texture: .41,  firmness: .27 }
  };
  const labels = { 0: "現在", 2: "2 年後", 5: "5 年後", 10: "10 年後" };
  let sourceCanvas = null;
  let futureCanvas = null;
  let selectedYear = 5;
  let reveal = 52;
  let analysisReveal = 50;
  let mountedScreen = null;
  let objectUrl = null;
  let professionalAnalysisCanvas = null;

  function savedAnswers() {
    try { return JSON.parse(sessionStorage.getItem(answerKey) || "[]"); } catch (_) { return []; }
  }

  function recordAnswer(text) {
    const clean = String(text || "").replace(/^\d{2}\s*/, "").trim();
    if (!clean) return;
    const answers = savedAnswers();
    if (!answers.includes(clean)) answers.push(clean);
    sessionStorage.setItem(answerKey, JSON.stringify(answers.slice(-20)));
  }

  function modifiers() {
    const text = savedAnswers().join(" ");
    const m = { radiance: 1, tone: 1, pigment: 1, lines: 1, eyes: 1, nasolabial: 1, texture: 1, firmness: 1 };
    if (/熬夜|睡眠|壓力|疲倦|不規律/.test(text)) { m.eyes += .28; m.radiance += .18; m.tone += .1; }
    if (/色斑|暗沉|膚色|曬斑|雀斑/.test(text)) { m.pigment += .35; m.tone += .14; }
    if (/細紋|皺紋|眼紋/.test(text)) { m.lines += .35; m.eyes += .08; }
    if (/鬆弛|輪廓|下顎|雙下巴|緊緻/.test(text)) { m.firmness += .38; m.nasolabial += .12; }
    if (/乾|缺水|粗糙|很少|沒有護理|不定期/.test(text)) { m.texture += .34; m.radiance += .12; }
    if (/40|45|50|55|60/.test(text)) { m.lines += .12; m.firmness += .12; m.texture += .08; }
    return m;
  }

  function mulberry32(seed) {
    return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  function coverCrop(imgW, imgH, outW, outH) {
    const scale = Math.max(outW / imgW, outH / imgH);
    const w = imgW * scale, h = imgH * scale;
    return { x: (outW - w) / 2, y: (outH - h) / 2, w, h };
  }

  function drawCover(ctx, image, x, y, width, height) {
    const sourceRatio = image.width / image.height, targetRatio = width / height;
    let sx = 0, sy = 0, sw = image.width, sh = image.height;
    if (sourceRatio > targetRatio) { sw = image.height * targetRatio; sx = (image.width - sw) / 2; }
    else { sh = image.width / targetRatio; sy = (image.height - sh) / 2; }
    ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
  }

  async function prepareImage(file) {
    if (!file || !file.type.startsWith("image/")) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    const bitmap = await createImageBitmap(file);
    const max = 1280;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = width;
    sourceCanvas.height = height;
    sourceCanvas.getContext("2d", { alpha: false }).drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    if (mountedScreen) { buildFuture(selectedYear); buildProfessionalAnalysis(); }
  }

  function ellipseGradient(ctx, x, y, rx, ry, color, alpha) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, color.replace("ALPHA", String(alpha)));
    g.addColorStop(.55, color.replace("ALPHA", String(alpha * .48)));
    g.addColorStop(1, color.replace("ALPHA", "0"));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  function buildFuture(year) {
    if (!sourceCanvas) return;
    const base = config[year] || config[5];
    const mod = modifiers();
    const p = Object.fromEntries(Object.keys(base).map(k => [k, Math.min(.72, base[k] * mod[k])]));
    const w = sourceCanvas.width, h = sourceCanvas.height;
    futureCanvas = document.createElement("canvas"); futureCanvas.width = w; futureCanvas.height = h;
    const ctx = futureCanvas.getContext("2d", { alpha: false });
    ctx.filter = `brightness(${1 - p.radiance * .30}) saturate(${1 - p.tone * .28}) contrast(${1 + p.texture * .08}) sepia(${p.tone * .13})`;
    ctx.drawImage(sourceCanvas, 0, 0); ctx.filter = "none";
    if (year > 0) {
      ctx.save(); ctx.globalCompositeOperation = "multiply";
      const warm = ctx.createLinearGradient(0, 0, w, h); warm.addColorStop(0, `rgba(110,76,67,${p.tone * .055})`); warm.addColorStop(1, `rgba(92,69,75,${p.tone * .10})`); ctx.fillStyle = warm; ctx.fillRect(0, 0, w, h); ctx.restore();

      const rnd = mulberry32(20260916);
      ctx.save(); ctx.globalCompositeOperation = "multiply";
      const spots = Math.round(14 + p.pigment * 52);
      for (let i = 0; i < spots; i++) {
        const x = w * (.25 + rnd() * .5), y = h * (.2 + rnd() * .54), r = w * (.004 + rnd() * .016);
        ellipseGradient(ctx, x, y, r, r * (.65 + rnd() * .5), "rgba(118,72,52,ALPHA)", p.pigment * (.025 + rnd() * .065));
      }
      ctx.restore();

      ctx.save(); ctx.globalCompositeOperation = "multiply";
      ellipseGradient(ctx, w * .38, h * .43, w * .12, w * .045, "rgba(72,55,75,ALPHA)", p.eyes * .13);
      ellipseGradient(ctx, w * .62, h * .43, w * .12, w * .045, "rgba(72,55,75,ALPHA)", p.eyes * .13);
      ellipseGradient(ctx, w * .45, h * .61, w * .07, w * .16, "rgba(84,60,58,ALPHA)", p.nasolabial * .08);
      ellipseGradient(ctx, w * .55, h * .61, w * .07, w * .16, "rgba(84,60,58,ALPHA)", p.nasolabial * .08);
      ellipseGradient(ctx, w * .5, h * .79, w * .31, w * .12, "rgba(73,55,70,ALPHA)", p.firmness * .10);
      ctx.restore();

      ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.lineCap = "round"; ctx.lineWidth = Math.max(.65, w / 950); ctx.strokeStyle = `rgba(78,59,60,${p.lines * .13})`;
      const line = (x1,y1,cx,cy,x2,y2) => { ctx.beginPath(); ctx.moveTo(w*x1,h*y1); ctx.quadraticCurveTo(w*cx,h*cy,w*x2,h*y2); ctx.stroke(); };
      const repeats = Math.max(1, Math.round(1 + p.lines * 5));
      for(let i=0;i<repeats;i++) { const d=i*.009; line(.31,.35+d,.38,.33+d,.44,.35+d); line(.56,.35+d,.62,.33+d,.69,.35+d); line(.37,.26+d,.5,.245+d,.63,.26+d); }
      line(.43,.51,.40,.61,.42,.70); line(.57,.51,.60,.61,.58,.70); ctx.restore();

      const noiseCanvas = document.createElement("canvas"); noiseCanvas.width = w; noiseCanvas.height = h;
      const noiseCtx = noiseCanvas.getContext("2d"), noise = noiseCtx.createImageData(w, h), data = noise.data, amount = p.texture * .055;
      for (let i = 0; i < data.length; i += 4) { const n = (rnd() - .5) * 255; data[i] = n > 0 ? 130 : 65; data[i+1] = n > 0 ? 115 : 58; data[i+2] = n > 0 ? 125 : 62; data[i+3] = Math.abs(n) * amount; }
      noiseCtx.putImageData(noise, 0, 0); ctx.save(); ctx.globalCompositeOperation = "soft-light"; ctx.drawImage(noiseCanvas, 0, 0); ctx.restore();
    }
    renderReveal();
    updateReadout(p);
  }

  function renderReveal() {
    const display = document.querySelector("[data-sim-canvas]");
    if (!display || !sourceCanvas) return;
    const dw = display.width, dh = display.height, ctx = display.getContext("2d", { alpha: false });
    const crop = coverCrop(sourceCanvas.width, sourceCanvas.height, dw, dh);
    ctx.clearRect(0,0,dw,dh); ctx.drawImage(futureCanvas || sourceCanvas,crop.x,crop.y,crop.w,crop.h);
    ctx.save(); ctx.beginPath(); ctx.rect(0,0,dw * reveal / 100,dh); ctx.clip(); ctx.drawImage(sourceCanvas,crop.x,crop.y,crop.w,crop.h); ctx.restore();
    const x = dw * reveal / 100; ctx.fillStyle="rgba(255,255,255,.92)"; ctx.fillRect(x-1,0,2,dh);
    document.querySelector(".ecsim-divider")?.style.setProperty("left", reveal + "%");
    const futureLabel = document.querySelector("[data-sim-future-label]"); if(futureLabel) futureLabel.textContent = labels[selectedYear];
  }

  function buildProfessionalAnalysis() {
    if (!sourceCanvas) return;
    const w = sourceCanvas.width, h = sourceCanvas.height;
    professionalAnalysisCanvas = document.createElement("canvas");
    professionalAnalysisCanvas.width = w; professionalAnalysisCanvas.height = h;
    const ctx = professionalAnalysisCanvas.getContext("2d", { alpha: false });
    ctx.drawImage(sourceCanvas, 0, 0);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const light = ctx.createLinearGradient(0, 0, w, h);
    light.addColorStop(0, "rgba(139,116,181,.08)");
    light.addColorStop(.55, "rgba(82,143,184,.34)");
    light.addColorStop(1, "rgba(110,88,172,.42)");
    ctx.fillStyle = light; ctx.fillRect(0, 0, w, h);
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = "overlay";
    ctx.strokeStyle = "rgba(218,236,255,.32)";
    ctx.lineWidth = Math.max(1, w / 900);
    for (let i = 1; i < 8; i++) {
      ctx.beginPath();
      ctx.ellipse(w * .5, h * (.18 + i * .075), w * (.17 + i * .02), h * (.025 + i * .004), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    const rnd = mulberry32(20260927);
    for (let i = 0; i < 110; i++) {
      const x = w * (.24 + rnd() * .52), y = h * (.18 + rnd() * .58), r = Math.max(1.2, w * (.0015 + rnd() * .003));
      ctx.fillStyle = i % 3 === 0 ? "rgba(238,194,227,.34)" : "rgba(173,224,242,.28)";
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    renderProfessionalReveal();
  }

  function renderProfessionalReveal() {
    const display = document.querySelector("[data-prof-canvas]");
    if (!display || !sourceCanvas || !professionalAnalysisCanvas) return;
    const dw = display.width, dh = display.height, ctx = display.getContext("2d", { alpha: false });
    const crop = coverCrop(sourceCanvas.width, sourceCanvas.height, dw, dh);
    ctx.clearRect(0, 0, dw, dh);
    ctx.drawImage(professionalAnalysisCanvas, crop.x, crop.y, crop.w, crop.h);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, dw * analysisReveal / 100, dh); ctx.clip();
    ctx.drawImage(sourceCanvas, crop.x, crop.y, crop.w, crop.h); ctx.restore();
    const x = dw * analysisReveal / 100;
    ctx.fillStyle = "rgba(255,255,255,.94)"; ctx.fillRect(x - 1, 0, 2, dh);
    document.querySelector(".ecpro-divider")?.style.setProperty("left", analysisReveal + "%");
  }

  function updateReadout(p) {
    const box = document.querySelector("[data-sim-readout]"); if (!box) return;
    const rows = [["光澤",p.radiance],["均勻度",p.tone],["色素情境",p.pigment],["細紋",p.lines],["眼周疲態",p.eyes],["乾燥紋理",p.texture],["輪廓提示",p.firmness]];
    box.innerHTML = rows.map(([name,v]) => `<span><b>${name}</b><i><em style="width:${Math.round(12+v*115)}%"></em></i></span>`).join("");
  }

  function markup() {
    return `<div class="ecsim" data-future-simulator>
      <header class="ecsim-head"><span>FUTURE SKIN VISUAL PROJECTION · V1</span><h2>你的肌膚<em>時間軸</em></h2><p>看看在不同生活及護理情境下，肌膚可能出現的視覺變化。</p></header>
      <div class="ecsim-layout"><div class="ecsim-stage"><canvas data-sim-canvas width="900" height="1060" aria-label="自拍肌膚時間軸視覺投影"></canvas><span class="ecsim-tag ecsim-tag--left">現在</span><span class="ecsim-tag ecsim-tag--right" data-sim-future-label>5 年後</span><i class="ecsim-divider"><b>↔</b></i></div>
      <aside class="ecsim-panel"><div class="ecsim-years" role="tablist" aria-label="選擇投影年份">${[0,2,5,10].map(y=>`<button type="button" role="tab" data-sim-year="${y}" class="${y===5?'is-active':''}"><b>${y===0?'NOW':y}</b><span>${y===0?'現在':y+' YEARS'}</span></button>`).join("")}</div>
      <label class="ecsim-range"><span><b>現在</b><b data-sim-range-label>5 年後</b></span><input type="range" min="0" max="100" value="52" aria-label="現在與未來視覺比較 Slider" data-sim-range></label>
      <div class="ecsim-readout"><strong>VISUAL PARAMETERS</strong><div data-sim-readout></div><small>強度會按本次問卷關注方向作情境調節，並非醫學風險分數。</small></div>
      <div class="ecsim-actions"><button type="button" data-sim-export>保存投影結果</button><a href="/tightening-dna-preview-ecb2026/#contact">了解我的緊緻方案 →</a></div></aside></div>
      <p class="ecsim-privacy">照片僅用於本次瀏覽器內的視覺投影；V1 不會將自拍傳送至外部 AI 圖像服務、Database 或永久儲存。這是視覺情境投影，並非醫學診斷或實際未來效果預測。</p>
      <section class="ecpro" data-professional-analysis>
        <header class="ecpro-complete"><span>ANALYSIS COMPLETE</span><h2>你的肌膚初步分析已完成</h2><p>根據你的回答及自拍影像，我們已為你建立初步肌膚狀態分析。</p></header>
        <aside class="ecpro-note"><b>影像分析提示</b><p>自拍環境中的光線、拍攝角度、距離、妝容及手機鏡頭差異，均可能影響影像判讀。網上影像分析屬初步參考，部分細紋、色素、毛孔及深層肌膚狀態未必能完整呈現。</p></aside>
        <section class="ecpro-fallback" aria-labelledby="ecpro-fallback-title">
          <div class="ecpro-fallback-copy"><span>PROFESSIONAL ANALYSIS NOTE</span><h2 id="ecpro-fallback-title">自拍分析 ≠ 專業肌膚診斷</h2><h3>有些老化訊號，未必能從一張自拍完整呈現。</h3><p>由於自拍時的光線、拍攝角度、表情、鏡頭距離及影像質素均可能影響分析結果，AI 影像只作肌膚變化趨勢參考，未必能 100% 反映你目前的真實肌膚狀況。</p><p>部分早期老化問題，例如細紋、皮膚彈性下降、輪廓支撐力減弱、眼周變化及不同皮膚層次的老化，單靠自拍未必能清楚辨識。</p></div>
          <div class="ecpro-signals"><div class="ecpro-signals-head"><span>REFERENCE VISUAL</span><h3>常見老化訊號參考</h3></div><div class="ecpro-signals-layout"><figure><img src="/tightening-dna-preview-assets/skin-ageing-signals-reference-2026-09-28.png" alt="常見老化訊號參考人物，並非客人本人"></figure><ol><li><b>01</b>眼周細紋</li><li><b>02</b>眼袋／眼周鬆弛</li><li><b>03</b>額紋</li><li><b>04</b>法令紋</li><li><b>05</b>中面部下垂</li><li><b>06</b>嘴角下垂</li><li><b>07</b>下顎線模糊</li><li><b>08</b>雙下巴／輪廓鬆弛</li><li><b>09</b>頸紋</li><li><b>10</b>膚質／毛孔／彈性變化</li></ol></div><p>以上為常見老化訊號示意，實際肌膚狀況需按個人皮膚、輪廓及生活狀態評估。</p></div>
          <div class="ecpro-fallback-cta"><h3>想知道真正影響你的，是哪一層？</h3><p>到店後，美容顧問會配合你的實際肌膚狀態、輪廓、鬆弛位置及護理習慣，進行更完整的緊緻 DNA 專業分析。</p><a href="/tightening-dna-preview-ecb2026/#contact">預約到店專業肌膚分析 →</a></div>
        </section>
        <div class="ecpro-intro"><span>PROFESSIONAL SKIN ANALYSIS</span><h2>鏡頭看見的，<em>只是肌膚的一部分</em></h2><p>到店進一步了解肉眼未必看得見的肌膚狀態</p></div>
        <div class="ecpro-visual">
          <canvas data-prof-canvas width="1080" height="760" aria-label="自然光與專業肌膚分析視覺比較"></canvas>
          <div class="ecpro-label ecpro-label--normal"><b>NORMAL LIGHT</b><span>自然光／正常肌膚狀態</span></div>
          <div class="ecpro-label ecpro-label--analysis"><b>PROFESSIONAL ANALYSIS</b><span>專業肌膚分析視覺</span></div>
          <i class="ecpro-divider"><b>↔</b></i>
          <input type="range" min="0" max="100" value="50" aria-label="自然光與專業分析比較 Slider" data-prof-range>
        </div>
        <p class="ecpro-visual-note">拖動比較自然光影像與專業分析情境。分析光層為版面示意，實際結果以到店檢測為準。</p>
        <div class="ecpro-dimensions">
          <div class="ecpro-radar" aria-label="五項專業肌膚分析維度，沒有顯示虛構分數">
            <svg viewBox="0 0 520 500" role="img" aria-hidden="true"><g class="ecpro-radar-frame"><polygon points="260,48 454,190 380,418 140,418 66,190"/><line x1="260" y1="250" x2="260" y2="48"/><line x1="260" y1="250" x2="454" y2="190"/><line x1="260" y1="250" x2="380" y2="418"/><line x1="260" y1="250" x2="140" y2="418"/><line x1="260" y1="250" x2="66" y2="190"/></g><polygon class="ecpro-radar-fill" points="260,105 395,208 344,365 176,365 125,208"/></svg>
            <span class="ecpro-axis ecpro-axis--1">細紋表現</span><span class="ecpro-axis ecpro-axis--2">毛孔狀態</span><span class="ecpro-axis ecpro-axis--3">色素分布</span><span class="ecpro-axis ecpro-axis--4">肌膚紋理</span><span class="ecpro-axis ecpro-axis--5">膚色均勻度</span>
            <div><b>5 DIMENSIONS</b><span>專業肌膚分析</span></div>
          </div>
          <div class="ecpro-dimension-copy"><span>IN-STORE ANALYSIS</span><h3>五個維度，進一步理解肌膚狀態</h3><p>這些肌膚資訊，需要在較穩定的光源及專業檢測環境下進一步分析。</p><ul><li>細紋表現</li><li>毛孔狀態</li><li>色素分布</li><li>肌膚紋理</li><li>膚色均勻度</li></ul></div>
        </div>
        <div class="ecpro-journey"><article><span>ONLINE</span><h3>網上肌膚測試</h3><p>自拍影像<br>＋ 生活及肌膚問卷<br>＋ 初步肌膚方向</p></article><i><b>FIRST STEP</b><span>→</span></i><article><span>IN-STORE</span><h3>到店專業肌膚分析</h3><p>穩定檢測環境<br>＋ 多維度肌膚觀察<br>＋ 美容師專業評估<br>＋ 個人化護理方向</p></article></div>
        <div class="ecpro-cta"><span>PROFESSIONAL SKIN ANALYSIS</span><h2>完成最後一步：<em>專業肌膚分析</em></h2><p>網上測試讓你先了解肌膚方向。到店後，我們會在較穩定的光源及檢測環境下，進一步觀察肌膚紋理、細紋、毛孔、色素及整體狀態，再結合美容師專業評估，為你制定更合適的護理方向。</p><a href="/tightening-dna-preview-ecb2026/#contact">預約到店專業肌膚分析 →</a></div>
        <section class="ec-voucher" data-experience-voucher><span>TEST / PREVIEW VOUCHER</span><h2>您的到店體驗憑證</h2><p>輸入會員編號或電話，領取 TEST 體驗憑證。現階段只作已登記識別碼，並不代表已完成正式會員身份驗證。</p><form><input name="identifier" aria-label="會員編號或電話" placeholder="會員編號或電話" autocomplete="off" required><button>領取憑證</button></form><p data-voucher-message></p><article data-voucher-card hidden></article></section>
      </section>
    </div>`;
  }

  function exportImage() {
    if (!sourceCanvas || !futureCanvas) return;
    const out=document.createElement("canvas"); out.width=1400; out.height=900; const ctx=out.getContext("2d",{alpha:false});
    ctx.fillStyle="#faf7fb";ctx.fillRect(0,0,out.width,out.height);ctx.fillStyle="#3c3342";ctx.font="44px Georgia";ctx.fillText("MY SKIN TIMELINE",60,72);ctx.fillStyle="#8b7893";ctx.font="20px Arial";ctx.fillText(`現在  vs  ${labels[selectedYear]}`,60,108);
    drawCover(ctx,sourceCanvas,60,150,620,650);drawCover(ctx,futureCanvas,720,150,620,650);
    ctx.fillStyle="rgba(49,39,54,.78)";ctx.fillRect(60,755,620,45);ctx.fillRect(720,755,620,45);ctx.fillStyle="#fff";ctx.font="18px Arial";ctx.fillText("現在",82,784);ctx.fillText(labels[selectedYear],742,784);ctx.fillStyle="#706775";ctx.font="16px Arial";ctx.fillText("視覺情境投影｜非實際效果預測｜EC Beauty",60,852);
    out.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`ec-beauty-skin-timeline-${selectedYear}y.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},"image/png");
  }

  function professionalMarkup() {
    const shell = document.createElement("div");
    shell.innerHTML = markup();
    return shell.querySelector("[data-professional-analysis]")?.outerHTML || "";
  }

  function attachProfessional(section) {
    section.querySelector("[data-prof-range]")?.addEventListener("input", e => {
      analysisReveal = Number(e.target.value);
      renderProfessionalReveal();
    });
    new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }), { threshold: .18 }).observe(section);
    buildProfessionalAnalysis();
    const form=section.querySelector('[data-experience-voucher] form');
    form?.addEventListener('submit',async e=>{e.preventDefault();const root=e.currentTarget.closest('[data-experience-voucher]'),msg=root.querySelector('[data-voucher-message]'),card=root.querySelector('[data-voucher-card]'),button=e.currentTarget.querySelector('button'),identifier=new FormData(e.currentTarget).get('identifier');button.disabled=true;msg.textContent='正在建立 TEST 憑證…';try{const response=await fetch('/api/campaign-test/claim',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({campaignId:'tightening_dna_facial_2026',identifier})}),data=await response.json();if(!response.ok)throw new Error(data.error||'CLAIM_FAILED');card.hidden=false;card.innerHTML=`<img src="${data.voucher.qrImageDataUrl}" alt="個人 TEST 憑證 QR Code"><div><small>${data.duplicate?'此會員禮遇已領取':'領取成功'}</small><h3>${data.reward.name}</h3><b>${data.voucher.displayCode}</b><p>狀態：${data.voucher.status}<br>到期：${new Date(data.voucher.expiresAt).toLocaleDateString('zh-HK')}</p><em>到店時出示此 QR Code 或核銷碼即可。</em></div>`;msg.textContent=''}catch(err){msg.textContent=err.message==='INVALID_IDENTIFIER'?'請輸入有效會員編號或電話':'暫時無法建立 TEST 憑證，請稍後再試。'}finally{button.disabled=false}});
  }

  function mountResult(screen) {
    if (screen.querySelector("[data-professional-analysis]")) return;
    screen.insertAdjacentHTML("beforeend", professionalMarkup());
    const section = screen.querySelector("[data-professional-analysis]");
    if (section) attachProfessional(section);
  }

  function mount(screen) {
    if (screen.querySelector("[data-future-simulator]")) return;
    mountedScreen=screen; screen.insertAdjacentHTML("afterbegin",markup());
    screen.classList.add("has-ecsim-v1");
    screen.addEventListener("click",e=>{const y=e.target.closest("[data-sim-year]");if(y){const nextYear=Number(y.dataset.simYear);if(nextYear===0)reveal=100;else if(selectedYear===0&&reveal===100)reveal=52;selectedYear=nextYear;screen.querySelectorAll("[data-sim-year]").forEach(b=>b.classList.toggle("is-active",b===y));screen.querySelector("[data-sim-range-label]").textContent=labels[selectedYear];screen.querySelector("[data-sim-range]").value=String(reveal);buildFuture(selectedYear)}if(e.target.closest("[data-sim-export]"))exportImage()});
    screen.querySelector("[data-sim-range]").addEventListener("input",e=>{reveal=Number(e.target.value);renderReveal()});
    if (!sourceCanvas) {
      const img=document.querySelector('.skin-journey__scanner-instrument img[src^="blob:"]')||document.querySelector('.skin-journey__upload img[src^="blob:"]');
      if(img?.src) fetch(img.src).then(r=>r.blob()).then(b=>prepareImage(new File([b],"portrait.jpg",{type:b.type||"image/jpeg"}))).catch(()=>{});
    } else { buildFuture(selectedYear); buildProfessionalAnalysis(); }
  }

  document.addEventListener("click", e => { const a=e.target.closest(".skin-journey__answer"); if(a) recordAnswer(a.textContent); }, true);
  document.addEventListener("change", e => { if(e.target.matches('.skin-journey__upload input[type="file"]') && e.target.files?.[0]) prepareImage(e.target.files[0]); }, true);
  const observer=new MutationObserver(()=>{if(!location.pathname.endsWith("/ai-skin-journey"))return;const timeScreen=document.querySelector(".skin-journey__time");if(timeScreen)mount(timeScreen);const resultScreen=document.querySelector(".skin-journey__result");if(resultScreen)mountResult(resultScreen)});
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
