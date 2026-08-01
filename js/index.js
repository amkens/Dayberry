/* =========================================
   DAYBERRY — PUBLIC BIRTHDAY FORM
   index.js
========================================= */


/* =========================================
   1. SUPABASE CONFIGURATION
========================================= */

const SUPABASE_URL =
    "https://dkyphuvsclfraikvimzz.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreXBodXZzY2xmcmFpa3ZpbXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjA3NzUsImV4cCI6MjEwMDczNjc3NX0.8HKON11eMkbkRIakOwU-08x9AVdI45tQ3A7GfketwzM";


/* =========================================
   2. WAIT FOR PAGE TO LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Dayberry birthday form initialized."
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
           5. GET FORM
        ===================================== */

        const birthdayForm =
            document.getElementById(
                "birthdayForm"
            );


        /* =====================================
           6. GET FORM INPUTS
        ===================================== */

        const nameInput =
            document.getElementById(
                "name"
            );

        const monthSelect =
            document.getElementById(
                "month"
            );

        const daySelect =
            document.getElementById(
                "day"
            );

        const noteInput =
            document.getElementById(
                "note"
            );


       /* =====================================
   7. GET MESSAGE ELEMENTS
===================================== */

const birthdayError =
document.getElementById(
    "birthday-error"
);


const successScreen =
document.getElementById(
    "success-screen"
);


const doneButton =
document.getElementById(
    "done-button"
);


/* =====================================
8. DEBUG INFORMATION
===================================== */

console.log(
"Birthday form:",
birthdayForm
);

console.log(
"Name input:",
nameInput
);

console.log(
"Month dropdown:",
monthSelect
);

console.log(
"Day dropdown:",
daySelect
);

console.log(
"Note input:",
noteInput
);

console.log(
"Success screen:",
successScreen
);

console.log(
"Done button:",
doneButton
);


/* =====================================
9. CHECK FORM
===================================== */

if (!birthdayForm) {

console.error(
    "ERROR: #birthdayForm was not found."
);

return;

}


/* =====================================
10. CREATE DAY OPTIONS
===================================== */

function populateDays() {

if (!daySelect) {

    console.error(
        "ERROR: #day was not found."
    );

    return;

}


/*
    Only create days if they
    don't already exist.
*/

if (
    daySelect.options.length > 1
) {

    console.log(
        "Day options already exist."
    );

    return;

}


for (
    let day = 1;
    day <= 31;
    day++
) {

    const option =
        document.createElement(
            "option"
        );


    option.value =
        String(day);


    option.textContent =
        String(day);


    daySelect.appendChild(
        option
    );

}


console.log(
    "Day options 1–31 created."
);

}


/* =====================================
11. SHOW ERROR
===================================== */

function showError(
message
) {

if (birthdayError) {

    birthdayError.textContent =
        message;

    birthdayError.style.display =
        "block";

}


/*
    Make sure success screen
    is hidden if an error occurs.
*/

if (successScreen) {

    successScreen.style.display =
        "none";

    successScreen.setAttribute(
        "aria-hidden",
        "true"
    );

}


/*
    Make sure the form
    is visible again.
*/

birthdayForm.style.display =
    "block";

}


/* =====================================
12. SHOW SUCCESS SCREEN
===================================== */

function showSuccess() {

/*
    Hide error message
*/

if (birthdayError) {

    birthdayError.textContent =
        "";

    birthdayError.style.display =
        "none";

}


/*
    Hide the birthday form
*/

birthdayForm.style.display =
    "none";


/*
    Show success screen
*/

if (successScreen) {

    successScreen.style.display =
        "block";

    successScreen.setAttribute(
        "aria-hidden",
        "false"
    );

}

}


/* =====================================
13. SAVE BIRTHDAY
===================================== */

async function saveBirthday(
name,
month,
day,
note
) {

console.log(
    "Attempting to save birthday..."
);


console.log(
    "Data being sent:",
    {
        name: name,
        month: Number(month),
        day: Number(day),
        note: note || null
    }
);


const {
    error
} = await supabaseClient
    .from("birthdays")
    .insert({

        name:
            name,

        month:
            Number(month),

        day:
            Number(day),

        note:
            note || null

    });


/* =================================
   HANDLE SUPABASE ERROR
================================= */

if (error) {

    console.error(
        "SUPABASE INSERT ERROR:"
    );


    console.error(
        "Message:",
        error.message
    );


    console.error(
        "Details:",
        error.details
    );


    console.error(
        "Hint:",
        error.hint
    );


    console.error(
        "Code:",
        error.code
    );


    throw error;

}


/* =================================
   SUCCESS
================================= */

console.log(
    "SUCCESS! Birthday saved to Supabase."
);

}


/* =====================================
14. FORM SUBMISSION
===================================== */

birthdayForm.addEventListener(
"submit",
async function (event) {

    event.preventDefault();


    console.log(
        "Birthday form submitted."
    );


    /* =================================
       GET FORM VALUES
    ================================= */

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";


    const month =
        monthSelect
            ? monthSelect.value
            : "";


    const day =
        daySelect
            ? daySelect.value
            : "";


    const note =
        noteInput
            ? noteInput.value.trim()
            : "";


    console.log(
        "Form values:",
        {
            name,
            month,
            day,
            note
        }
    );


    /* =================================
       VALIDATE NAME
    ================================= */

    if (!name) {

        showError(
            "Please enter their name."
        );


        if (nameInput) {

            nameInput.focus();

        }


        return;

    }


    /* =================================
       VALIDATE MONTH
    ================================= */

    if (!month) {

        showError(
            "Please select their birth month."
        );


        if (monthSelect) {

            monthSelect.focus();

        }


        return;

    }


    /* =================================
       VALIDATE DAY
    ================================= */

    if (!day) {

        showError(
            "Please select their birthday."
        );


        if (daySelect) {

            daySelect.focus();

        }


        return;

    }


    /* =================================
       GET SUBMIT BUTTON
    ================================= */

    const submitButton =
        birthdayForm.querySelector(
            'button[type="submit"]'
        );


    try {

        /* -----------------------------
           DISABLE BUTTON
        ----------------------------- */

        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Planting...";

        }


        /* -----------------------------
           SAVE TO SUPABASE
        ----------------------------- */

        await saveBirthday(
            name,
            month,
            day,
            note
        );


        /* -----------------------------
           SHOW SUCCESS SCREEN
        ----------------------------- */

        showSuccess();


    } catch (error) {

        console.error(
            "FAILED TO SAVE BIRTHDAY."
        );


        console.error(
            error
        );


        showError(
            "We couldn't save this birthday right now. Please try again."
        );


    } finally {

        /* -----------------------------
           RESTORE BUTTON
        ----------------------------- */

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Add to the garden";

        }

    }

}
);


/* =====================================
15. ADD ANOTHER BIRTHDAY
===================================== */

if (
doneButton &&
successScreen
) {

doneButton.addEventListener(
    "click",
    function () {

        console.log(
            "Adding another birthday."
        );


        /*
            Hide success screen
        */

        successScreen.style.display =
            "none";

        successScreen.setAttribute(
            "aria-hidden",
            "true"
        );


        /*
            Reset form
        */

        birthdayForm.reset();


        /*
            Show form again
        */

        birthdayForm.style.display =
            "block";


        /*
            Scroll back to form
        */

        birthdayForm.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }
);

}


/* =====================================
16. INITIALIZE DAY DROPDOWN
===================================== */

populateDays();


/* =====================================
17. FINAL DEBUG
===================================== */

console.log(
"Dayberry form setup complete."
); 
}
);