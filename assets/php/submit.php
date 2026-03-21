<?php
/**
 * Unified Form Submission Handler - UnicornXMedia
 * 
 * Processes Contact, PR Application, Event Application, and Podcast Booking.
 */

// Load Configuration
$config = require __DIR__ . '/config.php';

// Set Response Type
header('Content-Type: application/json');

// Security Check - Only Allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

// Get Form Data
$data = [];
if (strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
} else {
    $data = $_POST;
}

// Basic Validation
if (empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

// Prepare Submission Object
$submission = [
    'id' => uniqid('sub_'),
    'timestamp' => date('Y-m-d H:i:s'),
    'type' => $data['applicationType'] ?? ($data['formType'] ?? 'unspecified'),
    'data' => $data,
    'ip' => $_SERVER['REMOTE_ADDR']
];

// 1. Save to JSON File
if ($config['save_to_json']) {
    $current = [];
    if (file_exists($config['json_path'])) {
        $json = file_get_contents($config['json_path']);
        $current = json_decode($json, true) ?? [];
    }
    $current[] = $submission;
    file_put_contents($config['json_path'], json_encode($current, JSON_PRETTY_PRINT));
}

// 2. Send Email Notification
$to = $config['contact_email'];
$subject = $config['email_subject_prefix'] . strtoupper($submission['type']);
$message = "New submission received at " . $submission['timestamp'] . "\n\n";

foreach ($data as $key => $value) {
    if (is_array($value)) $value = implode(', ', $value);
    $message .= ucfirst($key) . ": " . $value . "\n";
}

$headers = 'From: noreply@unicornxmedia.com' . "\r\n" .
           'Reply-To: ' . $data['email'] . "\r\n" .
           'X-Mailer: PHP/' . phpversion();

$mailSent = @mail($to, $subject, $message, $headers);

// 3. Optional: Send Confirmation Email to the User
$userSubject = "Thank you for contacting UnicornXMedia";
$userMessage = "Hi " . ($data['name'] ?? 'there') . ",\n\n" .
              "Thank you for reaching out to UnicornXMedia. We have received your submission regarding '" . $submission['type'] . "' and our team will get back to you shortly.\n\n" .
              "Best Regards,\nThe UnicornXMedia Team";
$userHeaders = 'From: noreply@unicornxmedia.com' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

@mail($data['email'], $userSubject, $userMessage, $userHeaders);

// Respond to Client
echo json_encode([
    'success' => true, 
    'message' => 'Thank you! Your submission has been received.',
    'mail_status' => $mailSent ? 'sent' : 'failed'
]);
