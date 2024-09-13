<?php

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = getRequestInfo();

$conn = new mysqli("localhost", "root", "qUJ@lHgJrNi1", "contactManager");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if (isset($data->username) && isset($data->password)) {
    $username = $data->username;
    $password = $data->password;

    $stmt = $conn->prepare("SELECT Password FROM Users WHERE username = ?");
    if (!$stmt) {
        die(json_encode(["error" => "Prepare failed: " . $conn->error]));
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            echo json_encode(["message" => "Login successful."]);
        } else {
            echo json_encode(["error" => "Incorrect password."]);
        }
    } else {
        echo json_encode(["error" => "Username not found."]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid input"]);
}

$conn->close();

function getRequestInfo() {
    $data = file_get_contents('php://input');
    if ($data === false) {
        die(json_encode(["error" => "Failed to read input."]));
    }
    $json = json_decode($data);
    if (json_last_error() !== JSON_ERROR_NONE) {
        die(json_encode(["error" => "Invalid JSON input."]));
    }
    return $json;
}
?>
