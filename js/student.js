import { supabase } from "./supabase.js";

const state = {
    selectedStudent: null
};

export function initStudentApp() {
    bindEvents();
    showView("view-student-select");

    loadStudents();
}


/* ================================
   EVENTS
================================ */

function bindEvents() {

    document
        .getElementById("btn-back-student")
        .addEventListener("click", () => {
            state.selectedStudent = null;

            document
                .getElementById("student-pin")
                .value = "";

            showView("view-student-select");
        });


    document
        .getElementById("btn-login")
        .addEventListener("click", loginStudent);


    document
        .getElementById("student-pin")
        .addEventListener("keydown", (event) => {

            if (event.key === "Enter") {
                loginStudent();
            }

        });


    document
        .querySelectorAll("[data-activity]")
        .forEach((button) => {

            button.addEventListener("click", () => {

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

            });

        });
}


/* ================================
   LOAD STUDENTS
================================ */

async function loadStudents() {

    const container =
        document.getElementById("student-list");

    const error =
        document.getElementById("student-error");

    try {

        const {
            data,
            error: rpcError
        } = await supabase.rpc(
            "get_active_students"
        );

        if (rpcError) {
            throw rpcError;
        }

        renderStudents(data || []);

    } catch (err) {

        console.error(
            "get_active_students:",
            err
        );

        container.innerHTML = "";

        error.textContent =
            "Data siswa tidak dapat dimuat.";

        error.classList.remove("hidden");
    }
}

/* ================================
   RENDER STUDENTS
================================ */

function renderStudents(students) {

    const container =
        document.getElementById("student-list");

    container.innerHTML = "";

    if (!students.length) {

        container.innerHTML = `
            <div class="loading">
                Belum ada data siswa.
            </div>
        `;

        return;
    }


    students.forEach((student) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className = "student-card";

        button.innerHTML = `
            <div class="student-avatar">
                ${student.avatar || "👧"}
            </div>

            <strong>
                ${escapeHtml(student.name)}
            </strong>

            <small>
                Kelas ${student.grade}
            </small>
        `;

        button.addEventListener(
            "click",
            () => selectStudent(student)
        );

        container.appendChild(button);

    });
}


/* ================================
   SELECT STUDENT
================================ */

function selectStudent(student) {

    state.selectedStudent = student;

    document
        .getElementById("selected-student-avatar")
        .textContent = student.avatar || "👧";

    document
        .getElementById("selected-student-name")
        .textContent = student.name;

    document
        .getElementById("selected-student-grade")
        .textContent = `Kelas ${student.grade}`;

    document
        .getElementById("student-pin")
        .value = "";

    document
        .getElementById("pin-error")
        .classList.add("hidden");

    showView("view-pin");

    setTimeout(() => {
        document
            .getElementById("student-pin")
            .focus();
    }, 100);
}


/* ================================
   LOGIN
================================ */

async function loginStudent() {

    if (!state.selectedStudent) {
        return;
    }

    const pinInput =
        document.getElementById("student-pin");

    const error =
        document.getElementById("pin-error");

    const pin =
        pinInput.value.trim();


    if (!/^\d{4}$/.test(pin)) {

        error.textContent =
            "PIN harus terdiri dari 4 angka.";

        error.classList.remove("hidden");

        return;
    }


    const button =
        document.getElementById("btn-login");

    button.disabled = true;

    error.classList.add("hidden");


    try {

        const { data, error: rpcError } =
            await supabase.rpc(
                "student_login",
                {
                    p_student_id:
                        state.selectedStudent.id,

                    p_pin: pin
                }
            );


        if (rpcError) {
            throw rpcError;
        }


        const result =
            Array.isArray(data)
                ? data[0]
                : data;


        if (!result?.success) {

            showLoginError(
                result?.error_code
            );

            return;
        }


        /*
         * Session siswa disimpan oleh
         * modul session/storage pada tahap berikutnya.
         *
         * Jangan menggunakan localStorage.
         */

        window.studentSession = result;

        document
            .getElementById("home-avatar")
            .textContent =
                result.avatar ||
                state.selectedStudent.avatar ||
                "👧";

        document
            .getElementById("home-student-name")
            .textContent =
                result.student_name ||
                state.selectedStudent.name;

        document
            .getElementById("home-student-grade")
            .textContent =
                `Kelas ${
                    result.grade ||
                    state.selectedStudent.grade
                }`;

        showView("view-home");


    } catch (err) {

        console.error(err);

        error.textContent =
            "Terjadi masalah saat masuk.";

        error.classList.remove("hidden");

    } finally {

        button.disabled = false;

    }
}


/* ================================
   LOGIN ERROR
================================ */

function showLoginError(code) {

    const error =
        document.getElementById("pin-error");

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

    error.classList.remove("hidden");
}


/* ================================
   VIEW
================================ */

function showView(id) {

    document
        .querySelectorAll(".view")
        .forEach((view) => {

            view.classList.add("hidden");
            view.classList.remove("active");

        });


    const target =
        document.getElementById(id);

    target.classList.remove("hidden");
    target.classList.add("active");
}


/* ================================
   ESCAPE HTML
================================ */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
