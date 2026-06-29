const sliderLine = document.querySelector(".slider-line");
const prevSlide = document.querySelector(".prev-slide");
const nextSlide = document.querySelector(".next-slide");

let pets = [];
let currentIndex = 0;
let visibleCards = getVisibleCards();
let isAnimating = false;

async function loadPets() {
  try {
    const response = await fetch("./pets.json");
    pets = await response.json();
    renderSlider();
  } catch (error) {
    console.log(error);
  }
}

loadPets();

function getVisibleCards() {
  if (window.innerWidth < 768) {
    return 1;
  }

  if (window.innerWidth < 1280) {
    return 2;
  }

  return 3;
}

function createCard(pet) {
  return `
    <div class="pet-card">
      <figure>
        <img src="${pet.img}" alt="${pet.name}">
        <figcaption>${pet.name}</figcaption>
      </figure>

      <button class="second-button">
        Learn more
      </button>

    </div>
  `;
}

function renderSlider() {
  visibleCards = getVisibleCards();
  const cards = [];
  sliderLine.innerHTML = "";

  for (let i = 0; i < visibleCards; i++) {
    const index = (currentIndex + i) % pets.length;
    cards.push(pets[index]);
  }

  cards.forEach((pet) => {
    sliderLine.insertAdjacentHTML("beforeend", createCard(pet));
  });
}

nextSlide.addEventListener("click", () => {
  if (isAnimating || !pets.length) return;

  isAnimating = true;

  sliderLine.style.transition = "transform .8s ease";
  sliderLine.style.transform = "translateX(-100%)";

  sliderLine.addEventListener(
    "transitionend",
    () => {
      currentIndex = (currentIndex + visibleCards) % pets.length;
      sliderLine.style.transition = "none";
      sliderLine.style.transform = "translateX(0)";
      renderSlider();
      isAnimating = false;
    },
    { once: true },
  );
});

prevSlide.addEventListener("click", () => {
  if (isAnimating) return;

  isAnimating = true;
  currentIndex = (currentIndex - visibleCards + pets.length) % pets.length;

  renderSlider();

  sliderLine.style.transition = "none";
  sliderLine.style.transform = "translateX(-100%)";
  sliderLine.offsetHeight;
  sliderLine.style.transition = "transform .5s ease";
  sliderLine.style.transform = "translateX(0)";

  sliderLine.addEventListener(
    "transitionend",
    () => {
      isAnimating = false;
    },
    { once: true },
  );
});

window.addEventListener("resize", () => {
  visibleCards = getVisibleCards();
  renderSlider();
});

const burger = document.querySelector(".burger-btn");
const menu = document.querySelector(".menu");
const navLinks = document.querySelectorAll(".menu a");
burger.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.classList.toggle("open");
  burger.classList.toggle("close");
  document.body.classList.toggle("lock");
});
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.toggle("open");
    burger.classList.toggle("close");
    document.body.classList.toggle("lock");
  });
});
document.addEventListener("click", (e) => {
  if (menu.classList.contains("open") && !menu.contains(e.target)) {
    menu.classList.toggle("open");
    burger.classList.toggle("close");
    document.body.classList.toggle("lock");
  }
});
