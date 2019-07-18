function Language(type) {
	var flagContainer = undefined;
	var flagImgEl = undefined;
	var popupTriggerEl = undefined;
	var firstFlagIndex = 0;
	if (type == 'input') {
		flagContainer = $("#inputLanguageFlagContainer");	
		flagImgEl = $("#inputLanguageFlag");
		popupTriggerEl = $("#inputLanguagePopupTrigger");
		// set default input language
		firstFlagIndex = 1;
	} else if (type == 'output'){
		flagContainer = $("#outputLanguageFlagContainer");	
		flagImgEl = $("#outputLanguageFlag");
		popupTriggerEl = $("#outputLanguagePopupTrigger");
		// set default output language
		firstFlagIndex = 0;
	} else {
		return false;
	}
	var langsJSON = {
		0: {'fullname': 'polish', 'src': 'flags/polish_flag.png', 'shortname': 'pl', 'dictSrc': 'app/dictionaries/words.polish.txt'},
		1: {'fullname': 'english', 'src': 'flags/english_flag.png', 'shortname': 'en', 'dictSrc': 'app/dictionaries/words_2.english.txt'},
		2: {'fullname': 'lemkos', 'src': 'flags/lemkos_flag.png', 'shortname': 'lem'},
		3: {'fullname': 'russian', 'src': 'flags/russian_flag.png', 'shortname': 'ru'}
	};
	var lastFlagIndex = Object.keys(langsJSON).length - 1;
	var currLangIndex = firstFlagIndex;
	var langDict = [];
	loadDictionary();

	this.getLangIndex = function() {
		return currLangIndex;
	}

	this.getFullname = function() {
		return langsJSON[currLangIndex]['fullname'];
	}

	this.getAvailableLanguages = function() {
		var json = $.extend({}, langsJSON);
		if (type == 'output') {
			var inLangIndex = getTranslationLangIndex();
			delete json[inLangIndex];
			json = removeEmptySlotsFromJson(json);
		}
		return json;
	}

	this.getDictionary = function() {
		return langDict;
	}

	function loadDictionary() {
		var dictSrc = langsJSON[currLangIndex]['dictSrc'];
		if (dictSrc !== undefined){
			console.log(getCurrentFlagFullname() + ' dictionary is loading...');
			langDict = readTextFile(dictSrc);
		} 
		else {
			console.log('Dictionary for ' + getCurrentFlagFullname() + ' is not defined');
			langDict = [];
		}
	}

	function getTranslationLangIndex() {
		if (type == 'input'){
			return outputLanguage.getInstance().getLangIndex();
		} else if (type == 'output'){
			return inputLanguage.getInstance().getLangIndex();
		}
	}

	function setLanguageByFullname(newLangFullname) {
		for (var i=0; i<=lastFlagIndex; i++) {
			if (langsJSON[i]['fullname'] == newLangFullname){
				currLangIndex = i;
				return;
			}
		}
	}

	function setNextFlagIndex() {
		if (currLangIndex >= lastFlagIndex){
			currLangIndex = firstFlagIndex;
		} else {
			currLangIndex = currLangIndex + 1;
		}
		if (currLangIndex == getTranslationLangIndex()){
			setNextFlagIndex();
		}
	}

	function getCurrentLang() {
		return langsJSON[currLangIndex];
	}


	function getCurrentFlagSrc(){
		var currFlag = getCurrentLang();
		return currFlag['src'];
	}

	function getCurrentFlagShortname(){
		var currFlag = getCurrentLang();
		return currFlag['shortname'];
	}

	function getCurrentFlagFullname(){
		var currFlag = getCurrentLang();
		return currFlag['fullname'];
	}

	function updateImgSrc() {
		var imgSrc = getCurrentFlagSrc();
		var imgTitle = getCurrentFlagFullname();
		$(flagImgEl).fadeTo(250, 0, function() {
			$(this).attr('src', imgSrc).fadeTo(200, 1);
		})
		$(flagImgEl).attr('title', imgTitle);
	}

	function chooseLanguageProcess() 
	{
		$(popupTriggerEl).on("click", function(){
			$("#languageModalDiv").attr('itemprop', type);
			var langConfBtn = $("#languageModalDiv[itemprop='" + type + "'] #confirmationLanguageBtn");
			$(langConfBtn).on("click", function() {
				var chosenLangFullname = $("#languageRadioPanel").find('.active > input').val();
				if (type == getLanguageModalDivItempropType()) {
					setLanguageByFullname(chosenLangFullname);
					updateImgSrc();
					// load word dictionary
					loadDictionary();
					reset();
					if (currLangIndex == getTranslationLangIndex() && translationState.getInstance().isActivated()){
						disableInput();
						infoOnSameLanguages();
					}
				}
			});
		});
	}


	// ********** ON END ***********
	// SET INITIAL LANGUAGE FLAG
	updateImgSrc();
	chooseLanguageProcess();
}