export function renderStemContainer(title = "STEM") {
    const app = document.getElementById("app");

    app.innerHTML = `
        <section id="view-stem" class="view active">
            <div class="quiz-container" style="max-width:600px;margin:0 auto;padding:24px 16px;">
                <header class="quiz-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
                    <button id="btn-quit-stem" class="back-button" type="button">← Keluar</button>
                    <strong>${escapeHtml(title)}</strong>
                </header>
                <div id="stem-content"></div>
            </div>
        </section>
    `;
}

export function renderStemPackages(packages) {
    const app = document.getElementById("app");

    app.innerHTML = `
        <section id="view-stem-packages" class="view active">
            <div class="student-home-container">
                <header class="home-header">
                    <button id="btn-back-stem-home" class="back-button" type="button">
                        ← Kembali ke Beranda
                    </button>
                    <h2 style="margin-top:12px;">Pilih STEM 🔬</h2>
                    <p style="color:var(--muted);margin:0;">
                        Pilih aktivitas untuk mulai.
                    </p>
                </header>
                <div id="stem-package-list" class="activity-menu" style="margin-top:20px;"></div>
            </div>
        </section>
    `;

    const list = document.getElementById("stem-package-list");

    packages.forEach(item => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "activity-card stem";
        button.innerHTML = `
            <span class="activity-icon">${item.icon || "🔬"}</span>
            <span class="activity-content">
                <strong>${escapeHtml(item.title || item.id)}</strong>
                <small>${escapeHtml(item.description || "Eksplorasi dan permainan")}</small>
            </span>
        `;

        button.addEventListener("click", () => item.onOpen?.());
        list.appendChild(button);
    });
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
