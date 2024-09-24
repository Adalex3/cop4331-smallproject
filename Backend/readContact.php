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

$result = $conn->query("SELECT * FROM Contacts WHERE Name LIKE ?");
$stmt->bind_param("s", $searchTerm);  // Bind the search term
$stmt->execute();

$result = $stmt->get_result();


if($result->num_rows > 0) {
    $contacts = array();
    while($row = $result->fetch_assoc()) {
        $contacts[] = $row;
    }
    echo json_encode($contacts);
} else {
    echo json_encode([]);
}

$conn->close();
?>