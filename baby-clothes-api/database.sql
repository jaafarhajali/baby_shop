-- Baby Clothes Shop Database Schema

-- Products table for baby clothes and accessories
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category ENUM('clothing', 'accessories', 'toys', 'feeding', 'safety') NOT NULL,
    subcategory VARCHAR(100),
    age_group ENUM('newborn', '0-3months', '3-6months', '6-12months', '12-18months', '18-24months', '2-3years') NOT NULL,
    size VARCHAR(20),
    gender ENUM('boy', 'girl', 'unisex') NOT NULL,
    color VARCHAR(50),
    material VARCHAR(100),
    brand VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    billing_address TEXT,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Cart table for persistent shopping cart
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Favorites/Wishlist table
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_favorite (user_id, product_id)
);

-- Sample data for baby clothes and accessories
INSERT INTO products (name, description, price, category, subcategory, age_group, size, gender, color, material, brand, stock_quantity, image_url) VALUES
-- Baby Clothing
('Organic Cotton Onesie', 'Soft organic cotton bodysuit perfect for sensitive baby skin', 15.99, 'clothing', 'bodysuit', 'newborn', 'Newborn', 'unisex', 'White', 'Organic Cotton', 'BabyPure', 50, '/assets/onesie-white.jpg'),
('Floral Romper', 'Adorable floral print romper for baby girls', 24.99, 'clothing', 'romper', '3-6months', '3-6M', 'girl', 'Pink', 'Cotton Blend', 'TinyBloom', 30, '/assets/romper-floral.jpg'),
('Dinosaur Sleeper', 'Cozy dinosaur themed sleeper with feet', 28.99, 'clothing', 'sleeper', '6-12months', '6-12M', 'boy', 'Green', 'Cotton', 'DinoBaby', 25, '/assets/sleeper-dino.jpg'),
('Rainbow Tutu Dress', 'Colorful tutu dress perfect for special occasions', 35.99, 'clothing', 'dress', '12-18months', '12-18M', 'girl', 'Multi', 'Tulle/Cotton', 'LittlePrincess', 20, '/assets/tutu-rainbow.jpg'),
('Striped Long Sleeve Shirt', 'Classic striped long sleeve tee', 18.99, 'clothing', 'shirt', '18-24months', '18-24M', 'unisex', 'Navy/White', 'Cotton', 'BabyBasics', 40, '/assets/shirt-striped.jpg'),

-- Baby Accessories
('Soft Knit Hat', 'Warm knitted hat to keep baby cozy', 12.99, 'accessories', 'hat', 'newborn', 'Newborn', 'unisex', 'Cream', 'Wool Blend', 'CozyTots', 60, '/assets/hat-knit.jpg'),
('Leather Baby Shoes', 'Soft sole leather shoes for first steps', 32.99, 'accessories', 'shoes', '6-12months', '6-12M', 'unisex', 'Brown', 'Genuine Leather', 'FirstSteps', 35, '/assets/shoes-leather.jpg'),
('Silicone Bib Set', 'Easy-clean silicone bibs - set of 3', 19.99, 'accessories', 'bib', '3-6months', 'One Size', 'unisex', 'Mixed', 'Food Grade Silicone', 'MealTime', 45, '/assets/bib-set.jpg'),
('Sun Protection Hat', 'Wide brim hat with UV protection', 16.99, 'accessories', 'hat', '12-18months', '12-18M', 'unisex', 'Blue', 'Cotton/UPF Fabric', 'SunSafe', 25, '/assets/hat-sun.jpg'),
('Bow Headband Set', 'Adorable bow headbands - pack of 5', 14.99, 'accessories', 'headband', '0-3months', 'One Size', 'girl', 'Pastel', 'Elastic/Fabric', 'BowBaby', 55, '/assets/headband-bow.jpg'),

-- Baby Safety & Feeding
('Baby Monitor', 'Digital video baby monitor with night vision', 89.99, 'safety', 'monitor', 'newborn', 'One Size', 'unisex', 'White', 'Plastic/Electronics', 'SafeWatch', 15, '/assets/monitor.jpg'),
('Bottle Warmer', 'Electric bottle warmer for formula and breast milk', 45.99, 'feeding', 'warmer', 'newborn', 'One Size', 'unisex', 'White', 'BPA-Free Plastic', 'FeedEasy', 20, '/assets/bottle-warmer.jpg'),
('High Chair', 'Adjustable high chair with safety harness', 129.99, 'feeding', 'chair', '6-12months', 'One Size', 'unisex', 'Wood', 'Solid Wood/Fabric', 'SafeSeat', 12, '/assets/highchair.jpg'),

-- Toys
('Soft Plush Bear', 'Cuddly teddy bear perfect for snuggles', 22.99, 'toys', 'plush', '0-3months', 'Medium', 'unisex', 'Brown', 'Hypoallergenic Fill', 'CuddlePals', 40, '/assets/bear-plush.jpg'),
('Teething Ring Set', 'Colorful teething rings for sore gums', 13.99, 'toys', 'teether', '3-6months', 'One Size', 'unisex', 'Multi', 'BPA-Free Silicone', 'TeethEase', 50, '/assets/teething-rings.jpg');