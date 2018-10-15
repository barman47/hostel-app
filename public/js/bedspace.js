$(document).ready(function(){
    $('.sidenav').sidenav();
    $('select').formSelect();
    function loadHostel (gender) {
        var hostel = document.form.hostelBlock;
        var url = `/hostels/${gender}.json`;
        $.getJSON(url, function (data) {
            var hostels = [];
            for (var prop in data) {
                hostels.push(data[prop]);
                var hostBlock = document.createElement('option');
                hostBlock.innerHTML = data[prop];
                hostel.appendChild(hostBlock);
                $('select').formSelect();
            } 
        });
    }
    var form = document.form;
    var inputs = [
    	form.name,
    	form.phone,
		form.regNo,
		form.hostelBlock,
		form.cardNumber,
		form.expiryDate,
		form.csc,
		form.cardName
    ]
	const nameRegExp = /^[\w ]{2,}$/i;
	const phoneRegExp = /^\d{11}$/;
	const regNoRegExp = /^MOUAU\/[0-9]{1,2}\/[0-9]{1,5}$/i;
	// const visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    // const mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
    // const amexpRegEx = /^(?:3[47][0-9]{13})$/;
    // const discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
	const creditCardRegExp = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
	const cscRegExp = /^[0-9]{3}$/;
	const expDateRegExp =  /^(0[1-9]|1[0-2]|[1-9])\/(1[4-9]|[2-9][0-9]|20[1-9][1-9])$/;  //(0|1)[0-9]\/(19|20)[0-9]{2}/;

	function submitForm (event) {        
        for (var i = 0; i < inputs.length; i++) {
            if (isEmpty(inputs[i])) {
                event.preventDefault();
                inputs[i].classList.add('invalid');
				inputs[i].focus();
				M.toast({html: 'Please ensure you complete the form.'});
                break;
            }
        }
    }

    function isEmpty (element) {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    function checkInputs () {
        form.name.addEventListener('keyup', function (event) {
            if (!nameRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.name.addEventListener('focusout', function (event) {
            if (!nameRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
                M.toast({
                    html: 'Please provide your name to continue'
                });
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        form.phone.addEventListener('keyup', function (event) {
            if (!phoneRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.phone.addEventListener('focusout', function (event) {
            if (!phoneRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
                M.toast({
                    html: 'Please provide your phone number to continue.'
                });
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        form.regNo.addEventListener('keyup', function (event) {
            if (!regNoRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.regNo.addEventListener('focusout', function (event) {
            if (!regNoRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
                M.toast({
                    html: 'Please provide your registration number to continue'
                });
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
		}, false);
		
        form.cardNumber.addEventListener('keyup', function (event) {
            if (!creditCardRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.cardNumber.addEventListener('focusout', function (event) {
            if (!creditCardRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
                M.toast({
                    html: 'Please provide your credit card number to continue'
                });
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
		
		form.expiryDate.addEventListener('keyup', function (event) {
            if (!expDateRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.expiryDate.addEventListener('focusout', function (event) {
            if (!expDateRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
                M.toast({
                    html: 'Invalid Expiry Date.'
                });
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
		}, false);
		
		form.csc.addEventListener('keyup', function (event) {
            if (!cscRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.csc.addEventListener('focusout', function (event) {
            if (!cscRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
                M.toast({
                    html: 'Invalid Expiry Date.'
                });
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.cardName.addEventListener('keyup', function (event) {
            if (!nameRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.cardName.addEventListener('focusout', function (event) {
            if (!nameRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    }
    var gender = form.gender.value;
    loadHostel(gender);
    form.addEventListener('submit', submitForm, false);
    checkInputs();
});