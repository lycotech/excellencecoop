<?php
/**
 * Get All Users API Endpoint
 * 
 * GET /api/users/get-users.php
 * 
 * Headers:
 * Authorization: Bearer {token}
 * 
 * Query Parameters:
 * - user_type (optional): Filter by user type
 * - limit (optional): Number of results (default: 100)
 * - offset (optional): Pagination offset (default: 0)
 */

require_once '../config/cors.php';
require_once '../config/database.php';
require_once '../config/jwt.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError("Method not allowed", 405);
}

// Verify authentication
$auth_user = verifyAuth();

// Only admins can view all users
if ($auth_user['user_type'] !== 'admin') {
    sendError("Unauthorized access", 403);
}

// Get database connection
$conn = getDB();

// Get query parameters
$user_type = isset($_GET['user_type']) ? sanitizeInput($_GET['user_type'], $conn) : null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

try {
    // Build query
    $sql = "SELECT user_id, email, full_name, user_type, created_at FROM users WHERE 1=1";
    $params = [];
    $types = "";

    // Add user_type filter if provided
    if ($user_type) {
        $sql .= " AND user_type = ?";
        $params[] = $user_type;
        $types .= "s";
    }

    // Add pagination
    $sql .= " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    $types .= "ii";

    // Prepare and execute statement
    $stmt = $conn->prepare($sql);
    
    if ($types) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();

    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM users" . ($user_type ? " WHERE user_type = ?" : "");
    $count_stmt = $conn->prepare($count_sql);
    
    if ($user_type) {
        $count_stmt->bind_param("s", $user_type);
    }
    
    $count_stmt->execute();
    $count_result = $count_stmt->get_result();
    $total = $count_result->fetch_assoc()['total'];

    // Send response
    sendSuccess([
        'users' => $users,
        'total' => $total,
        'limit' => $limit,
        'offset' => $offset
    ], "Users retrieved successfully");

} catch (Exception $e) {
    error_log("Get Users Error: " . $e->getMessage());
    sendError("Failed to retrieve users", 500, $e->getMessage());
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($count_stmt)) $count_stmt->close();
    $conn->close();
}
?>

