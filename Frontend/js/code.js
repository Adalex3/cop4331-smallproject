const urlBase = 'http://contactmanager11.online/Backend';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    console.log(`Login: ${login}, Password: ${password}`);
    // var hash = md5(password);

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { login: login, password: password };
    // var tmp = { login: login, password: hash };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;
    console.log(`Request URL: ${url}`);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        console.log(`Ready State: ${xhr.readyState}, Status: ${xhr.status}`);
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(`Response Text: ${xhr.responseText}`);
                try {
                    let jsonObject = JSON.parse(xhr.responseText);
                    console.log(`Parsed Response:`, jsonObject);
                    userId = jsonObject.id;

                    if (userId < 1) {
                        document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                        console.log("User/Password combination incorrect");
                        return;
                    }

                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    console.log(`User ID: ${userId}, First Name: ${firstName}, Last Name: ${lastName}`);
                    saveCookie();

                    window.location.href = "contacts.html";
                } catch (e) {
                    console.error("Error parsing JSON response:", e);
                    document.getElementById("loginResult").innerHTML = "Error parsing server response.";
                }
            } else {
                console.error(`HTTP Error: ${xhr.status} ${xhr.statusText}`);
                document.getElementById("loginResult").innerHTML = "Server responded with an error.";
            }
        }
    };

    xhr.onerror = function() {
        console.error("Request error");
        document.getElementById("loginResult").innerHTML = "Request failed.";
    };

    console.log("Sending request:", jsonPayload);
    xhr.send(jsonPayload);
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
    console.log("Cookie saved:", document.cookie);
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    console.log("Cookie data:", data);
    let splits = data.split(",");
    for (let i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] === "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] === "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] === "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        console.log("User ID is invalid, redirecting to login page.");
        window.location.href = "login.html";
    } else {
        console.log(`Logged in as ${firstName} ${lastName}`);
        // document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    console.log("Logged out, cookie cleared.");
    window.location.href = "index.html";
}
