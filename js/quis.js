import { supabase } from "./supabase.js";
import { db } from "./storage.js";

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
   GET ACTIVE SESSION TOKEN FROM DEXIE
================================ */
async function getActiveSessionToken() {
    try {
        const sessions = await db.sessions.toArray();
        const now = Date.now();
        const active = sessions.find(s => new Date(s.expires_at).getTime() > now);
        return active ? active.session_token : null;
    } catch (err) {
        console.error("Gagal mengambil sesi lokal:", err);
        return null;
    }
}

/* ================================
   START QUIZ
================================ */
export async function startQuiz(packageId, questionsArray) {
    if (!questionsArray || questionsArray.length === 0) {
        alert("Paket soal kosong atau belum tersedia.");
        return;
    }

    const sessionToken = await getActiveSessionToken();
    if (!sessionToken) {
        alert("Sesi habis, silakan login ulang.");
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
        // Memanggil RPC backend untuk mencatat attempt baru
        const { data: attemptId, error } = await supabase.rpc("start_student_attempt", {
            p_session_token: sessionToken,
            p_package_id: packageId,
            p_total_questions: questionsArray.length
        });

        if (error) throw error;
        quizState.attemptId = attemptId;

        renderQuizContainer();
        renderQuestion();
    } catch (err) {
        console.error("Gagal memulai kuis:", err);
        alert("Terjadi kesalahan saat menyiapkan kuis.");
    }
}

