//  **** INIT OBJECTS ****
// SET LANGUAGE FLAGS
window.setTimeout(function() {
	inputLanguage.getInstance();
	outputLanguage.getInstance();
}, 2000);



// **************************
// ******* FUNCTIONS ********

const inputLanguage = initLanguage('input');
const outputLanguage = initLanguage('output');

function initLanguage(type) {
	var instance = undefined;

	function Construct() {
		return new Language(type);
	}

	return {
		getInstance: function() {
			if (!instance) {
				instance = Construct();
			}
			return instance;
		}
	};
}



function getAvailableLanguagesBasedOnType(type) {
	var flagsJSON = Object();
	if (type == 'output') {
		flagsJSON = outputLanguage.getInstance().getAvailableLanguages();	
	} else if (type == 'input') {
		flagsJSON = inputLanguage.getInstance().getAvailableLanguages();	
	}
	return flagsJSON;
}

// are input and output language the same
function areLanguagesSame() {
	if (inputLanguage.getInstance().getFullname() == outputLanguage.getInstance().getFullname()){
		return true;
	} else {
		return false;
	}
}