// Глобальные переменные
let currentUser = null;
let cart = [];
let favorites = [];
let products = [];
let currentFilter = 'all';
let map = null;
let markers = [];
let categoryChart = null;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('Приложение Elegance запущено');
    
    // Инициализация мобильного меню
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Инициализация данных
    initData();
    
    // Настройка обработчиков событий
    setupEventListeners();
    
    // Скрыть loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
        
        showNotification('Добро пожаловать в Elegance!', 'success');
    }, 1000);
});

// Инициализация данных
function initData() {
    console.log('Инициализация данных...');
    
    // Инициализация товаров
    if (products.length === 0) {
        initProducts();
    }
    
    // Загрузка данных из localStorage
    loadFromStorage();
    
    // Обновление интерфейса
    updateUI();
}
function initProducts() {
    console.log('Создание товаров...');
    
    // Исправлены протоколы в URL (было https:// → стало https://)
    const imageSources = [
        'https://i.pinimg.com/1200x/b4/12/28/b4122808c62d8d51fb76a6eec56475e3.jpg',
        'https://i.pinimg.com/1200x/94/0d/d1/940dd1f02d5e188a7822153e0994e4bb.jpg',
        'https://i.pinimg.com/736x/13/75/30/137530ad9354e5976e9e2803ba775b77.jpg',
        'https://i.pinimg.com/1200x/4f/31/ab/4f31ab9f1a3819073d39525b066c9ec4.jpg',
        'https://i.pinimg.com/1200x/23/4d/a2/234da21600132c797835bb2260e8ea69.jpg',
        'https://i.pinimg.com/736x/34/5c/69/345c69520243b2b333b649bd06e71a02.jpg',
        'https://i.pinimg.com/736x/46/a8/58/46a85895e31c117c71c54bcd92768b37.jpg',
        'https://i.pinimg.com/1200x/7f/95/78/7f957815f8e4c38d3531e16799a4d7a2.jpg'
    ];
    
    products = [
        { 
            id: 1, 
            name: 'Кольцо "Нежность"',
            price: 2500,
            category: 'rings',
            description: 'Изящное серебряное кольцо с фианитом',
            image: imageSources[0]
        },
        { 
            id: 2, 
            name: 'Серьги "Весенний ветер"', 
            price: 3200, 
            category: 'earrings',
            description: 'Серьги-гвоздики с натуральным жемчугом',
            image: imageSources[1]
        },
        { 
            id: 3, 
            name: 'Колье "Королевское"', 
            price: 5800, 
            category: 'necklaces',
            description: 'Роскошное колье с кристаллами Сваровски',
            image: imageSources[2]
        },
        { 
            id: 4, 
            name: 'Браслет "Гармония"', 
            price: 4200, 
            category: 'bracelets',
            description: 'Плетеный браслет из натуральной кожи',
            image: imageSources[3]
        },
        { 
            id: 5, 
            name: 'Комплект "Свадебный"', 
            price: 12500, 
            category: 'sets',
            description: 'Полный комплект для невесты',
            image: imageSources[4]
        },
        { 
            id: 6, 
            name: 'Кольцо "Луна"', 
            price: 3800, 
            category: 'rings',
            description: 'Кольцо с лунным камнем',
            image: imageSources[5]
        },
        { 
            id: 7, 
            name: 'Серьги "Капли росы"', 
            price: 4500, 
            category: 'earrings',
            description: 'Длинные серьги с хрустальными подвесками',
            image: imageSources[6]
        },
        { 
            id: 8, 
            name: 'Браслет "Удача"', 
            price: 2900, 
            category: 'bracelets',
            description: 'Браслет с подвесками-талисманами',
            image: imageSources[7]
        }
    ];
     // Сохраняем товары в localStorage
    localStorage.setItem('products', JSON.stringify(products));
    console.log('Создано товаров:', products.length);
}

    
    localStorage.setItem('products', JSON.stringify(products));
    console.log('Создано товаров:', products.length);

    
    // Сохраняем товары в localStorage
    localStorage.setItem('products', JSON.stringify(products));
    console.log('Создано товаров:', products.length);