/* ================================
   RENDER QUIZ CONTAINER UI
================================ */
function renderQuizContainer() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <section id="view-quiz" class="view active">
            <div class="quiz-container" style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
                <header class="quiz-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <button id="btn-quit-quiz" class="back-button" type="button">← Keluar</button>
                    <div class="quiz-progress-info">
                        <span id="quiz-counter" style="font-weight: 700; color: var(--muted);">Soal 1 / ${quizState.questions.length}</span>
                    </div>
                </header>
                
                <div class="progress-bar-container" style="background: var(--border); height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 24px;">
                    <div id="quiz-progress-fill" style="background: var(--blue); width: 0%; height: 100%; transition: width 0.3s ease;"></div>
                </div>
                
                <div class="quiz-card" style="background: var(--surface); border: 3px solid var(--border); border-radius: 24px; padding: 24px; box-shadow: var(--shadow-soft); margin-bottom: 20px;">
                    <div id="quiz-visual" style="font-size: 48px; text-align: center; margin-bottom: 12px;" class="hidden"></div>
                    <h3 id="quiz-question-text" style="font-size: 20px; margin-top: 0; margin-bottom: 20px; text-align: center;">Pertanyaan...</h3>
                    <div id="quiz-options" class="quiz-options" style="display: flex; flex-direction: column; gap: 12px;"></div>
                </div>

                <div id="quiz-feedback" class="message hidden" style="margin-bottom: 20px;"></div>
                
                <button id="btn-next-question" class="primary-button hidden" type="button">
                    Lanjut Soal Berikutnya →
                </button>
            </div>
        </section>
    `;

    document.getElementById("btn-quit-quiz").addEventListener("click", () => {
        if (confirm("Keluar dari kuis? Progress saat ini akan dihentikan.")) {
            window.location.reload();
        }
    });

    document.getElementById("btn-next-question").addEventListener("click", handleNextQuestion);
}

/* ================================
   RENDER CURRENT QUESTION
================================ */
function renderQuestion() {
    const q = quizState.questions[quizState.currentIndex];
    quizState.isAnswered = false;

    document.getElementById("quiz-counter").textContent = 
        `Soal ${quizState.currentIndex + 1} / ${quizState.questions.length}`;
    
    const progressPct = ((quizState.currentIndex) / quizState.questions.length) * 100;
    document.getElementById("quiz-progress-fill").style.width = `${progressPct}%`;

    document.getElementById("quiz-question-textlectricité" || "quiz-question-text").textContent = q.question;

    // Visual pendukung opsional (emoji / ikon)
    const visualEl = document.getElementById("quiz-visual");
    if (q.visual) {
        visualEl.textContent = q.visual;
        visualEl.classList.remove("hidden");
    } else {
        visualEl.classList.add("hidden");
    }

    // Render pilihan jawaban
    const optionsEl = document.getElementById("quiz-options");
    optionsEl.innerHTML = "";

    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option-card";
        btn.style.cssText = "background: #F8FAFC; border: 2px solid var(--border); border-radius: 16px; padding: 16px; text-align: left; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s;";
        btn.textContent = opt.text;
        
        btn.addEventListener("click", () => handleAnswer(idx, opt, q));
        optionsEl.appendChild(btn);
    });

    document.getElementById("quiz-feedback").classList.add("hidden");
    document.getElementById("btn-next-question").classList.add("hidden");
}

/* ================================
   HANDLE ANSWER SELECTION
================================ */
async function handleAnswer(optionIndex, selectedOpt, questionObj) {
    if (quizState.isAnswered) return; // Mencegah double-tap
    quizState.isAnswered = true;

    const sessionToken = await getActiveSessionToken();
    const isCorrect = selectedOpt.correct;
    const pointsEarned = isCorrect ? (questionObj.points || 10) : 0;

    if (isCorrect) {
        quizState.correctCount++;
    } else {
        quizState.wrongCount++;
    }

    // Kunci tombol setelah dipilih & beri indikator visual benar/salah
    const optionButtons = document.querySelectorAll(".option-card");
    optionButtons.forEach((btn, idx) => {
        btn.disabled = true;
        if (questionObj.options[idx].correct) {
            btn.style.background = "#DCFCE7";
            btn.style.borderColor = "#22C55E";
            btn.style.color = "#166534";
        } else if (idx === optionIndex && !isCorrect) {
            btn.style.background = "#FEE2E2";
            btn.style.borderColor = "#EF4444";
            btn.style.color = "#991B1B";
        }
    });

    // Tampilkan Feedback langsung
    const feedbackEl = document.getElementById("quiz-feedback");
    feedbackEl.className = `message ${isCorrect ? 'success' : 'error'}`;
    feedbackEl.style.cssText = `margin-top: 16px; padding: 16px; border-radius: 16px; background: ${isCorrect ? '#F0FDF4' : '#FEF2F2'}; color: ${isCorrect ? '#166534' : '#B91C1C'}; border: 2px solid ${isCorrect ? '#86EFAC' : '#FCA5A5'};`;
    feedbackEl.innerHTML = `
        <strong style="font-size: 16px; display: block; margin-bottom: 4px;">${isCorrect ? '🎉 Benar!' : '💡 Belum tepat.'}</strong>
        <span>${questionObj.explanation || 'Tetap semangat mencoba ya!'}</span>
    `;
    feedbackEl.classList.remove("hidden");
    document.getElementById("btn-next-question").classList.remove("hidden");

    // Simpan jawaban ke database via RPC secara asinkron
    try {
        await supabase.rpc("save_student_answer", {
            p_session_token: sessionToken,
            p_attempt_id: quizState.attemptId,
            p_question_id: questionObj.id,
            p_question_version: questionObj.version || 1,
            p_selected_answer: { selected_index: optionIndex, text: selectedOpt.text },
            p_is_correct: isCorrect,
            p_points: pointsEarned
        });
    } catch (err) {
        console.error("Gagal menyimpan jawaban ke database:", err);
    }
}

/* ================================
   NEXT QUESTION / FINISH
================================ */
function handleNextQuestion() {
    quizState.currentIndex++;
    if (quizState.currentIndex < quizState.questions.length) {
        renderQuestion();
    } else {
        finishQuiz();
    }
}

async function finishQuiz() {
    const sessionToken = await getActiveSessionToken();
    
    try {
        // Menyelesaikan attempt di server (menghitung total skor akhir secara server-side)
        const { data, error } = await supabase.rpc("complete_student_attempt", {
            p_session_token: sessionToken,
            p_attempt_id: quizState.attemptId
        });

        if (error) throw error;

        renderResultScreen(data);
    } catch (err) {
        console.error("Gagal menyelesaikan attempt:", err);
        alert("Gagal menyimpan hasil akhir kuis ke server.");
    }
}

/* ================================
   RENDER RESULT SCREEN
================================ */
function renderResultScreen(resultData) {
    const app = document.getElementById("app");
    const finalScore = resultData.score || 0;
    const correct = resultData.correct_count || quizState.correctCount;
    const wrong = resultData.wrong_count || quizState.wrongCount;

    app.innerHTML = `
        <section id="view-result" class="view active">
            <div class="result-container" style="max-width: 480px; margin: 40px auto; padding: 20px; text-align: center;">
                <div class="result-card" style="background: var(--surface); border: 3px solid var(--border); border-radius: 28px; padding: 40px 24px; box-shadow: var(--shadow-soft);">
                    <div style="font-size: 64px; margin-bottom: 12px;">🏆</div>
                    <h2 style="font-size: 26px; margin: 0 0 24px;">Hore, Kuis Selesai!</h2>
                    
                    <div style="background: #EFF6FF; border: 2px dashed #93C5FD; border-radius: 20px; padding: 20px; margin-bottom: 24px;">
                        <span style="font-size: 14px; font-weight: 700; color: var(--muted); display: block; margin-bottom: 4px;">SKOR AKHIR</span>
                        <h1 style="font-size: 48px; color: var(--blue); margin: 0; font-family: 'Fredoka', cursive;">${finalScore}</h1>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px;">
                        <div style="background: #F0FDF4; border: 2px solid #86EFAC; border-radius: 16px; padding: 12px; text-align: center;">
                            <strong style="color: #166534; font-size: 18px; display: block;">✅ ${correct}</strong>
                            <span style="font-size: 13px; color: #15803D; font-weight: 600;">Benar</span>
                        </div>
                        <div style="background: #FEF2F2; border: 2px solid #FCA5A5; border-radius: 16px; padding: 12px; text-align: center;">
                            <strong style="color: #991B1B; font-size: 18px; display: block;">❌ ${wrong}</strong>
                            <span style="font-size: 13px; color: #B91C1C; font-weight: 600;">Salah</span>
                        </div>
                    </div>

                    <button id="btn-back-home" class="primary-button" type="button">
                        🏠 Kembali ke Beranda
                    </button>
                </div>
            </div>
        </section>
    `;

    document.getElementById("btn-back-home").addEventListener("click", () => {
        window.location.reload();
    });
}
