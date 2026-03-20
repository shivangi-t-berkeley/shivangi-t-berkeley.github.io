const STORAGE_KEYS = {
    stats: "wdwn_stats",
    today: "wdwn_today",
    tutorialSeen: "wdwn_tutorial_seen"
};

const DEMO_REOPEN_TUTORIAL_ON_START = true;
const SCORE_BUCKETS = ["3", "4", "5", "6", "7+"];
const TUTORIAL_STEPS = [
    {
        title: "How this works",
        text: "Use the clues to figure out which detail belongs to each person.",
        bullets: [
            "Each person has one match in each category.",
            "There is only one full solution that fits all of the clues."
        ]
    },
    {
        title: "Start with the clues",
        text: "Read through the clue cards and look for facts that eliminate options right away.",
        bullets: [
            "Some clues tell you what cannot be true.",
            "Some clues link two details together directly."
        ]
    },
    {
        title: "Mark the grid",
        text: "Use the case map to track your deductions as you go.",
        bullets: [
            "Tap once for X when a match is impossible.",
            "Tap again for ✓ when you know a match is correct.",
            "Each row and column can only have one ✓."
        ]
    },
    {
        title: "Beat the clock",
        text: "The timer starts right away and your score drops as time passes.",
        bullets: [
            "When each person has one confirmed match in every category, the case is checked automatically.",
            "Faster solves earn more points."
        ]
    }
];

let currentPuzzle = null;
let state = null;
let countdownTimer = null;
let caseTimer = null;
let toastTimer = null;
let tutorialStepIndex = 0;
let pendingCaseStart = false;
let confettiCleanupTimer = null;

document.addEventListener("DOMContentLoaded", () => {
    currentPuzzle = getTodaysPuzzle();
    state = loadTodayState(currentPuzzle);
    bindEvents();
    render();
    startCountdown();
    syncCaseTimer();
    maybeShowTutorial();
});

