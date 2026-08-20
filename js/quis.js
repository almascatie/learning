import { supabase } from "./supabase.js";
import { db } from "./storage.js";
import { initQuiz } from "./quis.js";
let quizState = {
    attemptId: null,
    packageId: null,
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    isAnswered: false
};


/* ================================
   GET ACTIVE SESSION TOKEN
================================ */

async function getActiveSessionToken() {

    try {

        const sessions =
            await db.sessions.toArray();

        const now = Date.now();

        const active =
            sessions.find(
                (session) =>
                    new Date(
                        session.expires_at
                    ).getTime() > now
            );

        return active
            ? active.session_token
            : null;

    } catch (err) {

        console.error(
            "Gagal mengambil sesi lokal:",
            err
        );

        return null;
    }
}


/* ================================
   OPEN QUIZ PACKAGE LIST
================================ */

export async function openQuizPackages(grade) {

    const packageList =
        document.getElementById("package-list");

    if (!packageList) {

        console.error(
            "Element #package-list tidak ditemukan."
        );

        return;
    }

    const studentGrade =
        Number(grade);


    showView("view-quiz-packages");


    packageList.innerHTML = `
        <div class="loading">
            Memuat paket kuis...
        </div>
    `;


    try {

        const packages =
            quizManifest.filter(
                (item) =>
                    Number(item.grade) === studentGrade
            );


        if (!packages.length) {

            packageList.innerHTML = `
                <div class="loading">
                    Belum ada paket kuis untuk kelas ${studentGrade}.
                </div>
            `;

            return;
        }


        renderQuizPackages(packages);

    } catch (err) {

        console.error(
            "Gagal memuat manifest kuis:",
            err
        );

        packageList.innerHTML = `
            <div class="message error">
                Paket kuis tidak dapat dimuat.
            </div>
        `;
    }
}


/* ================================
   RENDER QUIZ PACKAGES
================================ */

function renderQuizPackages(packages) {

    const packageList =
        document.getElementById("package-list");

    packageList.innerHTML = "";


    packages.forEach((quizPackage) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "activity-card quiz";


        button.innerHTML = `
            <span
                class="activity-icon"
            >
                🎯
            </span>

            <span
                class="activity-content"
            >
                <strong>
                    ${escapeHtml(
                        quizPackage.title ||
                        quizPackage.id
                    )}
                </strong>

                <small>
                    ${escapeHtml(
                        quizPackage.subject ||
                        "Kuis"
                    )}
                </small>
            </span>
        `;


        button.addEventListener(
            "click",
            () => {
                loadQuizPackage(
                    quizPackage
                );
            }
        );


        packageList.appendChild(button);

    });
}


/* ================================
   LOAD QUIZ PACKAGE FILE
================================ */

async function loadQuizPackage(
    quizPackage
) {

    try {

        const manifestUrl =
            new URL(
                "../soal/manifest.js",
                import.meta.url
            );


        const packageUrl =
            new URL(
                quizPackage.file,
                manifestUrl
            );


        const module =
            await import(
                packageUrl.href
            );


        const packageData =
            module.default;


        if (!packageData) {

            throw new Error(
                "File paket tidak memiliki export default."
            );
        }


        if (
            !Array.isArray(
                packageData.questions
            )
        ) {

            throw new Error(
                "Paket tidak memiliki array questions."
            );
        }


        await startQuiz(
            quizPackage.id,
            packageData.questions
        );

    } catch (err) {

        console.error(
            "Gagal memuat paket kuis:",
            quizPackage,
            err
        );

        alert(
            "Paket kuis tidak dapat dibuka."
        );
    }
}


/* ================================
   START QUIZ
================================ */

export async function startQuiz(
    packageId,
    questionsArray
) {

    if (
        !questionsArray ||
        questionsArray.length === 0
    ) {

        alert(
            "Paket soal kosong atau belum tersedia."
        );

        return;
    }


    const sessionToken =
        await getActiveSessionToken();


    if (!sessionToken) {

        alert(
            "Sesi habis, silakan login ulang."
        );

        window.location.reload();

        return;
    }


    quizState.packageId =
        packageId;

    quizState.questions =
        questionsArray;

    quizState.currentIndex =
        0;

    quizState.correctCount =
        0;

    quizState.wrongCount =
        0;

    quizState.isAnswered =
        false;


    try {

        const {
            data: attemptId,
            error
        } =
            await supabase.rpc(
                "start_student_attempt",
                {
                    p_session_token:
                        sessionToken,

                    p_package_id:
                        packageId,

                    p_total_questions:
                        questionsArray.length
                }
            );


        if (error) {
            throw error;
        }


        quizState.attemptId =
            attemptId;


        renderQuizContainer();

        renderQuestion();

    } catch (err) {

        console.error(
            "Gagal memulai kuis:",
            err
        );

        alert(
            "Terjadi kesalahan saat menyiapkan kuis."
        );
    }
}


