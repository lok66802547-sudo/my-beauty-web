(() => {
  const treatments = [
    { number: "01", name: "易思面部提拉護理" },
    { number: "02", name: "易思緊膚咒" }
  ];
  let activeTreatment = null;
  let previousFocus = null;

  const placeholder = (label) => `<div class="tdna-placeholder"><span>${label}</span><small>CONTENT TO BE PROVIDED</small></div>`;

  function modalMarkup(treatment) {
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
