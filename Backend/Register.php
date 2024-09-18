<?php

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
    exit();  // Exit after sending the error
}

// Function to handle successful user creation
function returnWithSuccess($message, $userID) {
    $retValue = json_encode(array(
        "success" => $message,
        "id" => $userID
    ));
    sendResultInfoAsJson($retValue);
}

// Retrieve the JSON input data
$data = getRequestInfo();

// Check if required data is provided
if (!isset($data['firstname'], $data['lastname'], $data['username'], $data['password'])) {
    returnWithError("Missing required fields");
    exit();
}

// Database connection
$conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

// Check connection
if ($conn->connect_error) {
    returnWithError("Connection failed: " . $conn->connect_error);
} else {
    // Prepare and execute the SQL statement to insert the new user
    $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
    
    if ($stmt === false) {
        // Debugging SQL preparation errors
        returnWithError("SQL Error: " . $conn->error);
    } else {
        // Hash the password for security
        $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);
        
        // Bind parameters and execute
        $stmt->bind_param("ssss", $data['firstname'], $data['lastname'], $data['username'], $passwordHash);

        if ($stmt->execute()) {
            // Retrieve the ID of the newly inserted user
            $userID = $conn->insert_id;
            returnWithSuccess("User registered successfully", $userID);
        } else {
            // Return the error if the execution failed
            returnWithError("Failed to add user: " . $stmt->error);
        }

        $stmt->close();
    }

    $conn->close();
}
?>
