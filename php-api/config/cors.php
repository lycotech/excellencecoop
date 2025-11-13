<?php
/**
 * CORS Configuration
 * 
 * Handles Cross-Origin Resource Sharing for API requests
 * Allows your Vercel app to communicate with this PHP API
 */

// Allowed origins - Add your Vercel domains here
$allowed_origins = [
    'http://localhost:3000',                    // Local development
    'https://your-app.vercel.app',              // Replace with your Vercel URL
    'https://excellencecoop.com',               // Your production domain
    'https://www.excellencecoop.com',
];

// Get the origin of the request
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Check if origin is allowed
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // For development, you can allow all origins (NOT recommended for production)
    // header("Access-Control-Allow-Origin: *");
}

// Allowed methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allowed headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-API-Key");

// Allow credentials (cookies, authorization headers)
header("Access-Control-Allow-Credentials: true");

// Cache preflight requests for 1 hour
header("Access-Control-Max-Age: 3600");

// Set content type to JSON
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Send JSON response
 */
function sendResponse($data, $status_code = 200) {
    http_response_code($status_code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

/**
 * Send error response
 */
function sendError($message, $status_code = 400, $details = null) {
    $response = [
        "success" => false,
        "message" => $message
    ];
    
    if ($details !== null) {
        $response["error"] = $details;
    }
    
    sendResponse($response, $status_code);
}

/**
 * Send success response
 */
function sendSuccess($data, $message = "Success") {
    sendResponse([
        "success" => true,
        "message" => $message,
        "data" => $data
    ], 200);
}

/**
 * Get JSON input from request body
 */
function getJsonInput() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError("Invalid JSON input", 400);
    }
    
    return $data;
}

/**
 * Validate required fields
 */
function validateRequired($data, $required_fields) {
    $missing = [];
    
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            $missing[] = $field;
        }
    }
    
    if (!empty($missing)) {
        sendError("Missing required fields: " . implode(", ", $missing), 400);
    }
    
    return true;
}

/**
 * Sanitize input string
 */
function sanitizeInput($data, $conn) {
    return $conn->real_escape_string(strip_tags(trim($data)));
}
?>

