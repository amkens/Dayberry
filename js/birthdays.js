/*
=========================================================
DAYBERRY
Birthdays Page

Part 1
-----------------------------------------
• Supabase
• DOM Elements
• Global State
• Initialization
• Authentication
• Loading Birthdays
• Statistics
• Search
• Month Filters
=========================================================
*/


/* =========================================================
   1. CREATE SUPABASE CLIENT
========================================================= */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =========================================================
   2. DOM ELEMENTS
========================================================= */

/* ---------- View Buttons ---------- */

const calendarViewButton =
    document.getElementById(
        "calendarViewBtn"
    );

const listViewButton =
    document.getElementById(
        "listViewBtn"
    );


/* ---------- Views ---------- */

const calendarViewElement =
    document.getElementById(
        "calendarView"
    );

const listViewElement =
    document.getElementById(
        "listView"
    );


/* ---------- Containers ---------- */

const calendarGridElement =
    document.getElementById(
        "calendarGrid"
    );

const birthdayListElement =
    document.getElementById(
        "birthdayList"
    );


/* ---------- Statistics ---------- */

const totalBirthdaysElement =
    document.getElementById(
        "totalBirthdays"
    );

const monthBirthdaysElement =
    document.getElementById(
        "monthBirthdays"
    );


/* ---------- Calendar ---------- */

const calendarTitleElement =
    document.getElementById(
        "calendarTitle"
    );

const calendarSubtitleElement =
    document.getElementById(
        "calendarSubtitle"
    );


/* ---------- Month Filters ---------- */

const monthFiltersElement =
    document.getElementById(
        "monthFilters"
    );


/* ---------- States ---------- */

const loadingStateElement =
    document.getElementById(
        "loadingState"
    );

const emptyStateElement =
    document.getElementById(
        "emptyState"
    );

const errorStateElement =
    document.getElementById(
        "errorState"
    );

const errorMessageElement =
    document.getElementById(
        "errorMessage"
    );

const noSearchResultsElement =
    document.getElementById(
        "noSearchResults"
    );


/* ---------- Buttons ---------- */

const retryButton =
    document.getElementById(
        "retryBtn"
    );

const addBirthdayButton =
    document.getElementById(
        "addBirthdayBtn"
    );

const emptyAddButton =
    document.getElementById(
        "emptyAddBtn"
    );


/* =========================================================
   3. GLOBAL STATE
========================================================= */

/*
    Every birthday loaded from Supabase.
*/

let birthdayRecords = [];


/*
    Records after search/filter.
*/

let filteredBirthdays = [];


/*
    Default page view.
*/

let currentView =
    "calendar";


/*
    Selected month.

    "all" means every month.
*/

let selectedMonth =
    "all";


/* =========================================================
   4. PAGE INITIALIZATION
========================================================= */

document.addEventListener(

    "DOMContentLoaded",

    initializeBirthdays

);


/* =========================================================
   5. INITIALIZE PAGE
========================================================= */

async function initializeBirthdays() {

    console.log(
        "Dayberry Birthdays initializing..."
    );


    /*
        Verify authentication.
    */

    const user =
        await checkAuthentication();


    if (!user) {

        return;

    }


    /*
        Setup controls.
    */

    setupMonthFilters();

    setupRetryButton();


    /*
        Load data.
    */

    await loadBirthdays();


    console.log(
        "Birthdays ready."
    );

}


/* =========================================================
   6. AUTHENTICATION
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


        if (error) {

            console.error(
                error
            );

            window.location.href =
                "login.html";

            return null;

        }


        if (!data.session) {

            window.location.href =
                "login.html";

            return null;

        }


        return data.session.user;

    }

    catch (error) {

        console.error(
            error
        );

        window.location.href =
            "login.html";

        return null;

    }

}


/* =========================================================
   7. LOAD BIRTHDAYS
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

                .select("*");


        if (error) {

            throw error;

        }


        birthdayRecords =
            data || [];


        filteredBirthdays =
            [...birthdayRecords];


        updateStatistics();


        hideAllStates();


        /*
            Part 2

            These functions
            will be created later.
        */



        renderCurrentView();

    }

    catch (error) {

        console.error(
            error
        );

        showError(
            "We couldn't load your birthday garden."
        );

    }

}


/* =========================================================
   8. STATISTICS
========================================================= */

function updateStatistics() {

    totalBirthdaysElement.textContent =
        birthdayRecords.length;

    const currentMonth =
        new Date().getMonth() + 1;

    const monthCount =
        birthdayRecords.filter(

            birthday =>

                Number(birthday.month) === currentMonth

        ).length;

    monthBirthdaysElement.textContent =
        monthCount;

}

/* =========================================================
   10. MONTH FILTERS
========================================================= */

