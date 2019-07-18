var textType = GLOBAL_VARS.textType.default;

function setCommunicatorText(text) {
	var el = $("#communicator");
	$(el).fadeOut(300, function() {
		$(el).fadeTo(500, 1.0);
		$(el).text(text).fadeIn(500);
		setTimeout(function() {
			$(el).fadeTo(2000, 0.9);
		}, 500);
	});
}

function showWelcomeText() {
	var el = $("#communicator");
	setCommunicatorTextDelayed(getWelcomeText());
}

function setCommunicatorTextDelayed(text) {
	setTimeout(function(){
		setCommunicatorText(text);
	}, 1000);	
}

function getWelcomeText() {
	return 'Enter the ' + textType + ' in ' + inputLanguage.getInstance().getFullname() + '.';
}

function infoOnSameLanguages() {
	setCommunicatorText(getChangeLanguageText());
}

function getChangeLanguageText() {
	return "Change language";
}

function getPromptTextForInput() {
	return 'Enter the ' + textType + ' in ' + inputLanguage.getInstance().getFullname() + '.'
}

function getPromptTextForOutput() {
	return 'Enter the ' + textType + ' in ' + outputLanguage.getInstance().getFullname() + '.'
}

// TODO
function animateCommunicatorDeparture() {
	var el = $("#communicator");
	var moveLen = $(el).width() + 20;
	$(el).animate({
		'marginLeft': "-=" + moveLen + "px"
	}, 2000);
	setTimeout(function() {
		$(el).hide();
	}, 2000);
}

function animateCommunicatorArrival() {
	var el = $("#communicator");
	var moveLen = $(el).width() + 20;
	$(el).animate({
		'marginLeft': "+=" + moveLen + "px"
	}, 2000);	
}