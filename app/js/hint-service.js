
function addHint(term) {
	var fstEmptyRow = getFirstEmptyHintRow();
	$(fstEmptyRow).find("td").text(term);
	$(fstEmptyRow).show();
}

function clearHints() {
	$("#hint-table td").empty();
	$("#hint-table tr").hide();
	uncheckHintRows();
}

function getFirstEmptyHintRow(){
	return $("#hint-table tr:hidden:first");
}

function setHintClickAction() {
	$("#hint-table tr").on('mousedown', function(event) {
		event.preventDefault();
		if ($(this).text() == '')
			return false;
		var editableDiv = document.getElementById("inputTextarea");
		var hint = $(this).text();
		insertChosenHint(editableDiv, hint);
		clearHints();
	});
}

function loadHints() {
	var currentWord = getCurrentWord();
	var inputDict = inputLanguage.getInstance().getDictionary();
	var similarWords = getSimilarWords(currentWord, inputDict);
	var currentHints = getVisibleHints();
	if (similarWords.length > 10) 
		similarWords = similarWords.slice(0,10);
	if (arraysEqual(currentHints, similarWords))
		return;
	clearHints();
	for (var i=0; i<similarWords.length; i++)
		addHint(similarWords[i]);
	if (similarWords.length > 0)
		$("#hint-table tr:first").addClass("selected-hint"); // auto select first row
}

function selectRowBelow() {
	var currTr = $("#hint-table tr.selected-hint");
	if (currTr.next(":visible").length > 0)
		currTr.next(":visible").addClass("selected-hint").siblings().removeClass("selected-hint");
	else 
		$("#hint-table").find("tr:not(:empty):visible:first").addClass("selected-hint").siblings().removeClass("selected-hint");
}

function selectRowAbove() {
	var currTr = $("#hint-table tr.selected-hint");
	if (currTr.prev(":visible").length > 0)
		currTr.prev(":visible").addClass("selected-hint").siblings().removeClass("selected-hint");
	else 
		$("#hint-table").find("tr:not(:empty):visible:last").addClass("selected-hint").siblings().removeClass("selected-hint");
}


// hover action  has 2 functions as parameters. First is loaded
// on mouse over element and the second - on mouse outside
function actionOnMouseOverRow(){
	$("#hint-table tr").hover(function() {
		if ($(this).text())
			$(this).addClass('selected-hint').siblings().removeClass('selected-hint');
	}, function() {
		$(this).removeClass('selected-hint');
	});
}

// should be called when focus in inputTextarea and press ALT + ENTER
function actionOnPressEnterOnRow(event) {
	event.preventDefault();
	var editableDiv = document.getElementById("inputTextarea");
	var hint = getHintFromSelectedRow();
	if (hint == "")
		return false;
	insertChosenHint(editableDiv, hint);
	clearHints();
}

// remove selected-hint class from table's tr elements
function uncheckHintRows() {
	$("#hint-table tr.selected-hint").removeClass("selected-hint");
}

function getVisibleHints() {
	var arrTr = $("#hint-table td:not(:empty)");
	var hints = [];
	for (i=0; i<arrTr.length; i++){
		hints[i] = arrTr[i].textContent;
	}
	return hints;
}

// return hint text from selected row
function getHintFromSelectedRow(){
	return $("#hint-table tr.selected-hint td:first").text();
}


function actionOnEsc() {
	clearHints();
}