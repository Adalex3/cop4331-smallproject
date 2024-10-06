const urlBase = 'http://contactmanager11.online/Backend';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let currentUser = null;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {username:login,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "Username/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

    // Store user in local storage
    localStorage.setItem('currentUser', login);
    currentUser = login;

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function addUser() {
    let newFirstName = document.getElementById("firstnameText").value;
    let newLastName = document.getElementById("lastnameText").value;
    let newUsername = document.getElementById("usernameText").value;
    let newPassword = document.getElementById("passwordText").value;
    document.getElementById("userAddResult").innerHTML = "";

    let tmp = { firstname: newFirstName, lastname: newLastName, username: newUsername, password: newPassword };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error && jsonObject.error === "Username already taken") {
                        document.getElementById("userAddResult").innerHTML = "Username is already taken. Please choose another one.";
                    } else {
                        document.getElementById("userAddResult").innerHTML = "User has been added";
                        window.location.href = "contacts.html";
                    }
                } else {
                    document.getElementById("userAddResult").innerHTML = "Error registering user. Please try again.";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("userAddResult").innerHTML = err.message;
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    console.log("Logged out, cookie cleared.");
    window.location.href = "login.html";
    currentUser = null;

    // Remove user from local storage   
    localStorage.removeItem('currentUser');
}

// Function to clear the edit form (for a new contact or resetsss)
function clearEditForm() {
    document.getElementById("input-name").value = "";
    document.getElementById("input-email").value = "";
    document.getElementById("input-phoneNum").value = "";
}

// Function to close the edit from
function closeEditForm() {
    document.getElementById("contact-info-edit").style.display = "none";
}

// Function to close contact info form
function closeContactInfo() {
    document.getElementById("contact-info").style.transform = "translateY(-150%)";
}

function openContact() {
    console.log("Add Contact button pressed.");
    document.getElementById("contact-info-edit").style.display = "flex"; // Show the form
    clearEditForm(); // Clear any previous data in the form
    console.log("Contact edit form fields have been cleared.");
}

function saveContact(){

    let name = document.getElementById("input-name").value;
    //let lastName = document.getElementById("input-lastname").value;
    let email = document.getElementById("input-email").value;
    let phoneNum = document.getElementById("input-phoneNum").value;

    contactData = {
        username: currentUser,
        name: name, 
        email: email,
        phonenumber: phoneNum
    };

    let xhr = new XMLHttpRequest();
    let url = urlBase + '/createContact.' + extension;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200){
            let response = JSON.parse(xhr.responseText);
            if (response.success){
                console.log("Contact added!");
                clearEditForm();
                closeEditForm();
                fetchContacts();
            } else if (response.error){
                console.error("Error: " + response.error);
            }
        }
    }

    xhr.send(JSON.stringify(contactData));

    }

function fetchContacts() {
    let xhr = new XMLHttpRequest();
    let url = urlBase + '/readContact.' + extension;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Raw Response:", xhr.responseText);  // Log raw response as a string

            let response = JSON.parse(xhr.responseText);  // Parse the JSON response
            console.log("Parsed Response:", response);  // Log the parsed JSON object
            console.log("Response Results: ", response.results);

            if (response) {
                addContactToList(response);
            } else if (response.error) {
                console.log("No results found or error:", response.error || "No error but no results");  // Log any error messages
            }
        }
    }

    // Hardcoding the username "currentUser"
    let payload = JSON.stringify({ username: currentUser });
    xhr.send(payload);
}

