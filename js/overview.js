/* =========================================================
   DAYBERRY — OVERVIEW DASHBOARD LOGIC
   File: js/overview.js

   Responsibilities:
   1. Protect the private creator dashboard
   2. Check Supabase authentication
   3. Load birthday records
   4. Calculate dashboard statistics
   5. Display upcoming birthdays
   6. Handle navigation
   7. Handle logout
========================================================= */


/*
    Create the Supabase client.

    NOTE:

    If auth.js already creates a global Supabase client,
    we may later centralize this into one shared file.

    For now, this keeps overview.js independent.
*/

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =========================================================
   2. DOM ELEMENTS
========================================================= */

const totalBirthdaysElement =
    document.getElementById("totalBirthdays");

const thisMonthElement =
    document.getElementById("thisMonth");

const nextBirthdayNameElement =
    document.getElementById("nextBirthdayName");

const nextBirthdayDateElement =
    document.getElementById("nextBirthdayDate");

const upcomingBirthdaysElement =
    document.getElementById("upcomingBirthdays");

const logoutButton =
    document.getElementById("logoutButton");

const userEmailElement =
    document.getElementById("userEmail");


/* =========================================================
   3. PAGE INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeOverview
);


/* =========================================================
   4. INITIALIZE OVERVIEW
========================================================= */

async function initializeOverview() {

    console.log(
        "Dayberry overview initializing..."
    );


    /*
        Check authentication.

        If the creator is not logged in,
        they will be redirected to login.html.
    */

    const user =
        await checkAuthentication();


    if (!user) {

        return;

    }


    /*
        Display user information
        if the HTML contains a userEmail element.
    */

    displayUserInformation(user);


    /*
        Load birthday records
        from Supabase.
    */

    await loadBirthdayData();


    /*
        Setup logout
        if a logout button exists.
    */

    setupLogout();


    console.log(
        "Dayberry overview ready."
    );

}


/* =========================================================
   5. CHECK AUTHENTICATION
========================================================= */

async function checkAuthentication() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Authentication check failed:",
                error
            );

            window.location.href =
                "login.html";

            return null;

        }


        const session =
            data.session;


        if (!session) {

            console.warn(
                "No active session. Redirecting to login..."
            );

            window.location.href =
                "login.html";

            return null;

        }


        console.log(
            "Authenticated user:",
            session.user.email
        );


        return session.user;

    }

    catch (error) {

        console.error(
            "Unexpected authentication error:",
            error
        );

        window.location.href =
            "login.html";

        return null;

    }

}


/* =========================================================
   6. DISPLAY USER INFORMATION
========================================================= */

function displayUserInformation(user) {

    if (
        userEmailElement &&
        user.email
    ) {

        userEmailElement.textContent =
            user.email;

    }

}


/* =========================================================
   7. LOAD BIRTHDAY DATA
========================================================= */

async function loadBirthdayData() {

    console.log(
        "Loading birthdays from Supabase..."
    );


    try {

        const {
            data: birthdays,
            error
        } = await supabaseClient
            .from("birthdays")
            .select("*");

        console.log(error);
        console.log(birthdays);

        if (error) {

            console.error(
                "Failed to load birthdays:",
                error
            );

            showDashboardError(
                "We couldn't load your birthday garden right now."
            );

            return;

        }


        /*
            Make sure we always work
            with an array.
        */

        const birthdayRecords =
            birthdays || [];


        console.log(
            "Birthdays loaded:",
            birthdayRecords
        );


        /*
            1. Total birthdays
        */

        updateTotalBirthdayCount(
            birthdayRecords
        );


        /*
            2. This month's birthdays
        */

        updateThisMonthCount(
            birthdayRecords
        );


        /*
            3. Calculate upcoming birthdays
        */

        const upcomingBirthdays =
            getUpcomingBirthdays(
                birthdayRecords
            );


        /*
            4. Display next birthday
        */

        displayNextBirthday(
            upcomingBirthdays
        );


        /*
            5. Display upcoming birthday cards
        */

        displayUpcomingBirthdays(
            upcomingBirthdays
        );

    }

    catch (error) {

        console.error(
            "Unexpected birthday loading error:",
            error
        );

        showDashboardError(
            "Something went wrong while loading your birthdays."
        );

    }

}


