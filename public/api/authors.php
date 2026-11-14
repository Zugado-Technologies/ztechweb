<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$authors = readJsonFile('authors.json', []);

switch ($method) {
    case 'GET':
        sendResponse($authors);
        break;

    case 'POST':
        $payload = getRequestJson();
        if (empty($payload['name'])) {
            sendResponse(['error' => 'Name is required'], 400);
        }

        $id = !empty($payload['id']) ? $payload['id'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $payload['name'])));
        $found = false;

        foreach ($authors as $k => $item) {
            if ($item['id'] === $id) {
                $authors[$k] = array_merge($item, $payload);
                $found = true;
                break;
            }
        }

        if (!$found) {
            $authors[] = array_merge(['id' => $id], $payload);
        }

        if (writeJsonFile('authors.json', $authors)) {
            sendResponse(['status' => 'success', 'message' => 'Author profile saved', 'id' => $id]);
        } else {
            sendResponse(['error' => 'Failed to save author record'], 500);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? trim($_GET['id']) : null;
        if (!$id) {
            sendResponse(['error' => 'ID required'], 400);
        }

        $filtered = array_values(array_filter($authors, function($a) use ($id) {
            return $a['id'] !== $id;
        }));

        if (writeJsonFile('authors.json', $filtered)) {
            sendResponse(['status' => 'success', 'message' => 'Author deleted']);
        } else {
            sendResponse(['error' => 'Failed to delete record'], 500);
        }
        break;

    default:
        sendResponse(['error' => 'Unsupported method'], 405);
}