function loadFromStorage() {
    try {
        // Загрузка пользователя
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
        }
        
        // Загрузка корзины
        const savedCart = localStorage.getItem('cart');
        cart = savedCart ? JSON.parse(savedCart) : [];
        
        // Загрузка избранного
        const savedFavorites = localStorage.getItem('favorites');
        favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
        
        // Загрузка заказов
        const savedOrders = localStorage.getItem('orders');
        orders = savedOrders ? JSON.parse(savedOrders) : [];
        
        console.log('Данные загружены из localStorage');
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}
function displayOrders() {
    const ordersContainer = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = '<p>У вас нет заказов</p>';
        return;
    }

    ordersContainer.innerHTML = orders.map(order => `
        <div class="order-item">
            <strong>Заказ №${order.id}</strong>
            <p>Дата: ${new Date(order.date).toLocaleDateString()}</p>
            <p>Статус: ${order.status}</p>
            <p>Сумма: ${order.total.toLocaleString()} ₽</p>
            <div>
                ${order.items.map(item => `
                    <div>${item.name} × ${item.quantity || 1} = ${(item.price * (item.quantity || 1)).toLocaleString()} ₽</div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Сохранение данных в localStorage
function saveToStorage() {
    try {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('favorites', JSON.stringify(favorites));
        localStorage.setItem('orders', JSON.stringify(orders)); // Новое поле
        console.log('Данные сохранены');
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
    }
}


// Настройка обработчиков событий
function setupEventListeners() {
    console.log('Настройка обработчиков событий...');
    
    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Форма регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
    
    // Форма профиля
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSaveProfile();
        });
    }
    
    // Клик вне модального окна
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            const modalId = e.target.id;
            hideModal(modalId);
        }
    });
    
    // Кнопки закрытия модальных окон
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });
    
    // Кнопки навигации
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('onclick')?.match(/showSection\('(.+)'\)/)?.[1];
            if (section) {
                showSection(section);
            }
        });
    });
    
    // Кнопки фильтрации товаров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            if (filter) {
                filterProducts(filter);
            }
        });
    });
    
    console.log('Обработчики событий настроены');
}

// Показать секцию
function showSection(sectionId) {
    console.log('Показать секцию:', sectionId);
    
    // Скрыть все секции
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Показать выбранную секцию
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Обновить активную ссылку в навигации
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Найти активную ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('onclick')?.includes(sectionId)) {
            link.classList.add('active');
        }
    });
    
    // Закрыть мобильное меню
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
    
    // Инициализировать секцию
    switch(sectionId) {
        case 'products':
            displayProducts();
            break;
        case 'cart':
            displayCart();
            break;
        case 'dashboard':
            displayDashboard();
            break;
        case 'stores':
            initMap();
            break;
    }
    
    // Прокрутить вверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать модальное окно
