<?php 
	$hostname="liberty.starsonata.com";
	$port=3030;
	$socket=null;
	
	$connected=false;
	
	$connect=null;
	$userID=null;
	$message=null;
	
	$timeToWait=5;
	$timeToAFK=1800;
	
	$userList=[];
	$userSocketList=[];
	$userIPList=[];
	
	getArguments();
	
	set_time_limit(0);
	ignore_user_abort(true);
	
	function getArguments() {
		global $userID, $timeToWait;
		
		$userIDString=getArgument("userID");
		if($userIDString!=null) {
			$userID=(int)$userIDString;
			$messageString=getArgument("message");
			if($messageString!=null) {
				sendMessage($userID,$messageString);
			}
		}
		
		$ttwString=getArgument("ttw");
		if($ttwString!=null) {
			$timeToWait=(int)$ttwString;
		}
		
		$connectString=getArgument("connect");
		if($connectString!=null) {
			newUser();
		}
	}

	function openConnection() {
		global $hostname, $port;
		
		$socket=fsockopen($hostname, $port);
		
		return $socket;
	}
	
	function listener() {
		global $userList,$userSocketList,$userIPList,$port;
		
		$userCount=count($userList);
		
		for($i=0; $i < $userCount; $i++) {
			$userSocket=$userSocketList[$i];
			
			$file="";
		
			stream_set_timeout($userSocket, 1);
			$info = stream_get_meta_data($userSocket);

			while (!feof($userSocket) && !$info['timed_out']) {
				$file .= fgets($userSocket, 4096);
				$info = stream_get_meta_data($userSocket);
			}
			
			$message="messageresponse," . $file;
			
			$clientSocket=fsockopen($userIPList[$i],$port);
			
			fwrite($clientSocket,$message);
			
			fclose($clientSocket);
		}
	}
	
	function getNewUserID() {
		global $userList;
		
		return count($userList);
	}
	
	function newUser() {
		global $userList, $userSocketList, $userIPList;
		
		$newUserID=getNewUserID();
		$newUserIP=$_SERVER['REMOTE_ADDR'];
		
		$newUserSocket=openConnection();
		
		if($newUserSocket) {
			
			$userList[]=(string)$newUserID;
			$userSocketList[]=$newUserSocket;
			$userIPList[]=$newUserIP;
			
			echo "connection,success,".$newUserID;
		} else {
			echo "connection,failure";
		}
	}
	
	function sendMessage($message) {
		global $userID, $userList, $userSocketList, $timeToWait;
		
		$userSocket=$userSocketList[$userID];
		
		if($userSocket==null) {
			$userSocket=openConnection();
		}
		
		$actualString=hexToStr($message);
		
		fwrite($userSocket,$actualString);
	}
	
	function getArgument($argumentName) {
		if(isset($_GET[$argumentName])) {
			return $_GET[$argumentName];
		} else {
			return null;
		}
	}
	
	function strToHex($string){
		$hex = '';
		for ($i=0; $i<strlen($string); $i++){
			$ord = ord($string[$i]);
			$hexCode = dechex($ord);
			$hex .= substr('0'.$hexCode, -2);
		}
		return strToUpper($hex);
	}
	
	function hexToStr($hex){
		$string='';
		for ($i=0; $i < strlen($hex)-1; $i+=2){
			$string .= chr(hexdec($hex[$i].$hex[$i+1]));
		}
		return $string;
	}
?>