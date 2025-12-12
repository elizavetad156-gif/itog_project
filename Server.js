const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Инициализация базы данных
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
    } else {
        console.log('Подключено к SQLite базе данных');
        initDatabase();
    }
});

// Инициализация таблиц
function initDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT,
        image_url TEXT,
        stock INTEGER DEFAULT 10,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'processing',
        shipping_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    )`);

    // Добавление тестовых товаров
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err) {
            console.error('Ошибка проверки товаров:', err);
            return;
        }
        
        if (row.count === 0) {
            const products = [
                ['Кольцо "Нежность"', 'Изящное серебряное кольцо с фианитом', 2500, 'rings', 'ring.jpg'],
                ['Серьги "Весенний ветер"', 'Серьги-гвоздики с жемчугом', 3200, 'earrings', 'earrings.jpg'],
                ['Колье "Королевское"', 'Колье с кристаллами Сваровски', 5800, 'necklaces', 'necklace.jpg'],
                ['Браслет "Гармония"', 'Плетеный браслет из натуральной кожи', 4200, 'bracelets', 'bracelet.jpg'],
                ['Комплект "Свадебный"', 'Полный комплект для невесты', 12500, 'sets', 'set.jpg'],
                ['Кольцо "Луна"', 'Кольцо с лунным камнем', 3800, 'rings', 'ring2.jpg'],
                ['Серьги "Капли росы"', 'Длинные серьги с хрустальными подвесками', 4500, 'earrings', 'earrings2.jpg'],
                ['Браслет "Удача"', 'Браслет с подвесками-талисманами', 2900, 'bracelets', 'bracelet2.jpg']
            ];
            
            const stmt = db.prepare('INSERT INTO products (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)');
            products.forEach(product => {
                stmt.run(product);
            });
            stmt.finalize();
            console.log('Добавлены тестовые товары');
        }
    });
}

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Токен отсутствует' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Неверный токен' });
        }
        req.user = user;
        next();
    });
};

// Маршруты API

// Аутентификация
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
        }
        
        // Проверка существования пользователя
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                return res.status(500).json({ message: 'Ошибка базы данных' });
            }
            
            if (row) {
                return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
            }
            
            // Хеширование пароля
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Создание пользователя
            db.run('INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
                [name, email, hashedPassword, phone],
                function(err) {
                    if (err) {
                        return res.status(500).json({ message: 'Ошибка создания пользователя' });
                    }
                    
                    const userId = this.lastID;
                    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
                    
                    db.get('SELECT id, name, email, phone, address FROM users WHERE id = ?', [userId], (err, user) => {
                        if (err) {
                            return res.status(500).json({ message: 'Ошибка получения данных пользователя' });
                        }
                        
                        res.status(201).json({
                            message: 'Пользователь успешно зарегистрирован',
                            user,
                            token
                        });
                    });
                }
            );
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
    }
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка базы данных' });
        }
        
        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }
        
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            message: 'Вход выполнен успешно',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            },
            token
        });
    });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
    db.get('SELECT id, name, email, phone, address FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json({ user });
    });
});

// Пользователи
app.put('/api/users/profile', authenticateToken, (req, res) => {
    const { name, phone, address } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'Имя обязательно' });
    }
    
    db.run('UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?',
        [name, phone, address, req.user.id],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Ошибка обновления профиля' });
            }
            
            db.get('SELECT id, name, email, phone, address FROM users WHERE id = ?', [req.user.id], (err, user) => {
                if (err) {
                    return res.status(500).json({ message: 'Ошибка получения данных пользователя' });
                }
                
                res.json({
                    message: 'Профиль обновлен',
                    user
                });
            });
        }
    );
});

// Товары
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', (err, products) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка получения товаров' });
        }
        res.json(products);
    });
});

app.get('/api/products/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка получения товара' });
        }
        
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        
        res.json(product);
    });
});

// Заказы
app.post('/api/orders', authenticateToken, (req, res) => {
    const { items, total, shippingAddress } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Корзина пуста' });
    }
    
    db.run('INSERT INTO orders (user_id, total, shipping_address) VALUES (?, ?, ?)',
        [req.user.id, total, shippingAddress],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Ошибка создания заказа' });
            }
            
            const orderId = this.lastID;
            const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
            
            items.forEach(item => {
                stmt.run(orderId, item.id, item.quantity || 1, item.price);
            });
            
            stmt.finalize((err) => {
                if (err) {
                    return res.status(500).json({ message: 'Ошибка добавления товаров в заказ' });
                }
                
                res.status(201).json({
                    message: 'Заказ создан успешно',
                    order: {
                        id: orderId,
                        user_id: req.user.id,
                        total,
                        shipping_address: shippingAddress,
                        status: 'processing'
                    }
                });
            });
        }
    );
});

app.get('/api/orders', authenticateToken, (req, res) => {
    db.all(`
        SELECT o.*, 
               GROUP_CONCAT(oi.product_id || ':' || oi.quantity || ':' || oi.price) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
    `, [req.user.id], (err, orders) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка получения заказов' });
        }
        
        // Преобразование строки items в массив объектов
        const formattedOrders = orders.map(order => {
            const items = order.items ? order.items.split(',').map(item => {
                const [productId, quantity, price] = item.split(':');
                return {
                    product_id: parseInt(productId),
                    quantity: parseInt(quantity),
                    price: parseFloat(price)
                };
            }) : [];
            
            return {
                ...order,
                items
            };
        });
        
        res.json(formattedOrders);
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});