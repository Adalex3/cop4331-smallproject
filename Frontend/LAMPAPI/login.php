<?php

session_start();

// Place holder values
$conn = new mysqli("localhost", "username", "password", "database");

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = ""

    if()
}

$conn->close();

?>