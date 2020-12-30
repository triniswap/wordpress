
	//form validation
	function validateName(fld) {
		"use strict";
		var error = "";
				
		if (fld.value === '' || fld.value === 'Nickname' || fld.value === 'Enter Your Name..' || fld.value === 'Your Name..') {
			error = "You didn't enter Your First Name.\n";
		} else if ((fld.value.length < 2) || (fld.value.length > 200)) {
			error = "First Name is the wrong length.\n";
		}
		return error;
	}
			
	function validateEmail(fld) {
		"use strict";
		var error="";
		var illegalChars = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
				
		if (fld.value === "") {
			error = "You didn't enter an email address.\n";
		} else if ( fld.value.match(illegalChars) === null) {
			error = "The email address contains illegal characters.\n";
		}

		return error;

	}
			
	function valName(text) {
		"use strict";
		var error = "";
				
		if (text === '' || text === 'Nickname' || text === 'Enter Your Name..' || text === 'Your Name..') {
			error = "You didn't enter Your First Name.\n";
		} else if ((text.length < 2) || (text.length > 50)) {
			error = "First Name is the wrong length.\n";
		}
		return error;
	}
			
	function valEmail(text) {
		"use strict";
		var error="";
		var illegalChars = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
				
		if (text === "") {
			error = "You didn't enter an email address.\n";
		} else if ( text.match(illegalChars) === null) {
			error = "The email address contains illegal characters.\n";
		}

		return error;

	}
			
	function validateMessage(fld) {
		"use strict";
		var error = "";
				
		if (fld.value === '') {
			error = "You didn't enter Your message.\n";
		} else if (fld.value.length < 3) {
			error = "The message is to short.\n";
		}

		return error;
	}		

	function validatecheckbox() {
		"use strict";
		var error = "Please select at least one checkbox!\n";
		return error;
	}

