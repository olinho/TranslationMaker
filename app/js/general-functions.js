
// ******************************
// ***** TEXTAREAS FUNCTIONS *****

function clearInput() {
	$("#inputTextarea").text("");
}

function enableInput(){
	$("#inputTextarea").removeAttr("disabled");
	$("#inputTextarea").attr("contenteditable", true);
}

function disableInput() {
	$("#inputTextarea").attr("disabled", "disabled");
	$("#inputTextarea").attr("contenteditable", false);
}

function setFocusOnInput() {
	var inputTextarea = document.getElementById('inputTextarea');
	$("#inputTextarea").focus();
	setCaretPositionInDiv(inputTextarea, inputTextarea.textContent.length);
}

function hasFocusInputSentenceTextarea() {
	console.log('FocusOn inputTextarea');
	return $("#inputTextarea").is(":focus");
}

function setFocusOnTermInput() {
	$("#inputTermTextarea").focus();	
}



function clearOutput() {
	$("#outputTextarea").text("");
}

function enableOutput(){
	$("#outputTextarea").removeAttr("disabled");
	$("#outputTextarea").attr("contenteditable", true);
}

function disableOutput() {
	$("#outputTextarea").attr("disabled", "disabled");
	$("#outputTextarea").attr("contenteditable", false);
}

function setFocusOnOutput() {
	$("#outputTextarea").focus();
}

function hasFocusOutputSentenceTextarea() {
	return $("#outputTextarea").is(":focus");
}

function setFocusOnTermOutput() {
	$("#outputTermTextarea").focus();	
}


function clearTextareas() {
	clearInput();
	clearOutput();
}

// ****************************
// ***** OUTPUT SECTOR ********

function showOutputSector() {
	if ( areLanguagesSame() ){
		disableInput();
		disableOutput();
		infoOnSameLanguages();
	}
	$("#outputSector").show();
}

function hideOutputSector() {
	$("#outputSector").hide();
	reset();
}


// *******************************
// ***** LANGUAGE POPUP *****

function setLanguageModalDivItemprop(type) {
	$("#languageModalDiv").attr('itemprop', type);
}

function getLanguageModalDivItempropType() {
	return $("#languageModalDiv").attr('itemprop');
}


// **********************************
// *********** COMMUNICATOR *********

function afterApprovingSentence(){
	setCommunicatorText('The input sentence is approved.');
	clearInput();
	setCommunicatorTextDelayed(getPromptTextForInput());
}

function refreshCommunicatorTextType() {
	if (isSentenceTextTypeActive()){
		setSentenceInCommunicatorAsTextType();
	} else {
		setTermInCommunicatorAsTextType();
	}
}

function setTermInCommunicatorAsTextType() {
	textType = "term";
}

function setSentenceInCommunicatorAsTextType() {
	textType = "sentence";
}



// *********************************
// ******* TEXT TYPES **************


// check if we input sentence
// if false then we input term
function isSentenceTextTypeActive() {
	return $("#textTypeDivToggler > label[value='sentence']").hasClass("btn-success");
}

function setTermTextType() {
	$("#textTypeDivToggler").children().removeClass(["btn-success","active"]);
	$("#textTypeDivToggler > label[value='term']").addClass(["btn-success","active"]);
	refreshCommunicatorTextType();
}

function setSentenceTextType() {
	$("#textTypeDivToggler").children().removeClass(["btn-success","active"]);
	$("#textTypeDivToggler > label[value='sentence']").addClass(["btn-success","active"]);
	refreshCommunicatorTextType();
}

function setDefaultTextType() {
	if (GLOBAL_VARS.textType.default == "sentence" && !isSentenceTextTypeActive()) {
		setSentenceTextType();
		reset();
	} 
	else if (GLOBAL_VARS.textType.default == "term" && isSentenceTextTypeActive()) {
		setTermTextType();
		reset();
	}
	
}


// ***********************
// ******* ANOTHER *******


function reset() {
	refreshCommunicatorTextType();
	clearTextareas();
	disableOutput();
	enableInput();
	setFocusOnInput();
	setCommunicatorText(getPromptTextForInput());
}

function removeEmptySlotsFromJson(json) {
	var newJson = {};
	var index = 0;
	$.each(json, function(key, val) {
		newJson[index] = val;
		index++;
	});
	return newJson;
}

// get words from text
function pullWordsOutOfText(str) {
	var str = removeSpecialCharacters(str);
	str = removeMultispaces(str);
	return str.toLowerCase().split(" ");
}

function removeMultispaces(str) {
	return str.replace( /\s\s+/g, ' ' );
}

