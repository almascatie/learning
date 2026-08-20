import { db } from "../storage.js";

export async function saveQuizProgress(session, state) {
    if (!session || !state.attemptId || !state.packageId) return;

    await db.quiz_progress.put({
        student_id: session.student_id,
        session_id: session.session_id,
        package_id: state.packageId,
        attempt_id: state.attemptId,
        currentIndex: state.currentIndex,
        correctCount: state.correctCount,
        wrongCount: state.wrongCount,
        questionsLength: state.questions.length,
        updated_at: new Date().toISOString()
    });
}

export async function getQuizProgress(session, packageId, questionsLength) {
    if (!session) return null;

    try {
        const progress = await db.quiz_progress.get([
            session.student_id,
            session.session_id,
            packageId
        ]);

        if (!progress) return null;

        if (
            progress.package_id !== packageId ||
            progress.questionsLength !== questionsLength ||
            !progress.attempt_id
        ) {
            await clearQuizProgress(session, packageId);
            return null;
        }

        return progress;
    } catch (err) {
        console.error("Gagal membaca progress kuis:", err);
        return null;
    }
}

export async function clearQuizProgress(session, packageId) {
    if (!session) return;

    try {
        await db.quiz_progress.delete([
            session.student_id,
            session.session_id,
            packageId
        ]);
    } catch (err) {
        console.error("Gagal menghapus progress kuis:", err);
    }
}
