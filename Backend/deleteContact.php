<?php
$data = getRequestInfo();
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if(isset($data['id'])) {
    $id = $data['id'];
    
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
    $stmt->bind_param("i", $id);
    
    if($stmt->execute()) {
        echo json_encode(["message" => "Contact deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error deleting contact"]);
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