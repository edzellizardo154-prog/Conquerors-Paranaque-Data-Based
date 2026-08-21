/* =========================================================
   SUNDAY REPORT DATABASE
========================================================= */

const STORAGE_KEY =
    "conquerors_sunday_reports";


/* =========================================================
   PERMANENT MEMBERS
========================================================= */

const PRIMARY_WOMEN = [

    "Pas. Cristina Bautista",
    "Grace Anne Piol",
    "Angela Mae Pamaos",
    "Shiela May Gaviola",
    "Mary Grace Mendoza",
    "Liezel Daria Magnaye",
    "Carissa Balagbag",
    "Rhan Andrea Titco",
    "Geraldine Titco",
    "Ma. Luisa Gaborni",
    "Jeraldine Espenida",
    "April Alorro",
    "Viel Galopar",
    "Melissa Rosales",
    "Kate Ashley Mambatac"

];


const PRIMARY_MEN = [

    "Pas. Efren Bautista",
    "Marc Joseph Fonclara",
    "Mark Brian Venzuela",
    "Adrian Dawa",
    "Ronald Trinidad",
    "Lean Jay Galopar",
    "Marciano Mejes",
    "Maximo Lumapas",
    "Arnulfo Gaborni",
    "Vince Tamio",
    "Edzel Lizardo",
    "John Gerald Rosario",
    "Angelo Villagracia",
    "Jerico Amable"

];


const LEADERS = [

    "Alvin Anasco",
    "Chris Bulay",
    "Jairus Philip Moridas",
    "Harold Rosales",
    "Laurence Saut",
    "Angelito Villagracia",
    "Vanessa Balagbag",
    "Keisha Claire Bulay",
    "Madelyn Maure",
    "Cloie kyle Sadueste",
    "Jhoyce Ann Valenzuela",
    "Kristine May Valenzuela",
    "Angelina Villagracia",
    "Susana Villagracia",
    "Marissa Valenzuela",
    "Rhon Aldrin Titco",
    "Ma. Rheinabel Valerio",
    "Amber Bote",
    "Michaella Barreda",
    "Shaina Sicad",
    "Hiah Bautista",
    "Marvin Betonio",
    "Sean Robles"

];


/* =========================================================
   TIMER KEYS
========================================================= */

const TIMER_KEYS = [

    "first",
    "second",
    "third",
    "fourth",
    "newNth",
    "nt"

];


const TIMER_LABELS = [

    "1ST TIMER",
    "2ND TIMER",
    "3RD TIMER",
    "4TH TIMER",
    "NEW NT TIMER",
    "NT TIMER"

];


/* =========================================================
   ELEMENTS
========================================================= */

const reportDate =
    document.getElementById(
        "reportDate"
    );


const dateSearch =
    document.getElementById(
        "dateSearch"
    );


const reportTitle =
    document.getElementById(
        "reportTitle"
    );


const adultsBody =
    document.getElementById(
        "adultsBody"
    );


const kidsBody =
    document.getElementById(
        "kidsBody"
    );


const primaryWomenBody =
    document.getElementById(
        "primaryWomenBody"
    );


const primaryMenBody =
    document.getElementById(
        "primaryMenBody"
    );


const leadersBody =
    document.getElementById(
        "leadersBody"
    );


const totalsGrid =
    document.getElementById(
        "totalsGrid"
    );


const grandTotal =
    document.getElementById(
        "grandTotal"
    );


/* =========================================================
   DATABASE
========================================================= */

function getReports() {

    try {

        const data =
            localStorage.getItem(
                STORAGE_KEY
            );

        return data
            ? JSON.parse(data)
            : {};

    } catch (error) {

        console.error(
            "Unable to load Sunday reports:",
            error
        );

        return {};

    }

}


function saveReports(
    reports
) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reports)
    );

}


/* =========================================================
   DATE FUNCTIONS
========================================================= */

function formatDate(
    dateValue
) {

    if (!dateValue) {
        return "";
    }

    const date =
        new Date(
            dateValue + "T00:00:00"
        );

    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


function getSunday(
    date
) {

    const result =
        new Date(date);

    const day =
        result.getDay();

    result.setDate(
        result.getDate() -
        day
    );

    return result;

}


function toDateString(
    date
) {

    return (

        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            date.getDate()
        ).padStart(2, "0")

    );

}


/* =========================================================
   GENERATE SUNDAYS
========================================================= */

