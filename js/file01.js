"use strict";

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
})();

