Baik! Berikut rangkuman lengkap seluruh percakapan:

---

# AI_CONTEXT.md

## Rangkuman Konteks Penelitian Skripsi

---

## 1. IDENTITAS PENELITIAN

```
Nama       : Muhammad Nurfaiz Alfian Ikhsan
NIM        : 23201223
Program    : Teknik Informatika
Institusi  : Institut Teknologi dan Bisnis Asia Malang
Judul Final: "Analisis Optimasi Random Forest dengan SMOTE
              dan GridSearchCV untuk Identifikasi Risiko
              Depresi Mahasiswa Berdasarkan Faktor Demografis"
Tema       : Data Mining
```

---

## 2. LATAR BELAKANG PENELITIAN

### 2.1 Research Gap

```
GAP 1 — Teknik:
  Utami & Kurniawan (2026) → GridSearchCV ✅ tapi tanpa SMOTE ❌
  Oktaviani dkk. (2024)   → SMOTE ✅ tapi tanpa GridSearchCV ❌
  Belum ada yang menggabungkan keduanya dalam Pipeline yang benar

GAP 2 — Dataset:
  Utami & Kurniawan (2026) → 1 instrumen (status depresi biner)
  Oktaviani dkk. (2024)   → 1 instrumen PSS-14 (258 responden)
  Penelitian ini           → 3 instrumen + demografis (2.022 data)
```

### 2.2 Kontribusi Penelitian

```
1. Integrasi SMOTE + GridSearchCV dalam Pipeline yang benar
2. Dataset MHP dengan 3 instrumen psikometri tervalidasi
3. Analisis komparatif 4 skenario yang sistematis
4. Feature importance untuk identifikasi prediktor dominan
```

---

## 3. DATASET

### 3.1 Informasi Dataset

```
Nama    : Mental Health Problems (MHP) University Students
Sumber  : Figshare — Syeed dkk. (2024)
DOI     : 10.6084/m9.figshare.25771164.v1
Baris   : 2.028 → 2.022 (setelah hapus 6 duplikat)
Kolom   : 39 kolom total
Status  : Publik, belum pernah digunakan untuk ML sebelumnya
Populasi: 15 universitas terkemuka di Bangladesh
```

### 3.2 Struktur Kolom Dataset

```
DEMOGRAFIS (7 kolom):
  Age, Gender, University, Department,
  Academic_Year, Current_CGPA, waiver_or_scholarship

PSS-10 (12 kolom):
  PSS1–PSS10 (item), Stress Value (total), Stress Label

GAD-7 (9 kolom):
  GAD1–GAD7 (item), Anxiety Value (total), Anxiety Label

PHQ-9 (11 kolom):
  PHQ1–PHQ9 (item), Depression Value (total), Depression Label
```

### 3.3 Label Target

```
Variabel Target: Depression Label (dari PHQ-9)

Mapping 5 kelas → 3 kelas:
  No Depression + Minimal + Mild → 0 (Rendah)
  Moderate Depression            → 1 (Sedang)
  Moderately Severe + Severe     → 2 (Tinggi)

Distribusi Setelah Mapping:
  Rendah : 552  (27.3%)
  Sedang : 455  (22.5%)
  Tinggi : 1015 (50.2%)
  Rasio ketidakseimbangan: 2.03:1 → butuh SMOTE
```

### 3.4 Kolom yang Dihapus

```
DIHAPUS — Data Leakage:
  Depression Value = PHQ1+...+PHQ9 (langsung ke target)
  Stress Value     = PSS1+...+PSS10
  Anxiety Value    = GAD1+...+GAD7

DIHAPUS — Redundan/Label Pembentuk:
  Anxiety Label  (turunan GAD, bukan fitur murni)
  Stress Label   (turunan PSS, bukan fitur murni)
  Depression Label → dijadikan TARGET bukan fitur
```

### 3.5 Fitur yang Digunakan

```
Total: 33 fitur
  PSS1–PSS10  : 10 fitur (stres)
  GAD1–GAD7   :  7 fitur (kecemasan)
  PHQ1–PHQ9   :  9 fitur (depresi)
  Demografis  :  7 fitur (Age_enc, Gender_enc, University_enc,
                          Department_enc, Academic_Year_enc,
                          Current_CGPA_enc, waiver_or_scholarship_enc)
```

