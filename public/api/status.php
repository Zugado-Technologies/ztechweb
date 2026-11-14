<?php
require_once __DIR__ . '/config.php';

sendResponse([
    'status' => 'ok',
    'service' => 'Zugado Technologies MilesWeb REST Engine',
    'version' => '2.0.0',
    'timestamp' => date('c'),
    'environment' => [
        'php_version' => phpversion(),
        'writable_data' => is_writable(DATA_DIR),
        'writable_uploads' => is_writable(UPLOADS_DIR)
    ]
]);