function bindEvents() {
    document.getElementById("start-case-btn").addEventListener("click", startCase);
    document.getElementById("replay-btn").addEventListener("click", replayPuzzle);
    document.getElementById("help-btn").addEventListener("click", openTutorial);
    document.getElementById("stats-btn").addEventListener("click", () => {
        renderStats();
        openModal("stats-modal");
    });
    document.getElementById("result-stats-btn").addEventListener("click", () => {
        renderStats();
        openModal("stats-modal");
    });
    document.getElementById("already-played-stats").addEventListener("click", () => {
        renderStats();
        openModal("stats-modal");
    });
    document.getElementById("share-btn").addEventListener("click", shareResult);
    document.getElementById("already-played-share").addEventListener("click", shareResult);
    document.getElementById("result-replay-btn").addEventListener("click", replayPuzzle);
    document.getElementById("already-played-replay").addEventListener("click", replayPuzzle);
    document.getElementById("tutorial-back-btn").addEventListener("click", showPreviousTutorialStep);
    document.getElementById("tutorial-next-btn").addEventListener("click", showNextTutorialStep);

    document.querySelectorAll("[data-close]").forEach((button) => {
        button.addEventListener("click", () => closeModal(button.dataset.close));
    });

    document.querySelectorAll(".modal").forEach((modal) => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

function render() {
    renderHeader();
    renderClues();
    renderGrid();
    renderScreenState();
}

function renderHeader() {
    document.getElementById("puzzle-label").textContent = `Puzzle #${currentPuzzle.id} · ${formatPuzzleDate(currentPuzzle.date)}`;
    document.getElementById("puzzle-title").textContent = currentPuzzle.title;
    renderCaseIllustration();
    document.getElementById("puzzle-narrative").textContent = currentPuzzle.narrative;

    const statusLabel = document.getElementById("status-pill");
    if (isResolved()) {
        statusLabel.textContent = state.status === "solved" ? "Solved today" : "Locked for today";
    } else if (state.phase === "briefing") {
        statusLabel.textContent = "Ready to start";
    } else {
        statusLabel.textContent = "Live case";
    }
}

function renderCaseIllustration() {
    const container = document.getElementById("case-illustration");
    container.innerHTML = getCaseIllustrationSvg(currentPuzzle.id);
}

function getCaseIllustrationSvg(puzzleId) {
    if (puzzleId === 1) {
        return `
            <svg viewBox="0 0 720 320" role="presentation" focusable="false">
                <defs>
                    <linearGradient id="case-bg-1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#fff7ea" />
                        <stop offset="100%" stop-color="#f0f4fb" />
                    </linearGradient>
                </defs>
                <rect width="720" height="320" rx="28" fill="url(#case-bg-1)" />
                <circle cx="604" cy="66" r="78" fill="#eed7a7" opacity="0.65" />
                <rect x="92" y="184" width="536" height="82" rx="16" fill="#261b17" />
                <rect x="126" y="160" width="112" height="20" rx="10" fill="#c9a45b" />
                <rect x="304" y="160" width="112" height="20" rx="10" fill="#c9a45b" />
                <rect x="482" y="160" width="112" height="20" rx="10" fill="#c9a45b" />
                <path d="M144 154 L174 84 L204 154" fill="none" stroke="#c9a45b" stroke-width="10" stroke-linecap="round" />
                <path d="M322 154 L352 84 L382 154" fill="none" stroke="#c9a45b" stroke-width="10" stroke-linecap="round" />
                <path d="M500 154 L530 84 L560 154" fill="none" stroke="#c9a45b" stroke-width="10" stroke-linecap="round" />
                <circle cx="174" cy="108" r="24" fill="#fff6d8" stroke="#c9a45b" stroke-width="6" />
                <circle cx="352" cy="108" r="24" fill="#fff6d8" stroke="#c9a45b" stroke-width="6" />
                <circle cx="530" cy="108" r="24" fill="#fff6d8" stroke="#c9a45b" stroke-width="6" />
                <rect x="180" y="198" width="116" height="54" rx="14" fill="#faf6ef" />
                <rect x="302" y="194" width="100" height="58" rx="14" fill="#f6dfbf" />
                <path d="M438 230 C468 196, 542 196, 566 230 C542 252, 468 252, 438 230 Z" fill="#d8a25f" />
                <path d="M454 228 C486 206, 522 206, 550 228" fill="none" stroke="#8c5221" stroke-width="8" stroke-linecap="round" />
            </svg>
        `;
    }

    if (puzzleId === 2) {
        return `
            <svg viewBox="0 0 720 320" role="presentation" focusable="false">
                <defs>
                    <linearGradient id="case-bg-2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#f7f3e8" />
                        <stop offset="100%" stop-color="#eef4ff" />
                    </linearGradient>
                </defs>
                <rect width="720" height="320" rx="28" fill="url(#case-bg-2)" />
                <path d="M86 236 C174 178, 262 166, 350 202 C438 238, 548 238, 634 172" fill="none" stroke="#d4d9e4" stroke-width="18" stroke-linecap="round" />
                <rect x="92" y="94" width="152" height="122" rx="18" fill="#8f1d24" />
                <rect x="284" y="112" width="150" height="104" rx="18" fill="#003d5f" />
                <rect x="476" y="88" width="150" height="128" rx="18" fill="#2c6e49" />
                <rect x="118" y="120" width="100" height="22" rx="11" fill="#f8ead3" />
                <rect x="318" y="138" width="84" height="18" rx="9" fill="#ffe1a8" />
                <rect x="510" y="118" width="82" height="20" rx="10" fill="#f3d5a8" />
                <path d="M126 174 C156 152, 182 152, 210 174 C182 194, 154 194, 126 174 Z" fill="#ddb267" />
                <rect x="324" y="168" width="76" height="20" rx="10" fill="#cf7d2f" />
                <circle cx="552" cy="174" r="26" fill="#b65d2b" />
                <circle cx="532" cy="174" r="16" fill="#d08d3c" />
                <circle cx="572" cy="174" r="16" fill="#d08d3c" />
            </svg>
        `;
    }

    return `
        <svg viewBox="0 0 720 320" role="presentation" focusable="false">
            <defs>
                <linearGradient id="case-bg-3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#eef2f8" />
                    <stop offset="100%" stop-color="#fdf4e7" />
                </linearGradient>
            </defs>
            <rect width="720" height="320" rx="28" fill="url(#case-bg-3)" />
            <ellipse cx="520" cy="82" rx="126" ry="56" fill="#d8dde8" />
            <path d="M98 234 H624" stroke="#372821" stroke-width="12" stroke-linecap="round" />
            <rect x="126" y="198" width="470" height="20" rx="10" fill="#3c2a22" />
            <rect x="150" y="166" width="18" height="70" rx="8" fill="#101010" />
            <rect x="552" y="166" width="18" height="70" rx="8" fill="#101010" />
            <path d="M214 164 C252 128, 318 126, 352 160" fill="none" stroke="#d9dce2" stroke-width="16" stroke-linecap="round" />
            <path d="M306 164 C344 128, 410 126, 444 160" fill="none" stroke="#cfd4dd" stroke-width="16" stroke-linecap="round" />
            <path d="M392 164 C430 128, 496 126, 530 160" fill="none" stroke="#d9dce2" stroke-width="16" stroke-linecap="round" />
            <rect x="156" y="108" width="78" height="66" rx="14" fill="#0f4c81" />
            <rect x="252" y="112" width="78" height="62" rx="14" fill="#f0f2f7" />
            <rect x="348" y="104" width="78" height="70" rx="14" fill="#0f4c81" />
            <path d="M108 214 C154 194, 198 194, 236 214" fill="none" stroke="#c46a2d" stroke-width="10" stroke-linecap="round" />
            <path d="M258 214 C302 186, 354 186, 396 214" fill="none" stroke="#d18a3f" stroke-width="10" stroke-linecap="round" />
            <path d="M418 214 C464 194, 518 194, 560 214" fill="none" stroke="#c46a2d" stroke-width="10" stroke-linecap="round" />
        </svg>
    `;
}

function renderClues() {
    document.getElementById("clue-counter").textContent = `${currentPuzzle.clues.length} clues in the file`;
    document.getElementById("timer-display").textContent = isResolved()
        ? formatDuration(state.elapsedSeconds)
        : formatDuration(state.elapsedSeconds);
    document.getElementById("stakes-display").textContent = `Stakes: ${scoreFromTime(state.elapsedSeconds)} pts`;

    const clueList = document.getElementById("clue-list");
    clueList.innerHTML = "";

    currentPuzzle.clues.forEach((clue, index) => {
        const card = document.createElement("article");
        card.className = "clue-card";
        card.innerHTML = `
            <div class="clue-number">${index + 1}</div>
            <p class="clue-card-body">${clue.text}</p>
        `;
        clueList.appendChild(card);
    });
}

function maybeShowTutorial() {
    if (readStorage(STORAGE_KEYS.tutorialSeen, false)) {
        return;
    }

    openTutorial();
}

function openTutorial() {
    tutorialStepIndex = 0;
    renderTutorialStep();
    stopCaseTimer();
    openModal("help-modal");
}

function renderTutorialStep() {
    const step = TUTORIAL_STEPS[tutorialStepIndex];
    const isFirstStep = tutorialStepIndex === 0;
    const isLastStep = tutorialStepIndex === TUTORIAL_STEPS.length - 1;

    document.getElementById("tutorial-step-label").textContent = `Step ${tutorialStepIndex + 1} of ${TUTORIAL_STEPS.length}`;
    document.getElementById("help-title").textContent = step.title;
    document.getElementById("tutorial-text").textContent = step.text;

    const list = document.getElementById("tutorial-list");
    list.innerHTML = "";
    step.bullets.forEach((bullet) => {
        const item = document.createElement("li");
        item.textContent = bullet;
        list.appendChild(item);
    });

    document.getElementById("tutorial-actions").classList.toggle("is-first-step", isFirstStep);
    document.getElementById("tutorial-back-btn").disabled = isFirstStep;
    document.getElementById("tutorial-next-btn").textContent = isLastStep
        ? "Start Case"
        : "Next";
}

function showPreviousTutorialStep() {
    if (tutorialStepIndex === 0) {
        return;
    }

    tutorialStepIndex -= 1;
    renderTutorialStep();
}

function showNextTutorialStep() {
    if (tutorialStepIndex === TUTORIAL_STEPS.length - 1) {
        closeModal("help-modal");
        return;
    }

    tutorialStepIndex += 1;
    renderTutorialStep();
}

function renderGrid() {
    const gridContainer = document.getElementById("grid-container");
    gridContainer.innerHTML = "";
    const board = document.createElement("section");
    board.className = "connected-board";
    board.appendChild(buildLBoard());
    gridContainer.appendChild(board);
}

function buildLBoard() {
    const categories = currentPuzzle.categories;
    const peopleDimension = getDimensions(currentPuzzle)[0];
    const [primaryCategory, secondaryCategory] = categories;
    const lBoard = document.createElement("div");

    lBoard.className = "l-board";

    if (!primaryCategory || !secondaryCategory) {
        const fallback = buildBoardBlock({
            rowDimension: peopleDimension,
            columnDimension: primaryCategory || peopleDimension,
            pairKey: getPairKey("people", primaryCategory ? primaryCategory.id : "people"),
            rowHeaderLabel: peopleDimension.label,
            columnHeaderLabel: primaryCategory ? primaryCategory.label : peopleDimension.label,
            showRowLabels: true
        });
        fallback.classList.add("l-board-primary");
        lBoard.appendChild(fallback);
        return lBoard;
    }

    const topLeft = buildBoardBlock({
        rowDimension: peopleDimension,
        columnDimension: primaryCategory,
        pairKey: getPairKey("people", primaryCategory.id),
        rowHeaderLabel: peopleDimension.label,
        columnHeaderLabel: primaryCategory.label,
        showRowLabels: true
    });
    topLeft.classList.add("l-board-primary");

    const topRight = buildBoardBlock({
        rowDimension: peopleDimension,
        columnDimension: secondaryCategory,
        pairKey: getPairKey("people", secondaryCategory.id),
        rowHeaderLabel: "",
        columnHeaderLabel: secondaryCategory.label,
        showRowLabels: false
    });
    topRight.classList.add("l-board-secondary");

    const bottomLeft = buildBoardBlock({
        rowDimension: secondaryCategory,
        columnDimension: primaryCategory,
        pairKey: getPairKey(secondaryCategory.id, primaryCategory.id),
        rowHeaderLabel: secondaryCategory.label,
        columnHeaderLabel: primaryCategory.label,
        showRowLabels: true
    });
    bottomLeft.classList.add("l-board-tertiary");

    lBoard.appendChild(topLeft);
    lBoard.appendChild(topRight);
    lBoard.appendChild(bottomLeft);

    return lBoard;
}

function buildBoardBlock({ rowDimension, columnDimension, pairKey, rowHeaderLabel, columnHeaderLabel, showRowLabels }) {
    const block = document.createElement("div");
    const rowLabelColumns = showRowLabels ? "var(--row-label-width) " : "";

    block.className = "board-block";
    block.style.gridTemplateColumns = `${rowLabelColumns}repeat(${columnDimension.items.length}, var(--cell-size))`;

    if (showRowLabels) {
        block.appendChild(makeCell("div", rowHeaderLabel, "board-corner"));
    }

    const groupHeader = document.createElement("div");
    groupHeader.className = "board-group-header";
    groupHeader.textContent = columnHeaderLabel;
    groupHeader.style.gridColumn = `span ${columnDimension.items.length}`;
    block.appendChild(groupHeader);

    if (showRowLabels) {
        block.appendChild(makeCell("div", "", "board-spacer"));
    }

    columnDimension.items.forEach((item) => {
        block.appendChild(makeCell("div", item, "board-item-header"));
    });

    rowDimension.items.forEach((rowItem) => {
        if (showRowLabels) {
            block.appendChild(makeCell("div", rowItem, "board-row-label"));
        }

        columnDimension.items.forEach((columnItem) => {
            const button = document.createElement("button");
            const value = state.marks[pairKey][rowItem][columnItem];
            button.type = "button";
            button.className = `mark-cell state-${value}`;
            button.dataset.pairKey = pairKey;
            button.dataset.row = rowItem;
            button.dataset.column = columnItem;
            button.disabled = isResolved();
            button.textContent = markSymbol(value);
            button.setAttribute("aria-label", `${rowItem}, ${columnItem}, ${value}`);
            button.addEventListener("click", handleMarkClick);
            block.appendChild(button);
        });
    });

    return block;
}

function renderScreenState() {
    const gameScreen = document.getElementById("game-screen");
    const briefingCard = document.getElementById("briefing-card");
    const playArea = document.getElementById("play-area");
    const resultScreen = document.getElementById("result-screen");
    const alreadyPlayedScreen = document.getElementById("already-played-screen");
    const savedToday = readStorage(STORAGE_KEYS.today, null);
    const isReturningFinishedRun = Boolean(savedToday && savedToday.date === getTodayDate() && isResolved());

    gameScreen.classList.toggle("hidden", isReturningFinishedRun);
    briefingCard.classList.toggle("hidden", state.phase !== "briefing" || isResolved());
    playArea.classList.toggle("hidden", state.phase === "briefing" && !isResolved());
    resultScreen.classList.add("hidden");
    alreadyPlayedScreen.classList.add("hidden");

    if (!isResolved()) {
        return;
    }

    if (savedToday && savedToday.date === getTodayDate() && savedToday.status !== "watching" && savedToday.viewedAfterResolve) {
        renderAlreadyPlayed();
        alreadyPlayedScreen.classList.remove("hidden");
        return;
    }

    renderResult();
    resultScreen.classList.remove("hidden");

    if (savedToday && savedToday.date === getTodayDate()) {
        savedToday.viewedAfterResolve = true;
        writeStorage(STORAGE_KEYS.today, savedToday);
    }
}

function renderResult() {
    const resultKicker = document.getElementById("result-kicker");
    const resultTitle = document.getElementById("result-title");
    const resultSummary = document.getElementById("result-summary");
    const resultNote = document.getElementById("result-note");

    if (state.status === "solved") {
        resultKicker.textContent = "Edition saved";
        resultTitle.textContent = "Your theory holds.";
        resultSummary.textContent = `You closed the case in ${formatDuration(state.elapsedSeconds)} and banked ${state.score} points before the desk could blow the story open.`;
        resultNote.textContent = "This is the verified solution.";
    } else {
        resultKicker.textContent = "The trail went cold";
        resultTitle.textContent = "Your case fell apart.";
        resultSummary.textContent = `After ${formatDuration(state.elapsedSeconds)}, the file still proved something else.`;
        resultNote.textContent = "This grid shows the verified solution. Red means your submitted match for that slot was different.";
    }

    document.getElementById("next-puzzle-countdown").textContent = nextPuzzleCountdownText();
    renderSolutionGrid("result-grid", state.diff);
}

function renderAlreadyPlayed() {
    const title = document.getElementById("already-played-title");
    const summary = document.getElementById("already-played-summary");
    const note = document.getElementById("already-played-note");

    if (state.status === "solved") {
        title.textContent = "You already filed today’s story.";
        summary.textContent = `Final score: ${state.score} points in ${formatDuration(state.elapsedSeconds)}.`;
        note.textContent = "This is the verified solution.";
    } else {
        title.textContent = "Today’s case is already closed.";
        summary.textContent = "The verified file stays open below until tomorrow’s reset.";
        note.textContent = "This grid shows the verified solution. Red means your submitted match for that slot was different.";
    }

    document.getElementById("already-played-countdown").textContent = nextPuzzleCountdownText();
    renderSolutionGrid("already-played-grid", state.diff);
}

function renderSolutionGrid(targetId, diff) {
    const container = document.getElementById(targetId);
    const grid = document.createElement("div");
    grid.className = "solution-grid";

    currentPuzzle.people.forEach((person) => {
        const row = document.createElement("div");
        row.className = "solution-row";
        row.appendChild(makeCell("div", person, "name-cell"));

        currentPuzzle.categories.forEach((category) => {
            const value = currentPuzzle.solution[person][category.id];
            const cell = makeCell("div", value, "solution-value");

            if (diff && diff[person] && typeof diff[person][category.id] === "boolean") {
                cell.classList.add(diff[person][category.id] ? "is-correct" : "is-wrong");
            }

            row.appendChild(cell);
        });

        grid.appendChild(row);
    });

    container.innerHTML = "";
    container.appendChild(grid);
}

function handleMarkClick(event) {
    if (isResolved()) {
        return;
    }

    const { pairKey, row, column } = event.currentTarget.dataset;
    const currentValue = state.marks[pairKey][row][column];
    const nextValue = nextMarkState(currentValue);

    if (nextValue === "tick") {
        clearTicksForRowAndColumn(pairKey, row, column);
        state.marks[pairKey][row][column] = "tick";
    } else {
        state.marks[pairKey][row][column] = nextValue;
    }

    state.grid = deriveGridFromMarks(state.marks, currentPuzzle);
    writeTodayState();

    if (isGridComplete(state.grid)) {
        commitAnswer();
        return;
    }

    renderGrid();
}

function commitAnswer() {
    if (isResolved()) {
        return;
    }

    const result = checkSolution(state.grid, currentPuzzle.solution);
    state.commitTime = Date.now();
    state.diff = result.diff;
    state.status = result.correct ? "solved" : "failed";
    state.score = result.correct ? scoreFromTime(state.elapsedSeconds) : 0;
    stopCaseTimer();

    updateStats(result.correct);
    writeTodayState(false);
    render();

    if (result.correct) {
        launchConfetti();
    }
}

function checkSolution(grid, solution) {
    const diff = {};
    let correct = true;

    Object.keys(solution).forEach((person) => {
        diff[person] = {};
        Object.keys(solution[person]).forEach((categoryId) => {
            const isMatch = grid[person][categoryId] === solution[person][categoryId];
            diff[person][categoryId] = isMatch;
            if (!isMatch) {
                correct = false;
            }
        });
    });

    return { correct, diff };
}

function scoreFromTime(elapsedSeconds) {
    if (elapsedSeconds <= 60) {
        return 100;
    }
    if (elapsedSeconds <= 90) {
        return 80;
    }
    if (elapsedSeconds <= 120) {
        return 60;
    }
    if (elapsedSeconds <= 180) {
        return 40;
    }
    return 20;
}

function isGridComplete(grid) {
    return currentPuzzle.people.every((person) => {
        return currentPuzzle.categories.every((category) => Boolean(grid[person][category.id]));
    });
}

function startCaseTimer() {
    stopCaseTimer();
    if (!shouldRunCaseTimer()) {
        return;
    }

    caseTimer = window.setInterval(() => {
        state.elapsedSeconds += 1;
        writeTodayState();
        renderHeader();
        renderClues();
    }, 1000);
}

function stopCaseTimer() {
    if (caseTimer) {
        window.clearInterval(caseTimer);
        caseTimer = null;
    }
}

function syncCaseTimer() {
    if (shouldRunCaseTimer()) {
        startCaseTimer();
        return;
    }

    stopCaseTimer();
}

function shouldRunCaseTimer() {
    const helpModal = document.getElementById("help-modal");
    return !isResolved()
        && state.phase === "investigating"
        && (!helpModal || helpModal.classList.contains("hidden"));
}

function startCase() {
    if (isResolved()) {
        return;
    }

    if (DEMO_REOPEN_TUTORIAL_ON_START) {
        pendingCaseStart = true;
        openTutorial();
        return;
    }

    state.phase = "investigating";
    writeTodayState();
    render();
    syncCaseTimer();
}

function replayPuzzle() {
    stopCaseTimer();
    pendingCaseStart = false;
    state = makeDefaultState(currentPuzzle);
    writeTodayState(false);
    closeModal("help-modal");
    closeModal("stats-modal");
    render();
    showToast("Today's case reset for replay.");
}

function updateStats(won) {
    const stats = readStorage(STORAGE_KEYS.stats, makeDefaultStats());
    const previousPlayed = stats.played;

    stats.played += 1;
    if (won) {
        stats.won += 1;
        stats.streak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
        const bucket = bucketForTime(state.elapsedSeconds);
        stats.scoreDistribution[bucket] += 1;
    } else {
        stats.streak = 0;
    }

    stats.avgClues = Number((((stats.avgClues * previousPlayed) + state.elapsedSeconds) / stats.played).toFixed(1));
    writeStorage(STORAGE_KEYS.stats, stats);
}

function renderStats() {
    const stats = readStorage(STORAGE_KEYS.stats, makeDefaultStats());
    const winRate = stats.played ? Math.round((stats.won / stats.played) * 100) : 0;

    document.getElementById("stats-summary").innerHTML = [
        makeStatCard("Played", stats.played),
        makeStatCard("Win rate", `${winRate}%`),
        makeStatCard("Current streak", stats.streak),
        makeStatCard("Best streak", stats.bestStreak),
        makeStatCard("Avg. time", `${stats.avgClues.toFixed(1)}s`),
        makeStatCard("Wins", stats.won)
    ].join("");

    const maxCount = Math.max(...Object.values(stats.scoreDistribution), 1);
    const distribution = SCORE_BUCKETS.map((bucket) => {
        const value = stats.scoreDistribution[bucket];
        const width = (value / maxCount) * 100;
        return `
            <div class="distribution-row">
                <span>${labelForBucket(bucket)}</span>
                <div class="distribution-track"><div class="distribution-fill" style="width: ${width}%"></div></div>
                <strong>${value}</strong>
            </div>
        `;
    }).join("");

    document.getElementById("stats-distribution").innerHTML = distribution;
}

function makeStatCard(label, value) {
    return `<article class="stat-card"><span>${label}</span><strong>${value}</strong></article>`;
}

function shareResult() {
    const text = buildShareText();

    if (navigator.share) {
        navigator.share({ text }).catch(() => {
            copyShareText(text);
        });
        return;
    }

    copyShareText(text);
}

function copyShareText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast("Share text copied.");
        }).catch(() => {
            showToast(text);
        });
        return;
    }

    showToast(text);
}