function removeSpecialCharacters(str) {
	return str.replace(/[0-9`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
}

function getInputSelection(elem){
	if ($(elem).is(":focus")) {
		var startInd = window.getSelection().focusOffset;
		var endInd = window.getSelection().anchorOffset;
		return $(elem).text().substring(startInd, endInd);
	}
	else {
		return '';
	}
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// **********************************
// **** Caret Position Functions ****

function insertChosenHint(editableDiv, newWord) {
	var firstPos = getStartingPositionOfCurrentWord(editableDiv);
	var lastPos = getLastPositionOfCurrentWord(editableDiv);
	var {first: lineFirstPos, last: lineLastPos, lineIndx: lineIndx} = getExtremePosInCurrentLine(editableDiv);
	var caretPos = getCaretPositionInDiv(editableDiv);
	var arrLinesText = getClearTextFromDiv(editableDiv).split("\n");
	var textContent = editableDiv.textContent;
	
	var lineNewContent = textContent.substring(lineFirstPos, firstPos) + newWord + " " + textContent.substring(lastPos+1,lineLastPos);
	arrLinesText[lineIndx] = lineNewContent;
	var newCaretPos = firstPos + newWord.length + 1;
	var newInnerHTML = "";
	for (t=0; t<arrLinesText.length; t++){
		if (t == 0){
			newInnerHTML += "<div>" + arrLinesText[t];
		} else {
			newInnerHTML += "</div><div>" + arrLinesText[t];
		}
	}
	newInnerHTML += "<br></div>";
	editableDiv.innerHTML = newInnerHTML;
	setCaretPositionInDiv(editableDiv, newCaretPos);
}

// change new lines using tags
function clearTextEncloseWithTags(str) {
	return "<div>" + str.replace(/\n/g, '</div><div>') + "<br></div>";
}


// function gets currentWord and adds letter on currentPosition.
// Then returns new word.
// This function DOES NOT MODIFY this word in editableDiv
function addLetterToCurrentWord(editableDiv, letter) {
	var oldStr = editableDiv.textContent;
	var curPos = getCaretPositionInDiv(editableDiv);
	var firstPos = getStartingPositionOfCurrentWord(editableDiv);
	var lastPos = getLastPositionOfCurrentWord(editableDiv);
	var newWord = oldStr.substr(firstPos, curPos-firstPos)+letter+oldStr.substr(curPos, lastPos-curPos+1);
	return newWord;
}

// function which return word which is located on given pos
function getWordOnPosition(pos) {
	var editableDiv = document.getElementById("inputTextarea");
	var curPos = getCaretPositionInDiv(editableDiv);
	setCaretPositionInDiv(editableDiv, pos);
	var word = getCurrentWord();
	setCaretPositionInDiv(editableDiv, curPos);
	return word;
}

function getCurrentWord() {
	var inputTextarea = document.getElementById('inputTextarea');
	var firstPos = getStartingPositionOfCurrentWord(inputTextarea);
	var lastPos = getLastPositionOfCurrentWord(inputTextarea);
	var {first: lineFirstPos, last: lineLastPos} = getExtremePosInCurrentLine(inputTextarea);
	var text = inputTextarea.textContent;
	var strWithoutSpaces = text.substr(firstPos, lastPos-firstPos+1).replace(/\s+/g, '');
	var curPos = getCaretPositionInDiv(inputTextarea);
	if (firstPos == lastPos && lastPos == lineLastPos) {
		return '';
	}
	else if (curPos == 0) {
		if (getCharAtPosInDiv(inputTextarea, curPos) == '' || getCharAtPosInDiv(inputTextarea, curPos) == ' ')
			return '';
	}
	else {
		if ((getCharAtPosInDiv(inputTextarea, curPos) == '' || getCharAtPosInDiv(inputTextarea, curPos) == ' ')
			&& (getCharAtPosInDiv(inputTextarea, curPos-1) == '' || getCharAtPosInDiv(inputTextarea, curPos-1) == ' ')){
			return '';
		}
	}
	return strWithoutSpaces;
}

function clearStrFromHtmlTags(str) {
	return str.replace(/<[^>]*>?/gm, '');
}

// replace HTML formatted new lines </div><div> by char \n
function getClearTextFromDiv(editableDiv){
	var innerHTML = editableDiv.innerHTML;
	var textNoNewLine = innerHTML.replace(/<br>+/g, '').replace(/<\/div><div>/g, '\n');
	var textNoHtmlTags = textNoNewLine.replace(/<[^>]*>?/gm, '');
	return textNoHtmlTags;
}



// function returning positon of the first letter in the word where the caret is located
// indexed from 0
function getStartingPositionOfCurrentWord(editableDiv) {
	var caretPos = getCaretPositionInDiv(editableDiv);
	if (caretPos == 0) {
		return 0;
	}
	var {first: lineFirstPos, last: lineLastPos} = getExtremePosInCurrentLine(editableDiv);
	var curPos = caretPos;
	if (getCharAtPosInDiv(editableDiv, curPos-1) == ' ' || curPos == lineFirstPos){
		return curPos;
	}
	var curLetter = getCharAtPosInDiv(editableDiv,curPos);
	do {
		curPos -= 1;
		curLetter = getCharAtPosInDiv(editableDiv,curPos);
	} while (curLetter != ' ' && curPos > lineFirstPos);
	
	if (curLetter == ' ' && curPos != caretPos){
		curPos += 1;
	}
	return curPos;
}


// function returning positon of the last letter in the word where the caret is located
function getLastPositionOfCurrentWord(editableDiv) {
	var {first: lineFirstPos, last: lineLastPos} = getExtremePosInCurrentLine(editableDiv);
	var caretPos = getCaretPositionInDiv(editableDiv);
	var curPos = caretPos;
	var curLetter = getCharAtPosInDiv(editableDiv, curPos);
	if (curPos == lineLastPos){
		return curPos-1;
	}
	while (curLetter != ' ' && curPos < lineLastPos) {
		curPos += 1;
		// change to getCharAtPosInDiv, when it's correct
		curLetter = getCharAtPosInDiv(editableDiv, curPos);
	}
	if (curLetter == ' ' || curPos == lineLastPos) {
		return curPos-1;
	} else {
		return curPos;
	}
}

// get first,last pos in line and line indx
// last pos is the pos after last char in line
// ex. 'abc' => lastPos = 3
function getExtremePosInCurrentLine(editableDiv) {
	var caretPos = getCaretPositionInDiv(editableDiv);
	var clearText = getClearTextFromDiv(editableDiv);
	var linesText = clearText.split("\n");
	var textLinesLen = linesText.map((text) => {return text.length});
	var extremeLinePositions = []; // first pos, new lines pos, last pos
	var prevTextLen = 0;
	var extrIndx = 0;
	var newLinePositions = [];
	extremeLinePositions[extrIndx] = 0; // firstPos
	extrIndx += 1;
	for (t=0; t<textLinesLen.length; t++) {
		extremeLinePositions[extrIndx] = prevTextLen + textLinesLen[t];
		prevTextLen = extremeLinePositions[extrIndx];
		extrIndx += 1;
	}
	
	var doc = editableDiv.ownerDocument || editableDiv.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel = win.getSelection();
    var anchorOffset = sel.anchorOffset;
	var firstPos, lastPos, lineIndx;
	var t=0;
	while (caretPos > extremeLinePositions[t]){
		t++;
	}	
	if (caretPos == extremeLinePositions[t] && anchorOffset == 0){
		firstPos = extremeLinePositions[t];
		lastPos = extremeLinePositions[t+1];
		lineIndx = t;
	}
	else {
		firstPos = extremeLinePositions[t-1];	
		lastPos = extremeLinePositions[t];
		lineIndx = t>0 ? t-1:0
	}
	
	return {first: firstPos, last: lastPos, lineIndx: lineIndx};
}

// function returning char at given position in the editableDiv, given as parameter
// pos is indexed from 0
function getCharAtPosInDiv(editableDiv, pos) {
	// var text = getClearTextFromDiv(editableDiv);
	var text = editableDiv.textContent;
	return text.charAt(pos);
}

// function that return position of caret in div
function getCaretPositionInDiv(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}


function setCaretPositionInDiv(el, sPos)
{
	var charIndex = 0, range = document.createRange();
	range.setStart(el, 0);
	range.collapse(true);
	var nodeStack = [el], node, foundStart = false, stop = false;

	while (!stop && (node = nodeStack.pop())) {
		if (node.nodeType == 3) {
			var nextCharIndex = charIndex + node.length;
		if (!foundStart && sPos >= charIndex && sPos <= nextCharIndex) {
			range.setStart(node, sPos - charIndex);
			foundStart = true;
		}
		if (foundStart && sPos >= charIndex && sPos <= nextCharIndex) {
			range.setEnd(node, sPos - charIndex);
			stop = true;
		}
		charIndex = nextCharIndex;
		} else {
			var i = node.childNodes.length;
			while (i--) {
				nodeStack.push(node.childNodes[i]);
			}
		}
	}
	selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
} 

// ***********************************
// ***** Text functions *************

function readTextFile(file)
{     
     var rawFile = new XMLHttpRequest();
     rawFile.open("GET", file, false);
     rawFile.onreadystatechange = function ()
     {
         if(rawFile.readyState === 4)
         {
             if(rawFile.status === 200 || rawFile.status == 0)
             {
                 allText = rawFile.responseText;
             }
         }
     }     
     rawFile.send(null); 

     return allText.split('\n');
}


// filter from 'arr' of words, these which start from 'term' 
function getSimilarWords(term, arr) {
	return arr.filter(word => word.startsWith(term));
}


// **************************************************
// **************** learning part *******************

function pickProperties(object, ...properties) {
	// let defines variable in block scope
	// unlike to var, which defines global variable
	// or variable visible in scope of function
	let result = {};

	for (let i = 0, len = properties.length; i < len; i++){
		result[properties[i]] = object[properties[i]];
	}
	return result;
}
let vehicle = {
	tyres: 2,
	color: 'red',
	designer: 'Mercedes',
	velocity: 250
};

// choose which properties add to variable
let vehicleData = pickProperties(vehicle, 'designer', 'velocity');
// console.log(vehicleData.designer);
// console.log(vehicleData.velocity);

// short way of creating function
let shortAddFunc = (param1, param2) => param1+param2;