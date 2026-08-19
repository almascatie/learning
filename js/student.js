import { supabase } from "./supabase.js";
import {
    db,
    saveSession,
    getActiveSession,
    deleteSession
} from "./storage.js";


/* =========================================================
   STATE
========================================================= */

const state = {
    selectedStudent: null,
    session: null,
    loading: false
};


/* =========================================================
   INITIALIZE APP
========================================================= */

export async function initStudentApp() {

    bindEvents();

    /*
     * Coba memulihkan session dari IndexedDB.
     */
    const recovered =
        await recoverSession();

    /*
     * Jika session masih valid,
     * langsung masuk ke beranda.
     */
    if (recovered) {
        return;
    }

    /*
     * Tidak ada session aktif.
     * Tampilkan halaman pilih siswa.
     */
    showView(
        "view-student-select"
    );

    await loadStudents();
}


/* =========================================================
   EVENTS
========================================================= */

function bindEvents() {

    /*
     * Tombol kembali dari halaman PIN.
     */
    const backButton =
        document.getElementById(
            "btn-back-student"
        );

    if (backButton) {

        backButton.addEventListener(
            "click",
            () => {

                state.selectedStudent =
                    null;

                const pinInput =
                    document.getElementById(
                        "student-pin"
                    );

                if (pinInput) {
                    pinInput.value = "";
                }

                clearPinError();

                showView(
                    "view-student-select"
                );
            }
        );
    }


    /*
     * Tombol login.
     */
    const loginButton =
        document.getElementById(
            "btn-login"
        );

    if (loginButton) {

        loginButton.addEventListener(
            "click",
            loginStudent
        );
    }


    /*
     * Enter pada input PIN.
     */
    const pinInput =
        document.getElementById(
            "student-pin"
        );

    if (pinInput) {

        pinInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    loginStudent();
                }
            }
        );
    }


    /*
     * Tombol aktivitas.
     *
     * Mesin Kuis/STEM/Tantangan belum
     * disambungkan pada tahap ini.
     */
    document
        .querySelectorAll(
            "[data-activity]"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const activity =
                        button.dataset.activity;

                    console.log(
                        "Activity selected:",
                        activity
                    );

                    /*
                     * Nanti:
                     *
                     * quiz  → quiz.js
                     * stem  → stem.js
                     * timed → timed.js
                     */
                }
            );
        });
}


/* =========================================================
   LOAD STUDENTS
========================================================= */

async function loadStudents() {

    const container =
        document.getElementById(
            "student-list"
        );

    const error =
        document.getElementById(
            "student-error"
        );


    if (!container) {
        return;
    }


    try {

        container.innerHTML = `
            <div class="loading">
                Memuat data siswa...
            </div>
        `;


        if (error) {
            error.classList.add(
                "hidden"
            );
        }


        const {
            data,
            error: rpcError
        } = await supabase.rpc(
            "get_active_students"
        );


        if (rpcError) {
            throw rpcError;
        }


        renderStudents(
            data || []
        );


    } catch (err) {

        console.error(
            "get_active_students:",
            err
        );


        container.innerHTML = "";


        if (error) {

            error.textContent =
                "Data siswa tidak dapat dimuat.";

            error.classList.remove(
                "hidden"
            );
        }
    }
}


/* =========================================================
   RENDER STUDENTS
========================================================= */

