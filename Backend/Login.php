<?php

    $inData = getRequestInfo();
    
    $id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli("127.0.0.1", "badridemo", "badridemo1", "contactManager");

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        // Prepare and execute the SQL statement to get the user
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login=?");
        $stmt->bind_param("s", $inData["login"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            // Verify the password
            if (password_verify($inData["password"], $row['Password'])) {
                returnWithInfo($row['FirstName'], $row['LastName'], $row['ID']);
            } else {
                returnWithError("Invalid login credentials");
            }
        } else {
            returnWithError("No Records Found");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err) {
        $retValue = json_encode(array(
            "id" => 0,
            "firstName" => "",
            "lastName" => "",
            "error" => $err
        ));
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($firstName, $lastName, $id) {
        $retValue = json_encode(array(
            "id" => $id,
            "firstName" => $firstName,
            "lastName" => $lastName,
            "error" => ""
        ));
        sendResultInfoAsJson($retValue);
    }
?>
