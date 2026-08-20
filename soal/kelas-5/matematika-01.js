export default {
  package_id: "k5-matematika-01",
  grade: 5,
  subject: "Matematika",
  title: "Matematika Kelas 5 — Paket 1 (Bab 1 sampai 4)",
  total_questions: 100,
  questions: [

    // =====================================================
    // BAGIAN 1 — SOAL 001–020
    // =====================================================

    {
      id: "k5-math-001",
      version: 1,
      type: "multiple_choice",
      chapter: 1,
      visual: "🔢",
      question: "Bilangan 47.325 dibaca ...",
      options: [
        { text: "empat puluh tujuh ribu tiga ratus dua puluh lima", correct: true },
        { text: "empat puluh tujuh ribu tiga puluh dua lima", correct: false },
        { text: "empat puluh tujuh ribu tiga ratus dua puluh", correct: false },
        { text: "empat ribu tujuh ratus tiga puluh dua puluh lima", correct: false }
      ],
      explanation: "A — Benar. 47.325 dibaca empat puluh tujuh ribu tiga ratus dua puluh lima. B — Salah. Susunan nilai tempat tidak dibaca seperti itu. C — Salah. Bilangan 47.325 memiliki 5 satuan. D — Salah. Angka 47 menunjukkan 47 ribu, bukan 4 ribu 7 ratus.",
      points: 10
    },

    {
      id: "k5-math-002",
      version: 1,
      type: "multiple_choice",
      chapter: 1,
      visual: "🏷️",
      question: "Pada bilangan 63.482, angka 3 menempati tempat ...",
      options: [
        { text: "satuan", correct: false },
        { text: "puluhan", correct: false },
        { text: "ribuan", correct: true },
        { text: "puluh ribuan", correct: false }
      ],
      explanation: "A — Salah. Angka 2 berada pada tempat satuan. B — Salah. Angka 8 berada pada tempat puluhan. C — Benar. Pada 63.482, angka 3 bernilai 3.000 sehingga berada pada tempat ribuan. D — Salah. Angka 6 berada pada tempat puluh ribuan.",
      points: 10
    },

    {
      id: "k5-math-003",
      version: 1,
      type: "multiple_choice",
      chapter: 1,
      visual: "⚖️",
      question: "Bilangan manakah yang lebih besar?",
      options: [
        { text: "45.678", correct: false },
        { text: "45.687", correct: true },
        { text: "45.608", correct: false },
        { text: "45.678", correct: false }
      ],
      explanation: "A — Salah. 45.678 lebih kecil daripada 45.687. B — Benar. Kedua bilangan sama-sama 45 ribuan, tetapi 687 lebih besar daripada 678. C — Salah. 45.608 lebih kecil daripada 45.687. D — Salah. Nilainya sama dengan pilihan A dan tetap lebih kecil.",
      points: 10
    },

    {
      id: "k5-math-004",
      version: 1,
      type: "multiple_choice",
      chapter: 1,
      visual: "🧩",
      question: "Bentuk dekomposisi yang benar dari 58.304 adalah ...",
      options: [
        { text: "50.000 + 8.000 + 300 + 4", correct: true },
        { text: "50.000 + 800 + 30 + 4", correct: false },
        { text: "5.000 + 8.000 + 300 + 4", correct: false },
        { text: "50.000 + 8.000 + 30 + 4", correct: false }
      ],
      explanation: "A — Benar. 58.304 terdiri dari 50.000 + 8.000 + 300 + 4. B — Salah. Angka 8 berada pada ribuan, bukan ratusan. C — Salah. Angka 5 berada pada puluh ribuan sehingga nilainya 50.000. D — Salah. Angka 3 berada pada ratusan sehingga nilainya 300.",
      points: 10
    },

    {
      id: "k5-math-005",
      version: 1,
      type: "multiple_choice",
      chapter: 1,
      visual: "🧮",
      question: "Hasil dari 24.560 + 13.275 adalah ...",
      options: [
        { text: "37.735", correct: false },
        { text: "37.835", correct: true },
        { text: "38.735", correct: false },
        { text: "36.835", correct: false }
      ],
      explanation: "A — Salah. Penjumlahan satuan, puluhan, dan ratusan harus diperhatikan. B — Benar. 24.560 + 13.275 = 37.835. C — Salah. Hasil penjumlahan tidak mencapai 38.735. D — Salah. Hasil sebenarnya 37.835.",
      points: 10
    },

    {
      id: "k5-math-006",
      version: 1,
      type: "multiple_choice",
      chapter: 2,
      visual: "🔁",
      question: "Kelipatan dari 6 yang benar adalah ...",
      options: [
        { text: "6, 12, 18, 24", correct: true },
        { text: "6, 11, 17, 23", correct: false },
        { text: "6, 13, 19, 25", correct: false },
        { text: "6, 10, 16, 22", correct: false }
      ],
      explanation: "A — Benar. Kelipatan 6 diperoleh dengan mengalikan 6 dengan bilangan cacah positif: 6, 12, 18, 24, dan seterusnya. B — Salah. 11 bukan kelipatan 6. C — Salah. 13 bukan kelipatan 6. D — Salah. 10 bukan kelipatan 6.",
      points: 10
    },

    {
      id: "k5-math-007",
      version: 1,
      type: "multiple_choice",
      chapter: 2,
      visual: "🔗",
      question: "Kelipatan persekutuan dari 4 dan 6 yang paling kecil adalah ...",
      options: [
        { text: "8", correct: false },
        { text: "10", correct: false },
        { text: "12", correct: true },
        { text: "24", correct: false }
      ],
      explanation: "A — Salah. 8 merupakan kelipatan 4, tetapi bukan kelipatan 6. B — Salah. 10 bukan kelipatan 4 maupun 6. C — Benar. 12 merupakan kelipatan 4 dan 6 sekaligus, dan merupakan yang paling kecil. D — Salah. 24 juga merupakan kelipatan persekutuan, tetapi bukan yang terkecil.",
      points: 10
    },

    {
      id: "k5-math-008",
      version: 1,
      type: "multiple_choice",
      chapter: 2,
      visual: "🔍",
      question: "Manakah yang merupakan faktor dari 24?",
      options: [
        { text: "5", correct: false },
        { text: "7", correct: false },
        { text: "8", correct: true },
        { text: "10", correct: false }
      ],
      explanation: "A — Salah. 24 tidak habis dibagi 5. B — Salah. 24 tidak habis dibagi 7. C — Benar. 24 ÷ 8 = 3 sehingga 8 merupakan faktor 24. D — Salah. 24 tidak habis dibagi 10.",
      points: 10
    },

    {
      id: "k5-math-009",
      version: 1,
      type: "multiple_choice",
      chapter: 2,
      visual: "🎯",
      question: "FPB dari 12 dan 18 adalah ...",
      options: [
        { text: "2", correct: false },
        { text: "3", correct: false },
        { text: "6", correct: true },
        { text: "9", correct: false }
      ],
      explanation: "A — Salah. 2 memang faktor persekutuan, tetapi bukan yang terbesar. B — Salah. 3 juga faktor persekutuan, tetapi masih lebih kecil dari 6. C — Benar. Faktor persekutuan terbesar dari 12 dan 18 adalah 6. D — Salah. 9 bukan faktor dari 12.",
      points: 10
    },

    {
      id: "k5-math-010",
      version: 1,
      type: "multiple_choice",
      chapter: 2,
      visual: "💡",
      question: "Manakah yang merupakan bilangan prima?",
      options: [
        { text: "21", correct: false },
        { text: "25", correct: false },
        { text: "29", correct: true },
        { text: "35", correct: false }
      ],
      explanation: "A — Salah. 21 dapat dibagi 3 dan 7. B — Salah. 25 dapat dibagi 5. C — Benar. 29 hanya memiliki faktor 1 dan 29. D — Salah. 35 dapat dibagi 5 dan 7.",
      points: 10
    },

    {
      id: "k5-math-011",
      version: 1,
      type: "multiple_choice",
      chapter: 3,
      visual: "🍕",
      question: "Pecahan manakah yang lebih besar?",
      options: [
        { text: "1/4", correct: false },
        { text: "2/4", correct: true },
        { text: "1/4", correct: false },
        { text: "1/8", correct: false }
      ],
      explanation: "A — Salah. 1/4 lebih kecil daripada 2/4. B — Benar. Dengan penyebut sama, pembilang 2 lebih besar daripada 1 sehingga 2/4 lebih besar. C — Salah. Nilainya sama dengan pilihan A. D — Salah. 1/8 lebih kecil daripada 2/4.",
      points: 10
    },

    {
      id: "k5-math-012",
      version: 1,
      type: "multiple_choice",
      chapter: 3,
      visual: "📏",
      question: "Urutan pecahan dari yang terkecil adalah ...",
      options: [
        { text: "3/4, 1/4, 2/4", correct: false },
        { text: "1/4, 2/4, 3/4", correct: true },
        { text: "2/4, 1/4, 3/4", correct: false },
        { text: "3/4, 2/4, 1/4", correct: false }
      ],
      explanation: "A — Salah. Urutan tersebut dimulai dari pecahan terbesar. B — Benar. Dengan penyebut sama, 1/4 < 2/4 < 3/4. C — Salah. 1/4 lebih kecil daripada 2/4 sehingga harus berada lebih dahulu. D — Salah. Urutan tersebut dari terbesar ke terkecil.",
      points: 10
    },

    {
      id: "k5-math-013",
      version: 1,
      type: "multiple_choice",
      chapter: 3,
      visual: "➕",
      question: "Hasil dari 2/5 + 1/5 adalah ...",
      options: [
        { text: "1/5", correct: false },
        { text: "2/5", correct: false },
        { text: "3/5", correct: true },
        { text: "3/10", correct: false }
      ],
      explanation: "A — Salah. Pembilang 2 dan 1 dijumlahkan sehingga bukan 1. B — Salah. 2/5 adalah salah satu pecahan awal, bukan hasil penjumlahan. C — Benar. Karena penyebut sama, 2/5 + 1/5 = 3/5. D — Salah. Penyebut tidak perlu dijumlahkan.",
      points: 10
    },

    {
      id: "k5-math-014",
      version: 1,
      type: "multiple_choice",
      chapter: 3,
      visual: "➖",
      question: "Hasil dari 7/8 − 3/8 adalah ...",
      options: [
        { text: "3/8", correct: false },
        { text: "4/8", correct: true },
        { text: "5/8", correct: false },
        { text: "4/16", correct: false }
      ],
      explanation: "A — Salah. Pembilang yang dikurangi adalah 7 − 3 = 4. B — Benar. 7/8 − 3/8 = 4/8. C — Salah. 5/8 bukan hasil pengurangan tersebut. D — Salah. Penyebut tetap 8 karena penyebut kedua pecahan sama.",
      points: 10
    },

    {
      id: "k5-math-015",
      version: 1,
      type: "multiple_choice",
      chapter: 3,
      visual: "🥛",
      question: "Siti minum 1/4 liter susu pagi hari dan 2/4 liter siang hari. Jumlah susu yang diminum adalah ...",
      options: [
        { text: "1/4 liter", correct: false },
        { text: "2/4 liter", correct: false },
        { text: "3/4 liter", correct: true },
        { text: "3/8 liter", correct: false }
      ],
      explanation: "A — Salah. 1/4 hanya jumlah susu pada pagi hari. B — Salah. 2/4 hanya jumlah susu pada siang hari. C — Benar. 1/4 + 2/4 = 3/4 liter. D — Salah. Penyebut tetap 4 karena kedua pecahan memiliki penyebut sama.",
      points: 10
    },

    {
      id: "k5-math-016",
      version: 1,
      type: "multiple_choice",
      chapter: 4,
      visual: "📐",
      question: "Keliling bangun datar adalah ...",
      options: [
        { text: "luas bagian dalam bangun", correct: false },
        { text: "jumlah panjang seluruh sisi bangun", correct: true },
        { text: "panjang salah satu sisi bangun", correct: false },
        { text: "jumlah panjang dan lebar saja", correct: false }
      ],
      explanation: "A — Salah. Luas berkaitan dengan daerah di dalam bangun. B — Benar. Keliling diperoleh dengan menjumlahkan seluruh panjang sisi yang mengelilingi bangun. C — Salah. Keliling tidak hanya menggunakan satu sisi. D — Salah. Cara ini hanya bagian dari perhitungan keliling pada bentuk tertentu.",
      points: 10
    },

    {
      id: "k5-math-017",
      version: 1,
      type: "multiple_choice",
      chapter: 4,
      visual: "🔺",
      question: "Sebuah segitiga memiliki sisi 6 cm, 7 cm, dan 8 cm. Kelilingnya adalah ...",
      options: [
        { text: "19 cm", correct: false },
        { text: "20 cm", correct: false },
        { text: "21 cm", correct: true },
        { text: "22 cm", correct: false }
      ],
      explanation: "A — Salah. 6 + 7 + 8 bukan 19. B — Salah. Jumlah ketiga sisi adalah 21. C — Benar. Keliling = 6 + 7 + 8 = 21 cm. D — Salah. Hasil penjumlahan sisi tidak mencapai 22 cm.",
      points: 10
    },

    {
      id: "k5-math-018",
      version: 1,
      type: "multiple_choice",
      chapter: 4,
      visual: "⬛",
      question: "Sebuah persegi memiliki panjang sisi 9 cm. Kelilingnya adalah ...",
      options: [
        { text: "18 cm", correct: false },
        { text: "27 cm", correct: false },
        { text: "36 cm", correct: true },
        { text: "81 cm", correct: false }
      ],
      explanation: "A — Salah. 18 cm hanya dua kali panjang sisi. B — Salah. Keliling persegi menggunakan empat sisi. C — Benar. 4 × 9 = 36 cm. D — Salah. 81 merupakan hasil 9 × 9, bukan keliling.",
      points: 10
    },

    {
      id: "k5-math-019",
      version: 1,
      type: "multiple_choice",
      chapter: 4,
      visual: "▭",
      question: "Persegi panjang memiliki panjang 12 cm dan lebar 5 cm. Kelilingnya adalah ...",
      options: [
        { text: "17 cm", correct: false },
        { text: "24 cm", correct: false },
        { text: "34 cm", correct: true },
        { text: "60 cm", correct: false }
      ],
      explanation: "A — Salah. 12 + 5 = 17 baru menjumlahkan panjang dan lebar sekali. B — Salah. Keliling memerlukan dua kali panjang dan dua kali lebar. C — Benar. Keliling = 2 × (12 + 5) = 34 cm. D — Salah. 12 × 5 adalah perkalian panjang dan lebar, bukan keliling.",
      points: 10
    },

    {
      id: "k5-math-020",
      version: 1,
      type: "multiple_choice",
      chapter: 4,
      visual: "🔷",
      question: "Sebuah belah ketupat mempunyai empat sisi yang masing-masing panjangnya 7 cm. Kelilingnya adalah ...",
      options: [
        { text: "14 cm", correct: false },
        { text: "21 cm", correct: false },
        { text: "28 cm", correct: true },
        { text: "49 cm", correct: false }
      ],
      explanation: "A — Salah. 14 cm hanya dua sisi. B — Salah. Belah ketupat memiliki empat sisi. C — Benar. 4 × 7 = 28 cm. D — Salah. 7 × 7 = 49 bukan rumus keliling.",
      points: 10
    },
]
};
