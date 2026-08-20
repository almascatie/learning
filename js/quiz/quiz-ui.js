export function renderQuizContainer(state, callbacks) {
    const app = document.getElementById("app");

    if (!app) {
        console.error("Element #app tidak ditemukan.");
        return;
    }

    document.querySelectorAll(".view").forEach(view => {
        view.classList.add("hidden");
        view.classList.remove("active");
    });

    const oldQuizView = document.getElementById("view-quiz");

    if (oldQuizView) {
        oldQuizView.remove();
    }

    const quizView = document.createElement("section");

    quizView.id = "view-quiz";
    quizView.className = "view active";

    quizView.innerHTML = `
        <div class="quiz-container" style="max-width:600px;margin:0 auto;padding:24px 16px;">
            <header class="quiz-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <button id="btn-quit-quiz" class="back-button" type="button">
                    ← Keluar
                </button>

                <div class="quiz-progress-info">
                    <span id="quiz-counter" style="font-weight:700;color:var(--muted);"></span>
                </div>
            </header>

            <div class="progress-bar-container" style="background:var(--border);height:10px;border-radius:5px;overflow:hidden;margin-bottom:24px;">
                <div id="quiz-progress-fill" style="background:var(--blue);width:0%;height:100%;transition:width .3s ease;"></div>
            </div>

            <div id="quiz-content"></div>
        </div>
    `;

    app.appendChild(quizView);

    const quitButton = document.getElementById("btn-quit-quiz");

    if (quitButton) {
        quitButton.addEventListener(
            "click",
            callbacks.onQuit
        );
    }

    renderQuestion(state, callbacks);
}

export function renderQuestion(state, callbacks) {
    const questionObj =
        state.questions[state.currentIndex];

    if (!questionObj) {
        return;
    }

    const total =
        state.questions.length;

    const number =
        state.currentIndex + 1;

    const percent =
        (number / total) * 100;

    const content =
        document.getElementById("quiz-content");

    const counter =
        document.getElementById("quiz-counter");

    const progressFill =
        document.getElementById("quiz-progress-fill");

    if (!content || !counter || !progressFill) {
        console.error(
            "Elemen UI kuis tidak ditemukan."
        );
        return;
    }

    counter.textContent =
        `Soal ${number} / ${total}`;

    progressFill.style.width =
        `${percent}%`;

    /*
     * Mendukung tiga jenis visual:
     *
     * image  -> gambar/file
     * icon   -> emoji/icon lama
     * visual -> field visual pada soal
     */
    const imageSource =
        questionObj.image ||
        questionObj.icon ||
        questionObj.visual ||
        "";

    const isImage =
        !!questionObj.image;

    content.innerHTML = `
        <div
            class="quiz-card"
            style="
                background:var(--surface);
                border:3px solid var(--border);
                border-radius:24px;
                padding:24px;
                box-shadow:var(--shadow-soft);
            "
        >

            ${
                imageSource
                    ? `
                        <div
                            style="
                                text-align:center;
                                margin-bottom:18px;
                            "
                        >
                            ${
                                isImage
                                    ? `
                                        <img
                                            src="${escapeAttribute(imageSource)}"
                                            alt=""
                                            style="
                                                max-width:180px;
                                                max-height:140px;
                                                object-fit:contain;
                                            "
                                        >
                                    `
                                    : `
                                        <div
                                            style="
                                                font-size:72px;
                                                line-height:1;
                                            "
                                        >
                                            ${escapeHtml(imageSource)}
                                        </div>
                                    `
                            }
                        </div>
                    `
                    : ""
            }

            <h2
                style="
                    font-size:20px;
                    text-align:center;
                    margin:0 0 20px;
                "
            >
                ${escapeHtml(
                    questionObj.question || ""
                )}
            </h2>

            <div id="quiz-options">
                ${renderOptions(questionObj)}
            </div>

            <div
                id="quiz-feedback"
                class="hidden"
            ></div>

            <button
                id="btn-next-question"
                class="primary-button hidden"
                type="button"
                style="
                    width:100%;
                    margin-top:16px;
                "
            >
                ${
                    number === total
                        ? "Selesai"
                        : "Soal Berikutnya →"
                }
            </button>

        </div>
    `;

    document
        .querySelectorAll(
            "#quiz-options .option-card"
        )
        .forEach((button, index) => {

            button.addEventListener(
                "click",
                () => {

                    callbacks.onAnswer(
                        index,
                        questionObj.options[index],
                        questionObj
                    );

                }
            );

        });

    const nextButton =
        document.getElementById(
            "btn-next-question"
        );

    if (nextButton) {
        nextButton.addEventListener(
            "click",
            callbacks.onNext
        );
    }
}

function renderOptions(questionObj) {
    const labels = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F"
    ];

    return (questionObj.options || [])
        .map((option, index) => `
            <button
                class="option-card"
                type="button"
                data-option-index="${index}"
                style="
                    width:100%;
                    display:flex;
                    align-items:center;
                    gap:12px;
                    text-align:left;
                    background:var(--surface);
                    border:2px solid var(--border);
                    border-radius:16px;
                    padding:14px;
                    margin-top:12px;
                    font-size:16px;
                    font-weight:600;
                    cursor:pointer;
                "
            >

                <span
                    style="
                        width:34px;
                        height:34px;
                        min-width:34px;
                        border-radius:50%;
                        background:var(--border);
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-weight:700;
                    "
                >
                    ${labels[index] || index + 1}
                </span>

                <span>
                    ${escapeHtml(
                        option.text || ""
                    )}
                </span>

            </button>
        `)
        .join("");
}

export function showAnswerFeedback(
    questionObj,
    optionIndex,
    isCorrect
) {
    const buttons =
        document.querySelectorAll(
            "#quiz-options .option-card"
        );

    buttons.forEach(
        (button, index) => {

            button.disabled = true;

            if (
                questionObj.options[index].correct
            ) {

                button.style.background =
                    "#DCFCE7";

                button.style.borderColor =
                    "#22C55E";

                button.style.color =
                    "#166534";

            } else if (
                index === optionIndex &&
                !isCorrect
            ) {

                button.style.background =
                    "#FEE2E2";

                button.style.borderColor =
                    "#EF4444";

                button.style.color =
                    "#991B1B";
            }

        }
    );

    const feedback =
        document.getElementById(
            "quiz-feedback"
        );

    if (!feedback) {
        return;
    }

    feedback.className =
        `message ${
            isCorrect
                ? "success"
                : "error"
        }`;

    feedback.style.cssText = `
        margin-top:16px;
        padding:16px;
        border-radius:16px;
        background:${
            isCorrect
                ? "#F0FDF4"
                : "#FEF2F2"
        };
        color:${
            isCorrect
                ? "#166534"
                : "#B91C1C"
        };
        border:2px solid ${
            isCorrect
                ? "#86EFAC"
                : "#FCA5A5"
        };
    `;

    feedback.innerHTML = `
        <strong
            style="
                font-size:16px;
                display:block;
                margin-bottom:4px;
            "
        >
            ${
                isCorrect
                    ? "🎉 Benar!"
                    : "💡 Belum tepat."
            }
        </strong>

        <span>
            ${escapeHtml(
                questionObj.explanation ||
                "Tetap semangat mencoba ya!"
            )}
        </span>
    `;

    feedback.classList.remove(
        "hidden"
    );

    const nextButton =
        document.getElementById(
            "btn-next-question"
        );

    if (nextButton) {
        nextButton.classList.remove(
            "hidden"
        );
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}

function escapeAttribute(value) {
    return String(value)
        .replaceAll(
            '"',
            "&quot;"
        );
}