/* ================================
   RENDER QUIZ CONTAINER
================================ */

function renderQuizContainer() {

    const app =
        document.getElementById("app");


    app.innerHTML = `
        <section
            id="view-quiz"
            class="view active"
        >

            <div
                class="quiz-container"
                style="
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 24px 16px;
                "
            >

                <header
                    class="quiz-header"
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 16px;
                    "
                >

                    <button
                        id="btn-quit-quiz"
                        class="back-button"
                        type="button"
                    >
                        ← Keluar
                    </button>

                    <div
                        class="quiz-progress-info"
                    >
                        <span
                            id="quiz-counter"
                            style="
                                font-weight: 700;
                                color: var(--muted);
                            "
                        >
                            Soal 1 /
                            ${quizState.questions.length}
                        </span>
                    </div>

                </header>


                <div
                    class="progress-bar-container"
                    style="
                        background: var(--border);
                        height: 10px;
                        border-radius: 5px;
                        overflow: hidden;
                        margin-bottom: 24px;
                    "
                >

                    <div
                        id="quiz-progress-fill"
                        style="
                            background: var(--blue);
                            width: 0%;
                            height: 100%;
                            transition:
                                width 0.3s ease;
                        "
                    ></div>

                </div>


                <div
                    class="quiz-card"
                    style="
                        background: var(--surface);
                        border: 3px solid var(--border);
                        border-radius: 24px;
                        padding: 24px;
                        box-shadow:
                            var(--shadow-soft);
                        margin-bottom: 20px;
                    "
                >

                    <div
                        id="quiz-visual"
                        style="
                            font-size: 48px;
                            text-align: center;
                            margin-bottom: 12px;
                        "
                        class="hidden"
                    ></div>


                    <h3
                        id="quiz-question-text"
                        style="
                            font-size: 20px;
                            margin-top: 0;
                            margin-bottom: 20px;
                            text-align: center;
                        "
                    >
                        Pertanyaan...
                    </h3>


                    <div
                        id="quiz-options"
                        class="quiz-options"
                        style="
                            display: flex;
                            flex-direction: column;
                            gap: 12px;
                        "
                    ></div>

                </div>


                <div
                    id="quiz-feedback"
                    class="message hidden"
                    style="margin-bottom: 20px;"
                ></div>


                <button
                    id="btn-next-question"
                    class="primary-button hidden"
                    type="button"
                >
                    Lanjut Soal Berikutnya →
                </button>

            </div>

        </section>
    `;


    document
        .getElementById("btn-quit-quiz")
        .addEventListener(
            "click",
            () => {

                if (
                    confirm(
                        "Keluar dari kuis? Progress saat ini akan dihentikan."
                    )
                ) {

                    window.location.reload();
                }
            }
        );


    document
        .getElementById(
            "btn-next-question"
        )
        .addEventListener(
            "click",
            handleNextQuestion
        );
}


/* ================================
   RENDER CURRENT QUESTION
================================ */

function renderQuestion() {

    const q =
        quizState.questions[
            quizState.currentIndex
        ];


    if (!q) {

        console.error(
            "Soal tidak ditemukan:",
            quizState.currentIndex
        );

        return;
    }


    quizState.isAnswered =
        false;


    document
        .getElementById(
            "quiz-counter"
        )
        .textContent =
        `Soal ${
            quizState.currentIndex + 1
        } / ${
            quizState.questions.length
        }`;


    const progressPct =
        (
            quizState.currentIndex /
            quizState.questions.length
        ) * 100;


    document
        .getElementById(
            "quiz-progress-fill"
        )
        .style.width =
        `${progressPct}%`;


    /*
     * PERBAIKAN:
     * sebelumnya menggunakan
     * quiz-question-textlectricité
     */
    document
        .getElementById(
            "quiz-question-text"
        )
        .textContent =
        q.question;


    const visualEl =
        document.getElementById(
            "quiz-visual"
        );


    if (q.visual) {

        visualEl.textContent =
            q.visual;

        visualEl.classList.remove(
            "hidden"
        );

    } else {

        visualEl.classList.add(
            "hidden"
        );
    }


    const optionsEl =
        document.getElementById(
            "quiz-options"
        );


    optionsEl.innerHTML = "";


    if (
        !Array.isArray(q.options) ||
        q.options.length === 0
    ) {

        optionsEl.innerHTML = `
            <div class="message error">
                Pilihan jawaban tidak tersedia.
            </div>
        `;

        return;
    }


    q.options.forEach(
        (opt, idx) => {

            const btn =
                document.createElement(
                    "button"
                );


            btn.type =
                "button";

            btn.className =
                "option-card";


            btn.style.cssText = `
                background: #F8FAFC;
                border: 2px solid var(--border);
                border-radius: 16px;
                padding: 16px;
                text-align: left;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            `;


            btn.textContent =
                opt.text;


            btn.addEventListener(
                "click",
                () =>
                    handleAnswer(
                        idx,
                        opt,
                        q
                    )
            );


            optionsEl.appendChild(
                btn
            );

        }
    );


    document
        .getElementById(
            "quiz-feedback"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "btn-next-question"
        )
        .classList.add(
            "hidden"
        );
}


