import { postJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.8/api.min.js";
import { validateEmail, validateRequired } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.8/validate.min.js";
import { showLoading, hideLoading } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.8/loading.min.js";
import { setInner, show, hide } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.8/element.min.js";

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const turnstileToken = document.querySelector('input[name="cf-turnstile-response"]')?.value;
    const errorMsg = document.getElementById('errorMsg');

    // Validation using jscroot
    if (!validateRequired(username) || !validateRequired(fullname) || !validateRequired(password)) {
        setInner('errorMsg', 'Semua field wajib diisi.');
        show('errorMsg');
        return;
    }

    if (!validateEmail(email)) {
        setInner('errorMsg', 'Format email tidak valid.');
        show('errorMsg');
        return;
    }

    if (password !== confirmPassword) {
        setInner('errorMsg', 'Password dan konfirmasi password harus sama.');
        show('errorMsg');
        return;
    }

    hide('errorMsg');
    showLoading('Registering...');

    const registerData = {
        username, email, fullname, password,
        "cf-turnstile-response": turnstileToken
    };

    postJSON(
        'https://asia-southeast2-ornate-course-437014-u9.cloudfunctions.net/sakha/auth/register',
        registerData,
        (response) => {
            hideLoading();
            if (response.status === 201) {
                sessionStorage.setItem('registerEmail', email);
                show('otpSection');
                hide('registerSection');
            } else {
                setInner('errorMsg', response.data.error || 'Registrasi gagal.');
                show('errorMsg');
            }
        }
    );
}); 
