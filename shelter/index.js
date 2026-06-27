const sliderLine = document.querySelector(".slider-line");
const prevSlide = document.querySelector(".prev-slide");
const nextSlide = document.querySelector(".next-slide");

let SlideIndex = 0;
const SliderLength = document.querySelectorAll(".pet-card").length;

function turnSlide() {
  console.log("SliderLength: ", SliderLength);
  sliderLine.style.transform = `translateX(-${SlideIndex * 370}px)`;
}

prevSlide.addEventListener("click", () => {
  SlideIndex--;
  if (SlideIndex >= 0) {
    turnSlide();
  } else {
    SlideIndex = SliderLength - 3;
    turnSlide();
  }
});

nextSlide.addEventListener("click", () => {
  SlideIndex++;
  if (SlideIndex < SliderLength - 3) {
    turnSlide();
  } else {
    SlideIndex = 0;
    turnSlide();
  }
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
