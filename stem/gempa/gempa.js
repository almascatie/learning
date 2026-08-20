export default {
    id: "gempa",
    title: "Petualangan Menghadapi Gempa",
    description: "Belajar tentang gempa dan cara menyelamatkan diri.",
    icon: "🌋",

    render(container) {
        container.innerHTML = `
            <div class="gempa-activity">
                <style>
                    .gempa-activity {
                        color: var(--text-dark);
                    }

                    .gempa-page {
                        display: none;
                    }

                    .gempa-page.active {
                        display: block;
                    }

                    .gempa-activity h2 {
                        font-size: 22px;
                        margin: 0 0 14px;
                        color: var(--blue);
                    }

                    .gempa-activity p {
                        line-height: 1.6;
                        color: var(--muted);
                        font-size: 15px;
                    }

                    .gempa-canvas-box {
                        width: 100%;
                        height: 250px;
                        background: #F1F5F9;
                        border: 3px solid #CBD5E1;
                        border-radius: 16px;
                        margin: 20px 0;
                        position: relative;
                        overflow: hidden;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .gempa-canvas-box canvas {
                        display: block;
                        max-width: 100%;
                        cursor: pointer;
                    }

                    .gempa-canvas-hint {
                        position: absolute;
                        bottom: 10px;
                        color: #1E293B;
                        font-size: 12px;
                        pointer-events: none;
                        background: #FFFFFF;
                        padding: 6px 14px;
                        border-radius: 8px;
                        font-weight: 700;
                        box-shadow: 0 2px 4px rgba(0,0,0,.05);
                    }

                    .gempa-scenario {
                        background: #F8FAFC;
                        border: 2px solid #E2E8F0;
                        padding: 16px;
                        border-radius: 16px;
                        margin-bottom: 12px;
                        cursor: pointer;
                        transition: .2s;
                    }

                    .gempa-scenario:hover {
                        border-color: var(--blue);
                        background: #F0FDF4;
                    }

                    .gempa-scenario-result {
                        margin-top: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        color: #047857;
                        display: none;
                    }

                    .gempa-options {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        margin-top: 15px;
                    }

                    .gempa-option {
                        background: var(--surface);
                        border: 2px solid #E2E8F0;
                        padding: 14px 16px;
                        border-radius: 14px;
                        font-family: inherit;
                        font-weight: 600;
                        font-size: 15px;
                        text-align: left;
                        cursor: pointer;
                        color: var(--text-dark);
                    }

                    .gempa-option:hover {
                        border-color: var(--blue);
                        background: #F0FDFA;
                    }

                    .gempa-option.correct {
                        background: #DCFCE7;
                        border-color: #22C55E;
                        color: #166534;
                    }

                    .gempa-option.incorrect {
                        background: #FEE2E2;
                        border-color: #EF4444;
                        color: #991B1B;
                    }

                    .gempa-feedback {
                        margin-top: 15px;
                        padding: 14px 16px;
                        border-radius: 12px;
                        font-weight: 600;
                        font-size: 14px;
                        display: none;
                    }

                    .gempa-feedback.correct {
                        background: #DCFCE7;
                        color: #166534;
                    }

                    .gempa-feedback.incorrect {
                        background: #FEE2E2;
                        color: #991B1B;
                    }

                    .gempa-nav {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 12px;
                        margin-top: 30px;
                        border-top: 2px dashed #E2E8F0;
                        padding-top: 20px;
                    }

                    .gempa-nav button {
                        background: var(--blue);
                        color: white;
                        border: none;
                        padding: 12px 18px;
                        border-radius: 14px;
                        font-family: inherit;
                        font-size: 15px;
                        font-weight: 700;
                        cursor: pointer;
                    }

                    .gempa-nav button:disabled {
                        background: #CBD5E1;
                        cursor: not-allowed;
                    }

                    .gempa-page-indicator {
                        font-weight: 700;
                        color: var(--muted);
                        font-size: 14px;
                        white-space: nowrap;
                    }
                </style>

                <div class="gempa-page active" data-page="1">
                    <h2>🧩 Dari Mana Asalnya Gempa Bumi?</h2>
                    <p><strong>Kok Bumi Bisa Goyang-Goyang, Ya?</strong></p>
                    <p>
                        Tahu tidak? Bumi tempat kita berdiri sekarang itu seperti
                        mainan puzzle raksasa yang besar sekali!
                        Di bawah tanah, ada <strong>Lempeng A</strong> dan
                        <strong>Lempeng B</strong> yang suka jalan-jalan rahasia
                        dengan sangat lambat.
                        Nah, karena jalannya sempit, kadang potongan puzzle ini
                        saling senggolan atau tabrakan keras!
                        Pas mereka tabrakan, energinya bikin tanah di atasnya ikut
                        bergetar hebat. Ssst, itulah yang kita sebut gempa bumi!
                    </p>

                    <div class="gempa-canvas-box">
                        <canvas class="gempa-canvas" width="540" height="230"></canvas>
                        <div class="gempa-canvas-hint">
                            👇 Yuk, klik gambarnya buat lihat lempeng puzzlenya tabrakan!
                        </div>
                    </div>
                </div>

                <div class="gempa-page" data-page="2">
                    <h2>🎒 Pas Bumi Goyang, Harus Gimana?</h2>
                    <p><strong>Ups, Ada Gempa! Pilih Aksi Hebatmu!</strong></p>
                    <p>
                        Saat tanah mulai bergoyang, ingat!
                        Tugas utama kita adalah menyelamatkan
                        <strong>KEPALA dan LEHER</strong>
                        biar tidak kejatuhan barang.
                        Karena posisi duduk di kelas beda-beda, yuk klik karakter
                        temanmu di bawah ini untuk lihat cara mereka menyelamatkan diri!
                    </p>

                    <div class="gempa-scenario" data-result="res1">
                        <strong>🚪 [Depan Kelas]</strong> — Klik untuk lihat aksi!
                        <div id="res1" class="gempa-scenario-result">
                            ✨ <i>Hore, Pintu Dekat!</i>
                            Anak langsung mengambil tas sekolah, ditaruh di atas
                            kepala sebagai helm, lalu berjalan cepat keluar menuju
                            lapangan luas. (Ingat: Tidak boleh dorong-dorongan!).
                        </div>
                    </div>

                    <div class="gempa-scenario" data-result="res2">
                        <strong>🪑 [Tengah Kelas]</strong> — Klik untuk lihat aksi!
                        <div id="res2" class="gempa-scenario-result">
                            ✨ <i>Lihat Situasi Dulu!</i>
                            Karena posisinya di tengah kelas, anak melihat ke depan.
                            Jika jalan ke pintu macet dan penuh teman, dia tidak
                            memaksa lari agar tidak terinjak. Dia langsung memakai
                            tas sebagai helm dan merunduk aman di samping meja
                            terdekat sampai jalan keluar kosong.
                        </div>
                    </div>

                    <div class="gempa-scenario" data-result="res3">
                        <strong>🏫 [Belakang Kelas]</strong> — Klik untuk lihat aksi!
                        <div id="res3" class="gempa-scenario-result">
                            ✨ <i>Aman, Berlindung Dulu!</i>
                            Karena pintu jauh dan kelas penuh, anak memakai tas
                            sebagai helm, lalu merunduk di lantai sebelah meja.
                            Dia menjauhi kaca jendela, lalu langsung lari keluar
                            kelas setelah gempanya reda.
                        </div>
                    </div>
                </div>

                <div class="gempa-page" data-page="3">
                    <h2>📝 Kuis Detektif Gempa!</h2>
                    <p>
                        Wah, kamu hebat sudah selesai membaca dan mencoba simulasi!
                        Sekarang, yuk bantu Detektif Gempa menjawab tantangan
                        di bawah ini.
                    </p>

                    <p>
                        <strong>🕵️‍♂️ Tantangan 1: Rahasia di Bawah Tanah</strong><br>
                        Kenapa sih bumi kita tiba-tiba bisa goyang dan bergetar?
                    </p>

                    <div class="gempa-options">
                        <button class="gempa-option"
                            data-correct="true"
                            data-feedback="Hebat, jawabanmu Benar! Potongan lempeng bumi di bawah tanah memang selalu bergerak. Pas mereka tabrakan, tanah di atasnya ikut bergoyang dan jadilah gempa!">
                            A. Karena potongan lempeng puzzle di bawah tanah saling senggolan atau tabrakan keras.
                        </button>

                        <button class="gempa-option"
                            data-correct="false"
                            data-feedback="Oops, kurang tepat! Jawaban yang benar adalah A. Matahari atau angin tidak bisa bikin tanah bergoyang sekeras itu. Gempa terjadi karena potongan lempeng puzzle di bawah tanah saling tabrakan keras!">
                            B. Karena mataharinya kepanasan di siang hari.
                        </button>

                        <button class="gempa-option"
                            data-correct="false"
                            data-feedback="Oops, kurang tepat! Jawaban yang benar adalah A. Matahari atau angin tidak bisa bikin tanah bergoyang sekeras itu. Gempa terjadi karena potongan lempeng puzzle di bawah tanah saling tabrakan keras!">
                            C. Karena ditiup angin yang sangat kencang.
                        </button>
                    </div>

                    <div class="gempa-feedback"></div>
                </div>

                <div class="gempa-page" data-page="4">
                    <h2>📝 Kuis Detektif Gempa!</h2>
                    <p>
                        <strong>🛡️ Tantangan 2: Tameng Sakti</strong><br>
                        Pas ada gempa, bagian tubuh mana yang paling penting
                        dilindungi pakai tas atau bantal?
                    </p>

                    <div class="gempa-options">
                        <button class="gempa-option"
                            data-correct="false"
                            data-feedback="Wah, sayang sekali! Jawaban yang benar adalah B. Sepatu dan kantong jajan bisa dicari lagi nanti, tapi kepala dan leher kita harus dilindungi nomor satu agar tidak terluka tertimpa benda jatuh.">
                            A. Kaki dan sepatu kesayangan kita.
                        </button>

                        <button class="gempa-option"
                            data-correct="true"
                            data-feedback="Keren, kamu Benar! Kepala dan leher adalah bagian paling penting. Melindunginya pakai tas bisa menjaga kita dari kejatuhan lampu atau atap kelas.">
                            B. Kepala dan leher kita.
                        </button>

                        <button class="gempa-option"
                            data-correct="false"
                            data-feedback="Wah, sayang sekali! Jawaban yang benar adalah B. Sepatu dan kantong jajan bisa dicari lagi nanti, tapi kepala dan leher kita harus dilindungi nomor satu agar tidak terluka tertimpa benda jatuh.">
                            C. Kantong baju tempat menyimpan jajan.
                        </button>
                    </div>

                    <div class="gempa-feedback"></div>
                </div>

                <div class="gempa-page" data-page="5">
                    <h2>📝 Kuis Detektif Gempa!</h2>
                    <p>
                        <strong>🏫 Tantangan 3: Anak Pintar di Dalam Kelas</strong><br>
                        Kalau kamu duduk di pojok kelas yang sempit dan jauh dari
                        pintu, tindakan apa yang paling aman?
                    </p>

                    <div class="gempa-options">
                        <button class="gempa-option"
                            data-correct="false"
                            data-feedback="Yuk, coba lagi! Jawaban yang benar adalah C. Lari rebutan bisa bikin kamu terjatuh dan terinjak teman, sedangkan diam saja bikin kamu bahaya kejatuhan atap. Pilihan terbaik adalah pakai tas jadi helm dan merunduk aman di samping meja!">
                            A. Langsung lari rebutan ke pintu depan sampai menabrak teman-teman lain.
                        </button>

                        <button class="gempa-option"
                            data-correct="false"
                            data-feedback="Yuk, coba lagi! Jawaban yang benar adalah C. Lari rebutan bisa bikin kamu terjatuh dan terinjak teman, sedangkan diam saja bikin kamu bahaya kejatuhan atap. Pilihan terbaik adalah pakai tas jadi helm dan merunduk aman di samping meja!">
                            B. Diam saja di atas kursi sambil merem takutan.
                        </button>

                        <button class="gempa-option"
                            data-correct="true"
                            data-feedback="Tepat Sekali! Berdesakan di pintu sangat berbahaya karena bisa bikin jatuh tertimbun. Berlindung dulu pakai tas di dekat meja jauh lebih aman!">
                            C. Pakai tas sekolah jadi helm, lalu merunduk di samping meja yang jauh dari kaca jendela.
                        </button>
                    </div>

                    <div class="gempa-feedback"></div>
                </div>

                <div class="gempa-page" data-page="6">
                    <h2>📝 Kuis Detektif Gempa!</h2>
                    <p>
                        <strong>🏃‍♂️ Tantangan 4: Setelah Goyangan Berhenti</strong><br>
                        Nah, kalau buminya sudah tenang dan tidak goyang lagi,
                        kita harus bagaimana?
                    </p>

                    <div class="gempa-options">
                        <button class="gempa-option"
                            data-correct="true"
                            data-feedback="Luar Biasa, kamu Benar! Lapangan terbuka adalah tempat paling aman karena tidak ada atap atau pohon yang bisa roboh menimpa kita.">
                            A. Langsung jalan cepat dan tertib keluar menuju lapangan atau halaman terbuka.
                        </button>

                        <button class="gempa-option"
                            data-correct="false"
                            data-feedback="Hampir benar, yuk pelajari lagi! Jawaban yang benar adalah A. Jangan masuk lagi ke kelas atau diam mengobrol karena bisa saja ada gempa susulan. Begitu gempa reda, langsung jalan tertib keluar ke lapangan terbuka ya!">
                            B. Masuk lagi ke dalam kelas buat mengambil mainan yang ketinggalan.
                        </button>

                        <button class="gempa-option"
                            data-correct="false"
                            data-feedback="Hampir benar, yuk pelajari lagi! Jawaban yang benar adalah A. Jangan masuk lagi ke kelas atau diam mengobrol karena bisa saja ada gempa susulan. Begitu gempa reda, langsung jalan tertib keluar ke lapangan terbuka ya!">
                            C. Malah duduk-duduk santai di kelas sambil mengobrol.
                        </button>
                    </div>

                    <div class="gempa-feedback"></div>
                </div>

                <div class="gempa-nav">
                    <button type="button" class="gempa-prev">
                        ⬅️ Sebelumnya
                    </button>

                    <span class="gempa-page-indicator">
                        Halaman 1 dari 6
                    </span>

                    <button type="button" class="gempa-next">
                        Selanjutnya ➡️
                    </button>
                </div>
            </div>
        `;

        initGempa(container);
    }
};

