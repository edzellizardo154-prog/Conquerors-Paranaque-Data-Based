/* =========================================
   CONQUERORS PARANAQUE
   CLGWC MONITORING
========================================= */


/* =========================================
   NETWORK LEADERS
========================================= */

const WOMEN_LEADERS = [
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
    "Kate Ashley Mambatac",
    "Walk-In",
    "Kids"
];

const MEN_LEADERS = [
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
    "Jerico Amable",
    "Walk-In",
    "Kids"
];


const CATEGORIES = [
    "first",
    "second",
    "third",
    "fourth",
    "newNth",
    "nt",
    "nl"
];


const CATEGORY_LABELS = {
    first: "1st",
    second: "2nd",
    third: "3rd",
    fourth: "4th",
    newNth: "New Nth",
    nt: "Nt",
    nl: "NL"
};


/* =========================================
   STATE
========================================= */

let selectedCelebration = null;
let selectedLeader = null;
let selectedGroup = null;


/* =========================================
   DOM
========================================= */

const celebrationDate =
    document.getElementById("celebrationDate");

const leaderSearch =
    document.getElementById("leaderSearch");

const leaderResults =
    document.getElementById("leaderResults");

const celebrationInfo =
    document.getElementById("celebrationInfo");

const viewAllButton =
    document.getElementById("viewAllButton");

const dataSection =
    document.getElementById("dataSection");

const dataTableBody =
    document.getElementById("dataTableBody");

const dataTableFooter =
    document.getElementById("dataTableFooter");

const dataSummary =
    document.getElementById("dataSummary");

const dataTitle =
    document.getElementById("dataTitle");

const closeDataButton =
    document.getElementById("closeDataButton");

const reportModal =
    document.getElementById("reportModal");

const closeModal =
    document.getElementById("closeModal");

const reportForm =
    document.getElementById("reportForm");

const reportLeaderName =
    document.getElementById("reportLeaderName");

const reportCelebrationName =
    document.getElementById("reportCelebrationName");

const reportWindow =
    document.getElementById("reportWindow");

const liveTotal =
    document.getElementById("liveTotal");


/* =========================================
   STORAGE
========================================= */

const STORAGE_KEY =
    "conquerors_clgwc_reports";


function getReports() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || {};

    } catch (error) {

        console.error(error);

        return {};

    }

}


function saveReports(reports) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reports)
    );

}


/* =========================================
   DATE
========================================= */

function dateKey(date) {

    return date
        .toISOString()
        .split("T")[0];

}


function formatDate(date) {

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    ).format(date);

}


function getCelebrationTitle(date) {

    return (
        formatDate(date).toUpperCase() +
        " CELEBRATION"
    );

}


function getReportingWindow(celebration) {

    const start = new Date(celebration);

    const end = new Date(celebration);

    end.setDate(
        end.getDate() + 6
    );

    return {
        start,
        end
    };

}


/* =========================================
   SUNDAYS
========================================= */

function getUpcomingSundays(count = 16) {

    const result = [];

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    const day = today.getDay();

    const daysUntilSunday =
        (7 - day) % 7;

    const firstSunday =
        new Date(today);

    firstSunday.setDate(
        today.getDate() +
        daysUntilSunday
    );

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const sunday =
            new Date(firstSunday);

        sunday.setDate(
            firstSunday.getDate() +
            (i * 7)
        );

        result.push(sunday);

    }

    return result;

}


/* =========================================
   CELEBRATIONS
========================================= */

function loadCelebrations() {

    celebrationDate.innerHTML = "";

    const sundays =
        getUpcomingSundays();

    sundays.forEach(
        (sunday, index) => {

            const option =
                document.createElement("option");

            option.value =
                dateKey(sunday);

            option.textContent =
                getCelebrationTitle(sunday);

            if (index === 0) {

                option.selected = true;

            }

            celebrationDate.appendChild(
                option
            );

        }
    );

    updateCelebration();

}


function updateCelebration() {

    selectedCelebration =
        new Date(
            celebrationDate.value +
            "T00:00:00"
        );

    const window =
        getReportingWindow(
            selectedCelebration
        );

    celebrationInfo.innerHTML = `

        <div class="info-card">

            <strong>
                ${getCelebrationTitle(
                    selectedCelebration
                )}
            </strong>

            <span>
                Reporting Window:
                ${formatDate(window.start)}
                –
                ${formatDate(window.end)}
            </span>

        </div>

    `;

    renderLeaderResults();

}


/* =========================================
   REPORT KEY
========================================= */

