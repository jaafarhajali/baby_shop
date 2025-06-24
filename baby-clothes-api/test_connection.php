<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Test 1: PHP is working
echo "<h1>Connection Test</h1>";
echo "<h2>1. PHP Status</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Server Time: " . date('Y-m-d H:i:s') . "<br><br>";

// Test 2: Database connection
echo "<h2>2. Database Test</h2>";
$host = 'localhost';
$dbname = 'baby_clothes_shop';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Database connection: SUCCESS<br>";
    
    // Test if tables exist
    $tables = ['products', 'users', 'cart', 'orders'];
    foreach ($tables as $table) {
        $stmt = $pdo->query("SHOW TABLES LIKE '$table'");
        if ($stmt->rowCount() > 0) {
            echo "✅ Table '$table': EXISTS<br>";
            
            // Count records
            $stmt = $pdo->query("SELECT COUNT(*) FROM $table");
            $count = $stmt->fetchColumn();
            echo "&nbsp;&nbsp;&nbsp;Records: $count<br>";
        } else {
            echo "❌ Table '$table': MISSING<br>";
        }
    }
    
} catch(PDOException $e) {
    echo "❌ Database connection: FAILED<br>";
    echo "Error: " . $e->getMessage() . "<br>";
}

// Test 3: API endpoint
echo "<h2>3. API Test</h2>";
echo "API should be accessible at: <a href='api.php/products'>api.php/products</a><br>";
echo "Categories endpoint: <a href='api.php/categories'>api.php/categories</a><br>";

echo "<h2>4. Frontend Connection</h2>";
echo "Angular app should run on: <a href='http://localhost:4200'>http://localhost:4200</a><br>";
?>
