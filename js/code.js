const urlBase = 'LAMPAPI';
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
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	//let tmp = {login:login,password:password};
	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState === 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "Contacts.html";
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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let newFirstName = document.getElementById("FirstNameContact").value;
	let newLastName = document.getElementById("LastNameContact").value;
	let newEmail = document.getElementById("EmailContact").value;
	let newPhoneNum = document.getElementById("PhoneNumContact").value;

	if (newFirstName == "" || newLastName == "" || newEmail == "" || newPhoneNum == "")
	{
		document.getElementById("contactAddResult").innerHTML = "All fields are required. Please fill them all out.";
		return;
	}
	document.getElementById("contactAddResult").innerHTML = "";

	let jsonPayload = '{"FirstName" : "' +newFirstName + '", "LastName" : "' + newLastName + '", "Email" : "' + newEmail + '", "Phone" : "' + newPhoneNum + '", "UserID" : "' + userId + '"}';
	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
  	document.getElementById("ContactsList").innerHTML = "";
	let PrevID = 0;
	let contactList = "";

	let tmp = {Search:srch,UserID:userId,PrevID:PrevID};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	xhr.onload = function(){
		try{
			if(xhr.status === 200){
				console.log(xhr.responseText);
				let jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.Error !== ""){
					console.log("error in json")
				}
				else{
					for(let searchResults of jsonObject.Results){
						let contact = '<p style="text-align: center;">'+ searchResults.FirstName + '|' + searchResults.LastName + '|' + searchResults.Phone + '|' + searchResults.Email + '</p>';	
						document.getElementById("ContactsList").innerHTML += contact;
					}
				}
			}
		}
		catch(err){
			console.log("error");
		}
	}
	xhr.send(jsonPayload);
}

function EditContact(){
	let firstName = document.getElementById("FirstNameContact").value;
	let lastName = document.getElementById("LastNameContact").value;
	let email = document.getElementById("EmailContact").value;
	let phoneNum = document.getElementById("PhoneNumContact").value;
	let jsonPayload = '{"FirstName" : "' +firstName + '", "LastName" : "' + lastName + '", "Email" : "' + email + '", "Phone" : "' + phoneNum + '", "UserID" : "' + userId + '"}';

	let updatedContact = {firstName, lastName, email, phoneNum, userId};

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState === 4 && this.status === 200)
			{
				document.getElementById("contactEditResult").innerHTML = "Edits have been saved!";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactEditResult").innerHTML = err.message;
	}
}
function CreateAccount(){
	//creates url to send XMLHttpRequest to and gets all account info from html inputs
	let url = urlBase + '/CreateAccount.' + extension;
	let FirstName = document.getElementById("FirstName").value;
	let LastName = document.getElementById("LastName").value;
	let Login = document.getElementById("Username").value;
	let Password = document.getElementById("Password").value;
	var HashedPassword = md5( Password );

	//turns all account info into json
	let tmp = {FirstName:FirstName, LastName:LastName, Login:Login, Password:HashedPassword};
	let jsonPayload = JSON.stringify(tmp);

	const xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onload = function(){
		try{
			console.log(xhr.response);
			if(xhr.status === 200){
				let jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.message === "Account Created"){
					window.location.href = "index.html";
				}
				else{
					document.getElementById("CreateAccountError").innerHTML = jsonObject.error;
				}
			}
		}
		catch(err){
			document.getElementById("CreateAccountError").innerHTML = err.message;
		}
	};
	xhr.send(jsonPayload);
}


