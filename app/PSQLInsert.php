<?php 

namespace translationmaker;

class PSQLInsert {

	private $pdo;

	public function __construct($pdo) {
		$this->pdo = $pdo;
	}

	public function insertTermsTranslationReferrence($in_term_id, $out_term_id) {
		$sql = 'INSERT INTO terms_translations(term_id_in, term_id_out)
						VALUES (:in_term_id, :out_term_id)';
		$stmt = $this->pdo->prepare($sql);

		$stmt->bindValue(':in_term_id', $in_term_id);
		$stmt->bindValue(':out_term_id', $out_term_id);
		$stmt->execute();

		return $this->pdo->lastInsertId('terms_translations_id_seq');
	}

	public function insertTermAndTranslation($in_term, $in_lang, $out_term, $out_lang) {
		try {
			$this->pdo->beginTransaction();
			$sql = 'INSERT INTO terms(term, lang_id) 
				VALUES (:in_term, (SELECT id from languages where fullname = :in_lang))';
			$stmt = $this->pdo->prepare($sql);
			$stmt->bindValue(':in_term', $in_term);
			$stmt->bindValue(':in_lang', $in_lang);
			$stmt->execute();
			$in_term_id = $this->pdo->lastInsertId('terms_id_seq');

			$sql = 'INSERT INTO terms(term, lang_id) 
				VALUES (:out_term, (SELECT id from languages where fullname = :out_lang))';
			$stmt = $this->pdo->prepare($sql);
			$stmt->bindValue(':out_term', $out_term);
			$stmt->bindValue(':out_lang', $out_lang);
			$stmt->execute();
			$out_sent_id = $this->pdo->lastInsertId('terms_id_seq');

			$this->pdo->commit();

			$this->insertTermsTranslationReferrence($in_term_id, $out_sent_id);

		} catch(\PDOException $e) {
			// rollback the changes in case of an exception
			$this->pdo->rollBack();
			throw $e;
		}
		return 1;
	}

	public function insertTerm($term, $lang_fullname) {
		$sql = 'INSERT INTO terms(term, lang_id) 
						VALUES (:term, 
							(SELECT id from languages where fullname = :lang_fullname)
							)';
		$stmt = $this->pdo->prepare($sql);

		$stmt->bindValue(':term', $term);
		$stmt->bindValue(':lang_fullname', $lang_fullname);
		$stmt->execute();

		return $this->pdo->lastInsertId('terms_id_seq');
	}


	public function insertSentencesTranslationReferrence($in_sent_id, $out_sent_id) {
		$sql = 'INSERT INTO sentences_translations(sentence_id_in, sentence_id_out)
						VALUES (:in_sent_id, :out_sent_id)';
		$stmt = $this->pdo->prepare($sql);

		$stmt->bindValue(':in_sent_id', $in_sent_id);
		$stmt->bindValue(':out_sent_id', $out_sent_id);
		$stmt->execute();

		return $this->pdo->lastInsertId('sentences_translations_id_seq');
	}


	public function insertSentenceAndTranslation($in_sent, $in_lang, $out_sent, $out_lang) {
		try {
			$this->pdo->beginTransaction();
			$sql = 'INSERT INTO sentences(sentence, lang_id) 
				VALUES (:in_sent, (SELECT id from languages where fullname = :in_lang))';
			$stmt = $this->pdo->prepare($sql);
			$stmt->bindValue(':in_sent', $in_sent);
			$stmt->bindValue(':in_lang', $in_lang);
			$stmt->execute();
			$in_sent_id = $this->pdo->lastInsertId('sentences_id_seq');

			$sql = 'INSERT INTO sentences(sentence, lang_id) 
				VALUES (:out_sent, (SELECT id from languages where fullname = :out_lang))';
			$stmt = $this->pdo->prepare($sql);
			$stmt->bindValue(':out_sent', $out_sent);
			$stmt->bindValue(':out_lang', $out_lang);
			$stmt->execute();
			$out_sent_id = $this->pdo->lastInsertId('sentences_id_seq');

			$this->pdo->commit();

			$this->insertSentencesTranslationReferrence($in_sent_id, $out_sent_id);

		} catch(\PDOException $e) {
			// rollback the changes in case of an exception
			$this->pdo->rollBack();
			throw $e;
		}
		return 1;
	}

	public function insertSentence($sentence, $lang_fullname) {
		$sql = 'INSERT INTO sentences(sentence, lang_id) 
						VALUES (:sentence, 
							(SELECT id from languages where fullname = :lang_fullname)
							)';
		$stmt = $this->pdo->prepare($sql);

		$stmt->bindValue(':sentence', $sentence);
		$stmt->bindValue(':lang_fullname', $lang_fullname);
		$stmt->execute();

		return $this->pdo->lastInsertId('sentences_id_seq');
	}

	// insert the language if it doesn't exist yet
	// :fullname param must be 
	public function insertLanguage($lang_name, $shortname) {
		// prepare statement for insert
		$sql = "INSERT INTO languages(fullname, shortname) 
		SELECT :fullname, :shortname 
			WHERE NOT EXISTS (SELECT * FROM languages where fullname = :fullname::varchar)";
		$stmt = $this->pdo->prepare($sql);

		// pass values to statement
		$stmt->bindValue(':fullname', $lang_name);
		$stmt->bindValue(':shortname', $shortname);

		// execute the insert statement
		$stmt->execute();

		return $this->pdo->lastInsertId('languages_id_seq');
	}
}

?>