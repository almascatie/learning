export function renderTimedContainer(
    title = "Tantangan Waktu"
) {
    const app = document.getElementById("app");

    if (!app) {
        console.error("Element #app tidak ditemukan.");
        return;
    }

    app.innerHTML = `
        <section id="view-timed" class="view active">

            <div
                class="quiz-container"
                style="
                    max-width:600px;
                    margin:0 auto;
                    padding:24px 16px;
                "
            >

                <header
                    class="quiz-header"
                    style="
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                        margin-bottom:24px;
                    "
                >

                    <button
                        id="btn-quit-timed"
                        class="back-button"
                        type="button"
                    >
                        ← Keluar
                    </button>

                    <strong>
                        ${escapeHtml(title)}
                    </strong>

                </header>

                <div id="timed-content"></div>

            </div>

        </section>
    `;
}


export function renderTimedPackages(packages) {
    const app = document.getElementById("app");

    if (!app) {
        console.error("Element #app tidak ditemukan.");
        return;
    }

    app.innerHTML = `
        <section
            id="view-timed-packages"
            class="view active"
        >

            <div class="student-home-container">

                <header class="home-header">

                    <button
                        id="btn-back-timed-home"
                        class="back-button"
                        type="button"
                    >
                        ← Kembali ke Beranda
                    </button>

                    <h2 style="margin-top:12px;">
                        Pilih Tantangan Waktu ⏱️
                    </h2>

                    <p
                        style="
                            color:var(--muted);
                            margin:0;
                        "
                    >
                        Pilih tantangan untuk mulai.
                    </p>

                </header>

                <div
                    id="timed-package-list"
                    class="activity-menu"
                    style="margin-top:20px;"
                ></div>

            </div>

        </section>
    `;

    const list = document.getElementById(
        "timed-package-list"
    );

    if (!list) {
        console.error(
            "Element #timed-package-list tidak ditemukan."
        );
        return;
    }

    if (!packages.length) {
        list.innerHTML = `
            <div class="loading">
                Belum ada tantangan waktu.
            </div>
        `;
        return;
    }

    packages.forEach(item => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "activity-card timed";

        button.innerHTML = `
            <span class="activity-icon">
                ${item.icon || "⏱️"}
            </span>

            <span class="activity-content">

                <strong>
                    ${escapeHtml(
                        item.title || item.id
                    )}
                </strong>

                <small>
                    ${escapeHtml(
                        item.description ||
                        "Tantangan dengan batas waktu"
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


function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
