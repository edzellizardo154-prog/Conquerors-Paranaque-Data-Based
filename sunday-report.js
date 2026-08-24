/* =========================================================
   SUNDAY REPORT DATABASE
========================================================= */

const STORAGE_KEY = "conquerors_sunday_reports";

/* =========================================================
   PERMANENT MEMBERS
========================================================= */

const PERMANENT_PASTORS = [
    "Pas. Efren Bautista",
    "Pas. Cristina Bautista"
];

const PRIMARY_WOMEN = [
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

const LEADERS_WOMEN = [
    "Susana S. Villagracia",
    "Vanessa Balagbag",
    "Angelina S. Villagracia",
    "Jhoyce Ann Valenzuela",
    "Kristine May Valenzuela",
    "Cloie Kyle Sadueste",
    "Marissa Valenzuela",
    "Keisha Claire Bulay",
    "Madelyn Maure"
];

const LEADERS_MEN = [
    "Niño Chris Marven B. Bulay",
    "Jairus Philip B. Moridas",
    "Angelito S. Villagracia",
    "Laurence Saut",
    "Alvin Añasco",
    "Harold Rosales"
];

const TIMER_KEYS = ["first", "second", "third", "fourth", "newNth", "nt"];
const TIMER_LABELS = ["1ST TIMER", "2ND TIMER", "3RD TIMER", "4TH TIMER", "NEW NT TIMER", "NT TIMER"];

/* =========================================================
   ELEMENTS
========================================================= */

const reportDate = document.getElementById("reportDate");
const dateSearch = document.getElementById("dateSearch");
const reportTitle = document.getElementById("reportTitle");
const pastorsBody = document.getElementById("pastorsBody");
const adultsBody = document.getElementById("adultsBody");
const kidsBody = document.getElementById("kidsBody");
const primaryWomenBody = document.getElementById("primaryWomenBody");
const primaryMenBody = document.getElementById("primaryMenBody");
const leadersWomenBody = document.getElementById("leadersWomenBody");
const leadersMenBody = document.getElementById("leadersMenBody");

const categoryTotalsGrid = document.getElementById("categoryTotalsGrid");
const totalsGrid = document.getElementById("totalsGrid");
const grandTotal = document.getElementById("grandTotal");

/* =========================================================
   DATABASE OPERATIONS
========================================================= */

function getReports() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error("Unable to load Sunday reports:", error);
        return {};
    }
}

function saveReports(reports) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

/* =========================================================
   DATE HELPERS
========================================================= */

function formatDate(dateValue) {
    if (!dateValue) return "";
    const date = new Date(dateValue + "T00:00:00");
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function getSunday(date) {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() - day);
    return result;
}

function toDateString(date) {
    return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
    );
}

function generateSundays() {
    const today = new Date();
    const currentSunday = getSunday(today);
    const start = new Date(2026, 0, 4);
    const end = new Date(currentSunday);
    end.setMonth(end.getMonth() + 12);

    const dates = [];
    let cursor = new Date(start);

    while (cursor <= end) {
        dates.push(toDateString(cursor));
        cursor.setDate(cursor.getDate() + 7);
    }

    return dates;
}

/* =========================================================
   DATA INITIALIZATION
========================================================= */

function createEmptyReport(date) {
    return {
        date: date,
        pastors: PERMANENT_PASTORS.map(name => createPerson(name, "Pastors")),
        adults: [],
        kids: [],
        primaryWomen: PRIMARY_WOMEN.map(name => createPerson(name, "Primary 12 Women")),
        primaryMen: PRIMARY_MEN.map(name => createPerson(name, "Primary 12 Men")),
        leadersWomen: LEADERS_WOMEN.map(name => createPerson(name, "144 Leaders Women")),
        leadersMen: LEADERS_MEN.map(name => createPerson(name, "144 Leaders Men"))
    };
}