function renderStudents(
    students
) {

    const container =
        document.getElementById(
            "student-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!students.length) {

        container.innerHTML = `
            <div class="loading">
                Belum ada data siswa.
            </div>
        `;

        return;
    }


    students.forEach(
        (student) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "student-card";


            button.innerHTML = `
                <div class="student-avatar">
                    ${escapeHtml(
                        student.avatar ||
                        "👧"
                    )}
                </div>

                <strong>
                    ${escapeHtml(
                        student.name
                    )}
                </strong>

                <small>
                    Kelas ${student.grade}
                </small>
            `;


            button.addEventListener(
                "click",
                () => {

                    selectStudent(
                        student
                    );
                }
            );


            container.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   SELECT STUDENT
========================================================= */

function selectStudent(
    student
) {

    state.selectedStudent =
        student;


    const avatar =
        document.getElementById(
            "selected-student-avatar"
        );

    const name =
        document.getElementById(
            "selected-student-name"
        );

    const grade =
        document.getElementById(
            "selected-student-grade"
        );

    const pinInput =
        document.getElementById(
            "student-pin"
        );


    if (avatar) {

        avatar.textContent =
            student.avatar ||
            "👧";
    }


    if (name) {

        name.textContent =
            student.name;
    }


    if (grade) {

        grade.textContent =
            `Kelas ${student.grade}`;
    }


    if (pinInput) {

        pinInput.value = "";
    }


    clearPinError();


    showView(
        "view-pin"
    );


    setTimeout(
        () => {

            if (pinInput) {
                pinInput.focus();
            }

        },
        100
    );
}


/* =========================================================
   LOGIN STUDENT
========================================================= */

async function loginStudent() {

    /*
     * Cegah double click.
     */
    if (state.loading) {
        return;
    }


    if (!state.selectedStudent) {
        return;
    }


    const pinInput =
        document.getElementById(
            "student-pin"
        );

    const error =
        document.getElementById(
            "pin-error"
        );

    const button =
        document.getElementById(
            "btn-login"
        );


    if (!pinInput) {
        return;
    }


    const pin =
        pinInput.value.trim();


    /*
     * PIN harus 4 digit.
     */
    if (!/^\d{4}$/.test(pin)) {

        if (error) {

            error.textContent =
                "PIN harus terdiri dari 4 angka.";

            error.classList.remove(
                "hidden"
            );
        }

        pinInput.focus();

        return;
    }


    state.loading =
        true;


    if (button) {
        button.disabled = true;
    }


    clearPinError();


    try {

        /*
         * PENTING:
         *
         * Kontrak RPC ini tidak diubah.
         * Gunakan student_id + PIN seperti
         * implementasi database yang sudah
         * berhasil kita tes.
         */
        const {
            data,
            error: rpcError
        } = await supabase.rpc(
            "student_login",
            {
                p_student_id:
                    state.selectedStudent.id,

                p_pin:
                    pin
            }
        );


        /*
         * Error RPC.
         *
         * Error seperti INVALID_PIN dan
         * PIN_TEMPORARILY_LOCKED ditangani
         * oleh showLoginError().
         */
        if (rpcError) {

            showLoginError(
                extractErrorCode(
                    rpcError
                )
            );

            return;
        }


        /*
         * RETURNS TABLE dapat diterima
         * sebagai array oleh Supabase.
         */
        const result =
            Array.isArray(data)
                ? data[0]
                : data;


        /*
         * Login gagal.
         */
        if (!result?.success) {

            showLoginError(
                result?.error_code
            );

            return;
        }


        /*
         * Pastikan session memiliki
         * data yang diperlukan IndexedDB.
         *
         * session_id diperlukan oleh
         * storage.js.
         */
        if (
            !result.session_id ||
            !result.session_token ||
            !result.expires_at
        ) {

            console.error(
                "Invalid session response:",
                result
            );


            if (error) {

                error.textContent =
                    "Session siswa tidak dapat dibuat.";

                error.classList.remove(
                    "hidden"
                );
            }

            return;
        }


        /*
         * Simpan session ke IndexedDB.
         *
         * TIDAK menggunakan localStorage.
         * TIDAK menggunakan window.studentSession.
         */
        await saveSession(
            result
        );


        /*
         * Simpan juga di memory selama
         * halaman sedang berjalan.
         */
        state.session =
            result;


        /*
         * Tampilkan identitas siswa
         * pada halaman beranda.
         */
        updateHomeStudent(
            result
        );


        /*
         * Masuk beranda.
         */
        showView(
            "view-home"
        );


    } catch (err) {

        console.error(
            "loginStudent:",
            err
        );


        if (error) {

            error.textContent =
                "Terjadi masalah saat masuk.";

            error.classList.remove(
                "hidden"
            );
        }


    } finally {

        state.loading =
            false;


        if (button) {
            button.disabled =
                false;
        }
    }
}


/* =========================================================
   LOGIN ERROR
========================================================= */

function showLoginError(
    code
) {

    const error =
        document.getElementById(
            "pin-error"
        );


    if (!error) {
        return;
    }


    const messages = {

        INVALID_PIN:
            "PIN salah. Coba lagi.",

        PIN_TEMPORARILY_LOCKED:
            "PIN terkunci sementara. Coba lagi nanti.",

        STUDENT_NOT_FOUND:
            "Siswa tidak ditemukan.",

        STUDENT_INACTIVE:
            "Akun siswa sedang tidak aktif."

    };


    error.textContent =
        messages[code] ||
        "Tidak dapat masuk.";


    error.classList.remove(
        "hidden"
    );
}


/* =========================================================
   EXTRACT ERROR CODE
========================================================= */

function extractErrorCode(
    error
) {

    const message =
        String(
            error?.message ||
            ""
        );


    /*
     * PostgreSQL exception:
     *
     * INVALID_PIN
     *
     * atau:
     *
     * ERROR: INVALID_PIN
     */
    const knownCodes = [

        "INVALID_PIN",

        "PIN_TEMPORARILY_LOCKED",

        "STUDENT_NOT_FOUND",

        "STUDENT_INACTIVE"

    ];


    for (
        const code of knownCodes
    ) {

        if (
            message.includes(code)
        ) {

            return code;
        }
    }


    return null;
}


/* =========================================================
   RECOVER SESSION
========================================================= */

async function recoverSession() {

    try {

        /*
         * Ambil semua session lokal.
         *
         * Kita belum mengetahui student_id
         * sebelum membaca session, sehingga
         * untuk recovery kita membaca store
         * session secara langsung.
         */
        const sessions =
            await db.sessions.toArray();


        if (!sessions.length) {

            return false;
        }


        /*
         * Ambil session terbaru yang
         * belum melewati expires_at lokal.
         *
         * Ini hanya filter awal.
         * Sumber kebenaran tetap Supabase.
         */
        const now =
            Date.now();


        const activeSessions =
            sessions.filter(
                (session) => {

                    if (
                        !session.expires_at
                    ) {

                        return false;
                    }


                    return (
                        new Date(
                            session.expires_at
                        ).getTime() > now
                    );
                }
            );


        /*
         * Kalau semua session lokal
         * sudah expired, hapus.
         */
        if (!activeSessions.length) {

            await clearAllLocalSessions();

            return false;
        }


        /*
         * Ambil session terbaru.
         */
        activeSessions.sort(
            (a, b) => {

                return (
                    new Date(
                        b.expires_at
                    ).getTime() -
                    new Date(
                        a.expires_at
                    ).getTime()
                );
            }
        );


        const session =
            activeSessions[0];


        /*
         * Simpan ke memory.
         */
        state.session =
            session;


        /*
         * VALIDASI KE SERVER.
         *
         * Browser tidak boleh memutuskan
         * sendiri bahwa session valid.
         */
        const {
            data,
            error
        } = await supabase.rpc(
            "validate_student_session",
            {
                p_session_token:
                    session.session_token
            }
        );


        /*
         * Session server invalid/expired.
         */
        if (error) {

            await handleInvalidRecoveredSession(
                session,
                error
            );

            return false;
        }


        /*
         * validate_student_session()
         * harus mengembalikan identitas
         * siswa yang memiliki token tersebut.
         *
         * Pastikan cocok dengan session
         * yang tersimpan lokal.
         */
        if (
            data !== session.student_id
        ) {

            console.error(
                "Session student mismatch."
            );


            await deleteSession(
                session.session_id
            );


            state.session =
                null;


            return false;
        }


        /*
         * Session valid.
         */
        updateHomeStudent(
            session
        );


        showView(
            "view-home"
        );


        return true;


    } catch (err) {

        console.error(
            "recoverSession:",
            err
        );


        /*
         * Jangan menghapus session hanya
         * karena IndexedDB/network error.
         */
        state.session =
            null;


        return false;
    }
}


/* =========================================================
   INVALID RECOVERED SESSION
========================================================= */

async function handleInvalidRecoveredSession(
    session,
    error
) {

    const code =
        extractSessionErrorCode(
            error
        );


    /*
     * Jika session memang invalid/expired,
     * hapus session lokal.
     */
    if (
        code === "INVALID_SESSION" ||
        code === "SESSION_EXPIRED" ||
        code === "SESSION_NOT_ACTIVE"
    ) {

        try {

            await deleteSession(
                session.session_id
            );

        } catch (deleteError) {

            console.error(
                "deleteSession:",
                deleteError
            );
        }


        state.session =
            null;


        return;
    }


    /*
     * Jika error tidak diketahui,
     * jangan langsung menghapus session.
     */
    console.error(
        "Session validation error:",
        error
    );


    state.session =
        null;
}


/* =========================================================
   SESSION ERROR CODE
========================================================= */

function extractSessionErrorCode(
    error
) {

    const message =
        String(
            error?.message ||
            ""
        );


    const knownCodes = [

        "INVALID_SESSION",

        "SESSION_EXPIRED",

        "SESSION_NOT_ACTIVE"

    ];


    for (
        const code of knownCodes
    ) {

        if (
            message.includes(code)
        ) {

            return code;
        }
    }


    return null;
}


/* =========================================================
   UPDATE HOME STUDENT
========================================================= */

function updateHomeStudent(
    session
) {

    const avatar =
        document.getElementById(
            "home-avatar"
        );


    const name =
        document.getElementById(
            "home-student-name"
        );


    const grade =
        document.getElementById(
            "home-student-grade"
        );


    if (avatar) {

        avatar.textContent =
            session.avatar ||
            state.selectedStudent?.avatar ||
            "👧";
    }


    if (name) {

        name.textContent =
            session.student_name ||
            state.selectedStudent?.name ||
            "";
    }


    if (grade) {

        grade.textContent =
            `Kelas ${
                session.grade ||
                state.selectedStudent?.grade ||
                ""
            }`;
    }
}


/* =========================================================
   LOGOUT / CHANGE STUDENT
========================================================= */

export async function logoutStudent() {

    /*
     * Untuk sekarang kita hanya menghapus
     * session lokal.
     *
     * Revoke server-side akan kita gunakan
     * ketika endpoint logout/session revoke
     * sudah menjadi bagian tahap frontend.
     */
    if (
        state.session?.session_id
    ) {

        try {

            await deleteSession(
                state.session.session_id
            );

        } catch (err) {

            console.error(
                "deleteSession:",
                err
            );
        }
    }


    state.session =
        null;

    state.selectedStudent =
        null;


    const pinInput =
        document.getElementById(
            "student-pin"
        );


    if (pinInput) {
        pinInput.value = "";
    }


    clearPinError();


    showView(
        "view-student-select"
    );


    await loadStudents();
}


/* =========================================================
   CLEAR ALL LOCAL SESSIONS
========================================================= */

async function clearAllLocalSessions() {

    try {

        const sessions =
            await db.sessions.toArray();


        for (
            const session of sessions
        ) {

            if (
                session.session_id
            ) {

                await deleteSession(
                    session.session_id
                );
            }
        }


    } catch (err) {

        console.error(
            "clearAllLocalSessions:",
            err
        );
    }
}


/* =========================================================
   PIN ERROR
========================================================= */

function clearPinError() {

    const error =
        document.getElementById(
            "pin-error"
        );


    if (!error) {
        return;
    }


    error.textContent =
        "";

    error.classList.add(
        "hidden"
    );
}


/* =========================================================
   VIEW
========================================================= */

function showView(
    id
) {

    document
        .querySelectorAll(
            ".view"
        )
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
        document.getElementById(
            id
        );


    if (!target) {

        console.error(
            `View #${id} tidak ditemukan.`
        );

        return;
    }


    target.classList.remove(
        "hidden"
    );


    target.classList.add(
        "active"
    );
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
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