function displayContacts(searchTerm = "") {
    const contactListDiv = document.getElementById('contactList');
    // Show a loading message while contacts are being fetched
    contactListDiv.innerHTML = '<p class="text-center text-gray-500">Loading contacts...</p>'; 

    // Clear previous feedback messages from add/edit operations
    document.getElementById("contactAddResult").innerHTML = "";
    document.getElementById("contactEditResult").innerHTML = "";
    // Remove any success/error styling classes
    document.getElementById("contactAddResult").classList.remove('text-red-600', 'text-green-600');
    document.getElementById("contactEditResult").classList.remove('text-red-600', 'text-blue-600', 'text-green-600');

    // Prepare the JSON payload for the SearchContacts API
    let tmp = {Search: searchTerm, UserID: userId};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() { // Use onload for consistent success/error handling
        try {
            if (xhr.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                
                // Check for an 'error' field in the API response
                if (jsonObject.error && jsonObject.error !== "") {
                    contactListDiv.innerHTML = `<p class="text-center text-red-500">Error: ${jsonObject.error}</p>`;
                } else {
                    // Store the fetched contacts globally.
                    // Assuming your API returns an array named 'Results' (capital R).
                    contacts = jsonObject.Results || []; 

                    contactListDiv.innerHTML = ''; // Clear the loading message and previous contacts

                    // If no contacts are found (either initially or after a search)
                    if (contacts.length === 0) {
                        contactListDiv.innerHTML = `<p class="text-center text-gray-500">
                            ${searchTerm ? "No matching contacts found." : "No contacts found. Add some above!"}
                        </p>`;
                        return; // Exit the function
                    }

                    // Iterate through the fetched contacts and render each one
                    contacts.forEach(contact => {
                        const contactDiv = document.createElement('div');
                        contactDiv.classList.add('contact-item'); // Apply CSS class for styling
                        // Store the contact's ID as a data attribute for easy access (e.g., for editing/deleting)
                        contactDiv.setAttribute('data-id', contact.ID); 

                        // Populate the inner HTML with contact details and action buttons
                        // The format is: Name, Phone, Email, Edit Button, Delete Button
                        contactDiv.innerHTML = `
                            <h3>${contact.FirstName} ${contact.LastName}</h3>
                            <p>Phone: ${contact.Phone}</p>
                            <p>Email: ${contact.Email}</p>
                            <div class="contact-actions">
                                <button class="buttons" onclick="editContact('${contact.ID}')">Edit</button>
                                <button class="buttons" onclick="confirmDelete('${contact.ID}')">Delete</button>
                            </div>
                        `;
                        contactListDiv.appendChild(contactDiv); // Add the contact div to the list container
                    });
                }
            } else {
                // Handle non-200 HTTP statuses from the server
                contactListDiv.innerHTML = `<p class="text-center text-red-500">Failed to load contacts. Server responded with status: ${xhr.status}</p>`;
            }
        } catch(err) {
            // Handle JSON parsing errors or other runtime errors
            console.error("Error parsing contacts response:", err);
            contactListDiv.innerHTML = '<p class="text-center text-red-500">Error loading contacts.</p>';
        }
    };
    xhr.onerror = function() { // Handle network errors during the request
        contactListDiv.innerHTML = '<p class="text-center text-red-500">Network error while fetching contacts.</p>';
    };
    xhr.send(jsonPayload); // Send the request
}

function confirmDelete(contactId) {
    // Find the contact details to display in the confirmation message
    const contactToDelete = contacts.find(c => c.ID === contactId);
    if (!contactToDelete) {
        console.error("Contact not found for deletion confirmation.");
        document.getElementById("contactEditResult").innerHTML = "Error: Contact not found for deletion.";
        document.getElementById("contactEditResult").classList.add('text-red-600');
        return;
    }

    // Create the modal overlay and content dynamically
    const modal = document.createElement('div');
    modal.classList.add('fixed', 'inset-0', 'bg-gray-600', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'z-50');
    modal.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
            <p class="text-lg font-semibold mb-6">Are you sure you want to delete ${contactToDelete.FirstName} ${contactToDelete.LastName}?</p>
            <div class="flex justify-center gap-4">
                <button id="confirmDeleteBtn" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">Delete</button>
                <button id="cancelDeleteBtn" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal); // Add the modal to the document body

    // Attach event listeners to the modal buttons
    document.getElementById('confirmDeleteBtn').onclick = () => {
        deleteContact(contactId); // If confirmed, call deleteContact
        document.body.removeChild(modal); // Remove the modal from the DOM
    };

    document.getElementById('cancelDeleteBtn').onclick = () => {
        document.body.removeChild(modal); // If canceled, just remove the modal
    };
}

/**
 * Sends an XMLHttpRequest to delete a contact via a DeleteContact API.
 * This assumes you have a `DeleteContact.php` endpoint that accepts ContactID and UserID.
 * @param {string} contactId - The ID of the contact to delete.
 */
function deleteContact(contactId) {
    const contactEditResultSpan = document.getElementById("contactEditResult");

    // Prepare JSON payload for the DeleteContact API
    let jsonPayload = `{"ID": "${contactId}", "UserID": "${userId}"}`;
    let url = urlBase + '/DeleteContact.' + extension; // Assuming this endpoint exists

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onload = function() {
        try {
            if (xhr.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) { // Check for an 'error' field in the API response
                    contactEditResultSpan.innerHTML = `Error deleting contact: ${jsonObject.error}`;
                    contactEditResultSpan.classList.add('text-red-600');
                } else {
                    contactEditResultSpan.innerHTML = "Contact deleted successfully!";
                    contactEditResultSpan.classList.add('text-green-600'); // Use green for delete success
                    displayContacts(); // Refresh the contact list after deletion
                }
            } else {
                contactEditResultSpan.innerHTML = `Failed to delete contact. Server responded with status: ${xhr.status}`;
                contactEditResultSpan.classList.add('text-red-600');
            }
        } catch(err) {
            console.error("Error parsing delete contact response:", err);
            contactEditResultSpan.innerHTML = `Error: ${err.message}`;
            contactEditResultSpan.classList.add('text-red-600');
        }
    };
    xhr.onerror = function() {
        contactEditResultSpan.innerHTML = "Network error deleting contact.";
        contactEditResultSpan.classList.add('text-red-600');
    };
    xhr.send(jsonPayload); // Send the delete contact request
}

