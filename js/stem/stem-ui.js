export function renderStemPackages(packages) {
    const app = document.getElementById("app");

    if (!app) {
        console.error("Element #app tidak ditemukan.");
        return;
    }

    document.querySelectorAll(".view").forEach(view => {
        view.classList.add("hidden");
        view.classList.remove("active");
    });

    const oldView = document.getElementById("view-stem-packages");
    if (oldView) {
        oldView.remove();
    }

    const stemView = document.createElement("section");

    stemView.id = "view-stem-packages";
    stemView.className = "view active";

    stemView.innerHTML = `
        <div class="student-home-container">

            <header class="home-header">

                <button
                    id="btn-back-stem-home"
                    class="back-button"
                    type="button"
                >
                    ← Kembali ke Beranda
                </button>

                <h2 style="margin-top:12px;">
                    Pilih STEM 🔬
                </h2>

                <p style="color:var(--muted);margin:0;">
                    Pilih aktivitas untuk mulai.
                </p>

            </header>

            <div
                id="stem-package-list"
                class="activity-menu"
                style="margin-top:20px;"
            ></div>

        </div>
    `;

    app.appendChild(stemView);

    const list = document.getElementById("stem-package-list");

    if (!list) {
        console.error("Element #stem-package-list tidak ditemukan.");
        return;
    }

    if (!packages.length) {
        list.innerHTML = `
            <div class="loading">
                Belum ada aktivitas STEM.
            </div>
        `;
        return;
    }

    packages.forEach(item => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "activity-card stem";

        button.innerHTML = `
            <span class="activity-icon">
                ${item.icon || "🔬"}
            </span>

            <span class="activity-content">
                <strong>
                    ${escapeHtml(item.title || item.id)}
                </strong>

                <small>
                    ${escapeHtml(
                        item.description ||
                        "Eksplorasi dan permainan"
                    )}
                </small>
            </span>
        `;

        button.addEventListener(
            "click",
            () => item.onOpen?.()
        );

        list.appendChild(button);
    });
}
