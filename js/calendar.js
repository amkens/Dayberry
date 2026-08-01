/* =========================================================
   DAYBERRY
   Calendar Page
========================================================= */


/* =========================================================
   1. SUPABASE CLIENT
========================================================= */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =========================================================
   2. DOM ELEMENTS
========================================================= */

// Calendar

const calendarGrid =
    document.getElementById("calendarGrid");

const currentMonthLabel =
    document.getElementById("currentMonthLabel");

const previousMonthButton =
    document.getElementById("previousMonthBtn");

const nextMonthButton =
    document.getElementById("nextMonthBtn");


// Summary Cards

const nextBirthdayName =
    document.getElementById("nextBirthdayName");

const nextBirthdayCountdown =
    document.getElementById("nextBirthdayCountdown");

const todayBirthdayCount =
    document.getElementById("todayBirthdayCount");


// Selected Day

const selectedDayPanel =
    document.getElementById("selectedDayPanel");

const selectedDayBirthdays =
    document.getElementById("selectedDayBirthdays");


// Upcoming Birthdays

const upcomingBirthdaysList =
    document.getElementById("upcomingBirthdaysList");


// Empty / Loading

const calendarLoading =
    document.getElementById("calendarLoading");

const calendarEmptyState =
    document.getElementById("calendarEmptyState");


/* =========================================================
   3. GLOBAL VARIABLES
========================================================= */

let birthdayRecords = [];

const today =
    new Date();

let currentMonth =
    today.getMonth();

let currentYear =
    today.getFullYear();


/* =========================================================
   4. INITIALIZE PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeCalendar
);


async function initializeCalendar() {

    console.log(
        "🌸 Loading Dayberry Calendar..."
    );

    const user =
        await checkAuthentication();

    if (!user) {

        return;

    }

    setupMonthNavigation();

    await loadBirthdays();

}


/* =========================================================
   5. CHECK AUTHENTICATION
========================================================= */

async function checkAuthentication() {

    try {

        const {

            data,
            error

        } =
            await supabaseClient
                .auth
                .getSession();

        if (
            error ||
            !data.session
        ) {

            window.location.href =
                "login.html";

            return null;

        }

        return data.session.user;

    }

    catch (error) {

        console.error(error);

        window.location.href =
            "login.html";

        return null;

    }

}


/* =========================================================
   6. LOAD BIRTHDAYS
========================================================= */

async function loadBirthdays() {

    showLoading();

    try {

        const {

            data,
            error

        } =
            await supabaseClient
                .from("birthdays")
                .select("*")
                .order(
                    "month",
                    {
                        ascending: true
                    }
                )
                .order(
                    "day",
                    {
                        ascending: true
                    }
                );

        if (error) {

            throw error;

        }

        birthdayRecords =
            data || [];

        hideLoading();

        renderCalendar();

        renderTodayBirthdays();

        renderNextBirthday();

        renderUpcomingBirthdays();

    }

    catch (error) {

        console.error(error);

        hideLoading();

    }

}


/* =========================================================
   7. LOADING HELPERS
========================================================= */

function showLoading() {

    if (calendarLoading) {

        calendarLoading.classList.remove(
            "hidden"
        );

    }

}


function hideLoading() {

    if (calendarLoading) {

        calendarLoading.classList.add(
            "hidden"
        );

    }

}
/* =========================================================
   8. MONTH NAVIGATION
========================================================= */

function setupMonthNavigation() {

    previousMonthButton.addEventListener(
        "click",
        () => {

            currentMonth--;

            if (currentMonth < 0) {

                currentMonth = 11;
                currentYear--;

            }

            renderCalendar();

        }
    );


    nextMonthButton.addEventListener(
        "click",
        () => {

            currentMonth++;

            if (currentMonth > 11) {

                currentMonth = 0;
                currentYear++;

            }

            renderCalendar();

        }
    );

}


/* =========================================================
   9. RENDER CALENDAR
========================================================= */

