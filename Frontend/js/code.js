const urlBase = 'http://contactmanager11.online/Backend';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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
}

// Function to clear the edit form (for a new contact or reset)
function clearEditForm() {
    document.getElementById("input-firstname").value = "";
    document.getElementById("input-lastname").value = "";
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

    let firstName = document.getElementById("input-firstname").value;
    let lastName = document.getElementById("input-lastname").value;
    let email = document.getElementById("input-email").value;
    let phoneNum = document.getElementById("input-phoneNum").value;

    contactData = {
        username: "afetyko",
        name: firstName + " " + lastName,
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

    // Hardcoding the username "afetyko"
    let payload = JSON.stringify({ username: "fdggfdsf" });
    xhr.send(payload);
}

function addContactToList(contacts) {
    let contactList = document.getElementById("contact-list");
    contactList.innerHTML = ""; // Clear the list

    console.log("addContactToList function called with contacts:", contacts); // Log the contacts passed in

    contacts.forEach(contact => {
        console.log("Adding contact:", contact); // Log each contact

        let newContact = document.createElement("div");
        newContact.classList.add("contact-info");
        let nameParts = contact.Name.split(" "); // Note the capital 'N' in 'Name'
        let firstName = nameParts[0]; // Get the first name
        let lastName = nameParts.slice(1).join(" "); // Get the last name

        newContact.innerHTML = `
            <div>
                <h3>${firstName} ${lastName}</h3>
                <p>${contact.Email}</p>
                <p>${contact.phonenumber}</p>
            </div>
            <div class="actions">
                <a href="#" onclick="editContact('${firstName}', '${lastName}', '${contact.Email}', '${contact.phonenumber}')">Edit</a>
                <a href="#" style="color:red;" onclick="deleteContact(this)">Delete</a>
            </div>
        `;

        contactList.appendChild(newContact);
    });
}

window.onload = function() {
    fetchContacts(); // Fetch and display contacts on page load
    console.log("At OnLoad");
};