function createPerson(name, category) {
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

function createId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function loadReport(date) {
    const reports = getReports();

    if (!reports[date]) {
        reports[date] = createEmptyReport(date);
        saveReports(reports);
    }

    const report = reports[date];

    // Cleanup
    if (report.primaryWomen) {
        report.primaryWomen = report.primaryWomen.filter(p => p.name !== "Pas. Cristina Bautista");
    }
    if (report.primaryMen) {
        report.primaryMen = report.primaryMen.filter(p => p.name !== "Pas. Efren Bautista");
    }

    if (!report.pastors || report.pastors.length === 0) {
        report.pastors = PERMANENT_PASTORS.map(name => createPerson(name, "Pastors"));
    } else {
        PERMANENT_PASTORS.forEach(pastorName => {
            const exists = report.pastors.some(p => p.name === pastorName);
            if (!exists) {
                report.pastors.unshift(createPerson(pastorName, "Pastors"));
            }
        });
    }

    report.adults = report.adults || [];
    report.kids = report.kids || [];
    report.primaryWomen = report.primaryWomen || PRIMARY_WOMEN.map(name => createPerson(name, "Primary 12 Women"));
    report.primaryMen = report.primaryMen || PRIMARY_MEN.map(name => createPerson(name, "Primary 12 Men"));
    report.leadersWomen = report.leadersWomen || LEADERS_WOMEN.map(name => createPerson(name, "144 Leaders Women"));
    report.leadersMen = report.leadersMen || LEADERS_MEN.map(name => createPerson(name, "144 Leaders Men"));

    return report;
}

/* =========================================================
   RENDERING
========================================================= */

function renderDateSelector(selectedDate) {
    const dates = generateSundays();

    reportDate.innerHTML = dates
        .map(
            date => `
                <option value="${date}" ${date === selectedDate ? "selected" : ""}>
                    ${formatDate(date)}
                </option>
            `
        )
        .join("");
}

function renderReport(date) {
    const report = loadReport(date);

    reportTitle.textContent = "REPORT ON " + formatDate(date).toUpperCase();

    renderPeople(pastorsBody, report.pastors, true, false);
    renderPeople(adultsBody, report.adults, true, true);
    renderPeople(kidsBody, report.kids, true, true);
    
    renderPeople(primaryWomenBody, report.primaryWomen, false, false);
    renderPeople(primaryMenBody, report.primaryMen, false, false);
    renderPeople(leadersWomenBody, report.leadersWomen, false, false);
    renderPeople(leadersMenBody, report.leadersMen, false, false);

    calculateTotals(report);
}

function renderPeople(container, people, editable, fullTimers) {
    if (!container) return;

    if (!people || people.length === 0) {
        const cols = editable ? (fullTimers ? 9 : 4) : (fullTimers ? 8 : 3);
        container.innerHTML = `
            <tr>
                <td colspan="${cols}">
                    <div class="empty-message">No names added yet.</div>
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = people
        .map(person => {
            const isPermanentPastor = PERMANENT_PASTORS.includes(person.name);
            
            const nameCell = (editable && !isPermanentPastor)
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
                        ${!isPermanentPastor ? `
                            <button
                                type="button"
                                class="remove-button"
                                data-remove-id="${person.id}"
                                title="Remove"
                            >
                                ×
                            </button>
                        ` : ''}
                    </td>
                `
                : "";

            const timerCells = fullTimers
                ? `
                    ${renderTimerCell(person, "first")}
                    ${renderTimerCell(person, "second")}
                    ${renderTimerCell(person, "third")}
                    ${renderTimerCell(person, "fourth")}
                    ${renderTimerCell(person, "newNth")}
                    ${renderTimerCell(person, "nt")}
                `
                : `
                    ${renderTimerCell(person, "nt")}
                `;

            return `
                <tr data-id="${person.id}">
                    <td class="category-cell">${escapeHtml(person.category)}</td>
                    <td class="name-cell">${nameCell}</td>
                    ${timerCells}
                    ${removeCell}
                </tr>
            `;
        })
        .join("");
}

function renderTimerCell(person, timer) {
    return `
        <td>
            <input
                type="checkbox"
                class="timer-check"
                data-timer="${timer}"
                data-id="${person.id}"
                ${person.timers && person.timers[timer] ? "checked" : ""}
            >
        </td>
    `;
}

/* =========================================================
   EVENTS & ACTIONS
========================================================= */

document.getElementById("addPastorButton").addEventListener("click", function () {
    const report = loadReport(reportDate.value);
    report.pastors.push(createPerson("", "Pastors"));
    updateCurrentReport(report);
});

document.getElementById("addAdultButton").addEventListener("click", function () {
    const report = loadReport(reportDate.value);
    report.adults.push(createPerson("", "Adults"));
    updateCurrentReport(report);
});

