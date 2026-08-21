/* =========================================================
   VIP REGISTRATION DATABASE
========================================================= */

const STORAGE_KEY =
    "conquerors_vip_database";


/* =========================================================
   ELEMENTS
========================================================= */

const vipForm =
    document.getElementById("vipForm");

const discipleSearch =
    document.getElementById("discipleSearch");

const discipleResults =
    document.getElementById("discipleResults");

const discipleModal =
    document.getElementById("discipleModal");

const timerModal =
    document.getElementById("timerModal");

const editTimerModal =
    document.getElementById("editTimerModal");

const closeDiscipleModal =
    document.getElementById("closeDiscipleModal");

const closeTimerModal =
    document.getElementById("closeTimerModal");

const closeEditTimerModal =
    document.getElementById("closeEditTimerModal");

const cancelTimerButton =
    document.getElementById("cancelTimerButton");

const cancelEditTimerButton =
    document.getElementById("cancelEditTimerButton");

const reportTimerButton =
    document.getElementById("reportTimerButton");

const viewInfoButton =
    document.getElementById("viewInfoButton");

const editDiscipleButton =
    document.getElementById("editDiscipleButton");

const deleteDiscipleButton =
    document.getElementById("deleteDiscipleButton");

const timerForm =
    document.getElementById("timerForm");

const editTimerForm =
    document.getElementById("editTimerForm");


/* =========================================================
   CURRENT SELECTED DISCIPLE
========================================================= */

let selectedDiscipleId = null;


/* =========================================================
   CURRENT TIMER BEING EDITED
========================================================= */

let editingTimerKey = null;

let editingTimerLabel = null;


/* =========================================================
   LOAD DATABASE
========================================================= */

function getVipDatabase() {

    try {

        const data =
            localStorage.getItem(
                STORAGE_KEY
            );

        return data
            ? JSON.parse(data)
            : [];

    } catch (error) {

        console.error(
            "Unable to load VIP database:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE DATABASE
========================================================= */

function saveVipDatabase(database) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(database)
    );

}


/* =========================================================
   CREATE ID
========================================================= */

function createId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "—";
    }


    const date =
        new Date(
            dateValue + "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateValue;

    }


    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =========================================================
   GET TODAY
========================================================= */

function getToday() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
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
   TIMER DEFINITIONS
========================================================= */

const TIMER_DEFINITIONS = [

    {
        key: "firstTimer",
        label: "1ST TIMER"
    },

    {
        key: "secondTimer",
        label: "2ND TIMER"
    },

    {
        key: "thirdTimer",
        label: "3RD TIMER"
    },

    {
        key: "fourthTimer",
        label: "4TH TIMER"
    },

    {
        key: "newNthTimer",
        label: "NEW NTH TIMER"
    },

    {
        key: "ntTimer",
        label: "NT TIMER"
    }

];


/* =========================================================
   ENSURE TIMER OBJECT
========================================================= */

function ensureTimers(disciple) {

    if (
        !disciple.timers ||
        typeof disciple.timers !== "object"
    ) {

        disciple.timers = {};

    }


    if (
        !Object.prototype.hasOwnProperty.call(
            disciple.timers,
            "firstTimer"
        )
    ) {

        disciple.timers.firstTimer = null;

    }


    if (
        !Object.prototype.hasOwnProperty.call(
            disciple.timers,
            "secondTimer"
        )
    ) {

        disciple.timers.secondTimer = null;

    }


    if (
        !Object.prototype.hasOwnProperty.call(
            disciple.timers,
            "thirdTimer"
        )
    ) {

        disciple.timers.thirdTimer = null;

    }


    if (
        !Object.prototype.hasOwnProperty.call(
            disciple.timers,
            "fourthTimer"
        )
    ) {

        disciple.timers.fourthTimer = null;

    }


    if (
        !Object.prototype.hasOwnProperty.call(
            disciple.timers,
            "newNthTimer"
        )
    ) {

        disciple.timers.newNthTimer = null;

    }


    if (
        !Object.prototype.hasOwnProperty.call(
            disciple.timers,
            "ntTimer"
        )
    ) {

        disciple.timers.ntTimer = null;

    }


    return disciple.timers;

}


