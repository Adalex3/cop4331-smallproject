<?php
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$searchTerm = isset($data['search']) ? $conn->real_escape_string($data['search']) : '';

if($searchTerm === '') 
{
    $stmt = $conn->prepare("SELECT * FROM Contacts");
}

else 
{
    $searchTerm = '%' . $searchTerm . '%';  
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE Name LIKE ?");
    $stmt->bind_param("s", $searchTerm);
}

$stmt->execute();
$result = $stmt->get_result();


$contacts = array();
while($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

// Check if search term was provided and if no contacts were found
echo json_encode($contacts);

$conn->close();
?>