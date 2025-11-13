<?php
/**
 * Database Users Check
 * 
 * Visit: https://excellencecoop.com/api/test/check-users.php
 * 
 * ⚠️ DELETE THIS FILE after testing!
 */

require_once '../config/database.php';

header('Content-Type: application/json');

try {
    $conn = getDB();
    
    // Count total users
    $result = $conn->query("SELECT COUNT(*) as total FROM USERS");
    $total = $result->fetch_assoc()['total'];
    
    // Get sample user (without password)
    $result = $conn->query("SELECT id, staff_no, email, login_type, login_status FROM USERS LIMIT 1");
    $sample_user = $result->fetch_assoc();
    
    // Check if passwords are hashed
    $result = $conn->query("SELECT LENGTH(password) as pwd_length FROM USERS LIMIT 1");
    $pwd_check = $result->fetch_assoc();
    $is_hashed = $pwd_check && $pwd_check['pwd_length'] > 50;
    
    echo json_encode([
        'success' => true,
        'database_connected' => true,
        'total_users' => $total,
        'sample_user' => $sample_user,
        'passwords_hashed' => $is_hashed,
        'message' => 'Database check complete',
        'warning' => '⚠️ DELETE this file after testing!'
    ], JSON_PRETTY_PRINT);
    
    $conn->close();
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Database connection or query failed'
    ], JSON_PRETTY_PRINT);
}
?>

