// *******************************
// **** TMP ******

window.onload = function() {
	showWelcomeText();
	addActionForTextareasOnStart();
	setDefaultTextType();
	
	addActionAfterClickOnDropdown();
	actionAfterClickOnInputLanguagePopupTrigger();
	actionAfterClickOnOutputLanguagePopupTrigger();
	addActionForHints();

	keyboardShortcutService();
	activateTextTypeToggler();

	startWebService();

	// *** TEMP ****
	p1 = document.getElementById('inputTextarea');
	// *************
}

function addActionForTextareasOnStart() {
	clearTextareas();
	disableOutput();
	setFocusOnInput();
	setHintClickAction();
	actionOnClickInputTextarea();
}


function addActionForHints() {
	actionOnMouseOverRow();
}