function getReportKey(
    group,
    leader
) {

    return (
        dateKey(selectedCelebration) +
        "__" +
        group +
        "__" +
        leader
    );

}


/* =========================================
   GET REPORT
========================================= */

function getLeaderReport(
    group,
    leader
) {

    const reports =
        getReports();

    return (
        reports[
            getReportKey(
                group,
                leader
            )
        ] || null
    );

}


/* =========================================
   NAME NORMALIZATION
========================================= */

function normalizeName(name) {

    return String(name)
        .toLowerCase()
        .trim();

}


/* =========================================
   COUNT
========================================= */

function countNames(names) {

    if (!Array.isArray(names)) {

        return 0;

    }

    return names.filter(
        name =>
            String(name).trim() !== ""
    ).length;

}


function getReportTotal(report) {

    if (!report) {

        return 0;

    }

    return CATEGORIES.reduce(
        (
            total,
            category
        ) => {

            return (
                total +
                countNames(
                    report[category]
                )
            );

        },
        0
    );

}


/* =========================================
   SEARCH LEADERS
========================================= */

function renderLeaderResults() {

    const query =
        normalizeName(
            leaderSearch.value
        );

    leaderResults.innerHTML = "";

    let found = 0;


    const groups = [
        {
            key: "women",
            title: "GIRLS",
            leaders: WOMEN_LEADERS
        },
        {
            key: "men",
            title: "BOYS",
            leaders: MEN_LEADERS
        }
    ];


    groups.forEach(group => {

        group.leaders.forEach(
            leader => {

                if (
                    query &&
                    !normalizeName(
                        leader
                    ).includes(query)
                ) {

                    return;

                }

                found++;


                const report =
                    getLeaderReport(
                        group.key,
                        leader
                    );


                const total =
                    getReportTotal(
                        report
                    );


                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "leader-card";


                card.innerHTML = `

                    <span class="status ${
                        report
                            ? "reported"
                            : "no-report"
                    }">

                        ${
                            report
                                ? "REPORTED"
                                : "NO REPORT"
                        }

                    </span>

                    <h3>
                        ${leader}
                    </h3>

                    <p>

                        ${group.title}

                        <br>

                        ${getCelebrationTitle(
                            selectedCelebration
                        )}

                        <br>

                        Attendance:
                        <strong>
                            ${total}
                        </strong>

                    </p>


                    <div class="leader-actions">

                        <button
                            class="report-button"
                            data-report-group="${group.key}"
                            data-report-leader="${leader}"
                        >

                            ${
                                report
                                    ? "EDIT REPORT"
                                    : "REPORT"
                            }

                        </button>


                        ${
                            report
                                ? `
                                    <button
                                        class="delete-button"
                                        data-delete-group="${group.key}"
                                        data-delete-leader="${leader}"
                                    >
                                        DELETE
                                    </button>
                                  `
                                : ""
                        }


                        <button
                            class="view-button"
                            data-view-group="${group.key}"
                            data-view-leader="${leader}"
                        >

                            VIEW DATA

                        </button>

                    </div>

                `;


                leaderResults.appendChild(
                    card
                );

            }
        );

    });


    if (!found) {

        leaderResults.innerHTML = `

            <div class="info-card">

                <strong>
                    NO LEADER FOUND
                </strong>

                <span>
                    Try another name.
                </span>

            </div>

        `;

        return;

    }


    attachLeaderButtons();

}


/* =========================================
   BUTTON EVENTS
========================================= */

function attachLeaderButtons() {

    document
        .querySelectorAll(
            "[data-report-group]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openReport(
                        button.dataset.reportGroup,
                        button.dataset.reportLeader
                    );

                }
            );

        });


    document
        .querySelectorAll(
            "[data-delete-group]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteReport(
                        button.dataset.deleteGroup,
                        button.dataset.deleteLeader
                    );

                }
            );

        });


    document
        .querySelectorAll(
            "[data-view-group]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showCompleteData(
                        button.dataset.viewGroup,
                        button.dataset.viewLeader
                    );

                }
            );

        });

}


/* =========================================
   OPEN REPORT / EDIT
========================================= */

