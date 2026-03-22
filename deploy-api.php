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

// Trigger the cPanel git deployment
$output = shell_exec('/usr/local/cpanel/3rdparty/bin/git-deploy 2>&1');

// Log the output for debugging (optional)
file_put_contents('deploy_log.txt', date('Y-m-d H:i:s') . "\n" . $output . "\n\n", FILE_APPEND);

echo "Deployment triggered. Output: " . $output;
?>
