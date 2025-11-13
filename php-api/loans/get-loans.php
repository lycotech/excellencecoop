<?php
/**
 * Get All Loans API Endpoint
 * 
 * GET /api/loans/get-loans.php
 * 
 * Headers:
 * Authorization: Bearer {token}
 * 
 * Query Parameters:
 * - status (optional): Filter by loan status
 * - member_id (optional): Filter by member ID
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
$member_id = isset($_GET['member_id']) ? intval($_GET['member_id']) : null;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 100;
$offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;

try {
    // Build query with JOIN to get member details
    $sql = "SELECT l.*, m.full_name as member_name, m.member_number 
            FROM loans l 
            LEFT JOIN members m ON l.member_id = m.member_id 
            WHERE 1=1";
    $params = [];
    $types = "";

    // Add status filter if provided
    if ($status) {
        $sql .= " AND l.status = ?";
        $params[] = $status;
        $types .= "s";
    }

    // Add member_id filter if provided
    if ($member_id) {
        $sql .= " AND l.member_id = ?";
        $params[] = $member_id;
        $types .= "i";
    }

    // Add pagination
    $sql .= " ORDER BY l.created_at DESC LIMIT ? OFFSET ?";
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

    $loans = [];
    while ($row = $result->fetch_assoc()) {
        $loans[] = $row;
    }

    // Get total count
    $count_sql = "SELECT COUNT(*) as total FROM loans WHERE 1=1";
    if ($status) $count_sql .= " AND status = ?";
    if ($member_id) $count_sql .= " AND member_id = ?";
    
    $count_stmt = $conn->prepare($count_sql);
    
    $count_params = [];
    $count_types = "";
    if ($status) {
        $count_params[] = $status;
        $count_types .= "s";
    }
    if ($member_id) {
        $count_params[] = $member_id;
        $count_types .= "i";
    }
    
    if ($count_types) {
        $count_stmt->bind_param($count_types, ...$count_params);
    }
    
    $count_stmt->execute();
    $count_result = $count_stmt->get_result();
    $total = $count_result->fetch_assoc()['total'];

    // Send response
    sendSuccess([
        'loans' => $loans,
        'total' => $total,
        'limit' => $limit,
        'offset' => $offset
    ], "Loans retrieved successfully");

} catch (Exception $e) {
    error_log("Get Loans Error: " . $e->getMessage());
    sendError("Failed to retrieve loans", 500, $e->getMessage());
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($count_stmt)) $count_stmt->close();
    $conn->close();
}
?>

