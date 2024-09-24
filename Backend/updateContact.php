<?php
$data = getRequestInfo();
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

// Check for connection error
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Check if the required fields are provided
if (isset($data['id']) && isset($data['username']) && isset($data['name']) && isset($data['email']) && isset($data['phone$phonenumbernumber'])) {
    $id = (int)$data['id']; // Ensure ID is treated as an integer
    $username = htmlspecialchars($data['username']);
    $name = htmlspecialchars($data['name']);
    $email = htmlspecialchars($data['email']);
    $phonenumber = htmlspecialchars($data['phonenumber']);
    
    // Prepare the SQL statement
    $stmt = $conn->prepare("UPDATE Contacts SET username = ?, name = ?, email = ?, phonenumber = ? WHERE id = ?");
    
    if ($stmt) {
        $stmt->bind_param("ssssi", $username, $name, $email, $phonenumber, $id);
        
        // Execute the statement
        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(["message" => "Contact updated successfully"]);
            } else {
                echo json_encode(["error" => "No contact found with the given ID or no changes made."]);
            }
        } else {
            echo json_encode(["error" => "Error updating contact: " . $stmt->error]);
        }
        
        $stmt->close();
    } else {
        echo json_encode(["error" => "Failed to prepare statement: " . $conn->error]);
    }
} else {
    echo json_encode(["error" => "Invalid input: Missing required fields."]);
}

$conn->close();

// Function to get request data
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}
?>
