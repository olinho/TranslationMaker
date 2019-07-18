function TranslationState() {
	var activated = true;
	var checker = $("#translationActivator");
	
	this.isActivated = function() {
		return activated;
	}

	function setActivated() {
		activated = true;
	}

	function setDeactivated() {
		activated = false;
	}

	$(checker).on("click", function() {
		activated ? actionOnDeactivation() : actionOnActivation();
	});

	function actionOnActivation() {
		showOutputSector();
		$(checker).text("Translation activated.");
		$(checker).removeClass("list-group-item-danger");
		$(checker).addClass("list-group-item-success");
		setActivated();
	}

	function actionOnDeactivation() {
		hideOutputSector();
		$(checker).text("Translation deactivated.");
		$(checker).removeClass("list-group-item-success");
		$(checker).addClass("list-group-item-danger");
		setDeactivated();
	}
}