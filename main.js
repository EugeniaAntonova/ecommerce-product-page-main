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