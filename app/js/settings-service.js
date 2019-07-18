// INIT OBJECTS
window.setTimeout(function() {
	translationState.getInstance();
}, 2000);



// **************************
// ******* FUNCTIONS ********

const translationState = (function() {
	var instance = undefined;

	function Construct() {
		return new TranslationState();
	}

	return {
		getInstance: function() {
			if (!instance) {
				instance = Construct();
			}
			return instance;
		}
	};
})();




// action after click on input language chooser
// which is placed in settings panel
function actionAfterClickOnInputLanguagePopupTrigger() {
	actionAfterClickOnLanguagePopupTrigger('input');
}

function actionAfterClickOnOutputLanguagePopupTrigger() {
	actionAfterClickOnLanguagePopupTrigger('output');
}

function actionAfterClickOnLanguagePopupTrigger(type) {
	var triggerEL = (type == 'input') ? $("#inputLanguagePopupTrigger") : $("#outputLanguagePopupTrigger");
	
	$(triggerEL).on("click", function() {
		setLanguageModalDivItemprop(type);
		setLanguageRadioPanel(type);
	});
}

function setLanguageRadioPanel(type) {
	$("#languageRadioPanel").empty();
	flagsJSON = getAvailableLanguagesBasedOnType(type);
	for (var i=0; i < Object.keys(flagsJSON).length; i++){
			var langFullname = flagsJSON[i]['fullname'];
			var nextRadio = getLanguageRadioOption(type, langFullname);
			$("#languageRadioPanel").append($(nextRadio));
		}
}

// TODO
// change it to jquery version. User-friendlier
function getLanguageRadioOption(type, optVal) {
	var currLang = null;
	var labelEl = $("<label>", {
		class: 'btn btn-default',
		text: optVal
	});
	var inputEl = $("<input>", {
		type: 'radio',
		name: 'language',
		value: optVal,
		checked: ''
	});
	$(labelEl).append($(inputEl));

	if (type == 'input'){
		currLang = inputLanguage.getInstance();
	} else if (type = 'output') {
		currLang = outputLanguage.getInstance();
	}
	
	if (currLang.getFullname() == optVal) {
		$(labelEl).addClass('active');
	}
	return $(labelEl);
}


// open/close settings popup service
function addActionAfterClickOnDropdown() {
	$("#settingsBtn").on('click', function(e) {
		$(this).parent().toggleClass('open');
	});2
	$('body').on('click', function(e) {
		var target = e.target;
		var settingsDiv = $('#settingsDropdownDiv');
		if ( !isChild(target, $(settingsDiv))){
			$("#settingsBtn").parent().removeClass('open');
		}
	});
}

function onServerConnected() {
	setServerConnectionStatus("connected");	
}

function onServerDisconnected() {
	setServerConnectionStatus("disconnected");	
}

function setServerConnectionStatus(status) {
	var el = $("#serverConnectionStatus");
	if (status == "connected") {
		$(el).removeClass("list-group-item-danger").addClass("list-group-item-success");
		$(el).text("Connected");
		$(el).attr('title', "Server connection status.");
		$(el).unbind('click');
	}
	else if (status == "disconnected") {
		$(el).removeClass("list-group-item-success").addClass("list-group-item-danger");
		$(el).text("Reconnect");
		$(el).attr('title', "Server is disconnected.\nClick to reconnect.");
		$(el).on('click', startWebService);
	}
}

function isChild(elem, parent) {
	return $(parent).has($(elem)).length > 0 ? true : false;
}