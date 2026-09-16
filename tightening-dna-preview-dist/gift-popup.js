(function () {
  "use strict";

  const SESSION_KEY = "ecb-tightening-gift-seen-v1";
  const GIFT_IMAGE = "/tightening-dna-preview-assets/ec-beauty-treatment-model-portrait_c9194456.png";
  let step = 1;

  function giftIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7H7.8a2.3 2.3 0 1 1 2.3-2.3C10.1 6 12 7 12 7Zm0 0h4.2a2.3 2.3 0 1 0-2.3-2.3C13.9 6 12 7 12 7Z"/></svg>';
  }

  function qrPlaceholder() {
    const cells = [0,1,2,3,4,5,6,10,12,14,16,17,18,19,20,21,22,24,26,28,30,32,34,36,38,40,42,44,46,47,48,49,50,52,54,56,58,60,62,64,65,66,67,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120];
    return '<div class="ecg-qr-pattern" aria-label="示意 QR Code，不能用作核銷">' + cells.map(function (cell) {
      return '<i style="--x:' + (cell % 11) + ';--y:' + Math.floor(cell / 11) + '"></i>';
    }).join("") + '<b>DEMO</b></div>';
  }

  function intro() {
    return '<div class="ecg-step ecg-intro" data-step="1">' +
      '<div class="ecg-copy">' +
        '<span class="ecg-eyebrow">EC BEAUTY · MEMBER PRIVILEGE</span>' +
        '<span class="ecg-gift-mark">' + giftIcon() + '<i></i></span>' +
        '<h2 id="ecg-title">會員專屬<br><em>Facial 禮遇</em></h2>' +
        '<p class="ecg-lead">啟動你的緊緻 DNA 之旅</p>' +
        '<div class="ecg-benefit"><span>免費獲贈</span><strong>指定補水 Facial <b>× 1</b></strong><small>為肌膚補充水分，開啟細緻護理體驗</small></div>' +
        '<div class="ecg-actions"><button type="button" class="ecg-primary" data-action="next">立即領取 <span>→</span></button><button type="button" class="ecg-secondary" data-action="close">稍後再看</button></div>' +
      '</div>' +
      '<div class="ecg-visual"><div class="ecg-orbit"></div><img src="' + GIFT_IMAGE + '" alt="補水 Facial 禮遇暫用視覺"><span>TEMPORARY VISUAL</span></div>' +
    '</div>';
  }

  function memberInput() {
    return '<div class="ecg-step ecg-member" data-step="2">' +
      '<button type="button" class="ecg-back" data-action="back" aria-label="返回禮遇介紹">← <span>BACK</span></button>' +
      '<div class="ecg-form-icon">' + giftIcon() + '</div>' +
      '<span class="ecg-eyebrow">MEMBER GIFT · PREVIEW MODE</span>' +
      '<h2 id="ecg-title">領取你的<br><em>會員禮遇</em></h2>' +
      '<p>輸入會員編號，<br>即可查看你的專屬 Facial 禮遇。</p>' +
      '<form class="ecg-form" novalidate><label for="ecg-member-id">會員編號</label><input id="ecg-member-id" name="memberId" type="text" inputmode="text" autocomplete="off" maxlength="30" placeholder="請輸入會員編號" aria-describedby="ecg-form-note ecg-error"><span id="ecg-error" class="ecg-error" role="alert"></span><button class="ecg-primary" type="submit">確認領取 <span>→</span></button></form>' +
      '<small id="ecg-form-note" class="ecg-privacy">此頁為介面預覽，不會驗證、傳送或儲存會員資料。</small>' +
    '</div>';
  }

  function success() {
    return '<div class="ecg-step ecg-success" data-step="3">' +
      '<div class="ecg-success-head"><span class="ecg-success-icon">✓</span><span class="ecg-eyebrow">GIFT REVEALED · PREVIEW MODE</span><h2 id="ecg-title">領取成功</h2><p>你的 Facial 禮遇已準備好。</p></div>' +
      '<div class="ecg-voucher" aria-label="EC Beauty 示意電子 Facial 禮券"><div class="ecg-voucher-shine"></div><span class="ecg-demo-ribbon">PREVIEW / DEMO</span><div class="ecg-voucher-brand"><strong>EC BEAUTY</strong><small>MEMBER PRIVILEGE</small></div><div class="ecg-voucher-name"><span>指定補水</span><strong>Facial</strong><small>COMPLIMENTARY TREATMENT</small></div><b class="ecg-voucher-qty">× 1</b><div class="ecg-voucher-code"><span>MOCK VOUCHER CODE</span><strong>EC-DEMO-2026</strong></div></div>' +
      '<div class="ecg-qr-area">' + qrPlaceholder() + '<div><strong>專屬核銷 QR Code</strong><p>正式領取功能啟用後，<br>此位置將顯示你的專屬核銷 QR Code。</p></div></div>' +
      '<div class="ecg-details"><details open><summary>禮遇內容</summary><p>指定補水 Facial × 1（正式名稱稍後更新）</p></details><details><summary>使用方式</summary><p>正式領取及核銷流程啟用後更新。</p></details><details><summary>有效日期</summary><p>待正式活動資料確認。</p></details><details><summary>適用門店</summary><p>待正式活動資料確認。</p></details><details><summary>注意事項</summary><p>此畫面只作設計預覽，不是正式禮券，不能核銷。</p></details></div>' +
      '<button type="button" class="ecg-finish" data-action="close">完成瀏覽</button>' +
    '</div>';
  }

  function render() {
    const content = document.querySelector(".ecg-content");
    if (!content) return;
    content.innerHTML = step === 1 ? intro() : step === 2 ? memberInput() : success();
    content.scrollTop = 0;
    const dots = document.querySelectorAll(".ecg-progress i");
    dots.forEach(function (dot, index) { dot.classList.toggle("active", index < step); });
    if (step === 2) setTimeout(function () { document.getElementById("ecg-member-id")?.focus(); }, 250);
  }

  function openGift(reset) {
    if (reset) step = 1;
    render();
    document.body.classList.add("ecg-open");
    document.querySelector(".ecg-overlay")?.setAttribute("aria-hidden", "false");
    setTimeout(function () { document.querySelector(".ecg-close")?.focus(); }, 80);
  }

  function closeGift() {
    document.body.classList.remove("ecg-open");
    document.querySelector(".ecg-overlay")?.setAttribute("aria-hidden", "true");
  }

  function mount() {
    const root = document.createElement("div");
    root.className = "ecg-gift-root";
    root.innerHTML = '<div class="ecg-overlay" aria-hidden="true"><div class="ecg-backdrop" data-action="close"></div><section class="ecg-modal" role="dialog" aria-modal="true" aria-labelledby="ecg-title"><button type="button" class="ecg-close" data-action="close" aria-label="關閉會員禮遇">×</button><div class="ecg-progress" aria-hidden="true"><i></i><i></i><i></i></div><div class="ecg-content"></div></section></div><button type="button" class="ecg-reopen" aria-label="重新打開會員禮遇">' + giftIcon() + '<span>會員禮遇</span></button>';
    document.body.appendChild(root);
    render();

    root.addEventListener("click", function (event) {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      if (action === "close") closeGift();
      if (action === "next") { step = 2; render(); }
      if (action === "back") { step = Math.max(1, step - 1); render(); }
    });
    root.querySelector(".ecg-reopen").addEventListener("click", function () { openGift(true); });
    root.addEventListener("submit", function (event) {
      if (!event.target.matches(".ecg-form")) return;
      event.preventDefault();
      const input = event.target.querySelector("input");
      const error = event.target.querySelector(".ecg-error");
      if (!input.value.trim() || input.value.trim().length < 2) {
        error.textContent = "請輸入一個示意會員編號。";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      step = 3;
      render();
    });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape") closeGift(); });

    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setTimeout(function () { openGift(true); }, 850);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
