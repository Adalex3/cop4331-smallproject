<?php

$data = getRequestInfo();

// need to change these values
$conn = new mysqli("localhost", "username", "password", "database");

if($conn->connect_error)
{
    die("Connetion failed: " . $conn->connect_error);
}

if(isset($data->username) && isset($data->FirstName) && isset($data->LastName) && isset($data->Password))
{
    $username = htmlspecialchars($data->username);
    $firstName = htmlspecialchars($data->FirstName);
    $lastName = htmlspecialchars($data->LastName);
    $password = password_hash($data->password, PASSWORD_DEFAULT);

    $checkStmt = $conn->prepare("SELECT username FROM Users WHERE username = ?");
    $checkStmt->bind_param("s", $username);
    $checkStmt->execute();
    $checkStmt->store_result();

    if($checkStmt->num_rows > 0)
    {
        echo json_encode(["error" => "Username already taken."]);
    }
    else 
    {
        $stmt = $conn->prepare("INSERT INTO Users (usrname, FirstName, LastName, Password) VALUES(?, ?, ?, ?");
        $stmt->bind_param("ssss", $username, $firstName, $lastName, $password);

        if($stmt->execute()) 
        {
            echo json_encode(["message" => "Registration successful"]);
        }
        else 
        {
            echo json_encode(["error" => "Error registering user"]);
        }
        $stmt->close();
    }
    $checkStmt->close();
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