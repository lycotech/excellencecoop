<?php
/**
 * User Login API Endpoint
 * 
 * POST /api/auth/login.php
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 */

require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../config/jwt.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError("Method not allowed", 405);
}

// Get JSON input
$data = getJsonInput();

// Validate required fields
validateRequired($data, ['email', 'password']);

// Get database connection
$conn = getDB();

// Sanitize inputs
$email = sanitizeInput($data['email'], $conn);
$password = $data['password']; // Don't sanitize password for verification

try {
    // Prepare statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendError("Invalid email or password", 401);
    }

    $user = $result->fetch_assoc();

    // Verify password (assuming password is hashed with bcrypt)
    if (!password_verify($password, $user['password'])) {
        sendError("Invalid email or password", 401);
    }

    // Remove password from user data
    unset($user['password']);

    // Generate JWT token
    $token = JWT::generate([
        'user_id' => $user['user_id'],
        'email' => $user['email'],
        'user_type' => $user['user_type']
    ]);

    // Send success response
    sendSuccess([
        'token' => $token,
        'user' => $user
    ], "Login successful");

} catch (Exception $e) {
    error_log("Login Error: " . $e->getMessage());
    sendError("Login failed", 500, $e->getMessage());
} finally {
    $stmt->close();
    $conn->close();
}
?>

