(() => {
  const q = selector => document.querySelector(selector);
  const login = q("[data-login]");
  const app = q("[data-app]");
  const loginMessage = q("[data-message]");
  const appMessage = q("[data-app-message]");
  const voucherBox = q("[data-voucher]");
  const lookupForm = q("[data-lookup]");
  const scanner = q("[data-scanner]");
  const scannerVideo = q("[data-scanner-video]");
  const scannerMessage = q("[data-scanner-message]");
  const scannerToggle = q("[data-scanner-toggle]");
  let currentVoucher = null;
  let scannerStream = null;
  let scannerFrame = null;
  let materialsLoaded = false;
  let recordsLoaded = false;

  async function api(url, options = {}) {
    const response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
    const data = await response.json().catch(() => ({ error: "INVALID_RESPONSE" }));
    if (!response.ok) throw Object.assign(new Error(data.error || "REQUEST_FAILED"), { data, status: response.status });
    return data;
  }

  function text(tag, value, className) {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
  }

  function addRow(list, label, value, className) {
    list.append(text("dt", label), text("dd", value, className));
  }

  function formatDate(value) {
    return value ? new Date(value).toLocaleString("zh-HK") : "—";
  }

  function showSession(session) {
    login.hidden = true;
    app.hidden = false;
    q("[data-store]").textContent = `${session.store.storeName} · 已登入`;
  }

  async function restoreSession() {
    try { showSession(await api("/api/staff/session")); }
    catch { login.hidden = false; app.hidden = true; }
  }

  async function loadMaterials() {
    if (materialsLoaded) return;
    const box = q("[data-materials]");
    box.replaceChildren(text("p", "載入內部資料中…"));
    try {
      const data = await api("/api/staff/materials");
      box.replaceChildren();
      data.materials.forEach(material => {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = `/api/staff/materials?id=${encodeURIComponent(material.id)}`;
        image.alt = material.alt;
        image.loading = "lazy";
        figure.append(image, text("figcaption", material.caption));
        box.append(figure);
      });
      materialsLoaded = true;
    } catch {
      box.replaceChildren(text("p", "未能取得內部資料，請重新登入。"));
    }
  }

  async function loadRecords(force = false) {
    if (recordsLoaded && !force) return;
    const box = q("[data-records]");
    box.replaceChildren(text("p", "載入 TEST 記錄中…"));
    try {
      const data = await api("/api/staff/records");
      box.replaceChildren();
      if (!data.records.length) {
        box.append(text("p", "目前未有 Tightening DNA TEST Voucher 記錄。"));
      }
      data.records.forEach(record => {
        const article = document.createElement("article");
        const heading = text("h3", `${record.displayCode} · ${record.status}`);
        const list = document.createElement("dl");
        addRow(list, "會員／電話", record.identifierMasked);
        addRow(list, "福利", record.benefit);
        addRow(list, "建立日期", formatDate(record.issuedAt));
        addRow(list, "核銷日期", formatDate(record.redeemedAt));
        addRow(list, "核銷分店", record.redeemedStore || "—");
        addRow(list, "Staff", record.redeemedBy || "—");
        if (record.redemptionId) addRow(list, "Redemption", record.redemptionId);
        article.append(heading, list);
        box.append(article);
      });
      recordsLoaded = true;
    } catch {
      box.replaceChildren(text("p", "未能取得 TEST 記錄，請重新登入。"));
    }
  }

  function renderVoucher(voucher) {
    voucherBox.replaceChildren();
    voucherBox.hidden = false;
    const list = document.createElement("dl");
    addRow(list, "客戶姓名", "尚未連接 Manus Consultation");
    addRow(list, "憑證", voucher.displayCode);
    addRow(list, "會員／電話", voucher.identifierMasked);
    addRow(list, "福利", voucher.benefit);
    addRow(list, "狀態", voucher.status, "status");
    addRow(list, "建立日期", formatDate(voucher.issuedAt));
    addRow(list, "到期日", formatDate(voucher.expiresAt));
    if (voucher.redeemedAt) addRow(list, "核銷時間", formatDate(voucher.redeemedAt));
    voucherBox.append(list);
    if (voucher.status === "ACTIVE") {
      const button = text("button", "確認核銷");
      button.type = "button";
      button.dataset.confirm = "";
      button.addEventListener("click", redeem);
      voucherBox.append(button);
    } else {
      voucherBox.append(text("p", voucher.status === "REDEEMED" ? "此憑證已核銷，不可再次使用。" : "此憑證目前不可核銷。"));
    }
  }

  async function lookup(value) {
    appMessage.textContent = "查詢中…";
    voucherBox.hidden = true;
    try {
      const data = await api("/api/staff/voucher", { method: "POST", body: JSON.stringify({ value }) });
      currentVoucher = data.voucher;
      renderVoucher(currentVoucher);
      appMessage.textContent = "請核對資料後再按確認核銷。";
    } catch (error) {
      currentVoucher = null;
      appMessage.textContent = error.message === "VOUCHER_NOT_FOUND" ? "找不到此 Tightening DNA TEST 憑證。" : error.message;
    }
  }

  async function redeem() {
    if (!currentVoucher || !confirm(`確認於本分店核銷 ${currentVoucher.displayCode}？`)) return;
    const button = voucherBox.querySelector("[data-confirm]");
    if (button) button.disabled = true;
    appMessage.textContent = "核銷中…";
    try {
      const result = await api("/api/staff/redeem", { method: "POST", body: JSON.stringify({ voucherId: currentVoucher.voucherId }) });
      currentVoucher.status = "REDEEMED";
      currentVoucher.redeemedAt = result.redeemedAt;
      recordsLoaded = false;
      renderVoucher(currentVoucher);
      appMessage.textContent = `✓ 核銷成功 · ${result.store} · ${result.redemptionId}`;
    } catch (error) {
      if (error.message === "ALREADY_REDEEMED") {
        currentVoucher.status = "REDEEMED";
        currentVoucher.redeemedAt = error.data?.redeemedAt;
        renderVoucher(currentVoucher);
        appMessage.textContent = "此憑證已核銷，不可再次使用。";
      } else {
        appMessage.textContent = error.message === "EXPIRED" ? "此憑證已過期。" : error.message;
        if (button) button.disabled = false;
      }
    }
  }

  function stopScanner() {
    if (scannerFrame) cancelAnimationFrame(scannerFrame);
    scannerFrame = null;
    scannerStream?.getTracks().forEach(track => track.stop());
    scannerStream = null;
    scannerVideo.srcObject = null;
    scanner.hidden = true;
    scannerToggle.textContent = "開啟相機掃描 QR";
  }

  async function startScanner() {
    if (!("BarcodeDetector" in window) || !navigator.mediaDevices?.getUserMedia) {
      scannerMessage.textContent = "此瀏覽器不支援相機 QR 掃描，請使用手動輸入。";
      scanner.hidden = false;
      return;
    }
    try {
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      scannerVideo.srcObject = scannerStream;
      await scannerVideo.play();
      scanner.hidden = false;
      scannerToggle.textContent = "關閉相機";
      const scan = async () => {
        if (!scannerStream) return;
        try {
          const codes = await detector.detect(scannerVideo);
          if (codes[0]?.rawValue) {
            const value = codes[0].rawValue;
            lookupForm.elements.value.value = value;
            stopScanner();
            await lookup(value);
            return;
          }
        } catch {}
        scannerFrame = requestAnimationFrame(scan);
      };
      scannerFrame = requestAnimationFrame(scan);
    } catch {
      stopScanner();
      scanner.hidden = false;
      scannerMessage.textContent = "無法使用相機，請允許相機權限或使用手動輸入。";
    }
  }

  login.querySelector("form").addEventListener("submit", async event => {
    event.preventDefault();
    loginMessage.textContent = "登入中…";
    const form = event.currentTarget;
    const button = form.querySelector("button");
    button.disabled = true;
    try {
      showSession(await api("/api/staff/login", { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(form))) }));
      form.reset();
      loginMessage.textContent = "";
    } catch (error) {
      loginMessage.textContent = error.message === "INVALID_STORE_PASSWORD" ? "分店或密碼不正確" : "TEST 環境未完成設定";
    } finally { button.disabled = false; }
  });

  q("[data-logout]").addEventListener("click", async () => {
    stopScanner();
    await api("/api/staff/session", { method: "DELETE" });
    location.reload();
  });
  document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => {
    stopScanner();
    document.querySelectorAll("[data-tab]").forEach(item => item.classList.toggle("is-active", item === button));
    document.querySelectorAll("[data-panel]").forEach(panel => { panel.hidden = panel.dataset.panel !== button.dataset.tab; });
    if (button.dataset.tab === "materials") loadMaterials();
    if (button.dataset.tab === "records") loadRecords();
  }));
  lookupForm.addEventListener("submit", event => {
    event.preventDefault();
    lookup(new FormData(event.currentTarget).get("value"));
  });
  scannerToggle.addEventListener("click", () => scannerStream ? stopScanner() : startScanner());
  window.addEventListener("pagehide", stopScanner);
  restoreSession();
})();
