<?php
/**
 * Database Configuration
 * 
 * This file handles MySQL connection for all API endpoints
 * Connection uses localhost since PHP runs on the same server
 */

class Database {
    private $host = "localhost";
    private $db_name = "excellence_coopdb";  // Change to your database name
    private $username = "excellence_coopruser";               // Change to your cPanel username_dbuser
    private $password = "KR!;IxN7pRH8^{Dl";                   // Change to your database password
    private $conn;

    /**
     * Get database connection
     * Uses mysqli for better error handling and security
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new mysqli(
                $this->host,
                $this->username,
                $this->password,
                $this->db_name
            );

            // Set charset to utf8mb4 for emoji support
            $this->conn->set_charset("utf8mb4");

            // Check connection
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }

        } catch(Exception $e) {
            error_log("Database Connection Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Database connection failed",
                "error" => $e->getMessage()
            ]);
            exit();
        }

        return $this->conn;
    }

    /**
     * Close database connection
     */
    public function closeConnection() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}

/**
 * Quick connection helper function
 */
function getDB() {
    $database = new Database();
    return $database->getConnection();
}
?>

