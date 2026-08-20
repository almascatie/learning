import { openQuizPackages } from "./quiz/quiz.js";
import { openStemPackages } from "./stem/stem.js";

export function openActivity(type, grade) {
    const studentGrade = Number(grade);

    if (!studentGrade) {
        console.error("Grade siswa tidak ditemukan.");
        return;
    }

    switch (type) {
        case "quiz":
            return openQuizPackages(studentGrade);
        case "stem":
            return openStemPackages(studentGrade);
        case "timed":
            console.log("Tantangan Waktu belum tersedia.");
            return;
        default:
            console.error("Aktivitas tidak dikenal:", type);
    }
}
