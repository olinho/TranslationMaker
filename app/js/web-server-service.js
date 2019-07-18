var socket;

// window.onload = function() {
// 	startWebService();
// 	$("#newLanguageForm").submit(function(event) {
// 		onNewLanguageFormSubmit(event);
// 	});
// }





// add new language using websocket
function onNewLanguageFormSubmit(event) {
	// to prevent page reloading
	event.preventDefault();
	var fullnameInput = $('#newLanguageForm > input[name=fullname]');
	var shortnameInput = $('#newLanguageForm > input[name=shortname]');
	var jsonData = {
		"queryType": "addLanguage",
		"data" : {
			"fullname": fullnameInput.val(),
			"shortname": shortnameInput.val()	
		}
	}
	var strData = JSON.stringify(jsonData);
	socket.send(strData);
	fullnameInput.val("");
	shortnameInput.val("");
}

function startWebService() {
	var host = "ws://127.0.0.1:9000";
	socket = new WebSocket(host);
	
	socket.onerror = function(event) {
		var info = "Unable to connect with server.";
		console.log(info);
		displayPopupMsg(info, 'danger');
		onServerDisconnected();
	}

	socket.onopen = function(event) {
		var info = 'Connected with server via WebSocket.';
		console.log(info);
		displayPopupMsg(info, 'success');
		onServerConnected();
		// socket.send('Humility');
	};

	socket.onmessage = function(event) {
		try{
			console.log("Received: ");
			console.log(JSON.parse(event.data));
			return;
		} catch (e) {
			console.log('Error');
			console.log(e);
			console.log("Received: " + event.data);
		}
		
	};

	socket.onclose = function(event) {
		var info = "Server is disconnected.";
		console.log(info);
		displayPopupMsg(info);
		onServerDisconnected();
	};
}