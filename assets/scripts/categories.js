window.fram3itModules = window.fram3itModules || {};

class FrameitFloatingCategory extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>

      <!-- 🟡 Floating Bubble -->
      <div class="cat-bubble fram-tip" id="catBubble" data-tip="Categories">
        <div class="cat-bubble-inner" id="catBubbleInner">
          <img src="./assets/category.png" alt="Categories">
        </div>
      </div>

      <!-- 📋 Category Panel -->
      <div class="cat-panel" id="catPanel">
        <div class="cat-panel-header">
          Categories
          <button class="cat-min" id="catMinBtn">–</button>
        </div>
        <div class="cat-list" id="catList"></div>
      </div>
    `;

    this.initializeCategoryPanel();
  }

  initializeCategoryPanel() {
    const shadow = this.shadowRoot;
    const bubble = shadow.getElementById("catBubble");
    const panel = shadow.getElementById("catPanel");
    const closeBtn = shadow.getElementById("catMinBtn");
    const listContainer = shadow.getElementById("catList");

    if (!bubble || !panel || !listContainer) return;

    const categories = window.Fram3itCategories || [];

    // 🧱 Dynamically populate categories
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = cat.category;
      btn.dataset.code = cat.code;
      listContainer.appendChild(btn);
    });

    // 🟡 Toggle panel open/close
    bubble.addEventListener("click", () => {
      panel.classList.toggle("open");
    });

    closeBtn.addEventListener("click", () => {
      panel.classList.remove("open");
    });

    // 🖱️ Handle category button clicks inside panel
    listContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      listContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      this.navigateToCategory(btn.dataset.code);
      panel.classList.remove("open"); // close after navigation
    });
  }

  navigateToCategory(code) {
    if (!code) return;
    const safeId = code.replace(/\s+/g, "_").toUpperCase();

    // 🔍 Try normal DOM first
    let target = document.getElementById(safeId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // 🔍 Try inside <frameit-products> shadow DOM
    const fram3it = document.querySelector("frameit-products");
    if (fram3it && fram3it.shadowRoot) {
      target = fram3it.shadowRoot.getElementById(safeId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    console.warn(`❌ Section not found for ID: ${safeId}`);
  }

  getStyles() {
    return `
      /* 💛 Floating Bubble */
      .cat-bubble {
        position: fixed;
        bottom: 90px;
        right: 22px;
        width: 54px;
        height: 54px;
        background: #FDC500;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        box-shadow: 0 6px 20px rgba(0, 0, 0, .25);
        cursor: pointer;
        transition: transform .25s;
        animation: initialJump 2.5s ease-in-out;
      }

      .cat-bubble:hover {
        transform: scale(1.08);
      }

      @keyframes initialJump {
        0% { transform: translateY(0); }
        20% { transform: translateY(-8px); }
        40% { transform: translateY(8px); }
        60% { transform: translateY(-5px); }
        80% { transform: translateY(5px); }
        100% { transform: translateY(0); }
      }

      .cat-bubble-inner{
        display: flex;
      }

      .cat-bubble-inner img {
        width: 22px;
        height: 22px;
        filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%);
      }

      /* ✨ Tooltip */
      .fram-tip::after {
        content: attr(data-tip);
        position: absolute;
        bottom: 65px;
        right: 0;
        transform: translateY(10px);
        opacity: 0;
        background: #333;
        color: #fff;
        font-size: 0.75rem;
        padding: 4px 8px;
        border-radius: 6px;
        white-space: nowrap;
        transition: all .25s ease;
        pointer-events: none;
      }
      .fram-tip:hover::after {
        opacity: 1;
        transform: translateY(0);
      }

      /* 🧾 Category Panel */
      .cat-panel {
        position: fixed;
        bottom: 110px;
        right: 22px;
        width: 240px;
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 12px 30px rgba(0, 0, 0, .18);
        z-index: 9999;
        padding: 14px;
        transform: scale(.7);
        opacity: 0;
        pointer-events: none;
        transform-origin: bottom right;
        transition: opacity .25s, transform .25s;
      }

      .cat-panel.open {
        opacity: 1;
        pointer-events: auto;
        transform: scale(1);
      }

      .cat-panel-header {
        font-weight: 700;
        color: #1a1a1a;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: .95rem;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
      }

      .cat-min {
        border: none;
        background: #f2f2f2;
        width: 26px;
        height: 26px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 18px;
      }

      .cat-list {
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .cat-list button {
        border: none;
        background: #fff;
        padding: 10px 12px;
        text-align: left;
        border-radius: 10px;
        font-weight: 500;
        cursor: pointer;
        font-size: .9rem;
        border: 1px solid #eee;
        transition: .2s;
      }

      .cat-list button:hover {
        transform: translateY(-2px);
        border-color: #FDC500;
      }

      .cat-list button.active {
        background: #FDC500;
        border-color: #FDC500;
        color: #000;
        font-weight: 600;
      }
    `;
  }
}

customElements.define("frameit-floating-category", FrameitFloatingCategory);
