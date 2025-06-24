<?php
require_once 'config.php';

echo "=== Updating ALL Product Images ===\n";

try {
    // Read and execute SQL file
    $sqlFile = __DIR__ . '/update-all-product-images.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL file not found: $sqlFile");
    }
    
    $sql = file_get_contents($sqlFile);
    
    // Split SQL into individual statements
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    foreach ($statements as $statement) {
        if (empty($statement) || strpos($statement, '--') === 0) {
            continue; // Skip empty lines and comments
        }
        
        try {
            $stmt = $pdo->prepare($statement);
            $result = $stmt->execute();
            
            if (strpos(strtoupper($statement), 'SELECT') === 0) {
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo "\nQuery Result:\n";
                print_r($rows);
            } else if (strpos(strtoupper($statement), 'UPDATE') === 0) {
                $affected = $stmt->rowCount();
                echo "Updated $affected rows\n";
            }
        } catch (Exception $e) {
            echo "Error executing statement: " . $e->getMessage() . "\n";
            echo "Statement: " . substr($statement, 0, 100) . "...\n";
        }
    }
    
    echo "\n=== Image Update Complete ===\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
