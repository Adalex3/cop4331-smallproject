<?php

$data = getRequestInfo();

$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

if($conn->connect_error)
{
    die("Connetion failed: " . $conn->connect_error);
}

if(isset($data->username) && isset($data->Password))
{
    $username = htmlspecialchars($data->username);
    $name = htmlspecialchars($data->Name);
    $email = htmlspecialchars($data->Email);

    $stmt = $conn->prepare("INSERT INTO Contacts (username, Name, Email) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $name, $email);
    // $stmt->execute();
    // $stmt->store_result();

    if ($stmt->execute()) {
        echo json_encode(["message" => "Contact added successfully."]);
    } 
    else {
        echo json_encode(["error" => "Error adding contact: " . $stmt->error]);
    }

    $stmt->close();
}

else 
{
    echo json_encode(["error" => "Missing data"]);
    exit();
}

$conn->close();

function getRequestInfo() 
{
    return json_decode(file_get_contents('php://input'))
}
?>
