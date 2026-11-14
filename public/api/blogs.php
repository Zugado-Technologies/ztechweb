<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];
$blogs = readJsonFile('blogs.json', []);

switch ($method) {
    case 'GET':
        $slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;
        if ($slug) {
            foreach ($blogs as $b) {
                if ($b['slug'] === $slug || $b['id'] === $slug) {
                    sendResponse($b);
                }
            }
            sendResponse(['error' => 'Article not found'], 404);
        }
        sendResponse($blogs);
        break;

    case 'POST':
        $payload = getRequestJson();
        if (empty($payload['title'])) {
            sendResponse(['error' => 'Title is required'], 400);
        }

        $id = !empty($payload['id']) ? $payload['id'] : (!empty($payload['slug']) ? $payload['slug'] : uniqid('blog_'));
        $found = false;

        foreach ($blogs as $k => $b) {
            if ($b['id'] === $id) {
                $blogs[$k] = array_merge($b, $payload, ['updatedAt' => date('c')]);
                $found = true;
                break;
            }
        }

        if (!$found) {
            $newBlog = array_merge([
                'id' => $id,
                'publishedAt' => date('c'),
                'updatedAt' => date('c'),
                'status' => 'draft'
            ], $payload);
            array_unshift($blogs, $newBlog);
        }

        if (writeJsonFile('blogs.json', $blogs)) {
            sendResponse(['status' => 'success', 'message' => 'Blog article saved', 'id' => $id]);
        } else {
            sendResponse(['error' => 'Failed to write dataset to disk'], 500);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? trim($_GET['id']) : null;
        if (!$id) {
            sendResponse(['error' => 'Article ID is required for deletion'], 400);
        }

        $filtered = array_values(array_filter($blogs, function($b) use ($id) {
            return $b['id'] !== $id;
        }));

        if (count($filtered) === count($blogs)) {
            sendResponse(['error' => 'Article not found'], 404);
        }

        if (writeJsonFile('blogs.json', $filtered)) {
            sendResponse(['status' => 'success', 'message' => 'Article deleted']);
        } else {
            sendResponse(['error' => 'Failed to delete record'], 500);
        }
        break;

    default:
        sendResponse(['error' => 'Unsupported method'], 405);
}

