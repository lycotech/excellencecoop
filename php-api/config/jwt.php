<?php
/**
 * JWT Helper Functions
 * 
 * Simple JWT implementation for authentication
 * Uses HS256 algorithm
 */

class JWT {
    private static $secret_key = "your-super-secret-jwt-key-change-this"; // CHANGE THIS!
    private static $algorithm = 'HS256';
    private static $expiration = 86400; // 24 hours in seconds

    /**
     * Generate JWT token
     */
    public static function generate($user_data) {
        $issued_at = time();
        $expiration_time = $issued_at + self::$expiration;

        $payload = [
            'iat' => $issued_at,
            'exp' => $expiration_time,
            'data' => $user_data
        ];

        return self::encode($payload);
    }

    /**
     * Verify and decode JWT token
     */
    public static function verify($token) {
        try {
            $payload = self::decode($token);

            // Check if token is expired
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return [
                    'success' => false,
                    'message' => 'Token expired'
                ];
            }

            return [
                'success' => true,
                'data' => $payload['data']
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Invalid token'
            ];
        }
    }

    /**
     * Encode JWT
     */
    private static function encode($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => self::$algorithm]);
        $payload = json_encode($payload);

        $base64_header = self::base64url_encode($header);
        $base64_payload = self::base64url_encode($payload);

        $signature = hash_hmac('sha256', $base64_header . "." . $base64_payload, self::$secret_key, true);
        $base64_signature = self::base64url_encode($signature);

        return $base64_header . "." . $base64_payload . "." . $base64_signature;
    }

    /**
     * Decode JWT
     */
    private static function decode($token) {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }

        list($base64_header, $base64_payload, $base64_signature) = $parts;

        // Verify signature
        $signature = hash_hmac('sha256', $base64_header . "." . $base64_payload, self::$secret_key, true);
        $expected_signature = self::base64url_encode($signature);

        if ($base64_signature !== $expected_signature) {
            throw new Exception('Invalid signature');
        }

        $payload = json_decode(self::base64url_decode($base64_payload), true);

        return $payload;
    }

    /**
     * Base64 URL encode
     */
    private static function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    /**
     * Base64 URL decode
     */
    private static function base64url_decode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Get token from Authorization header
     */
    public static function getTokenFromHeader() {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $auth_header = $headers['Authorization'];
            
            // Remove "Bearer " prefix if present
            if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
                return $matches[1];
            }
            
            return $auth_header;
        }
        
        return null;
    }

    /**
     * Middleware to verify token
     */
    public static function verifyRequest() {
        $token = self::getTokenFromHeader();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'No token provided'
            ]);
            exit();
        }
        
        $result = self::verify($token);
        
        if (!$result['success']) {
            http_response_code(401);
            echo json_encode($result);
            exit();
        }
        
        return $result['data'];
    }
}

/**
 * Quick verify function
 */
function verifyAuth() {
    return JWT::verifyRequest();
}
?>

