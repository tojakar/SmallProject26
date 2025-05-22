<?php
    $inData = getRequestInfo();
	
	$conn = new mysqli("localhost", "Brayden", "password", "COP4331");	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = ? ,LastName = ?,Phone = ?,Email = ?,UserID = ? WHERE (ID = ? AND UserID = ?)");
		$stmt->bind_param("ssssiis", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"], $inData["ID"], $inData["UserID"]);
		try{
			$stmt->execute();
			if($stmt->affected_rows > 0){
                returnWithInfo();
            }
            else{
                returnWithError("Contact Was Not Found/Contact Was Not Changed");
            }
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
		$retValue = array("error" => "" , "message" => "Contact Info Updated");
		sendResultInfoAsJson(json_encode($retValue));
	}

?>