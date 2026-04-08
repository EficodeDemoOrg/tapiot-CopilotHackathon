let cart = [];
let debounceTimer = null;

// Fetch and render product list
async function loadProducts(query = '', minPrice = 0, maxPrice = 500) {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (minPrice > 0) params.set('minPrice', minPrice);
    if (maxPrice < 500) params.set('maxPrice', maxPrice);

    const url = query || minPrice > 0 || maxPrice < 500
        ? `/api/search?${params}`
        : `/api/parts?limit=50`;

    const res = await fetch(url);
    const json = await res.json();
    renderProducts(json.data);
}

function renderProducts(products) {
    const list = document.getElementById('product-list');
    const detail = document.getElementById('product-detail');
    detail.classList.add('hidden');
    list.style.display = '';

    if (products.length === 0) {
        list.innerHTML = '<p style="padding:2rem;color:#888;">No parts found.</p>';
        return;
    }

    list.innerHTML = products.map(p => `
        <div class="product-card" onclick="showDetail(${p.id})">
            <h3>${escapeHtml(p.name)}</h3>
            <p>${escapeHtml(p.description)}</p>
            <p class="manufacturer">${escapeHtml(p.manufacturer)} · ${escapeHtml(p.part_number)}</p>
            <p class="price">$${p.price.toFixed(2)}</p>
            <p class="stock">${p.stock > 0 ? `In stock (${p.stock})` : 'Out of stock'}</p>
            <button onclick="event.stopPropagation(); addToCart(${p.id}, '${escapeHtml(p.name)}', ${p.price})">Add to Cart</button>
        </div>
    `).join('');
}

// Product detail page
async function showDetail(id) {
    const res = await fetch(`/api/parts/${id}`);
    const p = await res.json();
    const detail = document.getElementById('product-detail');
    const list = document.getElementById('product-list');

    list.style.display = 'none';
    detail.classList.remove('hidden');

    const specs = p.specifications
        ? Object.entries(p.specifications).map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd>`).join('')
        : '';

    detail.innerHTML = `
        <button class="back-btn" onclick="goBack()">← Back to products</button>
        <h2>${escapeHtml(p.name)}</h2>
        <p>${escapeHtml(p.description)}</p>
        <p class="detail-price">$${p.price.toFixed(2)}</p>
        <p><strong>Manufacturer:</strong> ${escapeHtml(p.manufacturer)}</p>
        <p><strong>Part #:</strong> ${escapeHtml(p.part_number)}</p>
        <p><strong>Compatible with:</strong> ${p.model_compatibility.map(escapeHtml).join(', ')}</p>
        <p><strong>Stock:</strong> ${p.stock}</p>
        ${specs ? `<dl class="specs">${specs}</dl>` : ''}
        <button class="add-btn" onclick="addToCart(${p.id}, '${escapeHtml(p.name)}', ${p.price})">Add to Cart</button>
    `;
}

function goBack() {
    document.getElementById('product-detail').classList.add('hidden');
    document.getElementById('product-list').style.display = '';
}

// Cart logic
function addToCart(id, name, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(id);
        return;
    }
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    document.getElementById('cart-count').textContent = totalItems;
    document.getElementById('cart-total').textContent = `Total: $${totalPrice.toFixed(2)}`;

    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = '<p style="color:#888;padding:1rem 0;">Cart is empty</p>';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="name">${escapeHtml(item.name)}</div>
                <div class="item-price">$${item.price.toFixed(2)} × ${item.qty}</div>
            </div>
            <div class="qty">
                <button onclick="changeQty(${item.id}, -1)">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
        </div>
    `).join('');
}

function toggleCart() {
    document.getElementById('cart-panel').classList.toggle('hidden');
    document.getElementById('overlay').classList.toggle('hidden');
}

// Search
function debounceSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const q = document.getElementById('search-input').value.trim();
        const min = parseInt(document.getElementById('min-price').value);
        const max = parseInt(document.getElementById('max-price').value);
        loadProducts(q, min, max);
    }, 300);
}

function updatePriceLabel() {
    document.getElementById('min-label').textContent = document.getElementById('min-price').value;
    document.getElementById('max-label').textContent = document.getElementById('max-price').value;
}

// Utility
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Init
loadProducts();
updateCartUI();
