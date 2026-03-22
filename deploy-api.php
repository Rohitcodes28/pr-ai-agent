<?php
/**
 * cPanel Git Deployment Trigger
 * This script is called by GitHub Webhooks to trigger a 'git deploy' on cPanel.
 * 
 * Instructions:
 * 1. Place this file in your public_html folder.
 * 2. In GitHub Repository Settings > Webhooks, add this URL:
 *    https://yourdomain.com/deploy-api.php
 */

// Optional: Add a simple security token check
// if ($_GET['token'] !== 'your_secret_token') {
//     die('Unauthorized');
// }

// 1. Trigger the cPanel git-deploy
$output = [];
$return_var = 0;
exec('/usr/local/cpanel/3rdparty/bin/git-deploy 2>&1', $output, $return_var);

// 2. Log the deployment for debugging
$log = "[" . date('Y-m-d H:i:s') . "] Deployment triggered. Status: $return_var\nOutput: " . implode("\n", $output) . "\n---\n";
file_put_contents(__DIR__ . '/deploy_log.txt', $log, FILE_APPEND);

if ($return_var === 0) {
    echo json_encode(['success' => true, 'message' => 'Deployment successful!', 'output' => $output]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Deployment failed.', 'output' => $output]);
}
?>