function setupMonthFilters() {

    /*
        Month buttons
        will be generated
        in Part 2.
    */

}


/* =========================================================
   11. RETRY BUTTON
========================================================= */

function setupRetryButton() {

    if (!retryButton) {

        return;

    }


    retryButton.addEventListener(

        "click",

        loadBirthdays

    );

}


/* =========================================================
   12. PAGE STATES
========================================================= */

function showLoading() {

    hideAllStates();

    loadingStateElement.classList.remove(
        "hidden"
    );

}


function showEmpty() {

    hideAllStates();

    emptyStateElement.classList.remove(
        "hidden"
    );

}


function showSearchEmpty() {

    hideAllStates();

    noSearchResultsElement.classList.remove(
        "hidden"
    );

}


function showError(message) {

    hideAllStates();

    errorMessageElement.textContent =
        message;

    errorStateElement.classList.remove(
        "hidden"
    );

}


function hideAllStates() {

    loadingStateElement.classList.add(
        "hidden"
    );

    emptyStateElement.classList.add(
        "hidden"
    );

    errorStateElement.classList.add(
        "hidden"
    );

    noSearchResultsElement.classList.add(
        "hidden"
    );

}

/* =========================================================
   8. VIEW STATE
========================================================= */

let currentMonthFilter = null;
let currentSearch = "";


/* =========================================================
   9. INITIALIZE CONTROLS
========================================================= */

function initializeControls() {

    setupViewToggle();


}


/* =========================================================
   10. VIEW TOGGLE
========================================================= */

function setupViewToggle() {

    if (
        !calendarViewButton ||
        !listViewButton
    ) {

        return;

    }


    calendarViewButton.addEventListener(
        "click",
        () => switchView("calendar")
    );


    listViewButton.addEventListener(
        "click",
        () => switchView("list")
    );

}