function buildShareText() {
    const bucketBar = state.status === "solved"
        ? shareBarForTime(state.elapsedSeconds)
        : "⬛⬛⬛⬛⬛";

    const scoreLine = state.status === "solved"
        ? `Solved in ${formatDuration(state.elapsedSeconds)} - ${state.score} pts`
        : `Case broke after ${formatDuration(state.elapsedSeconds)} - 0 pts`;

    return `🥨 Who Did What Now? #${currentPuzzle.id}\n\n${scoreLine}\n${bucketBar}\n\ninquirer.com/whodidwhatnow`;
}

function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
    if (!id) {
        return;
    }

    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add("hidden");
    }

    if (id === "help-modal") {
        writeStorage(STORAGE_KEYS.tutorialSeen, true);
        if (pendingCaseStart) {
            pendingCaseStart = false;
            state.phase = "investigating";
            writeTodayState();
            render();
        }
        syncCaseTimer();
    }
}

function launchConfetti() {
    const root = document.getElementById("confetti-root");
    const colors = ["#e81828", "#002d72", "#f4b400", "#2e7d32", "#ffffff"];

    root.innerHTML = "";
    root.classList.remove("hidden");

    for (let index = 0; index < 32; index += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = colors[index % colors.length];
        piece.style.animationDelay = `${Math.random() * 0.35}s`;
        piece.style.animationDuration = `${2.4 + Math.random() * 1.2}s`;
        piece.style.transform = `translateY(-18vh) rotate(${Math.random() * 360}deg)`;
        root.appendChild(piece);
    }

    if (confettiCleanupTimer) {
        window.clearTimeout(confettiCleanupTimer);
    }

    confettiCleanupTimer = window.setTimeout(() => {
        root.classList.add("hidden");
        root.innerHTML = "";
    }, 3600);
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");

    if (toastTimer) {
        window.clearTimeout(toastTimer);
    }

    toastTimer = window.setTimeout(() => {
        toast.classList.add("hidden");
    }, 2400);
}

