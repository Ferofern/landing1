"use strict";

import { fetchFakerData } from "./functions.js";


/**
 * Renders card components using the first three items from the data array
 * @function
 * @param {Array<{title: string, author: string, genre: string, content: string}>} data - Array of text objects
 * @returns {void}
 */
const renderCards = (data) => {
    const container = document.getElementById("skeleton-container");
    if (!container) return;
    
    container.innerHTML = '';
    
    data.slice(0, 3).forEach(item => {
        const card = `
            <div class="max-w-sm rounded overflow-hidden shadow-lg m-4">
                <div class="px-6 py-4">
                    <div class="font-bold text-xl mb-2">${item.title}</div>
                    <p class="text-gray-700 text-base">${item.content}</p>
                </div>
                <div class="px-6 pt-4 pb-2">
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">${item.author}</span>
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">${item.genre}</span>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
};

const loadData = async () => {

    const url = 'https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120';

    try {
        const result = await fetchFakerData(url);

        if (result.success) {
            console.log('Datos obtenidos con éxito:', result.body);
            renderCards(result.body.data);
        } else {
            console.error('Error al obtener los datos:', result.error);
        }

    } catch (error) {

        console.error('Ocurrió un error inesperado:', error);

    }

};
/**
 * Shows an interactive toast notification by adding the 'md:block' class.
 * @function
 * @returns {void}
 */
const showToast = ()=> {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

/**
 * Sets up a click event listener on the demo button to open a YouTube video in a new tab.
 * @function
 * @returns {void}
 */
const showVideo = () => {
    const demoButton = document.getElementById("demo");
    if (demoButton) {
        demoButton.addEventListener("click", () => {
            window.open("https://youtu.be/RemVt4UdYVo", "_blank");
        });
    }
};

(() => {
    showToast();
    showVideo();
    loadData();
})();

document.addEventListener('DOMContentLoaded', () => {
    const skeletonContainer = document.getElementById('skeleton-container');
    const cards = [
        {
            image: 'src/Imagenes/Banana1.jpg',
            title: 'Banano Orgánico',
            subtitle: 'Producto Premium',
            description: 'Cultivado bajo estrictos estándares orgánicos.'
        },
        {
            image: 'src/Imagenes/diseno_23.png',
            title: 'Cerveza de Banano',
            subtitle: 'Bebida Artesanal',
            description: 'Elaborada con nuestros mejores bananos.'
        },
        {
            image: 'src/Imagenes/4.jpg',
            title: 'Jalea de Banano',
            subtitle: 'Producto Natural',
            description: 'Dulce y nutritiva, perfecta para cualquier momento.'
        }
    ];

    // Function to create card HTML
    const createCard = (card) => `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow transition-transform hover:scale-105">
            <img src="${card.image}" alt="${card.title}" class="w-full h-40 object-cover rounded-lg">
            <h3 class="mt-4 text-xl font-bold text-gray-900 dark:text-white">${card.title}</h3>
            <h4 class="text-md text-gray-600 dark:text-gray-400">${card.subtitle}</h4>
            <p class="mt-2 text-gray-600 dark:text-gray-400">${card.description}</p>
        </div>
    `;

    // Replace skeletons with actual content after 2 seconds
    setTimeout(() => {
        skeletonContainer.innerHTML = cards.map(card => createCard(card)).join('');
    }, 2000);
});

