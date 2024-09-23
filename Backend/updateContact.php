<?php
$data = getRequestInfo();
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

// Check for connection error
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Check if the required fields are provided
if (isset($data['id']) && isset($data['firstName']) && isset($data['lastName']) && isset($data['email'])) {
    $id = $data['id'];
    $firstName = htmlspecialchars($data['firstName']);
    $lastName = htmlspecialchars($data['lastName']);
    $email = htmlspecialchars($data['email']);
    
    // Prepare the SQL statement
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Email = ? WHERE ID = ?");
    
    if ($stmt) {
        $stmt->bind_param("sssi", $firstName, $lastName, $email, $id);
        
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
