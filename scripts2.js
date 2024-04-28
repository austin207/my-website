// Function to handle product card hover effects
function handleProductCardHover() {
    const productCards = document.querySelectorAll('.product-card');
  
    productCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hover');
      });
  
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hover');
      });
    });
  }
  
  // Function to handle navigation menu toggle on small screens
  function handleNavToggle() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
  
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // Function to initialize all event listeners
  function initializeEventListeners() {
    handleProductCardHover();
    handleNavToggle();
  }
  
  // Initialize event listeners when the DOM is loaded
  document.addEventListener('DOMContentLoaded', initializeEventListeners);
  
  const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("navigation");

menuToggle.addEventListener("click", function () {
  navigation.classList.toggle("active");
});
const slider = document.querySelector('.slider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;

function navigate(direction) {
  const slideWidth = slider.offsetWidth;
  currentIndex += direction;
  const offset = -currentIndex * slideWidth;
  slider.style.transform = `translateX(${offset}px)`;
}

prevBtn.addEventListener('click', () => navigate(-1));
nextBtn.addEventListener('click', () => navigate(1));
function redirectTo(url) {
  window.open(url, '_blank');
}



const promptForm = document.getElementById("prompt-form");
const responseArea = document.getElementById("assistant-response"); // Corrected ID
const ratingForm = document.getElementById("rating-form");
const logArea = document.getElementById("log");

promptForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const prompt = promptForm.elements["prompt"].value;
    const response = await fetch("/ask", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    }).then(response => {
        if (!response.ok) {
            return Promise.reject(response);
        }
        return response.json();
    }).then(response => response.response);
  });

  ratingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const interactionId = ratingForm.elements["interaction_id"].value;
    const rating = ratingForm.elements["rating"].value;
    const feedback = ratingForm.elements["feedback"].value;
    await fetch("/rate", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          interaction_id: interactionId,
          rating: rating,
          feedback: feedback
      })
  }).then(response => response.json());
    ratingForm.reset();
});

const logButton = document.getElementById("log-button"); // Assuming there's a log button
logButton.addEventListener("click", async () => {
    const interactions = await fetch("/log").then(response => response.json());
    logArea.textContent = JSON.stringify(interactions.data, null, 2);
});