/* =========================================================
   FORM SUBMIT
========================================================= */

if (vipForm) {

    vipForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const formData =
                new FormData(vipForm);


            const decisions =
                formData.getAll(
                    "decision"
                );


            /*
             * Registration date automatically
             * becomes 1ST TIMER.
             */

            const registrationDate =
                getToday();


            const newDisciple = {

                id:
                    createId(),

                completeName:
                    formData.get(
                        "completeName"
                    ),

                homeAddress:
                    formData.get(
                        "homeAddress"
                    ),

                city:
                    formData.get(
                        "city"
                    ),

                contactNo:
                    formData.get(
                        "contactNo"
                    ),

                gender:
                    formData.get(
                        "gender"
                    ),

                birthday:
                    formData.get(
                        "birthday"
                    ),

                age:
                    formData.get(
                        "age"
                    ),

                invitedBy:
                    formData.get(
                        "invitedBy"
                    ),

                celebration:
                    formData.get(
                        "celebration"
                    ),

                celebrationDate:
                    formData.get(
                        "celebrationDate"
                    ),

                decisions:
                    decisions,

                consolidatedBy:
                    formData.get(
                        "consolidatedBy"
                    ),

                networkLeader:
                    formData.get(
                        "networkLeader"
                    ),

                lifeGroupLeader:
                    formData.get(
                        "lifeGroupLeader"
                    ),


                timers: {

                    firstTimer:
                        registrationDate,

                    secondTimer:
                        null,

                    thirdTimer:
                        null,

                    fourthTimer:
                        null,

                    newNthTimer:
                        null,

                    ntTimer:
                        null

                },


                createdAt:
                    new Date().toISOString()

            };


            const database =
                getVipDatabase();


            database.push(
                newDisciple
            );


            saveVipDatabase(
                database
            );


            alert(
                "VIP Registration submitted successfully!\n\n" +
                "1st Timer: " +
                formatDate(
                    registrationDate
                )
            );


            vipForm.reset();


            const city =
                document.getElementById(
                    "city"
                );


            if (city) {

                city.value =
                    "Parañaque";

            }


            renderSearchResults(
                discipleSearch
                    ? discipleSearch.value
                    : ""
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

if (discipleSearch) {

    discipleSearch.addEventListener(
        "input",
        function() {

            renderSearchResults(
                this.value
            );

        }
    );

}


/* =========================================================
   RENDER SEARCH RESULTS
========================================================= */

function renderSearchResults(
    searchValue = ""
) {

    if (!discipleResults) {
        return;
    }


    const database =
        getVipDatabase();


    const query =
        searchValue
            .trim()
            .toLowerCase();


    const results =
        database.filter(
            disciple => {

                return String(
                    disciple.completeName || ""
                )
                .toLowerCase()
                .includes(
                    query
                );

            }
        );


    if (!query) {

        discipleResults.innerHTML = `

            <div class="empty-search">

                <span>
                    🔎
                </span>

                <p>
                    Search a disciple name
                </p>

            </div>

        `;

        return;

    }


    if (
        results.length === 0
    ) {

        discipleResults.innerHTML = `

            <div class="empty-search">

                <span>
                    ⚠
                </span>

                <p>
                    No disciple found.
                </p>

            </div>

        `;

        return;

    }


    discipleResults.innerHTML =
        results.map(
            disciple => {

                ensureTimers(
                    disciple
                );


                return `

                    <button
                        type="button"
                        class="disciple-result"
                        data-id="${escapeHtml(
                            disciple.id
                        )}"
                    >

                        <div>

                            <strong>
                                ${escapeHtml(
                                    disciple.completeName
                                )}
                            </strong>

                            <small>
                                1st Timer:
                                ${formatDate(
                                    disciple.timers.firstTimer
                                )}
                            </small>

                        </div>

                        <span>
                            →
                        </span>

                    </button>

                `;

            }
        ).join("");


    document
        .querySelectorAll(
            ".disciple-result"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        openDiscipleModal(
                            this.dataset.id
                        );

                    }
                );

            }
        );

}


