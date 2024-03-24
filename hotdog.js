const
    burgerBtns = document.querySelectorAll('.main__card-btn'),
    menuBtn = document.querySelectorAll('.main__menu-btn2'),
    cartBtn = document.querySelector('.main__right-case'),
    cartIndecator = document.querySelector('.main__right-indecator'),
    checkModal = document.querySelector('.check'),
    closeCheckModal = document.querySelector('.check__top-btnClose'),
    basketCheckList = document.querySelector('.checklist'),
    basketTotalPrice = document.querySelector('.check__bottom-totalPrice'),
    basketPrint = document.querySelector('.order__link'),
    printCheckList = document.querySelector('.print__body'),
    printTotalSum = document.querySelector('.print__footer'),
    nav = document.querySelector('.burger__block'),
    burger = document.querySelector('.burger'),
    closeBurger = document.querySelector('.close-btn');


for (let i = 0; i < menuBtn.length; i++) {
    menuBtn[i].addEventListener('click', function () {
        for (let r = 0; r < menuBtn.length; r++) {
            menuBtn[r].classList.remove('active')
        }
        menuBtn[i].classList.add('active')
    })
}

const productArray = [];

const product = {
    home: {
        id: 1,
        name: 'Домашний хот-дог',
        target: 'home',
        price: 290,
        amount: 0,
        weight: 250,
        img: './img/hot-dog__1.png',
        get totalSum() {
            return this.price * this.amount
        }
    },
    burning: {
        id: 2,
        name: 'Жгучий хот-дог',
        target: 'burning',
        price: 239,
        amount: 0,
        weight: 245,
        img: './img/hot-dog__2.png',
        get totalSum() {
            return this.price * this.amount
        }
    },
    classic: {
        id: 3,
        name: 'Классический хот-дог',
        target: 'classic',
        price: 220,
        amount: 0,
        weight: 215,
        img: './img/hot-dog__3.png',
        get totalSum() {
            return this.price * this.amount
        }
    },
}

burgerBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
        addAmount(this)
    })
});

function addAmount(btn) {
    let parent = btn.closest('.main__cards-card');
    let parentId = parent.getAttribute('id');
    product[parentId].amount++;

    basket(parent, parentId);
}

function basket(parent, parentId) {
    const cardIndecator = parent.querySelector('.main-card-count');

    if (product[parentId].amount == 1) {
        productArray.push(product[parentId])
    }

    if (product[parentId].amount > 0) {
        cardIndecator.classList.add('active')
        cardIndecator.innerHTML = product[parentId].amount
    }
    else {
        cardIndecator.classList.remove('active')
        cardIndecator.innerHTML = ''
    }

    let allCount = basketInd()
    if (allCount > 0) {
        cartIndecator.classList.add('active')
        cartIndecator.innerHTML = allCount
    }
    else {
        cartIndecator.classList.remove('active')
    }

    basketCheckList.innerHTML = '';
    for (let a = 0; a < productArray.length; a++) {
        basketCheckList.innerHTML += buildBurger(productArray[a])
    }

    basketTotalPrice.innerHTML = totalSummProduct() + ' ₽';
}

function basketInd() {
    let total = 0;
    for (const key in product) {
        total += product[key].amount
    }
    return total
}

function buildBurger(burgerList) {
    const { name, target, img, amount, weight, totalSum: price } = burgerList
    return `
        <div class="checklist__product">

        <div class="checklist__product-info">

            <img src="${img}" alt="">

            <div class="checklist__product-sub">
                <p class="checklist__sub-name">${name}</p>
                <p class="checklist__sub-name2">${weight}</p>
                <p class="checklist__sub-name"> <span>${price.toLocaleString()}</span> ₽</p>
            </div>

        </div>

        <div class="checklist__prodoct-counter" id="${target}">
            <button class="checklist__counter-symbol" data-symbol="-">-</button>
            <output class="checklist__counter-output">${amount}</output>
            <button class="checklist__counter-symbol" data-symbol="+">+</button>
        </div>

    </div> 
        `
}

function totalSummProduct() {
    let total = 0;
    for (const key in product) {
        total += product[key].totalSum
    }
    return total.toLocaleString()
}

function plusOrMinus(event) {
    const btn = event.target;

    if (btn.classList.contains('checklist__counter-symbol')) {
        const attribute = btn.getAttribute('data-symbol');
        const parent = btn.closest('.checklist__prodoct-counter');
        const id = parent.getAttribute('id');
        const cardInd = document.querySelector(`#${id} .main-card-count`);

        if (parent) {
            if (attribute === '+') {
                product[id].amount++;
                cardInd.innerHTML = product[id].amount;
                cartIndecator.classList.add('active')
                cartIndecator.innerHTML = basketInd()
            } else if (attribute === '-') {
                product[id].amount--;
                cardInd.innerHTML = product[id].amount;
                cartIndecator.innerHTML = basketInd()
            }
            if (product[id].amount < 1) {
                const productIndex = productArray.findIndex(item => item.id == product[id].id)
                productArray.splice(productIndex, 1)
            }
        }

        if (basketInd() < 1) cartIndecator.classList.remove('active');
        if (cardInd.innerHTML < 1) cardInd.classList.remove('active');
        basketCheckList.innerHTML = '';
        for (let i = 0; i < productArray.length; i++) {
            basketCheckList.innerHTML += buildBurger(productArray[i])
        }
        basketTotalPrice.innerHTML = totalSummProduct() + ' ₽';
    }
}
window.addEventListener('click', plusOrMinus)

cartBtn.addEventListener('click', () => checkModal.classList.toggle('active'));
closeCheckModal.addEventListener('click', () => checkModal.classList.remove('active'));
burger.addEventListener("click", () => nav.classList.toggle('active'));
closeBurger.addEventListener("click", () => nav.classList.toggle('active'));

basketPrint.addEventListener('click', function () {
    printCheckList.innerHTML = '';
    for (const key in product) {
        const { name, totalSum, amount } = product[key]

        if (amount) {
            printCheckList.innerHTML +=
                `
                <div class="print__item">
                <p class="print__item-name">
                    <span class="name">${name}</span>
                    <span class="count">${amount}</span>
                <p class="print__item-sum">${totalSum.toLocaleString()} ₽</p>
                </p>
            </div> 
                `
        }
    }
    printTotalSum.innerHTML = totalSummProduct() + ' ₽'
    window.print()
});

if (ScrollTrigger.isTouch !== 1) {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    ScrollSmoother.create({
        wrapper: ".wrapper",
        content: ".content",
        smooth: 2.5,
        effects: true,
    })
    gsap.from('.top__logo', {
        opacity: 0, duration: 1, delay: 3.9,
    });
    gsap.from('.nav__burger', {
        opacity: 0, duration: 1.6, delay: 0.7, x: -150,
    });
    gsap.from('.nav__content-block', {
        opacity: 0, duration: 1.8, delay: 1.6, x: 200,
    });
    gsap.from('.main__menu2', {
        opacity: 0, duration: 1.2, delay: 3, y: -50,
    })

    gsap.from('.main__cards-card', {
        opacity: 0, x: -140, y: 100, duration: 2, delay: 3.5, repeat: 0, stagger: .6,
    });

    let btnAnimation = () => {
        const tlAddBtn = gsap.timeline({ defaults: { duration: .2, repeat: -1, repeatDelay: 2 } })
        tlAddBtn.to('.main__card-btn', { scale: 1.5 })
            .to('.main__card-btn', { scale: 1 })
        return tlAddBtn;
    }
    const tl = gsap.timeline({ defaults: { duration: .1, } });
    tl.add(btnAnimation);
}