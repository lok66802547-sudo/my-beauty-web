(() => {
  const steps = [
    {
      number: "01",
      phase: "BEFORE",
      label: "療程前 · 45°",
      title: "療程前｜45°輪廓檢測",
      description: "觀察面頰、下顎線及下半面輪廓狀態。",
      image: "/tightening-dna-preview-assets/case-journey-01-before-45.jpg",
      alt: "療程前45度輪廓檢測相片"
    },
    {
      number: "02",
      phase: "BEFORE",
      label: "療程前 · 正面",
      title: "療程前｜正面檢測",
      description: "從正面記錄面部比例、浮腫及左右輪廓。",
      image: "/tightening-dna-preview-assets/case-journey-02-before-front.jpg",
      alt: "療程前正面輪廓檢測相片"
    },
    {
      number: "03",
      phase: "BEFORE",
      label: "療程前 · 側面",
      title: "療程前｜側面檢測",
      description: "觀察下顎線、下巴與頸部的輪廓連接。",
      image: "/tightening-dna-preview-assets/case-journey-03-before-profile.jpg",
      alt: "療程前側面輪廓檢測相片"
    },
    {
      number: "04",
      phase: "PROGRESS",
      label: "療程中段",
      title: "療程中段｜緊緻開始發生",
      description: "療程進行期間，輪廓開始收緊，下顎線逐漸清晰。",
      image: "/tightening-dna-preview-assets/case-journey-04-progress.jpg",
      alt: "療程中段輪廓進度相片"
    },
    {
      number: "05",
      phase: "AFTER",
      label: "療程完成",
      title: "療程完成｜Final Result",
      description: "完成療程後，呈現更清晰、緊實的下半面輪廓。",
      image: "/tightening-dna-preview-assets/case-journey-05-final-after.jpg",
      alt: "療程完成後最終輪廓相片"
    }
  ];

  const markup = `
    <div class="tdna-case" data-case-journey>
      <header class="tdna-case__header">
        <div class="tdna-case__eyebrow"><span>05</span> DNA JOURNEY / CASE RESULT</div>
        <h2>看見緊緻，<em>一步一步發生</em></h2>
        <p>從多角度輪廓檢測，到療程中段及完成效果，<br>完整記錄同一個案例的緊緻變化。</p>
      </header>

      <div class="tdna-case__viewer">
        <div class="tdna-case__main">
          <div class="tdna-case__image-frame">
            <img data-case-main src="${steps[0].image}" alt="${steps[0].alt}">
            <span class="tdna-case__phase tdna-case__phase--before" data-case-phase>${steps[0].phase}</span>
            <span class="tdna-case__count"><b data-case-count>01</b> / 05</span>
          </div>
          <div class="tdna-case__copy" aria-live="polite">
            <p data-case-kicker>${steps[0].phase} · STEP ${steps[0].number}</p>
            <h3 data-case-title>${steps[0].title}</h3>
            <div data-case-description>${steps[0].description}</div>
          </div>
        </div>

        <div class="tdna-case__stages" aria-label="同一案例的五步紀錄">
          <div class="tdna-case__stage tdna-case__stage--before">
            <div class="tdna-case__stage-heading"><b>BEFORE</b><span>三個檢測角度</span></div>
            <div class="tdna-case__thumb-group">
              ${steps.slice(0, 3).map((step, index) => thumb(step, index)).join("")}
            </div>
          </div>
          <div class="tdna-case__stage tdna-case__stage--progress">
            <div class="tdna-case__stage-heading"><b>PROGRESS</b><span>療程中段</span></div>
            <div class="tdna-case__thumb-group">${thumb(steps[3], 3)}</div>
          </div>
          <div class="tdna-case__stage tdna-case__stage--after">
            <div class="tdna-case__stage-heading"><b>AFTER</b><span>完成效果</span></div>
            <div class="tdna-case__thumb-group">${thumb(steps[4], 4)}</div>
          </div>
        </div>
      </div>

      <section class="tdna-compare" aria-labelledby="tdna-compare-title">
        <div class="tdna-compare__heading">
          <span>QUICK COMPARE</span>
          <h3 id="tdna-compare-title">療程前 / 療程完成</h3>
          <p>由第一步檢測基準，到療程完成後的輪廓呈現。</p>
        </div>
        <div class="tdna-compare__grid">
          <figure><div><img src="${steps[0].image}" alt="療程前45度輪廓"></div><figcaption><b>BEFORE · 01</b><span>療程前｜45°輪廓檢測</span></figcaption></figure>
          <span class="tdna-compare__vs" aria-hidden="true">VS</span>
          <figure><div><img src="${steps[4].image}" alt="療程完成後輪廓"></div><figcaption><b>AFTER · 05</b><span>療程完成｜Final Result</span></figcaption></figure>
        </div>
      </section>

      <p class="tdna-case__disclaimer">案例效果因個人膚質、年齡、輪廓狀態及護理方案而有所不同；<br>圖片僅作個案展示，實際效果以專業評估為準。</p>
    </div>`;

  function thumb(step, index) {
    return `<button type="button" class="tdna-case__thumb${index === 0 ? " is-active" : ""}" data-case-step="${index}" aria-pressed="${index === 0}" aria-label="顯示${step.title}">
      <span class="tdna-case__thumb-image"><img src="${step.image}" alt="" loading="lazy"></span>
      <span class="tdna-case__thumb-copy"><b>${step.number}</b><small>${step.label}</small></span>
    </button>`;
  }

  function enhance(section) {
    if (section.querySelector("[data-case-journey]")) return;
    section.innerHTML = markup;
    const main = section.querySelector("[data-case-main]");
    const phase = section.querySelector("[data-case-phase]");
    const count = section.querySelector("[data-case-count]");
    const kicker = section.querySelector("[data-case-kicker]");
    const title = section.querySelector("[data-case-title]");
    const description = section.querySelector("[data-case-description]");
    const buttons = [...section.querySelectorAll("[data-case-step]")];

    buttons.forEach((button) => button.addEventListener("click", () => {
      const index = Number(button.dataset.caseStep);
      const step = steps[index];
      if (!step || button.classList.contains("is-active")) return;
      main.classList.add("is-changing");
      window.setTimeout(() => {
        main.src = step.image;
        main.alt = step.alt;
        phase.textContent = step.phase;
        phase.className = `tdna-case__phase tdna-case__phase--${step.phase.toLowerCase()}`;
        count.textContent = step.number;
        kicker.textContent = `${step.phase} · STEP ${step.number}`;
        title.textContent = step.title;
        description.textContent = step.description;
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        main.classList.remove("is-changing");
      }, 140);
    }));
  }

  function mount() {
    const section = document.getElementById("results");
    if (section) enhance(section);
  }

  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  mount();
})();
