<?php

	$inData = getRequestInfo();
	
	$resultsArray = array();
	$searchCount = 0;

	$conn = new mysqli("localhost", "Brayden", "password", "COP4331");	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// $stmt = $conn->prepare("SELECT * FROM Contacts where UserID=? AND ID > ? AND (FirstName like ? OR LastName like ?) LIMIT 2");
		// $searchTerm = "%" . $inData["Search"] . "%";
		// $stmt->bind_param("siss", $inData["UserID"], $inData["PrevID"], $searchTerm, $searchTerm);
		// $stmt->execute();

		// the follow returns all contacts when searchbar is empty
		// return a specific contact when search for
		$searchTerm = "%" . $inData["Search"] . "%";

		if (trim($inData["Search"]) == "") {
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=?");
			$stmt->bind_param("s", $inData["UserID"]);
		} else {
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? AND ID > ? AND (FirstName LIKE ? OR LastName LIKE ?) LIMIT 2");
			$stmt->bind_param("siss", $inData["UserID"], $inData["PrevID"], $searchTerm, $searchTerm);
		}

		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			$searchCount++;
			$searchResults = array(
				'FirstName' => $row["FirstName"],
				'LastName' => $row["LastName"],
				'Phone' => $row["Phone"],
				'Email' => $row["Email"],
				'ID' => $row["ID"]
			);
			$resultsArray[] = $searchResults;
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Contacts Found" );
		}
		else
		{
			returnWithInfo( $resultsArray );
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
		$retValue = array(
			'Results' => array(
				'FirstName' => "",
				'LastName' => "",
				'Phone' => "",
				'Email' => "",
				'ID' => 0,
				
			),
			'Error' => $err
			);
		$retValue = json_encode($retValue);
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $returnJson )
	{
		$retValue = array('Results' => $returnJson, 'Error' => "");
		$retValue = json_encode($retValue);
		sendResultInfoAsJson( $retValue );
	}
	
?>