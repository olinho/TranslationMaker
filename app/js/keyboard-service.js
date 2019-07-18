
function getChar(event){
	var code = event.keyCode ? event.keyCode : event.which;
	var actualChar = String.fromCharCode(code);
	return actualChar;
}

function keyboardShortcutService() {
	var inputTextarea = document.getElementById('inputTextarea');
	var outputTextarea = document.getElementById('outputTextarea');

	outputTextarea.onkeyup = function(event) {
		sentencesManager.getInstance().readInputs(event);
		var code = getCode(event);
		var currChar = getChar(event);

		// CTRL + ENTER
		// COMMIT OUTPUT
		if (event.ctrlKey && code == 13) {
			setCommunicatorText('The translation is approved. Saving...');
			reset();
		}
	}

	inputTextarea.onkeyup = function(event) {
		sentencesManager.getInstance().readInputs(event);
		var code = getCode(event);
		var currChar = getChar(event);
		// console.log('Current: code: ' + code + '; char: ' + currChar);

		// CTRL + ENTER
		// COMMIT INPUT
		if (event.ctrlKey && code == 13) {
			if ( hasFocusInputSentenceTextarea() ) {
				if (translationState.getInstance().isActivated()){
					setCommunicatorText('The input ' + textType + ' is approved. Enter translation.');
					disableInput();
					enableOutput();
					setFocusOnOutput();
				}
				else {
					afterApprovingSentence();
				}
				console.log('The input ' + textType + ' is approved.');
			}
			return true;
		}

		// HINT KEYBOARD SERVICE
		if ( event.altKey ){
			if (code == 38) selectRowAbove();
			else if (code == 40) selectRowBelow();
			else if (code == 13) actionOnPressEnterOnRow(event);	
		}

		// ESC
		if (code == 27) {
			actionOnEsc();
		}
	}
	window.onkeyup = function(event) {
		var code = getCode(event);
		var currChar = getChar(event);

		// CTRL + ~
		// ROLLBACK SENTECES
		if ( event.ctrlKey ){
			if (code == 192) reset();
			return false;
		}
		if ( event.altKey ){
			if (currChar == '1') setFocusOnInput();
			else if (currChar == '2') setFocusOnOutput();
			return false;
		}
	}
}


// function which return code of triggered event
function getCode(event) {
	var code = event.keyCode ? event.keyCode : event.which;
	return code;
}

// get char after press on button action
function getChar(event){
	var code = getCode(event);
	var actualChar = String.fromCharCode(code);
	return actualChar;
}


// constans
const availableKeys= [
	';','\'','\=','\,','\.',' ','[',']','\\', '{', '}', '|', ':', '\"', '<', '>', '+'
];

const specialCharactersActiveWithShift = [
	'{', '}', '|', ':', '\"', '+'
];

const specialCharactersWithoutShift = [
	';','\'','\=','\,','\.','[',']', '\\'
];