<?php 

namespace translationmaker;

class PSQLSelect {

	private $_pdo;

	public function __construct($pdo) {
		$this->_pdo = $pdo;
	}

	public function getTermTranslation($term, $in_lang, $out_lang) {
		$stmt = $this->_pdo->prepare('SELECT term from terms WHERE id = 
			(SELECT term_id_out from terms_translations WHERE term_id_in = 
				(SELECT id from terms where 
					(term = :term AND lang_id = (SELECT id from languages where fullname = :in_lang))
				 LIMIT 1) LIMIT 1
			) AND lang_id = (SELECT id from languages WHERE fullname = :out_lang)');
		$stmt->bindValue(':term', $term);
		$stmt->bindValue(':in_lang', $in_lang);
		$stmt->bindValue(':out_lang', $out_lang);
		
		$stmt->execute();
		return json_encode($stmt->fetchObject());
	}


	public function getAllTermsForLanguage($lang_fullname) {
		$stmt = $this->_pdo->prepare(
			'SELECT DISTINCT(term) from terms where lang_id = (SELECT id from languages where fullname = :lang)');
		$stmt->bindValue(':lang', $lang_fullname);

		$stmt->execute();
		$terms = [];
		while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
			$terms[] = $row['term'];
		}
		return json_encode($terms);
	}


	public function getLanguages() {
		$stmt = $this->_pdo->query('SELECT fullname FROM languages');
		$langs = [];
		while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
			$langs[] = ['fullname' => $row['fullname']];
		}
		return $langs;
	}
}

?>