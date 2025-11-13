<?php
/**
 * Get Dashboard Statistics API Endpoint
 * 
 * GET /api/dashboard/get-stats.php
 * 
 * Headers:
 * Authorization: Bearer {token}
 * 
 * Returns:
 * - Total members count
 * - Active members count
 * - Total loans count
 * - Active loans amount
 * - Pending loans count
 * - Total users count
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

try {
    $stats = [];

    // Get total members
    $result = $conn->query("SELECT COUNT(*) as total FROM members");
    $stats['total_members'] = $result->fetch_assoc()['total'];

    // Get active members
    $result = $conn->query("SELECT COUNT(*) as total FROM members WHERE status = 'active'");
    $stats['active_members'] = $result->fetch_assoc()['total'];

    // Get pending members
    $result = $conn->query("SELECT COUNT(*) as total FROM members WHERE status = 'pending'");
    $stats['pending_members'] = $result->fetch_assoc()['total'];

    // Get total users (if users table exists)
    $result = $conn->query("SELECT COUNT(*) as total FROM users");
    $stats['total_users'] = $result->fetch_assoc()['total'];

    // Get total loans
    $result = $conn->query("SELECT COUNT(*) as total FROM loans");
    $stats['total_loans'] = $result->fetch_assoc()['total'];

    // Get active loans amount
    $result = $conn->query("SELECT COALESCE(SUM(principal_amount), 0) as total FROM loans WHERE status = 'active'");
    $stats['active_loans_amount'] = floatval($result->fetch_assoc()['total']);

    // Get pending loans count
    $result = $conn->query("SELECT COUNT(*) as total FROM loans WHERE status = 'pending'");
    $stats['pending_loans'] = $result->fetch_assoc()['total'];

    // Get approved loans count
    $result = $conn->query("SELECT COUNT(*) as total FROM loans WHERE status = 'approved'");
    $stats['approved_loans'] = $result->fetch_assoc()['total'];

    // Get loan repayment rate (paid vs total)
    $result = $conn->query("
        SELECT 
            COALESCE(SUM(total_amount), 0) as total_amount,
            COALESCE(SUM(amount_paid), 0) as amount_paid
        FROM loans 
        WHERE status IN ('active', 'completed')
    ");
    $repayment_data = $result->fetch_assoc();
    $stats['total_loan_amount'] = floatval($repayment_data['total_amount']);
    $stats['total_amount_paid'] = floatval($repayment_data['amount_paid']);
    $stats['repayment_rate'] = $stats['total_loan_amount'] > 0 
        ? round(($stats['total_amount_paid'] / $stats['total_loan_amount']) * 100, 2)
        : 0;

    // Get recent growth (members registered this month)
    $result = $conn->query("
        SELECT COUNT(*) as total 
        FROM members 
        WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    ");
    $stats['members_this_month'] = $result->fetch_assoc()['total'];

    // Get loans issued this month
    $result = $conn->query("
        SELECT COUNT(*) as total 
        FROM loans 
        WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    ");
    $stats['loans_this_month'] = $result->fetch_assoc()['total'];

    // Send response
    sendSuccess($stats, "Statistics retrieved successfully");

} catch (Exception $e) {
    error_log("Get Stats Error: " . $e->getMessage());
    sendError("Failed to retrieve statistics", 500, $e->getMessage());
} finally {
    $conn->close();
}
?>

