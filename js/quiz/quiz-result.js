export function renderQuizResult(resultData, state, callbacks) {
    const app = document.getElementById("app");
    const finalScore = resultData?.score ?? 0;
    const correct = resultData?.correct_count ?? state.correctCount;
    const wrong = resultData?.wrong_count ?? state.wrongCount;

    app.innerHTML = `
        <section id="view-result" class="view active">
            <div class="result-container" style="max-width:480px;margin:40px auto;padding:20px;text-align:center;">
                <div class="result-card" style="background:var(--surface);border:3px solid var(--border);border-radius:28px;padding:40px 24px;box-shadow:var(--shadow-soft);">
                    <div style="font-size:64px;margin-bottom:12px;">🏆</div>
                    <h2 style="font-size:26px;margin:0 0 24px;">Hore, Kuis Selesai!</h2>
                    <div style="background:#EFF6FF;border:2px dashed #93C5FD;border-radius:20px;padding:20px;margin-bottom:24px;">
                        <span style="font-size:14px;font-weight:700;color:var(--muted);display:block;margin-bottom:4px;">SKOR AKHIR</span>
                        <h1 style="font-size:48px;color:var(--blue);margin:0;">${finalScore}</h1>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:32px;">
                        <div style="background:#F0FDF4;border:2px solid #86EFAC;border-radius:16px;padding:12px;">
                            <strong style="color:#166534;font-size:18px;">${correct}</strong>
                            <small style="display:block;">Benar</small>
                        </div>
                        <div style="background:#FEF2F2;border:2px solid #FCA5A5;border-radius:16px;padding:12px;">
                            <strong style="color:#991B1B;font-size:18px;">${wrong}</strong>
                            <small style="display:block;">Salah</small>
                        </div>
                    </div>
                    <button id="btn-result-packages" class="primary-button" type="button" style="width:100%;">
                        Kembali ke Pilihan Kuis
                    </button>
                </div>
            </div>
        </section>
    `;

    document.getElementById("btn-result-packages").addEventListener("click", callbacks.onBack);
}
