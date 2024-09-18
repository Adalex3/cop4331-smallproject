<?php

$data = getRequestInfo();

// Database connection
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

if($conn->connect_error)
{
    die("Connection failed: " . $conn->connect_error);
}

// Ensure required fields are set
if(isset($data['username']) && isset($data['password']) && isset($data['firstname']) && isset($data['lastname']))
{
    $firstname = htmlspecialchars($data['firstname']);
    $lastname = htmlspecialchars($data['lastname']);
    $username = htmlspecialchars($data['username']);
    $password = password_hash($data['password'], PASSWORD_BCRYPT);

    // Prepare and execute the SQL query to insert the new user
    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $firstname, $lastname, $username, $password);

    // Check if the statement executed successfully
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

// Function to get request data
function getRequestInfo() 
{
    return json_decode(file_get_contents('php://input'), true);
}

?>
