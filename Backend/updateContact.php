<?php
$data = getRequestInfo();
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

// Check for connection error
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

if (!isset($data['id'], $data['username'], $data['name'], $data['email'], $data['phonenumber'])) {
    echo json_encode(["error" => "Missing required fields."]);
    exit();
}

$id = (int)$data['id']; 
$username = htmlspecialchars($data['username']);
$name = htmlspecialchars($data['name']);
$email = htmlspecialchars($data['email']);
$phonenumber = htmlspecialchars($data['phonenumber']);

$stmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID = ? AND username = ?");
$stmt->bind_param("is", $id, $username);
$stmt->execute();
$stmt->store_result();

if($stmt->num_rows > 0)
{
    $stmt->close();
    
    $updateStmt = $conn->prepare("UPDATE Contacts SET Name = ?, Email = ?, phonenumber = ? WHERE ID = ?");
    $updateStmt->bind_param("sssi", $name, $email, $phonenumber, $id);

    if ($updateStmt->execute()) {
        if ($updateStmt->affected_rows > 0) 
        {
            echo json_encode(["message" => "Contact updated successfully"]);
        } 
        else 
        {
            echo json_encode(["error" => "No changes made to the contact."]);
        }
    } 
    else 
    {
        echo json_encode(["error" => "Error updating contact: " . $updateStmt->error]);
    }
    
    $updateStmt->close();
} 
else 
{
    echo json_encode(["error" => "No contact found or you're not authorized to update this contact."]);
}

$conn->close();


function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}
?>
