



function activateTextTypeToggler() {
	$("#textTypeDivToggler > label").on("click", function(event) {
		var el = event.target;
		if ( $(el).hasClass("btn-success") == false ){
			$("#textTypeDivToggler > label").toggleClass("btn-success");
			reset();
		}
	});
}

function actionOnClickInputTextarea() {
	$("#inputTextarea").on('click', function() {
		loadHints();
	});
}


function loadTermsFromInputSentences() {
	var sentence = getInputSelection($("#inputTextarea"));
	if (sentence == "") {
		sentence = $("#inputTextarea").text();
	}
	var parsedSentence = pullWordsOutOfText(sentence);
	var wordsInLines = parsedSentence.join("\n");
	$("#inputTermTextarea").val(wordsInLines);
}