/* ================================
   HANDLE ANSWER
================================ */

async function handleAnswer(
    optionIndex,
    selectedOpt,
    questionObj
) {

    if (
        quizState.isAnswered
    ) {
        return;
    }


    quizState.isAnswered =
        true;


    const sessionToken =
        await getActiveSessionToken();


    if (!sessionToken) {

        alert(
            "Sesi habis, silakan login ulang."
        );

        window.location.reload();

        return;
    }


    const isCorrect =
        selectedOpt.correct;


    const pointsEarned =
        isCorrect
            ? (
                questionObj.points ||
                10
            )
            : 0;


    if (isCorrect) {

        quizState.correctCount++;

    } else {

        quizState.wrongCount++;
    }


    const optionButtons =
        document.querySelectorAll(
            ".option-card"
        );


    optionButtons.forEach(
        (btn, idx) => {

            btn.disabled =
                true;


            if (
                questionObj
                    .options[idx]
                    .correct
            ) {

                btn.style.background =
                    "#DCFCE7";

                btn.style.borderColor =
                    "#22C55E";

                btn.style.color =
                    "#166534";

            } else if (
                idx === optionIndex &&
                !isCorrect
            ) {

                btn.style.background =
                    "#FEE2E2";

                btn.style.borderColor =
                    "#EF4444";

                btn.style.color =
                    "#991B1B";
            }
        }
    );


    const feedbackEl =
        document.getElementById(
            "quiz-feedback"
        );


    feedbackEl.className =
        `message ${
            isCorrect
                ? "success"
                : "error"
        }`;


    feedbackEl.style.cssText =
        `
            margin-top: 16px;
            padding: 16px;
            border-radius: 16px;
            background:
                ${
                    isCorrect
                        ? "#F0FDF4"
                        : "#FEF2F2"
                };
            color:
                ${
                    isCorrect
                        ? "#166534"
                        : "#B91C1C"
                };
            border:
                2px solid
                ${
                    isCorrect
                        ? "#86EFAC"
                        : "#FCA5A5"
                };
        `;


    feedbackEl.innerHTML = `
        <strong
            style="
                font-size: 16px;
                display: block;
                margin-bottom: 4px;
            "
        >
            ${
                isCorrect
                    ? "🎉 Benar!"
                    : "💡 Belum tepat."
            }
        </strong>

        <span>
            ${
                questionObj.explanation ||
                "Tetap semangat mencoba ya!"
            }
        </span>
    `;


    feedbackEl.classList.remove(
        "hidden"
    );


    document
        .getElementById(
            "btn-next-question"
        )
        .classList.remove(
            "hidden"
        );


    try {

        const {
            error
        } =
            await supabase.rpc(
                "save_student_answer",
                {
                    p_session_token:
                        sessionToken,

                    p_attempt_id:
                        quizState.attemptId,

                    p_question_id:
                        questionObj.id,

                    p_question_version:
                        questionObj.version ||
                        1,

                    p_selected_answer: {
                        selected_index:
                            optionIndex,

                        text:
                            selectedOpt.text
                    },

                    p_is_correct:
                        isCorrect,

                    p_points:
                        pointsEarned
                }
            );


        if (error) {
            throw error;
        }

    } catch (err) {

        console.error(
            "Gagal menyimpan jawaban ke database:",
            err
        );
    }
}


/* ================================
   NEXT QUESTION
================================ */

function handleNextQuestion() {

    quizState.currentIndex++;


    if (
        quizState.currentIndex <
        quizState.questions.length
    ) {

        renderQuestion();

    } else {

        finishQuiz();
    }
}


/* ================================
   FINISH QUIZ
================================ */

