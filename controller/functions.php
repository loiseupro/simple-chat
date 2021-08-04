<?php 

/** 
* Connect to database
* @param string $server     Server
* @param string $user     User
* @param string $password     Password
* @param string $db     Database name
*
* @return connection|bool
*/
function db_connect($server, $user, $password, $db){

	if (!($link = mysqli_connect($server,$user,$password))) exit("Database server connection error");
	if(!(mysqli_select_db($link,$db))) exit("Database connection error");

	return $link;
}

$db_connection = db_connect("localhost","root","","ada_chat");


/**
* Add user active
* @param array $param  
*
* @return bool    
*/
function setUserActive($param){

	if(!isset($param['id_chat']) OR !isset($param['id_user']) ) return false;

	global $db_connection;
	mysqli_query($db_connection, "SET NAMES 'utf8'" );
	$timestamp = date_timestamp_get(date_create());
	
	$query = "UPDATE chat_user SET last_user_active = ".$timestamp." WHERE id_chat = ".$param['id_chat']." AND id_user = ".$param['id_user'];
	if(!mysqli_query($db_connection,$query)) return false;

	return true;

}


/**
* Add chat line
* @param array $param 
*
* @return bool   
*/
function addLine($param){

	if(!isset($param['id_chat']) OR !isset($param['id_user']) OR !isset($param['msg'])) return false;

	global $db_connection;
	mysqli_query($db_connection, "SET NAMES 'utf8'" );
	
	$query = "INSERT INTO chat_line (id_chat, id_user, msg) VALUES ({$param['id_chat']}, {$param['id_user']}, '{$param['msg']}')";
	if(!mysqli_query($db_connection,$query)) return false;

	return true;

}


/**
* Get chat lines
* @param array $param 
*
* @return array 
*/
function getMsgFrom($param){

	if(!isset($param['id_from']) OR !isset($param['id_chat'])) return array();

	global $db_connection;
	mysqli_query($db_connection, "SET NAMES 'utf8'" );
	$data = array();

	$query="SELECT * FROM chat_line WHERE id_chat = ".$param["id_chat"]." AND id_line > ".$param['id_from'] . " ORDER BY id_line ASC";
	$result = mysqli_query($db_connection,$query);
	while($row = mysqli_fetch_array($result)) $data[] = $row;        
		
	return $data;

}


/**
* Get participants in chat
* @param array $param  
*
* @return array
*/
function getUsers($param){

	if(!isset($param['id_chat'])) return array();

	global $db_connection;
	mysqli_query($db_connection, "SET NAMES 'utf8'" );
	$data = array();

	$query="SELECT u.id_user, u.username, u.public_name, c.last_user_active FROM chat_user as c LEFT JOIN user as u ON c.id_user=u.id_user WHERE id_chat = ".$param["id_chat"];
	$result = mysqli_query($db_connection,$query);
	while($row = mysqli_fetch_array($result)) $data[] = $row;        
	
	return $data;

}


?>