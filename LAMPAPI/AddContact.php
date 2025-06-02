
<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("localhost", "Brayden", "password", "COP4331");	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("ssssi", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"]);
		try{
			$stmt->execute();
			returnWithInfo();
		}
		catch(Exception $e){
			returnWithError($e->getMessage());
		}
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = array("error" => $err , "message" => "");
		sendResultInfoAsJson(json_encode($retValue));
	}
	
	function returnWithInfo()
	{
		$retValue = array("error" => "" , "message" => "Contact Added");
		sendResultInfoAsJson(json_encode($retValue));
	}

?>
