import {
    renderTimedPackages,
    renderTimedContainer
} from "./timed-ui.js";

export async function openTimedPackages(grade) {
    const studentGrade = Number(grade);

    if (!studentGrade) {
        console.error("Grade siswa tidak ditemukan.");
        return;
    }

    try {
        const manifestUrl = new URL("../../timed/manifest.js", import.meta.url);
        const module = await import(manifestUrl.href);

        const manifest = module.timedManifest || [];

        const packages = manifest
            .filter(item => Number(item.grade) === studentGrade)
            .map(item => ({
                ...item,
                onOpen: () => loadTimedActivity(item)
            }));

        renderTimedPackages(packages);

        document
            .getElementById("btn-back-timed-home")
            ?.addEventListener("click", () => {
                showView("view-home");
            });

    } catch (err) {
        console.error("Gagal memuat manifest Tantangan Waktu:", err);

        renderTimedPackages([]);

        const list = document.getElementById("timed-package-list");

        if (list) {
            list.innerHTML = `
                <div class="loading">
                    Belum ada tantangan waktu.
                </div>
            `;
        }
    }
}

async function loadTimedActivity(activity) {
    try {
        const manifestUrl = new URL("../../timed/manifest.js", import.meta.url);
        const activityUrl = new URL(activity.file, manifestUrl);

        const module = await import(activityUrl.href);
        const activityData = module.default;

        if (!activityData) {
            throw new Error(
                "File aktivitas Tantangan Waktu tidak memiliki export default."
            );
        }

        renderTimedContainer(
            activityData.title ||
            activity.title ||
            "Tantangan Waktu"
        );

        const content = document.getElementById("timed-content");

        if (!content) {
            throw new Error("Element #timed-content tidak ditemukan.");
        }

        content.innerHTML = `
            <div
                style="
                    background:var(--surface);
                    border:3px solid var(--border);
                    border-radius:24px;
                    padding:24px;
                    text-align:center;
                "
            >
                <div
                    style="
                        font-size:64px;
                        margin-bottom:16px;
                    "
                >
                    ${activityData.icon || activity.icon || "⏱️"}
                </div>

                <h2>
                    ${escapeHtml(
                        activityData.title ||
                        activity.title ||
                        ""
                    )}
                </h2>

                <p style="color:var(--muted);">
                    ${escapeHtml(
                        activityData.description ||
                        activity.description ||
                        ""
                    )}
                </p>

                <p>
                    Tantangan waktu siap dikembangkan.
                </p>
            </div>
        `;

        document
            .getElementById("btn-quit-timed")
            ?.addEventListener("click", () => {
                openTimedPackages(activity.grade);
            });

    } catch (err) {
        console.error(
            "Gagal memuat aktivitas Tantangan Waktu:",
            err
        );

        alert("Tantangan Waktu tidak dapat dibuka.");
    }
}

function showView(id) {
    document.querySelectorAll(".view").forEach(view => {
        view.classList.add("hidden");
        view.classList.remove("active");
    });

    const target = document.getElementById(id);

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