function generateSundays() {

    const today =
        new Date();


    const currentSunday =
        getSunday(today);


    const start =
        new Date(
            2026,
            0,
            4
        );


    const end =
        new Date(
            currentSunday
        );


    /*
     * Include future Sundays
     * for upcoming reports.
     */

    end.setMonth(
        end.getMonth() + 12
    );


    const dates = [];


    let cursor =
        new Date(start);


    while (
        cursor <= end
    ) {

        dates.push(
            toDateString(cursor)
        );


        cursor.setDate(
            cursor.getDate() + 7
        );

    }


    return dates;

}


/* =========================================================
   CREATE EMPTY REPORT
========================================================= */

function createEmptyReport(
    date
) {

    return {

        date: date,

        adults: [],

        kids: [],

        primaryWomen:
            PRIMARY_WOMEN.map(
                name =>
                    createPermanentPerson(
                        name,
                        "Primary 12 Women"
                    )
            ),

        primaryMen:
            PRIMARY_MEN.map(
                name =>
                    createPermanentPerson(
                        name,
                        "Primary 12 Men"
                    )
            ),

        leaders:
            LEADERS.map(
                name =>
                    createPermanentPerson(
                        name,
                        "144 Leaders"
                    )
            )

    };

}


function createPermanentPerson(
    name,
    category
) {

    return {

        id: createId(),

        category: category,

        name: name,

        timers: {

            first: false,
            second: false,
            third: false,
            fourth: false,
            newNth: false,
            nt: false

        }

    };

}


function createAdultOrKid(
    category
) {

    return {

        id: createId(),

        category: category,

        name: "",

        timers: {

            first: false,
            second: false,
            third: false,
            fourth: false,
            newNth: false,
            nt: false

        }

    };

}


function createId() {

    return (

        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 8)

    );

}


/* =========================================================
   LOAD REPORT
========================================================= */

function loadReport(
    date
) {

    const reports =
        getReports();


    if (!reports[date]) {

        reports[date] =
            createEmptyReport(
                date
            );

        saveReports(
            reports
        );

    }


    /*
     * Make sure old reports
     * have all required arrays.
     */

    const report =
        reports[date];


    report.adults =
        report.adults || [];


    report.kids =
        report.kids || [];


    report.primaryWomen =
        report.primaryWomen ||
        PRIMARY_WOMEN.map(
            name =>
                createPermanentPerson(
                    name,
                    "Primary 12 Women"
                )
        );


    report.primaryMen =
        report.primaryMen ||
        PRIMARY_MEN.map(
            name =>
                createPermanentPerson(
                    name,
                    "Primary 12 Men"
                )
        );


    report.leaders =
        report.leaders ||
        LEADERS.map(
            name =>
                createPermanentPerson(
                    name,
                    "144 Leaders"
                )
        );


    return report;

}


/* =========================================================
   DATE SELECTOR
========================================================= */

function renderDateSelector(
    selectedDate
) {

    const dates =
        generateSundays();


    reportDate.innerHTML =
        dates.map(
            date => `

                <option
                    value="${date}"
                    ${date === selectedDate
                        ? "selected"
                        : ""}
                >
                    ${formatDate(date)}
                </option>

            `
        ).join("");

}


/* =========================================================
   RENDER REPORT
========================================================= */

function renderReport(
    date
) {

    const report =
        loadReport(date);


    reportTitle.textContent =
        "REPORT ON " +
        formatDate(date).toUpperCase();


    renderPeople(
        adultsBody,
        report.adults,
        true
    );


    renderPeople(
        kidsBody,
        report.kids,
        true
    );


    renderPeople(
        primaryWomenBody,
        report.primaryWomen,
        false
    );


    renderPeople(
        primaryMenBody,
        report.primaryMen,
        false
    );


    renderPeople(
        leadersBody,
        report.leaders,
        false
    );


    calculateTotals(
        report
    );

}


/* =========================================================
   RENDER PEOPLE
========================================================= */

