<?php

// Retrieve the JSON input data
$inData = getRequestInfo();

if (!isset($data['firstname'], $data['lastname'], $data['username'], $data['password'])) {
    returnWithError("Missing required fields. Received: " . json_encode($data));
    exit();
}

// Database connection
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

// Check connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare and execute the SQL statement to insert the new user
    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
    if ($stmt) {
        // Hash the password for security
        $passwordHash = password_hash($data["password"], PASSWORD_BCRYPT);
        
        // Bind parameters and execute
        $stmt->bind_param("ssss", $data["firstname"], $data["lastname"], $data["username"], $passwordHash);
        $stmt->execute();

        // Check if the user was added successfully
        if ($stmt->affected_rows > 0) {
            // Retrieve the ID of the newly inserted user
            $userID = $conn->insert_id;
            returnWithSuccess("User has been added", $userID);
        } else {
            returnWithError("Failed to add user");
        }

        $stmt->close();
    } else {
        returnWithError("Failed to prepare statement");
    }

    $conn->close();
}

// Function to get request data
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send JSON response
function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

// Function to handle errors
function returnWithError($err) {
    $retValue = json_encode(array(
        "id" => 0,
        "firstName" => "",
        "lastName" => "",
        "error" => $err
    ));
    sendResultInfoAsJson($retValue);
}

// Function to handle successful user creation
function returnWithSuccess($message, $userID) {
    $retValue = json_encode(array(
        "success" => $message,
        "id" => $userID
    ));
    sendResultInfoAsJson($retValue);
}
?>
