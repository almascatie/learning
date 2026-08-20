import { quizManifest } from "../../soal/manifest.js";
import {
    saveQuizProgress,
    getQuizProgress,
    clearQuizProgress
} from "./quiz-progress.js";
import {
    getActiveSession,
    getActiveSessionToken,
    saveStudentAnswer,
    completeStudentAttempt,
    startStudentAttempt
} from "./quiz-sync.js";
import {
    renderQuizContainer,
    renderQuestion,
    showAnswerFeedback
} from "./quiz-ui.js";
import { renderQuizResult } from "./quiz-result.js";

const quizState = {
    attemptId: null,
    packageId: null,
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    isAnswered: false
};

export async function openQuizPackages(grade) {
    const studentGrade = Number(grade);

    /*
     * renderQuizContainer() dan renderQuizResult()
     * mengganti isi #app.
     * Karena itu view-quiz-packages dari HTML awal
     * mungkin sudah tidak ada.
     */
    let packageView = document.getElementById("view-quiz-packages");

    if (!packageView) {
        const app = document.getElementById("app");

        app.innerHTML = `
            <section id="view-quiz-packages" class="view active">
                <div class="student-home-container">
                    <header class="home-header">
                        <button
                            id="btn-back-home"
                            class="back-button"
                            type="button"
                        >
                            ← Kembali ke Beranda
                        </button>

                        <h2 style="margin-top:12px;">
                            Pilih Paket Kuis 🎯
                        </h2>

                        <p style="color:var(--muted);margin:0;">
                            Pilih salah satu paket untuk mulai mengerjakan soal.
                        </p>
                    </header>

                    <div
                        id="package-list"
                        class="activity-menu"
                        style="margin-top:20px;"
                    >
                        <div class="loading">
                            Memuat paket soal...
                        </div>
                    </div>
                </div>
            </section>
        `;

        packageView = document.getElementById("view-quiz-packages");
    }

    showView("view-quiz-packages");

    const packageList = document.getElementById("package-list");

    if (!packageList) {
        console.error("Element #package-list tidak ditemukan.");
        return;
    }

    const packages = quizManifest.filter(
        item => Number(item.grade) === studentGrade
    );

    if (!packages.length) {
        packageList.innerHTML = `
            <div class="loading">
                Belum ada paket kuis untuk Kelas ${studentGrade}.
            </div>
        `;
        return;
    }

    renderQuizPackages(packages);

    const backButton = document.getElementById("btn-back-home");

    if (backButton) {
        backButton.onclick = () => {
            showView("view-home");
        };
    }
}

function renderQuizPackages(packages) {
    const packageList = document.getElementById("package-list");

    if (!packageList) {
        console.error("Element #package-list tidak ditemukan.");
        return;
    }

    packageList.innerHTML = "";

    packages.forEach(quizPackage => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "activity-card quiz";

        button.innerHTML = `
            <span class="activity-icon">🎯</span>

            <span class="activity-content">
                <strong>
                    ${escapeHtml(
                        quizPackage.title || quizPackage.id
                    )}
                </strong>

                <small>
                    ${escapeHtml(
                        quizPackage.subject || "Kuis"
                    )}
                </small>
            </span>
        `;

        button.addEventListener(
            "click",
            () => loadQuizPackage(quizPackage)
        );

        packageList.appendChild(button);
    });
}

