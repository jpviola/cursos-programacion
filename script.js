const FORMULARIO_URL = "https://forms.gle/2wqvPCqDSQX9Wvs29";

function irAlFormulario() {
  if (!FORMULARIO_URL) return;
  window.open(FORMULARIO_URL, "_blank", "noopener");
}

function scrollSuave(id) {
  const seccion = document.querySelector(id);
  if (!seccion) return;
  seccion.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initCountdown() {
  const countdownEl = document.getElementById("countdown");
  if (!countdownEl) return;

  const now = new Date();
  const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  function updateCountdown() {
    const diff = deadline - new Date();
    if (diff <= 0) {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function initCuposBar() {
  const bars = document.querySelectorAll(".cupos-bar-fill");
  bars.forEach(function (bar) {
    const cupos = parseInt(bar.getAttribute("data-cupos"), 10);
    const total = parseInt(bar.getAttribute("data-total"), 10);
    const pct = (cupos / total) * 100;
    setTimeout(function () {
      bar.style.width = pct + "%";
      if (pct <= 30) {
        bar.style.background = "linear-gradient(90deg, #ff4444, #ff6b6b)";
      } else if (pct <= 60) {
        bar.style.background = "linear-gradient(90deg, #ff6b35, #ff9f1c)";
      }
    }, 300);
  });
}

function initCtaSticky() {
  const ctaSticky = document.getElementById("cta-sticky");
  if (!ctaSticky) return;

  let lastScroll = 0;
  window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;
    if (scrollY > 600) {
      ctaSticky.style.transform = "translateY(0)";
      ctaSticky.style.opacity = "1";
    } else {
      ctaSticky.style.transform = "translateY(100%)";
      ctaSticky.style.opacity = "0";
    }
    lastScroll = scrollY;
  });

  ctaSticky.style.transform = "translateY(100%)";
  ctaSticky.style.opacity = "0";
  ctaSticky.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
}

document.addEventListener("DOMContentLoaded", function () {
  var botonesInscripcion = [
    document.getElementById("btn-inscripcion-hero"),
    document.getElementById("btn-inscripcion-detalles"),
    document.getElementById("btn-inscripcion-form"),
  ];

  botonesInscripcion.forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener("click", irAlFormulario);
  });

  var enlacesNav = document.querySelectorAll(".nav-link[href^='#']");
  enlacesNav.forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
      evento.preventDefault();
      var destino = enlace.getAttribute("href");
      if (!destino) return;
      cerrarMenu();
      scrollSuave(destino);
    });
  });

  var volverArriba = document.getElementById("btn-volver-arriba");
  if (volverArriba) {
    volverArriba.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var navToggle = document.querySelector(".nav-toggle");
  var header = document.querySelector(".header");

  function cerrarMenu() {
    if (!header) return;
    header.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      var abierto = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", abierto ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) {
        cerrarMenu();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrarMenu();
    });
  }

  initCountdown();
  initCuposBar();
  initCtaSticky();
});
