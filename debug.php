<?php
// Debug script for UnicornXMedia
header('Content-Type: text/plain');

echo "UnicornXMedia Debugger\n";
echo "----------------------\n";

$config_file = __DIR__ . '/assets/php/config.php';
if (file_exists($config_file)) {
    echo "[PASS] config.php found.\n";
    $config = require $config_file;
    
    $data_dir = dirname($config['json_path']);
    if (is_dir($data_dir)) {
        echo "[PASS] Data directory found: $data_dir\n";
        if (is_writable($data_dir)) {
            echo "[PASS] Data directory is WRITABLE.\n";
        } else {
            echo "[FAIL] Data directory is NOT WRITABLE. Please set permissions to 777.\n";
        }
    } else {
        echo "[FAIL] Data directory NOT FOUND: $data_dir\n";
    }
    
    if (file_exists($config['json_path'])) {
        echo "[INFO] submissions.json exists.\n";
        if (is_writable($config['json_path'])) {
            echo "[PASS] submissions.json is WRITABLE.\n";
        } else {
            echo "[FAIL] submissions.json is NOT WRITABLE.\n";
        }
    } else {
        echo "[INFO] submissions.json does not exist yet.\n";
    }
    
} else {
    echo "[FAIL] config.php NOT FOUND at $config_file\n";
}

echo "\nServer User: " . get_current_user() . "\n";
echo "PHP Version: " . phpversion() . "\n";
?>
