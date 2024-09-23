<?php

// Get the incoming request data
$data = getRequestInfo();

// Check if the required fields are present
if (!isset($data['username'], $data['name'], $data['email'])) {
    returnWithError("Missing required fields.");
    exit();
}

// Connect to the database
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

// Check for a connection error
if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
    exit();
}

// Prepare and execute the SQL statement to insert the contact
$stmt = $conn->prepare("INSERT INTO Contacts (username, name, email) VALUES (?, ?, ?)");
if ($stmt) {
    // Bind the parameters and execute
    $stmt->bind_param("sss", $data['username'], $data['name'], $data['email']);
    if ($stmt->execute()) {
        // Return success message
        returnWithSuccess("Contact added successfully.");
    } else {
        returnWithError("Failed to add contact: " . $stmt->error);
    }
    $stmt->close();
} else {
    returnWithError("Prepare failed: " . $conn->error);
}

$conn->close();

// Function to get the request data
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send JSON response
function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

// Function to return errors
function returnWithError($err) {
    $retValue = json_encode(array("error" => $err));
    sendResultInfoAsJson($retValue);
}

// Function to return success message
function returnWithSuccess($message) {
    $retValue = json_encode(array("success" => $message));
    sendResultInfoAsJson($retValue);
}
?>