function initGempa(container) {
    let currentPage = 1;
    const totalPages = 6;

    const pages = container.querySelectorAll(".gempa-page");
    const prevBtn = container.querySelector(".gempa-prev");
    const nextBtn = container.querySelector(".gempa-next");
    const indicator = container.querySelector(".gempa-page-indicator");

    function updatePage() {
        pages.forEach(page => {
            page.classList.remove("active");
        });

        const current = container.querySelector(
            `.gempa-page[data-page="${currentPage}"]`
        );

        if (current) {
            current.classList.add("active");
        }

        indicator.textContent =
            `Halaman ${currentPage} dari ${totalPages}`;

        prevBtn.disabled = currentPage === 1;

        if (currentPage === totalPages) {
            nextBtn.disabled = false;
            nextBtn.textContent = "Selesai ✅";
        } else {
            nextBtn.disabled = false;
            nextBtn.textContent = "Selanjutnya ➡️";
        }

        if (currentPage === 1) {
            startCanvas();
        }
    }

    prevBtn.addEventListener("click", () => {
        if (currentPage <= 1) return;

        currentPage--;
        updatePage();
    });

    nextBtn.addEventListener("click", () => {
        if (currentPage === totalPages) {
            const quitButton = document.getElementById("btn-quit-stem");

            if (quitButton) {
                quitButton.click();
            }

            return;
        }

        currentPage++;
        updatePage();
    });

    container
        .querySelectorAll(".gempa-scenario")
        .forEach(card => {
            card.addEventListener("click", () => {
                const resultId = card.dataset.result;

                container
                    .querySelectorAll(".gempa-scenario-result")
                    .forEach(result => {
                        result.style.display = "none";
                    });

                const result = container.querySelector(`#${resultId}`);

                if (result) {
                    result.style.display = "block";
                }
            });
        });

    container
        .querySelectorAll(".gempa-option")
        .forEach(button => {
            button.addEventListener("click", () => {
                const parent = button.closest(".gempa-page");

                if (!parent) return;

                const buttons =
                    parent.querySelectorAll(".gempa-option");

                const feedback =
                    parent.querySelector(".gempa-feedback");

                buttons.forEach(btn => {
                    btn.disabled = true;
                    btn.style.pointerEvents = "none";
                });

                const correct =
                    button.dataset.correct === "true";

                button.classList.add(
                    correct ? "correct" : "incorrect"
                );

                feedback.className =
                    `gempa-feedback ${correct ? "correct" : "incorrect"}`;

                feedback.textContent =
                    (correct ? "🎉 " : "💡 ") +
                    button.dataset.feedback;

                feedback.style.display = "block";
            });
        });

    const canvas =
        container.querySelector(".gempa-canvas");

    const hint =
        container.querySelector(".gempa-canvas-hint");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let state = "idle";
    let animProgress = 0;
    let shakeFrames = 0;

    function drawStickFigure(x, y) {
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 2;

        ctx.fillStyle = "#FCD34D";

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y + 5);
        ctx.lineTo(x, y + 15);
        ctx.moveTo(x, y + 15);
        ctx.lineTo(x - 4, y + 22);
        ctx.moveTo(x, y + 15);
        ctx.lineTo(x + 4, y + 22);
        ctx.stroke();
    }

    function drawHouse(x, y) {
        ctx.fillStyle = "#FEE2E2";
        ctx.fillRect(x, y + 8, 18, 14);

        ctx.strokeStyle = "#991B1B";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y + 8, 18, 14);

        ctx.fillStyle = "#EF4444";

        ctx.beginPath();
        ctx.moveTo(x - 2, y + 8);
        ctx.lineTo(x + 9, y);
        ctx.lineTo(x + 20, y + 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    function drawTree(x, y) {
        ctx.fillStyle = "#B45309";
        ctx.fillRect(x + 5, y + 10, 4, 12);

        ctx.fillStyle = "#10B981";

        ctx.beginPath();
        ctx.arc(x + 7, y + 6, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#047857";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    function renderScene() {
        if (currentPage !== 1) return;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        let shakeX = 0;
        let shakeY = 0;

        if (shakeFrames > 0) {
            shakeX = (Math.random() - 0.5) * 8;
            shakeY = (Math.random() - 0.5) * 8;
            shakeFrames--;

            if (shakeFrames === 0) {
                state = "resting";
                hint.textContent =
                    "✨ Selesai! Klik lagi untuk mengulang.";
            }
        }

        ctx.save();
        ctx.translate(shakeX, shakeY);

        const baseA = 20;
        const baseB = 290;

        if (
            state === "moving" ||
            state === "collision" ||
            shakeFrames > 0
        ) {
            if (animProgress < 25) {
                animProgress += 0.7;
            } else {
                if (state === "moving") {
                    state = "collision";
                    shakeFrames = 70;
                }
            }
        }

        const currentA = baseA + animProgress;
        const currentB = baseB - animProgress;

        ctx.fillStyle = "#93C5FD";
        ctx.fillRect(
            currentA,
            55,
            210,
            145
        );

        ctx.strokeStyle = "#2563EB";
        ctx.lineWidth = 2.5;

        ctx.strokeRect(
            currentA,
            55,
            210,
            145
        );

        ctx.fillStyle = "#86EFAC";
        ctx.fillRect(
            currentA,
            42,
            210,
            13
        );

        ctx.strokeStyle = "#16A34A";
        ctx.lineWidth = 1.5;

        ctx.strokeRect(
            currentA,
            42,
            210,
            13
        );

        drawTree(
            currentA + 15,
            12
        );

        drawHouse(
            currentA + 65,
            14
        );

        drawStickFigure(
            currentA + 120,
            15
        );

        ctx.fillStyle = "#1E40AF";
        ctx.font = "bold 13px Fredoka";

        ctx.fillText(
            "LEMPENG A",
            currentA + 65,
            125
        );

        ctx.fillStyle = "#FDE68A";

        ctx.fillRect(
            currentB,
            55,
            210,
            145
        );

        ctx.strokeStyle = "#D97706";
        ctx.lineWidth = 2.5;

        ctx.strokeRect(
            currentB,
            55,
            210,
            145
        );

        ctx.fillStyle = "#86EFAC";

        ctx.fillRect(
            currentB,
            42,
            210,
            13
        );

        ctx.strokeStyle = "#16A34A";
        ctx.lineWidth = 1.5;

        ctx.strokeRect(
            currentB,
            42,
            210,
            13
        );

        drawStickFigure(
            currentB + 40,
            15
        );

        drawHouse(
            currentB + 100,
            14
        );

        drawTree(
            currentB + 160,
            12
        );

        ctx.fillStyle = "#B45309";
        ctx.font = "bold 13px Fredoka";

        ctx.fillText(
            "LEMPENG B",
            currentB + 65,
            125
        );

        const faultX =
            currentA + 210;

        ctx.strokeStyle =
            shakeFrames > 0
                ? "#DC2626"
                : "#64748B";

        ctx.lineWidth =
            shakeFrames > 0
                ? 4
                : 2.5;

        ctx.beginPath();

        ctx.moveTo(
            faultX,
            42
        );

        ctx.lineTo(
            faultX,
            200
        );

        ctx.stroke();

        if (shakeFrames > 0) {
            ctx.fillStyle = "#FEF08A";
            ctx.strokeStyle = "#DC2626";
            ctx.lineWidth = 2.5;

            ctx.beginPath();

            ctx.arc(
                faultX,
                115,
                28 + Math.random() * 6,
                0,
                Math.PI * 2
            );

            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#DC2626";
            ctx.font = "bold 14px Fredoka";

            ctx.fillText(
                "💥 GEMPA!",
                faultX - 32,
                75
            );
        }

        ctx.restore();

        requestAnimationFrame(renderScene);
    }

    canvas.addEventListener("click", () => {
        if (
            state === "idle" ||
            state === "resting"
        ) {
            state = "moving";
            animProgress = 0;

            hint.textContent =
                "⚡ Lempeng bertabrakan, daratan bergoyang!";
        }
    });

    function startCanvas() {
        renderScene();
    }

    renderScene();
}
