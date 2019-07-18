<?php 

require_once('app/utility.php');
require 'vendor/autoload.php';

// \ (backslash) befor the beginning of a function represents the global namespace
use translationmaker\Connection as Connection;
use translationmaker\PSQLGetTables as PSQLGetTables;
use translationmaker\PSQLInsert as PSQLInsert;
use translationmaker\PHPWebSocket as PHPWebSocket;
use translationmaker\PSQLSelect as PSQLSelect;

try {
	
	$Server = new PHPWebSocket();

	$pdo = Connection::get()->connect();
	$Server->bind('message', 'wsOnMessage');
	$Server->wsStartServer('localhost', 9000); 
	

} catch (\PDOException $e) {
	echo $e->getMessage();
}


function wsOnMessage($clientID, $msg, $msgLen, $binary) {
	global $Server;

	printf("Client %s sent: %s.\n", $clientID, $msg);
	$decMsg = decodeStringToJson($msg);

	$queryType = $decMsg->queryType;
	$data = $decMsg->data;

	if ($queryType == "addLanguage") {
		$resp = addLanguage($data);
	} 
	else if ($queryType == "addSentenceEntry") {
		$resp = addSentenceEntry($data);
	}
	else if ($queryType == "addTermEntry") {
		$resp = addTermEntry($data);
	}
	else if ($queryType == "getTermTranslation") {
		$resp = getTermTranslation($data);
	}
	echo $resp . "\n";

	$Server->wsSend($clientID, $resp);
}



function getTermTranslation($strJSON) {
	$pdo = Connection::get()->connect();
	$dbHandler = new PSQLSelect($pdo);
	$resp = "";

	$data = $strJSON->jsonData;
	$term = $data->contents;
	$in_lang = $data->in_lang;
	$out_lang = $data->out_lang;

	$resp = $dbHandler->getTermTranslation($term, $in_lang, $out_lang);
	return $resp;
}

function addTermEntry($strJSON) {
	return addEntry($strJSON, "term");
}

function addSentenceEntry($strJSON) {
	return addEntry($strJSON, "sentence");
}

function addEntry($strJSON, $type) {
	$pdo = Connection::get()->connect();
	$tableInserter = new PSQLInsert($pdo);
	$resp = "";

	$input = $strJSON->jsonData->input;
	$hasTranslation = $strJSON->jsonData->hasTranslation;

	if ( !isCorrectJsonContentsNode($input) ){
		return "Incorrect input term data.";
	} 
	
	if ( $hasTranslation ){
		$output = $strJSON->jsonData->output;
		if ( !isCorrectJsonContentsNode($output) ){
			return "Incorrect output term data.";
		} 
		else {
			if ($type == "term"){
				$resp = $tableInserter->insertTermAndTranslation(
								$input->contents, $input->lang, 
								$output->contents, $output->lang);		
			} 
			else if ($type == "sentence"){
				$resp = $tableInserter->insertSentenceAndTranslation(
								$input->contents, $input->lang, 
								$output->contents, $output->lang);
			}
		}
	} 
	// no translation
	else {
		if ($type == "term"){
			$in_sent_id = $tableInserter->insertTerm($input->contents, $input->lang);
		} 
		else if ($type == "sentence"){
			$in_sent_id = $tableInserter->insertSentence($input->contents, $input->lang);
		}
		$resp = '{"in_sent_id":' . $in_sent_id . '}';
	}
	return $resp;
}

// $msg is a JSON
// $decMsg is decoded JSON
function addLanguage($strJSON) {
	
	$pdo = Connection::get()->connect();
	$tableInserter = new PSQLInsert($pdo);

	$fullname = $strJSON->fullname;
	$shortname = $strJSON->shortname;
	
	$resp = "";

	if (isEmpty($fullname) or isEmpty($shortname)){
		$resp = "Incorrect language details.";
	} 
	else {
		$id = $tableInserter->insertLanguage($fullname, $shortname);	
		if ($id > 0){
			$resp = 'Language ' . $fullname . ' has been inserted with the id ' . $id . '<br>';
		} else {
			$resp = $fullname . " language already exists.";
		}
	}
	echo $resp;
	return $resp; 
}

function demoInsertLanguage($pdo) {
	$tableInserter = new PSQLInsert($pdo);
	$id = $tableInserter->insertLanguage('english', 'en');
	echo 'Language has been inserted with the id ' . $id . '<br>';
}


// check input or output node
function isCorrectJsonContentsNode($data) {
	if (isEmpty($data->lang) or isEmpty($data->contents)) {
		return false;
	} else {
		return true;
	}
}


?>