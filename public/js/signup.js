$(document).ready(function () {
    var form = document.form;
    var inputs = [
        form.firstName,
        form.lastName,
        form.regNo,
        form.department,
        form.email,
        form.password,
        form.confirmPassword
    ];

    var submitButton = document.querySelector('button');

    var regNoRegExp = /^MOUAU\/[0-9]{1,2}\/[0-9]{1,5}$/i;
    var deptRegExp = /^[\w .-]{2,}$/i;
    var emailRegExp = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    var passwordRegExp = /^[\w@-]{8,20}$/;

    function submitForm (event) {        
        for (var i = 0; i < inputs.length; i++) {
            if (isEmpty(inputs[i])) {
                event.preventDefault();
                inputs[i].classList.add('invalid');
                inputs[i].focus();
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
                    html: 'Please provide a valid Registration Number to continue'
                });
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        form.department.addEventListener('keyup', function (event) {
            if (!deptRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.department.addEventListener('focusout', function (event) {
            if (!deptRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
                M.toast({
                    html: 'Please provide your department to continue'
                });
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
        form.email.addEventListener('keyup', function (event) {
            if (!emailRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.email.addEventListener('focusout', function (event) {
            if (!emailRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
                M.toast({
                    html: 'Please provide a valid email to continue'
                });
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.password.addEventListener('keyup', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.password.addEventListener('focusout', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        form.confirmPassword.addEventListener('keyup', function (event) {
            if(event.target.value === form.password.value) {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            } else {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            }
        }, false);
    }
    form.addEventListener('submit', submitForm, false);
    checkInputs();
});