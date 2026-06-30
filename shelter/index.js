const sliderLine = document.querySelector(".slider-line");

function createPaginationCard(pet) {
  return `
<div class="pet-card">

    <figure>
        <img src="${pet.img}" alt="${pet.name}">
        <figcaption>
            ${pet.name}
        </figcaption>
    </figure>

    <button class="second-button">
        Learn more
    </button>

</div>
`;
}

if (sliderLine) {
  const prevSlide = document.querySelector(".prev-slide");
  const nextSlide = document.querySelector(".next-slide");

  let pets = [];
  let currentIndex = 0;
  let visibleCards = getVisibleCards();
  let isAnimating = false;

  async function loadSliderPets() {
    try {
      const response = await fetch("./pets.json");
      pets = await response.json();
      renderSlider();
    } catch (error) {
      console.log(error);
    }
  }

  loadSliderPets();

  function getVisibleCards() {
    if (window.innerWidth < 768) {
      return 1;
    }

    if (window.innerWidth < 1280) {
      return 2;
    }

    return 3;
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
      sliderLine.insertAdjacentHTML("beforeend", createPaginationCard(pet));
    });

    sliderLine.querySelectorAll(".pet-card").forEach((card, index) => {
      card.addEventListener("click", () => {
        openPopup(cards[index]);
      });
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
}

const burger = document.querySelector(".burger-btn");
const menu = document.querySelector(".menu");

if (burger && menu) {
  const navLinks = document.querySelectorAll(".menu a");

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
    burger.classList.toggle("close");
    document.body.classList.toggle("lock");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      burger.classList.remove("close");
      document.body.classList.remove("lock");
    });
  });

  document.addEventListener("click", (e) => {
    if (menu.classList.contains("open") && !menu.contains(e.target)) {
      menu.classList.remove("open");
      burger.classList.remove("close");
      document.body.classList.remove("lock");
    }
  });
}

const petsWrapper = document.querySelector(".pets-wrapper");
if (petsWrapper) {
  const btnFirst = document.querySelector(".btn-first");
  const btnPrev = document.querySelector(".btn-prev");
  const btnCurrent = document.querySelector(".btn-current");
  const btnNext = document.querySelector(".btn-next");
  const btnLast = document.querySelector(".btn-last");

  let petsList = [];
  let fullPetsList = [];
  let currentPage = 1;

  function getCardsPerPage() {
    if (window.innerWidth < 768) return 3;
    if (window.innerWidth < 1280) return 6;

    return 8;
  }

  let cardsPerPage = getCardsPerPage();

  async function loadPaginationPets() {
    try {
      const response = await fetch("./pets.json");
      petsList = await response.json();
      createFullPetsList();
      renderPage();
    } catch (error) {
      console.log("ERROR:", error);
    }
  }

  function createFullPetsList() {
    fullPetsList = [];

    for (let i = 0; i < 6; i++) {
      const shuffled = [...petsList].sort(() => Math.random() - 0.5);

      fullPetsList.push(...shuffled);
    }

    for (let i = 1; i < fullPetsList.length - 1; i++) {
      if (fullPetsList[i].name === fullPetsList[i - 1].name) {
        [fullPetsList[i], fullPetsList[i + 1]] = [
          fullPetsList[i + 1],
          fullPetsList[i],
        ];
      }
    }
  }

  function renderPage() {
    cardsPerPage = getCardsPerPage();

    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const pagePets = fullPetsList.slice(start, end);

    petsWrapper.classList.add("fade-out");

    setTimeout(() => {
      petsWrapper.innerHTML = "";

      pagePets.forEach((pet) => {
        petsWrapper.insertAdjacentHTML("beforeend", createPaginationCard(pet));
      });

      petsWrapper.querySelectorAll(".pet-card").forEach((card, index) => {
        card.addEventListener("click", () => {
          openPopup(pagePets[index]);
        });
      });

      btnFirst.textContent = "<<";
      btnPrev.textContent = "<";
      btnCurrent.textContent = currentPage;
      btnNext.textContent = ">";
      btnLast.textContent = ">>";
      updateButtons();
      updateButtons();

      petsWrapper.classList.remove("fade-out");
      petsWrapper.classList.add("fade-in");

      setTimeout(() => {
        petsWrapper.classList.remove("fade-in");
      }, 400);
    }, 400);
  }

  function updateButtons() {
    const pagesCount = Math.ceil(fullPetsList.length / cardsPerPage);

    btnFirst.classList.toggle("btn-inactive", currentPage === 1);
    btnPrev.classList.toggle("btn-inactive", currentPage === 1);
    btnNext.classList.toggle("btn-inactive", currentPage === pagesCount);
    btnLast.classList.toggle("btn-inactive", currentPage === pagesCount);
  }

  btnNext.addEventListener("click", () => {
    const pagesCount = Math.ceil(fullPetsList.length / cardsPerPage);

    if (currentPage < pagesCount) {
      currentPage++;
      renderPage();
    }
  });

  btnPrev.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
    }
  });

  btnFirst.addEventListener("click", () => {
    if (currentPage !== 1) {
      currentPage = 1;
      renderPage();
    }
  });

  btnLast.addEventListener("click", () => {
    const pagesCount = Math.ceil(fullPetsList.length / cardsPerPage);

    if (currentPage !== pagesCount) {
      currentPage = pagesCount;
      renderPage();
    }
  });

  window.addEventListener("resize", () => {
    currentPage = 1;
    renderPage();
  });

  loadPaginationPets();
}

const popupOverlay = document.querySelector(".popup-overlay");
const popupClose = document.querySelector(".popup-close");

function openPopup(pet) {
  document.querySelector(".popup-image").src = pet.img;

  document.querySelector(".popup-name").textContent = pet.name;

  document.querySelector(".popup-type").textContent =
    `${pet.type} - ${pet.breed}`;

  document.querySelector(".popup-description").textContent = pet.description;

  document.querySelector(".popup-age").textContent = pet.age;

  document.querySelector(".popup-inoculations").textContent =
    pet.inoculations.join(", ");

  document.querySelector(".popup-diseases").textContent =
    pet.diseases.join(", ");

  document.querySelector(".popup-parasites").textContent =
    pet.parasites.join(", ");

  popupOverlay.classList.add("open");
  document.body.classList.add("lock");
}

function closePopup() {
  popupOverlay.classList.remove("open");
  document.body.classList.remove("lock");
}

popupClose.addEventListener("click", closePopup);

popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) {
    closePopup();
  }
});
