const db = new Dexie("almascatie_family_learning");

db.version(1).stores({
    sessions: "session_id, student_id, expires_at",
    attempts: "attempt_id, student_id, session_id, status",
    answers: "[attempt_id+question_id], attempt_id, student_id, session_id, status",
    sync_queue: "++id, student_id, session_id, attempt_id, status, created_at"
});

export async function saveSession(session) {
    await db.sessions.put({
        session_id: session.session_id,
        student_id: session.student_id,
        student_name: session.student_name,
        grade: session.grade,
        avatar: session.avatar,
        session_token: session.session_token,
        expires_at: session.expires_at
    });
}

export async function getSession(sessionId) {
    return db.sessions.get(sessionId);
}

export async function getActiveSession(studentId) {

    const sessions =
        await db.sessions
            .where("student_id")
            .equals(studentId)
            .toArray();

    const now = Date.now();

    return sessions.find(
        session =>
            new Date(session.expires_at).getTime() > now
    ) || null;
}

export async function deleteSession(sessionId) {
    await db.sessions.delete(sessionId);
}

export async function clearStudentSessions(studentId) {

    const sessions =
        await db.sessions
            .where("student_id")
            .equals(studentId)
            .toArray();

    await db.sessions.bulkDelete(
        sessions.map(session => session.session_id)
    );
}

export { db };
