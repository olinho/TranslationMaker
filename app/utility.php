<?php  

// check if string is empty or undefined
function isEmpty($e) {
	if ($e == "" or (!isset($e)))
		return true;
	else
		return false;
}

function encodeJsonObjToStr($jsonObj){
	$str = json_encode($jsonObj, JSON_UNESCAPED_UNICODE);
	return $str;
}

function decodeStringToJson($string){
	$jsonObj = json_decode($string, false, 512, JSON_UNESCAPED_UNICODE);
	return $jsonObj;
}

?>