function renderPeople(
    container,
    people,
    editable
) {

    if (
        !people ||
        people.length === 0
    ) {

        container.innerHTML = `

            <tr>

                <td colspan="9">

                    <div class="empty-message">
                        No names added yet.
                    </div>

                </td>

            </tr>

        `;

        return;

    }


    container.innerHTML =
        people.map(
            person => {

                const nameCell = editable
                    ? `
                        <input
                            class="name-input"
                            type="text"
                            value="${escapeHtml(person.name)}"
                            data-field="name"
                            data-id="${person.id}"
                            placeholder="Insert name"
                        >
                    `
                    : escapeHtml(person.name);

                const removeCell = editable
                    ? `
                        <td>

                            <button
                                type="button"
                                class="remove-button"
                                data-remove-id="${person.id}"
                            >
                                ×
                            </button>

                        </td>
                    `
                    : "";

                return `

                    <tr
                        data-id="${person.id}"
                    >

                        <td class="category-cell">

                            ${escapeHtml(person.category)}

                        </td>


                        <td class="name-cell">

                            ${nameCell}

                        </td>


                        ${renderTimerCell(
                            person,
                            "first"
                        )}


                        ${renderTimerCell(
                            person,
                            "second"
                        )}


                        ${renderTimerCell(
                            person,
                            "third"
                        )}


                        ${renderTimerCell(
                            person,
                            "fourth"
                        )}


                        ${renderTimerCell(
                            person,
                            "newNth"
                        )}


                        ${renderTimerCell(
                            person,
                            "nt"
                        )}


                        ${removeCell}

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================================
   TIMER CELL
========================================================= */

function renderTimerCell(
    person,
    timer
) {

    return `

        <td>

            <input
                type="checkbox"
                class="timer-check"
                data-timer="${timer}"
                data-id="${person.id}"
                ${person.timers &&
                person.timers[timer]
                    ? "checked"
                    : ""}
            >

        </td>

    `;

}


/* =========================================================
   ADD ADULT
========================================================= */

document
    .getElementById(
        "addAdultButton"
    )
    .addEventListener(
        "click",
        function() {

            const report =
                loadReport(
                    reportDate.value
                );


            report.adults.push(
                createAdultOrKid(
                    "Adults"
                )
            );


            updateCurrentReport(
                report
            );

        }
    );


/* =========================================================
   ADD KID
========================================================= */

document
    .getElementById(
        "addKidButton"
    )
    .addEventListener(
        "click",
        function() {

            const report =
                loadReport(
                    reportDate.value
                );


            report.kids.push(
                createAdultOrKid(
                    "Kids"
                )
            );


            updateCurrentReport(
                report
            );

        }
    );


/* =========================================================
   UPDATE REPORT
========================================================= */

function updateCurrentReport(
    report
) {

    const reports =
        getReports();


    reports[
        report.date
    ] = report;


    saveReports(
        reports
    );


    renderReport(
        report.date
    );

}


/* =========================================================
   TABLE EVENTS
========================================================= */

document.addEventListener(
    "change",
    function(event) {

        if (
            !event.target.classList.contains(
                "timer-check"
            )
        ) {

            return;

        }


        const timer =
            event.target.dataset.timer;


        const id =
            event.target.dataset.id;


        const report =
            loadReport(
                reportDate.value
            );


        const person =
            findPerson(
                report,
                id
            );


        if (!person) {
            return;
        }


        person.timers =
            person.timers || {};


        person.timers[timer] =
            event.target.checked;


        /*
         * Automatic NT behavior.
         *
         * Kapag NT checked,
         * attendance siya as NT.
         */

        updateCurrentReport(
            report
        );

    }
);


/* =========================================================
   NAME INPUT EVENTS
========================================================= */

document.addEventListener(
    "input",
    function(event) {

        if (
            !event.target.classList.contains(
                "name-input"
            )
        ) {

            return;

        }


        const id =
            event.target.dataset.id;


        const report =
            loadReport(
                reportDate.value
            );


        const person =
            findPerson(
                report,
                id
            );


        if (!person) {
            return;
        }


        person.name =
            event.target.value;


        const reports =
            getReports();


        reports[
            report.date
        ] = report;


        saveReports(
            reports
        );

    }
);


/* =========================================================
   REMOVE NAME
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.classList.contains(
                "remove-button"
            )
        ) {

            return;

        }


        const id =
            event.target.dataset.removeId;


        const report =
            loadReport(
                reportDate.value
            );


        report.adults =
            report.adults.filter(
                person =>
                    person.id !== id
            );


        report.kids =
            report.kids.filter(
                person =>
                    person.id !== id
            );


        updateCurrentReport(
            report
        );

    }
);


/* =========================================================
   FIND PERSON
========================================================= */

function findPerson(
    report,
    id
) {

    const groups = [

        report.adults,
        report.kids,
        report.primaryWomen,
        report.primaryMen,
        report.leaders

    ];


    for (
        const group of groups
    ) {

        const found =
            group.find(
                person =>
                    person.id === id
            );


        if (found) {
            return found;
        }

    }


    return null;

}


/* =========================================================
   CALCULATE TOTALS
========================================================= */

function calculateTotals(
    report
) {

    const allPeople = [

        ...report.adults,
        ...report.kids,
        ...report.primaryWomen,
        ...report.primaryMen,
        ...report.leaders

    ];


    const totals = {

        first: 0,

        second: 0,

        third: 0,

        fourth: 0,

        newNth: 0,

        nt: 0

    };


    allPeople.forEach(
        person => {

            /*
             * Ignore empty adult/kid rows.
             */

            if (
                !person.name ||
                !person.name.trim()
            ) {

                return;

            }


            TIMER_KEYS.forEach(
                timer => {

                    if (
                        person.timers &&
                        person.timers[timer]
                    ) {

                        totals[timer]++;

                    }

                }
            );

        }
    );


    totalsGrid.innerHTML =

        TIMER_KEYS.map(
            (timer,index) => `

                <div class="total-card">

                    <span>
                        ${TIMER_LABELS[index]}
                    </span>

                    <strong>
                        ${totals[timer]}
                    </strong>

                </div>

            `
        ).join("");


    /*
     * Grand total counts
     * attendance marks.
     */

    const total =
        Object.values(
            totals
        ).reduce(
            (sum,value) =>
                sum + value,
            0
        );


    grandTotal.textContent =
        total;

}


/* =========================================================
   SAVE BUTTON
========================================================= */

document
    .getElementById(
        "saveReportButton"
    )
    .addEventListener(
        "click",
        function() {

            const report =
                loadReport(
                    reportDate.value
                );


            /*
             * Remove blank adult/kid rows
             * before saving.
             */

            report.adults =
                report.adults.filter(
                    person =>
                        person.name &&
                        person.name.trim()
                );


            report.kids =
                report.kids.filter(
                    person =>
                        person.name &&
                        person.name.trim()
                );


            updateCurrentReport(
                report
            );


            alert(

                "Sunday Report saved successfully!\n\n" +

                "Report Date: " +

                formatDate(
                    report.date
                )

            );

        }
    );


/* =========================================================
   DATE CHANGE
========================================================= */

reportDate.addEventListener(
    "change",
    function() {

        renderReport(
            this.value
        );

        dateSearch.value = "";

    }
);


/* =========================================================
   DATE SEARCH
========================================================= */

dateSearch.addEventListener(
    "input",
    function() {

        const query =
            this.value
                .trim()
                .toLowerCase();


        if (!query) {
            return;
        }


        const dates =
            generateSundays();


        const matched =
            dates.find(
                date =>
                    formatDate(date)
                        .toLowerCase()
                        .includes(query)
            );


        if (matched) {

            reportDate.value =
                matched;


            renderReport(
                matched
            );

        }

    }
);


/* =========================================================
   NEW SUNDAY
========================================================= */

document
    .getElementById(
        "newReportButton"
    )
    .addEventListener(
        "click",
        function() {

            const selected =
                reportDate.value;


            const date =
                new Date(
                    selected +
                    "T00:00:00"
                );


            date.setDate(
                date.getDate() + 7
            );


            const nextSunday =
                toDateString(
                    date
                );


            const reports =
                getReports();


            if (
                !reports[nextSunday]
            ) {

                reports[nextSunday] =
                    createEmptyReport(
                        nextSunday
                    );

                saveReports(
                    reports
                );

            }


            renderDateSelector(
                nextSunday
            );


            reportDate.value =
                nextSunday;


            renderReport(
                nextSunday
            );

        }
    );


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INITIALIZE
========================================================= */

(function init() {

    const reports =
        getReports();


    /*
     * First report:
     * August 16, 2026
     */

    const firstSunday =
        "2026-08-16";


    if (
        !reports[firstSunday]
    ) {

        reports[firstSunday] =
            createEmptyReport(
                firstSunday
            );

        saveReports(
            reports
        );

    }


    renderDateSelector(
        firstSunday
    );


    reportDate.value =
        firstSunday;


    renderReport(
        firstSunday
    );

})();