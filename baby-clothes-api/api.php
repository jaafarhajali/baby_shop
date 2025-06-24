<?php
require_once 'config.php';

// Enable CORS headers for Angular frontend
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));
$endpoint = $request[0] ?? '';

// Log the request for debugging
error_log("API Request: Method=$method, Endpoint=$endpoint");

try {
    switch ($endpoint) {
        case 'test':
            // Simple test endpoint for debugging connection issues
            echo json_encode([
                'status' => 'success',
                'message' => 'API is working correctly',
                'timestamp' => date('Y-m-d H:i:s'),
                'method' => $method,
                'endpoint' => $endpoint,
                'server_info' => [
                    'php_version' => PHP_VERSION,
                    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
                ]
            ]);
            break;
        case 'products':
            handleProducts($method, $request);
            break;
        case 'categories':
            handleCategories($method);
            break;
        case 'users':
            handleUsers($method, $request);
            break;
        case 'cart':
            handleCart($method, $request);
            break;
        case 'orders':
            handleOrders($method, $request);
            break;
        case 'favorites':
            handleFavorites($method, $request);
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found: ' . $endpoint]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

function handleProducts($method, $request) {
    global $pdo;
    
    switch ($method) {
        case 'GET':
            if (isset($request[1]) && is_numeric($request[1])) {
                // Get single product
                $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND is_active = TRUE");
                $stmt->execute([$request[1]]);
                $product = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($product) {
                    echo json_encode($product);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Product not found']);
                }
            } else {
                // Get all products with filters
                $where = "WHERE is_active = TRUE";
                $params = [];
                
                if (isset($_GET['category'])) {
                    $where .= " AND category = ?";
                    $params[] = $_GET['category'];
                }
                
                if (isset($_GET['age_group'])) {
                    $where .= " AND age_group = ?";
                    $params[] = $_GET['age_group'];
                }
                
                if (isset($_GET['gender'])) {
                    $where .= " AND gender = ?";
                    $params[] = $_GET['gender'];
                }
                
                if (isset($_GET['search'])) {
                    $where .= " AND (name LIKE ? OR description LIKE ?)";
                    $searchTerm = '%' . $_GET['search'] . '%';
                    $params[] = $searchTerm;
                    $params[] = $searchTerm;
                }
                
                $orderBy = "ORDER BY created_at DESC";
                if (isset($_GET['sort'])) {
                    switch ($_GET['sort']) {
                        case 'price_asc':
                            $orderBy = "ORDER BY price ASC";
                            break;
                        case 'price_desc':
                            $orderBy = "ORDER BY price DESC";
                            break;
                        case 'name':
                            $orderBy = "ORDER BY name ASC";
                            break;
                    }
                }
                  try {
                    $stmt = $pdo->prepare("SELECT * FROM products $where $orderBy");
                    $stmt->execute($params);
                    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
                    
                    echo json_encode($products);                } catch (Exception $e) {
                    // Fallback data if database fails - ALL products with correct image paths
                    error_log("Database error in products endpoint: " . $e->getMessage());
                    echo json_encode([
                        [
                            'id' => 1,
                            'name' => 'Organic Cotton Onesie',
                            'description' => 'Soft organic cotton bodysuit perfect for newborns',
                            'price' => 15.99,
                            'category' => 'clothing',
                            'age_group' => 'newborn',
                            'gender' => 'unisex',
                            'image_url' => 'assets/onesie-white.jpeg',
                            'stock_quantity' => 50,
                            'is_active' => true
                        ],
                        [
                            'id' => 2,
                            'name' => 'Soft Plush Bear',
                            'description' => 'Cuddly teddy bear toy for babies',
                            'price' => 22.99,
                            'category' => 'toys',
                            'age_group' => '0-3months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/bear-plush.jpeg',
                            'stock_quantity' => 30,
                            'is_active' => true
                        ],
                        [
                            'id' => 3,
                            'name' => 'Rainbow Tutu Dress',
                            'description' => 'Colorful tutu dress perfect for special occasions',
                            'price' => 35.99,
                            'category' => 'clothing',
                            'age_group' => '12-18months',
                            'gender' => 'girl',
                            'image_url' => 'assets/tutu-rainbow.jpeg',
                            'stock_quantity' => 25,
                            'is_active' => true
                        ],
                        [
                            'id' => 4,
                            'name' => 'Baby Bib Set',
                            'description' => 'Set of 3 waterproof bibs',
                            'price' => 12.99,
                            'category' => 'feeding',
                            'age_group' => '0-6months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/bib-set.jpeg',
                            'stock_quantity' => 40,
                            'is_active' => true
                        ],
                        [
                            'id' => 5,
                            'name' => 'Bottle Warmer',
                            'description' => 'Electric bottle warmer for quick heating',
                            'price' => 29.99,
                            'category' => 'feeding',
                            'age_group' => '0-12months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/bottle-warmer.jpeg',
                            'stock_quantity' => 15,
                            'is_active' => true
                        ],
                        [
                            'id' => 6,
                            'name' => 'Knit Winter Hat',
                            'description' => 'Warm knitted hat for cold weather',
                            'price' => 8.99,
                            'category' => 'accessories',
                            'age_group' => '6-12months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/hat-knit.jpeg',
                            'stock_quantity' => 35,
                            'is_active' => true
                        ],
                        [
                            'id' => 7,
                            'name' => 'Sun Protection Hat',
                            'description' => 'Lightweight hat with UV protection',
                            'price' => 11.99,
                            'category' => 'accessories',
                            'age_group' => '3-6months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/hat-sun.jpeg',
                            'stock_quantity' => 28,
                            'is_active' => true
                        ],
                        [
                            'id' => 8,
                            'name' => 'Bow Headband',
                            'description' => 'Cute headband with decorative bow',
                            'price' => 6.99,
                            'category' => 'accessories',
                            'age_group' => '0-6months',
                            'gender' => 'girl',
                            'image_url' => 'assets/headband-bow.jpeg',
                            'stock_quantity' => 45,
                            'is_active' => true
                        ],
                        [
                            'id' => 9,
                            'name' => 'Baby High Chair',
                            'description' => 'Adjustable high chair for feeding time',
                            'price' => 89.99,
                            'category' => 'feeding',
                            'age_group' => '6-24months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/highchair.jpeg',
                            'stock_quantity' => 8,
                            'is_active' => true
                        ],
                        [
                            'id' => 10,
                            'name' => 'Baby Monitor',
                            'description' => 'Digital baby monitor with night vision',
                            'price' => 79.99,
                            'category' => 'safety',
                            'age_group' => '0-24months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/monitor.jpeg',
                            'stock_quantity' => 12,
                            'is_active' => true
                        ],
                        [
                            'id' => 11,
                            'name' => 'Floral Romper',
                            'description' => 'Summer romper with floral print',
                            'price' => 18.99,
                            'category' => 'clothing',
                            'age_group' => '6-12months',
                            'gender' => 'girl',
                            'image_url' => 'assets/romper-floral.jpeg',
                            'stock_quantity' => 32,
                            'is_active' => true
                        ],
                        [
                            'id' => 12,
                            'name' => 'Striped T-Shirt',
                            'description' => 'Cotton t-shirt with colorful stripes',
                            'price' => 9.99,
                            'category' => 'clothing',
                            'age_group' => '12-18months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/shirt-striped.jpeg',
                            'stock_quantity' => 38,
                            'is_active' => true
                        ],
                        [
                            'id' => 13,
                            'name' => 'Leather Baby Shoes',
                            'description' => 'Soft leather first walking shoes',
                            'price' => 24.99,
                            'category' => 'accessories',
                            'age_group' => '9-15months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/shoes-leather.jpeg',
                            'stock_quantity' => 20,
                            'is_active' => true
                        ],
                        [
                            'id' => 14,
                            'name' => 'Dinosaur Sleeper',
                            'description' => 'Cozy sleeper with dinosaur pattern',
                            'price' => 16.99,
                            'category' => 'clothing',
                            'age_group' => '0-6months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/sleeper-dino.jpeg',
                            'stock_quantity' => 27,
                            'is_active' => true
                        ],
                        [
                            'id' => 15,
                            'name' => 'Teething Rings',
                            'description' => 'Safe silicone teething rings',
                            'price' => 7.99,
                            'category' => 'toys',
                            'age_group' => '3-12months',
                            'gender' => 'unisex',
                            'image_url' => 'assets/teething-rings.jpeg',
                            'stock_quantity' => 55,
                            'is_active' => true
                        ]
                    ]);
                }
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

function handleCategories($method) {
    global $pdo;
    
    if ($method !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }
    
    $categories = [
        'clothing' => ['bodysuit', 'romper', 'sleeper', 'dress', 'shirt', 'pants', 'jacket'],
        'accessories' => ['hat', 'shoes', 'bib', 'headband', 'socks', 'mittens'],
        'toys' => ['plush', 'teether', 'rattle', 'book', 'blocks'],
        'feeding' => ['bottle', 'warmer', 'chair', 'utensils'],
        'safety' => ['monitor', 'gate', 'lock', 'outlet_cover']
    ];
    
    $ageGroups = ['newborn', '0-3months', '3-6months', '6-12months', '12-18months', '18-24months', '2-3years'];
    $genders = ['boy', 'girl', 'unisex'];
    
    echo json_encode([
        'categories' => $categories,
        'age_groups' => $ageGroups,
        'genders' => $genders
    ]);
}

function handleUsers($method, $request) {
    global $pdo;
    
    switch ($method) {
        case 'POST':
            if (isset($request[1]) && $request[1] === 'register') {
                $input = file_get_contents('php://input');
                $data = json_decode($input, true);
                
                if (!$data) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Invalid JSON data']);
                    return;
                }
                
                // Validate required fields
                $required = ['first_name', 'last_name', 'email', 'password'];
                foreach ($required as $field) {
                    if (empty($data[$field])) {
                        http_response_code(400);
                        echo json_encode(['error' => "Missing required field: $field"]);
                        return;
                    }
                }
                
                // Check if email already exists
                try {
                    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
                    $stmt->execute([$data['email']]);
                    if ($stmt->fetch()) {
                        http_response_code(400);
                        echo json_encode(['error' => 'Email already registered']);
                        return;
                    }
                } catch (PDOException $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
                    return;
                }
                
                $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, password_hash, phone, address, city, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                
                try {
                    $result = $stmt->execute([
                        $data['first_name'],
                        $data['last_name'],
                        $data['email'],
                        password_hash($data['password'], PASSWORD_DEFAULT),
                        $data['phone'] ?? null,
                        $data['address'] ?? null,
                        $data['city'] ?? null,
                        $data['postal_code'] ?? null,
                        $data['country'] ?? null
                    ]);
                    
                    if ($result) {
                        http_response_code(201);
                        echo json_encode(['message' => 'User registered successfully', 'id' => $pdo->lastInsertId()]);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => 'Failed to register user']);
                    }
                } catch (PDOException $e) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Registration failed: ' . $e->getMessage()]);
                }
                
            } elseif (isset($request[1]) && $request[1] === 'login') {
                $input = file_get_contents('php://input');
                $data = json_decode($input, true);
                
                if (!$data || empty($data['email']) || empty($data['password'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Email and password required']);
                    return;
                }
                
                $stmt = $pdo->prepare("SELECT id, first_name, last_name, email, password_hash FROM users WHERE email = ?");
                $stmt->execute([$data['email']]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($user && password_verify($data['password'], $user['password_hash'])) {
                    unset($user['password_hash']);
                    echo json_encode(['message' => 'Login successful', 'user' => $user]);
                } else {
                    http_response_code(401);
                    echo json_encode(['error' => 'Invalid credentials']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid user endpoint']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

function handleCart($method, $request) {
    global $pdo;
    
    switch ($method) {
        case 'GET':
            if (isset($_GET['user_id'])) {
                $stmt = $pdo->prepare("
                    SELECT c.*, p.name, p.price, p.image_url 
                    FROM cart c 
                    JOIN products p ON c.product_id = p.id 
                    WHERE c.user_id = ?
                ");
                $stmt->execute([$_GET['user_id']]);
                $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($cartItems);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'User ID required']);
            }
            break;
              case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Validate input data
            if (!$data || !isset($data['user_id']) || !isset($data['product_id']) || !isset($data['quantity'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields: user_id, product_id, quantity']);
                break;
            }
            
            // Validate data types and values
            if (!is_numeric($data['user_id']) || !is_numeric($data['product_id']) || !is_numeric($data['quantity'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid data types']);
                break;
            }
            
            if ($data['quantity'] <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Quantity must be greater than 0']);
                break;
            }
            
            try {
                // Check if item already exists in cart
                $stmt = $pdo->prepare("SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
                $stmt->execute([$data['user_id'], $data['product_id']]);
                $existing = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($existing) {
                    // Update quantity
                    $stmt = $pdo->prepare("UPDATE cart SET quantity = quantity + ? WHERE id = ?");
                    $stmt->execute([$data['quantity'], $existing['id']]);
                } else {
                    // Add new item
                    $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
                    $stmt->execute([$data['user_id'], $data['product_id'], $data['quantity']]);
                }
                
                echo json_encode(['message' => 'Item added to cart', 'success' => true]);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
            }
            break;
            
        case 'PUT':
            if (isset($request[1])) {
                $data = json_decode(file_get_contents('php://input'), true);
                $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
                $stmt->execute([$data['quantity'], $request[1]]);
                echo json_encode(['message' => 'Cart updated']);
            }
            break;
            
        case 'DELETE':
            if (isset($request[1])) {
                $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ?");
                $stmt->execute([$request[1]]);
                echo json_encode(['message' => 'Item removed from cart']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

function handleOrders($method, $request) {
    global $pdo;
    
    switch ($method) {
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            try {
                $pdo->beginTransaction();
                
                // Create order
                $stmt = $pdo->prepare("INSERT INTO orders (user_id, total_amount, shipping_address, billing_address, payment_method) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([
                    $data['user_id'],
                    $data['total_amount'],
                    $data['shipping_address'],
                    $data['billing_address'],
                    $data['payment_method']
                ]);
                
                $orderId = $pdo->lastInsertId();
                
                // Add order items
                foreach ($data['items'] as $item) {
                    $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
                    $stmt->execute([$orderId, $item['product_id'], $item['quantity'], $item['price']]);
                }
                
                // Clear cart
                $stmt = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
                $stmt->execute([$data['user_id']]);
                
                $pdo->commit();
                echo json_encode(['message' => 'Order created successfully', 'order_id' => $orderId]);
                
            } catch (Exception $e) {
                $pdo->rollback();
                http_response_code(500);
                echo json_encode(['error' => 'Order creation failed: ' . $e->getMessage()]);
            }
            break;
            
        case 'GET':
            if (isset($_GET['user_id'])) {
                $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
                $stmt->execute([$_GET['user_id']]);
                $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($orders);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'User ID required']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

function handleFavorites($method, $request) {
    global $pdo;
    
    switch ($method) {
        case 'GET':
            if (isset($_GET['user_id'])) {
                $stmt = $pdo->prepare("
                    SELECT f.*, p.name, p.price, p.image_url 
                    FROM favorites f 
                    JOIN products p ON f.product_id = p.id 
                    WHERE f.user_id = ?
                ");
                $stmt->execute([$_GET['user_id']]);
                $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($favorites);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'User ID required']);
            }
            break;
            
        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            try {
                $stmt = $pdo->prepare("INSERT INTO favorites (user_id, product_id) VALUES (?, ?)");
                $stmt->execute([$data['user_id'], $data['product_id']]);
                echo json_encode(['message' => 'Added to favorites']);
            } catch (PDOException $e) {
                if ($e->getCode() == 23000) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Item already in favorites']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to add to favorites']);
                }
            }
            break;
            
        case 'DELETE':
            if (isset($request[1])) {
                $stmt = $pdo->prepare("DELETE FROM favorites WHERE id = ?");
                $stmt->execute([$request[1]]);
                echo json_encode(['message' => 'Removed from favorites']);
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}
?>