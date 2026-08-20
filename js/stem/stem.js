import {
    renderStemPackages,
    renderStemContainer
} from "./stem-ui.js";


export async function openStemPackages(grade) {
    const studentGrade = Number(grade);

    if (!studentGrade) {
        console.error("Grade siswa tidak ditemukan.");
        return;
    }

    try {
        const manifestUrl = new URL(
            "../../stem/manifest.js",
            import.meta.url
        );

        const module = await import(manifestUrl.href);

        const manifest = module.stemManifest || [];

        const packages = manifest
            .filter(item => Number(item.grade) === studentGrade)
            .map(item => ({
                ...item,
                onOpen: () => loadStemActivity(item)
            }));

        renderStemPackages(packages);

        const backButton =
            document.getElementById("btn-back-stem-home");

        if (backButton) {
            backButton.addEventListener("click", () => {
                showView("view-home");
            });
        }

    } catch (err) {
        console.error(
            "Gagal memuat manifest STEM:",
            err
        );

        renderStemPackages([]);

        const list =
            document.getElementById("stem-package-list");

        if (list) {
            list.innerHTML = `
                <div class="loading">
                    Belum ada aktivitas STEM.
                </div>
            `;
        }
    }
}


async function loadStemActivity(activity) {
    try {
        const manifestUrl = new URL(
            "../../stem/manifest.js",
            import.meta.url
        );

        const activityUrl = new URL(
            activity.file,
            manifestUrl
        );

        const module = await import(activityUrl.href);

        const activityData = module.default;

        if (!activityData) {
            throw new Error(
                "File aktivitas STEM tidak memiliki export default."
            );
        }

        renderStemContainer(
            activityData.title ||
            activity.title ||
            "STEM"
        );

        const content =
            document.getElementById("stem-content");

        if (!content) {
            throw new Error(
                "Element #stem-content tidak ditemukan."
            );
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
                    ${activityData.icon || activity.icon || "🔬"}
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
                    Aktivitas STEM siap dikembangkan.
                </p>

            </div>
        `;

        const quitButton =
            document.getElementById("btn-quit-stem");

        if (quitButton) {
            quitButton.addEventListener("click", () => {
                openStemPackages(activity.grade);
            });
        }

    } catch (err) {
        console.error(
            "Gagal memuat aktivitas STEM:",
            err
        );

        alert("Aktivitas STEM tidak dapat dibuka.");
    }
}


function showView(id) {
    document.querySelectorAll(".view").forEach(view => {
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
