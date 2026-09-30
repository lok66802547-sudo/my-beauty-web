(() => {
  const treatments = [
    { number: "01", name: "易思面部提拉護理" },
    { number: "02", name: "EC緊膚咒" },
    { number: "03", name: "STEP 03 基因表現修復" }
  ];
  let activeTreatment = null;
  let previousFocus = null;
  let imageLightbox = null;

  const placeholder = (label) => `<div class="tdna-placeholder"><span>${label}</span><small>CONTENT TO BE PROVIDED</small></div>`;

  const LIFTING_ASSET = "/tightening-dna-preview-assets/lifting-treatment";
  const TIGHTENING_ASSET = "/tightening-dna-preview-assets/tightening-curse-treatment";

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

  function tighteningDetailMarkup(treatment) {
    const APPROVED = `${TIGHTENING_ASSET}/approved-2026-09-28`;
    const V2 = `${TIGHTENING_ASSET}/ec-tightening-v2`;
    const benefits = [
      ["收緊鬆弛", "針對面部及頸部鬆弛感，建立更穩定的輪廓承托。"],
      ["改善下垂", "按眉眼、面頰與下半面狀態，支援向上的視覺線條。"],
      ["提升輪廓", "照顧下顎線、雙下巴及頸部連貫感，令輪廓更俐落。"],
      ["改善皺紋", "按精細位置及肌膚層次，關注細紋與皺紋的視覺表現。"],
      ["細緻毛孔與膚質", "支援膠原更新，改善毛孔、粗糙感及肌膚紋理。"],
      ["提亮膚色觀感", "透過膚質、紋理與光澤改善，呈現更通透明亮的視覺。"]
    ];
    const depths = [
      ["1.5", "表層膚質", "細紋、毛孔及表層緊實感"],
      ["2.0", "精細位置", "額頭、眼周及嘴周等窄小輪廓"],
      ["3.0", "真皮層", "膠原支撐、彈性與紋理"],
      ["4.5", "SMAS筋膜層", "深層承托及輪廓提拉"],
      ["6.0", "身體淺層", "局部緊實與輪廓管理"],
      ["9.0", "身體中層", "較深位置的緊實護理"],
      ["13.0", "身體深層", "按部位及狀態制定處理方案"]
    ];
    const concerns = [
      ["面部輪廓開始鬆弛", "面頰、下顎線或下半面支撐感逐漸下降。"],
      ["眼周與精細位置", "關注額頭、眼周、嘴周的細紋及緊實表現。"],
      ["雙下巴與頸部線條", "希望改善下巴至頸部的輪廓連貫感。"],
      ["身體局部輪廓", "關注上臂、腹部、腰側或大腿等位置的鬆弛感。"]
    ];
    const cases = [
      ["01", "眼周・法令位置・下顎線", "ec-case-01.jpg"],
      ["02", "中面部・嘴角・下顎線", "ec-case-02.jpg"],
      ["03", "正面輪廓・下顎線・雙下巴", "ec-case-03.jpg"],
      ["04", "法令位置・嘴角・下顎線", "ec-case-04-updated.jpg"],
      ["05", "面部緊實・下顎線・雙下巴", "ec-case-05.jpg"]
    ];
    return `
      <div class="tdna-modal__backdrop" data-treatment-close></div>
      <section class="tdna-modal__panel" role="dialog" aria-modal="true" aria-labelledby="tdna-modal-title" tabindex="-1">
        <header class="tdna-modal__bar">
          <a class="tdna-modal__brand" href="#top" data-treatment-close><span>EC BEAUTY</span><small>TIGHTENING DNA / TREATMENT DETAIL</small></a>
          <button class="tdna-modal__close" type="button" data-treatment-close aria-label="關閉療程詳情"><span>Close</span><b aria-hidden="true">×</b></button>
        </header>
        <nav class="tdna-modal__nav" aria-label="EC緊膚咒詳情章節">
          <a href="#tdna-curse-01"><b>01</b><span>療程</span></a><a href="#tdna-curse-02"><b>02</b><span>功效</span></a><a href="#tdna-curse-03"><b>03</b><span>原理</span></a><a href="#tdna-curse-04"><b>04</b><span>適合對象</span></a><a href="#tdna-curse-05"><b>05</b><span>方案</span></a><a href="#tdna-curse-06"><b>06</b><span>效果</span></a>
        </nav>
        <div class="tdna-modal__content tdna-curse-detail">
          <section class="tdna-detail tdna-detail--hero" id="tdna-curse-01">
            <div class="tdna-detail__number">01 <span>TREATMENT</span></div>
            <div class="tdna-detail__hero-grid">
              <div class="tdna-detail__hero-copy"><p>EC BEAUTY / LAYERED FOCUSED ULTRASOUND</p><h2 id="tdna-modal-title">${treatment.name}</h2><h3 class="tdna-curse-kicker">抗衰界中的「黑馬」</h3><div class="tdna-content-field"><span>CHAMPION-LEVEL ANTI-AGING CARE</span><p>以 HIFU 與 MMFU 聚焦超聲技術，按面部、頸部及身體不同問題選擇相應作用深度，從精細位置至深層支撐，建立個人化的分層提拉緊緻方案。</p></div><div class="tdna-curse-pills"><span>分層抗衰</span><span>提拉緊緻</span><span>面部 × 頸部 × 身體</span></div></div>
              <figure class="tdna-curse-media tdna-curse-media--contain"><img src="${APPROVED}/ec-hero-approved.jpg" alt="EC緊膚咒已確認儀器主視覺"><figcaption>懸吊式提拉緊緻・分層抗衰</figcaption></figure>
            </div>
            <div class="tdna-subsection"><div class="tdna-subsection__copy"><span>WHAT IS EC TIGHTENING?</span><h3>一個冠軍級抗衰護理</h3><p>EC緊膚咒以分層聚焦概念，針對不同皮膚深度進行緊緻及輪廓管理；由較淺層的膚質、細紋，延伸至深層輪廓支撐及身體塑形需要。</p><strong>膚齡・膚質・膚色 三維立體提升</strong></div><figure class="tdna-curse-media"><img src="${V2}/skin-depth.png" alt="EC緊膚咒皮膚分層及聚焦作用概念"><figcaption>由表層膚質到深層輪廓支撐</figcaption></figure></div>
          </section>

          <section class="tdna-detail" id="tdna-curse-02"><div class="tdna-detail__number">02 <span>BENEFITS</span></div><header><p>WHAT ARE WE IMPROVING?</p><h3>緊・提・拉・細・嫩・白</h3></header><p class="tdna-lead">先由客戶真正關心的改善方向開始，再理解背後的分層技術。</p><div class="tdna-benefit-grid">${benefits.map((item,index)=>`<article class="tdna-benefit-placeholder"><i>${["緊","提","拉","細","嫩","白"][index]}</i><span>${item[0]}</span><small>${item[1]}</small></article>`).join("")}</div><figure class="tdna-curse-media tdna-curse-media--wide tdna-curse-media--contain"><img src="${APPROVED}/ec-process-overview.jpg" alt="EC緊膚咒膚質、膠原與輪廓改善概念"><figcaption>由膚質、膠原支撐到輪廓緊緻</figcaption></figure><p class="tdna-disclaimer">實際改善方向需按個人狀態及專業評估而定。「透亮」不代表漂白、去斑或改變天然膚色。</p></section>

          <section class="tdna-detail" id="tdna-curse-03"><div class="tdna-detail__number">03 <span>TECHNOLOGY</span></div><header><p>HIFU + MMFU / HOW IT WORKS</p><h3>不只做表面緊緻，而是向不同深度精準作用</h3></header><div class="tdna-tech-grid"><article><b>01</b><span>HIFU 聚焦超聲</span><small>FOCUSED ENERGY</small><p>將聚焦超聲能量非侵入式傳送至指定組織深度，形成精準作用焦點。</p></article><article><b>02</b><span>Micro Focused</span><small>FACE / PRECISION</small><p>照顧面部、眼周及輪廓等精細位置。</p></article><article><b>03</b><span>Macro Focused</span><small>BODY / DEPTH</small><p>配合較深身體部位的輪廓及緊實需要。</p></article></div><div class="tdna-technology-visuals"><figure class="tdna-curse-media"><img src="${V2}/focused-energy.png" alt="HIFU與MMFU聚焦超聲作用原理"><figcaption>聚焦能量於指定深度形成作用焦點</figcaption></figure><figure class="tdna-curse-media"><img src="${V2}/skin-depth.png" alt="皮膚分層與不同深度作用示意"><figcaption>皮膚分層 × 不同深度作用</figcaption></figure></div><div class="tdna-depth-intro"><b>7個深度不是主角，而是分層方案的技術依據</b><p>重點不是越深越好，而是深度、部位與需要是否匹配。</p></div><div class="tdna-depth-grid">${depths.map(item=>`<article><b>${item[0]}<small>mm</small></b><span>${item[1]}</span><p>${item[2]}</p></article>`).join("")}</div><div class="tdna-curse-split"><article><b>FACE / MICRO FOCUSED</b><h4>1.5・2.0・3.0・4.5mm</h4><p>由表層膚質、精細位置、真皮膠原至 SMAS 相關層次。</p></article><article><b>BODY / MACRO FOCUSED</b><h4>6.0・9.0・13.0mm</h4><p>對應身體不同深度與處理範圍。</p></article></div><div class="tdna-subsection"><div class="tdna-subsection__copy"><span>COLLAGEN REMODELLING</span><h3>膠原重組，是逐步發生的過程</h3><p>緊緻並非只看即時視覺變化；後續亦涉及膠原重組及肌膚支撐力的逐步改變。</p><div class="tdna-timeline"><article><b>STEP 01</b><span>激活階段</span><small>0–48 hours</small></article><article><b>STEP 02</b><span>增生期</span><small>Day 2 → 約2 weeks</small></article><article><b>STEP 03</b><span>重塑期</span><small>2 weeks → 約6 months</small></article></div></div><figure class="tdna-curse-media tdna-curse-media--contain"><img src="${APPROVED}/ec-collagen-remodelling.jpg" alt="EC緊膚咒膠原激活、增生及重塑概念"><figcaption>激活 → 增生 → 重塑</figcaption></figure></div><div class="tdna-subsection tdna-subsection--stack"><div class="tdna-subsection__copy"><span>FACE APPLICATION</span><h3>由眼周到下顎線・分區精準提升</h3><p>前額、眼周、中面部、法令位置、嘴角、下顎線、雙下巴及頸部，按問題分區管理。</p></div><div class="tdna-media-pair"><figure class="tdna-curse-media tdna-curse-media--contain"><img src="${APPROVED}/ec-face-zones-a.jpg" alt="EC緊膚咒面部精準應用"><figcaption>面部精準應用</figcaption></figure><figure class="tdna-curse-media tdna-curse-media--contain"><img src="${APPROVED}/ec-face-zones-b.jpg" alt="EC緊膚咒面部層次與輪廓提升"><figcaption>分層緊緻與輪廓管理</figcaption></figure></div></div><div class="tdna-subsection"><div class="tdna-subsection__copy"><span>BODY APPLICATION</span><h3>面部緊緻以外・延伸至身體輪廓管理</h3><p>6.0 / 9.0 / 13.0mm 配合胸前、手臂、背部、側腰、腹部、大腿、小腿及腋下等不同部位的評估需要。</p></div><figure class="tdna-curse-media"><img src="${V2}/face-body.png" alt="EC緊膚咒面部與身體可評估部位"><figcaption>Face × Body 應用範圍示意</figcaption></figure></div><p class="tdna-disclaimer">技術圖屬教育示意。實際深度、處理部位及能量配置須按專業評估決定；本頁不公開內部操作參數。</p></section>

          <section class="tdna-detail" id="tdna-curse-04"><div class="tdna-detail__number">04 <span>SUITABILITY</span></div><header><p>IS THIS FOR ME?</p><h3>以問題，而不是年齡分類</h3></header><p class="tdna-lead">由輪廓、精細位置、頸部至身體局部問題，先找出你的主要關注。</p><div class="tdna-concern-grid">${concerns.map(item=>`<article class="tdna-concern-placeholder"><i aria-hidden="true"></i><span>${item[0]}</span><small>${item[1]}</small></article>`).join("")}</div><p class="tdna-disclaimer">本頁不構成醫療診斷。療程是否合適仍需按個人膚質、輪廓、健康狀況及期望作專業評估。</p></section>

          <section class="tdna-detail" id="tdna-curse-05"><div class="tdna-detail__number">05 <span>PERSONALISED PLAN</span></div><header><p>TREATMENT PLAN</p><h3>不是發數越多越好，而是按老化層次設計</h3></header><div class="tdna-plan-shell"><div><span>PERSONALISED LAYERED PLAN</span><h4>按輪廓、鬆弛位置、皮膚厚薄、老化層次及處理範圍制定</h4><p>EC緊膚咒不會為所有客人套用同一配置。先確認主要問題，再配對合適深度與區域。</p></div><div class="tdna-plan-slots"><span><b>01</b>專業輪廓與膚況評估</span><span><b>02</b>確認鬆弛位置與老化層次</span><span><b>03</b>配對探頭深度及處理範圍</span><span><b>04</b>制定跟進與護理建議</span></div></div><p class="tdna-disclaimer">公眾頁不顯示內部價錢、固定發數或操作參數；正式方案以專業評估為準。</p></section>

          <section class="tdna-detail" id="tdna-curse-06"><div class="tdna-detail__number">06 <span>VISUAL / RESULT</span></div><header><p>BEFORE / AFTER CASES</p><h3>效果見證・五個改善方向</h3></header><p class="tdna-lead">每個案例完整保留原有 Before／After、局部放大及問題標示；圖片不裁切、不變形。</p><div class="tdna-case-grid tdna-curse-case-grid">${cases.map(item=>`<article class="tdna-case"><figure class="tdna-curse-media tdna-curse-media--contain"><img src="${APPROVED}/${item[2]}" alt="EC緊膚咒案例${item[0]} ${item[1]}療程前後比較"><figcaption><b>CASE ${item[0]}</b><span>${item[1]}</span></figcaption></figure></article>`).join("")}</div><p class="tdna-disclaimer">案例圖片用作展示不同關注位置的視覺變化。實際效果因個人膚質、年齡、輪廓狀態及療程方案而異，並非每位客人的效果保證。</p><div class="tdna-curse-final"><p>你的老化問題，可能不只存在於同一層。</p><h3>由專業分析開始</h3><span>了解你的鬆弛位置、皮膚層次及輪廓需要，再設計適合你的 EC緊膚咒方案。</span><a class="tdna-curse-cta" href="#contact" data-treatment-close>到店進行專業評估</a></div></section>
        </div>
      </section>`;
  }

  function modalMarkup(treatment) {
    if (treatment.number === "01") return liftingDetailMarkup(treatment);
    if (treatment.number === "02") return tighteningDetailMarkup(treatment);

    const STEP3_ASSET = "/tightening-dna-preview-assets/step-03-dna-repair";

    const benefits = [
      ["鬆弛逆轉", "重新激活肌底彈力，令面部輪廓由內恢复支撐感。"],
      ["細胞能量", "448.8kHz 細胞級熱能，支援粒線體與跨膜轉運活性。"],
      ["輪廓提升", "由筋膜層至表皮層的逆向提升，令下顎線更俐落。"],
      ["紋理改善", "毛孔、細紋與肌膚觸感同步升級，由深層煥發生命力。"]
    ];

    const concerns = [
      ["面部輪廓日漸模糊", "膠原流失導致輪廓支撐力下降，下面部線條日漸模糊。"],
      ["鬆弛失去緊實感", "皮膚觸感及視覺緊實度下降，出現輕至中度鬆弛。"],
      ["膠原不足的信號", "毛孔粗大、細紋浮現、肌膚失去光澤與彈力感。"],
      ["輪廓下垂的困擾", "蘋果肌下垂、嘴角紋、法令紋或下顎邊界不再清晰。"]
    ];

    const cases = [
      ["01", "鬆弛逆轉・下顎線條", "case-01.jpg", "觀察下顎線條與輪廓支撐力的自然改善。"],
      ["02", "紋理煥活・毛孔與光澤", "case-02.jpg", "觀察毛孔、細紋與肌膚光澤度的視覺改變。"],
      ["03", "輪廓提升・法令與嘴角", "case-03.jpg", "觀察中面部提升與法令位置的自然淡化。"]
    ];

    return `
      <div class="tdna-modal__backdrop" data-treatment-close></div>
      <section class="tdna-modal__panel" role="dialog" aria-modal="true" aria-labelledby="tdna-modal-title" tabindex="-1">
        <header class="tdna-modal__bar">
          <a class="tdna-modal__brand" href="#top" data-treatment-close><span>EC BEAUTY</span><small>STEP 03 / DNA REPAIR / TREATMENT DETAIL</small></a>
          <button class="tdna-modal__close" type="button" data-treatment-close aria-label="關閉療程詳情"><span>Close</span><b aria-hidden="true">×</b></button>
        </header>

        <nav class="tdna-modal__nav" aria-label="STEP 03 基因修復療程詳情章節">
          <a href="#tdna-step3-01"><b>01</b><span>療程</span></a>
          <a href="#tdna-step3-02"><b>02</b><span>功效</span></a>
          <a href="#tdna-step3-03"><b>03</b><span>原理</span></a>
          <a href="#tdna-step3-04"><b>04</b><span>適合對象</span></a>
          <a href="#tdna-step3-05"><b>05</b><span>方案</span></a>
          <a href="#tdna-step3-06"><b>06</b><span>效果</span></a>
        </nav>

        <div class="tdna-modal__content tdna-step3-detail">

          <!-- Section 01: Treatment Hero -->
          <section class="tdna-detail tdna-detail--hero" id="tdna-step3-01">
            <div class="tdna-detail__number">STEP 03 <span>TREATMENT</span></div>
            <div class="tdna-detail__hero-grid">
              <div class="tdna-detail__hero-copy">
                <p>EC BEAUTY / GENE EXPRESSION REPAIR</p>
                <h2 id="tdna-modal-title">${treatment.name}</h2>
                <div class="tdna-content-field">
                  <span>療程核心定位 / ONE-LINE BENEFIT</span>
                  <p>448.8kHz 細胞級熱能，由基因表現層面啟動修復與重塑信號，令肌底由內煥活。</p>
                </div>
                <div class="tdna-stat-row">
                  <div><b>448.8</b><span>kHz 細胞共振頻率</span></div>
                  <div><b>3</b><span>層次深度修復</span></div>
                  <div><b>6</b><span>倍基因表現激活</span></div>
                </div>
                <small class="tdna-research-note">原廠研究資料指標；測試條件、療程安排及個人效果可能不同，並非每位客人的效果保證。</small>
              </div>
              <figure class="tdna-visual tdna-visual--hero">
                <img src="${STEP3_ASSET}/step3-hero.jpg" alt="STEP 03 基因表現修復療程主視覺">
                <figcaption>細胞級修復，由基因層面開始</figcaption>
              </figure>
            </div>

            <div class="tdna-subsection">
              <div class="tdna-subsection__copy">
                <span>WHY GENE EXPRESSION REPAIR?</span>
                <h3>不只是外在護理，而是由基因層面啟動修復</h3>
                <p>448.8kHz 電阻式電容式 RF（CRF）技術，以細胞膜為作用目標，透過跨膜轉運與粒線體激活，由基因表現層面帶動肌底的逆向修復信號。</p>
                <strong>不是覆蓋問題，而是重寫肌底的衰老表達</strong>
              </div>
              <figure class="tdna-visual">
                <img src="${STEP3_ASSET}/gene-expression-overview.jpg" alt="基因表現修復技術概念">
                <figcaption>基因層面的修復信號激活</figcaption>
              </figure>
            </div>
          </section>

          <!-- Section 02: Benefits -->
          <section class="tdna-detail" id="tdna-step3-02">
            <div class="tdna-detail__number">02 <span>BENEFITS</span></div>
            <header>
              <p>WHAT ARE WE IMPROVING?</p>
              <h3>由基因層面帶動，四維逆齡修復</h3>
            </header>
            <div class="tdna-benefit-grid">
              ${benefits.map((item, index) => `
                <article class="tdna-benefit-placeholder">
                  <i>${String(index + 1).padStart(2, "0")}</i>
                  <span>${item[0]}</span>
                  <small>${item[1]}</small>
                </article>`).join("")}
            </div>
            <figure class="tdna-curse-media tdna-curse-media--wide tdna-curse-media--contain">
              <img src="${STEP3_ASSET}/step3-benefits.jpg" alt="基因表現修復療程四維功效概念">
              <figcaption>鬆弛逆轉 × 細胞能量 × 輪廓提升 × 紋理改善</figcaption>
            </figure>
          </section>

          <!-- Section 03: Technology -->
          <section class="tdna-detail" id="tdna-step3-03">
            <div class="tdna-detail__number">03 <span>TECHNOLOGY</span></div>
            <header>
              <p>HOW IT WORKS</p>
              <h3>448.8kHz 細胞級修復三層次</h3>
            </header>

            <div class="tdna-tech-grid">
              <article>
                <b>01</b>
                <span>細胞膜激活</span>
                <small>CELL MEMBRANE ACTIVATION</small>
                <p>448.8kHz 作用於細胞膜，促進跨膜轉運蛋白活性，支持離子通道正常運作。</p>
              </article>
              <article>
                <b>02</b>
                <span>粒線體賦能</span>
                <small>MITOCHONDRIAL BOOST</small>
                <p>透過電阻式熱能傳導至粒線體，支援 ATP 能量合成，令細胞恢復活力。</p>
              </article>
              <article>
                <b>03</b>
                <span>基因表達重寫</span>
                <small> gene expression remodelling</small>
                <p>由基因層面下調衰老標記，上調年輕化蛋白表現，帶動膠原與彈力重塑。</p>
              </article>
            </div>

            <div class="tdna-subsection">
              <div class="tdna-subsection__copy">
                <span>WHY 448.8kHz?</span>
                <h3>不是所有 RF 都相同</h3>
                <p>448.8kHz 是細胞膜共振頻率，與其他 RF 頻率（0.5–3MHz）不同，這個頻率直接與細胞膜離子通道產生共振，激活跨膜轉運，而非依賴電阻發熱。</p>
                <div class="tdna-timeline">
                  <article><b>0 min</b><span>溫度建立</span><small>電阻式熱能滲透真皮層</small></article>
                  <article><b>5 min</b><span>細胞膜激活</span><small>離子通道活性提升</small></article>
                  <article><b>15 min</b><span>粒線體反應</span><small>ATP 合成加速</small></article>
                </div>
              </div>
              <figure class="tdna-curse-media">
                <img src="${STEP3_ASSET}/cellular-mechanism.jpg" alt="448.8kHz 細胞級修復原理">
                <figcaption>448.8kHz 細胞膜激活原理</figcaption>
              </figure>
            </div>

            <div class="tdna-depth-intro">
              <b>三層次修復模型</b>
              <p>表面問題解決是基本；真正的修復，是令細胞由內啟動年輕化信號。</p>
            </div>

            <div class="tdna-depth-grid">
              <article><b>淺層</b><span>表皮・細胞膜</span><p>離子通道激活，細胞膜通透性改善</p></article>
              <article><b>中層</b><span>真皮・膠原</span><p>膠原受熱收縮，啟動重塑信號</p></article>
              <article><b>深層</b><span>筋膜・基底</span><p>彈力筋膜逆向修復，輪廓支撐恢復</p></article>
            </div>

            <div class="tdna-curse-split">
              <article>
                <b>WHY THIS IS DIFFERENT</b>
                <h4>不是傳統 RF，而是細胞級修復</h4>
                <p>傳統 RF 依賴電阻發熱，熱能由外部向內擴散；448.8kHz 細胞共振技術，直接激活細胞膜離子通道，由基因層面逆向修復。</p>
              </article>
              <article>
                <b>EC BEAUTY DIFFERENCE</b>
                <h4>個人化深度評估</h4>
                <p>不是所有問題都在同一層次；先分析你的輪廓鬆弛層次，再選擇作用深度與能量配置。</p>
              </article>
            </div>

            <p class="tdna-disclaimer">技術原理屬教育說明。實際療程參數、作用深度及能量配置須由專業評估後決定。</p>
          </section>

          <!-- Section 04: Suitability -->
          <section class="tdna-detail" id="tdna-step3-04">
            <div class="tdna-detail__number">04 <span>SUITABILITY</span></div>
            <header>
              <p>IS THIS FOR ME?</p>
              <h3>由輪廓狀態，而不是年齡，判斷是否適合</h3>
            </header>
            <div class="tdna-concern-grid">
              ${concerns.map(item => `
                <article class="tdna-concern-placeholder">
                  <i aria-hidden="true"></i>
                  <span>${item[0]}</span>
                  <small>${item[1]}</small>
                </article>`).join("")}
            </div>
            <p class="tdna-disclaimer">療程是否合適仍需按個人膚質、輪廓狀況及健康因素由專業人員評估。本頁不構成醫療診斷建議。</p>
          </section>

          <!-- Section 05: Personalised Plan -->
          <section class="tdna-detail" id="tdna-step3-05">
            <div class="tdna-detail__number">05 <span>PERSONALISED PLAN</span></div>
            <header>
              <p>TREATMENT PLAN</p>
              <h3>由基因層面設計個人化逆齡方案</h3>
            </header>
            <div class="tdna-plan-shell">
              <div>
                <span>STEP 03 GENE EXPRESSION REPAIR PLAN</span>
                <h4>按細胞老化程度、輪廓層次及基因表現狀態設計個人化方案</h4>
                <p>細胞老化並非整臉均勻分布；先確認你的基因表現衰老層次，再精準配置能量深度與覆蓋範圍。</p>
              </div>
              <div class="tdna-plan-slots">
                <span><b>01</b>基因表現與細胞健康評估</span>
                <span><b>02</b>確認鬆弛層次與輪廓問題分布</span>
                <span><b>03</b>配置作用深度與能量方案</span>
                <span><b>04</b>跟進細胞反應與效果進程</span>
              </div>
            </div>
          </section>

          <!-- Section 06: Cases -->
          <section class="tdna-detail" id="tdna-step3-06">
            <div class="tdna-detail__number">06 <span>VISUAL / RESULT</span></div>
            <header>
              <p>BEFORE / AFTER CASES</p>
              <h3>由基因層面真實逆齡</h3>
            </header>
            <div class="tdna-case-grid tdna-curse-case-grid">
              ${cases.map(item => `
                <article class="tdna-case">
                  <figure class="tdna-curse-media tdna-curse-media--contain">
                    <img src="${STEP3_ASSET}/${item[2]}" alt="STEP 03 基因修復案例${item[0]} ${item[1]}療程前後">
                    <figcaption><b>CASE ${item[0]}</b><span>${item[1]}</span></figcaption>
                  </figure>
                  <p>${item[3]}</p>
                </article>`).join("")}
            </div>
            <p class="tdna-disclaimer">案例圖片僅作個案及視覺展示。效果因個人基因表現狀態、細胞健康度、年齡及輪廓狀態而異，並非每位客人的效果保證。</p>
            <div class="tdna-curse-final">
              <p>你的細胞，正在等待正確的激活信號。</p>
              <h3>由基因層面開始</h3>
              <span>STEP 03 不是表面護理，而是由細胞膜、粒線體到基因表達的完整逆向修復方案。</span>
              <a class="tdna-curse-cta" href="#contact" data-treatment-close>到店進行基因表現評估</a>
            </div>
          </section>

        </div>
      </section>`;
  }

  function closeModal() {
    closeImageLightbox(false);
    const modal = document.querySelector("[data-treatment-modal]");
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("tdna-modal-open");
    window.setTimeout(() => modal.remove(), 220);
    previousFocus?.focus?.();
    activeTreatment = null;
  }

  function ensureImageLightbox() {
    if (imageLightbox) return imageLightbox;
    const root = document.createElement("div");
    root.className = "tdna-image-lightbox";
    root.dataset.imageLightbox = "";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.setAttribute("aria-label", "圖片放大預覽");
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = `
      <button class="tdna-image-lightbox__backdrop" type="button" aria-label="關閉圖片預覽"></button>
      <div class="tdna-image-lightbox__stage">
        <img alt="" draggable="false">
      </div>
      <button class="tdna-image-lightbox__close" type="button" aria-label="關閉圖片預覽">×</button>
      <span class="tdna-image-lightbox__hint" aria-hidden="true">雙指縮放・拖動查看</span>`;
    document.body.appendChild(root);

    const stage = root.querySelector(".tdna-image-lightbox__stage");
    const image = stage.querySelector("img");
    const pointers = new Map();
    let scale = 1;
    let x = 0;
    let y = 0;
    let dragStart = null;
    let pinchStart = null;

    const render = () => {
      image.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };
    const resetGesture = () => {
      pointers.clear();
      scale = 1;
      x = 0;
      y = 0;
      dragStart = null;
      pinchStart = null;
      stage.classList.remove("is-dragging");
      render();
    };
    const distance = values => Math.hypot(values[0].clientX - values[1].clientX, values[0].clientY - values[1].clientY);
    const beginGesture = () => {
      const values = [...pointers.values()];
      if (values.length === 1) dragStart = { clientX: values[0].clientX, clientY: values[0].clientY, x, y };
      if (values.length >= 2) pinchStart = { distance: distance(values), scale };
    };

    stage.addEventListener("pointerdown", event => {
      if (event.target !== image) return;
      event.preventDefault();
      stage.setPointerCapture?.(event.pointerId);
      pointers.set(event.pointerId, event);
      stage.classList.add("is-dragging");
      beginGesture();
    });
    stage.addEventListener("pointermove", event => {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, event);
      const values = [...pointers.values()];
      if (values.length >= 2 && pinchStart) {
        scale = Math.min(5, Math.max(1, pinchStart.scale * distance(values) / Math.max(1, pinchStart.distance)));
        if (scale === 1) x = y = 0;
      } else if (values.length === 1 && dragStart && scale > 1) {
        x = dragStart.x + values[0].clientX - dragStart.clientX;
        y = dragStart.y + values[0].clientY - dragStart.clientY;
      }
      render();
    });
    const endPointer = event => {
      pointers.delete(event.pointerId);
      if (!pointers.size) stage.classList.remove("is-dragging");
      dragStart = null;
      pinchStart = null;
      beginGesture();
    };
    stage.addEventListener("pointerup", endPointer);
    stage.addEventListener("pointercancel", endPointer);
    root.querySelectorAll(".tdna-image-lightbox__backdrop, .tdna-image-lightbox__close").forEach(button => button.addEventListener("click", () => closeImageLightbox()));
    root._resetGesture = resetGesture;
    imageLightbox = root;
    return root;
  }

  function openImageLightbox(source) {
    const root = ensureImageLightbox();
    const image = root.querySelector("img");
    root._returnFocus = source;
    root._resetGesture();
    image.src = source.currentSrc || source.src;
    image.alt = source.alt || "療程圖片放大預覽";
    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("tdna-image-lightbox-open");
    root.querySelector(".tdna-image-lightbox__close")?.focus();
  }

  function closeImageLightbox(restoreFocus = true) {
    if (!imageLightbox?.classList.contains("is-open")) return false;
    imageLightbox.classList.remove("is-open");
    imageLightbox.setAttribute("aria-hidden", "true");
    imageLightbox._resetGesture?.();
    document.body.classList.remove("tdna-image-lightbox-open");
    if (restoreFocus) imageLightbox._returnFocus?.focus?.();
    return true;
  }

  function enhanceModalImages(modal) {
    const touchInput = window.matchMedia("(hover: none), (pointer: coarse)");
    modal.querySelectorAll(".tdna-modal__content img").forEach(image => {
      image.classList.add("tdna-lightbox-target");
      image.tabIndex = 0;
      image.setAttribute("aria-label", `${image.alt || "療程圖片"}，放大查看`);
      image.addEventListener("dblclick", () => openImageLightbox(image));
      image.addEventListener("click", () => {
        if (touchInput.matches || window.innerWidth <= 1024) openImageLightbox(image);
      });
      image.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openImageLightbox(image);
        }
      });
    });
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
    enhanceModalImages(modal);
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
    if (event.key !== "Escape") return;
    if (closeImageLightbox()) return;
    if (activeTreatment) closeModal();
  }

  function enhanceCards() {
    const cards = [...document.querySelectorAll("#technology .compact-card")];
    if (cards.length < 2) return;
    treatments.forEach((treatment, index) => {
      const card = cards[index];
      if (card.dataset.treatmentEnhanced === "true") return;
      card.dataset.treatmentEnhanced = "true";
      card.classList.add(`tdna-treatment-card--0${index + 1}`);
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", `查看${treatment.name}療程詳情`);
      const title = card.querySelector(".card-title");
      const footer = card.querySelector(".card-footer span");
      const image = card.querySelector(".card-img-box img");
      if (title) title.textContent = treatment.name;
      if (footer) footer.textContent = "查看療程詳情";
      if (image && index === 0) {
        image.src = `${LIFTING_ASSET}/lifting-hero.jpg`;
        image.alt = "易思面部提拉護理主視覺";
      }
      if (image && index === 1) {
        image.src = `${TIGHTENING_ASSET}/ec-tightening-hero.jpg`;
        image.alt = "EC緊膚咒儀器主視覺";
      }
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
