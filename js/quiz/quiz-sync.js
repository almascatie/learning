import { supabase } from "../supabase.js";
import { db } from "../storage.js";

export async function getActiveSession() {
    try {
        const sessions = await db.sessions.toArray();
        const now = Date.now();
        return sessions.find(session => new Date(session.expires_at).getTime() > now) || null;
    } catch (err) {
        console.error("Gagal mengambil sesi lokal:", err);
        return null;
    }
}

export async function getActiveSessionToken() {
    const session = await getActiveSession();
    return session ? session.session_token : null;
}

export async function saveStudentAnswer(sessionToken, attemptId, questionObj, optionIndex, selectedOpt, isCorrect, pointsEarned) {
    const { error } = await supabase.rpc("save_student_answer", {
        p_session_token: sessionToken,
        p_attempt_id: attemptId,
        p_question_id: questionObj.id,
        p_question_version: questionObj.version || 1,
        p_selected_answer: {
            selected_index: optionIndex,
            text: selectedOpt.text
        },
        p_is_correct: isCorrect,
        p_points: pointsEarned
    });

    if (error) throw error;
}

export async function completeStudentAttempt(sessionToken, attemptId) {
    const { data, error } = await supabase.rpc("complete_student_attempt", {
        p_session_token: sessionToken,
        p_attempt_id: attemptId
    });

    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
}

export async function startStudentAttempt(sessionToken, packageId, totalQuestions) {
    const { data, error } = await supabase.rpc("start_student_attempt", {
        p_session_token: sessionToken,
        p_package_id: packageId,
        p_total_questions: totalQuestions
    });

    if (error) throw error;
    return data;
}