async function loadQuizPackage(quizPackage) {
    try {
        const manifestUrl = new URL(
            "../../soal/manifest.js",
            import.meta.url
        );

        const packageUrl = new URL(
            quizPackage.file,
            manifestUrl
        );

        const module = await import(packageUrl.href);

        const packageData = module.default;

        if (!packageData) {
            throw new Error(
                "File paket tidak memiliki export default."
            );
        }

        if (!Array.isArray(packageData.questions)) {
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

        alert("Paket kuis tidak dapat dibuka.");
    }
}

export async function startQuiz(
    packageId,
    questionsArray
) {
    if (!questionsArray?.length) {
        alert(
            "Paket soal kosong atau belum tersedia."
        );
        return;
    }

    const session = await getActiveSession();

    const sessionToken =
        session?.session_token;

    if (!sessionToken) {
        alert(
            "Sesi habis, silakan login ulang."
        );

        window.location.reload();
        return;
    }

    quizState.packageId = packageId;
    quizState.questions = questionsArray;
    quizState.currentIndex = 0;
    quizState.correctCount = 0;
    quizState.wrongCount = 0;
    quizState.isAnswered = false;

    try {
        const progress = await getQuizProgress(
            session,
            packageId,
            questionsArray.length
        );

        if (progress) {
            quizState.attemptId =
                progress.attempt_id;

            quizState.currentIndex = Math.min(
                progress.currentIndex || 0,
                questionsArray.length - 1
            );

            quizState.correctCount =
                progress.correctCount || 0;

            quizState.wrongCount =
                progress.wrongCount || 0;

        } else {
            quizState.attemptId =
                await startStudentAttempt(
                    sessionToken,
                    packageId,
                    questionsArray.length
                );

            await saveQuizProgress(
                session,
                quizState
            );
        }

        renderQuizContainer(
            quizState,
            {
                onQuit: quitQuiz,
                onAnswer: handleAnswer,
                onNext: handleNextQuestion
            }
        );

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

async function handleAnswer(
    optionIndex,
    selectedOpt,
    questionObj
) {
    if (quizState.isAnswered) {
        return;
    }

    quizState.isAnswered = true;

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
        !!selectedOpt.correct;

    const pointsEarned =
        isCorrect
            ? (questionObj.points || 10)
            : 0;

    if (isCorrect) {
        quizState.correctCount++;
    } else {
        quizState.wrongCount++;
    }

    showAnswerFeedback(
        questionObj,
        optionIndex,
        isCorrect
    );

    const session =
        await getActiveSession();

    try {
        await saveStudentAnswer(
            sessionToken,
            quizState.attemptId,
            questionObj,
            optionIndex,
            selectedOpt,
            isCorrect,
            pointsEarned
        );

        if (session) {
            await saveQuizProgress(
                session,
                quizState
            );
        }

    } catch (err) {
        console.error(
            "Gagal menyimpan jawaban:",
            err
        );
    }
}

async function handleNextQuestion() {
    quizState.currentIndex++;

    const session =
        await getActiveSession();

    if (
        quizState.currentIndex <
        quizState.questions.length
    ) {
        quizState.isAnswered = false;

        if (session) {
            await saveQuizProgress(
                session,
                quizState
            );
        }

        renderQuestion(
            quizState,
            {
                onQuit: quitQuiz,
                onAnswer: handleAnswer,
                onNext: handleNextQuestion
            }
        );

        return;
    }

    await finishQuiz();
}

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
        console.log(
            "Menyelesaikan attempt:",
            {
                sessionToken:
                    sessionToken
                        ? "[ada]"
                        : "[kosong]",
                attemptId:
                    quizState.attemptId
            }
        );

        const resultData =
            await completeStudentAttempt(
                sessionToken,
                quizState.attemptId
            );

        const session =
            await getActiveSession();

        /*
         * Attempt sudah selesai.
         * Progress lokal boleh dihapus karena
         * hasil final sudah tersimpan di server.
         */
        if (session) {
            await clearQuizProgress(
                session,
                quizState.packageId
            );
        }

        renderQuizResult(
            resultData || {},
            quizState,
            {
                /*
                 * Percobaan baru.
                 */
                onRetry: async () => {
                    if (session) {
                        await clearQuizProgress(
                            session,
                            quizState.packageId
                        );
                    }

                    await startQuiz(
                        quizState.packageId,
                        quizState.questions
                    );
                },

                /*
                 * Kembali ke daftar paket.
                 */
                onBack: () => {
                    openQuizPackages(
                        session?.grade
                    );
                }
            }
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

async function quitQuiz() {
    const session =
        await getActiveSession();

    if (session) {
        await saveQuizProgress(
            session,
            quizState
        );
    }

    if (
        !confirm(
            "Keluar dari kuis? Progress saat ini akan disimpan."
        )
    ) {
        return;
    }

    /*
     * Jangan langsung showView sebelum
     * memastikan view paket tersedia.
     */
    if (session) {
        await openQuizPackages(
            session.grade
        );
    }
}

function showView(id) {
    document
        .querySelectorAll(".view")
        .forEach(view => {
            view.classList.add("hidden");
            view.classList.remove("active");
        });

    const target =
        document.getElementById(id);

    if (target) {
        target.classList.remove("hidden");
        target.classList.add("active");
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
