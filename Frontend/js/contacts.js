// Load the contacts from the database

const contactsList = document.querySelector("#contacts");
const contactInfo = document.querySelector("#contact-info");

const templateButton = document.querySelector("#contact-button-template");

const placeholderText = document.getElementById("placeholder-text");

const xButton = document.querySelector(".x-button");


function createAndAssignButton(firstName,lastName,email) {

    const newButton = templateButton.cloneNode(true);

    newButton.style.display = '';

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
}


xButton.addEventListener('click',function(){
    contactInfo.style.opacity = '0';
})