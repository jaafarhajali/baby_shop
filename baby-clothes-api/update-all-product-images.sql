-- Comprehensive Image Path Update for ALL Products
-- This script ensures every product in the database has a proper image path

-- Update all image paths to use the correct format: assets/filename.jpeg
UPDATE products SET image_url = 'assets/bear-plush.jpeg' WHERE name LIKE '%bear%' OR name LIKE '%plush%' OR name LIKE '%toy%';
UPDATE products SET image_url = 'assets/bib-set.jpeg' WHERE name LIKE '%bib%' OR category = 'feeding';
UPDATE products SET image_url = 'assets/bottle-warmer.jpeg' WHERE name LIKE '%bottle%' OR name LIKE '%warmer%';
UPDATE products SET image_url = 'assets/hat-knit.jpeg' WHERE name LIKE '%hat%' AND name LIKE '%knit%';
UPDATE products SET image_url = 'assets/hat-sun.jpeg' WHERE name LIKE '%hat%' AND name LIKE '%sun%';
UPDATE products SET image_url = 'assets/headband-bow.jpeg' WHERE name LIKE '%headband%' OR name LIKE '%bow%';
UPDATE products SET image_url = 'assets/highchair.jpeg' WHERE name LIKE '%chair%' OR name LIKE '%high%';
UPDATE products SET image_url = 'assets/monitor.jpeg' WHERE name LIKE '%monitor%' OR category = 'safety';
UPDATE products SET image_url = 'assets/onesie-white.jpeg' WHERE name LIKE '%onesie%' OR name LIKE '%bodysuit%';
UPDATE products SET image_url = 'assets/romper-floral.jpeg' WHERE name LIKE '%romper%' OR name LIKE '%floral%';
UPDATE products SET image_url = 'assets/shirt-striped.jpeg' WHERE name LIKE '%shirt%' OR name LIKE '%stripe%';
UPDATE products SET image_url = 'assets/shoes-leather.jpeg' WHERE name LIKE '%shoe%' OR name LIKE '%leather%';
UPDATE products SET image_url = 'assets/sleeper-dino.jpeg' WHERE name LIKE '%sleeper%' OR name LIKE '%dino%' OR name LIKE '%pajama%';
UPDATE products SET image_url = 'assets/teething-rings.jpeg' WHERE name LIKE '%teeth%' OR name LIKE '%ring%';
UPDATE products SET image_url = 'assets/tutu-rainbow.jpeg' WHERE name LIKE '%tutu%' OR name LIKE '%rainbow%' OR name LIKE '%dress%';

-- For any products without specific matches, assign a default image
UPDATE products SET image_url = 'assets/onesie-white.jpeg' WHERE image_url IS NULL OR image_url = '' OR image_url NOT LIKE 'assets/%';

-- Verify all products have proper image paths
SELECT id, name, category, image_url FROM products ORDER BY category, name;

-- Count products by image to ensure distribution
SELECT image_url, COUNT(*) as product_count FROM products GROUP BY image_url ORDER BY product_count DESC;
