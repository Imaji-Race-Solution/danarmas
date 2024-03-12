let langData;

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
});

// Language
const updateContent = (langData) => {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        const msg = langData[key] ?? key;

        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = msg;
        } else {
            element.textContent = msg;
        }
    });
};

const setLanguagePreference = (lang) => {
    localStorage.setItem('language', lang);
    location.reload();
};

const fetchLanguageData = async (lang) => {
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
};

const changeLanguage = async (lang) => {
    await setLanguagePreference(lang);

    langData = await fetchLanguageData(lang);
    updateContent(langData);
};

// Carousel
const carousels = document.querySelectorAll('.carousel');
let viewport =
    document.documentElement.clientWidth > 752 ? 'desktop' : 'mobile';
let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let isTouchDrag = false;
let isDragging = false;
let startX = 0;
let startY = 0;
const salesTitle = document.querySelector('.sales-title');
const salesContent = document.querySelector('.sales-content');

carousels.forEach((carousel) => {
    const carouselInner = carousel.querySelector('.carousel-inner');
    const items = carouselInner.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const prevBtn = carousel.querySelector('.prevBtn');
    const nextBtn = carousel.querySelector('.nextBtn');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    window.addEventListener('resize', () => {
        moveToSlide(currentIndex);
    });

    const moveToSlide = (index) => {
        currentIndex = index;
        const newPosition = -currentIndex * 100;
        carouselInner.style.transform = `translateX(${newPosition}%)`;
        salesTitle.innerHTML = langData[`sales_distribution_${index}`];
        salesContent.innerHTML =
            langData[`sales_distribution_content_${index}`];

        updateDots();
    };

    const moveToNextSlide = () => {
        currentIndex = (currentIndex + 1) % totalItems;
        moveToSlide(currentIndex);
    };

    const moveToPrevSlide = () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        moveToSlide(currentIndex);
    };

    // render item list
    for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        dot.addEventListener('click', () => moveToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const updateDots = () => {
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
    };

    updateDots();

    prevBtn.addEventListener('click', moveToPrevSlide);
    nextBtn.addEventListener('click', moveToNextSlide);

    carousel.addEventListener('touchstart', (e) => {
        e.preventDefault();

        isTouchDrag = false;
        isDragging = true;
        touchStartX = e.touches[0].clientX;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    carousel.addEventListener('touchmove', (e) => {
        e.preventDefault();

        if (
            Math.abs(e.touches[0].clientX - startX) > 10 ||
            Math.abs(e.touches[0].clientY - startY) > 10
        ) {
            isTouchDrag = true;
            touchEndX = e.touches[0].clientX;
        }
        if (isDragging) {
            e.stopPropagation();
        }
    });

    carousel.addEventListener('touchend', (e) => {
        e.preventDefault();

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
        isDragging = false;
    });

    carousel.addEventListener('touchcancel', (e) => {
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

const toggleSidebar = () => {
    sidebar.classList.toggle('translate-x-full');
    backdrop.classList.toggle('hidden');
    document.body.classList.toggle('sidebar-open');
};

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

const startCounter = (counter) => {
    const to = parseFloat(counter.getAttribute('count-to'));
    const duration = parseFloat(counter.getAttribute('duration'));
    const symbol = counter.getAttribute('end-symbol');
    const isDecimal = counter.getAttribute('decimal');

    let counterValue = 0;
    const increment = to / (duration / 5);

    const timer = setInterval(() => {
        counterValue += increment;
        counter.textContent = Math.floor(counterValue);
        if (counterValue >= to) {
            clearInterval(timer);
            if (Boolean(isDecimal)) {
                counter.textContent = to.toString().replace('.', ',');
            } else {
                counter.textContent = to;
            }
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

// Form
const additionalMessageInput = document.querySelector('.input-additional');
additionalMessageInput.addEventListener('input', () => {
    const notice = document.querySelector('.input-additional-count');
    const maxLen = additionalMessageInput.getAttribute('maxlength');
    notice.innerHTML = `${additionalMessageInput.value.length} / ${maxLen}`;
});

const submitForm = () => {
    const inputName = document.querySelector('.input-name');
    const inputEmail = document.querySelector('.input-email');
    const inputPhone = document.querySelector('.input-phone');
    const inputCompany = document.querySelector('.input-company');
    const inputMessage = document.querySelector('.input-additional');

    if (
        !inputName.value ||
        !inputEmail.value ||
        !inputPhone.value ||
        !inputCompany.value ||
        !inputMessage.value
    ) {
        modalErrorForm();
    } else {
        Swal.fire({
            icon: 'success',
            title: langData['success_form'],

            confirmButtonColor: '#75C59D',
            confirmButtonText: 'OK'
        });
    }
};

const modalErrorForm = (keyLang) => {
    Swal.fire({
        icon: 'error',
        title: langData['incomplete_form'],
        text: langData['incomplete_form_message'],
        confirmButtonColor: '#75C59D',
        confirmButtonText: 'OK'
    });
};

const observerCounter = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                startCounter(entry.target);
                observerCounter.unobserve(entry.target);
            }
        });
    },
    { threshold: 1, root: null, rootMargin: '0px' }
);

counters.forEach((counter) => {
    observerCounter.observe(counter);
});

// Section 1
const section1 = document.querySelector('.section-1');

const typeWriterEffect = (element) => {
    const text = element.getAttribute('text');
    element.innerHTML = '';

    let words = text.split(' ');

    function typeWord(wordIndex) {
        if (wordIndex < words.length) {
            let word = words[wordIndex];
            let wordHtml = '<span';

            if (word === 'Collaboration') {
                wordHtml += ' class="text-hijau"';
            }

            wordHtml += '>';

            element.innerHTML += wordHtml;

            typeCharacters(0, word, element.lastChild, wordIndex);
        } else {
            element.classList.add('finished');
        }
    }

    function typeCharacters(charIndex, word, wordSpan, wordIndex) {
        if (charIndex < word.length) {
            setTimeout(function () {
                wordSpan.textContent += word.charAt(charIndex);
                typeCharacters(charIndex + 1, word, wordSpan, wordIndex);
            }, 100);
        } else {
            element.innerHTML += ' ';
            typeWord(wordIndex + 1);
        }
    }

    typeWord(0);
};

const observerSection1 = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                const typewriter = document.querySelector('.typewriter-p');

                typeWriterEffect(typewriter);
                observerSection1.unobserve(entry.target);
            }
        });
    },
    { root: null, rootMargin: '0px' }
);

observerSection1.observe(section1);

// Section 2
const section2 = document.querySelector('.section-2');
const observerSection2 = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                section2.classList.add('fade-in');
                section2.classList.remove('opacity-0');
            }
        });
    },
    { threshold: 1, root: null, rootMargin: '0px' }
);
observerSection2.observe(section2);

window.addEventListener('DOMContentLoaded', async () => {
    const userPreferredLanguage =
        localStorage.getItem('language') === 'en' ||
        localStorage.getItem('language') === 'id'
            ? localStorage.getItem('language')
            : 'en';

    localStorage.setItem('language', userPreferredLanguage);
    langData = await fetchLanguageData(userPreferredLanguage);

    updateContent(langData);
});
