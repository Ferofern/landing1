document.addEventListener("DOMContentLoaded", function () {
  const botones = document.querySelectorAll("button");

  botones.forEach((btn) => {
    const texto = btn.textContent.trim().toLowerCase();

    if (texto === "da un recorrido") {
      btn.addEventListener("click", function () {
        window.open("https://www.youtube.com/watch?v=YnwcrLhMf4g", "_blank");
      });
    }
  });
});

const images = [
  "/src/Imagenes/imagen1.jpeg",
  "/src/Imagenes/imagen2.jpeg",
  "/src/Imagenes/imagen3.jpeg",
  "/src/Imagenes/imagen4.jpeg",
];

let currentIndex = 0;

const carouselImage = document.getElementById("carouselImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  carouselImage.src = images[currentIndex];
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  carouselImage.src = images[currentIndex];
});

window.addEventListener('DOMContentLoaded', () => {
  const toastBtn = document.getElementById('toastBtn');
  if (toastBtn) {
    toastBtn.addEventListener('click', () => {
      alert('en progreso');
    });
  }
});
