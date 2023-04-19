let allData = [];
let limit = 12;
let page = 1;
let totalPage = 0;
const fetchURL = `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-products`;

const cardBody = document.querySelector('.product');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const curr = document.querySelector('.curr');
const sorting = document.querySelector('#sort');
const filter = document.querySelector('#filter');

// Fetch data from API and display on page load
async function getProduct(fetchURL, limit, page, value) {
    try {
        let res = await fetch(
            value
                ? `${fetchURL}?limit=${limit}&page=${page}&filter=${value}`
                : `${fetchURL}?limit=${limit}&page=${page}`
        );
        let data = await res.json();
        totalPage = data.totalPages;
        allData = data.data;
        console.log(allData, totalPage);
        displayData(allData);
        curr.innerHTML = page;
        prev.disabled = page === 1;
        next.disabled = page === totalPage
    } catch (error) {
        console.log(error);
    }
}

// Display data on the page
function displayData(data) {
    cardBody.innerHTML = '';
    data.forEach((ele) => {
        let card = document.createElement('div');
        let image = document.createElement('img');
        image.src = ele.image;
        let title = document.createElement('p');
        title.innerHTML = ele.title;
        let category = document.createElement('p');
        category.innerHTML = ele.category;
        let brand = document.createElement('p');
        brand.innerHTML = ele.brand;
        let price = document.createElement('p');
        price.innerHTML = ele.price;
        card.append(image, title, category, brand, price);
        cardBody.append(card);
    });
}

// Sort data based on user selection
function sortingData(value, data) {
    let sortedData = [...data]; // Create a shallow copy of the original data
    if (value === 'acs') {
        sortedData.sort((a, b) => a.price - b.price);
    } else if (value === 'desc') {
        sortedData.sort((a, b) => b.price - a.price);
    }
    displayData(sortedData);
}

// Filter data based on user selection
function filteringData(value) {
    page = 1;
    getProduct(fetchURL, limit, 1, value);
}

// Handle pagination
function handlePagination(data) {
    page += data;
    console.log(page);
    getProduct(fetchURL, limit, page);
}

// Event listeners
sorting.addEventListener('change', (e) => sortingData(e.target.value, allData));
filter.addEventListener('change', (e) => filteringData(e.target.value));
prev.addEventListener('click', () => handlePagination(-1));
next.addEventListener('click', () => handlePagination(1));

// Initial fetch and display on page load
getProduct(fetchURL, limit, page);
curr.innerHTML = page;
prev.disabled = true;
