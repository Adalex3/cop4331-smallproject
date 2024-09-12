<?php
session_start();

// Database connection
$conn = new mysqli("localhost", "root", "qUJ@lHgJrNi1", "contactManager");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepared statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT username, password FROM Users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 1) { // Username exists
        $stmt->bind_result($dbPassword);
        $stmt->fetch();

        // Verify the password
        if (password_verify($password, $dbPassword)) {
            $_SESSION["username"] = $username;
            header("Location: http://contactmanager11.online/Frontend/contacts.html"); // Redirect to contacts page
            exit();
        } else {
            echo("Invalid username or password.");
        }
    } else {
        echo("Invalid username or password.");
    }

    $stmt->close();
} else {
    echo("Unexpected error. Please try again.");
}

$conn->close();
?>