---

## 4. METODOLOGI

### 4.1 Kerangka: CRISP-DM (6 Tahap)

```
1. Business Understanding
2. Data Understanding → EDA
3. Data Preparation   → Preprocessing
4. Modeling           → 4 Skenario RF
5. Evaluation         → F1 Macro, Accuracy, AUC-ROC
6. Deployment         → Laporan ilmiah
```

### 4.2 Preprocessing

```
Langkah:
1. Hapus 6 duplikat (2.028 → 2.022)
2. Mapping Depression Label 5 kelas → 3 kelas
3. Hapus kolom leakage (Score_Cols + Anxiety/Stress Label)
4. Label Encoding 7 fitur demografis (bukan One-Hot)
   Alasan: RF tidak sensitif urutan, hindari curse of dimensionality
5. Min-Max Scaling (0-1) untuk semua 33 fitur
6. Stratified Split 80:20
   Train: 1.617 (Rendah=441, Sedang=364, Tinggi=812)
   Test : 405   (Rendah=111, Sedang=91,  Tinggi=203)
```

### 4.3 Desain 4 Skenario

```
S1: RF Baseline
    → Tanpa SMOTE, parameter default (n=100)
    → Fungsi: benchmark/titik acuan

S2: RF + GridSearchCV
    → Tanpa SMOTE, hyperparameter dioptimasi
    → Fungsi: ukur pengaruh GridSearch saja

S3: RF + SMOTE  ← SKENARIO TERBAIK
    → Dengan SMOTE, parameter default
    → Fungsi: ukur pengaruh SMOTE saja

S4: RF + SMOTE + GridSearchCV
    → Dengan SMOTE dalam Pipeline + GridSearch
    → Fungsi: ukur pengaruh kombinasi
```

### 4.4 Parameter GridSearchCV

```
n_estimators     : [100, 200, 300]
max_depth        : [None, 10, 20, 30]
min_samples_split: [2, 5, 10]
max_features     : ['sqrt', 'log2']
class_weight     : [None, 'balanced']
Total kombinasi  : 144 kombinasi × 5-Fold = 720 fits
Scoring          : f1_macro (adil untuk imbalanced data)
```

### 4.5 Alasan Pipeline SMOTE dalam CV

```
SALAH (SMOTE di luar Pipeline):
  → Data sintetis bocor ke data validasi CV
  → CV score terlalu optimis (terbukti: 99.76% vs 93.80%)
  → Data leakage

BENAR (SMOTE dalam ImbPipeline):
  → SMOTE hanya pada data latih setiap fold
  → Data validasi tetap murni data asli
  → CV score valid dan dapat dipercaya
```

---

## 5. HASIL EKSPERIMEN

### 5.1 Ringkasan 4 Skenario

```
Skenario              F1 Macro  Accuracy  AUC-ROC   Waktu
───────────────────────────────────────────────────────────
S1: Baseline           90.90%    92.35%   98.75%    0.3s
S2: +GridSearchCV      90.34%    91.85%   98.69%  371.2s
S3: +SMOTE ★           91.32%    92.59%   98.66%    0.7s
S4: +SMOTE+GridSearch  90.44%    91.85%   98.80%  589.0s
───────────────────────────────────────────────────────────
★ = Skenario Terbaik
```

### 5.2 Best Params GridSearchCV

```
S2 Best Params:
  class_weight=balanced, max_depth=None,
  max_features=sqrt, min_samples_split=2,
  n_estimators=300
  CV F1 Macro: 89.29%

S4 Best Params:
  rf__class_weight=None, rf__max_depth=20,
  rf__max_features=sqrt, rf__min_samples_split=5,
  rf__n_estimators=300
  CV F1 Macro: 89.11%
```

### 5.3 Tabel Metrik Lengkap

```
Metrik              S1 Base  S2+Grid  S3+SMOTE  S4+S+G
──────────────────────────────────────────────────────
Accuracy             92.35%   91.85%  →92.59%   91.85%
Precision Weighted   92.26%   91.82%  →92.72%   91.97%
Recall Weighted      92.35%   91.85%  →92.59%   91.85%
F1 Weighted          92.21%   91.74%  →92.62%   91.84%
Precision Macro     →91.97%   91.43%   91.70%   91.24%
Recall Macro         90.05%   89.45%  →91.02%   89.78%
F1 Macro ← UTAMA    90.90%   90.34%  →91.32%   90.44%
AUC-ROC Macro        98.75%   98.69%   98.66%  →98.80%
```

