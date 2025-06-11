"use strict";

import { fetchFakerData } from "./functions.js";
import { saveVote, getVotes } from "./firebase.js";


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

const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        tipo: document.getElementById('tipo').value,
        mensaje: document.getElementById('mensaje').value,
        fecha: new Date().toISOString()
    };

    try {
        const response = await fetch('https://fakerapi.it/api/v2/users?_quantity=1', {
            method: 'GET' // FakerAPI solo soporta GET
        });

        if (response.ok) {
            const fakeData = await response.json();
            console.log('Mensaje simulado:', {...formData, id: fakeData.data[0].id});
            alert('Mensaje enviado con éxito');
            event.target.reset();
            cargarMensajes();
        } else {
            throw new Error('Error al enviar el mensaje');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar el mensaje: ' + error.message);
    }
};

const cargarMensajes = async () => {
    try {
        // Usamos FakerAPI para generar datos falsos de personas y comentarios
        const response = await fetch('https://fakerapi.it/api/v2/persons?_quantity=5&_locale=es_ES');
        const personData = await response.json();
        
        const container = document.getElementById('mensajesContainer');
        if (container) {
            container.innerHTML = personData.data.map(persona => `
                <div class="bg-[#264532] p-4 rounded-lg mb-4">
                    <p class="text-white font-bold">${persona.firstname} ${persona.lastname}</p>
                    <p class="text-[#96c5a9] text-sm">${persona.email}</p>
                    <p class="text-white mt-2">${persona.website}</p>
                    <p class="text-[#96c5a9] text-xs mt-2">${new Date(persona.birthday).toLocaleDateString()}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error al cargar mensajes:', error);
    }
};

const displayVotes = async () => {
    const results = document.getElementById('results');
    
    try {
        const response = await getVotes();
        
        if (response.success) {
            const votes = response.data;
            const voteCounts = {};
            
            // Count votes for each product
            Object.values(votes).forEach(vote => {
                voteCounts[vote.productID] = (voteCounts[vote.productID] || 0) + 1;
            });
            
            // Create table HTML
            const tableHTML = `
                <table class="w-full text-white">
                    <thead>
                        <tr>
                            <th class="border-b border-[#366348] py-2">Producto</th>
                            <th class="border-b border-[#366348] py-2">Total Votos</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(voteCounts).map(([product, count]) => `
                            <tr>
                                <td class="border-b border-[#366348] py-2 text-center">${product}</td>
                                <td class="border-b border-[#366348] py-2 text-center">${count}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            
            results.innerHTML = tableHTML;
        } else {
            results.innerHTML = '<p class="text-red-500 text-center">Error al cargar los votos</p>';
        }
    } catch (error) {
        results.innerHTML = `<p class="text-red-500 text-center">${error.message}</p>`;
    }
};

const enableForm = () => {
    const form = document.getElementById('form_voting');
    const select = document.getElementById('select_product');
    const results = document.getElementById('results');

    // Enable form elements
    if (select) {
        select.disabled = false;
    }
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const productId = select.value;
            if (!productId) {
                results.innerHTML = '<p class="text-red-500 text-center">Por favor seleccione un producto</p>';
                return;
            }

            try {
                const response = await saveVote(productId);
                if (response.success) {
                    await displayVotes(); // Show updated votes after saving
                } else {
                    results.innerHTML = `<p class="text-red-500 text-center">${response.message}</p>`;
                }
                form.reset();
            } catch (error) {
                results.innerHTML = `<p class="text-red-500 text-center">${error.message}</p>`;
            }
        });
    }
};

(() => {
    showToast();
    showVideo();
    loadData();
    enableForm();
    displayVotes(); // Show votes on page load
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
    
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    cargarMensajes();
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