function renderCalendar() {

    calendarGrid.innerHTML = "";

    const monthNames = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    currentMonthLabel.textContent =
        `${monthNames[currentMonth]} ${currentYear}`;


    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        );


    const lastDay =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        );


    const firstWeekday =
        firstDay.getDay();

    const totalDays =
        lastDay.getDate();



    /* ============================
       Empty cells
    ============================ */

    for (

        let i = 0;

        i < firstWeekday;

        i++

    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "calendar-empty";

        calendarGrid.appendChild(
            empty
        );

    }



    /* ============================
       Calendar Days
    ============================ */

    for (

        let day = 1;

        day <= totalDays;

        day++

    ) {

        const dayCell =
            document.createElement("div");

        dayCell.className =
            "calendar-day";



        /* --------------------------
           Day Number
        -------------------------- */

        const number =
            document.createElement("span");

        number.className =
            "calendar-day-number";

        number.textContent =
            day;

        dayCell.appendChild(number);



        /* --------------------------
           Today
        -------------------------- */

        if (

            currentYear === today.getFullYear()

            &&

            currentMonth === today.getMonth()

            &&

            day === today.getDate()

        ) {

            dayCell.classList.add(
                "today"
            );

        }



        /* --------------------------
           Birthdays
        -------------------------- */

        const birthdays =

            birthdayRecords.filter(

                birthday =>

                    Number(birthday.month) === currentMonth + 1

                    &&

                    Number(birthday.day) === day

            );



        if (

            birthdays.length > 0

        ) {

            dayCell.classList.add(
                "birthday-day"
            );



            const cake =
                document.createElement("div");

            cake.className =
                "birthday-cake";

            cake.textContent =
                "🎂";

            dayCell.appendChild(cake);



            dayCell.addEventListener(

                "click",

                () => {

                    document

                        .querySelectorAll(
                            ".calendar-day"
                        )

                        .forEach(

                            cell =>

                                cell.classList.remove(
                                    "selected"
                                )

                        );



                    dayCell.classList.add(
                        "selected"
                    );



                    showSelectedDay(

                        day,

                        birthdays

                    );

                }

            );

        }

        else {

            const strawberry =
                document.createElement("div");

            strawberry.className =
                "calendar-strawberry";

            strawberry.textContent =
                "🍓";

            dayCell.appendChild(
                strawberry
            );

        }



        calendarGrid.appendChild(
            dayCell
        );

    }

}
/* =========================================================
   10. SHOW SELECTED DAY
========================================================= */

function showSelectedDay(day, birthdays) {

    if (!selectedDayPanel) return;

    selectedDayPanel.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

    selectedDayBirthdays.innerHTML = "";

    const monthName = new Date(

        currentYear,
        currentMonth,
        day

    ).toLocaleString("en-US", {

        month: "long"

    });


    birthdays.forEach(birthday => {

        const card = document.createElement("div");

        card.className = "birthday-person-card";

        card.innerHTML = `

            <div class="birthday-person-name">

                🎂 ${birthday.name}

            </div>

            <div class="birthday-person-relation">

                ${birthday.relationship || "Birthday"}

            </div>

            ${birthday.note
                ? `<div class="birthday-person-note">${birthday.note}</div>`
                : ""
            }

        `;

        selectedDayBirthdays.appendChild(card);

    });

}


/* =========================================================
   11. TODAY'S BIRTHDAYS
========================================================= */

function renderTodayBirthdays() {

    const birthdaysToday = birthdayRecords.filter(

        birthday =>

            Number(birthday.month) === today.getMonth() + 1 &&

            Number(birthday.day) === today.getDate()

    );

    todayBirthdayCount.textContent =
        birthdaysToday.length;

}


/* =========================================================
   12. NEXT BIRTHDAY
========================================================= */

function renderNextBirthday() {

    if (birthdayRecords.length === 0) {

        nextBirthdayName.textContent =
            "No birthdays";

        nextBirthdayCountdown.textContent =
            "Add one to get started.";

        return;

    }

    let nearest = null;

    let nearestDifference = Infinity;

    birthdayRecords.forEach(birthday => {

        let date = new Date(

            currentYear,

            birthday.month - 1,

            birthday.day

        );

        if (date < today) {

            date.setFullYear(currentYear + 1);

        }

        const difference = Math.ceil(

            (date - today)

            / 86400000

        );

        if (difference < nearestDifference) {

            nearestDifference = difference;

            nearest = birthday;

        }

    });

    nextBirthdayName.textContent =
        nearest.name;

    if (nearestDifference === 0) {

        nextBirthdayCountdown.textContent =
            "🎉 Today!";

    }

    else if (nearestDifference === 1) {

        nextBirthdayCountdown.textContent =
            "Tomorrow";

    }

    else {

        nextBirthdayCountdown.textContent =
            `${nearestDifference} days left`;

    }

}


/* =========================================================
   13. UPCOMING BIRTHDAYS
========================================================= */

function renderUpcomingBirthdays() {

    upcomingBirthdaysList.innerHTML = "";

    if (birthdayRecords.length === 0) {

        upcomingBirthdaysList.innerHTML =

        "<p>No upcoming birthdays.</p>";

        return;

    }

    const sorted = [...birthdayRecords].sort(

        (a, b) => {

            const first =

                new Date(

                    currentYear,

                    a.month - 1,

                    a.day

                );

            const second =

                new Date(

                    currentYear,

                    b.month - 1,

                    b.day

                );

            return first - second;

        }

    );

    sorted.slice(0, 5).forEach(birthday => {

        const item = document.createElement("div");

        item.className =
            "upcoming-birthday-card";

        const month = new Date(

            currentYear,

            birthday.month - 1

        ).toLocaleString(

            "en-US",

            {

                month: "short"

            }

        );

        item.innerHTML = `

            <div>

                <strong>${birthday.name}</strong>

                <p>${birthday.relationship || ""}</p>

            </div>

            <span>

                ${birthday.day} ${month}

            </span>

        `;

        upcomingBirthdaysList.appendChild(item);

    });

}