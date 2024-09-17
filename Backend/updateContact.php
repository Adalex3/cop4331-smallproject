<?php
$data = getRequestInfo();
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if(isset($data['id']) && isset($data['name']) && isset($data['email'])) {
    $id = $data['id'];
    $name = htmlspecialchars($data['name']);
    $email = htmlspecialchars($data['email']);
    
    $stmt = $conn->prepare("UPDATE Contacts SET Name = ?, Email = ? WHERE ID = ?");
    $stmt->bind_param("ssi", $name, $email, $id);
    
    if($stmt->execute()) {
        echo json_encode(["message" => "Contact updated successfully"]);
    } else {
        echo json_encode(["error" => "Error updating contact"]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid input"]);
}

$conn->close();

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}
?>