document.getElementById("addKidButton").addEventListener("click", function () {
    const report = loadReport(reportDate.value);
    report.kids.push(createPerson("", "Kids"));
    updateCurrentReport(report);
});

function updateCurrentReport(report) {
    const reports = getReports();
    reports[report.date] = report;
    saveReports(reports);
    renderReport(report.date);
}

document.addEventListener("change", function (event) {
    if (!event.target.classList.contains("timer-check")) return;

    const timer = event.target.dataset.timer;
    const id = event.target.dataset.id;
    const report = loadReport(reportDate.value);
    const person = findPerson(report, id);

    if (!person) return;

    person.timers = person.timers || {};
    person.timers[timer] = event.target.checked;

    updateCurrentReport(report);
});

document.addEventListener("input", function (event) {
    if (!event.target.classList.contains("name-input")) return;

    const id = event.target.dataset.id;
    const report = loadReport(reportDate.value);
    const person = findPerson(report, id);

    if (!person) return;

    person.name = event.target.value;

    const reports = getReports();
    reports[report.date] = report;
    saveReports(reports);

    calculateTotals(report);
});

document.addEventListener("click", function (event) {
    if (!event.target.classList.contains("remove-button")) return;

    const id = event.target.dataset.removeId;
    const report = loadReport(reportDate.value);

    report.pastors = report.pastors.filter(person => person.id !== id);
    report.adults = report.adults.filter(person => person.id !== id);
    report.kids = report.kids.filter(person => person.id !== id);

    updateCurrentReport(report);
});

function findPerson(report, id) {
    const groups = [
        report.pastors,
        report.adults,
        report.kids,
        report.primaryWomen,
        report.primaryMen,
        report.leadersWomen,
        report.leadersMen
    ];

    for (const group of groups) {
        if (!group) continue;
        const found = group.find(person => person.id === id);
        if (found) return found;
    }

    return null;
}

/* =========================================================
   CALCULATIONS & TOTALS
========================================================= */

function countGroupTotal(group) {
    if (!group) return 0;
    let count = 0;
    group.forEach(person => {
        if (!person.name || !person.name.trim()) return;
        const hasChecked = TIMER_KEYS.some(timer => person.timers && person.timers[timer]);
        if (hasChecked) {
            count++;
        }
    });
    return count;
}

function calculateTotals(report) {
    // 1. Group / Category Totals
    const pastorsTotal = countGroupTotal(report.pastors);
    const adultsTotal = countGroupTotal(report.adults);
    const kidsTotal = countGroupTotal(report.kids);
    const primaryTotal = countGroupTotal(report.primaryWomen) + countGroupTotal(report.primaryMen);
    const leadersTotal = countGroupTotal(report.leadersWomen) + countGroupTotal(report.leadersMen);

    categoryTotalsGrid.innerHTML = `
        <div class="category-total-card">
            <span>PASTORS</span>
            <strong>${pastorsTotal}</strong>
        </div>
        <div class="category-total-card">
            <span>ADULTS</span>
            <strong>${adultsTotal}</strong>
        </div>
        <div class="category-total-card">
            <span>KIDS</span>
            <strong>${kidsTotal}</strong>
        </div>
        <div class="category-total-card">
            <span>PRIMARY 12</span>
            <strong>${primaryTotal}</strong>
        </div>
        <div class="category-total-card">
            <span>144 LEADERS</span>
            <strong>${leadersTotal}</strong>
        </div>
    `;

    // 2. Timers Breakdown Totals
    const allPeople = [
        ...(report.pastors || []),
        ...(report.adults || []),
        ...(report.kids || []),
        ...(report.primaryWomen || []),
        ...(report.primaryMen || []),
        ...(report.leadersWomen || []),
        ...(report.leadersMen || [])
    ];

    const totals = { first: 0, second: 0, third: 0, fourth: 0, newNth: 0, nt: 0 };

    allPeople.forEach(person => {
        if (!person.name || !person.name.trim()) return;

        TIMER_KEYS.forEach(timer => {
            if (person.timers && person.timers[timer]) {
                totals[timer]++;
            }
        });
    });

    totalsGrid.innerHTML = TIMER_KEYS.map((timer, index) => `
        <div class="total-card">
            <span>${TIMER_LABELS[index]}</span>
            <strong>${totals[timer]}</strong>
        </div>
    `).join("");

    const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
    grandTotal.textContent = total;
}