function showModal(modalId) {
    console.log('Показать модальное окно:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Скрыть модальное окно
function hideModal(modalId) {
    console.log('Скрыть модальное окно:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Сбросить форму
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
    }
}

// Показать уведомление
function showNotification(message, type = 'info', duration = 3000) {
    console.log('Уведомление:', message);
    
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// Обновление интерфейса
function updateUI() {
    console.log('Обновление интерфейса');
    
    // Обновить счетчик корзины
    updateCartCount();
    
    // Обновить информацию пользователя
    updateUserInfo();
}

// Обновить счетчик корзины
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}

// Обновить информацию пользователя
function updateUserInfo() {
    const guestButtons = document.getElementById('guestButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (currentUser) {
        // Показать меню пользователя
        if (guestButtons) guestButtons.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        
        // Обновить данные
        const displayName = currentUser.name || currentUser.email?.split('@')[0] || 'Пользователь';
        
        // Имя пользователя
        const userNameElements = document.querySelectorAll('#userName, #dashboardUserName');
        userNameElements.forEach(el => {
            if (el) el.textContent = displayName;
        });
        
        // Email пользователя
        const userEmailElements = document.querySelectorAll('#dashboardUserEmail, #profileEmail');
        userEmailElements.forEach(el => {
            if (el) el.value = currentUser.email || '';
        });
        
        // Аватар
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FFD6E7&color=8B5FBF`;
        document.querySelectorAll('.user-avatar, .dashboard-avatar').forEach(img => {
            if (img) img.src = avatarUrl;
        });
        
        // Данные профиля
        const profileName = document.getElementById('profileName');
        const profilePhone = document.getElementById('profilePhone');
        const profileAddress = document.getElementById('profileAddress');
        
        if (profileName) profileName.value = currentUser.name || '';
        if (profilePhone) profilePhone.value = currentUser.phone || '';
        if (profileAddress) profileAddress.value = currentUser.address || '';
        
    } else {
        // Показать кнопки входа
        if (guestButtons) guestButtons.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
        
        // Сбросить данные
        const dashboardUserName = document.getElementById('dashboardUserName');
        if (dashboardUserName) dashboardUserName.textContent = 'Гость';
        
        const dashboardUserEmail = document.getElementById('dashboardUserEmail');
        if (dashboardUserEmail) dashboardUserEmail.textContent = 'Войдите в систему';
    }
}

// Вход
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Пароль должен содержать минимум 6 символов', 'error');
        return;
    }
    
    // Для демо: создаем пользователя
    currentUser = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
        phone: '',
        address: '',
        createdAt: new Date().toISOString()
    };
    
    saveToStorage();
    updateUI();
    hideModal('loginModal');
    showNotification('Вход выполнен успешно!', 'success');
}

// Регистрация
function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const phone = document.getElementById('registerPhone').value.trim();
    
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Заполните все обязательные поля', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Пароль должен содержать минимум 6 символов', 'error');
        return;
    }
    
    // Создаем пользователя
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // В реальном приложении нужно хэшировать!
        phone: phone,
        address: '',
        createdAt: new Date().toISOString()
    };
    
    // Сохраняем в localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Автоматический вход
    currentUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        address: newUser.address
    };
    
    saveToStorage();
    updateUI();
    hideModal('registerModal');
    showNotification('Регистрация прошла успешно!', 'success');
}

// Сохранение профиля
function handleSaveProfile() {
    if (!currentUser) {
        showNotification('Войдите в систему', 'error');
        return;
    }
    
    const name = document.getElementById('profileName').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();
    const address = document.getElementById('profileAddress').value.trim();
    
    if (!name) {
        showNotification('Введите имя', 'error');
        return;
    }
    
    // Обновляем пользователя
    currentUser.name = name;
    currentUser.phone = phone;
    currentUser.address = address;
    
    // Обновляем в массиве пользователей
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].phone = phone;
        users[userIndex].address = address;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    saveToStorage();
    updateUI();
    showNotification('Профиль сохранен', 'success');
}

// Выход
function logout() {
    currentUser = null;
    saveToStorage();
    updateUI();
    showNotification('Вы вышли из системы', 'info');
    showSection('home');
}

// Фильтрация товаров
function filterProducts(category) {
    console.log('Фильтрация по категории:', category);
    
    currentFilter = category;
    
    // Обновить активные кнопки
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
    
    displayProducts();
}

// Отображение товаров
function displayProducts() {
    console.log('Отображение товаров...');
    
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.error('Контейнер товаров не найден');
        return;
    }
    
    // Фильтрация товаров
    let filteredProducts = products;
    if (currentFilter !== 'all') {
        filteredProducts = products.filter(product => product.category === currentFilter);
    }
    
    console.log('Товаров для отображения:', filteredProducts.length);
    
    // Очистка контейнера
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--pastel-lavender); margin-bottom: 1rem;"></i>
                <h3>Товары не найдены</h3>
                <p>В этой категории пока нет товаров</p>
                <button class="btn btn-outline mt-2" onclick="filterProducts('all')">
                    <i class="fas fa-arrow-left"></i> Вернуться ко всем товарам
                </button>
            </div>
        `;
        return;
    }
    
    // Создание карточек товаров
  filteredProducts.forEach(product => {
    const isFavorite = favorites.some(fav => fav.id === product.id);
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
        <div class="product-image">
            <!-- Добавляем изображение -->
            <img src="${product.image}" alt="${product.name}" 
                 style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p style="margin: 0.5rem 0; color: var(--text-dark); font-size: 0.9rem;">
                ${product.description}
            </p>
            <p class="product-price">${product.price.toLocaleString()} ₽</p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}" style="flex: 1;">
                    <i class="fas fa-shopping-cart"></i> В корзину
                </button>
                <button class="btn btn-outline favorite-btn" data-id="${product.id}"
                        style="width: 44px; padding: 0.5rem; ${isFavorite ? 'color: var(--secondary);' : ''}">
                    <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart'}"></i>
                </button>
            </div>
        </div>
    `;
    productsGrid.appendChild(productCard);
});
    
    // Добавляем обработчики для кнопок
    setTimeout(() => {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
        
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                toggleFavorite(productId);
            });
        });
    }, 100);
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Товар не найден', 'error');
        return;
    }
    
    // Проверить, есть ли уже в корзине
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) ;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    saveToStorage();
    updateUI();
    showNotification(`${product.name} добавлен в корзину`, 'success');
    
    // Обновить корзину, если она открыта
    if (document.getElementById('cart').classList.contains('active')) {
        displayCart();
    }
}

// Переключение избранного
// Обновим функцию toggleFavorite

  function toggleFavorite(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Товар не найден', 'error');
        return;
    }
    
    const existingIndex = favorites.findIndex(fav => fav.id === productId);
    const button = document.querySelector(`.favorite-btn[data-id="${productId}"]`);
    
    if (existingIndex !== -1) {
        // Удалить из избранного
        favorites.splice(existingIndex, 1);
        showNotification(`${product.name} удален из избранного`, 'info');
        
        if (button) {
            button.innerHTML = '<i class="far fa-heart"></i>'; // ПУСТОЕ сердце
            button.style.color = '';
        }
    } else {
        // Добавить в избранное
        favorites.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            description: product.description
        });
        showNotification(`${product.name} добавлен в избранное`, 'success');
        
      // В функции displayProducts() исправьте строку с кнопкой избранного:
button.innerHTML = `
    <button class="btn btn-outline favorite-btn" data-id="${product.id}"
            style="width: 44px; padding: 0.5rem; ${isFavorite ? 'color: var(--secondary);' : ''}">
        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
    </button>
`;
    }
    
    saveToStorage();
    updateUI();
    
    // Обновить отображение, если на странице избранного
    if (document.getElementById('favoritesTab')?.classList.contains('active')) {
        displayFavorites();
    }
    
    // Обновить отображение товаров
    if (document.getElementById('products').classList.contains('active')) {
        displayProducts();
    }
}
    saveToStorage();
    updateUI();
    
    // ОБНОВЛЯЕМ отображение, если на странице избранного
    // Это нужно оставить, чтобы при клике на сердечко обновлялся список
    if (document.getElementById('favoritesTab')?.classList.contains('active')) {
        displayFavorites();
    }

// Добавим функцию отображения избранного
// Отображение избранного
function displayFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) return;
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="text-center">
                <i class="fas fa-heart" style="font-size: 3rem; color: var(--pastel-pink); margin-bottom: 1rem;"></i>
                <h4>Список избранного пуст</h4>
                <p>Добавляйте товары в избранное, нажимая на сердечко</p>
                <button class="btn btn-primary mt-2" onclick="showSection('products')">
                    <i class="fas fa-shopping-bag"></i> Перейти к покупкам
                </button>
            </div>
        `;
        return;
    }
    
    favoritesGrid.innerHTML = favorites.map(fav => {
        const isInCart = cart.some(item => item.id === fav.id);
        return `
            <div class="product-card">
                <div class="product-image">
                    <!-- ИСПРАВЛЕНО: Добавляем реальную картинку -->
                    <img src="${fav.image}" alt="${fav.name}" 
                         style="width: 100%; height: 100%; object-fit: cover;">
                    <div class="favorite-badge active">
                        <i class="fas fa-heart"></i>
                    </div>
                </div>
                <div class="product-info">
                    <h4>${fav.name}</h4>
                    <p style="font-size: 0.9rem; color: var(--text-dark); margin: 0.5rem 0;">
                        ${fav.description || ''}
                    </p>
                    <p class="product-price">${fav.price.toLocaleString()} ₽</p>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        <button class="btn ${isInCart ? 'btn-outline' : 'btn-primary'}" 
                                onclick="${isInCart ? 'removeFromCart(' + fav.id + ')' : 'addToCart(' + fav.id + ')'}" 
                                style="flex: 1;">
                            <i class="fas ${isInCart ? 'fa-check' : 'fa-cart-plus'}"></i> 
                            ${isInCart ? 'В корзине' : 'В корзину'}
                        </button>
                        <button class="btn btn-outline" onclick="toggleFavorite(${fav.id})" 
                                style="color: var(--secondary);">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
// Очистка избранного
function clearFavorites() {
    if (favorites.length === 0) {
        showNotification('Избранное уже пусто', 'info');
        return;
    }
    
    if (confirm('Вы уверены, что хотите очистить все избранное?')) {
        favorites = [];
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
        showNotification('Избранное очищено', 'success');
    }
}
    
    // Обновить отображение товаров
    if (document.getElementById('products').classList.contains('active')) {
        displayProducts();
    }


// Отображение корзины
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const totalItems = document.getElementById('totalItems');
    const subtotal = document.getElementById('subtotal');
    const shipping = document.getElementById('shipping');
    const discount = document.getElementById('discount');
    const totalAmount = document.getElementById('totalAmount');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--pastel-lavender); margin-bottom: 1rem;"></i>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары из каталога</p>
                <button class="btn btn-primary mt-2" id="go-to-products-btn">
                    <i class="fas fa-shopping-bag"></i> Перейти к покупкам
                </button>
            </div>
        `;
        
        // Добавляем обработчик для кнопки
        setTimeout(() => {
            const goToProductsBtn = document.getElementById('go-to-products-btn');
            if (goToProductsBtn) {
                goToProductsBtn.addEventListener('click', () => showSection('products'));
            }
        }, 100);
        
        if (totalItems) totalItems.textContent = '0';
        if (subtotal) subtotal.textContent = '0 ₽';
        if (shipping) shipping.textContent = '0 ₽';
        if (discount) discount.textContent = '0 ₽';
        if (totalAmount) totalAmount.textContent = '0 ₽';
        return;
    }
    
    cartItems.innerHTML = '';
    let itemsTotal = 0;
    let itemsCount = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        itemsTotal += itemTotal;
        itemsCount += (item.quantity || 1);
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>${item.price.toLocaleString()} ₽ × ${item.quantity || 1}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button class="btn btn-outline decrease-btn" data-id="${item.id}" style="padding: 0.25rem 0.5rem;">-</button>
                    <span>${item.quantity || 1}</span>
                    <button class="btn btn-outline increase-btn" data-id="${item.id}" style="padding: 0.25rem 0.5rem;">+</button>
                </div>
                <p><strong>${itemTotal.toLocaleString()} ₽</strong></p>
                <button class="btn btn-outline remove-btn" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Добавляем обработчики для кнопок корзины
    setTimeout(() => {
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateCartQuantity(productId, -1);
            });
        });
        
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateCartQuantity(productId, 1);
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }, 100);
    
    // Расчет итогов
    const shippingCost = itemsTotal > 5000 ? 0 : 500;
    const discountAmount = 0;
    const total = itemsTotal + shippingCost - discountAmount;
    
    if (totalItems) totalItems.textContent = itemsCount;
    if (subtotal) subtotal.textContent = itemsTotal.toLocaleString() + ' ₽';
    if (shipping) shipping.textContent = shippingCost.toLocaleString() + ' ₽';
    if (discount) discount.textContent = discountAmount.toLocaleString() + ' ₽';
    if (totalAmount) totalAmount.textContent = total.toLocaleString() + ' ₽';
}

