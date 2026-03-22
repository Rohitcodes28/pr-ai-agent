<?php
/**
 * Admin API - UnicornXMedia
 * 
 * Handles dashboard data fetching and authentication.
 */

// Load Configuration
$config = require __DIR__ . '/config.php';

// Set Response Type
header('Content-Type: application/json');

// Session Start for Auth
session_start();

// Check for Login Request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    if (isset($data['action']) && $data['action'] === 'login') {
        if ($data['username'] === $config['admin_username'] && $data['password'] === $config['admin_password']) {
            $_SESSION['admin_logged_in'] = true;
            echo json_encode(['success' => true]);
            exit;
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            exit;
        }
    }

    if (isset($data['action']) && $data['action'] === 'logout') {
        session_destroy();
        echo json_encode(['success' => true]);
        exit;
    }
}

// All other actions require Auth
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Action: Fetch Submissions
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'fetch_submissions') {
    $data_dir = dirname($config['json_path']);
    
    // Debug: Check if directory is writable
    if (!is_writable($data_dir)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => "Data directory not writable: $data_dir"]);
        exit;
    }

    if (file_exists($config['json_path'])) {
        $json = file_get_contents($config['json_path']);
        $submissions = json_decode($json, true) ?? [];
        // Reverse to show latest first
        $submissions = array_reverse($submissions);
        echo json_encode(['success' => true, 'data' => $submissions]);
    } else {
        echo json_encode(['success' => true, 'data' => [], 'message' => 'File does not exist yet']);
    }
    exit;
}

// Action: Check Login Status
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'check_status') {
    echo json_encode(['success' => true, 'loggedIn' => true]);
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Invalid request']);