function addContactToList(contacts) {
    let contactList = document.getElementById("contact-list");
    contactList.innerHTML = ""; // Clear the list

    console.log("addContactToList function called with contacts:", contacts); // Log the contacts passed in

    contacts.forEach(contact => {
        console.log("Adding contact:", contact); // Log each contact
        let name = contact.Name;
        //let [firstName, lastName] = name.split(" ");
        let email = contact.Email;
        let phoneNumber = contact.phonenumber;
        let id = contact.ID;
        let username = contact.username;

        console.log(`Name: ${name}, Email: ${email}, Phone Number: ${phoneNumber}, ID: ${id}`);

        let newContact = document.createElement("div");
        newContact.classList.add("contact-info");

        newContact.innerHTML = `
            <div class="contact-details">

                <div>
                    <label>Name:</label>
                    <span id="edit-name-input" contentEditable="false">${name}</span><br>
                    <label>Email:</label>
                    <span id="edit-email-input" contentEditable="false">${email}</span><br>
                    <label>Phone Number:</label>
                    <span id="edit-phoneNum-input" contentEditable="false">${phoneNumber}</span>
                </div>
            <div class="actions">
                <a href="#" onclick="editContact('${name}', '${email}', '${phoneNumber}', '${id}', '${username}');">Edit</a><br>
                <a href="#" onclick="deleteContact('${username}', '${id}');">Delete</a>
                <button id="save-button" style="display: none;">Save</button>
            </div>
            </div>
        `;

        contactList.appendChild(newContact);
    });
}

window.onload = function() {
    fetchContacts(); // Fetch and display contacts on page load
    console.log("At OnLoad");

};

document.addEventListener("DOMContentLoaded", function() {
    currentUser = localStorage.getItem("currentUser");
    console.log("At DOMContentLoaded");
    console.log("Current user:", currentUser);
});

function editContact(name, email, phoneNum, id, username) {
    console.log("Edit Contact button pressed for:", name, email, phoneNum, id, username);

    // Make the edit form visible
    document.getElementById("edit-name-input").contentEditable = "true";
    // document.getElementById("edit-lastname-input").contentEditable = "true";
    document.getElementById("edit-email-input").contentEditable = "true";
    document.getElementById("edit-phoneNum-input").contentEditable = "true";

    // Show the save button
    document.getElementById("save-button").style.display = "block";

    document.getElementById("save-button").addEventListener("click", function() {
        const updatedName = document.getElementById("edit-name-input").textContent.trim();
        // const updatedLastName = document.getElementById("edit-lastname-input").textContent.trim();
        const updatedEmail = document.getElementById("edit-email-input").textContent.trim();
        const updatedPhoneNum = document.getElementById("edit-phoneNum-input").textContent.trim();
        console.log("New contact data:", updatedName, updatedEmail, updatedPhoneNum);

        // API call to update Contact PHP
        let xhr = new XMLHttpRequest();
        let url = urlBase + '/updateContact.' + extension;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                if (response) {
                    console.log("Contact updated!");
                    fetchContacts();
                } else if (response.error) {
                    console.error("Error: " + response.error);
                }
            }
        }
        let payload = JSON.stringify({ username: currentUser, id: id, name: updatedName, email: updatedEmail, phonenumber: updatedPhoneNum });
        xhr.send(payload);
    });
}

function deleteContact(username, contactID) {
    console.log("Delete Contact button pressed.");

    // API call to delete Contact PHP
    let xhr = new XMLHttpRequest();
    let url = urlBase + '/deleteContact.' + extension;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (response) {
                console.log("Contact deleted!");
                fetchContacts();
            } else if (response.error) {
                console.error("Error: " + response.error);
            }
        }
    }
    let payload = JSON.stringify({ username: currentUser, id: contactID });
    xhr.send(payload);
}


const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", doSearch);
function doSearch(event){
    event.preventDefault();
    let search = document.getElementById("search-input").value;
    if (search === "") {
        fetchContacts();
        return;
    }

    let xhr = new XMLHttpRequest();
    let url = urlBase + '/readContact.' + extension;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (response) {
                addContactToList(response);
            } else if (response.error) {
                console.error("Error: " + response.error);
            }
        }
    }

    let payload = JSON.stringify({ username: currentUser, search: search });
    xhr.send(payload);
}