// Обновление количества товара в корзине
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity = (item.quantity || 1) + change;
    
    if (item.quantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    saveToStorage();
    updateUI();
    displayCart();
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveToStorage();
    updateUI();
    displayCart();
    showNotification('Товар удален из корзины', 'info');
}

// Применение промокода
function applyPromoCode() {
    const promoCode = document.getElementById('promoCode')?.value.trim();
    if (!promoCode) {
        showNotification('Введите промокод', 'warning');
        return;
    }
    
    if (promoCode === 'ELEGANCE10') {
        showNotification('Промокод применен! Скидка 10%', 'success');
    } else {
        showNotification('Неверный промокод', 'error');
    }
}

// Оформление заказа
function checkout() {
    if (!currentUser) {
        showNotification('Войдите в систему для оформления заказа', 'error');
        showModal('loginModal');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'warning');
        return;
    }
    
    // Создание заказа
    const order = {
        id: Date.now(),
        userId: currentUser.id,
        items: [...cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
        }))],
        total: cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
        date: new Date().toISOString(),
        status: 'Обрабатывается',
        shippingAddress: currentUser.address || 'Не указан'
    };
    
    // Сохраняем заказ
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Очистка корзины
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateUI();
    displayCart();
    
    showNotification(`Заказ оформлен! Номер: #${order.id}`, 'success');
    showSection('dashboard');
    
    // Обновляем вкладку заказов
    setTimeout(() => {
        showDashboardTab('orders');
        displayOrders();
    }, 100);
}

