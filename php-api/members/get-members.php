<?php
/**
 * Get All Members API Endpoint
 * 
 * GET /api/members/get-members.php
 * 
 * Headers:
 * Authorization: Bearer {token}
 * 
 * Query Parameters:
 * - status (optional): Filter by member status (active, inactive, pending)
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

// Get database connection
$conn = getDB();

// Get query parameters
$status = isset($_GET['status']) ? sanitizeInput($_GET['status'], $conn) : null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

try {
    // Build query
    $sql = "SELECT * FROM members WHERE 1=1";
    $params = [];
    $types = "";

    // Add status filter if provided
    if ($status) {
        $sql .= " AND status = ?";
        $params[] = $status;
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

    $members = [];
    while ($row = $result->fetch_assoc()) {
        $members[] = $row;
    }

    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM members" . ($status ? " WHERE status = ?" : "");
    $count_stmt = $conn->prepare($count_sql);
    
    if ($status) {
        $count_stmt->bind_param("s", $status);
    }
    
    $count_stmt->execute();
    $count_result = $count_stmt->get_result();
    $total = $count_result->fetch_assoc()['total'];

    // Send response
    sendSuccess([
        'members' => $members,
        'total' => $total,
        'limit' => $limit,
        'offset' => $offset
    ], "Members retrieved successfully");

} catch (Exception $e) {
    error_log("Get Members Error: " . $e->getMessage());
    sendError("Failed to retrieve members", 500, $e->getMessage());
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($count_stmt)) $count_stmt->close();
    $conn->close();
}
?>