/* =========================================================
   8. UPDATE TOTAL BIRTHDAY COUNT
========================================================= */

function updateTotalBirthdayCount(
    birthdays
) {

    if (
        !totalBirthdaysElement
    ) {

        console.warn(
            "#totalBirthdays was not found."
        );

        return;

    }


    totalBirthdaysElement.textContent =
        birthdays.length;

}


/* =========================================================
   9. UPDATE THIS MONTH COUNT
========================================================= */

function updateThisMonthCount(
    birthdays
) {

    if (
        !thisMonthElement
    ) {

        console.warn(
            "#thisMonth was not found."
        );

        return;

    }


    /*
        JavaScript months:

        January = 0
        February = 1
        ...
        December = 11

        Your Supabase month values:

        January = 1
        February = 2
        ...
        December = 12
    */

    const currentMonth =
        new Date().getMonth() + 1;


    const thisMonthBirthdays =
        birthdays.filter(
            birthday => {

                return Number(
                    birthday.month
                ) === currentMonth;

            }
        );


    thisMonthElement.textContent =
        thisMonthBirthdays.length;


    console.log(
        "Birthdays this month:",
        thisMonthBirthdays.length
    );

}


/* =========================================================
   10. CALCULATE UPCOMING BIRTHDAYS
========================================================= */

function getUpcomingBirthdays(
    birthdays
) {

    const today =
        new Date();


    const currentYear =
        today.getFullYear();


    /*
        Create today's date
        without time.
    */

    const todayOnly =
        new Date(
            currentYear,
            today.getMonth(),
            today.getDate()
        );


    /*
        Convert birthday records
        into upcoming dates.
    */

    const upcoming =
        birthdays
            .map(
                birthday => {

                    const day =
                        Number(
                            birthday.day
                        );


                    const month =
                        Number(
                            birthday.month
                        );


                    /*
                        Ignore invalid records.
                    */

                    if (
                        !day ||
                        !month
                    ) {

                        return null;

                    }


                    /*
                        Create birthday
                        for current year.
                    */

                    let birthdayDate =
                        new Date(
                            currentYear,
                            month - 1,
                            day
                        );


                    /*
                        If birthday already
                        happened this year,
                        move it to next year.
                    */

                    if (
                        birthdayDate <
                        todayOnly
                    ) {

                        birthdayDate =
                            new Date(
                                currentYear + 1,
                                month - 1,
                                day
                            );

                    }


                    return {

                        ...birthday,

                        birthdayDate

                    };

                }
            )
            .filter(
                birthday =>
                    birthday !== null
            );


    /*
        Sort from nearest
        to furthest.
    */

    upcoming.sort(
        (
            first,
            second
        ) => {

            return (
                first.birthdayDate -
                second.birthdayDate
            );

        }
    );


    /*
        Return the first 5 birthdays.
    */

    return upcoming.slice(
        0,
        5
    );

}


/* =========================================================
   11. DISPLAY NEXT BIRTHDAY
========================================================= */

function displayNextBirthday(
    upcomingBirthdays
) {

    if (
        !nextBirthdayNameElement ||
        !nextBirthdayDateElement
    ) {

        console.warn(
            "Next birthday elements were not found."
        );

        return;

    }


    /*
        No birthdays.
    */

    if (
        upcomingBirthdays.length === 0
    ) {

        nextBirthdayNameElement.textContent =
            "No birthdays yet";


        nextBirthdayDateElement.textContent =
            "Your garden is waiting for its first bloom.";


        return;

    }


    /*
        The first birthday
        is the nearest upcoming one.
    */

    const nextBirthday =
        upcomingBirthdays[0];


    /*
        Display name.
    */

    nextBirthdayNameElement.textContent =
        nextBirthday.name ||
        "Upcoming birthday";


    /*
        Display date.
    */

    nextBirthdayDateElement.textContent =
        formatBirthdayDate(
            nextBirthday.birthdayDate
        );

}


