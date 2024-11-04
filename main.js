// ======================================================================== slider
(function () {

    class Slider {
        constructor(name, index) {
            this.sliderWrapper = document.querySelector(name);
            this.slider = this.sliderWrapper.querySelector('.hero__images-inner');
            this.sliderControls = [...this.sliderWrapper.querySelectorAll('.button--slider')];
            this.thumbnails = [...this.sliderWrapper.querySelectorAll('.button--thumbnail')];
            this.slides = [...this.slider.querySelectorAll('div')];
            this.slideLength = this.slider.scrollWidth / this.slides.length;
            this.activeThumbnail = this.thumbnails[index];
            this.scrollFunc = this.scroll.bind(this);
            this.onThumbnailClickFunc = this.onThumbnailClick.bind(this);
            this.onSliderScrollFunc = this.onSliderScroll.bind(this);
        }

        scroll(evt) {
            let left = evt.currentTarget.classList.contains('left');
            let scrollDirection = left ? -this.slideLength : this.slideLength;
            this.slider.scrollLeft += scrollDirection;
            let farLeft = this.slider.scrollLeft == 0;
            let farRight = this.slider.scrollLeft == this.slider.scrollWidth - this.slideLength;
            if (farLeft && left) {
                this.slider.scrollLeft = this.slider.scrollWidth - this.slideLength;
            }
            if (farRight && !left) {
                console.log('right end')
                this.slider.scrollLeft = 0;
            }
        }

        activateSliderControls() {
            this.sliderControls.forEach((item) => { item.addEventListener('click', this.scrollFunc) });
        }

        deactivateSliderControls() {
            this.sliderControls.forEach((item) => { item.removeEventListener('click', this.scrollFunc) });
        }

        initializeThumbnail() {
            this.activeThumbnail.classList.add('active');
            this.slides[this.thumbnails.indexOf(this.activeThumbnail)].scrollIntoView();
        }

        replaceActiveThumbnail(currentThumbnail) {
            this.activeThumbnail.classList.remove('active');
            currentThumbnail.classList.add('active');
            this.activeThumbnail = currentThumbnail;
        }

        onThumbnailClick(evt) {
            let thumbnail = evt.currentTarget;
            this.replaceActiveThumbnail(thumbnail);
            this.slides[this.thumbnails.indexOf(thumbnail)].scrollIntoView();
        }

        activateThumbnails() {
            this.thumbnails.forEach((thumbnail) => {
                thumbnail.addEventListener('click', this.onThumbnailClickFunc);
            })
        }
        deactivateThumbnails() {
            this.thumbnails.forEach((thumbnail) => {
                thumbnail.removeEventListener('click', this.onThumbnailClickFunc);
            })
        }

        onSliderScroll() {
            this.replaceActiveThumbnail(this.thumbnails[this.slider.scrollLeft / this.slideLength]);
        }

        syncronizeScroll() {
            this.slider.addEventListener('scrollend', this.onSliderScrollFunc);
        }
        unsyncronizeScroll() {
            this.slider.removeEventListener('scrollend', this.onSliderScrollFunc);
        }
        activateSlideClick() {
            this.slides.forEach((slide) => {
                slide.addEventListener('click', (evt) => {
                    if (window.innerWidth < 850) return;
                    openLightbox(this.slides.indexOf(evt.target.closest('div')));
                })
            })
        }
    }
    const lightbox = document.querySelector('.light-box');
    const closeButton = lightbox.querySelector('.close-lighbox-button');

    let lightBoxSlider = new Slider('.hero__images-wrapper.light-box-slider', 0);
    lightBoxSlider.activateSliderControls();
    lightBoxSlider.initializeThumbnail();
    lightBoxSlider.activateThumbnails();
    lightBoxSlider.syncronizeScroll();

    let heroSlider = new Slider('.hero__images-wrapper', 0);
    if (window.innerWidth < 850) {
        heroSlider.activateSliderControls();
        return;
    }
    heroSlider.initializeThumbnail();
    heroSlider.activateThumbnails();
    heroSlider.syncronizeScroll();
    heroSlider.activateSlideClick();

    window.addEventListener('resize', () => {
        window.innerWidth < 850 ? heroSlider.activateSliderControls() : heroSlider.deactivateSliderControls();
        window.innerWidth < 850 ? heroSlider.deactivateThumbnails() : heroSlider.activateThumbnails();
        window.innerWidth < 850 ? heroSlider.unsyncronizeScroll() : heroSlider.syncronizeScroll();
    })

    function handleEsc(evt) {
        if (evt.key === 'Escape') closeLightbox();
    }
    function handleSideClick(evt) {
        if (evt.target.classList.contains('light-box')) closeLightbox();
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        closeButton.removeEventListener('click', closeLightbox);
        lightbox.removeEventListener('click', handleSideClick);
        document.removeEventListener('keydown', handleEsc);
    }

    function openLightbox(index) {
        lightbox.classList.add('open');
        closeButton.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', handleEsc);
        lightbox.addEventListener('click', handleSideClick);
        lightBoxSlider.replaceActiveThumbnail(lightBoxSlider.thumbnails[index]);
        setTimeout(() => {lightBoxSlider.slides[index].scrollIntoView();}, 200);
    }
}
)()

// ========================================================================= burger and cart

const burger = document.querySelector('.burger');
const cartControl = document.querySelector('.cart__control');
const cart = document.querySelector('#cart');

