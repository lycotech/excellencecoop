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

// Validate required fields - accept both 'identifier' (staff_no or email) or 'email'
if (isset($data['identifier'])) {
    $data['email'] = $data['identifier']; // Map identifier to email for backward compatibility
}
validateRequired($data, ['email', 'password']);

// Get database connection
$conn = getDB();

// Sanitize inputs
$identifier = sanitizeInput($data['email'], $conn); // This could be email or staff_no
$password = $data['password']; // Don't sanitize password for verification

try {
    // Prepare statement to prevent SQL injection
    // Check both email and staff_no fields
    $stmt = $conn->prepare("SELECT * FROM USERS WHERE email = ? OR staff_no = ? LIMIT 1");
    $stmt->bind_param("ss", $identifier, $identifier);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        sendError("Invalid credentials", 401);
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
        'user_id' => $user['id'] ?? $user['user_id'],
        'staff_no' => $user['staff_no'],
        'email' => $user['email'],
        'user_type' => $user['login_type'] ?? $user['user_type'],
        'login_status' => $user['login_status']
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

