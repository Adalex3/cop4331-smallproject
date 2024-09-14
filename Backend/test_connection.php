<?php
$servername = "localhost"; // or the IP address of your MySQL server
$username = "root";        // MySQL root user
$password = "qUJ@lHgJrNi1"; // replace with the actual root password
$database = "contactManager";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>