// Отображение дашборда
function displayDashboard() {
    if (!currentUser) {
        showNotification('Войдите в систему', 'warning');
        showModal('loginModal');
        return;
    }
    
    // Показать вкладку профиля
    showDashboardTab('profile');
}

// Показать вкладку дашборда
function showDashboardTab(tabId) {
    // Скрыть все вкладки
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убрать активный класс у всех ссылок
    document.querySelectorAll('.dashboard-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Показать выбранную вкладку
    const tab = document.getElementById(tabId + 'Tab');
    if (tab) {
        tab.classList.add('active');
    }
    
    // Активировать соответствующую ссылку
    const activeLink = Array.from(document.querySelectorAll('.dashboard-nav-link')).find(link => {
        return link.getAttribute('onclick')?.includes(tabId);
    });
    
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Инициализация карты
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Очищаем предыдущую карту
    if (map) {
        map.remove();
        map = null;
        markers = [];
    }
    
    try {
        // Ждем немного для полной загрузки контейнера
        setTimeout(() => {
            if (!mapContainer.offsetParent) {
                console.log('Контейнер карты скрыт');
                return;
            }
            
            map = L.map('map').setView([55.7558, 37.6173], 12);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);
            
            // Добавление маркеров магазинов с иконками
            const stores = [
                { 
                    name: 'Elegance Москва', 
                    lat: 55.7558, 
                    lng: 37.6173, 
                    address: 'ул. Примерная, 10',
                    hours: '10:00-22:00'
                },
                { 
                    name: 'Elegance Арбат', 
                    lat: 55.7520, 
                    lng: 37.5925, 
                    address: 'ул. Арбат, 25',
                    hours: '10:00-23:00'
                },
                { 
                    name: 'Elegance ТЦ Авиапарк', 
                    lat: 55.791, 
                    lng: 37.533, 
                    address: 'Ходынский б-р, 4',
                    hours: '10:00-22:00'
                }
            ];
             displayStoresList();
            stores.forEach(store => {
                const customIcon = L.divIcon({
                    html: `<div style="background: var(--primary); color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                            <i class="fas fa-store" style="font-size: 18px;"></i>
                          </div>`,
                    className: 'custom-marker',
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                });
                
                const marker = L.marker([store.lat, store.lng], { icon: customIcon })
                    .addTo(map)
                    .bindPopup(`
                        <div style="min-width: 200px;">
                            <h4 style="margin: 0 0 10px; color: var(--primary);">${store.name}</h4>
                            <p style="margin: 5px 0;"><i class="fas fa-map-marker-alt"></i> ${store.address}</p>
                            <p style="margin: 5px 0;"><i class="fas fa-clock"></i> ${store.hours}</p>
                            <p style="margin: 5px 0;"><i class="fas fa-phone"></i> +7 (495) 123-45-67</p>
                        </div>
                    `);
                
                markers.push(marker);
            });
            
            console.log('Карта инициализирована с', stores.length, 'магазинами');
            
            // Добавляем кнопку геолокации
            L.control.locate({
                position: 'topright',
                drawCircle: true,
                follow: true,
                setView: true,
                keepCurrentZoomLevel: true,
                markerStyle: {
                    weight: 1,
                    opacity: 0.8,
                    fillOpacity: 0.8
                },
                circleStyle: {
                    weight: 1,
                    opacity: 0.8,
                    fillOpacity: 0.3
                },
                icon: 'fas fa-location-crosshairs',
                metric: true,
                strings: {
                    title: "Мое местоположение"
                },
                locateOptions: {
                    maxZoom: 16,
                    watch: true,
                    enableHighAccuracy: true
                }
            }).addTo(map);
            
        }, 300);
    } catch (error) {
        console.error('Ошибка инициализации карты:', error);
        // Показать fallback
        mapContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center; background: var(--pastel-lavender-light); border-radius: 10px;">
                <i class="fas fa-map-marked-alt" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                <h3>Наши магазины</h3>
                <div style="margin-top: 1rem; text-align: left;">
                    <p><strong>Elegance Москва</strong><br>
                    ул. Примерная, 10<br>
                    Ежедневно 10:00-22:00</p>
                    <p><strong>Elegance Арбат</strong><br>
                    ул. Арбат, 25<br>
                    Ежедневно 10:00-23:00</p>
                </div>
            </div>
        `;
    }
}

// Определение местоположения
function locateUser() {
    if (!navigator.geolocation) {
        showNotification('Геолокация не поддерживается', 'error');
        return;
    }
    
    showNotification('Определение местоположения...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            if (map) {
                map.setView([latitude, longitude], 13);
                L.marker([latitude, longitude])
                    .addTo(map)
                    .bindPopup('Вы здесь')
                    .openPopup();
                showNotification('Местоположение определено', 'success');
            }
        },
        error => {
            showNotification('Не удалось определить местоположение', 'error');
        }
    );
}

// Переключение видимости пароля
function togglePasswordVisibility(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.classList.remove('fa-eye');
        iconElement.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        iconElement.classList.remove('fa-eye-slash');
        iconElement.classList.add('fa-eye');
    }
}

// Объявляем глобальные функции для HTML атрибутов
window.showSection = showSection;
window.showModal = showModal;
window.hideModal = hideModal;
window.filterProducts = filterProducts;
window.logout = logout;
window.applyPromoCode = applyPromoCode;
window.checkout = checkout;
window.locateUser = locateUser;
window.togglePasswordVisibility = togglePasswordVisibility;

// Функции для вкладок дашборда
window.showDashboardTab = showDashboardTab;

console.log('Приложение готово к работе');

let orders = []; // История заказов
function placeOrder() {
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }

    // Создаём объект заказа
    const order = {
        id: Date.now(), // Уникальный ID
        date: new Date().toISOString(),
        items: [...cart], // Копируем товары из корзины
        total: calculateTotal(), // Функция подсчёта суммы
        status: 'оформлен' // Статус заказа
    };

    // Добавляем в историю
    orders.push(order);

    // Сохраняем в localStorage
    saveToStorage(); // Уже есть в коде


    // Очищаем корзину
    cart = [];
    updateUI();
    displayCart();

    showNotification('Заказ оформлен!', 'success');
    showSection('orders'); // Переходим к истории заказов
}
function calculateTotal() {
    return cart.reduce((sum, item) => 
        sum + item.price * (item.quantity || 1), 0
    );
}
// Функция для отображения списка магазинов
function displayStoresList() {
    const storesList = document.getElementById('storesList');
    if (!storesList) return;
    
    const stores = [
        { 
            name: 'Elegance Москва', 
            address: 'ул. Примерная, 10',
            hours: '10:00-22:00',
            phone: '+7 (495) 123-45-67',
            lat: 55.7558,
            lng: 37.6173
        },
        { 
            name: 'Elegance Арбат', 
            address: 'ул. Арбат, 25',
            hours: '10:00-23:00',
            phone: '+7 (495) 123-67-89',
            lat: 55.7520,
            lng: 37.5925
        },
        { 
            name: 'Elegance ТЦ Авиапарк', 
            address: 'Ходынский б-р, 4',
            hours: '10:00-22:00',
            phone: '+7 (495) 123-90-12',
            lat: 55.791,
            lng: 37.533
        }
    ];
    
    storesList.innerHTML = stores.map(store => `
        <div class="store-card" data-lat="${store.lat}" data-lng="${store.lng}" 
             onclick="focusOnStore(${store.lat}, ${store.lng}, '${store.name}')">
            <h4>${store.name}</h4>
            <p><i class="fas fa-map-marker-alt"></i> ${store.address}</p>
            <p><i class="fas fa-clock"></i> ${store.hours}</p>
            <p><i class="fas fa-phone"></i> ${store.phone}</p>
        </div>
    `).join('');
}

// Функция для фокусировки на магазине на карте
function focusOnStore(lat, lng, name) {
    if (map) {
        map.setView([lat, lng], 15);
        markers.forEach(marker => {
            if (marker.getLatLng().lat === lat && marker.getLatLng().lng === lng) {
                marker.openPopup();
            }
        });
    }
}
// Обновление статистики
function updateStatistics() {
    if (!currentUser) return;
    
    // Получаем заказы пользователя
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    // Общее количество заказов
    document.getElementById('totalOrdersStat').textContent = userOrders.length;
    
    // Общая сумма
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalSpentStat').textContent = totalSpent.toLocaleString() + ' ₽';
    
    // Средний чек
    const avgOrder = userOrders.length > 0 ? totalSpent / userOrders.length : 0;
    document.getElementById('avgOrderStat').textContent = avgOrder.toLocaleString('ru-RU', {
        maximumFractionDigits: 0
    }) + ' ₽';
    
    // Анализ по категориям
    const categoryData = analyzeCategories(userOrders);
    updateCategoryChart(categoryData);
}

// Анализ категорий покупок
function analyzeCategories(orders) {
    const categories = {};
    
    orders.forEach(order => {
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const categoryName = getCategoryName(product.category);
                categories[categoryName] = (categories[categoryName] || 0) + 1;
            }
        });
    });
    
    return categories;
}

// Получение имени категории
function getCategoryName(category) {
    const names = {
        'rings': 'Кольца',
        'earrings': 'Серьги',
        'necklaces': 'Колье',
        'bracelets': 'Браслеты',
        'sets': 'Комплекты'
    };
    return names[category] || 'Другое';
}

// Обновление графика
function updateCategoryChart(categoryData) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Уничтожаем предыдущий график
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FFD6E7', // пастельно-розовый
                    '#C5E1A5', // пастельно-зеленый
                    '#B3E5FC', // пастельно-голубой
                    '#FFE082', // пастельно-желтый
                    '#E1BEE7'  // пастельно-фиолетовый
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Распределение покупок по категориям'
                }
            }
        }
    });
}
// Отображение заказов
function displayOrders() {
    const ordersTableBody = document.getElementById('ordersTableBody');
    if (!ordersTableBody) return;
    
    if (!currentUser) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <p>Войдите в систему, чтобы увидеть свои заказы</p>
                    <button class="btn btn-primary mt-1" onclick="showModal('loginModal')">
                        Войти
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    if (userOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">
                    <i class="fas fa-shopping-bag" style="font-size: 2rem; color: var(--pastel-lavender);"></i>
                    <p class="mt-1">У вас пока нет заказов</p>
                    <button class="btn btn-primary mt-1" onclick="showSection('products')">
                        Перейти к покупкам
                    </button>
                </td>
            </tr>
        `;
        return;
    }
    
    ordersTableBody.innerHTML = userOrders.reverse().map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${new Date(order.date).toLocaleDateString('ru-RU')}</td>
            <td>
                <div style="max-height: 100px; overflow-y: auto;">
                    ${order.items.map(item => `
                        <div>${item.name} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ₽</div>
                    `).join('')}
                </div>
            </td>
            <td><strong>${order.total.toLocaleString()} ₽</strong></td>
            <td>
                <span class="order-status ${order.status.toLowerCase()}">
                    ${order.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// Обновление статусов заказов
function refreshOrders() {
    displayOrders();
    showNotification('Список заказов обновлен', 'success');
}
function showDashboardTab(tabId) {
    // Скрыть все вкладки
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убрать активный класс у всех ссылок
    document.querySelectorAll('.dashboard-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Показать выбранную вкладку
    const tab = document.getElementById(tabId + 'Tab');
    if (tab) {
        tab.classList.add('active');
        
        // Загружаем данные для вкладки
        switch(tabId) {
            case 'orders':
                displayOrders();
                break;
            case 'favorites':
                displayFavorites();
                break;
            case 'statistics':
                updateStatistics();
                break;
        }
    }
    
    // Активировать соответствующую ссылку
    const activeLink = Array.from(document.querySelectorAll('.dashboard-nav-link')).find(link => {
        return link.getAttribute('onclick')?.includes(tabId);
    });
    
    if (activeLink) {
        activeLink.classList.add('active');
    }
}