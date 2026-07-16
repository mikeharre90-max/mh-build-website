// MH Build — shared site behaviour

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initGallery();
  initContactForm();
});

function initNav() {
  const toggle = document.querySelector(".nav__toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initGallery() {
  const items = document.querySelectorAll("[data-lightbox]");
  const lightbox = document.querySelector(".lightbox");
  if (!items.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox__caption");
  const closeBtn = lightbox.querySelector(".lightbox__close");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const fullSrc = item.getAttribute("data-lightbox");
      const caption = item.getAttribute("data-caption") || "";
      lightboxImg.src = fullSrc;
      lightboxImg.alt = caption;
      lightboxCaption.textContent = caption;
      lightbox.classList.add("is-open");
      document.body.classList.add("nav-open");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    lightboxImg.src = "";
  }

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

// NOTE: This form has no backend yet. It builds a mailto: draft from the
// entered details so enquiries land in an inbox. Once you pick a host,
// consider replacing this with Netlify Forms / Formspree / a serverless
// endpoint for a smoother, no-email-client-popup experience.
const CONTACT_EMAIL = "Mike@mhbuild.co.nz";

function initContactForm() {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector(".form-status");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const phone = data.get("phone") || "";
    const projectType = data.get("project-type") || "";
    const message = data.get("message") || "";

    const subject = encodeURIComponent(`Website enquiry — ${projectType || "General"} — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nProject type: ${projectType}\n\n${message}`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    if (status) {
      status.textContent = "Opening your email app with these details filled in — send it from there to reach us.";
      status.classList.add("is-visible");
    }
  });
}
