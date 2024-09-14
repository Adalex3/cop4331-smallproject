<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost"; // or your database server
$username = "TheBeast";        // or your database username
$password = "WeLoveCOP4331"; // or your database password
$database = "contactManager";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Connection failed: ' . $conn->connect_error
    ]);
    exit();
} else {
    echo json_encode([
        'success' => true,
        'message' => 'Connection successful'
    ]);
}

$conn->close();
?>