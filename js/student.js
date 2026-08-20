import { supabase } from "./supabase.js";
import { db, saveSession, deleteSession } from "./storage.js";
import { openQuizPackages } from "./quiz/quiz.js";

const state = {
    selectedStudent: null,
    sessionId: null
};

export async function initStudentApp() {
    bindEvents();
    const recovered = await recoverSession();
    if (recovered) return;
    showView("view-student-select");
    loadStudents();
}

/* ================================
   SESSION RECOVERY
================================ */
async function recoverSession() {
    try {
        const sessions = await db.sessions.toArray();
        if (!sessions.length) return false;

        const now = Date.now();
        const session = sessions.find(item => new Date(item.expires_at).getTime() > now);
        if (!session) return false;

        const { data, error } = await supabase.rpc("validate_student_session", {
            p_session_token: session.session_token
        });

        if (error || !data) return false;

        state.sessionId = session.session_id;

        // Pulihkan siswa aktif agar tombol Kuis tetap mengetahui grade.
        state.selectedStudent = {
            id: session.student_id,
            name: session.student_name,
            grade: session.grade,
            avatar: session.avatar || "👧"
        };

        document.getElementById("home-avatar").textContent = session.avatar || "👧";
        document.getElementById("home-student-name").textContent = session.student_name;
        document.getElementById("home-student-grade").textContent = `Kelas ${session.grade}`;

        showView("view-home");
        return true;
    } catch (err) {
        console.error("Session recovery error:", err);
        return false;
    }
}

/* ================================
   EVENTS
================================ */
function bindEvents() {
    document.getElementById("btn-back-student").addEventListener("click", () => {
        state.selectedStudent = null;
        document.getElementById("student-pin").value = "";
        showView("view-student-select");
    });

    document.getElementById("btn-login").addEventListener("click", loginStudent);

    document.getElementById("btn-logout").addEventListener("click", logoutStudent);

    document.getElementById("btn-back-home").addEventListener("click", () => {
        showView("view-home");
    });

    document.getElementById("student-pin").addEventListener("keydown", event => {
        if (event.key === "Enter") loginStudent();
    });

    document.querySelectorAll("[data-activity]").forEach(button => {
        button.addEventListener("click", () => {
            const activity = button.dataset.activity;

            if (activity === "quiz") {
                const grade = state.selectedStudent?.grade;

                if (!grade) {
                    console.error("Grade siswa tidak ditemukan.");
                    return;
                }

                openQuizPackages(grade);
                return;
            }

            console.log("Activity selected:", activity);
        });
    });
}

/* ================================
   LOAD STUDENTS
================================ */
async function loadStudents() {
    const container = document.getElementById("student-list");
    const error = document.getElementById("student-error");

    try {
        const { data, error: rpcError } = await supabase.rpc("get_active_students");

        if (rpcError) throw rpcError;

        renderStudents(data || []);
    } catch (err) {
        console.error("get_active_students:", err);
        container.innerHTML = "";
        error.textContent = "Data siswa tidak dapat dimuat.";
        error.classList.remove("hidden");
    }
}

/* ================================
   RENDER STUDENTS
================================ */
function renderStudents(students) {
    const container = document.getElementById("student-list");
    container.innerHTML = "";

    if (!students.length) {
        container.innerHTML = `<div class="loading">Belum ada data siswa.</div>`;
        return;
    }

    students.forEach(student => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "student-card";

        button.innerHTML = `
            <div class="student-avatar">${student.avatar || "👧"}</div>
            <strong>${escapeHtml(student.name)}</strong>
            <small>Kelas ${student.grade}</small>
        `;

        button.addEventListener("click", () => selectStudent(student));
        container.appendChild(button);
    });
}

/* ================================
   SELECT STUDENT
================================ */
function selectStudent(student) {
    state.selectedStudent = student;

    document.getElementById("selected-student-avatar").textContent = student.avatar || "👧";
    document.getElementById("selected-student-name").textContent = student.name;
    document.getElementById("selected-student-grade").textContent = `Kelas ${student.grade}`;
    document.getElementById("student-pin").value = "";
    document.getElementById("pin-error").classList.add("hidden");

    showView("view-pin");

    setTimeout(() => {
        document.getElementById("student-pin").focus();
    }, 100);
}

/* ================================
   LOGIN
================================ */
async function loginStudent() {
    if (!state.selectedStudent) return;

    const pinInput = document.getElementById("student-pin");
    const error = document.getElementById("pin-error");
    const pin = pinInput.value.trim();

    if (!/^\d{4}$/.test(pin)) {
        error.textContent = "PIN harus terdiri dari 4 angka.";
        error.classList.remove("hidden");
        return;
    }

    const button = document.getElementById("btn-login");
    button.disabled = true;
    error.classList.add("hidden");

    try {
        const { data, error: rpcError } = await supabase.rpc("student_login", {
            p_student_id: state.selectedStudent.id,
            p_pin: pin
        });

        if (rpcError) throw rpcError;

        const result = Array.isArray(data) ? data[0] : data;

        if (!result) {
            showLoginError("INVALID_PIN");
            return;
        }

        await saveSession(result);

        state.sessionId = result.session_id;

        // Pastikan state siswa tetap lengkap setelah login.
        state.selectedStudent = {
            id: result.student_id || state.selectedStudent.id,
            name: result.student_name || state.selectedStudent.name,
            grade: result.grade || state.selectedStudent.grade,
            avatar: result.avatar || state.selectedStudent.avatar || "👧"
        };

        document.getElementById("home-avatar").textContent = state.selectedStudent.avatar;
        document.getElementById("home-student-name").textContent = state.selectedStudent.name;
        document.getElementById("home-student-grade").textContent = `Kelas ${state.selectedStudent.grade}`;

        showView("view-home");
    } catch (err) {
        console.error("Login error:", err);

        let errorCode = "INVALID_PIN";
        const message = err.message || "";

        if (message.includes("PIN_TEMPORARILY_LOCKED")) {
            errorCode = "PIN_TEMPORARILY_LOCKED";
        } else if (message.includes("STUDENT_NOT_FOUND")) {
            errorCode = "STUDENT_NOT_FOUND";
        } else if (message.includes("STUDENT_INACTIVE")) {
            errorCode = "STUDENT_INACTIVE";
        }

        showLoginError(errorCode);
    } finally {
        button.disabled = false;
    }
}

/* ================================
   LOGOUT
================================ */
async function logoutStudent() {
    try {
        if (state.sessionId) {
            await deleteSession(state.sessionId);
        }

        state.selectedStudent = null;
        state.sessionId = null;

        document.getElementById("student-pin").value = "";

        showView("view-student-select");
        await loadStudents();
    } catch (err) {
        console.error("Logout error:", err);
    }
}

/* ================================
   LOGIN ERROR
================================ */
function showLoginError(code) {
    const error = document.getElementById("pin-error");

    const messages = {
        INVALID_PIN: "PIN salah. Coba lagi.",
        PIN_TEMPORARILY_LOCKED: "PIN terkunci sementara. Coba lagi nanti.",
        STUDENT_NOT_FOUND: "Siswa tidak ditemukan.",
        STUDENT_INACTIVE: "Akun siswa sedang tidak aktif."
    };

    error.textContent = messages[code] || "Tidak dapat masuk.";
    error.classList.remove("hidden");
}

/* ================================
   VIEW
================================ */
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
