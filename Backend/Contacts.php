<?php

$data = getRequestInfo();

$conn = new mysqli("localhost", "root", "qUJ@lHgJrNi1", "contactManager");

function getRequestInfo() 
{
    return json_decode(file_get_contents('php://input'), true);
}