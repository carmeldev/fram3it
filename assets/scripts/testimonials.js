window.fram3itModules = window.fram3itModules || {};

class FrameitTestimonials extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <section class="testimonials-clean">
        <h2 class="test-title">Loved by people all over India 💛</h2>
        <div class="test-wrapper"></div>
      </section>
    `;

    this.renderTestimonials();
  }

  renderTestimonials() {
    const data = window.Fram3itTestimonials || [];
    const wrapper = this.shadowRoot.querySelector(".test-wrapper");

    if (!data.length) {
      wrapper.innerHTML = `<p>No testimonials yet 😅</p>`;
      return;
    }

    data.forEach((item, i) => {
      const slide = document.createElement("div");
      slide.classList.add("test-slide");
      if (i === 0) slide.classList.add("active");
      slide.innerHTML = `
        <p class="test-content">“${item.testimonial}”</p>
        <span class="test-name">– ${item.name}</span>
      `;
      wrapper.appendChild(slide);
    });

    // Auto Slide
    const slides = wrapper.querySelectorAll(".test-slide");
    let tidx = 0;
    setInterval(() => {
      slides[tidx].classList.remove("active");
      tidx = (tidx + 1) % slides.length;
      slides[tidx].classList.add("active");
    }, 3200);
  }

  getStyles() {
    return `
      .testimonials-clean {
        padding: 80px 20px;
        text-align: center;
      }

      .test-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 40px;
        color: #222;
        animation: fadeInUp .8s ease;
      }

      .test-wrapper {
        max-width: 850px;
        margin: 0 auto;
        position: relative;
        min-height: 160px;
      }

      .test-slide {
        opacity: 0;
        position: absolute;
        inset: 0;
        transition: opacity .6s ease;
      }

      .test-slide.active {
        opacity: 1;
        position: relative;
      }

      .test-content {
        font-size: 1.4rem;
        font-weight: 500;
        line-height: 1.5;
        color: #222;
        animation: fadeInUp .7s ease;
      }

      .test-name {
        display: block;
        margin-top: 20px;
        font-size: 1rem;
        color: #FDC500;
        font-weight: 600;
        animation: fadeInUp 1s ease;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 576px) {
        .test-content {
          font-size: 1.1rem;
        }
      }
    `;
  }
}

customElements.define("frameit-testimonials", FrameitTestimonials);
