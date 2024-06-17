// ======================================================================== slider

function createSldier(specifier = '', activeIndex = 0) {
    const sliderWrapper = document.querySelector(`.hero__images-wrapper${specifier}`);
    const slider = sliderWrapper.querySelector('.hero__images-inner');
    const sliderControls = [...sliderWrapper.querySelectorAll('.button--slider')];
    const thumbnails = [...sliderWrapper.querySelectorAll('.button--thumbnail')];
    const slides = [...slider.querySelectorAll('div')];
    const lightbox = document.querySelector('.light-box');
    const closeButton = lightbox.querySelector('.close-lighbox-button');
    let slideLength = slider.scrollWidth / slides.length;

    const scroll = (evt) => {
        let left = evt.currentTarget.classList.contains('left');
        let scrollDirection = left ? -slideLength : slideLength;
        slider.scrollLeft += scrollDirection;
        let farLeft = slider.scrollLeft == 0;
        let farRight = slider.scrollLeft == slider.scrollWidth - slideLength;
        if (farLeft && left) {
            slider.scrollLeft = slider.scrollWidth - slideLength;
        }
        if (farRight && !left) {
            slider.scrollLeft = 0;
        }
    }

    let activeThumbnail = thumbnails[activeIndex];
    console.log(activeIndex);
    console.log(activeThumbnail);

    const replaceActiveThumbnail = (currentThumbnail) => {
        console.log('repl');
        activeThumbnail.classList.remove('active');
        currentThumbnail.classList.add('active');
        activeThumbnail = currentThumbnail;
    }

    thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener('click', () => {
            replaceActiveThumbnail(thumbnail);
            slides[thumbnails.indexOf(thumbnail)].scrollIntoView();
        })
    })

    sliderControls.forEach((item) => { item.addEventListener('click', scroll) });

    // const observer = new IntersectionObserver((entries) => {
    //     entries.forEach((entry) => {
    //         console.log(entry.isIntersecting);
    //         let index = slides.indexOf(entry.target);
    //         console.log(index);
    //         replaceActiveThumbnail(thumbnails[index]);
    //     })
    // }, {
    //     threshold: 1,
    // });

    // slides.forEach((slide) => {
    //     observer.observe(slide);
    // })

    slider.addEventListener('scrollend', () => {
        replaceActiveThumbnail(thumbnails[slider.scrollLeft / slideLength]);
    })

    const handleEsc = (evt) => {
        if (evt.key === 'Escape') closeLightbox();
    }
    const handleSideClick = (evt) => {
        if (evt.target.classList.contains('light-box')) closeLightbox();
    }

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        closeButton.removeEventListener('click', closeLightbox);
        lightbox.removeEventListener('click', handleSideClick);
        document.removeEventListener('keydown', handleEsc);
    }

    const openLightbox = (index) => {
        lightbox.classList.add('open');
        closeButton.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', handleEsc);
        lightbox.addEventListener('click', handleSideClick);
        createSldier('.light-box-slider', index);
    }

    const onSlideClick = (evt) => {
        openLightbox(slides.indexOf(evt.target.closest('div')));
    }

    if (!specifier) {
        slider.addEventListener('click', onSlideClick)
    }

    window.addEventListener('resize', () => {
        slideLength = slider.scrollWidth / [...slider.children].length;
    })
}


// ========================================================================= burger and cart

const burger = document.querySelector('.burger');
const cartControl = document.querySelector('.cart__control');

const closePopover = (evt) => {
    if (evt.target.classList.contains('backdrop')) {
        burger.setAttribute('aria-expanded', 'false');
        cartControl.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closePopover);
    }
}

const onControlerClick = (evt) => {
    evt.preventDefault();
    let target = evt.currentTarget;
    let expanded = target.getAttribute('aria-expanded') == 'true' ? true : false;
    target.setAttribute('aria-expanded', !expanded)

    if (!expanded) {
        document.addEventListener('click', closePopover);
    } else {
        document.removeEventListener('click', closePopover);
    }

}


function onWindowSize() {
    if (window.innerWidth < 800) {
        burger.addEventListener('click', onControlerClick);
    } else {
        burger.removeEventListener('click', onControlerClick);
    }
}
cartControl.addEventListener('click', onControlerClick);
createSldier();

document.addEventListener('DOMContentLoaded', onWindowSize);
window.addEventListener('resize', onWindowSize);



// =========================================================================

const form = document.querySelector('.purchase-form');
const input = form.querySelector('input[name="amount"]');
const amountControls = [...form.querySelectorAll('.button--amount')];

input.addEventListener('keydown', (evt) => {
    if (!evt.key.match(/\d|delete|backspace|arrow.+|tab|enter/i)) evt.preventDefault();
})

// here i do not have any back, so to show the functionality, i have chosen to use session storage

let purchaseAmount = Number(sessionStorage.getItem('purchase amount')) || 0;

document.addEventListener('DOMContentLoaded', () => {
    input.value = purchaseAmount;
})

amountControls.forEach((item) => {
    item.addEventListener('click', (evt) => {
        let less = -1;
        if (purchaseAmount === 0) {
            less = 0;
        }
        purchaseAmount += evt.currentTarget.id === 'less' ? less : 1;
        input.value = purchaseAmount;
        sessionStorage.setItem('purchase amount', purchaseAmount)
    })
})
