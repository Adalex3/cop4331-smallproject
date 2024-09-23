<?php

// Get the incoming request data
$data = getRequestInfo();

// Check if the required 'id' field is provided
if (!isset($data['id'])) {
    echo json_encode(["error" => "Missing contact ID."]);
    exit();
}

// Connect to the database
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

// Check for connection error
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Prepare and execute the SQL statement to delete the contact
$id = $data['id'];
$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
if ($stmt) {
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        // Check if any row was actually deleted
        if ($stmt->affected_rows > 0) {
            echo json_encode(["message" => "Contact deleted successfully."]);
        } else {
            echo json_encode(["error" => "No contact found with the given ID."]);
        }
    } else {
        echo json_encode(["error" => "Error deleting contact: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
}

$conn->close();

// Function to get request data
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

?>
