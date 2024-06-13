// ======================================================================== slider

function createSldier(specifier) {
    const sliderWrapper = document.querySelector(`.hero__images-wrapper${specifier}`);
    const slider = sliderWrapper.querySelector('.hero__images-inner');
    const sliderControls = [...sliderWrapper.querySelectorAll('.button--slider')];
    const thumbnais = [...sliderWrapper.querySelectorAll('.button--thumbnail')];
    const slides = [...slider.children];
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

    sliderControls.forEach((item) => { item.addEventListener('click', scroll) });
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
    }
}

const onControlerClick = (evt) => {
    evt.preventDefault();
    let target = evt.currentTarget;
    console.log(target);
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
    cartControl.addEventListener('click', onControlerClick);
    createSldier();
}

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
