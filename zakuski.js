const
    menuBtn = document.querySelectorAll('.main__menu-btn2'),
    productBtns = document.querySelectorAll('.main__card-btn'),
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

const productArray = []

const product = {
    nachos: {
        id: 1,
        name: 'Начос',
        target: "nachos",
        price: 250,
        amount: 0,
        weight: 220,
        img: './img/zak__1.png',
        get totalSum() {
            return this.price * this.amount
        }
    },
    fries: {
        id: 2,
        name: 'Картошка фри',
        target: "fries",
        price: 245,
        amount: 0,
        weight: 180,
        img: './img/zak__2.png',
        get totalSum() {
            return this.price * this.amount
        }
    },
    onion: {
        id: 3,
        name: 'Луковые кольца',
        target: "onion",
        price: 230,
        amount: 0,
        weight: 160,
        img: './img/zak__3.png',
        get totalSum() {
            return this.price * this.amount
        }
    },
}

productBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
        addAmount(this)
    })

})

function addAmount(btn) {
    let parent = btn.closest('.main__cards-card');
    let id = parent.getAttribute('id')
    product[id].amount++;

    basket(parent, id)
};

function basket(parent, id) {

    const productCardInd = parent.querySelector('.main-card-count');

    if (product[id].amount == 1) {
        productArray.push(product[id])
    }

    if (product[id].amount > 0) {
        productCardInd.classList.add('active')
        productCardInd.innerHTML = product[id].amount
    }
    else {
        productCardInd.classList.remove('active')
        productCardInd.innerHTML = ''
    }

    let allCount = totalAmount()
    if (allCount > 0) {
        cartIndecator.classList.add('active')
        cartIndecator.innerHTML = allCount
    }
    else {
        cartIndecator.classList.remove('active')
    }

    basketCheckList.innerHTML = '';
    for (let i = 0; i < productArray.length; i++) {
        basketCheckList.innerHTML += createBurger(productArray[i])
    }

    basketTotalPrice.innerHTML = totalSummProduct() + ' ₽';
}

function totalAmount() {
    let total = 0;
    for (const key in product) {
        total += product[key].amount
    }
    return total
}

function createBurger(dataBurger) {
    const { name, target, img, amount, weight, totalSum: price } = dataBurger

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

function handleButtonClick(event) {
    const btn = event.target;

    if (btn.classList.contains('checklist__counter-symbol')) {
        const attr = btn.getAttribute('data-symbol');
        const parent = btn.closest('.checklist__prodoct-counter');
        const idProduct = parent.getAttribute('id');
        const test = document.querySelector(`#${idProduct} .main-card-count`);

        if (parent) {
            if (attr === '+') {
                product[idProduct].amount++;
                test.innerHTML = product[idProduct].amount;
                cartIndecator.classList.add('active')
                cartIndecator.innerHTML = totalAmount()
            } else if (attr === '-') {
                product[idProduct].amount--;
                test.innerHTML = product[idProduct].amount;
                cartIndecator.innerHTML = totalAmount()
            }
            if (product[idProduct].amount < 1) {
                const productIndex = productArray.findIndex(item => item.id == product[idProduct].id)
                productArray.splice(productIndex, 1)
            }
        }

        if (totalAmount() < 1) cartIndecator.classList.remove('active');
        if (test.innerHTML < 1) test.classList.remove('active');
        basketCheckList.innerHTML = '';
        for (let i = 0; i < productArray.length; i++) {
            basketCheckList.innerHTML += createBurger(productArray[i])
        }
        basketTotalPrice.innerHTML = totalSummProduct() + ' ₽';
    }
}
window.addEventListener('click', handleButtonClick);


function totalSummProduct() {
    let total = 0;

    for (const key in product) {
        total += product[key].totalSum
    }
    return total.toLocaleString()
}

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