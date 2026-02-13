// @todo: напишите здесь код парсера
const metaTitle = document.documentElement.lang;

function getKeywords () {
    const myKeywords = [];
    document.querySelector('meta[name="keywords"]').content.split(',').forEach(item => {
        myKeywords.push(item.trim())
    })
    return myKeywords;
}

getKeywords()

function getMetaData () {
    return {
        language: document.documentElement.lang,
        title: document.head.querySelector('title').textContent.split(' — ')[0],
        description: document.querySelector('meta[name="description"]').content,
        keywords: getKeywords(),
        opengraph: {
            title: document.querySelector('meta[property="og:title"]').content.split(' — ')[0],
            image: document.querySelector('meta[property="og:image"]').content,
            type: document.querySelector('meta[property="og:type"]').content,
        }
    }
}

function determineCurrency (currencies) {
    if (currencies === '₽') {
        return 'RUB';
    } else if (currencies === '$') {
        return 'USD'
    } else if (currencies === '€') {
        return 'EUR';
    } else {
        return 'unknown currency';
    }
}

function getProperties() {
    const propertiesList = document.querySelectorAll('.properties li');
    const result = {};
    propertiesList.forEach(item => {
        const element = item.textContent.trim().split(' ');
        result[element[0].replace(/[₽\n\r]/g, '').trim()] = element[element.length - 1].replace(/[₽\n\r]/g, '').trim();
    })
    return result;
}

function getDescription () {
    const myDescription = document.querySelector('.description').cloneNode(true);
    myDescription.querySelectorAll('[class]').forEach(item => {
        item.classList.remove('unused');
        item.removeAttribute('class');
    })
    return myDescription.innerHTML.trim();
}

function getImages () {
    const articlesItems = document.querySelectorAll('.product nav button img');
    const result = [];
    articlesItems.forEach(item => {
        result.push({
            preview: item.src,
            full: item.dataset.src,
            alt: item.alt
        })
    })
    return result;
}

function getProducts () {
    const isLiked = document.querySelector('.like').className === 'like active';
    const prices = document.querySelector('.price').textContent.trim().split(' ');
    const price = prices[0].replace(/[₽\n\r]/g, '').trim();
    const oldPrice = prices[prices.length - 1].replace(/[₽\n\r]/g, '').trim();
    const discountPercent = (((oldPrice - price) / oldPrice) * 100).toFixed(2) + '%';
    return {
        id: document.querySelector('.product').dataset.id,
        name: document.querySelector('.title').textContent,
        isLiked,
        tags: {
            category: [
                document.querySelector('.green').textContent
            ],
            discount: [
                document.querySelector('.red').textContent
            ],
            label: [
                document.querySelector('.blue').textContent
            ]
        },
        price: Number(price),
        oldPrice: Number(oldPrice),
        discount: oldPrice - price,
        discountPercent,
        currency: determineCurrency(document.querySelector('.price').textContent.trim().charAt(0)),
        properties: getProperties(),
        description: getDescription(),
        images: getImages(),
    }
}

function getSuggested () {
    const suggest = document.querySelectorAll('.suggested article');
    const result = [];
    suggest.forEach(item => {
        result.push({
            name: item.querySelector('h3').textContent,
            description: item.querySelector('p').textContent,
            image: item.querySelector('img').src,
            price: item.querySelector('b').textContent.replace(/[₽\n\r]/g, ''),
            currency: determineCurrency(item.querySelector('b').textContent.trim().charAt(0))
        })
    })
    return result;
}

function getReviews() {
    const reviews = document.querySelectorAll('.reviews article');
    const result = [];

    reviews.forEach(item => {
        result.push({
            rating: item.querySelectorAll('.rating .filled').length,
            author: {
                avatar: item.querySelector('.author img').src,
                name: item.querySelector('.author span').textContent
            },
            title: item.querySelector('.title').textContent,
            description: item.querySelector('div p').textContent,
            date: item.querySelector('.author i').textContent.replaceAll('/', '.')
        })
    })

    return result;
}

function parsePage() {
    return {
        meta: getMetaData(),
        product: getProducts(),
        suggested: getSuggested(),
        reviews: getReviews(),
    };
}

window.parsePage = parsePage;