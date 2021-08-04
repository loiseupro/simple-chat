<?php 
include 'functions.php';

if( isset($_POST["function"]) ){
	switch ($_POST["function"]) {
		case 'addLine':
		$data = addLine($_POST);
		break;

		case 'getLine':
		$data = getMsgFrom($_POST);
		break;

		case 'getUsers':
		$data = getUsers($_POST);
		break;

		case 'setUserActive':
		$data = setUserActive($_POST);
		break;	
	}
}

if(isset($data)){
	echo json_encode($data);
}else{
	echo "Error";
}
?>