### 5.4 Classification Report Skenario Terbaik (S3)

```
              Precision  Recall  F1     Support
Rendah         0.949     0.919   0.949    111
Sedang         0.830     0.849   0.837     91
Tinggi         0.938     0.966   0.954    203
───────────────────────────────────────────────
Accuracy                         0.926    405
Macro avg      0.917     0.911   0.913    405
Weighted avg   0.926     0.926   0.926    405
```

### 5.5 F1-Score Per Kelas Semua Skenario

```
Skenario           F1 Rendah  F1 Sedang  F1 Tinggi
────────────────────────────────────────────────────
S1: Baseline         0.959      0.821      0.947
S2: +GridSearchCV    0.954      0.811      0.945
S3: +SMOTE ★         0.949      0.837      0.954
S4: +SMOTE+Grid      0.948      0.818      0.947
```

### 5.6 Feature Importance (Skenario S4)

```
PHQ (item depresi)    : 70.44% ← sangat dominan
GAD (item kecemasan)  : 14.51%
PSS (item stres)      : 10.35%
Demografis            :  4.70%

Top fitur individual:
  PHQ2 (merasa tertekan/putus asa)     : korelasi 0.751
  PHQ6 (merasa gagal/mengecewakan)     : korelasi 0.747
  PHQ4 (kelelahan/kurang energi)       : korelasi 0.694
  GAD7 (merasa takut sesuatu buruk)    : korelasi 0.618
```

### 5.7 Analisis Dampak

```
Dampak SMOTE:
  Tanpa GridSearch : S1(90.90%) → S3(91.32%) = +0.42% ✅
  Dengan GridSearch: S2(90.34%) → S4(90.44%) = +0.10% ✅
  → SMOTE konsisten membantu

Dampak GridSearchCV:
  Tanpa SMOTE : S1(90.90%) → S2(90.34%) = -0.56% ❌
  Dengan SMOTE: S3(91.32%) → S4(90.44%) = -0.88% ❌
  → GridSearch tidak membantu (RF stabil dengan default)

Kesimpulan: S3 optimal — SMOTE efektif, GridSearch tidak perlu
```

### 5.8 Distribusi SMOTE

```
Sebelum SMOTE (Train):
  Rendah: 441 | Sedang: 364 | Tinggi: 812

Sesudah SMOTE (Train):
  Rendah: 812 | Sedang: 812 | Tinggi: 812
  → Semua kelas seimbang sempurna
```

### 5.9 Top 10 Korelasi Fitur dengan Target

```
PHQ2: 0.751 | PHQ6: 0.747 | PHQ4: 0.694
PHQ7: 0.673 | PHQ3: 0.651 | PHQ8: 0.633
GAD7: 0.618 | PHQ5: 0.613 | GAD5: 0.597
PHQ9: 0.591
```

---

## 6. GAMBAR YANG SUDAH DIHASILKAN

```
Tersedia dari eksperimen:
✅ eda_01_distribusi.png
   → Label asli 5 kelas + mapping 3 kelas + pie + boxplot

✅ eda_02_heatmap.png
   → Heatmap korelasi PSS+GAD+PHQ vs target

✅ prep_distribusi.png
   → Distribusi Train dan Test (sebelum SMOTE)

✅ eval_cm_4skenario.png
   → Confusion Matrix 4 skenario (2×2 subplot)

✅ eval_bar_4skenario.png
   → Bar chart perbandingan metrik 4 skenario

✅ eval_roc_4skenario.png
   → ROC Curve per kelas 4 skenario

✅ eval_feature_importance_s4.png
   → Top 20 feature importance + pie kontribusi

✅ eval_dampak_smote_grid.png
   → Analisis dampak SMOTE dan GridSearchCV

BELUM ADA — perlu ditambahkan ke kode:
❌ Gambar 8  → Distribusi 7 Fitur Demografis
❌ Gambar 10 → Distribusi Sebelum vs Sesudah SMOTE
```

