<?php
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(['error' => 'Method not allowed'], 405);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    sendResponse(['error' => 'No valid file uploaded'], 400);
}

$file = $_FILES['file'];
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExtensions)) {
    sendResponse(['error' => 'Unsupported image format. Allowed: ' . implode(', ', $allowedExtensions)], 400);
}

// Generate unique filename
$safeName = 'media_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$targetPath = UPLOADS_DIR . '/' . $safeName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    sendResponse([
        'status' => 'success',
        'url' => '/uploads/' . $safeName,
        'filename' => $safeName
    ]);
} else {
    sendResponse(['error' => 'Failed to save file to uploads directory'], 500);
}

