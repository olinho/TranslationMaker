<?php

namespace translationmaker;
// require 'vendor/autoload.php';

// \ (backslash) befor the beginning of a function represents the global namespace
// use translationmaker\PHPWebSocket as PHPWebSocket;
// use translationmaker\PSQLSelect as PSQLSelect;



class DictionaryManager {

	private $_s_ = DIRECTORY_SEPARATOR;
	private $_backupDirPath;
	// system specific directory separator
	

	public function __construct(){
		$this->_backupDirPath = $this->_buildDirPath(array(__DIR__, '..', 'dictionaries', 'backups'));
	}

	/* lang: english, polish, lemkos, russian 
	 date: dd_mm_yyyy
	*/
	public function readBackupDictionary($lang, $date) {
		$filepath = $this->_backupDirPath."words.{$lang}_{$date}.txt";
		$wordsArr = explode("\n", file_get_contents($filepath));
		return $wordsArr;
	}

	/**/
	public function getBackupFileList($lang) {
		$fileList = array();
		$pathPattern = $this->_backupDirPath."words.";
		if ( isset($lang) ) {
			$pathPattern .= $lang;
		}
		$pathPattern = $pathPattern."*.txt";
		foreach (glob($pathPattern) as $filename) {
			$fileList[] = basename($filename);
		}
		return $fileList;
	}

	/*	path with subsequent directories names
		return string
		ex. dirNamesArr=['person','man','father'] 
		=> person/man/father/ on Linux OR
		 person\man\father on Windows
	*/
	private function _buildDirPath($dirNamesArr) {
		return join(DIRECTORY_SEPARATOR, $dirNamesArr).DIRECTORY_SEPARATOR;
	}
}

$dictM = new DictionaryManager();
print_r($dictM->readBackupDictionary("lemkos","19_07_2019"));
print_r($dictM->getBackupFileList("lemkos"));


?>