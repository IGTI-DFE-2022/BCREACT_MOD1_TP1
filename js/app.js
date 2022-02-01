const baseUrl = "http://localhost:3000";
const productList = document.querySelector('.catalog');
const nomeEl = document.querySelector('#filter-name');
const marcaEl = document.querySelector('#filter-brand');
const tipoEl = document.querySelector('#filter-type');
const sortEl = document.querySelector('#sort-type');
let allProducts = [];
let marcas = [];
let tipos = [];

async function init() {
  await loadAndShowProducts();
  getMarcasETipos();
  populateMarcas();
  populateTipos();
  let delayedLoad = delay(loadAndShowProducts, 500);
  watchInputChanges(delayedLoad, nomeEl, marcaEl, tipoEl, sortEl);
}

init();

async function loadAndShowProducts() {
  let products = await loadProducts();
  allProducts = products;
  showProducts(allProducts)
  return products;
}

function loadProducts() {
  let [nome, marca, tipo] = getFilters();
  let q = getQueryString(nome, marca, tipo);
  if (!q) {
    q = '?';
  }
  let url = baseUrl + "/products" + q + '&' + getSortString();
  console.log({url});
  return fetch(url)
    .then((data) => data.json())
    .then(products => {
      if (sortEl.value) {
        return products.sort((a, b) => {
          let sortAttr = sortEl.value.split("_")[0]
          let sortOrder = sortEl.value.split("_")[1] === "+" ? 'desc' : 'asc';
          let aVal = a[sortAttr] ?? 0;
          let bVal = b[sortAttr] ?? 0;
          let val = 0;
          if (sortAttr === 'name') {
            val = ('' + aVal.attr).localeCompare(bVal.attr);
          } else {
            val = aVal - bVal;
          }
          return sortOrder === 'desc' ? val * -1 : val;
        })
      }
      return products;
    });
}

function getMarcasETipos() {
  //not a good practice

  let m = new Set();
  let t = new Set();

  for (let p of allProducts) {
    m.add(p.brand);
    t.add(p.product_type);
  }

  marcas = Array.from(m).sort();
  tipos = Array.from(t).sort();

}

function populateMarcas() {
  for (let marca of marcas) {
    let opt = document.createElement('option');
    opt.value = marca;
    opt.innerText = marca;
    marcaEl.appendChild(opt)
  }
}

function populateTipos() {
  for (let tipo of tipos) {
    let opt = document.createElement('option');
    opt.value = tipo;
    opt.innerText = tipo;
    tipoEl.appendChild(opt)
  }
}

function watchInputChanges(fn, ...elements) {
  for (let el of elements) {
    el.addEventListener('input', fn);
  }
}

function getQueryString(nome, marca, tipo) {
  let q = [];
  if (nome) {
    q.push(`q=${nome}`);
  }
  if (marca) {
    q.push(`brand=${marca}`);
  }
  if (tipo) {
    q.push(`product_type=${tipo}`);
  }
  return q.length > 0 ? '?' + q.join('&') : '';
}

function getSortString() {
  if (!sortEl.value) {
    return '';
  }
  let sortAttr = sortEl.value.split("_")[0]
  let sortOrder = sortEl.value.split("_")[1] === "+" ? 'desc' : 'asc';
  return `_sort=${sortAttr}&_order=${sortOrder}`
}

function getFilters() {
  let nome = nomeEl.value;
  let marca = marcaEl.value;
  let tipo = tipoEl.value;
  return [nome, marca, tipo]
}

function delay(fn, ms) {
  let timeoutId;
  return () => {
    if (timeoutId) {
      clearInterval(timeoutId);
    }
    timeoutId = setTimeout(fn, ms);
  }
}

function showProducts(products) {
  productList.innerHTML = '';
  for (let product of products) {
    productList.appendChild(productItem(product));
  }
}

function stringToElement(elementType, htmlString) {
  let el = document.createElement(elementType);
  el.innerHTML = htmlString;
  return el;
}

//EXEMPLO DO CÓDIGO PARA UM PRODUTO
function productItem(product) {
  const item = `<div class="product" 
    data-name="${product.name}" data-brand="${product.brand}" data-type="${product.product_type}" 
    tabindex="508">
    <figure class="product-figure">
      <img src="${product.image_link}" width="215" height="215" alt="${product.name}" onerror="javascript:this.src='img/unavailable.png'">
    </figure>
    <section class="product-description">
      <h1 class="product-name">${product.name}</h1>
      <div class="product-brands"><span class="product-brand background-brand">${product.brand}</span>
  <span class="product-brand background-price">R$ ${(+product.price * 5.5).toFixed(2)}</span></div>
    </section>
    ${loadDetails(product)}
  </div>`;
  return stringToElement('div', item)
}

//EXEMPLO DO CÓDIGO PARA OS DETALHES DE UM PRODUTO
function loadDetails(product) {
  let details = `<section class="product-details"><div class="details-row">
        <div>Brand</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.brand}</div>
        </div>
      </div><div class="details-row">
        <div>Price</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${(+product.price * 5.5).toFixed(2)}</div>
        </div>
      </div><div class="details-row">
        <div>Rating</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.rating}</div>
        </div>
      </div><div class="details-row">
        <div>Category</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.category}</div>
        </div>
      </div><div class="details-row">
        <div>Product_type</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.product_type}</div>
        </div>
      </div></section>`;
  return details
  // return stringToElement('section', details);
}
