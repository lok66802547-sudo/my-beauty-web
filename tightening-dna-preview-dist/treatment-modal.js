(() => {
  const treatments = [
    { number: "01", name: "易思面部提拉護理" },
    { number: "02", name: "易思緊膚咒" }
  ];
  let activeTreatment = null;
  let previousFocus = null;

  const placeholder = (label) => `<div class="tdna-placeholder"><span>${label}</span><small>CONTENT TO BE PROVIDED</small></div>`;

  const LIFTING_ASSET = "/tightening-dna-preview-assets/lifting-treatment";

  function liftingDetailMarkup(treatment) {
    const benefits = [
      ["輪廓緊緻", "提升面部支撐感，令整體輪廓視覺更俐落。"],
      ["下顎線條", "針對下半面及雙下巴位置，改善輪廓模糊感。"],
      ["細紋與法令位置", "改善法令位置、嘴角及面部細紋的視覺狀態。"],
      ["眼周緊實", "照顧輕微眼袋、眼周鬆弛及細紋關注。"],
      ["膠原與彈性支撐", "透過能量作用啟動膠原及彈力纖維重塑過程。"],
      ["毛孔與肌膚紋理", "令肌膚觸感及視覺更平滑、細緻和緊實。"]
    ];
    const concerns = [
      ["輪廓開始模糊", "希望改善面部輕度鬆弛、下顎線或下半面支撐感。"],
      ["細紋及法令位置", "關注法令紋、嘴角、眼周或面部細紋的視覺變化。"],
      ["眼周輕度鬆弛", "希望以全面部護理同時照顧眼周緊實及輕微眼袋。"],
      ["紋理與緊實度", "關注毛孔、肌膚粗糙感、彈性及整體緊實度。"]
    ];
    const cases = [
      ["01", "下顎線 / 下半面輪廓", "case-01-jawline.jpg", "觀察下顎線清晰度及下半面輪廓的自然改善。"],
      ["02", "法令紋 / 嘴角支撐", "case-02-lower-face.jpg", "觀察法令位置、嘴角及下半面支撐感的視覺變化。"],
      ["03", "眼周 / 輕微眼袋 / 細紋", "case-03-eye.jpg", "觀察眼周緊實感、輕微眼袋及細紋的自然改善。"],
      ["04", "毛孔 / 細紋 / 肌膚紋理", "case-04-texture.jpg", "觀察毛孔、紋理、細紋及肌膚緊實度的視覺變化。"]
    ];
    return `
      <div class="tdna-modal__backdrop" data-treatment-close></div>
      <section class="tdna-modal__panel" role="dialog" aria-modal="true" aria-labelledby="tdna-modal-title" tabindex="-1">
        <header class="tdna-modal__bar">
          <a class="tdna-modal__brand" href="#top" data-treatment-close><span>EC BEAUTY</span><small>TIGHTENING DNA / TREATMENT DETAIL</small></a>
          <button class="tdna-modal__close" type="button" data-treatment-close aria-label="關閉療程詳情"><span>Close</span><b aria-hidden="true">×</b></button>
        </header>
        <nav class="tdna-modal__nav" aria-label="療程詳情章節">
          <a href="#tdna-detail-01"><b>01</b><span>療程</span></a><a href="#tdna-detail-02"><b>02</b><span>功效</span></a><a href="#tdna-detail-03"><b>03</b><span>原理</span></a><a href="#tdna-detail-04"><b>04</b><span>適合對象</span></a><a href="#tdna-detail-05"><b>05</b><span>方案</span></a><a href="#tdna-detail-06"><b>06</b><span>效果</span></a>
        </nav>
        <div class="tdna-modal__content tdna-lifting-detail">
          <section class="tdna-detail tdna-detail--hero" id="tdna-detail-01">
            <div class="tdna-detail__number">01 <span>TREATMENT</span></div>
            <div class="tdna-detail__hero-grid">
              <div class="tdna-detail__hero-copy"><p>EC BEAUTY / TIGHTENING DNA</p><h2 id="tdna-modal-title">${treatment.name}</h2><div class="tdna-content-field"><span>療程核心定位 / ONE-LINE BENEFIT</span><p>三重科技協同，由肌底啟動膠原及彈力支撐，逐步改善面部緊實度與輪廓線條。</p></div><div class="tdna-stat-row"><div><b>51%</b><span>膠原層資料</span></div><div><b>35%</b><span>緊緻度資料</span></div><div><b>42%</b><span>皺紋資料</span></div></div><small class="tdna-research-note">原廠／研究資料指標；測試條件、療程安排及個人效果可能不同，並非每位客人的效果保證。</small></div>
              <figure class="tdna-visual tdna-visual--hero"><img src="${LIFTING_ASSET}/lifting-hero.jpg" alt="易思面部提拉護理主視覺與原廠研究數據"><figcaption>緊緻上揚，由肌底開始</figcaption></figure>
            </div>
          </section>

          <section class="tdna-detail" id="tdna-detail-02"><div class="tdna-detail__number">02 <span>BENEFITS</span></div><header><p>WHAT ARE WE IMPROVING?</p><h3>你正在改善甚麼？</h3></header><div class="tdna-benefit-grid">${benefits.map((item,index)=>`<article class="tdna-benefit-placeholder"><i>${String(index+1).padStart(2,"0")}</i><span>${item[0]}</span><small>${item[1]}</small></article>`).join("")}</div></section>

          <section class="tdna-detail" id="tdna-detail-03"><div class="tdna-detail__number">03 <span>TECHNOLOGY</span></div><header><p>HOW IT WORKS</p><h3>它如何作用？</h3></header><div class="tdna-tech-grid"><article><b>01</b><span>單極射頻</span><small>MONOPOLAR RF</small><p>將均勻熱能作用至真皮層，支持膠原纖維收縮與後續重塑。</p></article><article><b>02</b><span>超聲波</span><small>ULTRASOUND</small><p>協同能量傳導，作用於不同組織層次，強化肌膚支撐結構。</p></article><article><b>03</b><span>即時冷卻</span><small>COOLING / TEMPERATURE CONTROL</small><p>同步保護表皮並協助控制療程舒適度，讓能量更精準地作用。</p></article></div><div class="tdna-flow" aria-label="療程作用流程"><span>能量作用</span><i>→</i><span>膠原重塑</span><i>→</i><span>彈性支撐提升</span><i>→</i><span>輪廓更緊緻</span></div><div class="tdna-tech-visuals"><figure class="tdna-visual"><img src="${LIFTING_ASSET}/triple-technology.jpg" alt="單極射頻、超聲波與即時冷卻三重科技協同示意"><figcaption>三重技術協同作用示意</figcaption></figure><figure class="tdna-visual"><img src="${LIFTING_ASSET}/collagen-structure.jpg" alt="療程前與療程後三個月肌膚膠原及彈力支撐結構示意"><figcaption>療程前 vs 療程後3個月：膠原與彈性支撐重塑示意</figcaption></figure></div><p class="tdna-disclaimer">結構圖及時間標示為原理／研究資料示意；實際反應及呈現時間會因膚質、年齡、輪廓狀態與護理方案而異。</p></section>

          <section class="tdna-detail" id="tdna-detail-04"><div class="tdna-detail__number">04 <span>SUITABILITY</span></div><header><p>IS THIS FOR ME?</p><h3>這個療程適合我嗎？</h3></header><div class="tdna-concern-grid">${concerns.map(item=>`<article class="tdna-concern-placeholder"><i aria-hidden="true"></i><span>${item[0]}</span><small>${item[1]}</small></article>`).join("")}</div><p class="tdna-disclaimer">療程是否合適仍需由專業人員按個人膚質、健康狀況及期望進行評估。</p></section>

          <section class="tdna-detail" id="tdna-detail-05"><div class="tdna-detail__number">05 <span>PERSONALISED PLAN</span></div><header><p>TREATMENT PLAN</p><h3>療程方案</h3></header><div class="tdna-plan-shell"><div><span>PERSONALISED TREATMENT</span><h4>按輪廓狀態、關注位置及處理範圍設計個人化方案</h4><p>不以固定次數或單一參數定義所有客人；專業評估後再安排適合的能量、重點區域及護理節奏。</p></div><div class="tdna-plan-slots"><span><b>01</b>專業輪廓與膚況評估</span><span><b>02</b>設定重點處理區域</span><span><b>03</b>跟進肌膚反應與護理建議</span></div></div></section>

          <section class="tdna-detail" id="tdna-detail-06"><div class="tdna-detail__number">06 <span>VISUAL / CASE</span></div><header><p>TREATMENT VISUAL / RESULT</p><h3>自然、逐步看見緊緻變化</h3></header><div class="tdna-case-grid">${cases.map(item=>`<article class="tdna-case"><figure class="tdna-visual"><img src="${LIFTING_ASSET}/${item[2]}" alt="案例${item[0]} ${item[1]}療程前後視覺"><figcaption><b>CASE ${item[0]}</b><span>${item[1]}</span></figcaption></figure><p>${item[3]}</p></article>`).join("")}</div><p class="tdna-disclaimer">案例圖片僅作個案及視覺展示。效果因個人膚質、年齡、輪廓狀態及護理方案而有所不同，實際效果以專業評估為準；不代表保證結果。</p></section>
        </div>
      </section>`;
  }

  function modalMarkup(treatment) {
    if (treatment.number === "01") return liftingDetailMarkup(treatment);
    return `
      <div class="tdna-modal__backdrop" data-treatment-close></div>
      <section class="tdna-modal__panel" role="dialog" aria-modal="true" aria-labelledby="tdna-modal-title" tabindex="-1">
        <header class="tdna-modal__bar">
          <a class="tdna-modal__brand" href="#top" data-treatment-close><span>EC BEAUTY</span><small>TIGHTENING DNA / TREATMENT DETAIL</small></a>
          <button class="tdna-modal__close" type="button" data-treatment-close aria-label="關閉療程詳情"><span>Close</span><b aria-hidden="true">×</b></button>
        </header>

        <nav class="tdna-modal__nav" aria-label="療程詳情章節">
          <a href="#tdna-detail-01"><b>01</b><span>療程</span></a>
          <a href="#tdna-detail-02"><b>02</b><span>功效</span></a>
          <a href="#tdna-detail-03"><b>03</b><span>原理</span></a>
          <a href="#tdna-detail-04"><b>04</b><span>適合對象</span></a>
          <a href="#tdna-detail-05"><b>05</b><span>方案</span></a>
          <a href="#tdna-detail-06"><b>06</b><span>效果</span></a>
        </nav>

        <div class="tdna-modal__content">
          <section class="tdna-detail tdna-detail--hero" id="tdna-detail-01">
            <div class="tdna-detail__number">01 <span>TREATMENT</span></div>
            <div class="tdna-detail__hero-grid">
              <div class="tdna-detail__hero-copy">
                <p>EC BEAUTY / TIGHTENING DNA</p>
                <h2 id="tdna-modal-title">${treatment.name}</h2>
                <div class="tdna-content-field"><span>療程核心定位 / ONE-LINE BENEFIT</span><p>正式內容稍後提供</p></div>
              </div>
              ${placeholder("療程主視覺圖片位置")}
            </div>
          </section>

          <section class="tdna-detail" id="tdna-detail-02">
            <div class="tdna-detail__number">02 <span>BENEFITS</span></div>
            <header><p>WHAT ARE WE IMPROVING?</p><h3>你正在改善甚麼？</h3></header>
            <div class="tdna-benefit-grid">
              ${[1,2,3,4,5,6].map(i => `<div class="tdna-benefit-placeholder"><i>${String(i).padStart(2,"0")}</i><span>功效資料預留位置</span><small>名稱及說明稍後提供</small></div>`).join("")}
            </div>
          </section>

          <section class="tdna-detail" id="tdna-detail-03">
            <div class="tdna-detail__number">03 <span>TECHNOLOGY</span></div>
            <header><p>HOW IT WORKS</p><h3>它如何作用？</h3></header>
            <div class="tdna-detail__split">
              ${placeholder("Technology / Skin Layer Visual")}
              <div class="tdna-content-stack">
                <div class="tdna-content-field"><span>使用技術</span><p>正式資料稍後提供</p></div>
                <div class="tdna-content-field"><span>主要作用位置</span><p>正式資料稍後提供</p></div>
                <div class="tdna-content-field"><span>緊緻／提拉邏輯</span><p>正式資料稍後提供</p></div>
              </div>
            </div>
          </section>

          <section class="tdna-detail" id="tdna-detail-04">
            <div class="tdna-detail__number">04 <span>SUITABILITY</span></div>
            <header><p>IS THIS FOR ME?</p><h3>這個療程適合我嗎？</h3></header>
            <div class="tdna-concern-grid">
              ${[1,2,3,4].map(i => `<div class="tdna-concern-placeholder"><i aria-hidden="true"></i><span>適用對象／關注問題 ${String(i).padStart(2,"0")}</span><small>正式資料稍後提供</small></div>`).join("")}
            </div>
          </section>

          <section class="tdna-detail" id="tdna-detail-05">
            <div class="tdna-detail__number">05 <span>PERSONALISED PLAN</span></div>
            <header><p>TREATMENT PLAN</p><h3>療程方案</h3></header>
            <div class="tdna-plan-shell">
              <div><span>PERSONALISED TREATMENT AREA</span><h4>按輪廓狀態及處理範圍設計療程方案</h4></div>
              <div class="tdna-plan-slots"><span>方案資料預留位置</span><span>方案資料預留位置</span><span>方案資料預留位置</span></div>
            </div>
          </section>

          <section class="tdna-detail" id="tdna-detail-06">
            <div class="tdna-detail__number">06 <span>VISUAL / CASE</span></div>
            <header><p>TREATMENT VISUAL / RESULT</p><h3>療程視覺與案例</h3></header>
            <div class="tdna-gallery-placeholder">
              ${[1,2,3,4].map(i => `<div>${placeholder(`圖片位置 ${String(i).padStart(2,"0")}`)}</div>`).join("")}
            </div>
          </section>
        </div>
      </section>`;
  }

  function closeModal() {
    const modal = document.querySelector("[data-treatment-modal]");
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("tdna-modal-open");
    window.setTimeout(() => modal.remove(), 220);
    previousFocus?.focus?.();
    activeTreatment = null;
  }

  function openModal(treatment, trigger) {
    closeModal();
    previousFocus = trigger;
    activeTreatment = treatment;
    const modal = document.createElement("div");
    modal.className = "tdna-modal";
    modal.dataset.treatmentModal = treatment.number;
    modal.innerHTML = modalMarkup(treatment);
    document.body.appendChild(modal);
    document.body.classList.add("tdna-modal-open");
    modal.querySelectorAll("[data-treatment-close]").forEach(el => el.addEventListener("click", event => {
      if (el.matches("a")) event.preventDefault();
      closeModal();
    }));
    modal.querySelectorAll(".tdna-modal__nav a").forEach(link => link.addEventListener("click", event => {
      event.preventDefault();
      modal.querySelector(link.getAttribute("href"))?.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    window.requestAnimationFrame(() => {
      modal.classList.add("is-open");
      modal.querySelector(".tdna-modal__panel")?.focus();
    });
  }

  function onKeydown(event) {
    if (!activeTreatment) return;
    if (event.key === "Escape") closeModal();
  }

  function enhanceCards() {
    const cards = [...document.querySelectorAll("#technology .compact-card")];
    if (cards.length < 2) return;
    treatments.forEach((treatment, index) => {
      const card = cards[index];
      if (card.dataset.treatmentEnhanced === "true") return;
      card.dataset.treatmentEnhanced = "true";
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", `查看${treatment.name}療程詳情`);
      const title = card.querySelector(".card-title");
      const footer = card.querySelector(".card-footer span");
      if (title) title.textContent = treatment.name;
      if (footer) footer.textContent = "查看療程詳情";
      card.addEventListener("click", event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        openModal(treatment, card);
      }, true);
    });
  }

  document.addEventListener("keydown", onKeydown);
  const observer = new MutationObserver(enhanceCards);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  enhanceCards();
})();