/* =========================================================
   SAVE & COPY SUMMARY
========================================================= */

function executeSave() {
    const report = loadReport(reportDate.value);

    report.pastors = report.pastors.filter(person => person.name && person.name.trim());
    report.adults = report.adults.filter(person => person.name && person.name.trim());
    report.kids = report.kids.filter(person => person.name && person.name.trim());

    updateCurrentReport(report);

    alert("Sunday Report saved successfully!\n\nReport Date: " + formatDate(report.date));
}

document.getElementById("saveReportButton").addEventListener("click", executeSave);
document.getElementById("bottomSaveButton").addEventListener("click", executeSave);

document.getElementById("copySummaryButton").addEventListener("click", function () {
    const report = loadReport(reportDate.value);

    const pastorsTotal = countGroupTotal(report.pastors);
    const adultsTotal = countGroupTotal(report.adults);
    const kidsTotal = countGroupTotal(report.kids);
    const primaryTotal = countGroupTotal(report.primaryWomen) + countGroupTotal(report.primaryMen);
    const leadersTotal = countGroupTotal(report.leadersWomen) + countGroupTotal(report.leadersMen);

    const allPeople = [
        ...(report.pastors || []),
        ...(report.adults || []),
        ...(report.kids || []),
        ...(report.primaryWomen || []),
        ...(report.primaryMen || []),
        ...(report.leadersWomen || []),
        ...(report.leadersMen || [])
    ];

    const totals = { first: 0, second: 0, third: 0, fourth: 0, newNth: 0, nt: 0 };

    allPeople.forEach(person => {
        if (!person.name || !person.name.trim()) return;
        TIMER_KEYS.forEach(timer => {
            if (person.timers && person.timers[timer]) totals[timer]++;
        });
    });

    const grand = Object.values(totals).reduce((a, b) => a + b, 0);

    const summaryText = 
`📊 *CONQUERORS SUNDAY REPORT* 📊
📅 Date: ${formatDate(report.date)}

👥 *CATEGORY BREAKDOWN*
• Pastors: ${pastorsTotal}
• Adults: ${adultsTotal}
• Kids: ${kidsTotal}
• Primary 12: ${primaryTotal}
• 144 Leaders: ${leadersTotal}

⏱️ *TIMERS BREAKDOWN*
• 1st Timers: ${totals.first}
• 2nd Timers: ${totals.second}
• 3rd Timers: ${totals.third}
• 4th Timers: ${totals.fourth}
• New NT Timers: ${totals.newNth}
• NT Timers: ${totals.nt}

🔥 *GRAND TOTAL: ${grand}*`;

    navigator.clipboard.writeText(summaryText).then(() => {
        alert("GC Summary Copied to Clipboard!\n\nReady to paste on Messenger.");
    });
});

/* =========================================================
   NAVIGATION & SEARCH
========================================================= */

reportDate.addEventListener("change", function () {
    renderReport(this.value);
    dateSearch.value = "";
});

dateSearch.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    if (!query) return;

    const dates = generateSundays();
    const matched = dates.find(date =>
        formatDate(date).toLowerCase().includes(query)
    );

    if (matched) {
        reportDate.value = matched;
        renderReport(matched);
    }
});

document.getElementById("newReportButton").addEventListener("click", function () {
    const selected = reportDate.value;
    const date = new Date(selected + "T00:00:00");
    date.setDate(date.getDate() + 7);

    const nextSunday = toDateString(date);
    const reports = getReports();

    if (!reports[nextSunday]) {
        reports[nextSunday] = createEmptyReport(nextSunday);
        saveReports(reports);
    }

    renderDateSelector(nextSunday);
    reportDate.value = nextSunday;
    renderReport(nextSunday);
});

/* =========================================================
   UTILITIES & INIT
========================================================= */

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

(function init() {
    const reports = getReports();
    const firstSunday = "2026-08-16";

    if (!reports[firstSunday]) {
        reports[firstSunday] = createEmptyReport(firstSunday);
        saveReports(reports);
    }

    renderDateSelector(firstSunday);
    reportDate.value = firstSunday;
    renderReport(firstSunday);
})();
