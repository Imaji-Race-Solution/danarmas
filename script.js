// Language
function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        element.textContent = langData[key];
    });
}

function setLanguagePreference(lang) {
    localStorage.setItem('language', lang);
    location.reload();
}

async function fetchLanguageData(lang) {
    try {
        const response = await fetch(`${lang}.json`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            mode: 'no-cors'
        });
        return await response.json();
    } catch (e) {
        console.log(e);
    }
}

async function changeLanguage(lang) {
    await setLanguagePreference(lang);

    const langData = await fetchLanguageData(lang);
    updateContent(langData);
}

window.addEventListener('DOMContentLoaded', async () => {
    const userPreferredLanguage =
        localStorage.getItem('language') === 'en' ||
        localStorage.getItem('language') === 'id'
            ? localStorage.getItem('language')
            : 'en';

    localStorage.setItem('language', userPreferredLanguage);
    const langData = await fetchLanguageData(userPreferredLanguage);

    updateContent(langData);
});

// Carousel
const carousels = document.querySelectorAll('.carousel');

carousels.forEach((carousel) => {
    const carouselInner = carousel.querySelector('.carousel-inner');
    const items = carouselInner.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const prevBtn = carousel.querySelector('.prevBtn');
    const nextBtn = carousel.querySelector('.nextBtn');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let isTouchDrag = false;
    let startX = 0;
    let startY = 0;

    function moveToSlide(index) {
        currentIndex = index;
        const newPosition = -currentIndex * 100;
        carouselInner.style.transform = `translateX(${newPosition}%)`;
        updateDots();
    }

    function moveToNextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        moveToSlide(currentIndex);
    }

    function moveToPrevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        moveToSlide(currentIndex);
    }

    // render item list
    for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        dot.addEventListener('click', () => moveToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function updateDots() {
        const dots = Array.from(
            dotsContainer.querySelectorAll('.carousel-dot')
        );
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    updateDots();

    prevBtn.addEventListener('click', moveToPrevSlide);
    nextBtn.addEventListener('click', moveToNextSlide);

    carousel.addEventListener('touchstart', (e) => {
        isTouchDrag = false;
        touchStartX = e.touches[0].clientX;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (
            Math.abs(e.touches[0].clientX - startX) > 10 ||
            Math.abs(e.touches[0].clientY - startY) > 10
        ) {
            isTouchDrag = true;
            touchEndX = e.touches[0].clientX;
        }
    });

    carousel.addEventListener('touchend', (e) => {
        const deltaX = touchEndX - touchStartX;

        if (isTouchDrag) {
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    moveToPrevSlide();
                } else {
                    moveToNextSlide();
                }
            }
        }
    });

    carousel.addEventListener('touchcancel', (e) => {
        moved = false;
        startX = 0;
        startY = 0;
    });
});

// setInterval(moveToNextSlide, 5000);

// Mobile Sidebar
const buttonMenu = document.getElementById('buttonMenu');
const buttonClose = document.getElementById('buttonClose');
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('backdrop');

function toggleSidebar() {
    sidebar.classList.toggle('translate-x-full');
    backdrop.classList.toggle('hidden');
    document.body.classList.toggle('sidebar-open');
}

buttonClose.addEventListener('click', () => {
    toggleSidebar();
});

buttonMenu.addEventListener('click', () => {
    toggleSidebar();
});

backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) {
        toggleSidebar();
    }
});

// Counter
const counters = document.querySelectorAll('.counter');

const observerCounter = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            startCounter(entry.target);
            observerCounter.unobserve(entry.target);
        } else {
            console.log('not visited');
        }
    });
});

counters.forEach((counter) => {
    observerCounter.observe(counter);
});

const startCounter = (counter) => {
    const to = parseFloat(counter.getAttribute('count-to'));
    const duration = parseFloat(counter.getAttribute('duration'));
    const symbol = counter.getAttribute('end-symbol');
    console.log(symbol);

    let counterValue = 0;
    const increment = to / (duration / 5);

    const timer = setInterval(() => {
        counterValue += increment;
        counter.textContent = Math.floor(counterValue);
        if (counterValue >= to) {
            clearInterval(timer);
            counter.textContent = to;
            if (symbol !== null) {
                const span = document.createElement('span');
                if (symbol === '+') {
                    span.className = 'text-hijau';
                }
                span.innerHTML = symbol;
                counter.appendChild(span);
            }
        }
    }, 10);
};
