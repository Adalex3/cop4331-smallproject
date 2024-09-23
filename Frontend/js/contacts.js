// Load the contacts from the database

const contactsList = document.querySelector("#contacts");
const contactInfo = document.querySelector("#contact-info");

const templateButton = document.querySelector("#contact-button-template");

const placeholderText = document.getElementById("placeholder-text");

const xButton = document.querySelector(".x-button:not(.add)");
const addButton = document.querySelector(".x-button.add");

contacts = []
currentVisibleContact = -1

var buttonCount = 0;
function createAndAssignButton(firstName,lastName,email) {

    const newButton = templateButton.cloneNode(true);

    newButton.style.display = '';

    const localButtonCount = buttonCount;

    contacts.push({"firstName":firstName,"lastName":lastName,"email":email,"id":localButtonCount});

    newButton.firstChild.textContent = firstName + " " + lastName;

    console.log(contactsList);
    console.log(newButton);

    contactsList.appendChild(newButton);

    newButton.setAttribute("data-id",localButtonCount);
    newButton.classList.toggle("added",true);

    newButton.addEventListener('click', function(e){
        buttonClicked(localButtonCount);
    });

    placeholderText.style.display = 'none';

    buttonCount++;

}


const detailFirstName = document.querySelector("#detail-firstname");
const detailLastName = document.querySelector("#detail-lastname");
const detailEmail = document.querySelector("#detail-email");

function buttonClicked(buttonNumber) {


    let contact = contacts.find(contact => contact.id === buttonNumber);

    detailFirstName.textContent = contact.firstName;
    detailLastName.textContent = contact.lastName;
    detailEmail.textContent = contact.email;

    contactInfo.style.opacity = '1';
    contactInfo.style.transform = '';

    // Find and set currently visible contact
    var i=0;
    contacts.forEach(element => {
        if(element.firstName == contact.firstName && element.lastName == contact.lastName && element.email == contact.email) {
            currentVisibleContact = i;
            return;
        }
        i++;
    });

}


xButton.addEventListener('click',function(){
    contactInfo.style.opacity = '0';
    contactInfo.style.transform = 'translateY(150%) rotate(40deg)';

    setTimeout(function(){
        contactInfo.style.transform = 'translateY(-150%)';
    },500);
})



// Editing and deleting support

const editButton = document.getElementById("edit-contact").addEventListener('click',function(){
    editContact();
});
const deleteButton = document.getElementById("delete-contact").addEventListener('click',function(){
    deleteContact();
});


function deleteContact() {
    const contact = contacts[currentVisibleContact];
    console.log("Deleting contact with name " + contact.firstName + " " + contact.lastName + ", and email " + contact.email);


    // Delete from the list
    const listButtons = document.querySelectorAll("#contacts a#contact-button-template");
    console.log(listButtons);

    const buttonToEdit = listButtons[currentVisibleContact+1]; // there is a template button that is first, skip that
    buttonToEdit.remove();
    contacts.splice(currentVisibleContact,1);
    currentVisibleContact = -1;

    // Hide the contact div
    contactInfo.style.opacity = '0';
    contactInfo.style.transform = 'translateY(150%) rotate(40deg)';

    setTimeout(function(){
        contactInfo.style.transform = 'translateY(-150%)';
    },500);

    // TODO: ADD THE API ENDPOINT FOR DELETING A CONTACT HERE
    const data = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }

    fetch('Backend/deleteContact.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success){
            console.log(result.success)
        } else if (result.error){
            console.log(result.error)
        }
    })
    .catch(error => console.error('Error:', error))
}

var editing = false;
adding = false;

const saveButton = document.getElementById("save-contact");
const editDiv = document.getElementById("contact-info-edit");

const firstNameInput = document.getElementById('input-firstname');
const lastNameInput = document.getElementById('input-lastname');
const emailInput = document.getElementById('input-email');

function editContact() {
    const contact = contacts[currentVisibleContact];
    console.log("Editing contact with name " + contact.firstName + " " + contact.lastName + ", and email " + contact.email);

    editing = true;
    editDiv.style.display = "flex";
    contactInfo.style.display = "none";
    editDiv.style.opacity= "1";

    if(adding) {
        saveButton.textContent = "Add Contact";
    } else {
        saveButton.textContent = "Save";
    }

    firstNameInput.value = contact.firstName;
    lastNameInput.value = contact.lastName;
    emailInput.value = contact.email;
}

saveButton.addEventListener('click',function(){

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;

    if(adding) {
        addContact(firstName,lastName,email);
    } else {
        // SAVE CONTACT
        // TODO: THIS IS WHERE THE API ENDPOINT NEEDS TO GO FOR UPDATING
    }

    contacts[currentVisibleContact].firstName = firstName;
    contacts[currentVisibleContact].lastName = lastName;
    contacts[currentVisibleContact].email = email;

    editDiv.style.display = "none";
    contactInfo.style.display = "flex";
    editDiv.style.opacity= "0";
    contactInfo.style.opacity= "1";

    buttonClicked(contacts[currentVisibleContact].id);

    // Also update the list text
    const listButtons = document.querySelectorAll("#contacts a#contact-button-template");
    if(!adding) {
        const buttonToEdit = listButtons[currentVisibleContact+1]; // there is a template button that is first, skip that
        buttonToEdit.firstChild.textContent = firstName + " " + lastName;
    } else {
        // Add to list
        createAndAssignButton(firstName,lastName,email);
    }

    adding = false;
    editing = false;

});



// Add support

addButton.addEventListener('click',function(){

    adding = true;
    contacts.push({"firstName":"","lastName":"","email":""});
    currentVisibleContact = contacts.length-1;
    editContact();

});

function addContact(firstName, lastName, email) {
    console.log("Adding contact");

    // The data to be sent to the API
    const data = {
        firstName: firstName,
        lastName: lastName,
        email: email
    };

    // Make a POST request to the add_contact.php API
    fetch('Backend/createContact.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log(result.success);
            // Optionally, refresh the contact list or update the UI
        } else if (result.error) {
            console.error(result.error);
        }
    })
    .catch(error => console.error('Error:', error));
}






// Just for testing
createAndAssignButton("Alex","Hynds","hynds@ucf.edu");
createAndAssignButton("Ryan","Rohan","rohan@ucf.edu");
createAndAssignButton("Other","Person","person@ucf.edu");
createAndAssignButton("Another","Human","human@ucf.edu");
// TODO: THIS IS WHERE THE API ENDPOINT NEEDS TO GO FOR FETCHING CONTACTS


// Search form handling
const searchForm = document.querySelector('.search-container form');
searchForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from submitting and refreshing the page
    const query = e.target.query.value.trim();
    
    if (query) {
        searchContacts(query);
    }
});

function searchContacts(query) {
    // Clear current list
    const contactButtons = document.querySelectorAll("#contacts a.added");
    contactButtons.forEach(button => button.remove());

    placeholderText.style.display = 'block'; // Show placeholder initially

    // TODO: Fetch contacts from the API based on the search query
    // USE THIS FUNCTION FOR IT
    function dataCollected(contact) {
        placeholderText.style.display = 'none';
        data.forEach(contact => {
            createAndAssignButton(contact.firstName, contact.lastName, contact.email);
        });
    }
    
}