---

## 7. TABEL YANG DIBUTUHKAN JURNAL

```
Tabel 1  : Kategori Penilaian PHQ-9 (Bab 2)
Tabel 2  : Kategori Penilaian GAD-7 (Bab 2)
Tabel 3  : Kategori Penilaian PSS-10 (Bab 2)
Tabel 4  : Perbandingan Penelitian Terdahulu (Bab 2)
Tabel 5  : Rumus Metrik Evaluasi (Bab 3)
Tabel 6  : Ringkasan Preprocessing (Bab 4)
Tabel 7  : Parameter Terbaik GridSearchCV (Bab 4)
Tabel 8  : Perbandingan Metrik 4 Skenario (Bab 4)
Tabel 9  : F1-Score Per Kelas Semua Skenario (Bab 4)
Tabel 10 : Perbandingan dengan Penelitian Sebelumnya (Bab 4)
+ Tabel Dataset (Bab 3)
+ Tabel Data Sampling (Bab 3)
+ Tabel Skenario Optimasi (Bab 3)
+ Tabel Parameter GridSearchCV (Bab 3)
```

---

## 8. OUTLINE JURNAL

```
Abstrak
1. Pendahuluan
   1.1 Fenomena Depresi Mahasiswa
   1.2 Peran Machine Learning
   1.3 Gap Penelitian 1 (Teknik)
   1.4 Gap Penelitian 2 (Dataset)
   1.5 Kontribusi dan Tujuan

2. Tinjauan Pustaka
   2.1 Depresi pada Mahasiswa
   2.2 Instrumen Psikometri (PHQ-9, GAD-7, PSS-10)
   2.3 Random Forest
   2.4 SMOTE
   2.5 GridSearchCV
   2.6 Penelitian Terdahulu (Tabel 4)

3. Metodologi (CRISP-DM)
   3.1 Diagram Alir
   3.2 Dataset
   3.3 EDA
   3.4 Preprocessing
   3.5 Desain 4 Skenario
   3.6 Metrik Evaluasi

4. Result and Discussion
   4.1 EDA
   4.2 Preprocessing
   4.3 Hasil Pelatihan 4 Skenario
   4.4 Evaluasi Model
       4.4.1 Confusion Matrix
       4.4.2 ROC Curve
       4.4.3 Classification Report
   4.5 Feature Importance
   4.6 Analisis Dampak SMOTE & GridSearchCV
   4.7 Perbandingan dengan Penelitian Sebelumnya

5. Kesimpulan dan Saran
```

---

## 9. REFERENSI TERVERIFIKASI

```
[1] Utami, E. W., & Kurniawan, D. (2026).
    Optimasi Hyperparameter Random Forest untuk Klasifikasi
    Depresi Mahasiswa Menggunakan GridSearchCV dan
    RandomizedSearchCV.
    Building of Informatics, Technology and Science (BITS),
    7(4), 2370–2382.
    DOI: 10.47065/bits.v7i4.9366
    Sinta: 3

[2] Oktaviani, V., Rosmawarni, N., & Muslim, M. P. (2024).
    Perbandingan Kinerja Random Forest Dan Smote Random Forest
    Dalam Mendeteksi Dan Mengukur Tingkat Stres Pada Mahasiswa
    Tingkat Akhir.
    Jurnal Informatik, 20(1), 43–49.
    DOI: 10.52958/iftk.v20i1.9158

[3] Syeed, M., Rahman, A., Akter, L., et al. (2024).
    MHP (Anxiety, Stress, Depression) Dataset of
    University Students.
    Figshare.
    DOI: 10.6084/m9.figshare.25771164.v1

[4] Ghrab, M. A., et al. (2023).
    Mental health evaluation in senior year medical students.
    European Psychiatry, 66(S1).
    DOI: 10.1192/j.eurpsy.2023.1918

[5] Faisal, M. R., Jahan, N., Bhuiyan, M. A., &
    Islam, M. S. (2021).
    Validity and reliability of the GAD-7 among university
    students of Bangladesh.
    PLOS ONE, 16(12).
    DOI: 10.1371/journal.pone.0261405

[6] Ni'mah, L. M., & Kurniawan, D. (2025).
    Model Klasifikasi Cerdas Gangguan Tidur Berbasis
    Machine Learning Random Forest pada Data Kesehatan
    dan Perilaku Harian.
    Building of Informatics, Technology and Science (BITS),
    7(3), 1717–1729.
    DOI: 10.47065/bits.v7i3.8631

[7] Matin, I. M. M. (2023).
    Hyperparameter Tuning Menggunakan GridSearchCV pada
    Random Forest untuk Deteksi Malware.
    MULTINETICS, 9(1), 43–50.
    DOI: 10.32722/multinetics.v9i1.5578
```