/* =========================================================
   OPEN DISCIPLE MODAL
========================================================= */

function openDiscipleModal(
    discipleId
) {

    const database =
        getVipDatabase();


    const disciple =
        database.find(
            item =>
                item.id === discipleId
        );


    if (!disciple) {
        return;
    }


    ensureTimers(
        disciple
    );


    selectedDiscipleId =
        discipleId;


    const nameElement =
        document.getElementById(
            "modalDiscipleName"
        );


    if (nameElement) {

        nameElement.textContent =
            disciple.completeName;

    }


    renderTimerHistory(
        disciple
    );


    const info =
        document.getElementById(
            "modalFullInfo"
        );


    if (info) {

        info.classList.add(
            "hidden"
        );

    }


    if (discipleModal) {

        discipleModal.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   RENDER TIMER HISTORY
========================================================= */

function renderTimerHistory(
    disciple
) {

    if (!disciple) {
        return;
    }


    const timers =
        ensureTimers(
            disciple
        );


    const historyElement =
        document.getElementById(
            "modalTimerHistory"
        );


    if (!historyElement) {
        return;
    }


    historyElement.innerHTML =
        TIMER_DEFINITIONS
            .map(
                timer => {

                    const date =
                        timers[
                            timer.key
                        ];


                    if (date) {

                        return `

                            <div
                                class="timer-row"
                            >

                                <div
                                    class="timer-row-info"
                                >

                                    <strong>
                                        ${timer.label}
                                    </strong>

                                    <span>
                                        ${formatDate(
                                            date
                                        )}
                                    </span>

                                </div>


                                <div
                                    class="timer-actions"
                                >

                                    <button
                                        type="button"
                                        class="timer-action timer-edit"
                                        data-timer-key="${timer.key}"
                                        data-timer-label="${timer.label}"
                                    >
                                        EDIT
                                    </button>


                                    <button
                                        type="button"
                                        class="timer-action timer-delete"
                                        data-timer-key="${timer.key}"
                                        data-timer-label="${timer.label}"
                                    >
                                        DELETE
                                    </button>

                                </div>

                            </div>

                        `;

                    }


                    /*
                     * 1st Timer should normally
                     * always exist.
                     *
                     * But if an old record has
                     * no date, allow ADD.
                     */

                    return `

                        <div
                            class="timer-row"
                        >

                            <div
                                class="timer-row-info"
                            >

                                <strong>
                                    ${timer.label}
                                </strong>

                                <span
                                    class="timer-empty"
                                >
                                    No date recorded
                                </span>

                            </div>


                            <div
                                class="timer-actions"
                            >

                                <button
                                    type="button"
                                    class="timer-action timer-add"
                                    data-timer-key="${timer.key}"
                                    data-timer-label="${timer.label}"
                                >
                                    ADD DATE
                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    /*
     * EDIT buttons
     */

    historyElement
        .querySelectorAll(
            ".timer-edit"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        openEditTimerModal(
                            this.dataset.timerKey,
                            this.dataset.timerLabel
                        );

                    }
                );

            }
        );


    /*
     * DELETE buttons
     */

    historyElement
        .querySelectorAll(
            ".timer-delete"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        deleteTimer(
                            this.dataset.timerKey,
                            this.dataset.timerLabel
                        );

                    }
                );

            }
        );


    /*
     * ADD DATE buttons
     */

    historyElement
        .querySelectorAll(
            ".timer-add"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        openAddTimerModal(
                            this.dataset.timerKey,
                            this.dataset.timerLabel
                        );

                    }
                );

            }
        );

}


/* =========================================================
   OPEN ADD TIMER MODAL
========================================================= */

function openAddTimerModal(
    timerKey,
    timerLabel
) {

    if (!selectedDiscipleId) {
        return;
    }


    const database =
        getVipDatabase();


    const disciple =
        database.find(
            item =>
                item.id ===
                selectedDiscipleId
        );


    if (!disciple) {
        return;
    }


    ensureTimers(
        disciple
    );


    const timerType =
        document.getElementById(
            "timerType"
        );


    const timerDate =
        document.getElementById(
            "timerDate"
        );


    const timerName =
        document.getElementById(
            "timerDiscipleName"
        );


    if (timerName) {

        timerName.textContent =
            disciple.completeName;

    }


    /*
     * For 2nd, 3rd, etc.,
     * select the correct timer.
     *
     * 1st timer is also editable
     * from the history.
     */

    const timerMap = {

        firstTimer:
            "",

        secondTimer:
            "2nd Timer",

        thirdTimer:
            "3rd Timer",

        fourthTimer:
            "4th Timer",

        newNthTimer:
            "New NTH Timer",

        ntTimer:
            "NT Timer"

    };


    if (timerType) {

        timerType.value =
            timerMap[timerKey] || "";

    }


    if (timerDate) {

        timerDate.value =
            timersSafeValue(
                disciple,
                timerKey
            ) ||
            getToday();

    }


    /*
     * 1st Timer is handled through
     * the edit timer modal.
     */

    if (
        timerKey === "firstTimer"
    ) {

        openEditTimerModal(
            timerKey,
            timerLabel
        );

        return;

    }


    if (timerModal) {

        timerModal.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   SAFE TIMER VALUE
========================================================= */

function timersSafeValue(
    disciple,
    key
) {

    if (
        !disciple ||
        !disciple.timers
    ) {

        return null;

    }


    return (
        disciple.timers[key] ||
        null
    );

}


/* =========================================================
   OPEN EDIT TIMER MODAL
========================================================= */

function openEditTimerModal(
    timerKey,
    timerLabel
) {

    if (!selectedDiscipleId) {
        return;
    }


    const database =
        getVipDatabase();


    const disciple =
        database.find(
            item =>
                item.id ===
                selectedDiscipleId
        );


    if (!disciple) {
        return;
    }


    ensureTimers(
        disciple
    );


    editingTimerKey =
        timerKey;


    editingTimerLabel =
        timerLabel;


    const title =
        document.getElementById(
            "editTimerTitle"
        );


    const dateInput =
        document.getElementById(
            "editTimerDate"
        );


    if (title) {

        title.textContent =
            "EDIT " +
            timerLabel;

    }


    if (dateInput) {

        dateInput.value =
            disciple.timers[
                timerKey
            ] || getToday();

    }


    if (editTimerModal) {

        editTimerModal.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   EDIT TIMER SUBMIT
========================================================= */

if (editTimerForm) {

    editTimerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (
                !selectedDiscipleId ||
                !editingTimerKey
            ) {

                return;

            }


            const dateInput =
                document.getElementById(
                    "editTimerDate"
                );


            const newDate =
                dateInput
                    ? dateInput.value
                    : "";


            if (!newDate) {

                alert(
                    "Please select a date."
                );

                return;

            }


            const database =
                getVipDatabase();


            const index =
                database.findIndex(
                    item =>
                        item.id ===
                        selectedDiscipleId
                );


            if (index === -1) {
                return;
            }


            const disciple =
                database[index];


            ensureTimers(
                disciple
            );


            disciple.timers[
                editingTimerKey
            ] = newDate;


            database[index] =
                disciple;


            saveVipDatabase(
                database
            );


            /*
             * Close edit modal
             */

            if (editTimerModal) {

                editTimerModal.classList.add(
                    "hidden"
                );

            }


            /*
             * Refresh profile
             */

            renderTimerHistory(
                disciple
            );


            /*
             * Refresh search result
             */

            renderSearchResults(
                discipleSearch
                    ? discipleSearch.value
                    : ""
            );


            alert(
                editingTimerLabel +
                " date updated successfully!"
            );


            editingTimerKey = null;

            editingTimerLabel = null;

        }
    );

}


/* =========================================================
   DELETE TIMER
========================================================= */

function deleteTimer(
    timerKey,
    timerLabel
) {

    if (!selectedDiscipleId) {
        return;
    }


    const database =
        getVipDatabase();


    const index =
        database.findIndex(
            item =>
                item.id ===
                selectedDiscipleId
        );


    if (index === -1) {
        return;
    }


    const disciple =
        database[index];


    ensureTimers(
        disciple
    );


    const currentDate =
        disciple.timers[
            timerKey
        ];


    if (!currentDate) {

        return;

    }


    /*
     * Extra protection for 1st timer.
     */

    const confirmed =
        confirm(
            "DELETE " +
            timerLabel +
            " DATE?\n\n" +

            disciple.completeName +
            "\n\n" +

            timerLabel +
            ": " +
            formatDate(
                currentDate
            ) +

            "\n\n" +

            "This will remove only this timer date."
        );


    if (!confirmed) {
        return;
    }


    disciple.timers[
        timerKey
    ] = null;


    database[index] =
        disciple;


    saveVipDatabase(
        database
    );


    renderTimerHistory(
        disciple
    );


    renderSearchResults(
        discipleSearch
            ? discipleSearch.value
            : ""
    );


    alert(
        timerLabel +
        " date deleted."
    );

}


/* =========================================================
   REPORT TIMER BUTTON
========================================================= */

if (reportTimerButton) {

    reportTimerButton.addEventListener(
        "click",
        function() {

            if (!selectedDiscipleId) {
                return;
            }


            const database =
                getVipDatabase();


            const disciple =
                database.find(
                    item =>
                        item.id ===
                        selectedDiscipleId
                );


            if (!disciple) {
                return;
            }


            ensureTimers(
                disciple
            );


            const timerName =
                document.getElementById(
                    "timerDiscipleName"
                );


            const timerDate =
                document.getElementById(
                    "timerDate"
                );


            const timerType =
                document.getElementById(
                    "timerType"
                );


            if (timerName) {

                timerName.textContent =
                    disciple.completeName;

            }


            if (timerDate) {

                timerDate.value =
                    getToday();

            }


            if (timerType) {

                timerType.value =
                    "";

            }


            if (timerModal) {

                timerModal.classList.remove(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
   CLOSE TIMER MODAL
========================================================= */

function closeTimerReportModal() {

    if (timerModal) {

        timerModal.classList.add(
            "hidden"
        );

    }

}


if (closeTimerModal) {

    closeTimerModal.addEventListener(
        "click",
        closeTimerReportModal
    );

}


if (cancelTimerButton) {

    cancelTimerButton.addEventListener(
        "click",
        closeTimerReportModal
    );

}


/* =========================================================
   TIMER SUBMIT
========================================================= */

if (timerForm) {

    timerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (!selectedDiscipleId) {
                return;
            }


            const timerType =
                document.getElementById(
                    "timerType"
                ).value;


            const timerDate =
                document.getElementById(
                    "timerDate"
                ).value;


            if (
                !timerType ||
                !timerDate
            ) {

                alert(
                    "Please select the timer type and date."
                );

                return;

            }


            const database =
                getVipDatabase();


            const discipleIndex =
                database.findIndex(
                    item =>
                        item.id ===
                        selectedDiscipleId
                );


            if (
                discipleIndex === -1
            ) {

                return;

            }


            const disciple =
                database[
                    discipleIndex
                ];


            ensureTimers(
                disciple
            );


            let timerKey;


            switch (timerType) {

                case "2nd Timer":

                    timerKey =
                        "secondTimer";

                    break;


                case "3rd Timer":

                    timerKey =
                        "thirdTimer";

                    break;


                case "4th Timer":

                    timerKey =
                        "fourthTimer";

                    break;


                case "New NTH Timer":

                    timerKey =
                        "newNthTimer";

                    break;


                case "NT Timer":

                    timerKey =
                        "ntTimer";

                    break;


                default:

                    return;

            }


            /*
             * Existing date?
             */

            if (
                disciple.timers[
                    timerKey
                ]
            ) {

                const confirmReplace =
                    confirm(
                        timerType +
                        " already has a date:\n\n" +

                        formatDate(
                            disciple.timers[
                                timerKey
                            ]
                        ) +

                        "\n\nReplace it?"
                    );


                if (!confirmReplace) {
                    return;
                }

            }


            disciple.timers[
                timerKey
            ] = timerDate;


            database[
                discipleIndex
            ] = disciple;


            saveVipDatabase(
                database
            );


            if (timerModal) {

                timerModal.classList.add(
                    "hidden"
                );

            }


            renderTimerHistory(
                disciple
            );


            renderSearchResults(
                discipleSearch
                    ? discipleSearch.value
                    : ""
            );


            alert(
                timerType +
                " saved successfully!"
            );

        }
    );

}


/* =========================================================
   CLOSE EDIT TIMER MODAL
========================================================= */

function closeEditTimer() {

    if (editTimerModal) {

        editTimerModal.classList.add(
            "hidden"
        );

    }


    editingTimerKey =
        null;


    editingTimerLabel =
        null;

}


if (closeEditTimerModal) {

    closeEditTimerModal.addEventListener(
        "click",
        closeEditTimer
    );

}


if (cancelEditTimerButton) {

    cancelEditTimerButton.addEventListener(
        "click",
        closeEditTimer
    );

}


/* =========================================================
   CLOSE DISCIPLE MODAL
========================================================= */

if (closeDiscipleModal) {

    closeDiscipleModal.addEventListener(
        "click",
        function() {

            discipleModal.classList.add(
                "hidden"
            );

            selectedDiscipleId =
                null;

        }
    );

}


/* =========================================================
   CLICK OUTSIDE DISCIPLE MODAL
========================================================= */

if (discipleModal) {

    discipleModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                discipleModal
            ) {

                discipleModal.classList.add(
                    "hidden"
                );

                selectedDiscipleId =
                    null;

            }

        }
    );

}


/* =========================================================
   CLICK OUTSIDE TIMER MODALS
========================================================= */

if (timerModal) {

    timerModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                timerModal
            ) {

                closeTimerReportModal();

            }

        }
    );

}


if (editTimerModal) {

    editTimerModal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                editTimerModal
            ) {

                closeEditTimer();

            }

        }
    );

}


/* =========================================================
   VIEW ALL INFORMATION
========================================================= */

if (viewInfoButton) {

    viewInfoButton.addEventListener(
        "click",
        function() {

            if (!selectedDiscipleId) {
                return;
            }


            const database =
                getVipDatabase();


            const disciple =
                database.find(
                    item =>
                        item.id ===
                        selectedDiscipleId
                );


            if (!disciple) {
                return;
            }


            const info =
                document.getElementById(
                    "modalFullInfo"
                );


            if (!info) {
                return;
            }


            info.innerHTML = `

                <div class="info-grid">

                    <div>
                        <span>COMPLETE NAME</span>

                        <strong>
                            ${escapeHtml(
                                disciple.completeName
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>HOME ADDRESS</span>

                        <strong>
                            ${escapeHtml(
                                disciple.homeAddress
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>CITY</span>

                        <strong>
                            ${escapeHtml(
                                disciple.city
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>CONTACT NO.</span>

                        <strong>
                            ${escapeHtml(
                                disciple.contactNo
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>GENDER</span>

                        <strong>
                            ${escapeHtml(
                                disciple.gender
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>BIRTHDAY</span>

                        <strong>
                            ${formatDate(
                                disciple.birthday
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>AGE</span>

                        <strong>
                            ${escapeHtml(
                                disciple.age
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>INVITED BY</span>

                        <strong>
                            ${
                                escapeHtml(
                                    disciple.invitedBy
                                ) || "—"
                            }
                        </strong>
                    </div>


                    <div>
                        <span>CELEBRATION</span>

                        <strong>
                            ${
                                escapeHtml(
                                    disciple.celebration
                                ) || "—"
                            }
                        </strong>
                    </div>


                    <div>
                        <span>CELEBRATION DATE</span>

                        <strong>
                            ${formatDate(
                                disciple.celebrationDate
                            )}
                        </strong>
                    </div>


                    <div>
                        <span>CONSOLIDATED BY</span>

                        <strong>
                            ${
                                escapeHtml(
                                    disciple.consolidatedBy
                                ) || "—"
                            }
                        </strong>
                    </div>


                    <div>
                        <span>NETWORK LEADER</span>

                        <strong>
                            ${
                                escapeHtml(
                                    disciple.networkLeader
                                ) || "—"
                            }
                        </strong>
                    </div>


                    <div>
                        <span>LIFE GROUP LEADER</span>

                        <strong>
                            ${
                                escapeHtml(
                                    disciple.lifeGroupLeader
                                ) || "—"
                            }
                        </strong>
                    </div>

                </div>

            `;


            info.classList.toggle(
                "hidden"
            );

        }
    );

}


/* =========================================================
   EDIT DISCIPLE INFORMATION
========================================================= */

if (editDiscipleButton) {

    editDiscipleButton.addEventListener(
        "click",
        function() {

            if (!selectedDiscipleId) {
                return;
            }


            const database =
                getVipDatabase();


            const disciple =
                database.find(
                    item =>
                        item.id ===
                        selectedDiscipleId
                );


            if (!disciple) {
                return;
            }


            if (discipleModal) {

                discipleModal.classList.add(
                    "hidden"
                );

            }


            const fields = {

                completeName:
                    disciple.completeName,

                homeAddress:
                    disciple.homeAddress,

                city:
                    disciple.city,

                contactNo:
                    disciple.contactNo,

                gender:
                    disciple.gender,

                birthday:
                    disciple.birthday,

                age:
                    disciple.age,

                invitedBy:
                    disciple.invitedBy,

                celebration:
                    disciple.celebration,

                celebrationDate:
                    disciple.celebrationDate,

                consolidatedBy:
                    disciple.consolidatedBy,

                networkLeader:
                    disciple.networkLeader,

                lifeGroupLeader:
                    disciple.lifeGroupLeader

            };


            Object.keys(fields)
                .forEach(
                    id => {

                        const element =
                            document.getElementById(
                                id
                            );


                        if (element) {

                            element.value =
                                fields[id] || "";

                        }

                    }
                );


            document
                .querySelectorAll(
                    'input[name="decision"]'
                )
                .forEach(
                    checkbox => {

                        checkbox.checked =
                            (
                                disciple.decisions ||
                                []
                            ).includes(
                                checkbox.value
                            );

                    }
                );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            alert(
                "The disciple information has been loaded into the form for editing.\n\n" +
                "The existing timer history is preserved."
            );

        }
    );

}


/* =========================================================
   DELETE ENTIRE DISCIPLE
========================================================= */

if (deleteDiscipleButton) {

    deleteDiscipleButton.addEventListener(
        "click",
        function() {

            if (!selectedDiscipleId) {
                return;
            }


            const database =
                getVipDatabase();


            const disciple =
                database.find(
                    item =>
                        item.id ===
                        selectedDiscipleId
                );


            if (!disciple) {
                return;
            }


            const confirmed =
                confirm(
                    "DELETE VIP RECORD?\n\n" +

                    disciple.completeName +

                    "\n\n" +

                    "This will delete the complete information and timer history."
                );


            if (!confirmed) {
                return;
            }


            const newDatabase =
                database.filter(
                    item =>
                        item.id !==
                        selectedDiscipleId
                );


            saveVipDatabase(
                newDatabase
            );


            if (discipleModal) {

                discipleModal.classList.add(
                    "hidden"
                );

            }


            selectedDiscipleId =
                null;


            renderSearchResults(
                discipleSearch
                    ? discipleSearch.value
                    : ""
            );


            alert(
                "VIP record deleted."
            );

        }
    );

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (discipleModal) {

            discipleModal.classList.add(
                "hidden"
            );

        }


        if (timerModal) {

            timerModal.classList.add(
                "hidden"
            );

        }


        if (editTimerModal) {

            editTimerModal.classList.add(
                "hidden"
            );

        }


        selectedDiscipleId =
            null;


        editingTimerKey =
            null;


        editingTimerLabel =
            null;

    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

renderSearchResults();