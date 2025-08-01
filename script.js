// JSCROOT Library Usage Examples for Register
// ===========================================

// Wait for jscroot to be ready
function waitForJscroot() {
    return new Promise((resolve) => {
        if (window.jscroot) {
            resolve();
        } else {
            document.addEventListener('jscroot-ready', resolve);
        }
    });
}

// Example 1: Form Validation using jscroot
async function validateRegisterForm() {
    await waitForJscroot();

    const username = window.jscroot.getValue('username').trim();
    const email = window.jscroot.getValue('email').trim();
    const fullname = window.jscroot.getValue('fullname').trim();
    const password = window.jscroot.getValue('password').trim();
    const confirmPassword = window.jscroot.getValue('confirmPassword').trim();
    const errorMsg = window.jscroot.getElement('errorMsg');

    // Validate required fields
    if (!username || username.trim() === '') {
        showError('Username wajib diisi.');
        return false;
    }

    if (!email || email.trim() === '') {
        showError('Email wajib diisi.');
        return false;
    }

    if (!fullname || fullname.trim() === '') {
        showError('Nama lengkap wajib diisi.');
        return false;
    }

    if (!password || password.trim() === '') {
        showError('Password wajib diisi.');
        return false;
    }

    if (!confirmPassword || confirmPassword.trim() === '') {
        showError('Konfirmasi password wajib diisi.');
        return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Format email tidak valid.');
        return false;
    }

    // Validate password
    if (password.length < 6) {
        showError('Password minimal 6 karakter.');
        return false;
    }

    // Validate minimum length for fields
    if (username.length < 3) {
        showError('Username minimal 3 karakter.');
        return false;
    }

    if (fullname.length < 2) {
        showError('Nama lengkap minimal 2 karakter.');
        return false;
    }

    // Validate password match
    if (password !== confirmPassword) {
        showError('Password dan konfirmasi password harus sama.');
        return false;
    }

    hideError();
    return true;
}

// Example 2: API calls using jscroot
async function registerWithJscroot(userData) {
    await waitForJscroot();

    let loadingElement = null;

    try {
        // Show loading
        loadingElement = document.createElement('div');
        loadingElement.innerHTML = window.jscroot.loading;
        loadingElement.style.position = 'fixed';
        loadingElement.style.top = '50%';
        loadingElement.style.left = '50%';
        loadingElement.style.transform = 'translate(-50%, -50%)';
        loadingElement.style.zIndex = '9999';
        document.body.appendChild(loadingElement);

        // Use jscroot API functions
        console.log('Sending registration data:', userData);
        const response = await new Promise((resolve) => {
            window.jscroot.postJSON(
                'https://asia-southeast2-ornate-course-437014-u9.cloudfunctions.net/sakha/auth/register',
                userData,
                resolve
            );
        });
        console.log('Registration response:', response);

        // Hide loading
        if (loadingElement && document.body.contains(loadingElement)) {
            document.body.removeChild(loadingElement);
        }

        if (response.status === 200) {
            // Set cookie for registration tracking
            window.jscroot.setCookieWithExpireHour('registration_pending', 'true', 1);

            // Get browser info for analytics
            const browserInfo = {
                isMobile: window.jscroot.isMobile()
            };

            console.log('Registration Browser Info:', browserInfo);

            // Success - show OTP form
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('otpForm').classList.remove('hidden');

            // Store email for OTP verification
            window.jscroot.setCookieWithExpireHour('pending_email', userData.email, 1);

        } else if (response.status === 409) {
            throw new Error('Username atau email sudah terdaftar. Silakan gunakan username atau email lain.');
        } else if (response.status === 400) {
            throw new Error('Data tidak valid. Pastikan semua field terisi dengan benar.');
        } else {
            throw new Error(response.data.error || 'Registration failed');
        }
    } catch (error) {
        if (loadingElement && document.body.contains(loadingElement)) {
            document.body.removeChild(loadingElement);
        }
        showError(error.message || 'Terjadi kesalahan. Silakan coba lagi.');
    }
}

// Example 3: OTP verification using jscroot
async function verifyOTPWithJscroot(otp) {
    await waitForJscroot();

    let loadingElement = null;

    try {
        // Show loading
        loadingElement = document.createElement('div');
        loadingElement.innerHTML = window.jscroot.loading;
        loadingElement.style.position = 'fixed';
        loadingElement.style.top = '50%';
        loadingElement.style.left = '50%';
        loadingElement.style.transform = 'translate(-50%, -50%)';
        loadingElement.style.zIndex = '9999';
        document.body.appendChild(loadingElement);

        const email = window.jscroot.getCookie('pending_email');
        if (!email) {
            throw new Error('Email tidak ditemukan. Silakan daftar ulang.');
        }

        const response = await new Promise((resolve) => {
            window.jscroot.postJSON(
                'https://asia-southeast2-ornate-course-437014-u9.cloudfunctions.net/sakha/auth/verify-otp',
                { email, otp },
                resolve
            );
        });

        if (loadingElement && document.body.contains(loadingElement)) {
            document.body.removeChild(loadingElement);
        }

        if (response.status === 200) {
            // Clear cookies
            window.jscroot.setCookieWithExpireHour('registration_pending', '', 0);
            window.jscroot.setCookieWithExpireHour('pending_email', '', 0);

            // Success message
            Swal.fire({
                icon: 'success',
                title: 'Registrasi Berhasil!',
                text: 'Akun Anda telah berhasil dibuat. Silakan login.',
                confirmButtonColor: '#000000',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = 'https://sakhaclothing.shop/login/';
            });
        } else {
            throw new Error(response.data.error || 'OTP verification failed');
        }
    } catch (error) {
        if (loadingElement && document.body.contains(loadingElement)) {
            document.body.removeChild(loadingElement);
        }
        showOTPError(error.message || 'Verifikasi OTP gagal.');
    }
}

