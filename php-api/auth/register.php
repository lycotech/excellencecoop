<?php
/**
 * User Registration API Endpoint
 * 
 * POST /api/auth/register.php
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123",
 *   "full_name": "John Doe",
 *   "user_type": "member"
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
validateRequired($data, ['email', 'password', 'full_name', 'user_type']);

// Get database connection
$conn = getDB();

// Sanitize inputs
$email = sanitizeInput($data['email'], $conn);
$full_name = sanitizeInput($data['full_name'], $conn);
$user_type = sanitizeInput($data['user_type'], $conn);
$password = $data['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError("Invalid email format", 400);
}

// Validate password strength (minimum 6 characters)
if (strlen($password) < 6) {
    sendError("Password must be at least 6 characters long", 400);
}

// Validate user type
$allowed_user_types = ['admin', 'member', 'loan_officer'];
if (!in_array($user_type, $allowed_user_types)) {
    sendError("Invalid user type", 400);
}

try {
    // Check if email already exists
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        sendError("Email already registered", 409);
    }
    $stmt->close();

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // Insert new user
    $stmt = $conn->prepare("
        INSERT INTO users (email, password, full_name, user_type, created_at) 
        VALUES (?, ?, ?, ?, NOW())
    ");
    $stmt->bind_param("ssss", $email, $hashed_password, $full_name, $user_type);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to create user");
    }

    $user_id = $conn->insert_id;

    // Generate JWT token
    $token = JWT::generate([
        'user_id' => $user_id,
        'email' => $email,
        'user_type' => $user_type
    ]);

    // Send success response
    sendSuccess([
        'token' => $token,
        'user' => [
            'user_id' => $user_id,
            'email' => $email,
            'full_name' => $full_name,
            'user_type' => $user_type
        ]
    ], "Registration successful");

} catch (Exception $e) {
    error_log("Registration Error: " . $e->getMessage());
    sendError("Registration failed", 500, $e->getMessage());
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>

