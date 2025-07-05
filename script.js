// Form submission handler
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorMsg = document.getElementById('errorMsg');

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
            password: password
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Register failed');
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Register Berhasil!',
                text: 'Akun Anda telah berhasil dibuat. Silakan login.',
                confirmButtonText: 'Login',
                confirmButtonColor: '#000000',
                background: '#ffffff',
                backdrop: `
        rgba(0,0,123,0.4)
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E")
        left top
        no-repeat
      `
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'https://sakhaclothing.shop/login/';
                }
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