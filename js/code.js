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
	
