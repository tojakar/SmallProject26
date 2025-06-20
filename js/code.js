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
		document.getElementById("userName").innerHTML = firstName + " " + lastName;
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

	document.getElementById("FirstNameContact").value = "";
	document.getElementById("LastNameContact").value = "";
	document.getElementById("EmailContact").value = "";
	document.getElementById("PhoneNumContact").value = "";
	

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


	if (!document.getElementById("ContactsTableBody")) {
    document.getElementById("ContactsList").innerHTML = `
      <table id="ContactsTable">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Email</th>
			<th style="display:none;"></th>
            <th>Edit</th>
			<th>Delete</th>
          </tr>
        </thead>
        <tbody id="ContactsTableBody">
        </tbody>
      </table>
    `;
  	}
		try{
			if(xhr.status === 200){
				console.log(xhr.responseText);
				let jsonObject = JSON.parse(xhr.responseText);
				if(jsonObject.Error !== ""){
					console.log("error in json")
				}
				else{
					ContactsTableBody = document.getElementById("ContactsTableBody")
					for(let searchResults of jsonObject.Results){
						let row = document.createElement("tr");
						row.innerHTML = `
										<td class="contact_cell" style="text-align: center; padding: 8px;">${searchResults.FirstName}</td>
										<td class="contact_cell" style="text-align: center; padding: 8px;">${searchResults.LastName}</td>
										<td class="contact_cell" >${searchResults.Phone}</td>
										<td class="contact_cell" >${searchResults.Email}</td>
										<td style="display:none;""  >${searchResults.ID}</td>
										<td class="contact_button"> <button class="buttons" onclick="BeginEditingContact(this)" style = "font-size:14px; width: 100px; ">Edit</button>  </td>
 									  <td class="contact_button"> <button class="buttons" onclick="deleteContact(${searchResults.ID},this)" style = "font-size:14px; width: 100px; ">Delete</button> </td>
									`;
						ContactsTableBody.appendChild(row)
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

function deleteContact(ID, button)
{

	let tmp = {ID:ID};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/DeleteContact.' + extension;
	let xhr = new XMLHttpRequest();

	//removes deleted contacts
	let row = button.closest("tr");
	row.remove();

	
	xhr.open("POST", url, true);
	
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been deleted";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}


function BeginEditingContact(button){
	let row = button.closest("tr");
	let cols = row.querySelectorAll("td")

	for(let i = 0; i < 4; i++){
		let text = cols[i].textContent;
		cols[i].innerHTML = `<input type="text" value="${text}" id="Contact_Input">`;

	}
	button.textContent = "Save";
	button.onclick = () => EditContact(button);
}

function EditContact(button) {
	let row = button.closest("tr");
	let cols = row.querySelectorAll("td");

	// Retrieve values from inputs
	let firstName = cols[0].querySelector("input").value.trim();
	let lastName = cols[1].querySelector("input").value.trim();
	let phoneNum = cols[2].querySelector("input").value.trim();
	let email = cols[3].querySelector("input").value.trim();

	// Revert cells back to text
	cols[0].innerHTML = firstName;
	cols[1].innerHTML = lastName;
	cols[2].innerHTML = phoneNum;
	cols[3].innerHTML = email;

	let ID = cols[4].textContent.trim();  // ID is in the hidden <td>

	// Reset button
	button.textContent = "Edit";
	button.onclick = () => BeginEditingContact(button);

	// Send updated data to server
	let url = urlBase + '/EditContact.' + extension;
	let tmp = {
		FirstName: firstName,
		LastName: lastName,
		Phone: phoneNum,
		Email: email,
		UserID: userId,
		ID: parseInt(ID)
	};
	let jsonPayload = JSON.stringify(tmp);

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState === 4) {
				if (this.status === 200) {
					document.getElementById("contactEditResult").innerHTML = "Edits have been saved!";
				} else {
					document.getElementById("contactEditResult").innerHTML = "Failed to save changes.";
				}
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
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
	
