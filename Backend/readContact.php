<?php
$data = getRequestInfo();
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (!isset($data['username'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit();
}

$username = $conn->real_escape_string($data['username']);
$searchTerm = isset($data['search']) ? $conn->real_escape_string($data['search']) : '';

if($searchTerm === '') 
{
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE username = ?");
    $stmt->bind_param("s", $username);
}

else 
{
    $searchTerm = '%' . $searchTerm . '%';  // Add wildcards for partial search
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE username = ? AND Name LIKE ?");
    $stmt->bind_param("ss", $username, $searchTerm);
}

$stmt->execute();
$result = $stmt->get_result();

if($result > 0) 
{
    $contacts = array();
    while($row = $result->fetch_assoc())
    {
        $contacts[] = $row;
    }
    
    echo json_encode($contacts);
}

else
{
    json_encode(["message" => "No contacts found."]);
}

$stmt->close();
$conn->close();

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}
?>