async function finishQuiz() {

    const sessionToken =
        await getActiveSessionToken();


    if (!sessionToken) {

        alert(
            "Sesi habis, silakan login ulang."
        );

        window.location.reload();

        return;
    }


    try {

        const {
            data,
            error
        } =
            await supabase.rpc(
                "complete_student_attempt",
                {
                    p_session_token:
                        sessionToken,

                    p_attempt_id:
                        quizState.attemptId
                }
            );


        if (error) {
            throw error;
        }


        const resultData =
            Array.isArray(data)
                ? data[0]
                : data;


        renderResultScreen(
            resultData || {}
        );

    } catch (err) {

        console.error(
            "Gagal menyelesaikan attempt:",
            err
        );

        alert(
            "Gagal menyimpan hasil akhir kuis ke server."
        );
    }
}


/* ================================
   RESULT SCREEN
================================ */

function renderResultScreen(
    resultData
) {

    const app =
        document.getElementById(
            "app"
        );


    const finalScore =
        resultData.score || 0;


    const correct =
        resultData.correct_count ??
        quizState.correctCount;


    const wrong =
        resultData.wrong_count ??
        quizState.wrongCount;


    app.innerHTML = `
        <section
            id="view-result"
            class="view active"
        >

            <div
                class="result-container"
                style="
                    max-width: 480px;
                    margin: 40px auto;
                    padding: 20px;
                    text-align: center;
                "
            >

                <div
                    class="result-card"
                    style="
                        background: var(--surface);
                        border: 3px solid var(--border);
                        border-radius: 28px;
                        padding: 40px 24px;
                        box-shadow:
                            var(--shadow-soft);
                    "
                >

                    <div
                        style="
                            font-size: 64px;
                            margin-bottom: 12px;
                        "
                    >
                        🏆
                    </div>


                    <h2
                        style="
                            font-size: 26px;
                            margin: 0 0 24px;
                        "
                    >
                        Hore, Kuis Selesai!
                    </h2>


                    <div
                        style="
                            background: #EFF6FF;
                            border:
                                2px dashed #93C5FD;
                            border-radius: 20px;
                            padding: 20px;
                            margin-bottom: 24px;
                        "
                    >

                        <span
                            style="
                                font-size: 14px;
                                font-weight: 700;
                                color: var(--muted);
                                display: block;
                                margin-bottom: 4px;
                            "
                        >
                            SKOR AKHIR
                        </span>


                        <h1
                            style="
                                font-size: 48px;
                                color: var(--blue);
                                margin: 0;
                                font-family:
                                    'Fredoka',
                                    cursive;
                            "
                        >
                            ${finalScore}
                        </h1>

                    </div>


                    <div
                        style="
                            display: grid;
                            grid-template-columns:
                                1fr 1fr;
                            gap: 12px;
                            margin-bottom: 32px;
                        "
                    >

                        <div
                            style="
                                background: #F0FDF4;
                                border:
                                    2px solid #86EFAC;
                                border-radius: 16px;
                                padding: 12px;
                                text-align: center;
                            "
                        >

                            <strong
                                style="
                                    color: #166534;
                                    font-size: 18px;
                                    display: block;
                                "
                            >
                                ✅ ${correct}
                            </strong>

                            <span
                                style="
                                    font-size: 13px;
                                    color: #15803D;
                                    font-weight: 600;
                                "
                            >
                                Benar
                            </span>

                        </div>


                        <div
                            style="
                                background: #FEF2F2;
                                border:
                                    2px solid #FCA5A5;
                                border-radius: 16px;
                                padding: 12px;
                                text-align: center;
                            "
                        >

                            <strong
                                style="
                                    color: #991B1B;
                                    font-size: 18px;
                                    display: block;
                                "
                            >
                                ❌ ${wrong}
                            </strong>

                            <span
                                style="
                                    font-size: 13px;
                                    color: #B91C1C;
                                    font-weight: 600;
                                "
                            >
                                Salah
                            </span>

                        </div>

                    </div>


                    <button
                        id="btn-back-home"
                        class="primary-button"
                        type="button"
                    >
                        🏠 Kembali ke Beranda
                    </button>

                </div>

            </div>

        </section>
    `;


    document
        .getElementById(
            "btn-back-home"
        )
        .addEventListener(
            "click",
            () => {
                window.location.reload();
            }
        );
}


/* ================================
   VIEW
================================ */

function showView(id) {

    document
        .querySelectorAll(".view")
        .forEach(
            (view) => {

                view.classList.add(
                    "hidden"
                );

                view.classList.remove(
                    "active"
                );
            }
        );


    const target =
        document.getElementById(id);


    if (!target) {
        return;
    }


    target.classList.remove(
        "hidden"
    );

    target.classList.add(
        "active"
    );
}


/* ================================
   ESCAPE HTML
================================ */

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