function openReport(
    group,
    leader
) {

    selectedGroup = group;

    selectedLeader = leader;


    const report =
        getLeaderReport(
            group,
            leader
        );


    reportLeaderName.textContent =
        leader;

    reportCelebrationName.textContent =
        getCelebrationTitle(
            selectedCelebration
        );


    const window =
        getReportingWindow(
            selectedCelebration
        );


    reportWindow.innerHTML = `

        REPORTING WINDOW:

        <strong>
            ${formatDate(window.start)}
            –
            ${formatDate(window.end)}
        </strong>

        <br><br>

        Add the names who attended
        under their proper category.

    `;


    setTextarea(
        "firstNames",
        report?.first || []
    );

    setTextarea(
        "secondNames",
        report?.second || []
    );

    setTextarea(
        "thirdNames",
        report?.third || []
    );

    setTextarea(
        "fourthNames",
        report?.fourth || []
    );

    setTextarea(
        "newNthNames",
        report?.newNth || []
    );

        setTextarea(
        "ntNames",
        report?.nt || []
    );

    setTextarea(
        "nlNames",
        report?.nl || []
    );


    updateLiveTotal();


    reportModal.classList.remove(
        "hidden"
    );

}


/* =========================================
   TEXTAREA
========================================= */

function setTextarea(
    id,
    names
) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.value =
        Array.isArray(names)
            ? names.join("\n")
            : "";

}


function getTextareaValues(id) {

    const element =
        document.getElementById(id);

    if (!element) {

        return [];

    }

    return element.value
        .split("\n")
        .map(
            name =>
                name.trim()
        )
        .filter(
            name =>
                name !== ""
        );

}


/* =========================================
   LIVE TOTAL
========================================= */

function updateLiveTotal() {

    const total =

        getTextareaValues(
            "firstNames"
        ).length +

        getTextareaValues(
            "secondNames"
        ).length +

        getTextareaValues(
            "thirdNames"
        ).length +

        getTextareaValues(
            "fourthNames"
        ).length +

        getTextareaValues(
            "newNthNames"
        ).length +
               
        getTextareaValues(
            "ntNames"
        ).length +

        getTextareaValues(
            "nlNames"
        ).length;


    if (liveTotal) {

        liveTotal.textContent =
            `TOTAL ATTENDANCE: ${total}`;

    }

}


/* =========================================
   SAVE / EDIT REPORT
========================================= */

reportForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (
            !selectedGroup ||
            !selectedLeader
        ) {

            return;

        }


        const reports =
            getReports();


        const key =
            getReportKey(
                selectedGroup,
                selectedLeader
            );


        reports[key] = {

            leader:
                selectedLeader,

            group:
                selectedGroup,

            celebration:
                dateKey(
                    selectedCelebration
                ),

            first:
                getTextareaValues(
                    "firstNames"
                ),

            second:
                getTextareaValues(
                    "secondNames"
                ),

            third:
                getTextareaValues(
                    "thirdNames"
                ),

            fourth:
                getTextareaValues(
                    "fourthNames"
                ),

            newNth:
                getTextareaValues(
                    "newNthNames"
                ),

            nt:
                getTextareaValues(
                    "ntNames"
                ),

            nl:
                getTextareaValues(
                    "nlNames"
                ),

            updatedAt:
                new Date().toISOString()

        };


        saveReports(reports);


        closeReportModal();

        renderLeaderResults();


        if (
            !dataSection.classList.contains(
                "hidden"
            )
        ) {

            showCompleteData();

        }


        alert(
            "Report saved successfully."
        );

    }
);


/* =========================================
   DELETE REPORT
========================================= */

function deleteReport(
    group,
    leader
) {

    const report =
        getLeaderReport(
            group,
            leader
        );


    if (!report) {

        return;

    }


    const confirmed =
        confirm(
            `Delete the report of ${leader} for ${getCelebrationTitle(
                selectedCelebration
            )}?\n\nThis will remove all names recorded under this report.`
        );


    if (!confirmed) {

        return;

    }


    const reports =
        getReports();


    const key =
        getReportKey(
            group,
            leader
        );


    delete reports[key];


    saveReports(reports);


    renderLeaderResults();


    if (
        !dataSection.classList.contains(
            "hidden"
        )
    ) {

        showCompleteData();

    }


    alert(
        "Report deleted."
    );

}


/* =========================================
   DISPLAY NAMES
========================================= */

