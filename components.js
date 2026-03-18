const supermarketComponents = {
    getHeader: (activePage = 'index.html') => `
        <div class="container nav-container">
            <!-- Logo -->
            <a href="index.html" class="logo">
                <img src="images/logo.png" alt="سوبر ماركت السعادة" class="logo-img">
                <span>السعادة ماركت</span>
            </a>

            <!-- Search Container -->
            <div class="search-container">
                <div class="search-bar">
                    <input type="text" placeholder="ابحث عن المنتجات هنا..." id="searchInput">
                    <button id="searchBtn"><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>
            </div>

            <!-- Cart Icon -->
            <div class="cart-icon-container" id="cartToggleBtn">
                <i class="fa-solid fa-cart-shopping"></i>
                <span class="cart-count" id="cartCount">0</span>
            </div>
        </div>

        <!-- Categories Navigation -->
        <nav class="categories-nav">
            <div class="container categories-container">
                <div class="nav-arrow nav-arrow-left"><i class="fa-solid fa-chevron-left"></i></div>
                <div class="categories-list">
                    <a href="index.html" class="${activePage === 'index.html' ? 'active' : ''}"><i class="fa-solid fa-house"></i> الرئيسية</a>
                    <a href="meats_veg.html" class="${activePage === 'meats_veg.html' ? 'active' : ''}"><i class="fa-solid fa-drumstick-bite"></i> اللحوم والخضروات</a>
                    <a href="drinks.html" class="${activePage === 'drinks.html' ? 'active' : ''}"><i class="fa-solid fa-glass-water"></i> المشروبات</a>
                    <a href="snacks.html" class="${activePage === 'snacks.html' ? 'active' : ''}"><i class="fa-solid fa-cookie-bite"></i> السناكس</a>
                    <a href="dairy.html" class="${activePage === 'dairy.html' ? 'active' : ''}"><i class="fa-solid fa-cow"></i> الجبن والالبان</a>
                    <a href="kahk.html" class="${activePage === 'kahk.html' ? 'active' : ''}"><i class="fa-solid fa-bread-slice"></i> الكحك والبسكوت</a>
                    <a href="canned.html" class="${activePage === 'canned.html' ? 'active' : ''}"><i class="fa-solid fa-jar"></i> المعلبات</a>
                    <a href="cleaners.html" class="${activePage === 'cleaners.html' ? 'active' : ''}"><i class="fa-solid fa-spray-can"></i> المنظفات</a>
                    <a href="contact.html" class="${activePage === 'contact.html' ? 'active' : ''}"><i class="fa-solid fa-headset"></i> التواصل</a>
                </div>
                <div class="nav-arrow nav-arrow-right"><i class="fa-solid fa-chevron-right"></i></div>
            </div>
        </nav>
    `,

    getCartSidebar: () => `
        <div class="cart-overlay" id="cartOverlay"></div>
        <div class="cart-sidebar" id="cartSidebar">
            <div class="cart-header">
                <h2>سلة المشتريات</h2>
                <button class="close-btn" id="closeCartBtn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="cart-items" id="cartItemsContainer">
                <div class="empty-cart-msg"> هذه الميزة متوقفة حاليا لحين ثبات الاسعار !</div>
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    الإجمالي: <span id="cartTotalPrice">0</span> جنيه
                </div>
                <button class="btn btn-primary checkout-btn" onclick="checkoutWhatsApp()">إرسال الطلب عبر واتساب <i class="fa-brands fa-whatsapp"></i></button>
            </div>
        </div>
    `,

    getFooter: () => `
        <div class="container footer-content">
            <div class="footer-col">
                <a href="index.html" class="logo footer-logo">
                    <img src="images/logo.png" alt="سوبر ماركت السعادة" class="logo-img">
                    <span>السعادة ماركت</span>
                </a>
                <p>نوفر لكم أفضل المنتجات الطازجه يوميًا بجودة عالية.
                تواصل معنا في أي وقت عبر واتساب لطلب منتجاتك بسهولة وسرعة.</p>
            </div>
            
            <div class="footer-col contact-info" id="contact">
                <h3>تواصل معنا</h3>
                <ul>
                    <li><a href="tel:01000556041"><i class="fa-solid fa-phone"></i> <span dir="ltr">01000556041</span> (يعمل 24 ساعة)</a></li>
                    <li><a href="https://wa.me/201000556041" target="_blank"><i class="fa-brands fa-whatsapp"></i> خدمة العملاء عبر واتساب (24 ساعة)</a></li>
                    <li><a href="https://maps.app.goo.gl/gzSHnhtvdsL46KBx9" target="_blank"><i class="fa-solid fa-location-dot"></i> محافظة البحيرة، مركز أبو حمص، قرية قافلة</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 جميع الحقوق محفوظة لـ سوبر ماركت السعادة.</p>
        </div>
        
        <!-- Back to Top Button -->
        <button id="backToTopBtn" class="back-to-top" title="الرجوج للأعلى">
            <i class="fa-solid fa-chevron-up"></i>
        </button>
    `
};

window.supermarketComponents = supermarketComponents;
