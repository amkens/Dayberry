const SUPABASE_URL = "https://dkyphuvsclfraikvimzz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreXBodXZzY2xmcmFpa3ZpbXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjA3NzUsImV4cCI6MjEwMDczNjc3NX0.8HKON11eMkbkRIakOwU-08x9AVdI45tQ3A7GfketwzM";

/* =========================================
   2. WAIT FOR PAGE TO LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Dayberry authentication initialized."
        );


        /* =====================================
           3. CHECK SUPABASE LIBRARY
        ===================================== */

        if (
            !window.supabase ||
            !window.supabase.createClient
        ) {

            console.error(
                "ERROR: Supabase library was not loaded."
            );

            return;

        }


        /* =====================================
           4. CREATE SUPABASE CLIENT
        ===================================== */

        const supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );


        console.log(
            "Supabase client created successfully."
        );


        /* =====================================
           5. GET LOGIN ELEMENTS
        ===================================== */

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        const emailInput =
            document.getElementById(
                "email"
            );


        const passwordInput =
            document.getElementById(
                "password"
            );


        const loginButton =
            document.getElementById(
                "loginButton"
            );


        const passwordToggle =
            document.getElementById(
                "passwordToggle"
            );


        const forgotPassword =
            document.getElementById(
                "forgotPassword"
            );


        /* =====================================
           6. CHECK LOGIN FORM
        ===================================== */

        if (!loginForm) {

            console.error(
                "ERROR: #loginForm was not found."
            );

            return;

        }


        console.log(
            "Login form found."
        );


        /* =====================================
           7. CREATE STATUS MESSAGE
        ===================================== */

        let statusMessage =
            document.getElementById(
                "statusMessage"
            );


        /*
            Your current login HTML doesn't
            have a status message element.

            So we create one automatically.
        */

        if (!statusMessage) {

            statusMessage =
                document.createElement(
                    "div"
                );


            statusMessage.id =
                "statusMessage";


            statusMessage.setAttribute(
                "role",
                "status"
            );


            statusMessage.setAttribute(
                "aria-live",
                "polite"
            );


            statusMessage.style.display =
                "none";


            statusMessage.style.marginTop =
                "16px";


            statusMessage.style.padding =
                "12px 16px";


            statusMessage.style.borderRadius =
                "12px";


            statusMessage.style.fontSize =
                "13px";


            statusMessage.style.lineHeight =
                "1.5";


            loginForm.appendChild(
                statusMessage
            );

        }


        /* =====================================
           8. PASSWORD VISIBILITY TOGGLE
        ===================================== */

        if (passwordToggle && passwordInput) {

            passwordToggle.addEventListener(
                "click",
                function () {

                    const isPassword =
                        passwordInput.type ===
                        "password";


                    passwordInput.type =
                        isPassword
                            ? "text"
                            : "password";


                    const icon =
                        passwordToggle.querySelector(
                            ".material-symbols-outlined"
                        );


                    if (icon) {

                        icon.textContent =
                            isPassword
                                ? "visibility_off"
                                : "visibility";

                    }


                    passwordToggle.setAttribute(
                        "aria-label",
                        isPassword
                            ? "Hide password"
                            : "Show password"
                    );

                }
            );

        }


        /* =====================================
           9. SHOW STATUS MESSAGE
        ===================================== */

        function showStatus(
            message,
            type = "info"
        ) {

            statusMessage.textContent =
                message;


            statusMessage.style.display =
                "block";


            if (type === "error") {

                statusMessage.style.background =
                    "#FFE5EC";

                statusMessage.style.color =
                    "#B60E3D";

            }


            if (type === "success") {

                statusMessage.style.background =
                    "#E8F7EF";

                statusMessage.style.color =
                    "#246B45";

            }


            if (type === "info") {

                statusMessage.style.background =
                    "#FFF1E8";

                statusMessage.style.color =
                    "#745F63";

            }

        }


        /* =====================================
           10. LOGIN FORM SUBMISSION
        ===================================== */

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                console.log(
                    "Login form submitted."
                );


                /* -----------------------------
                   GET USER INPUT
                ----------------------------- */

                const email =
                    emailInput.value.trim();


                const password =
                    passwordInput.value;


                /* -----------------------------
                   VALIDATE INPUT
                ----------------------------- */

                if (
                    !email ||
                    !password
                ) {

                    showStatus(
                        "Please enter your email and password.",
                        "error"
                    );

                    return;

                }


                /* -----------------------------
                   DISABLE BUTTON
                ----------------------------- */

                if (loginButton) {

                    loginButton.disabled =
                        true;

                    loginButton.textContent =
                        "Signing in...";

                }


                showStatus(
                    "Opening your Dayberry garden...",
                    "info"
                );


                /* =================================
                   11. SIGN IN WITH SUPABASE AUTH
                ================================= */

                try {

                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .auth
                            .signInWithPassword({

                                email:
                                    email,

                                password:
                                    password

                            });


                    /* -----------------------------
                       HANDLE AUTH ERROR
                    ----------------------------- */

                    if (error) {

                        console.error(
                            "SUPABASE LOGIN ERROR:",
                            error
                        );

                        throw error;

                    }


                    /* -----------------------------
                       CONFIRM USER
                    ----------------------------- */

                    console.log(
                        "Login successful."
                    );


                    console.log(
                        "Authenticated user:",
                        data.user
                    );


                    /* -----------------------------
                       SHOW SUCCESS
                    ----------------------------- */

                    showStatus(
                        "Welcome back to your garden! 🌷",
                        "success"
                    );


                    /* =================================
                       12. REDIRECT TO PRIVATE HOME
                    ================================= */

                    setTimeout(
                        function () {

                            window.location.href =
                                "overview.html";

                        },
                        500
                    );


                } catch (error) {

                    console.error(
                        "Authentication failed:",
                        error
                    );


                    /* -----------------------------
                       USER-FRIENDLY ERROR
                    ----------------------------- */

                    let message =
                        "We couldn't sign you in. Please check your email and password.";


                    if (
                        error &&
                        error.message
                    ) {

                        if (
                            error.message.includes(
                                "Invalid login credentials"
                            )
                        ) {

                            message =
                                "The email or password you entered is incorrect.";

                        }

                    }


                    showStatus(
                        message,
                        "error"
                    );


                    /* -----------------------------
                       RESTORE BUTTON
                    ----------------------------- */

                    if (loginButton) {

                        loginButton.disabled =
                            false;

                        loginButton.textContent =
                            "Sign in to Dayberry";

                    }

                }

            }
        );


        /* =====================================
           13. FORGOT PASSWORD
        ===================================== */

        if (forgotPassword) {

            forgotPassword.addEventListener(
                "click",
                async function (event) {

                    event.preventDefault();


                    const email =
                        emailInput.value.trim();


                    if (!email) {

                        showStatus(
                            "Enter your email address first so we can send you a password reset link.",
                            "error"
                        );

                        emailInput.focus();

                        return;

                    }


                    try {

                        const {
                            error
                        } =
                            await supabaseClient
                                .auth
                                .resetPasswordForEmail(
                                    email,
                                    {
                                        redirectTo:
                                            window.location.origin +
                                            "/reset-password.html"
                                    }
                                );


                        if (error) {

                            throw error;

                        }


                        showStatus(
                            "Password reset instructions have been sent to your email.",
                            "success"
                        );


                    } catch (error) {

                        console.error(
                            "Password reset error:",
                            error
                        );


                        showStatus(
                            "We couldn't send the password reset email. Please try again.",
                            "error"
                        );

                    }

                }
            );

        }


        /* =====================================
           14. CHECK EXISTING SESSION
        ===================================== */

        const {
            data: sessionData
        } =
            await supabaseClient
                .auth
                .getSession();


        if (
            sessionData &&
            sessionData.session
        ) {

            console.log(
                "Existing Supabase session found."
            );

        }


        /* =====================================
           15. FINAL DEBUG
        ===================================== */

        console.log(
            "Dayberry authentication setup complete."
        );

    }
);
