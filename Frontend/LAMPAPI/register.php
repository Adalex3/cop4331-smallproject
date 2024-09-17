<?php

$data = getRequestInfo();

// need to change these values
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

if($conn->connect_error)
{
    die("Connetion failed: " . $conn->connect_error);
}

if(isset($data->username) && isset($data->password))
{
    $username = htmlspecialchars($data->username);
    $password = password_hash($data->password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password);

    if($stmt->execute())
    {
        echo json_encode(["message" => "User registered successfully."]);
    }
    else 
    {
        echo json_encode(["error" => "Username already exists or an error occurred"]);
    }
}

else
{
    echo json_encode(["error" => "Invalid input"]);
}

$conn->close();

function getRequestInfo() 
{
    return json_decode(file_get_contents('php://input'), true);
}

?>