<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$labs = readJsonFile('labs.json', []);

switch ($method) {
    case 'GET':
        sendResponse($labs);
        break;

    case 'POST':
        $payload = getRequestJson();
        if (empty($payload['name'])) {
            sendResponse(['error' => 'Name is required'], 400);
        }

        $id = !empty($payload['id']) ? $payload['id'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $payload['name'])));
        $found = false;

        foreach ($labs as $k => $item) {
            if ($item['id'] === $id) {
                $labs[$k] = array_merge($item, $payload);
                $found = true;
                break;
            }
        }

        if (!$found) {
            $labs[] = array_merge(['id' => $id], $payload);
        }

        if (writeJsonFile('labs.json', $labs)) {
            sendResponse(['status' => 'success', 'message' => 'Labs initiative saved', 'id' => $id]);
        } else {
            sendResponse(['error' => 'Failed to save Labs item'], 500);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? trim($_GET['id']) : null;
        if (!$id) {
            sendResponse(['error' => 'ID required'], 400);
        }

        $filtered = array_values(array_filter($labs, function($l) use ($id) {
            return $l['id'] !== $id;
        }));

        if (writeJsonFile('labs.json', $filtered)) {
            sendResponse(['status' => 'success', 'message' => 'Labs item deleted']);
        } else {
            sendResponse(['error' => 'Failed to delete record'], 500);
        }
        break;

    default:
        sendResponse(['error' => 'Unsupported method'], 405);
}

