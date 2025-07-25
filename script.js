document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const turnstileToken = document.querySelector('input[name="cf-turnstile-response"]')?.value;
    const termsAccepted = document.getElementById('termsCheckbox').checked;
    const errorMsg = document.getElementById('errorMsg');

    // Basic validation
    if (!username || !fullname || !password || !email) {
        errorMsg.textContent = 'Semua field wajib diisi.';
        errorMsg.style.display = 'block';
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = 'Format email tidak valid.';
        errorMsg.style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.textContent = 'Password dan konfirmasi password harus sama.';
        errorMsg.style.display = 'block';
        return;
    }

    // Terms validation
    if (!termsAccepted) {
        errorMsg.textContent = 'Anda harus menyetujui Syarat dan Ketentuan untuk melanjutkan.';
        errorMsg.style.display = 'block';
        return;
    }

    errorMsg.style.display = 'none';

    const registerData = {
        username, email, fullname, password,
        "cf-turnstile-response": turnstileToken
    };

    fetch('https://asia-southeast2-ornate-course-437014-u9.cloudfunctions.net/sakha/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.message && data.message.includes('berhasil')) {
            sessionStorage.setItem('registerEmail', email);
            document.getElementById('otpSection').style.display = 'block';
            document.getElementById('registerSection').style.display = 'none';
        } else {
            errorMsg.textContent = data.error || 'Registrasi gagal.';
            errorMsg.style.display = 'block';
        }
    })
    .catch(err => {
        console.error('Register error:', err);
        errorMsg.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
        errorMsg.style.display = 'block';
    });
}); 
