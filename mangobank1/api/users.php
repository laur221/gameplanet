if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Start the session if it's not already started
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        
        // Unset all session variables
        $_SESSION = array();
        
        // If a session cookie is used, destroy it
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        
        // Destroy the session
        session_destroy();
        
        // Return success response
        header('Content-Type: application/json');
        echo json_encode(["status" => "success", "message" => "Logout successful"]);
    } else {
        http_response_code(405); // Method Not Allowed
        header('Allow: POST');
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "message" => "Method Not Allowed. Use POST."]);
    }
    exit;
}

