(() => {
  if (!location.pathname.endsWith("/tightening-dna-preview-ecb2026/")) return;

  function text(tag, value, className) {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
  }

  function formatDate(value) {
    return value ? new Date(value).toLocaleDateString("zh-HK") : "—";
  }

  function renderCard(card, voucher) {
    card.replaceChildren();
    card.hidden = false;
    const image = document.createElement("img");
    image.src = voucher.qrImageDataUrl;
    image.alt = "個人 TEST 憑證 QR Code";
    const details = document.createElement("div");
    details.append(
      text("small", voucher.status === "REDEEMED" ? "✓ 已使用" : "MY TEST VOUCHER"),
      text("h3", voucher.benefit),
      text("b", voucher.displayCode),
      text("p", `狀態：${voucher.status}\n有效日期：${formatDate(voucher.expiresAt)}`)
    );
    if (voucher.status === "REDEEMED") {
      details.append(text("em", `已於 ${formatDate(voucher.redeemedAt)} 在 ${voucher.redeemedStore || "TEST 分店"} 使用`));
      card.classList.add("is-used");
    } else {
      details.append(text("em", "到店時向 EC Beauty 同事出示此 QR Code 即可。"));
      card.classList.remove("is-used");
    }
    card.append(image, details);
  }

  function mount() {
    if (document.querySelector("[data-my-voucher]") || location.pathname.includes("ai-skin-journey")) return;
    const contact = document.querySelector("#contact");
    if (!contact) return;
    const section = document.createElement("section");
    section.className = "ec-voucher ec-voucher--home";
    section.dataset.myVoucher = "";
    section.innerHTML = `<span>TEST / PREVIEW</span><h2>我的到店體驗憑證</h2><p>輸入領取時使用的會員編號或電話，重新查看已建立的 TEST 憑證。本功能不會建立新 Voucher。</p><form><input name="identifier" aria-label="會員編號或電話" placeholder="會員編號或電話" autocomplete="off" required><button>查看我的憑證</button></form><p data-my-voucher-message role="status" aria-live="polite"></p><article data-voucher-card data-my-voucher-card hidden></article>`;
    contact.before(section);
    const form = section.querySelector("form");
    const message = section.querySelector("[data-my-voucher-message]");
    const card = section.querySelector("[data-my-voucher-card]");
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const button = form.querySelector("button");
      button.disabled = true;
      message.textContent = "正在查找 TEST 憑證…";
      card.hidden = true;
      try {
        const identifier = new FormData(form).get("identifier");
        const response = await fetch("/api/campaign-test/my-voucher", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "LOOKUP_FAILED");
        renderCard(card, data.voucher);
        message.textContent = "";
      } catch (error) {
        message.textContent = error.message === "VOUCHER_NOT_FOUND" ? "找不到與此識別碼相符的 TEST 憑證。" : "暫時未能查找 TEST 憑證，請稍後再試。";
      } finally { button.disabled = false; }
    });
  }

  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  mount();
})();
