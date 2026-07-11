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

document.addEventListener("DOMContentLoaded", function () {
  const botonesInscripcion = [
    document.getElementById("btn-inscripcion-hero"),
    document.getElementById("btn-inscripcion-detalles"),
    document.getElementById("btn-inscripcion-form"),
  ];

  botonesInscripcion.forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener("click", irAlFormulario);
  });

  const enlacesNav = document.querySelectorAll(".nav-link[href^='#']");
  enlacesNav.forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
      evento.preventDefault();
      const destino = enlace.getAttribute("href");
      if (!destino) return;
      cerrarMenu();
      scrollSuave(destino);
    });
  });

  const volverArriba = document.getElementById("btn-volver-arriba");
  if (volverArriba) {
    volverArriba.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const navToggle = document.querySelector(".nav-toggle");
  const header = document.querySelector(".header");

  function cerrarMenu() {
    if (!header) return;
    header.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      const abierto = header.classList.toggle("nav-open");
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
});
