<?php
    $inData = getRequestInfo();
    $FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $Login = $inData["Login"];
    $Password = $inData["Password"];
	



	$conn = new mysqli("localhost", "Brayden", "password", "COP4331");	
	if($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else{
		try{
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) values (?, ?, ?, ?);");
			$stmt->bind_param("ssss", $inData["FirstName"], $inData["LastName"], $inData["Login"], $inData["Password"]);

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
		$retValue = array("error" => "" , "message" => "Account Created");
		sendResultInfoAsJson(json_encode($retValue));
	}

?>