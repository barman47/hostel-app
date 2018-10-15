$(document).ready(function () {
    $('.modal').modal();
    const form = document.adminLoginForm;
    const username = form.adminUsername;
    const password = form.adminPassword;

    form.addEventListener('submit', function (event) {
        if (username.value === '' || username.value.trim() === '') {
            event.preventDefault();
            M.toast({html: 'Please provide a username'});
            username.focus();
        } else if (password.value === '' || password.value.trim() === '') {
            event.preventDefault();
            M.toast({html: 'Please provide your password'});
            password.focus();
        }
    });
});