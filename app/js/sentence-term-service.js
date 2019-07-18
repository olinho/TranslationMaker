
setTimeout(function() {
	sentencesManager.getInstance();
}, 2000);

const sentencesManager = initSentencesManager();

function initSentencesManager() {
	var instance = undefined;

	function Construct() {
		return new SentencesManager();
	}

	return {
		getInstance: function() {
			if ( !instance ){
				instance = Construct();
			}
			return instance;
		}
	}
}



function SentencesManager() {
	var inSentObj = undefined;
	var outSentObj = undefined;
	var translationStateObj = undefined;

	const inputSentence = initSentence('input');
	const outputSentence = initSentence('output');
	
	// INITIALIZE CONSTANTS
	setTimeout(function() {
		inSentObj = inputSentence.getInstance();
		outSentObj = outputSentence.getInstance();
		translationStateObj = translationState.getInstance();
	}, 1000);	



	function sendDBQuery(jsonData, queryType) {
		var json = {
			"queryType": queryType,
			"data" : {
				jsonData
			}
		};
		var strData = JSON.stringify(json);
		socket.send(strData);
	}

	function getTermTranslationFromDB() {
		var jsonData = getJsonToQueryDB();
		sendDBQuery(jsonData, "getTermTranslation");
	}

	function addNewSentenceEntryToDB(jsonData) {
		sendDBQuery(jsonData, "addSentenceEntry");
	}

	function addNewTermEntryToDB(jsonData) {
		sendDBQuery(jsonData, "addTermEntry");
	}


	function saveNextEntry() {
		if ( !hasNextEntry() ){
			console.log('No entry ready to save.');
			return null;
		}
		var json = getJsonEntryForInsertingDataToDB();
		if ( isSentenceTextTypeActive() ){
			addNewSentenceEntryToDB(json);	
		} else {
			addNewTermEntryToDB(json);
		}
		
		inSentObj.reset();
		outSentObj.reset();

		console.log('Saved next entry.');
		console.log(json);
	}

	// TMP example
	function getJsonToQueryDB() {
		var json = Object();
		json = {
			'contents' : 'music',
			'in_lang' : 'english',
			'out_lang' : 'polish'
		}
		return json;
	}

	function getJsonEntryForInsertingDataToDB() {
		var json = Object();
		if ( translationStateObj.isActivated() ){
			json = prepareJsonForEntryWithTranslation();
		} else {
			json = prepareJsonForEntryWithoutTranslation();
		}
		return json;
	}

	function prepareJsonForEntryWithTranslation() {
		var json = prepareJsonForEntryWithoutTranslation();
		json['output'] = {
			'lang' : outSentObj.getContentsLanguage(),
			'contents' : outSentObj.getSavedContents()
		};
		// with translation
		json['hasTranslation'] = true;
		return json;
	}

	function prepareJsonForEntryWithoutTranslation() {
		var json =  Object();
		json['input'] = {
			'lang' : inSentObj.getContentsLanguage(),
			'contents' : inSentObj.getSavedContents()
		};
		// no translation
		json['hasTranslation'] = false;
		return json;
	}

	// is next entry ready to save
	function hasNextEntry() {
		console.log('Is translation activated : ' + translationStateObj.isActivated());
		if ( translationStateObj.isActivated() )
			return isInputApproved() && isOutputApproved();
		else
			return isInputApproved();
	}

	function isInputApproved() {
		return inSentObj.isApproved();
	}

	function isOutputApproved() {
		return outSentObj.isApproved();	
	}


	this.readInputs = function(event) {
		var code = getCode(event);
		var currChar = getChar(event);
		var sentObj = undefined;

		if (event.ctrlKey && code == 13) {
			if ( inSentObj.hasFocus() ) 
				inSentObj.serviceKeyEvent(event);
			else if ( outSentObj.hasFocus() ) 
				outSentObj.serviceKeyEvent(event);
			
			if ( hasNextEntry() ) 
				saveNextEntry();
		}
		else if (event.ctrlKey && code == 190) 
			getTermTranslationFromDB();
	
		if (getCurrentWord() != "")
			loadHints();
		else 
			clearHints();
	}


	// init sentence function
	// ensure signleton functionality
	function initSentence(type) {
		var instance = undefined;

		function Construct() {
			return new Sentence(type);
		}

		return {
			getInstance: function() {
				if ( !instance ){
					instance = Construct();
				}
				return instance;
			}	
		}
	}

	// **************************************
	// SENTENCE CLASS
	function Sentence(type) {
		var textArea = undefined;
		var languageHandler = undefined;
		var approved = false;
		var contentsLang = undefined;
		var savedContents = "";

		if (type == 'input'){
			textArea = $("#inputTextarea");
			languageHandler = inputLanguage.getInstance();
		} 
		else if (type == 'output') {
			textArea = $("#outputTextarea");
			languageHandler = outputLanguage.getInstance();
		}



		this.getSavedContents = function() {
			return savedContents;
		}

		this.isApproved = function() {
			return approved;
		}

		this.getContentsLanguage = function() {
			return contentsLang;
		}

		this.hasFocus = function() {
			return $(textArea).is(":focus");
		}

		this.serviceKeyEvent = function(event) {
			var code = getCode(event);
			var currChar = getChar(event);

			if (event.ctrlKey && code == 13) {
				if ( $(textArea).is(":focus") && !approved ){
					savedContents = $(textArea).text();
					savedContentsCleared = savedContents.replace(/\s+$/g, '');
					contentsLang = languageHandler.getFullname();
					approved = true;
					console.log('Saved sentence: ' + savedContentsCleared);
				}
			}
		}

		this.reset = function() {
			approved = false;
			contentsLang = undefined;
			savedContents = "";
		}

	}
}