---

## 10. KEPUTUSAN PENTING YANG SUDAH DITETAPKAN

```
✅ Judul final sudah ACC di sistem tugas akhir
✅ Dataset: MHP Processed.csv (Figshare, Syeed 2024)
✅ Target: Depression Label → 3 kelas (Rendah/Sedang/Tinggi)
✅ Fitur: 33 fitur (10 PSS + 7 GAD + 9 PHQ + 7 Demografis)
✅ Skenario: 4 skenario (Baseline, +Grid, +SMOTE, +SMOTE+Grid)
✅ Metrik utama: F1 Macro
✅ Skenario terbaik: S3 (+SMOTE) F1 Macro=91.32%
✅ Pipeline SMOTE dalam ImbPipeline (bukan di luar)
✅ Label Encoding untuk demografis (bukan One-Hot)
✅ Interpretasi A (demografis sebagai fitur tambahan)
✅ Interpretasi B tidak digunakan
✅ Label voting (Mental Health Label) tidak digunakan
✅ Kode final: Arah 1 (sudah dijalankan dan terverifikasi)
✅ Metodologi: CRISP-DM
✅ Runtime: Google Colab GPU T4

❌ Belum: 2 gambar tambahan (demografis + SMOTE before/after)
❌ Belum: Penulisan Bab 1, 2, 3, 5 dan Abstrak
❌ Belum: Pencarian [REF] untuk 3 sitasi yang belum ada
```

---

## 11. STATUS PROGRESS

```
SELESAI:
  ✅ Form konsultasi tema proposal
  ✅ Proposal judul (sudah ACC dosen)
  ✅ Ujian judul (sudah ACC)
  ✅ Eksperimen Arah 1 (kode + hasil terverifikasi)
  ✅ Eksperimen Arah 2 XGBoost (eksplorasi pribadi)
  ✅ Draft Result and Discussion

SEDANG BERJALAN:
  🔄 Penyesuaian kode (tambah 2 gambar yang kurang)
  🔄 Pencarian referensi untuk [REF]

BELUM DIMULAI:
  ⬜ Bab 1 Pendahuluan
  ⬜ Bab 2 Tinjauan Pustaka
  ⬜ Bab 3 Metodologi
  ⬜ Bab 5 Kesimpulan dan Saran
  ⬜ Abstrak
  ⬜ Penentuan scope/template jurnal target
```

---

## 12. CATATAN TEKNIS PENTING

```
RANDOM STATE   : 42 (semua komponen)
SPLIT RATIO    : 80:20 Stratified
CV STRATEGY    : StratifiedKFold(n_splits=5, shuffle=True)
SMOTE          : ImbPipeline (bukan sebelum CV)
SCORING        : f1_macro
ENVIRONMENT    : Google Colab GPU T4
FILE DATASET   : Processed.csv (bukan Raw/Depression/Anxiety/Stress)

ALASAN F1 MACRO sebagai metrik utama:
  Data tidak seimbang (Rendah 27.3%, Sedang 22.5%, Tinggi 50.2%)
  F1 Macro adil → setiap kelas dinilai setara tanpa bobot

ALASAN SMOTE terbaik bukan GridSearch:
  RF sudah stabil dengan parameter default pada data psikometri
  terstruktur. GridSearch tidak menemukan kombinasi lebih baik
  dari default karena variasi antar fold (CV=89.11-89.29% vs
  test=90.34-90.44%)

ALASAN Label Encoding bukan One-Hot:
  RF tidak sensitif urutan numerik
  University (15 kelas) + Department (12 kelas) → One-Hot
  akan menghasilkan terlalu banyak kolom
```