// State
let cartItems = [];

// Helper to get DOM elements safely
function getEl(id) { return document.getElementById(id); }

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    ensureModalExists();
    injectComponents();
    initBackToTop();
    scrollActiveCategoryIntoView();
});

// Dynamic Product Loading
function loadProducts(category, targetGridId = null) {
    const grid = targetGridId ? document.getElementById(targetGridId) : document.querySelector('.products-grid');
    if (!grid) return;

    let products;
    if (category === 'meats_veg') {
        products = window.productsData.filter(p => p.category === 'meats' || p.category === 'vegetables');
    } else {
        products = window.productsData.filter(p => p.category === category);
    }

    if (products.length === 0) {
        grid.innerHTML = '<div style="text-align:center; grid-column: 1/-1; padding: 50px;">قريباً...</div>';
        return;
    }

    grid.innerHTML = products.map(product => {
        const nameEscaped = (product.name || '').replace(/'/g, "\\'");
        const detailsEscaped = (product.details || '').replace(/'/g, "\\'");
        const price = product.price || 'اسأل عن السعر';
        const img = product.img || '';
        const imgFile = img.split('/').pop(); // اسم الصورة بس من غير الفولدر
        const origin = window.location.origin || (window.location.protocol + '//' + window.location.host);

        return `
            <div class="product-card reveal" onclick="window.openProductModal('${nameEscaped}', '${price}', '${imgFile}', '${detailsEscaped}', '${img}')">
                <div class="product-img-container">
                    <img src="${imgFile}" alt="${product.name}" loading="lazy" onerror="if(this.src != '${img}') this.src='${img}'">
                    <i class="fa-solid fa-basket-shopping text-blue" style="display:none; font-size:50px;"></i>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <a class="btn btn-whatsapp" 
                       href="https://wa.me/201000556041?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن سعر: ' + product.name + '\nرابط الصورة: ' + origin + '/' + imgFile)}"
                       target="_blank"
                       onclick="event.stopPropagation()">
                        <i class="fa-brands fa-whatsapp"></i> اسأل عن السعر
                    </a>
                </div>
            </div>
        `;
    }).join('');

    // Re-initialize Scroll Reveal
    const revealElements = grid.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
}

// Inject Components
function injectComponents() {
    const activeFile = window.location.pathname.split('/').pop() || 'index.html';
    const headerPlaceholder = document.getElementById('navbar-placeholder');
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) headerPlaceholder.innerHTML = window.supermarketComponents.getHeader(activeFile);
    if (sidebarPlaceholder) sidebarPlaceholder.innerHTML = window.supermarketComponents.getCartSidebar();
    if (footerPlaceholder) footerPlaceholder.innerHTML = window.supermarketComponents.getFooter();

    bindComponentEvents();

    // Load Cart
    const savedCart = localStorage.getItem('supermarketCart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        renderCart();
    }
}

function bindComponentEvents() {
    const cartToggleBtn = document.getElementById('cartToggleBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const searchInput = document.getElementById('searchInput');

    if (cartToggleBtn) cartToggleBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);
    if (searchInput) initSearch(searchInput);

    initCategoryArrows();
}

// Modal Structure & Logic
function ensureModalExists() {
    if (!document.getElementById('productModal')) {
        const modalHTML = `
            <div class="modal-overlay" id="productModal" style="display:none;">
                <div class="modal-content">
                    <span class="modal-close" id="closeModal" onclick="window.closeModal()">&times;</span>
                    <div class="modal-body" id="modalBody"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const style = document.createElement('style');
        style.textContent = '.modal-overlay.show-modal { display: flex !important; }';
        document.head.appendChild(style);

        document.getElementById('productModal').onclick = (e) => {
            if (e.target.id === 'productModal') window.closeModal();
        };
    }
}

window.openProductModal = function (name, price, imgSrc, details = "", originalImg = "") {
    ensureModalExists();
    const modalBody = document.getElementById('modalBody');
    const modalOverlay = document.getElementById('productModal');
    if (!modalBody || !modalOverlay) return;

    const isPriceString = typeof price === 'string' && price.includes('اسأل');
    const origin = window.location.origin || (window.location.protocol + '//' + window.location.host);

    const imgFile = imgSrc.split('/').pop();

    modalBody.innerHTML = `
        <div class="modal-img">
            <div class="modal-img-wrap">
                ${imgSrc.includes('<i') ? imgSrc : `<img src="${imgFile}" onerror="if(originalImg && this.src != originalImg) this.src=originalImg">` }
            </div>
        </div>
        <div class="modal-info">
            <h2 class="modal-title">${name}</h2>
            <p class="modal-desc">
                ${details || "اسأل عن توافر هذا المنتج وسعره الحالي عبر الواتساب."}
            </p>
            <div class="modal-price">
                ${price} ${isPriceString ? '' : 'جنيه'}
            </div>
            ${isPriceString ? `
                <a class="btn btn-whatsapp" href="https://wa.me/201000556041?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن سعر: ' + name + '\nرابط الصورة: ' + origin + '/' + imgFile)}" target="_blank" style="width: 100%; padding: 15px;">
                    <i class="fa-brands fa-whatsapp"></i> اسأل عن السعر عبر واتساب
                </a>
            ` : `
                <button class="btn btn-primary" style="width:100%; padding:15px;" onclick="addToCartModal('${name.replace(/'/g, "\\'")}', ${price})">أضف للسلة الآن</button>
            `}
        </div>
    `;
    modalOverlay.classList.add('show-modal');
};


window.closeModal = function () {
    const modal = document.getElementById('productModal');
    if (modal) modal.classList.remove('show-modal');
};

function addToCartModal(name, price) {
    addToCart(Date.now(), name, price);
    closeModal();
}

// Cart Logic
function addToCart(id, name, price, event) {
    if (event) {
        event.stopPropagation();
        animateToCart(event.target);
    }
    const idx = cartItems.findIndex(item => item.id === id);
    if (idx > -1) cartItems[idx].quantity += 1;
    else cartItems.push({ id, name, price, quantity: 1 });
    renderCart();
}

function renderCart() {
    localStorage.setItem('supermarketCart', JSON.stringify(cartItems));
    const container = getEl('cartItemsContainer');
    const totalEl = getEl('cartTotalPrice');
    const countEl = getEl('cartCount');
    if (!container || !totalEl || !countEl) return;

    countEl.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (cartItems.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding-top:50px;">السلة فارغة</div>';
        totalEl.textContent = '0';
        return;
    }

    let total = 0;
    container.innerHTML = cartItems.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price} جنيه (الكمية: ${item.quantity})</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    }).join('');
    totalEl.textContent = total;
}

function removeFromCart(id) {
    cartItems = cartItems.filter(item => item.id !== id);
    renderCart();
}

function toggleCart() {
    const sidebar = getEl('cartSidebar');
    const overlay = getEl('cartOverlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
}

// Category Arrows
function initCategoryArrows() {
    const list = document.querySelector('.categories-list');
    const left = document.querySelector('.nav-arrow-left');
    const right = document.querySelector('.nav-arrow-right');
    if (!list || !left || !right) return;
    left.onclick = () => list.scrollBy({ left: -250, behavior: 'smooth' });
    right.onclick = () => list.scrollBy({ left: 250, behavior: 'smooth' });
}

function scrollActiveCategoryIntoView() {
    const list = document.querySelector('.categories-list');
    const activeLink = document.querySelector('.categories-list a.active');
    if (list && activeLink) {
        const linkRect = activeLink.getBoundingClientRect();
        const listRect = list.getBoundingClientRect();
        const offset = (linkRect.left + linkRect.width / 2) - (listRect.left + listRect.width / 2);
        // Use instant scroll for faster perceived performance
        list.scrollBy({ left: offset, behavior: 'auto' });
    }
}

function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.style.display = 'flex';
            setTimeout(() => btn.classList.add('show'), 10);
        } else {
            btn.classList.remove('show');
            setTimeout(() => {
                if (!btn.classList.contains('show')) btn.style.display = 'none';
            }, 300);
        }
    });

    btn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

// Search Logic
function initSearch(input) {
    const results = document.createElement('div');
    results.className = 'search-results-dropdown';
    results.id = 'searchResults';
    input.closest('.search-container').appendChild(results);

    input.oninput = (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (term.length < 1) { results.style.display = 'none'; return; }
        const matches = window.productsData.filter(p => p.name.toLowerCase().includes(term)).slice(0, 8);
        renderSearchResults(matches);
    };

    document.onclick = (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) results.style.display = 'none';
    };
}

function renderSearchResults(matches) {
    const results = document.getElementById('searchResults');
    if (!results) return;
    if (matches.length === 0) {
        results.innerHTML = '<div class="no-results">لا توجد نتائج</div>';
    } else {
        results.innerHTML = matches.map((p, idx) => {
            const clean = (s) => (s || '').toString().replace(/'/g, "\\'").replace(/\n/g, " ").trim();
            return `
                <div class="search-result-item" id="search-item-${idx}" onclick="window.handleSearchClick('${clean(p.name)}', '${clean(p.price)}', '${clean(p.img)}', '${clean(p.details)}', this)">
                    <img src="${p.img.split('/').pop()}" class="search-result-img">
                    <div class="search-result-info"><h4>${p.name}</h4><p>${p.price}</p></div>
                </div>
            `;
        }).join('');
    }
    results.style.display = 'block';
}

window.handleSearchClick = function (name, price, img, details, element) {
    if (element) element.classList.add('selected-blue');
    setTimeout(() => {
        window.openProductModal(name, price, img, details);
        const results = document.getElementById('searchResults');
        if (results) results.style.display = 'none';
    }, 150);
    const input = document.getElementById('searchInput');
    if (input) input.value = name;
};