/* =========================================================
   12. DISPLAY UPCOMING BIRTHDAY LIST
========================================================= */

function displayUpcomingBirthdays(
    birthdays
) {

    if (
        !upcomingBirthdaysElement
    ) {

        console.warn(
            "#upcomingBirthdays was not found."
        );

        return;

    }


    /*
        Clear the placeholder.
    */

    upcomingBirthdaysElement.innerHTML =
        "";


    /*
        No birthdays.
    */

    if (
        birthdays.length === 0
    ) {

        upcomingBirthdaysElement.innerHTML = `

            <div class="glass-card
                        rounded-2xl
                        p-6
                        text-center">

                <span class="material-symbols-outlined
                             text-4xl
                             text-strawberry-red/40
                             mb-3">

                    local_florist

                </span>


                <p class="font-display
                          text-xl
                          font-semibold
                          mb-2">

                    Your garden is waiting

                </p>


                <p class="text-sm
                          text-on-surface-variant/70">

                    Birthdays added through your
                    public form will appear here.

                </p>

            </div>

        `;

        return;

    }


    /*
        Create cards.
    */

    birthdays.forEach(
        birthday => {

            const card =
                document.createElement(
                    "div"
                );


            card.className = `
                glass-card
                rounded-2xl
                p-6
                flex
                items-center
                justify-between
            `;


            const formattedDate =
                formatBirthdayDate(
                    birthday.birthdayDate
                );


            card.innerHTML = `

                <div>

                    <h3 class="
                        font-display
                        text-xl
                        font-semibold
                    ">

                        ${escapeHTML(
                birthday.name ||
                "Unnamed"
            )}

                    </h3>


                    <p class="
                        text-sm
                        text-on-surface-variant/70
                        mt-1
                    ">

                        ${formattedDate}

                    </p>

                </div>


                <span class="
                    material-symbols-outlined
                    text-strawberry-red
                ">

                    cake

                </span>

            `;


            upcomingBirthdaysElement.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   13. FORMAT BIRTHDAY DATE
========================================================= */

function formatBirthdayDate(
    date
) {

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long"
        }
    );

}


/* =========================================================
   14. ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}


/* =========================================================
   15. LOGOUT
========================================================= */

function setupLogout() {

    if (
        !logoutButton
    ) {

        return;

    }


    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                const {
                    error
                } =
                    await supabaseClient
                        .auth
                        .signOut();


                if (error) {

                    console.error(
                        "Logout failed:",
                        error
                    );

                    showDashboardError(
                        "We couldn't sign you out. Please try again."
                    );

                    return;

                }


                window.location.href =
                    "login.html";

            }

            catch (error) {

                console.error(
                    "Unexpected logout error:",
                    error
                );

                showDashboardError(
                    "Something went wrong while signing out."
                );

            }

        }
    );

}


/* =========================================================
   16. DASHBOARD ERROR
========================================================= */

function showDashboardError(
    message
) {

    const errorElement =
        document.getElementById(
            "dashboardError"
        );


    if (
        errorElement
    ) {

        errorElement.textContent =
            message;

        errorElement.style.display =
            "block";

        return;

    }


    console.error(
        message
    );

}


/* =========================================================
   17. AUTH STATE MONITOR
========================================================= */

supabaseClient
    .auth
    .onAuthStateChange(
        (
            event,
            session
        ) => {

            console.log(
                "Auth state changed:",
                event
            );


            if (
                !session &&
                window.location.pathname.includes(
                    "overview.html"
                )
            ) {

                window.location.href =
                    "login.html";

            }

        }
    );