function switchView(view) {

    currentView = view;


    if (view === "calendar") {

        calendarViewButton.classList.add(
            "active"
        );

        listViewButton.classList.remove(
            "active"
        );

        calendarView.classList.remove(
            "hidden"
        );

        listView.classList.add(
            "hidden"
        );

    }

    else {

        listViewButton.classList.add(
            "active"
        );

        calendarViewButton.classList.remove(
            "active"
        );

        listView.classList.remove(
            "hidden"
        );

        calendarView.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   11. MONTH FILTERS
========================================================= */

const months = [

    "All",

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


function createMonthFilters() {

    if (!monthFilters) {

        return;

    }


    monthFilters.innerHTML = "";


    months.forEach(

        (month, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type = "button";

            button.className =
                "month-filter-button";


            if (index === 0) {

                button.classList.add(
                    "active"
                );

            }


            button.textContent =
                month;


            button.addEventListener(

                "click",

                () => {

                    document
                        .querySelectorAll(
                            ".month-filter-button"
                        )
                        .forEach(

                            button =>

                                button.classList.remove(
                                    "active"
                                )

                        );


                    button.classList.add(
                        "active"
                    );


                    currentMonthFilter =
                        index === 0
                            ? null
                            : index;


                    refreshBirthdayViews();

                }

            );


            monthFilters.appendChild(
                button
            );

        }

    );

}


/* =========================================================
   12. SEARCH
========================================================= */

function setupSearch() {

    if (!birthdaySearch) {

        return;

    }


    birthdaySearch.addEventListener(

        "input",

        event => {

            currentSearch =
                event.target.value
                    .trim()
                    .toLowerCase();


            refreshBirthdayViews();

        }

    );

}


/* =========================================================
   13. FILTER BIRTHDAYS
========================================================= */

function getFilteredBirthdays() {

    let filtered =
        [...birthdayRecords];


    /*
        Month filter
    */

    if (
        currentMonthFilter !== null
    ) {

        filtered =
            filtered.filter(

                birthday =>

                    Number(
                        birthday.month
                    ) ===
                    currentMonthFilter

            );

    }


    /*
        Search filter
    */

    if (currentSearch) {

        filtered =
            filtered.filter(

                birthday => {

                    return (
                        birthday.name
                            ?.toLowerCase()
                            .includes(
                                currentSearch
                            )
                    );

                }

            );

    }


    return filtered;

}


/* =========================================================
   14. REFRESH UI
========================================================= */

function refreshBirthdayViews() {

    filteredBirthdays =
        getFilteredBirthdays();


    /*
        Show empty search state
    */

    if (

        filteredBirthdays.length === 0 &&

        birthdayRecords.length > 0

    ) {

        noSearchResults.classList.remove(
            "hidden"
        );

    }

    else {

        noSearchResults.classList.add(
            "hidden"
        );

    }


    renderBirthdayList(
        filteredBirthdays
    );


    renderCalendar(
        filteredBirthdays
    );

}

/* =========================================================
   15. CALENDAR RENDERING
========================================================= */

function renderCalendar(
    birthdays
) {

    if (!calendarGrid) {

        return;

    }

    calendarGrid.innerHTML = "";


    const today =
        new Date();

    const year =
        today.getFullYear();


    /*
        Use selected month.

        Otherwise use current month.
    */

    const month =
        currentMonthFilter !== null
            ? currentMonthFilter - 1
            : today.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    const firstWeekday =
        firstDay.getDay();


    const totalDays =
        lastDay.getDate();


    /*
        Calendar title
    */

    calendarTitle.textContent =
        firstDay.toLocaleString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    calendarSubtitle.textContent =
        birthdays.length +
        " birthdays";


    /*
        Weekday headers
    */

    const weekdays = [

        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"

    ];


    weekdays.forEach(

        weekday => {

            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "text-center font-semibold text-sm text-on-surface-variant py-2";


            header.textContent =
                weekday;


            calendarGrid.appendChild(
                header
            );

        }

    );


    /*
        Empty cells
    */

    for (

        let index = 0;

        index < firstWeekday;

        index++

    ) {

        const empty =
            document.createElement(
                "div"
            );


        calendarGrid.appendChild(
            empty
        );

    }


    /*
        Calendar days
    */

    for (

        let day = 1;

        day <= totalDays;

        day++

    ) {

        const cell =
            document.createElement(
                "div"

            );


        cell.className =
            `
            calendar-grid-cell
            glass-card
            rounded-3xl
            p-3
            relative
            `;


        /*
            Highlight today
        */

        const isToday =

            day === today.getDate() &&

            month === today.getMonth();


        if (isToday) {

            cell.classList.add(
                "ring-2",
                "ring-strawberry-red"
            );

        }


        /*
            Day number
        */

        const dayNumber =
            document.createElement(
                "div"
            );


        dayNumber.className =
            "font-semibold text-lg mb-2";


        dayNumber.textContent =
            day;


        cell.appendChild(
            dayNumber
        );


        /*
            Birthdays for this day
        */

        const birthdaysToday =
            birthdays.filter(

                birthday =>

                    Number(
                        birthday.day
                    ) === day &&

                    Number(
                        birthday.month
                    ) === month + 1

            );


        birthdaysToday.forEach(

            birthday => {

                const badge =
                    document.createElement(
                        "div"
                    );


                badge.className =
                    `
                    bg-blush-pink
                    text-strawberry-red
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-medium
                    mb-1
                    truncate
                    `;


                badge.textContent =
                    birthday.name;


                cell.appendChild(
                    badge
                );

            }

        );


        calendarGrid.appendChild(
            cell
        );

    }

}

/* =========================================================
   11. RENDER LIST VIEW
========================================================= */

function renderBirthdayList(records = filteredBirthdays) {

    birthdayList.innerHTML = "";

    if (records.length === 0) {

        listView.classList.add("hidden");
        noSearchResults.classList.remove("hidden");
        return;

    }

    noSearchResults.classList.add("hidden");

    records.forEach(record => {

        const card = document.createElement("div");

        card.className =
            "glass-card rounded-[28px] p-6 flex justify-between items-center";

        card.innerHTML = `

            <div>

                <h3 class="font-display text-2xl font-semibold">

                    ${escapeHTML(record.name)}

                </h3>

                <p class="text-sm text-on-surface-variant mt-2">

                    ${formatBirthday(record)}

                </p>

                ${record.relationship
                ? `<p class="mt-2 text-xs text-strawberry-red">${escapeHTML(record.relationship)}</p>`
                : ""
            }

            </div>

            <div class="flex gap-2">

                <button
                    class="editBirthdayBtn secondary-button"
                    data-id="${record.id}">

                    Edit

                </button>

                <button
                    class="deleteBirthdayBtn secondary-button"
                    data-id="${record.id}">

                    Delete

                </button>

            </div>

        `;

        birthdayList.appendChild(card);

    });

}

/* =========================================================
   12. SEARCH
========================================================= */

function performSearch() {

    filteredBirthdays = [...birthdayRecords];

    updateStatistics();

    renderCurrentView();

}

/* =========================================================
   14. VIEW SWITCHER
========================================================= */

function renderCurrentView() {

    if (currentView === "calendar") {

        calendarView.classList.remove("hidden");
        listView.classList.add("hidden");

        calendarViewButton.classList.add("active");
        listViewButton.classList.remove("active");

        renderCalendar(filteredBirthdays);

    }

    else {

        calendarView.classList.add("hidden");
        listView.classList.remove("hidden");

        calendarViewButton.classList.remove("active");
        listViewButton.classList.add("active");

        renderBirthdayList(filteredBirthdays);

    }

}

/* =========================================================
   15. SWITCH VIEW
========================================================= */

function switchView(view) {

    currentView = view;

    renderCurrentView();

}

/* =========================================================
   16. MODAL CONTROLS
========================================================= */

let editingBirthdayId = null;

function openBirthdayModal(record = null) {

    birthdayForm.reset();

    formError.classList.add("hidden");
    formError.textContent = "";

    editingBirthdayId = null;

    if (record) {

        editingBirthdayId = record.id;

        modalTitle.textContent = "Edit Birthday";

        birthdayName.value =
            record.name || "";

        birthdayRelationship.value =
            record.relationship || "";

        birthdayNotes.value =
            record.note || "";

        birthdayDate.value =
            `${new Date().getFullYear()}-${String(record.month).padStart(2, "0")}-${String(record.day).padStart(2, "0")}`;

    } else {

        modalTitle.textContent =
            "Add Birthday";

    }

    birthdayModal.classList.add("active");

}

function closeBirthdayModal() {

    birthdayModal.classList.remove("active");

    birthdayForm.reset();

    editingBirthdayId = null;

}

/* =========================================================
   17. SAVE BIRTHDAY
========================================================= */

async function saveBirthday(event) {

    event.preventDefault();

    formError.classList.add("hidden");

    const selectedDate =
        new Date(birthdayDate.value);

    const payload = {

        name:
            birthdayName.value.trim(),

        month:
            selectedDate.getMonth() + 1,

        day:
            selectedDate.getDate(),

        relationship:
            birthdayRelationship.value.trim(),

        note:
            birthdayNotes.value.trim()

    };

    try {

        let response;

        if (editingBirthdayId) {

            response =
                await supabaseClient
                    .from("birthdays")
                    .update(payload)
                    .eq("id", editingBirthdayId);

        } else {

            response =
                await supabaseClient
                    .from("birthdays")
                    .insert(payload);

        }

        if (response.error) {

            throw response.error;

        }

        closeBirthdayModal();

        await loadBirthdays();

    }

    catch (error) {

        console.error(error);

        formError.textContent =
            "Unable to save birthday.";

        formError.classList.remove("hidden");

    }

}

/* =========================================================
   18. DELETE BIRTHDAY
========================================================= */

async function deleteBirthday(id) {

    const confirmed =
        confirm(
            "Delete this birthday?"
        );

    if (!confirmed) {

        return;

    }

    try {

        const { error } =
            await supabaseClient
                .from("birthdays")
                .delete()
                .eq("id", id);

        if (error) {

            throw error;

        }

        await loadBirthdays();

    }

    catch (error) {

        console.error(error);

    }

}

/* =========================================================
   19. HELPERS
========================================================= */

function formatBirthday(record) {

    return new Date(
        2025,
        record.month - 1,
        record.day
    ).toLocaleDateString(
        "en-IN",
        {
            month: "long",
            day: "numeric"
        }
    );

}

function escapeHTML(text = "") {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

function showLoading() {

    loadingState.classList.remove("hidden");

    calendarView.classList.add("hidden");

    listView.classList.add("hidden");

    emptyState.classList.add("hidden");

    errorState.classList.add("hidden");

}

function hideLoading() {

    loadingState.classList.add("hidden");

}

/* =========================================================
   20. EVENT LISTENERS
========================================================= */

calendarViewButton.addEventListener(
    "click",
    () => switchView("calendar")
);

listViewButton.addEventListener(
    "click",
    () => switchView("list")
);

birthdaySearch.addEventListener(
    "input",
    e => performSearch(e.target.value)
);

addBirthdayButton.addEventListener(

    "click",

    () => {

        window.location.href =
            "index.html";

    }

);

emptyAddButton.addEventListener(
    "click",
    () => openBirthdayModal()
);

closeModalBtn.addEventListener(
    "click",
    closeBirthdayModal
);

cancelModalBtn.addEventListener(
    "click",
    closeBirthdayModal
);

birthdayModal.addEventListener(
    "click",
    event => {

        if (event.target === birthdayModal) {

            closeBirthdayModal();

        }

    }
);

birthdayForm.addEventListener(
    "submit",
    saveBirthday
);

retryButton.addEventListener(
    "click",
    loadBirthdays
);

birthdayList.addEventListener(
    "click",
    event => {

        const editButton =
            event.target.closest(".editBirthdayBtn");

        const deleteButton =
            event.target.closest(".deleteBirthdayBtn");

        if (editButton) {

            const birthday =
                birthdayRecords.find(
                    record =>
                        record.id ===
                        editButton.dataset.id
                );

            if (birthday) {

                openBirthdayModal(birthday);

            }

        }

        if (deleteButton) {

            deleteBirthday(
                deleteButton.dataset.id
            );

        }

    }
);

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            birthdayModal.classList.contains("active")
        ) {

            closeBirthdayModal();

        }

    }
);