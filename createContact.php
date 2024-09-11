<?php
$data = getRequestInfo();
$conn = new mysqli("localhost", "root", "qUJ@lHgJrNi1", "contactManager");

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if(isset($data['name']) && isset($data['email'])) {
    $name = htmlspecialchars($data['name']);
    $email = htmlspecialchars($data['email']);
    
    $stmt = $conn->prepare("INSERT INTO Contacts (Name, Email) VALUES (?, ?)");
    $stmt->bind_param("ss", $name, $email);
    
    if($stmt->execute()) {
        echo json_encode(["message" => "Contact created successfully"]);
    } else {
        echo json_encode(["error" => "Error creating contact"]);
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
