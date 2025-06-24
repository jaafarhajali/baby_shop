<?php
require_once 'config.php';

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
                    
                    echo json_encode($products);
                } catch (Exception $e) {
                    // Fallback data if database fails - helps with frontend development
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
                            'image_url' => '/assets/onesie.jpg',
                            'stock_quantity' => 50,
                            'is_active' => true
                        ],
                        [
                            'id' => 2,
                            'name' => 'Baby Bear Plushie',
                            'description' => 'Cuddly teddy bear toy for babies',
                            'price' => 22.99,
                            'category' => 'toys',
                            'age_group' => '0-3months',
                            'gender' => 'unisex',
                            'image_url' => '/assets/bear.jpg',
                            'stock_quantity' => 30,
                            'is_active' => true
                        ],
                        [
                            'id' => 3,
                            'name' => 'Pink Baby Dress',
                            'description' => 'Adorable pink dress for baby girls',
                            'price' => 28.50,
                            'category' => 'clothing',
                            'age_group' => '3-6months',
                            'gender' => 'girl',
                            'image_url' => '/assets/dress.jpg',
                            'stock_quantity' => 25,
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
            
            echo json_encode(['message' => 'Item added to cart']);
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