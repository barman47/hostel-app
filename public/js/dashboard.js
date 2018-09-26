$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.modal').modal();
    $('select').formSelect();
    var inputs = document.querySelectorAll('input');
    var dataFields = [
        document.querySelector('#name'),
        document.querySelector('#email'),
        document.querySelector('#password'),
        document.querySelector('#phone'),
        document.querySelector('#department')
    ];

    const nameRegExp = /^[\w ]{2,}$/i;
    const emailRegExp = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    const passwordRegExp = /^[\w@-]{8,20}$/;
    const phoneRegExp = /^\d{11}$/;

    var editButton = document.querySelector('#editButton');
    var saveButton = document.querySelector('#saveButton');
    inputs.forEach(function(input) {
        input.setAttribute('disabled', 'disabled');
    }, false);

    editButton.addEventListener('click', function () {
        dataFields.forEach(function (input) {
            if (input.disabled === true) {
                input.disabled = false
            }
        });
    }, false);

    function isEmpty (element) {
        if (element.value === '' || element.value.trim() === '') {
            return true;
        } else {
            return false;
        }
    }

    function ajaxUpdate () {
        var password = $('#password').val();
        if (password === '') {
            password = null;
        }
        $target = $('#saveButton');
        const id = $target.attr('data-id');
        const url = `/students/dashboard/${id}`;
        let data = {
            name: $('#studentName').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            department: $('#department').val(),
            password: password,
        }
        $.ajax(url, {
            type: 'PUT',
            data: data
        }).done(function () {
            M.toast({
                html: 'Update Successful.',
                classes: 'greenToast'
            });
            setTimeout(function () {
                window.location.href = `/students/dashboard/${id}`;
            }, 3000);
        }).fail(function (jqXHR, status) {
            alert('Update Unsucessful. Please Try Again. ' + status);
        });
    }
    
    function submitData () {
        var okay;
        for (var i = 0; i < dataFields.length; i++) {
            if (isEmpty(dataFields[i])) {
                dataFields[i].classList.add('invalid');
                dataFields[i].disabled = false;
                dataFields[i].focus();
                M.toast({html: 'Please provide data to be updated'});
                okay = false;
                break;
            }
        }
        if (okay !== false && dataFields[2].value.length >= 8) {
            ajaxUpdate();
        }
    }

    function checkInputs () {
        dataFields[0].addEventListener('keyup', function (event) {
            if (!nameRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        dataFields[0].addEventListener('focusout', function (event) {
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
        dataFields[1].addEventListener('keyup', function (event) {
            if (!emailRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        dataFields[1].addEventListener('focusout', function (event) {
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
    
        dataFields[2].addEventListener('keyup', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        dataFields[2].addEventListener('focusout', function (event) {
            if (!passwordRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
                M.toast({html: 'Please provide a valid password'});
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        dataFields[3].addEventListener('keyup', function (event) {
            if (!phoneRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    
        dataFields[3].addEventListener('focusout', function (event) {
            if (!phoneRegExp.test(event.target.value)) {
                event.target.classList.add('invalid');
                event.target.classList.remove('valid');
                event.target.focus();
                M.toast({html: 'Please provide a valid phone number'});
            } else {
                event.target.classList.add('valid');
                event.target.classList.remove('invalid');
            }
        }, false);
    }
    checkInputs();
    saveButton.addEventListener('click', submitData, false);
});
