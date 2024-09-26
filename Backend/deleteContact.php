<?php

// Get the incoming request data
$data = getRequestInfo();

// Connect to the database
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

// Check for connection error
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}

if (!isset($data['username'], $data['contactId'])) {
    echo json_encode(["error" => "Missing required fields (username or contactId)."]);
    exit();
}

$username = $conn->real_escape_string($data['username']);  
$id = $data['id'];

$stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ? AND username = ?");
$stmt->bind_param("is", $id, $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Step 2: If the contact exists and belongs to the user, proceed with deletion
    $deleteStmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
    $deleteStmt->bind_param("i", $id);

    if ($deleteStmt->execute()) 
    {
        echo json_encode(["message" => "Contact deleted successfully."]);
    } 
    else 
    {
        echo json_encode(["error" => "Error deleting contact: " . $deleteStmt->error]);
    }

    $deleteStmt->close();
}

else 
{
    echo json_encode(["error" => "No contact found or you are not authorized to delete this contact."]);
}

$stmt->close();
$conn->close();

// Function to get request data
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

?>