function namesHTML(names) {

    if (
        !Array.isArray(names) ||
        names.length === 0
    ) {

        return `
            <span class="empty-name">
                —
            </span>
        `;

    }


    return `

        <div class="name-list">

            ${names.map(
                (name, index) => `

                    <div class="reported-name">

                        <span class="name-number">
                            ${index + 1}.
                        </span>

                        <span>
                            ${escapeHTML(name)}
                        </span>

                    </div>

                `
            ).join("")}

        </div>

    `;

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(value) {

    return String(value)
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


/* =========================================
   DATA TABLE
========================================= */

function createGroupHeader(
    title
) {

    const row =
        document.createElement("tr");

    row.className =
        "group-header-row";


    row.innerHTML = `

        <td colspan="9">

            ${title}

        </td>

    `;


    return row;

}


/* =========================================
   LEADER ROW
========================================= */

function createLeaderRow(
    group,
    leader,
    totals
) {

    const report =
        getLeaderReport(
            group,
            leader
        );


    const counts = {};


    CATEGORIES.forEach(
        category => {

            counts[category] =
                countNames(
                    report?.[category]
                );


            totals[category] +=
                counts[category];

        }
    );


    const total =
        getReportTotal(report);


    totals.total += total;


    const row =
        document.createElement("tr");


    if (!report) {

        row.classList.add(
            "no-report-row"
        );

    }


    row.innerHTML = `

        <td class="leader-name-cell">

            <strong>
                ${escapeHTML(leader)}
            </strong>

        </td>


        <td>

            <span class="status ${
                report
                    ? "reported"
                    : "no-report"
            }">

                ${
                    report
                        ? "REPORTED"
                        : "NO REPORT"
                }

            </span>


            ${
                report
                    ? `
                        <div class="table-actions">

                            <button
                                class="table-edit-button"
                                data-table-edit-group="${group}"
                                data-table-edit-leader="${escapeHTML(leader)}"
                            >
                                EDIT
                            </button>

                            <button
                                class="table-delete-button"
                                data-table-delete-group="${group}"
                                data-table-delete-leader="${escapeHTML(leader)}"
                            >
                                DELETE
                            </button>

                        </div>
                    `
                    : ""
            }

        </td>


        <td class="names-cell">

            ${namesHTML(
                report?.first
            )}

        </td>


        <td class="names-cell">

            ${namesHTML(
                report?.second
            )}

        </td>


        <td class="names-cell">

            ${namesHTML(
                report?.third
            )}

        </td>


        <td class="names-cell">

            ${namesHTML(
                report?.fourth
            )}

        </td>


        <td class="names-cell">

            ${namesHTML(
                report?.newNth
            )}

        </td>

        
        <td class="names-cell">

            ${namesHTML(
                report?.nt
            )}

        </td>

        <td class="names-cell">

            ${namesHTML(
                report?.nl
            )}

        </td>


        <td class="total-cell">

            <strong>
                ${total}
            </strong>

        </td>

    `;


    return row;

}


/* =========================================
   TOTAL ROW
========================================= */

function createTotalRow(
    title,
    totals,
    className = ""
) {

    const row =
        document.createElement("tr");


    row.className =
        `total-row ${className}`;


    row.innerHTML = `

        <td colspan="2">
            ${title}
        </td>

        <td>
            ${totals.first}
        </td>

        <td>
            ${totals.second}
        </td>

        <td>
            ${totals.third}
        </td>

        <td>
            ${totals.fourth}
        </td>

        <td>
            ${totals.newNth}
        </td>

        <td>
            ${totals.nt}
        </td>

        <td>
            ${totals.nl}
        </td>

        <td>
            ${totals.total}
        </td>

    `;


    return row;

}


/* =========================================
   COMPLETE DATA
========================================= */

function showCompleteData(
    focusGroup = null,
    focusLeader = null
) {

    dataSection.classList.remove(
        "hidden"
    );


    dataTitle.textContent =
        getCelebrationTitle(
            selectedCelebration
        );


    dataTableBody.innerHTML = "";

    dataTableFooter.innerHTML = "";


    const womenTotals = {

        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        newNth: 0,
        nt: 0,
        nl: 0,
        total: 0

    };


    const menTotals = {

        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        newNth: 0,
        nt: 0,
        nl: 0,
        total: 0

    };


    /* =====================================
       GIRLS
    ===================================== */

    dataTableBody.appendChild(
        createGroupHeader(
            "GIRLS"
        )
    );


    WOMEN_LEADERS.forEach(
        leader => {

            const row =
                createLeaderRow(
                    "women",
                    leader,
                    womenTotals
                );


            if (
                focusGroup === "women" &&
                focusLeader === leader
            ) {

                row.classList.add(
                    "focused-row"
                );

            }


            dataTableBody.appendChild(
                row
            );

        }
    );


    dataTableBody.appendChild(
        createTotalRow(
            "WOMEN'S TOTAL",
            womenTotals,
            "women-total-row"
        )
    );


    /* =====================================
       BOYS
    ===================================== */

    dataTableBody.appendChild(
        createGroupHeader(
            "BOYS"
        )
    );


    MEN_LEADERS.forEach(
        leader => {

            const row =
                createLeaderRow(
                    "men",
                    leader,
                    menTotals
                );


            if (
                focusGroup === "men" &&
                focusLeader === leader
            ) {

                row.classList.add(
                    "focused-row"
                );

            }


            dataTableBody.appendChild(
                row
            );

        }
    );


    dataTableBody.appendChild(
        createTotalRow(
            "MEN'S TOTAL",
            menTotals,
            "men-total-row"
        )
    );


    /* =====================================
       GRAND TOTAL
    ===================================== */

    const grandTotals = {

        first:
            womenTotals.first +
            menTotals.first,

        second:
            womenTotals.second +
            menTotals.second,

        third:
            womenTotals.third +
            menTotals.third,

        fourth:
            womenTotals.fourth +
            menTotals.fourth,

        newNth:
            womenTotals.newNth +
            menTotals.newNth,

        nt:
            womenTotals.nt +
            menTotals.nt,

        nl:
            womenTotals.nl +
            menTotals.nl,

        total:
            womenTotals.total +
            menTotals.total

    };


    dataTableFooter.appendChild(
        createTotalRow(
            "TOTAL",
            grandTotals,
            "grand-total-row"
        )
    );


    attachTableActions();


    renderSummary();


    dataSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =========================================
   TABLE EDIT / DELETE
========================================= */

function attachTableActions() {

    document
        .querySelectorAll(
            "[data-table-edit-group]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openReport(
                        button.dataset.tableEditGroup,
                        button.dataset.tableEditLeader
                    );

                }
            );

        });


    document
        .querySelectorAll(
            "[data-table-delete-group]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteReport(
                        button.dataset.tableDeleteGroup,
                        button.dataset.tableDeleteLeader
                    );

                }
            );

        });

}


