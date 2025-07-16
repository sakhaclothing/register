// Form submission handler
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorMsg = document.getElementById('errorMsg');
    const turnstileToken = document.querySelector('input[name="cf-turnstile-response"]')?.value;

    // Validate all fields are not empty
    if (!username) {
        errorMsg.textContent = 'Username wajib diisi.';
        errorMsg.classList.remove('hidden');
        return;
    }

    if (!email) {
        errorMsg.textContent = 'Email wajib diisi.';
        errorMsg.classList.remove('hidden');
        return;
    }

    if (!fullname) {
        errorMsg.textContent = 'Nama lengkap wajib diisi.';
        errorMsg.classList.remove('hidden');
        return;
    }

    if (!password) {
        errorMsg.textContent = 'Password wajib diisi.';
        errorMsg.classList.remove('hidden');
        return;
    }

    if (!confirmPassword) {
        errorMsg.textContent = 'Konfirmasi password wajib diisi.';
        errorMsg.classList.remove('hidden');
        return;
    }

    if (!turnstileToken) {
        errorMsg.textContent = 'CAPTCHA wajib diisi.';
        errorMsg.classList.remove('hidden');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMsg.textContent = 'Format email tidak valid.';
        errorMsg.classList.remove('hidden');
        return;
    }

    // Validate minimum length for fields
    if (username.length < 3) {
        errorMsg.textContent = 'Username minimal 3 karakter.';
        errorMsg.classList.remove('hidden');
        return;
    }

    if (fullname.length < 2) {
        errorMsg.textContent = 'Nama lengkap minimal 2 karakter.';
        errorMsg.classList.remove('hidden');
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = 'Password minimal 6 karakter.';
        errorMsg.classList.remove('hidden');
        return;
    }

    // Validate password match
    if (password !== confirmPassword) {
        errorMsg.textContent = 'Password dan konfirmasi password harus sama.';
        errorMsg.classList.remove('hidden');
        return;
    }

    // Hide error message if all validations pass
    errorMsg.classList.add('hidden');

    // Register API call using fetch
    fetch('https://asia-southeast2-ornate-course-437014-u9.cloudfunctions.net/sakha/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            fullname: fullname,
            password: password,
            "cf-turnstile-response": turnstileToken
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Register failed');
            }
            return response.json();
        })
        .then(data => {
            // Tampilkan form OTP, sembunyikan form register
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('otpForm').classList.remove('hidden');
            // Simpan email ke sessionStorage untuk verifikasi OTP
            sessionStorage.setItem('registerEmail', email);
            Swal.fire({
                icon: 'success',
                title: 'Register Berhasil!',
                text: 'Kode OTP telah dikirim ke email Anda. Silakan verifikasi.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#000000',
                background: '#ffffff'
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Register Gagal!',
                text: 'Username mungkin sudah digunakan atau terjadi kesalahan.',
                confirmButtonText: 'Coba Lagi',
                confirmButtonColor: '#000000',
                background: '#ffffff'
            });
        });
});

// Show/hide password logic
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePassword = document.getElementById('togglePassword');
const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
const eyeOpen = document.getElementById('eyeOpen');
const eyeClosed = document.getElementById('eyeClosed');
const eyeOpenConfirm = document.getElementById('eyeOpenConfirm');
const eyeClosedConfirm = document.getElementById('eyeClosedConfirm');
let passwordVisible = false;

function setPasswordVisibility(visible) {
    passwordInput.type = visible ? 'text' : 'password';
    confirmPasswordInput.type = visible ? 'text' : 'password';
    if (visible) {
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
        eyeOpenConfirm.classList.add('hidden');
        eyeClosedConfirm.classList.remove('hidden');
    } else {
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
        eyeOpenConfirm.classList.remove('hidden');
        eyeClosedConfirm.classList.add('hidden');
    }
}

togglePassword.addEventListener('click', function () {
    passwordVisible = !passwordVisible;
    setPasswordVisibility(passwordVisible);
});

toggleConfirmPassword.addEventListener('click', function () {
    passwordVisible = !passwordVisible;
    setPasswordVisibility(passwordVisible);
});

// OTP form handler
const otpForm = document.getElementById('otpForm');
otpForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const otp = document.getElementById('otp').value.trim();
    const otpErrorMsg = document.getElementById('otpErrorMsg');
    const email = sessionStorage.getItem('registerEmail');
    if (!otp) {
        otpErrorMsg.textContent = 'Kode OTP wajib diisi.';
        otpErrorMsg.classList.remove('hidden');
        return;
    }
    otpErrorMsg.classList.add('hidden');
    fetch('https://asia-southeast2-ornate-course-437014-u9.cloudfunctions.net/sakha/auth/verify-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            otp: otp
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message && data.message.includes('berhasil')) {
                Swal.fire({
                    icon: 'success',
                    title: 'Verifikasi Berhasil!',
                    text: 'Email Anda berhasil diverifikasi. Silakan login.',
                    confirmButtonText: 'Login',
                    confirmButtonColor: '#000000',
                    background: '#ffffff'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'https://sakhaclothing.shop/login/';
                    }
                });
            } else {
                otpErrorMsg.textContent = data.error || 'OTP salah atau sudah expired.';
                otpErrorMsg.classList.remove('hidden');
            }
        })
        .catch(error => {
            otpErrorMsg.textContent = 'Terjadi kesalahan. Coba lagi.';
            otpErrorMsg.classList.remove('hidden');
        });
}); 