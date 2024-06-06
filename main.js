// ======================================================================== slider
const slider = document.querySelector('.hero__images');
const sliderControls = [...document.querySelectorAll('.button--slider')];
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

sliderControls.forEach((item) => {item.addEventListener('click', scroll)});

window.addEventListener('resize', () => {
    slideLength = slider.scrollWidth / [...slider.children].length;
})

// ========================================================================= burger

const burger = document.querySelector('.burger');

const burgerHidden = burger.classList.contains('hidden');

const closeBurger = (evt) => {
    if (evt.target.classList.contains('backdrop')) {
        burger.setAttribute('aria-expanded', 'false');
        console.log(burger.getAttribute('aria-expanded'));
    }
}

const onBurgerClick = () => {
    let expanded = burger.getAttribute('aria-expanded') == 'true' ? true : false;
    burger.setAttribute('aria-expanded', !expanded)

    if (!expanded) {
        document.addEventListener('click', closeBurger);
    } else {
        document.removeEventListener('click', closeBurger);
    }

}

if (!burgerHidden) {
    burger.addEventListener('click', onBurgerClick)
}

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
