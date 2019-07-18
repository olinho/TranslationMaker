
// fade in-out popup showing text
function displayPopupMsg(msg, type='warning') {
	var popup = $(".info-popup");
	if ($(popup).is(":animated") || msg == ''){
		return;
	}
	var popupContent = $(popup).find(".popup-content");
	var alertClass = '';
	switch (type){
		case "success":
			alertClass = "alert-success";
			break;
		case "danger":
			alertClass = "alert-danger";
			break;
		default:
			alertClass = "alert-warning";
			break;
	}
	$(popupContent).text(msg);
	var time=[1000,3000,3000];
	var sumTime = time.reduce((a,b) => a+b);
	$(popup).stop().addClass(alertClass)
		.animate({ opacity: 1, top: '5px'}, 1000)
		.animate({ opacity: 0.9, top: '5px'}, 3000)
		.animate({ opacity: 0, top: '-100px'}, 3000);

	setTimeout(function() {
		$(popup).removeClass(alertClass);
		$(popupContent).text('');
	}, sumTime);
}

function fadeOutMyself(el) {
	console.log('clicked');
	$(el).stop().animate({ opacity: 0, top: '-100px'}, 1000);
}