/* =========================================
   SUMMARY
========================================= */

function renderSummary() {

    let womenReported = 0;
    let menReported = 0;

    let womenTotal = 0;
    let menTotal = 0;


    WOMEN_LEADERS.forEach(
        leader => {

            const report =
                getLeaderReport(
                    "women",
                    leader
                );


            if (report) {

                womenReported++;

            }


            womenTotal +=
                getReportTotal(report);

        }
    );


    MEN_LEADERS.forEach(
        leader => {

            const report =
                getLeaderReport(
                    "men",
                    leader
                );


            if (report) {

                menReported++;

            }


            menTotal +=
                getReportTotal(report);

        }
    );


    dataSummary.innerHTML = `

        <div class="summary-card">

            <span>
                GIRLS TOTAL
            </span>

            <strong>
                ${womenTotal}
            </strong>

        </div>


        <div class="summary-card">

            <span>
                BOYS TOTAL
            </span>

            <strong>
                ${menTotal}
            </strong>

        </div>


        <div class="summary-card">

            <span>
                LEADERS REPORTED
            </span>

            <strong>
                ${womenReported + menReported}
            </strong>

        </div>


        <div class="summary-card">

            <span>
                NO REPORT
            </span>

            <strong>
                ${
                    (WOMEN_LEADERS.length - womenReported) +
                    (MEN_LEADERS.length - menReported)
                }
            </strong>

        </div>

    `;

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeReportModal() {

    reportModal.classList.add(
        "hidden"
    );

    selectedGroup = null;

    selectedLeader = null;

}


closeModal.addEventListener(
    "click",
    closeReportModal
);


reportModal.addEventListener(
    "click",
    event => {

        if (
            event.target === reportModal
        ) {

            closeReportModal();

        }

    }
);


/* =========================================
   SEARCH
========================================= */

leaderSearch.addEventListener(
    "input",
    renderLeaderResults
);


/* =========================================
   CELEBRATION
========================================= */

celebrationDate.addEventListener(
    "change",
    () => {

        dataSection.classList.add(
            "hidden"
        );

        updateCelebration();

    }
);


/* =========================================
   VIEW ALL
========================================= */

viewAllButton.addEventListener(
    "click",
    () => {

        showCompleteData();

    }
);

/* =========================================
   CLOSE COMPLETE DATA
========================================= */

if (closeDataButton) {

    closeDataButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            dataSection.classList.add(
                "hidden"
            );

        }
    );

}
/* =========================================
   LIVE TOTAL
========================================= */

document
    .querySelectorAll(
        ".report-field textarea"
    )
    .forEach(
        textarea => {

            textarea.addEventListener(
                "input",
                updateLiveTotal
            );

        }
    );


/* =========================================
   INITIALIZE
========================================= */

loadCelebrations();