function startCountdown() {
    updateCountdownLabels();
    countdownTimer = window.setInterval(updateCountdownLabels, 1000);
}

function updateCountdownLabels() {
    const text = nextPuzzleCountdownText();
    document.getElementById("next-puzzle-countdown").textContent = text;
    document.getElementById("already-played-countdown").textContent = text;
}

function nextPuzzleCountdownText() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `Next puzzle in ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function getTodaysPuzzle() {
    const today = getTodayDate();
    const exact = puzzles.find((puzzle) => puzzle.date === today);
    if (exact) {
        return exact;
    }

    const dayIndex = Math.abs(hashString(today)) % puzzles.length;
    return puzzles[dayIndex];
}

function loadTodayState(puzzle) {
    const today = getTodayDate();
    const saved = readStorage(STORAGE_KEYS.today, null);
    const puzzleVersion = puzzle.version || 1;

    if (saved && saved.date === today && saved.puzzleId === puzzle.id && (saved.puzzleVersion || 1) === puzzleVersion) {
        const marks = mergeMarks(saved.marks, puzzle, saved.grid);
        return {
            ...makeDefaultState(puzzle),
            ...saved,
            cluesSeen: puzzle.clues.length,
            currentClueIndex: puzzle.clues.length,
            elapsedSeconds: saved.elapsedSeconds || 0,
            grid: deriveGridFromMarks(marks, puzzle),
            marks,
            diff: saved.diff || null
        };
    }

    const fresh = makeDefaultState(puzzle);
    writeStorage(STORAGE_KEYS.today, { ...fresh, viewedAfterResolve: false });
    return fresh;
}

function writeTodayState(viewedAfterResolve = false) {
    writeStorage(STORAGE_KEYS.today, {
        ...state,
        date: getTodayDate(),
        puzzleId: currentPuzzle.id,
        puzzleVersion: currentPuzzle.version || 1,
        viewedAfterResolve
    });
}

function makeDefaultState(puzzle) {
    const marks = emptyMarks(puzzle);
    return {
        puzzleId: puzzle.id,
        puzzleVersion: puzzle.version || 1,
        date: getTodayDate(),
        status: "watching",
        phase: "briefing",
        cluesSeen: puzzle.clues.length,
        currentClueIndex: puzzle.clues.length,
        elapsedSeconds: 0,
        grid: deriveGridFromMarks(marks, puzzle),
        marks,
        commitTime: null,
        score: null,
        diff: null
    };
}

function emptyGrid(puzzle) {
    return puzzle.people.reduce((accumulator, person) => {
        accumulator[person] = {};
        puzzle.categories.forEach((category) => {
            accumulator[person][category.id] = null;
        });
        return accumulator;
    }, {});
}

function emptyMarks(puzzle) {
    return getBoardPairs(puzzle).reduce((pairAccumulator, [leftDimension, rightDimension]) => {
        const pairKey = getPairKey(leftDimension.id, rightDimension.id);
        pairAccumulator[pairKey] = leftDimension.items.reduce((rowAccumulator, rowItem) => {
            rowAccumulator[rowItem] = rightDimension.items.reduce((columnAccumulator, columnItem) => {
                columnAccumulator[columnItem] = "empty";
                return columnAccumulator;
            }, {});
            return rowAccumulator;
        }, {});
        return pairAccumulator;
    }, {});
}

function mergeMarks(savedMarks, puzzle, savedGrid) {
    const baseMarks = emptyMarks(puzzle);
    const validStates = ["empty", "cross", "tick"];
    const pairKeys = getBoardPairs(puzzle).map(([leftDimension, rightDimension]) => {
        return getPairKey(leftDimension.id, rightDimension.id);
    });

    if (savedMarks && pairKeys.some((pairKey) => savedMarks[pairKey])) {
        getBoardPairs(puzzle).forEach(([leftDimension, rightDimension]) => {
            const pairKey = getPairKey(leftDimension.id, rightDimension.id);
            leftDimension.items.forEach((rowItem) => {
                rightDimension.items.forEach((columnItem) => {
                    const value = savedMarks[pairKey] && savedMarks[pairKey][rowItem]
                        ? savedMarks[pairKey][rowItem][columnItem]
                        : "empty";
                    baseMarks[pairKey][rowItem][columnItem] = validStates.includes(value) ? value : "empty";
                });
            });
        });

        return baseMarks;
    }

    if (!savedGrid) {
        return baseMarks;
    }

    puzzle.categories.forEach((category) => {
        puzzle.people.forEach((person) => {
            const selected = savedGrid[person] ? savedGrid[person][category.id] : null;
            if (selected) {
                const pairKey = getPairKey("people", category.id);
                baseMarks[pairKey][person][selected] = "tick";
            }
        });
    });

    return baseMarks;
}

function makeDefaultStats() {
    return {
        played: 0,
        won: 0,
        streak: 0,
        bestStreak: 0,
        avgClues: 0,
        scoreDistribution: {
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7+": 0
        }
    };
}

function nextMarkState(currentValue) {
    if (currentValue === "empty") {
        return "cross";
    }
    if (currentValue === "cross") {
        return "tick";
    }
    return "empty";
}

function markSymbol(value) {
    if (value === "cross") {
        return "X";
    }
    if (value === "tick") {
        return "✓";
    }
    return "";
}

function clearTicksForRowAndColumn(pairKey, row, column) {
    Object.keys(state.marks[pairKey][row]).forEach((candidateColumn) => {
        if (state.marks[pairKey][row][candidateColumn] === "tick") {
            state.marks[pairKey][row][candidateColumn] = "empty";
        }
    });

    Object.keys(state.marks[pairKey]).forEach((candidateRow) => {
        if (state.marks[pairKey][candidateRow][column] === "tick") {
            state.marks[pairKey][candidateRow][column] = "empty";
        }
    });
}

function deriveGridFromMarks(marks, puzzle) {
    const grid = emptyGrid(puzzle);

    puzzle.categories.forEach((category) => {
        const pairKey = getPairKey("people", category.id);
        puzzle.people.forEach((person) => {
            const selectedItem = category.items.find((item) => marks[pairKey][person][item] === "tick") || null;
            grid[person][category.id] = selectedItem;
        });
    });

    return grid;
}

function getBoardPairs(puzzle = currentPuzzle) {
    const dimensions = getDimensions(puzzle);
    const peopleDimension = dimensions[0];
    const categories = dimensions.slice(1);
    const pairs = categories.map((categoryDimension) => [peopleDimension, categoryDimension]);

    if (categories.length >= 2) {
        pairs.push([categories[1], categories[0]]);
    }

    return pairs;
}

function getDimensions(puzzle = currentPuzzle) {
    return [
        {
            id: "people",
            label: "People",
            items: puzzle.people
        },
        ...puzzle.categories
    ];
}

function getPairKey(leftId, rightId) {
    return `${leftId}__${rightId}`;
}

function bucketForTime(elapsedSeconds) {
    if (elapsedSeconds <= 60) {
        return "3";
    }
    if (elapsedSeconds <= 90) {
        return "4";
    }
    if (elapsedSeconds <= 120) {
        return "5";
    }
    if (elapsedSeconds <= 180) {
        return "6";
    }
    return "7+";
}

function labelForBucket(bucket) {
    if (bucket === "3") {
        return "<= 60s";
    }
    if (bucket === "4") {
        return "<= 90s";
    }
    if (bucket === "5") {
        return "<= 120s";
    }
    if (bucket === "6") {
        return "<= 180s";
    }
    return "> 180s";
}

function shareBarForTime(elapsedSeconds) {
    if (elapsedSeconds <= 60) {
        return "🟩🟩🟩🟩🟩";
    }
    if (elapsedSeconds <= 90) {
        return "🟩🟩🟩🟩⬜";
    }
    if (elapsedSeconds <= 120) {
        return "🟩🟩🟩⬜⬜";
    }
    if (elapsedSeconds <= 180) {
        return "🟩🟩⬜⬜⬜";
    }
    return "🟩⬜⬜⬜⬜";
}

function isResolved() {
    return state.status === "solved" || state.status === "failed";
}

function makeCell(tagName, text, className) {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
}

function readStorage(key, fallback) {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        return;
    }
}

function getTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    return `${year}-${month}-${day}`;
}

function formatPuzzleDate(dateString) {
    return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
    });
}

function pad(value) {
    return String(value).padStart(2, "0");
}

function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${pad(minutes)}:${pad(seconds)}`;
}

function hashString(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = ((hash << 5) - hash) + value.charCodeAt(index);
        hash |= 0;
    }
    return hash;
}
