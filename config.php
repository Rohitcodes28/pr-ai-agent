<?php
return [
    // Admin Credentials
    'username' => 'admin',
    'password' => 'admin123',

    // Email Settings
    'to_email' => 'contact@unicornxmedia.com',
    'from_email' => 'contact@unicornxmedia.com',
    'email_subject_prefix' => '[UnicornX Lead] ',

    // Submission Data Storage (JSON Database)
    'save_to_json' => true,
    'json_path' => __DIR__ . '/assets/data/submissions.json',
    
    // Security
    'allowed_origins' => ['*']
];
