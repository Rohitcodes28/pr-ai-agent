<?php
/**
 * Admin API Handler - UnicornXMedia (Root Version)
 */
session_start();
$config = require __DIR__ . '/config.php';
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

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

// Handle Fetch Events (Public)
if ($action === 'fetch_events') {
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Cache-Control: post-check=0, pre-check=0', false);
    header('Pragma: no-cache');
    
    if (file_exists($config['events_json_path'])) {
        $json = file_get_contents($config['events_json_path']);
        $events = json_decode($json, true) ?? [];
        echo json_encode(['success' => true, 'events' => $events]);
    } else {
        echo json_encode(['success' => true, 'events' => []]);
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

if ($action === 'save_event') {
    $eventData = $jsonData['event'] ?? null;
    if (!$eventData) {
        echo json_encode(['success' => false, 'message' => 'Missing event data']);
        exit;
    }

    $events = [];
    if (file_exists($config['events_json_path'])) {
        $json = file_get_contents($config['events_json_path']);
        $events = json_decode($json, true) ?? [];
    }

    if (isset($eventData['id']) && $eventData['id']) {
        // Update existing
        foreach ($events as &$e) {
            if ($e['id'] === $eventData['id']) {
                $e = array_merge($e, $eventData);
                break;
            }
        }
    } else {
        // Create new
        $eventData['id'] = 'event_' . time();
        $events[] = $eventData;
    }

    file_put_contents($config['events_json_path'], json_encode($events, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'message' => 'Event saved successfully']);
    exit;
}

if ($action === 'delete_event') {
    $eventId = $jsonData['id'] ?? '';
    if (file_exists($config['events_json_path'])) {
        $json = file_get_contents($config['events_json_path']);
        $events = json_decode($json, true) ?? [];
        $events = array_filter($events, fn($e) => $e['id'] !== $eventId);
        file_put_contents($config['events_json_path'], json_encode(array_values($events), JSON_PRETTY_PRINT));
    }
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'set_live') {
    $eventId = $jsonData['id'] ?? '';
    if (file_exists($config['events_json_path'])) {
        $json = file_get_contents($config['events_json_path']);
        $events = json_decode($json, true) ?? [];
        foreach ($events as &$e) {
            $e['is_live'] = ($e['id'] === $eventId);
        }
        file_put_contents($config['events_json_path'], json_encode($events, JSON_PRETTY_PRINT));
    }
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'upload_media') {
    if (!isset($_FILES['file'])) {
        echo json_encode(['success' => false, 'message' => 'No file uploaded']);
        exit;
    }

    $file = $_FILES['file'];
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $type = strpos($file['type'], 'video') !== false ? 'videos' : 'images';
    $targetDir = __DIR__ . "/assets/$type/events/";
    
    if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
    
    $fileName = time() . '_' . basename($file['name']);
    $targetPath = $targetDir . $fileName;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        echo json_encode(['success' => true, 'path' => "assets/$type/events/$fileName", 'type' => ($type === 'videos' ? 'video' : 'image')]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file']);
    }
    exit;
}

if ($action === 'fetch_settings') {
    if (file_exists($config['settings_json_path'])) {
        $json = file_get_contents($config['settings_json_path']);
        echo json_encode(['success' => true, 'settings' => json_decode($json, true)]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Settings file not found']);
    }
    exit;
}

if ($action === 'save_settings') {
    $settingsData = $jsonData['settings'] ?? null;
    if ($settingsData) {
        file_put_contents($config['settings_json_path'], json_encode($settingsData, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing settings data']);
    }
    exit;
}

if ($action === 'list_media') {
    $media = [];
    
    // Recursive iterator for images
    $imgDir = __DIR__ . '/assets/images/events/';
    if (is_dir($imgDir)) {
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($imgDir));
        foreach ($iterator as $file) {
            if ($file->isFile() && preg_match('/\.(jpg|jpeg|png|gif)$/i', $file->getFilename())) {
                $relativePath = str_replace(__DIR__ . '/', '', $file->getPathname());
                $media[] = ['path' => $relativePath, 'type' => 'image'];
            }
        }
    }

    // Videos
    $vidDir = __DIR__ . '/assets/videos/';
    if (is_dir($vidDir)) {
        $vids = glob($vidDir . "*.mp4");
        foreach ($vids as $vid) {
            $media[] = ['path' => 'assets/videos/' . basename($vid), 'type' => 'video'];
        }
    }

    echo json_encode(['success' => true, 'media' => $media]);
    exit;
}

if ($action === 'sync_events') {
    // 1. Fetch current events to preserve existing metadata
    $currentEvents = [];
    if (file_exists($config['events_json_path'])) {
        $json = file_get_contents($config['events_json_path']);
        $currentEvents = json_decode($json, true) ?? [];
    }

    // 2. Map existing events for quick lookup
    $eventsMap = [];
    foreach ($currentEvents as $e) {
        $eventsMap['title_' . $e['title']] = $e;
    }

    $newEvents = [];
    $baseDir = __DIR__ . '/assets/images/events/';
    
    // Mappings for categories
    $categoryMap = [
        'Events I Covered' => 'Events Covered',
        'Events I Organized' => 'Events Organized',
        '👉 Public Campaigns & Crowd Engagement' => 'Public Campaigns',
        'Sponsor Experience' => 'Sponsor Experience'
    ];

    if (is_dir($baseDir)) {
        $categoryFolders = array_diff(scandir($baseDir), ['.', '..']);
        foreach ($categoryFolders as $catFolder) {
            $catPath = $baseDir . $catFolder;
            if (!is_dir($catPath)) continue;

            $category = $categoryMap[$catFolder] ?? 'Events Organized';
            
            $eventFolders = array_diff(scandir($catPath), ['.', '..']);
            foreach ($eventFolders as $eventFolder) {
                $eventPath = $catPath . '/' . $eventFolder;
                if (!is_dir($eventPath)) continue;

                $title = $eventFolder;
                $existing = $eventsMap['title_' . $title] ?? null;
                $id = $existing['id'] ?? 'event_' . substr(md5($title), 0, 8);
                
                // Get all images in this folder
                $images = [];
                $files = array_diff(scandir($eventPath), ['.', '..']);
                foreach ($files as $f) {
                    $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
                    if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                        $images[] = 'assets/images/events/' . $catFolder . '/' . $eventFolder . '/' . $f;
                    }
                }

                if (empty($images)) continue;

                $newEvents[] = [
                    'id' => $id,
                    'title' => $title,
                    'description' => $existing['description'] ?? 'Event description for ' . $title,
                    'date' => $existing['date'] ?? date('Y-m-d'),
                    'display_date' => $existing['display_date'] ?? $title,
                    'location' => $existing['location'] ?? 'Location',
                    'category' => $category,
                    'media_path' => $images[0],
                    'media_type' => 'image',
                    'images' => $images,
                    'is_live' => $existing['is_live'] ?? false,
                    'edition' => $existing['edition'] ?? '',
                    'guests' => $existing['guests'] ?? [],
                    'features' => $existing['features'] ?? []
                ];
            }
        }
    }

    // Preserve video events (like Pinkvilla)
    foreach ($currentEvents as $e) {
        if ($e['media_type'] === 'video') {
            $found = false;
            foreach ($newEvents as $ne) {
                if ($ne['title'] === $e['title']) { $found = true; break; }
            }
            if (!$found) $newEvents[] = $e;
        }
    }

    if (file_put_contents($config['events_json_path'], json_encode($newEvents, JSON_PRETTY_PRINT)) === false) {
        echo json_encode(['success' => false, 'message' => 'Failed to write to events.json. Check file permissions.']);
    } else {
        echo json_encode(['success' => true, 'events' => $newEvents, 'message' => 'Synced ' . count($newEvents) . ' events successfully.']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Invalid action']);
