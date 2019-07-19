<?php  

namespace translationmaker;

class PSQLGetTables {

	private $_pdo;

	public function __construct($pdo) {
		$this->_pdo = $pdo;
	}

	public function getTables() {
		$stmt = $this->_pdo->query("SELECT table_name 
										 FROM information_schema.tables 
										 WHERE table_schema='public'
										 			AND table_type='BASE TABLE'
										 ORDER BY table_name");
		$tableList = [];
		while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
			$tableList[] = $row['table_name'];
		}

		return $tableList;
	}

	
	// display all tables
	public function showTables() {
		$tables = $this->getTables();
		foreach ($tables as $table){
			echo $table . "<br>";
		}
	}
}

?>