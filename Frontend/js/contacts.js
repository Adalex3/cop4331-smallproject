// Load the contacts from the database

const contactsList = document.querySelector("#contacts");
const contactInfo = document.querySelector("#contact-info");

const templateButton = document.querySelector("#contact-button-template");

const placeholderText = document.getElementById("placeholder-text");

const xButton = document.querySelector(".x-button:not(.add)");
const addButton = document.querySelector(".x-button.add");

contacts = []
currentVisibleContact = -1


function createAndAssignButton(firstName,lastName,email) {

    const newButton = templateButton.cloneNode(true);

    newButton.style.display = '';

    contacts.push({"firstName":firstName,"lastName":lastName,"email":email});

    newButton.setAttribute("data-firstname",firstName);
    newButton.setAttribute("data-lastname",lastName);
    newButton.setAttribute("data-email",email);

    newButton.firstChild.textContent = firstName + " " + lastName;

    console.log(contactsList);
    console.log(newButton);

    contactsList.appendChild(newButton);

    newButton.addEventListener('click', function(e){
        buttonClicked(e.currentTarget); // Pass the button itself
    });

    placeholderText.style.display = 'none';

}

// Just for testing
createAndAssignButton("Alex","Hynds","hynds@ucf.edu");
createAndAssignButton("Ryan","Rohan","rohan@ucf.edu");
createAndAssignButton("Other","Person","person@ucf.edu");
createAndAssignButton("Another","Human","human@ucf.edu");


const detailFirstName = document.querySelector("#detail-firstname");
const detailLastName = document.querySelector("#detail-lastname");
const detailEmail = document.querySelector("#detail-email");

function buttonClicked(button) {
    const firstName = button.getAttribute("data-firstname");
    const lastName = button.getAttribute("data-lastname");
    const email = button.getAttribute("data-email");

    detailFirstName.textContent = firstName;
    detailLastName.textContent = lastName;
    detailEmail.textContent = email;

    contactInfo.style.opacity = '1';
    contactInfo.style.transform = '';

    // Find and set currently visible contact
    var i=0;
    contacts.forEach(element => {
        if(element.firstName == firstName && element.lastName == lastName && element.email == email) {
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
}

var editing = false;

const editDiv = document.getElementById("contact-info-edit");

function editContact() {
    const contact = contacts[currentVisibleContact];
    console.log("Editing contact with name " + contact.firstName + " " + contact.lastName + ", and email " + contact.email);

    editing = true;
    editDiv.style.display = "block";
    contactInfo.style.display = "none";
    editDiv.style.opacity= "1";
}



// Add support

addButton.addEventListener('click',function(){ addContact() });

function addContact() {
    console.log("Adding contact");
}