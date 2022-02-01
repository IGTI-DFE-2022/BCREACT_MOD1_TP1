const baseUrl = "http://localhost:3000";
const productList = document.querySelector('.catalog');
const nomeEl = document.querySelector('#filter-name');
const marcaEl = document.querySelector('#filter-brand');
const tipoEl = document.querySelector('#filter-type');
let marcas = [];
let tipos = [];

async function init() {
  // let products = await loadProducts();
  await getMarcasETipos();
  populateMarcas();
  populateTipos();
  let delayedLoad = delay(loadAndShowProducts, 500);
  nomeEl.addEventListener('input', delayedLoad);
  marcaEl.addEventListener('input', delayedLoad);
  tipoEl.addEventListener('input', delayedLoad);
}

init();

async function loadAndShowProducts() {
  let products = await loadProducts();
  if (products.length > 10) {
    products = products.slice(0, 10);
  }
  console.log({products});
  showProducts(products);
  return products;
}

function loadProducts() {
  let [nome, marca, tipo] = getFilters();
  let url = baseUrl + "/products" + getQueryString(nome, marca, tipo);
  console.log({url});
  return fetch(url).then((data) => data.json());
}

async function getMarcasETipos() {
  //not a good practice
  let allProducts = await loadAndShowProducts();
  let m = new Set();
  let t = new Set();

  for (let p of allProducts) {
    m.add(p.brand);
    t.add(p.product_type);
  }

  marcas = Array.from(m);
  tipos = Array.from(t);

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
  <span class="product-brand background-price">R$ ${(+product.price).toFixed(2)}</span></div>
    </section>
  </div>`;
  return stringToElement('div', item)
}

//EXEMPLO DO CÓDIGO PARA OS DETALHES DE UM PRODUTO
function loadDetails(product) {
  let details = `<section class="product-details"><div class="details-row">
        <div>Brand</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">nyx</div>
        </div>
      </div><div class="details-row">
        <div>Price</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">10.49</div>
        </div>
      </div><div class="details-row">
        <div>Rating</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">5</div>
        </div>
      </div><div class="details-row">
        <div>Category</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250"></div>
        </div>
      </div><div class="details-row">
        <div>Product_type</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">bronzer</div>
        </div>
      </div></section>`;
}
