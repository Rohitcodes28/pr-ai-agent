<?php
/**
 * Admin API Handler - UnicornXMedia (Root Version)
 */
session_start();
$config = require __DIR__ . '/config.php';
header('Content-Type: application/json');

$rawInput = file_get_contents('php://input');
$jsonData = json_decode($rawInput, true) ?? [];
$action = $_GET['action'] ?? $jsonData['action'] ?? '';

// Handle Status Check (Must be allowed even if not logged in to check session)
if ($action === 'check_status') {
    echo json_encode(['logged_in' => isset($_SESSION['admin_logged_in'])]);
    exit;
}

// Handle Login
if ($action === 'login') {
    $data = !empty($jsonData) ? $jsonData : $_POST;
    
    if (($data['username'] ?? '') === ($config['username'] ?? 'admin') && 
        ($data['password'] ?? '') === ($config['password'] ?? 'admin123')) {
        $_SESSION['admin_logged_in'] = true;
        echo json_encode(['success' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
    exit;
}

// --- Protected Actions ---
if (!isset($_SESSION['admin_logged_in'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'fetch_submissions') {
    if (file_exists($config['json_path'])) {
        $json = file_get_contents($config['json_path']);
        $submissions = json_decode($json, true) ?? [];
        echo json_encode(['success' => true, 'submissions' => array_reverse($submissions)]);
    } else {
        echo json_encode(['success' => true, 'submissions' => [], 'message' => 'No submissions yet']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Invalid action']);