const closePopover = (evt) => {
    if (evt.target.classList.contains('backdrop')) {
        burger.setAttribute('aria-expanded', 'false');
        cartControl.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closePopover);
    }
}

const positionCart = (evt) => {
    let target = evt.currentTarget;
    let coordinates = target.getBoundingClientRect();

    let top = coordinates.bottom + cart.offsetHeight + 30;

    let left = coordinates.left + (target.offsetWidth - cart.offsetWidth) / 2;

    cart.style.top = `${top}px`;
    cart.style.left = `${left}px`;

    let right = coordinates.right + (cart.offsetWidth - target.offsetWidth) / 2;
    if (right > window.innerWidth) {
        right = 8;
    }

    if (right == 8) {
        cart.style.left = `auto`;
        cart.style.right = `${right}px`;
    }
}

const onControlerClick = (evt, isCart) => {
    evt.preventDefault();
    let target = evt.currentTarget;
    let expanded = target.getAttribute('aria-expanded') == 'true' ? true : false;
    target.setAttribute('aria-expanded', !expanded)

    if (!expanded) {
        document.addEventListener('click', closePopover);
        if (isCart) {
            positionCart(evt)
        }
    } else {
        document.removeEventListener('click', closePopover);
    }
}

const onCartClick = (evt) => {
    onControlerClick(evt, true);
}

function onWindowSize() {
    if (window.innerWidth < 800) {
        burger.addEventListener('click', onControlerClick);
    } else {
        burger.removeEventListener('click', onControlerClick);
    }
}

cartControl.addEventListener('click', onCartClick);

document.addEventListener('DOMContentLoaded', onWindowSize);
window.addEventListener('resize', onWindowSize);



// =========================================================================

const form = document.querySelector('.purchase-form');
const submitButton = form.querySelector('button[type="submit"]');
const amountInput = form.querySelector('input[name="amount"]');
const priceInput = form.querySelector('input[name="price"]');
const nameInput = form.querySelector('input[name="name"]');
const imgInput = form.querySelector('input[name="picture"]');
const amountControls = [...form.querySelectorAll('.button--amount')];
const cartItemTemplate = document.querySelector('.cart-content-template').content;
const cartList = document.querySelector('.cart__list');
const cartContent = document.querySelector('.cart__content');
const filler = document.querySelector('.js-filler');
const cartCounter = document.querySelector('.cart__counter');

let items = {};

amountInput.addEventListener('keydown', (evt) => {
    if (!evt.key.match(/\d|delete|backspace|arrow.+|tab|enter/i)) evt.preventDefault();
})

// here i do not have any backend, so to show the functionality, i have chosen to use session and local storage

let purchaseAmount = Number(sessionStorage.getItem('purchase amount')) || 0;

function isEmpty(obj) {
    for (let key in obj) {
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    amountInput.value = purchaseAmount;

    items = JSON.parse(sessionStorage.getItem('contents')) || {};
    let empty = isEmpty(items);
    if (!empty) {
        let total = 0;
        for (let key in items) {
            let cartItem = createCartItem(items[key]);
            total += items[key].amount;
            cartList.append(cartItem);
            showCartContents();
            cartCounter.textContent = total;
        }
    }
})

amountControls.forEach((item) => {
    item.addEventListener('click', (evt) => {
        let less = -1;
        if (purchaseAmount === 0) {
            less = 0;
        }
        purchaseAmount += evt.currentTarget.id === 'less' ? less : 1;
        purchaseAmount > 0 ? submitButton.removeAttribute('disabled') : submitButton.setAttribute('disabled', true)
        amountInput.value = purchaseAmount;
        sessionStorage.setItem('purchase amount', purchaseAmount)
    })
})



const createCartItem = (data) => {
    const cartItem = cartItemTemplate.cloneNode(true);

    cartItem.querySelector('.product-name').textContent = data.name;
    cartItem.querySelector('.product-price').textContent = `$${data.price} x ${data.amount}`;
    cartItem.querySelector('.product-sum').textContent = `$${parseInt(data.price) * parseInt(data.amount)}`;
    cartItem.querySelector('.cart__img').src = data.src;
    cartItem.querySelector('.cart__img').alt = data.name;

    const deleteButton = cartItem.querySelector('.button--delete');

    deleteButton.addEventListener('click', (evt) => {
        evt.target.closest('li').remove();
        delete items[data.name];
        sessionStorage.setItem('contents', JSON.stringify(items));
        if (isEmpty(items)) {
            hideCartContents();
            cartCounter.textContent = '';
        }
    })

    return cartItem;
}

function showCartContents() {
    cartContent.classList.remove('hidden');
    filler.classList.add('hidden');
}

function hideCartContents() {
    cartContent.classList.add('hidden');
    filler.classList.remove('hidden');
}

const onFormSubmit = (evt) => {
    evt.preventDefault();
    const src = imgInput.value;
    const name = nameInput.value;
    const price = parseInt(priceInput.value);
    const amount = parseInt(amountInput.value);

    let itemName = name;
    if (!isEmpty(items)) {
        if (itemName in items) {
            items[itemName].amount = amount;
        } else {
            items[itemName] = { src, name, price, amount };
        }
    } else {
        console.log(items);
        items[itemName] = { src, name, price, amount };
    }

    cartList.innerHTML = '';

    for (let key in items) {
        let cartItem = createCartItem(items[key]);
        cartList.append(cartItem);
    }

    cartCounter.textContent = amount;
    showCartContents();

    sessionStorage.setItem('contents', JSON.stringify(items));
}

form.addEventListener('submit', onFormSubmit);
