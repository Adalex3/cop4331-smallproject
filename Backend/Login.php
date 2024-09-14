<?php

$data = getRequestInfo();

$conn = new mysqli("localhost", "root", "qUJ@lHgJrNi1", "contactManager");

if($conn->connect_error)
{
    die("Connetion failed: " . $conn->connect_error);
}

if(isset($data->username) && isset($data->Password))
{
    $username = $data->username;
    $password = $data->Password;

    $stmt = $conn->prepare("SELECT Password FROM Users WHERE username = ?");
    if (!$stmt) {
        echo json_encode(["error" => "Database error."]);
        exit();
    }
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if($stmt->num_rows > 0) 
    {
        $stmt->bind_result($hashedPassword);
        $stmt->fetch();

        if(password_verify($password, $hashedPassword))
        {
            echo json_encode(["message" => "Login successful."]);
        }
        else
        {
            echo json_encode(["error" => "Incorrect password."]);
        }
    }
    else 
    {
        echo json_encode(["error" => "Username not found."]);
    }
    $stmt->close();
}

else 
{
    echo json_encode(["error" => "Invalid input"]);
}

$conn->close();

function getRequestInfo() 
{
    return json_decode(file_get_contents('php://input'));
}
?>
