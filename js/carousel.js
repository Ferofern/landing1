const images = [
    'src/Imagenes/imagen1.jpeg',
    'src/Imagenes/imagen2.jpeg',
    'src/Imagenes/imagen3.jpeg',
    'src/Imagenes/imagen4.jpeg'
];

let currentImageIndex = 0;
const carouselImage = document.getElementById('carouselImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateImage() {
    carouselImage.src = images[currentImageIndex];
}

prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateImage();
});

nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateImage();
});
