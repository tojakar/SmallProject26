<?php
    $inData = getRequestInfo();

	$conn = new mysqli("localhost", "Brayden", "password", "COP4331");	
	if($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else{
		try{
			$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
			$stmt->bind_param("i", $inData["ID"]);

			if($stmt->execute()){
				returnWithInfo();
			}
			else{
				returnWithError($stmt->error);
			}
			$stmt->close();
			$conn->close();
		}
		catch(Exception $e){
			returnWithError($e->getMessage());
		}	


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
		$retValue = array("error" => "" , "message" => "Contact Deleted");
		sendResultInfoAsJson(json_encode($retValue));
	}

?>