/**
 * Helper function to clear the contact input form and reset the "Add/Update" button.
 */
function clearContactForm() {
    document.getElementById("FirstNameContact").value = '';
    document.getElementById("LastNameContact").value = '';
    document.getElementById("PhoneNumContact").value = '';
    document.getElementById("EmailContact").value = '';
    
    currentEditContactId = null; // Reset to "Add" mode
    const addOrUpdateButton = document.getElementById("addOrUpdateButton");
    addOrUpdateButton.textContent = "Add"; // Change button text back to "Add"
    addOrUpdateButton.classList.remove('bg-blue-500', 'hover:bg-blue-600'); // Remove update styling
    addOrUpdateButton.classList.add('bg-green-500', 'hover:bg-green-600'); // Add add styling
}

/**
 * Checks if the current user has any contacts. If not, it adds 5 predefined contacts.
 * This function uses asynchronous XMLHttpRequest wrapped in Promises to ensure
 * operations complete before proceeding.
 */
async function seedContactsIfEmpty() {
    console.log("Checking if user has existing contacts for seeding...");

    // First, check if the user already has contacts by performing a search
    const searchPayload = JSON.stringify({ Search: "", UserID: userId });
    const searchUrl = urlBase + '/SearchContacts.' + extension;

    try {
        const hasContacts = await new Promise((resolve, reject) => {
            const searchXhr = new XMLHttpRequest();
            searchXhr.open("POST", searchUrl, true); // true for async
            searchXhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
            searchXhr.onload = function() {
                if (searchXhr.status === 200) {
                    const searchResponse = JSON.parse(searchXhr.responseText);
                    // Resolve with true if results exist and are not empty, false otherwise
                    resolve(searchResponse.Results && searchResponse.Results.length > 0);
                } else {
                    console.error(`Error checking contacts (status ${searchXhr.status}): ${searchXhr.responseText}`);
                    resolve(false); // Assume no contacts or error, proceed with seeding
                }
            };
            searchXhr.onerror = function() {
                console.error("Network error checking for existing contacts.");
                resolve(false); // Assume no contacts or error, proceed with seeding
            };
            searchXhr.send(searchPayload);
        });

        if (hasContacts) {
            console.log("User already has contacts. Skipping seeding.");
            return; // Don't seed if contacts already exist
        }

    } catch (error) {
        console.error("Unexpected error during initial contact check:", error);
        // If an error occurs during the check, we might still want to try seeding
        // to ensure the user gets some initial contacts.
    }

    console.log("No contacts found. Seeding with 5 default contacts...");

    // Define the 5 default contacts with placeholder information
    const defaultContacts = [
        { FirstName: "Teammate 1", LastName: "NA", Email: "NA", Phone: "NA" },
        { FirstName: "Teammate 2", LastName: "NA", Email: "NA", Phone: "NA" },
        { FirstName: "Teammate 3", LastName: "NA", Email: "NA", Phone: "NA" },
        { FirstName: "Teammate 4", LastName: "NA", Email: "NA", Phone: "NA" },
        { FirstName: "Teammate 5", LastName: "NA", Email: "NA", Phone: "NA" }
    ];

    // Loop through each default contact and add it to the database
    for (const contact of defaultContacts) {
        const addPayload = JSON.stringify({
            FirstName: contact.FirstName,
            LastName: contact.LastName,
            Email: contact.Email,
            Phone: contact.Phone,
            UserID: userId
        });
        const addUrl = urlBase + '/AddContact.' + extension;

        try {
            await new Promise((resolve, reject) => {
                const addXhr = new XMLHttpRequest();
                addXhr.open("POST", addUrl, true);
                addXhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
                addXhr.onload = function() {
                    if (addXhr.status === 200) {
                        const response = JSON.parse(addXhr.responseText);
                        if (response.error) {
                            console.error(`Error adding contact ${contact.FirstName}: ${response.error}`);
                            reject(new Error(response.error));
                        } else {
                            console.log(`Successfully added contact: ${contact.FirstName}`);
                            resolve();
                        }
                    } else {
                        console.error(`Failed to add contact ${contact.FirstName}. Status: ${addXhr.status}`);
                        reject(new Error(`Status: ${addXhr.status}`));
                    }
                };
                addXhr.onerror = function() {
                    console.error(`Network error adding contact ${contact.FirstName}.`);
                    reject(new Error("Network error"));
                };
                addXhr.send(addPayload);
            });
        } catch (error) {
            console.error(`Failed to seed contact ${contact.FirstName}:`, error);
            // Continue to try adding other contacts even if one fails
        }
    }
    console.log("Seeding complete.");
}