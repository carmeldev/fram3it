window.fram3itModules = window.fram3itModules || {};

class FrameitProducts extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${this.getStyles()}</style><div class="all-categories"></div>`;
    this.renderAllCategories();
    this.observeFadeUps(); // <-- observe fade-up elements so they get .visible
  }

  /**
   * observe all .fade-up elements and add .visible when they come into view
   */
  observeFadeUps() {
    const root = this.shadowRoot;
    if (!root) return;

    const els = Array.from(root.querySelectorAll('.fade-up'));
    if (!els.length) return;

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // reveal once
        }
      });
    }, { threshold: 0.18 });

    els.forEach(el => io.observe(el));
  }

  /**
   * 🧱 Render all categories
   */
  renderAllCategories() {
    const data = window.Fram3itProducts || [];
    const categories = window.Fram3itCategories || [];
    const allContainer = this.shadowRoot.querySelector(".all-categories");
    allContainer.innerHTML = `
      <div class="products-wrapper fade-up">
        <div class="section-header">
          <div class="line"></div>
          <div class="section-text">
            <h2 class="heading">Our Products</h2>
            <p class="subtext">Hand-curated frames for every memory 💛</p>
          </div>
          <div class="line"></div>
        </div>
      </div>
    `;

    data.forEach((category, catIndex) => {
      const matchedCategory = categories.find(c => c.code === category.code);
      const categoryName = matchedCategory ? matchedCategory.category : this.formatCategoryName(category.code);

      const section = document.createElement("section");
      section.classList.add("category-section", "fade-up");

      // category header
      section.innerHTML = `
        <div class="category-highlight fade-up" id=${category.code}>
          <h2 class="category-highlight-title">${categoryName}</h2>
        </div>

        <div class="product-container"></div>
        <div id="sentinel-${catIndex}" class="sentinel"></div>
      `;

      allContainer.appendChild(section);
      this.renderProducts(category, section.querySelector(".product-container"), section.querySelector(`#sentinel-${catIndex}`));
    });
  }

  /**
   * 🧩 Render Products inside each category
   */
  renderProducts(category, container, sentinel) {
    const itemsPerLoad = 6;
    let currentIndex = 0;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadProducts();
    });

    const loadProducts = () => {
      const items = category.Products.slice(currentIndex, currentIndex + itemsPerLoad);
      items.forEach((p, i) => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        const folder = `./assets/products/${p.code}`;
        const imgTags = [1, 2, 3].map(
          (n, index) =>
            `<img src="${folder}/${n}.webp" class="${index === 0 ? "active" : ""}" onerror="this.style.display='none'">`
        ).join("");

        const dots = `<div class="dots">${[1, 2, 3]
          .map((_, i) => `<span class="dot ${i === 0 ? "active" : ""}"></span>`)
          .join("")}</div>`;

        card.innerHTML = `
          <div class="product-slider">
            ${imgTags}
            ${dots}
          </div>
          <h3 class="productName">${p.name}</h3>
          <p class="product-desc">${p.desc}</p>
          <div class="product-footer">
            <div class="price">
              <select>
                <option value="A4" data-price="400">A4 Frame</option>
                <option value="A3" data-price="700">A3 Frame</option>
              </select>
              <span class="price-text">₹400</span>
            </div>
            <button class="order-btn">Order Now</button>
          </div>
        `;

        // Slider logic
        const imgs = card.querySelectorAll(".product-slider img");
        const dotsEls = card.querySelectorAll(".dot");
        let current = 0;
        let interval = null;

        const showImage = (idx) => {
          imgs.forEach((img, i) => img.classList.toggle("active", i === idx));
          dotsEls.forEach((d, i) => d.classList.toggle("active", i === idx));
        };

        const startAutoSlide = () => {
          interval = setInterval(() => {
            current = (current + 1) % imgs.length;
            showImage(current);
          }, 1800);
        };

        const stopAutoSlide = () => clearInterval(interval);

        // Hover auto-slide
        card.addEventListener("mouseenter", startAutoSlide);
        card.addEventListener("mouseleave", stopAutoSlide);

        // Swipe on mobile
        let startX = 0;
        card.querySelector(".product-slider").addEventListener("touchstart", e => {
          startX = e.touches[0].clientX;
        });
        card.querySelector(".product-slider").addEventListener("touchend", e => {
          const diff = e.changedTouches[0].clientX - startX;
          if (Math.abs(diff) > 40) {
            current = diff > 0 ? (current - 1 + imgs.length) % imgs.length : (current + 1) % imgs.length;
            showImage(current);
          }
        });

        // Price selector
        const select = card.querySelector("select");
        const priceText = card.querySelector(".price-text");
        select.addEventListener("change", (e) => {
          const price = e.target.selectedOptions[0].dataset.price;
          priceText.textContent = `₹${price}`;
        });

        // WhatsApp order
        card.querySelector(".order-btn").addEventListener("click", () => {
          const size = select.value;
          const price = priceText.textContent;
          const msg = `I am interested in ordering the frame:\n👉 ${p.name} (${p.code})\n📏 Size: ${size}\n💰 Price: ${price}\n🖼️ Category: ${category.code}`;
          const encodedMsg = encodeURIComponent(msg);
          window.open(`https://wa.me/+919791745573?text=${encodedMsg}`, "_blank");
        });

        container.appendChild(card);
        setTimeout(() => card.classList.add("visible"), i * 100);
      });

      currentIndex += itemsPerLoad;
      if (currentIndex >= category.Products.length) observer.disconnect();
    };

    loadProducts();
    observer.observe(sentinel);
  }

  /**
   * 🎨 Styles
   */
  getStyles() {
    return `
      .category-highlight {
        display: inline-block;
        background: linear-gradient(90deg, rgba(255, 75, 92, 0.08), rgba(255, 75, 92, 0));
        border-left: 4px solid #FDC500;
        border-radius: 3px;
        padding: 10px 18px 10px 12px;
        margin: 0 0 18px;
        animation: fadeUp 1s ease forwards;
      }

      .category-highlight-title {
        color: #FDC500;
        font-weight: 600;
        font-size: 1.25rem;
        margin: 0;
        letter-spacing: 0.3px;
      }

      @media (max-width: 576px) {
        .category-highlight {
          padding: 8px 14px;
          margin: 0 0 12px;
        }

        .category-highlight-title {
          font-size: 1.05rem;
        }
      }
      
      .all-categories {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 10px;
      }

      .fade-up {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
      }

      .fade-up.visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* 🧭 Our Products Header */
      .products-wrapper {
        text-align: center;
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
      }

      .line {
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, transparent, #ccc, transparent);
      }

      .section-text {
        text-align: center;
      }

      .heading {
        font-size: 2rem;
        font-weight: 600;
        color: #222;
        margin: 0;
      }

      .subtext {
        font-size: 1rem;
        color: #555;
        margin-top: 6px;
      }


      .category-section {
        animation: fadeUp 1s ease forwards;
      }

      .category-header {
        text-align: left;
        margin-bottom: 20px;
      }

      .subtext {
        font-size: 1rem;
        color: #777;
        margin-bottom: 8px;
      }

      .animated-heading {
        display: inline-block;
        background: linear-gradient(90deg, #fdc500, #ffa500);
        padding: 6px 20px;
        border-radius: 30px;
        font-size: 1.6rem;
        font-weight: 700;
        color: #222;
        animation: pulse 2s infinite alternate;
      }

      @keyframes pulse {
        from { transform: scale(1); box-shadow: 0 0 5px rgba(255, 185, 0, 0.6); }
        to { transform: scale(1.05); box-shadow: 0 0 15px rgba(255, 185, 0, 0.8); }
      }

      .product-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 18px;
      }

      .product-card {
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        padding: 12px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        opacity: 0;
        transform: translateY(15px);
        transition: all 0.7s ease;
      }
      .product-card:hover {
        scale: 1.02;
        box-shadow: 0 4px 14px rgba(0,0,0,0.2);
      } 

      .product-card.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .product-slider {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        height: 210px;
      }

      .product-slider img {
        width: 100%;
        display: none;
        border-radius: 8px;
      }

      .product-slider img.active {
        display: block;
        animation: fadeIn 0.6s ease;
      }

      .dots {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        transition: background 0.3s;
      }

      .dot.active {
        background: #FDC500;
      }

      .productName {
        font-size: 1.05rem;
        font-weight: 600;
        margin: 10px 0 3px;
        color: #1a1a1a;
      }

      .product-desc {
        font-size: 0.78rem;
        color: #555;
        margin: 5px 0 10px 0;
      }

      .product-footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        margin-top: auto;
      }

      .price {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      select {
        padding: 4px 8px;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 0.85rem;
      }

      .price-text {
        font-weight: 700;
      }

      .order-btn {
        background: #FDC500;
        color: #000;
        border: none;
        border-radius: 5px;
        padding: 8px 14px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.3s ease;
        font-size: 0.85rem;
      }

      .order-btn:hover {
        background: #ffcd00;
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: scale(1.02); }
        to { opacity: 1; transform: scale(1); }
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(25px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 576px) {
        .product-container {
          grid-template-columns: repeat(2, minmax(150px, 1fr));
          gap: 12px;
        }
        .product-slider {
          height: 160px;
        }
      }
    `;
  }

  formatCategoryName(code) {
    return code.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }
}

customElements.define("frameit-products", FrameitProducts);