// Example 4: URL parameter handling
async function handleRegisterUrlParameters() {
    await waitForJscroot();

    const queryString = window.jscroot.getQueryString();
    const redirectUrl = queryString.redirect;
    const message = queryString.message;

    if (redirectUrl) {
        console.log('Register Redirect URL:', redirectUrl);
    }

    if (message) {
        Swal.fire({
            icon: 'info',
            title: 'Pesan',
            text: decodeURIComponent(message),
            confirmButtonColor: '#000000',
            confirmButtonText: 'OK'
        });
    }
}

// Helper functions
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

function hideError() {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.classList.add('hidden');
}

function showOTPError(message) {
    const otpErrorMsg = document.getElementById('otpErrorMsg');
    otpErrorMsg.textContent = message;
    otpErrorMsg.classList.remove('hidden');
}

// Initialize jscroot features
async function initializeJscrootFeatures() {
    await waitForJscroot();

    // Handle URL parameters
    await handleRegisterUrlParameters();

    // Log browser information
    console.log('Register Is Mobile:', window.jscroot.isMobile());

    // Check if user is already registered
    const registrationPending = window.jscroot.getCookie('registration_pending');
    if (registrationPending === 'true') {
        console.log('Registration pending, showing OTP form');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('otpForm').classList.remove('hidden');
    }
}

// Original register form handler with jscroot integration
async function setupRegisterForm() {
    await waitForJscroot();

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Use jscroot validation
            if (!(await validateRegisterForm())) {
                return;
            }

            const username = window.jscroot.getValue('username').trim();
            const email = window.jscroot.getValue('email').trim();
            const fullname = window.jscroot.getValue('fullname').trim();
            const password = window.jscroot.getValue('password').trim();
            const confirmPassword = window.jscroot.getValue('confirmPassword').trim();
            const turnstileToken = document.querySelector('input[name="cf-turnstile-response"]')?.value;
            const termsAccepted = document.getElementById('termsCheckbox').checked;

            if (!termsAccepted) {
                showError('Anda harus menyetujui Syarat dan Ketentuan untuk melanjutkan.');
                return;
            }

            if (!turnstileToken) {
                showError('CAPTCHA wajib diisi.');
                return;
            }

            // Use jscroot register function
            const userData = {
                username: username,
                email: email,
                fullname: fullname,
                password: password,
                confirm_password: confirmPassword,
                "cf-turnstile-response": turnstileToken
            };

            // Validate data before sending
            if (!username || !email || !fullname || !password || !confirmPassword || !turnstileToken) {
                showError('Semua field harus diisi dengan benar.');
                return;
            }

            console.log('Form data validated, sending registration request...');
            await registerWithJscroot(userData);
        });
    }
}

// OTP form handler with jscroot integration
async function setupOTPForm() {
    await waitForJscroot();

    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const otp = window.jscroot.getValue('otp').trim();

            if (!otp || otp.trim() === '') {
                showOTPError('Kode OTP wajib diisi.');
                return;
            }

            if (otp.length !== 6) {
                showOTPError('Kode OTP harus 6 digit.');
                return;
            }

            await verifyOTPWithJscroot(otp);
        });
    }
}

// Resend OTP handler
async function setupResendOTP() {
    await waitForJscroot();

    const resendOtpBtn = document.getElementById('resendOtpBtn');
    if (resendOtpBtn) {
        resendOtpBtn.addEventListener('click', async function () {
            let loadingElement = null;

            try {
                // Show loading
                loadingElement = document.createElement('div');
                loadingElement.innerHTML = window.jscroot.loading;
                loadingElement.style.position = 'fixed';
                loadingElement.style.top = '50%';
                loadingElement.style.left = '50%';
                loadingElement.style.transform = 'translate(-50%, -50%)';
                loadingElement.style.zIndex = '9999';
                document.body.appendChild(loadingElement);

                const email = window.jscroot.getCookie('pending_email');
                if (!email) {
                    throw new Error('Email tidak ditemukan.');
                }

                const response = await new Promise((resolve) => {
                    window.jscroot.postJSON(
                        'https://asia-southeast2-ornate-course-437014-u9.cloudfunctions.net/sakha/auth/resend-otp',
                        { email },
                        resolve
                    );
                });

                if (loadingElement && document.body.contains(loadingElement)) {
                    document.body.removeChild(loadingElement);
                }

                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'OTP Terkirim',
                        text: 'Kode OTP baru telah dikirim ke email Anda.',
                        confirmButtonColor: '#000000',
                        confirmButtonText: 'OK'
                    });
                } else {
                    throw new Error(response.data.error || 'Gagal mengirim OTP');
                }
            } catch (error) {
                if (loadingElement && document.body.contains(loadingElement)) {
                    document.body.removeChild(loadingElement);
                }
                showOTPError(error.message || 'Gagal mengirim ulang OTP.');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Initialize jscroot features
        await initializeJscrootFeatures();

        // Setup register form
        await setupRegisterForm();

        // Setup OTP form
        await setupOTPForm();

        // Setup resend OTP
        await setupResendOTP();

    } catch (error) {
        console.error('Error initializing register:', error);
    }
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
