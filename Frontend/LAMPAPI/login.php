<?php

session_start();
include("login.html");

// Place holder values
$conn = new mysqli("localhost", "username", "password", "database");

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT username, password FROM users WHERE username = '$username'";
    $data = $conn->query($sql);

    if($data->num_rows == 1) { // Username exists
        $row = $data->fetch_assoc();
        if($password == $row['password']) { // Password is correct
            $_SESSION["username"] = $username;

            header("location: contacts.html"); // Go to contacts page
        } else { // Password is incorrect
            echo("Invalid username or password.");
        }
    } else { // Username does not exist
        echo("Invalid username or password.");
    }
} else {
    echo("Unexpected error. Please try again.");
}

$conn->close();

?>