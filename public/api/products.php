<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$products = readJsonFile('products.json', []);

switch ($method) {
    case 'GET':
        sendResponse($products);
        break;

    case 'POST':
        $payload = getRequestJson();
        if (empty($payload['name'])) {
            sendResponse(['error' => 'Product name is required'], 400);
        }

        $id = !empty($payload['id']) ? $payload['id'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $payload['name'])));
        $found = false;

        foreach ($products as $k => $item) {
            if ($item['id'] === $id) {
                $products[$k] = array_merge($item, $payload);
                $found = true;
                break;
            }
        }

        if (!$found) {
            $products[] = array_merge(['id' => $id], $payload);
        }

        if (writeJsonFile('products.json', $products)) {
            sendResponse(['status' => 'success', 'message' => 'Product entry saved', 'id' => $id]);
        } else {
            sendResponse(['error' => 'Failed to save product record'], 500);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? trim($_GET['id']) : null;
        if (!$id) {
            sendResponse(['error' => 'ID required'], 400);
        }

        $filtered = array_values(array_filter($products, function($p) use ($id) {
            return $p['id'] !== $id;
        }));

        if (writeJsonFile('products.json', $filtered)) {
            sendResponse(['status' => 'success', 'message' => 'Product deleted']);
        } else {
            sendResponse(['error' => 'Failed to delete record'], 500);
        }
        break;

    default:
        sendResponse(['error' => 'Unsupported method'], 405);
}

