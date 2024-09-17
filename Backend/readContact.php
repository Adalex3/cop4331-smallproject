<?php
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT * FROM Contacts");

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