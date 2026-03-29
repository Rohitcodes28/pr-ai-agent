<?php
/**
 * Unified Form Submission Handler - UnicornXMedia (Root Version)
 */

$config = require __DIR__ . '/config.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Get JSON Data
$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?? $_POST;

// Robust Email Check (Checks multiple possible keys)
$type = $data['applicationType'] ?? $data['formType'] ?? 'unspecified';
$email = $data['email'] ?? $data['newsletter_email'] ?? $data['newsletter-email'] ?? null;

if (empty($email) && $type !== 'workshop') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email is required', 'received' => $data]);
    exit;
}

// Prepare Submission Object
$submission = [
    'id' => uniqid('sub_'),
    'timestamp' => date('Y-m-d H:i:s'),
    'type' => $data['applicationType'] ?? $data['formType'] ?? 'unspecified',
    'email' => $email, // Standardized
    'data' => $data,
    'ip' => $_SERVER['REMOTE_ADDR']
];

// 1. Save to JSON File
if ($config['save_to_json']) {
    $dir = dirname($config['json_path']);
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    
    $current = [];
    if (file_exists($config['json_path'])) {
        $json = file_get_contents($config['json_path']);
        $current = json_decode($json, true) ?? [];
    }
    $current[] = $submission;
    file_put_contents($config['json_path'], json_encode($current, JSON_PRETTY_PRINT));
}

// 2. Email Notifications
$to = $config['to_email'];
$subject = $config['email_subject_prefix'] . strtoupper($submission['type']);
$message = "New submission received at " . $submission['timestamp'] . "\n\n";
foreach ($data as $key => $v) {
    if (is_array($v)) $v = implode(', ', $v);
    $message .= ucfirst($key) . ": " . $v . "\n";
}

$headers = 'From: ' . $config['from_email'] . "\r\n" .
           'Reply-To: ' . $email . "\r\n" .
           'X-Mailer: PHP/' . phpversion();

@mail($to, $subject, $message, $headers);

echo json_encode(['success' => true, 'message' => 'Thank you! Your submission has been received.']);
