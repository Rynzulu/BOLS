import { Student, ClassStream, GradebookData, SubjectAssessment, FeeItem, AcademicBatch, SubjectDefinition } from "../types";
import { getZambianSubjectsForGrade, SCHOOL_NAME } from "../data/zambianSchoolData";

/**
 * Escapes a cell value for standard CSV format (RFC 4180)
 */
export function escapeCsvCell(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Triggers a browser download of a CSV file with UTF-8 BOM.
 */
export function downloadCsvFile(csvContent: string, fileName: string): void {
  // UTF-8 BOM helps Microsoft Excel, Apple Numbers, and Google Sheets open the file with correct encoding
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ExportGradebookOptions {
  classId?: number;
  term?: string;
  subject?: string;
  format?: "detailed_records" | "summary_matrix";
}

/**
 * Exports Detailed Gradebook Records CSV:
 * Each row is a single subject assessment record for a student.
 */
export function exportDetailedGradebookCsv(
  students: Student[],
  classes: ClassStream[],
  gradebook: GradebookData,
  options: ExportGradebookOptions = {}
): void {
  const { classId, term, subject } = options;

  const headers = [
    "School Name",
    "Class",
    "Academic Term",
    "Pupil Reference No",
    "Pupil Name",
    "Gender",
    "Subject",
    "Continuous Assessment (30)",
    "Mid-Term Test (20)",
    "End-Term Exam (50)",
    "Total Score (100%)",
    "Grade Point (1-9)",
    "Performance Remark",
    "Teacher Initials"
  ];

  const rows: string[][] = [headers];

  const targetClasses = classId ? classes.filter(c => c.id === classId) : classes;
  const termsToProcess = term ? [term] : ["Term 1", "Term 2", "Term 3"];

  targetClasses.forEach(cls => {
    const classStudents = students.filter(s => s.classId === cls.id);
    const subjects = subject ? [subject] : getZambianSubjectsForGrade(cls.gradeNum);

    termsToProcess.forEach(currentTerm => {
      classStudents.forEach(student => {
        subjects.forEach(subj => {
          const assessment: SubjectAssessment | undefined =
            gradebook[cls.id]?.[currentTerm]?.[subj]?.[student.id];

          if (assessment) {
            rows.push([
              SCHOOL_NAME,
              cls.name,
              currentTerm,
              student.eczNo,
              student.name,
              student.gender,
              subj,
              String(assessment.caScore),
              String(assessment.midTermScore),
              String(assessment.endTermScore),
              `${assessment.totalScore}%`,
              `Grade ${assessment.eczGrade}`,
              assessment.remark,
              assessment.teacherInitials || "T.C."
            ]);
          } else {
            // Include empty / default placeholder record so CSV has full student roster
            rows.push([
              SCHOOL_NAME,
              cls.name,
              currentTerm,
              student.eczNo,
              student.name,
              student.gender,
              subj,
              "0",
              "0",
              "0",
              "0%",
              "Grade 9",
              "Pending Assessment",
              "T.C."
            ]);
          }
        });
      });
    });
  });

  const csvContent = rows.map(r => r.map(escapeCsvCell).join(",")).join("\r\n");

  const safeClass = classId ? classes.find(c => c.id === classId)?.name.replace(/\s+/g, "_") : "All_Classes";
  const safeTerm = term ? term.replace(/\s+/g, "_") : "All_Terms";
  const safeSubject = subject ? `_${subject.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
  const timestamp = new Date().toISOString().split("T")[0];

  const fileName = `Bread_of_Life_Gradebook_${safeClass}_${safeTerm}${safeSubject}_${timestamp}.csv`;
  downloadCsvFile(csvContent, fileName);
}

/**
 * Exports Wide-Format Summary Matrix CSV:
 * One row per student, with each subject's Total Score & Grade Point in columns,
 * plus Overall Class Average % and Best 5 Aggregate Points.
 */
export function exportSummaryMatrixCsv(
  classId: number,
  term: string,
  students: Student[],
  classes: ClassStream[],
  gradebook: GradebookData
): void {
  const currentClass = classes.find(c => c.id === classId) || classes[0];
  const classStudents = students.filter(s => s.classId === currentClass.id);
  const subjects = getZambianSubjectsForGrade(currentClass.gradeNum);

  const headers = [
    "Pupil Reference No",
    "Pupil Full Name",
    "Gender",
    "Class Stream",
    "Academic Term"
  ];

  // Add columns for each subject: Score and Grade
  subjects.forEach(subj => {
    headers.push(`${subj} (Score %)`);
    headers.push(`${subj} (Grade Point)`);
  });

  headers.push("Average Percentage (%)");
  headers.push("Best 5 Aggregate Points");

  const rows: string[][] = [headers];

  classStudents.forEach(student => {
    const row: string[] = [
      student.eczNo,
      student.name,
      student.gender,
      currentClass.name,
      term
    ];

    let totalScoreSum = 0;
    let scoredCount = 0;
    const gradePoints: number[] = [];

    subjects.forEach(subj => {
      const assessment: SubjectAssessment | undefined =
        gradebook[currentClass.id]?.[term]?.[subj]?.[student.id];

      if (assessment) {
        row.push(`${assessment.totalScore}%`);
        row.push(String(assessment.eczGrade));
        totalScoreSum += assessment.totalScore;
        scoredCount += 1;
        gradePoints.push(assessment.eczGrade);
      } else {
        row.push("N/A");
        row.push("N/A");
      }
    });

    // Calculate Average
    const avgScore = scoredCount > 0 ? (totalScoreSum / scoredCount).toFixed(1) : "0";
    row.push(`${avgScore}%`);

    // Calculate Best 5 Aggregate Points
    gradePoints.sort((a, b) => a - b);
    const best5Sum = gradePoints.slice(0, 5).reduce((acc, p) => acc + p, 0);
    row.push(gradePoints.length >= 5 ? `${best5Sum} pts` : `${gradePoints.reduce((a, b) => a + b, 0)} pts`);

    rows.push(row);
  });

  const csvContent = rows.map(r => r.map(escapeCsvCell).join(",")).join("\r\n");
  const safeClass = currentClass.name.replace(/\s+/g, "_");
  const safeTerm = term.replace(/\s+/g, "_");
  const timestamp = new Date().toISOString().split("T")[0];

  const fileName = `Bread_of_Life_Summary_Matrix_${safeClass}_${safeTerm}_${timestamp}.csv`;
  downloadCsvFile(csvContent, fileName);
}

/**
 * Interface for parsed student row during bulk import
 */
export interface ParsedStudentImportRow {
  rowNumber: number;
  name: string;
  gender: "Male" | "Female";
  age: number;
  grade: string;
  stream: string;
  eczNo: string;
  section?: "Primary" | "Secondary";
  pathway?: "Natural Sciences" | "Business & Commercial" | "Social Sciences & Humanities" | "Technical & Vocational" | "Junior Secondary Core";
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  classId: number;
  className: string;
  status: "Valid" | "Warning" | "Error";
  notes?: string;
}

export interface StudentImportResult {
  validRows: ParsedStudentImportRow[];
  invalidRows: ParsedStudentImportRow[];
  totalRows: number;
  errors: string[];
}

/**
 * Downloads a standardized CSV template for bulk importing student records.
 */
export function downloadStudentImportTemplateCsv(): void {
  const headers = [
    "Pupil Full Name",
    "Gender",
    "Age",
    "Grade",
    "Stream",
    "Secondary Pathway",
    "Reference No",
    "Guardian Full Name",
    "Guardian Phone",
    "Guardian Email"
  ];

  const sampleRows = [
    [
      "Chanda Mwewa",
      "Male",
      "12",
      "Grade 7",
      "Eagle",
      "",
      "26010045001",
      "Joseph Mwewa",
      "+260 977 112233",
      "joseph.mwewa@example.com"
    ],
    [
      "Thandiwe Phiri",
      "Female",
      "12",
      "Grade 7",
      "Eagle",
      "",
      "26010045002",
      "Grace Phiri",
      "+260 966 223344",
      "grace.phiri@example.com"
    ],
    [
      "Lubona Chilufya",
      "Female",
      "14",
      "Grade 8",
      "Alpha",
      "Junior Secondary Core",
      "26010045021",
      "Moses Chilufya",
      "+260 977 445566",
      "moses.chilufya@zamtel.zm"
    ],
    [
      "Mwamba Mulenga",
      "Male",
      "16",
      "Grade 10",
      "Science",
      "Natural Sciences",
      "26010045031",
      "Beatrice Mulenga",
      "+260 971 889900",
      "beatrice.mulenga@yahoo.com"
    ],
    [
      "Natasha Sakala",
      "Female",
      "17",
      "Grade 11",
      "Commerce",
      "Business & Commercial",
      "26010045041",
      "Enock Sakala",
      "+260 955 776655",
      "enock.sakala@bankofzambia.zm"
    ]
  ];

  const csvContent = [headers, ...sampleRows]
    .map(row => row.map(escapeCsvCell).join(","))
    .join("\r\n");

  downloadCsvFile(csvContent, "Bread_of_Life_Pupil_Import_Template.csv");
}

/**
 * Exports student roster to CSV / Excel format with optional filter labels.
 */
export function exportStudentRosterCsv(
  students: Student[],
  classes: ClassStream[],
  customLabel?: string,
  batches?: AcademicBatch[]
): void {
  const headers = [
    "Reference No",
    "Pupil Full Name",
    "Gender",
    "Age",
    "Section",
    "Grade",
    "Stream",
    "Secondary Pathway",
    "Academic Cohort / Batch",
    "Class Room",
    "Class Teacher",
    "Guardian Name",
    "Guardian Phone",
    "Guardian Email",
    "Enrollment Status"
  ];

  const rows = students.map(s => {
    const cls = classes.find(c => c.id === s.classId);
    const batch = batches?.find(b => b.id === s.batchId || b.id === cls?.batchId);
    return [
      s.eczNo,
      s.name,
      s.gender,
      String(s.age),
      s.section || (parseInt(s.grade.replace(/\D/g, ""), 10) >= 8 ? "Secondary" : "Primary"),
      s.grade,
      s.stream,
      s.pathway || (parseInt(s.grade.replace(/\D/g, ""), 10) >= 8 ? "Junior Secondary Core" : "N/A"),
      batch ? batch.name : "2026 Academic Cohort",
      cls ? `Room ${cls.room}` : "N/A",
      cls ? cls.teacherName : "N/A",
      s.guardianName,
      s.guardianPhone,
      s.guardianEmail,
      s.status
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(escapeCsvCell).join(","))
    .join("\r\n");

  const timestamp = new Date().toISOString().split("T")[0];
  const prefix = customLabel ? `Bread_of_Life_Pupils_${customLabel.replace(/\s+/g, "_")}` : "Bread_of_Life_Pupil_Roster";
  downloadCsvFile(csvContent, `${prefix}_${timestamp}.csv`);
}

/**
 * Exports Classes & Streams table to CSV / Excel format.
 */
export function exportClassesCsv(
  classes: ClassStream[],
  students: Student[],
  batches: AcademicBatch[] = []
): void {
  const headers = [
    "Class Stream Name",
    "Section",
    "Grade Level",
    "Stream Name",
    "Secondary Specialization Pathway",
    "Class Room",
    "Class Teacher",
    "Enrolled Pupils",
    "Capacity Limit",
    "Utilization (%)",
    "Associated Academic Batch",
    "Allocated Subjects"
  ];

  const rows = classes.map(cls => {
    const enrolled = students.filter(s => s.classId === cls.id).length;
    const capacity = cls.capacity || 40;
    const util = Math.round((enrolled / capacity) * 100);
    const batch = batches.find(b => b.id === cls.batchId);
    const subjectsCount = cls.subjects?.length || 0;

    return [
      cls.name,
      cls.section || (cls.gradeNum >= 8 ? "Secondary" : "Primary"),
      `Grade ${cls.gradeNum}`,
      cls.streamName,
      cls.pathway || "N/A",
      cls.room ? `Room ${cls.room}` : "Main Block",
      cls.teacherName || "Unassigned",
      String(enrolled),
      String(capacity),
      `${util}%`,
      batch ? batch.name : "2026 Academic Cohort",
      subjectsCount > 0 ? `${subjectsCount} Subjects Assigned` : "Standard ECZ Curriculum"
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(escapeCsvCell).join(","))
    .join("\r\n");

  const timestamp = new Date().toISOString().split("T")[0];
  downloadCsvFile(csvContent, `Bread_of_Life_Classes_Streams_${timestamp}.csv`);
}

/**
 * Exports Academic Batches & Cohorts table to CSV.
 */
export function exportBatchesCsv(
  batches: AcademicBatch[],
  classes: ClassStream[],
  students: Student[]
): void {
  const headers = [
    "Batch ID",
    "Cohort Name",
    "Batch Code",
    "Academic Year",
    "Intake Term",
    "Target Grades",
    "Associated Classes Count",
    "Total Enrolled Pupils",
    "Status",
    "Start Date",
    "End Date",
    "Description"
  ];

  const rows = batches.map(b => {
    const batchClasses = classes.filter(c => c.batchId === b.id);
    const batchClassIds = new Set(batchClasses.map(c => c.id));
    const enrolled = students.filter(s => s.batchId === b.id || batchClassIds.has(s.classId)).length;

    return [
      b.id,
      b.name,
      b.code,
      String(b.academicYear),
      b.intakeTerm,
      b.targetGrades?.join("; ") || "All Grades",
      String(batchClasses.length),
      String(enrolled),
      b.status,
      b.startDate || "2026-01-12",
      b.endDate || "2026-12-04",
      b.description || ""
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(escapeCsvCell).join(","))
    .join("\r\n");

  const timestamp = new Date().toISOString().split("T")[0];
  downloadCsvFile(csvContent, `Bread_of_Life_Academic_Batches_${timestamp}.csv`);
}

/**
 * Exports Curriculum Subjects Catalog table to CSV.
 */
export function exportSubjectsCatalogCsv(subjects: SubjectDefinition[]): void {
  const headers = [
    "Subject ID",
    "ECZ Code",
    "Subject Name",
    "Category",
    "Section",
    "Department",
    "Weekly Periods",
    "Pass Mark (%)",
    "Assigned Teacher",
    "Applicable Grades",
    "Secondary Pathway",
    "Description"
  ];

  const rows = subjects.map(sub => [
    sub.id,
    sub.code,
    sub.name,
    sub.category,
    sub.section,
    sub.department,
    String(sub.weeklyPeriods || 4),
    `${sub.passMark || 50}%`,
    sub.assignedTeacherName || "Unassigned",
    sub.gradesApplicable ? sub.gradesApplicable.map(g => `Grade ${g}`).join(", ") : "All Grades",
    sub.pathway || "General",
    sub.description || ""
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(escapeCsvCell).join(","))
    .join("\r\n");

  const timestamp = new Date().toISOString().split("T")[0];
  downloadCsvFile(csvContent, `Bread_of_Life_Curriculum_Subjects_${timestamp}.csv`);
}

/**
 * Exports Comprehensive School Fees Invoices & Payments Ledger to CSV / Excel.
 */
export function exportFeeInvoicesCsv(
  fees: FeeItem[],
  students: Student[],
  classes: ClassStream[],
  options: {
    term?: string;
    clearanceFilter?: string;
    schoolName?: string;
  } = {}
): void {
  const school = options.schoolName || SCHOOL_NAME;

  const headers = [
    "Invoice ID",
    "Pupil Reference No",
    "Pupil Full Name",
    "Section",
    "Grade & Stream",
    "Class Room",
    "Class Teacher",
    "Guardian Full Name",
    "Guardian Phone",
    "Academic Term",
    "Academic Year",
    "Fee Description",
    "Billed Amount (ZMW)",
    "Paid Amount (ZMW)",
    "Outstanding Balance (ZMW)",
    "Due Date",
    "Payment Status",
    "Report Card Clearance Status"
  ];

  let totalBilled = 0;
  let totalPaid = 0;
  let totalOutstanding = 0;

  const rows = fees.map(f => {
    const st = students.find(s => s.id === f.studentId);
    const cls = st ? classes.find(c => c.id === st.classId) : undefined;
    const balance = Math.max(0, f.amountZMW - f.paidAmountZMW);
    const isCleared = f.status === "Paid" || balance <= 0;

    totalBilled += f.amountZMW;
    totalPaid += f.paidAmountZMW;
    totalOutstanding += balance;

    return [
      `INV-${String(f.id).padStart(5, "0")}`,
      st ? st.eczNo : "N/A",
      st ? st.name : "Unknown Pupil",
      st?.section || (st && parseInt(st.grade.replace(/\D/g, ""), 10) >= 8 ? "Secondary" : "Primary"),
      st ? `${st.grade} ${st.stream}` : "N/A",
      cls ? `Room ${cls.room}` : "N/A",
      cls ? cls.teacherName : "N/A",
      st ? st.guardianName : "N/A",
      st ? st.guardianPhone : "N/A",
      f.term,
      String(f.year || 2026),
      f.description,
      f.amountZMW.toFixed(2),
      f.paidAmountZMW.toFixed(2),
      balance.toFixed(2),
      f.dueDate,
      f.status,
      isCleared ? "UNLOCKED (Full Clearance)" : "WITHHELD (Pending Payment)"
    ];
  });

  // Add blank separation row and Totals Summary Row for accounting reconciliation
  const emptyRow: string[] = new Array(headers.length).fill("");
  const totalsRow: string[] = [
    "RECONCILIATION TOTALS",
    "",
    `Total Transactions: ${fees.length}`,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Grand Totals (ZMW):",
    totalBilled.toFixed(2),
    totalPaid.toFixed(2),
    totalOutstanding.toFixed(2),
    "",
    "",
    `Cleared: ${fees.filter(f => f.status === "Paid" || f.amountZMW - f.paidAmountZMW <= 0).length} | Defaulters: ${fees.filter(f => f.amountZMW - f.paidAmountZMW > 0).length}`
  ];

  const csvContent = [
    [`${school} - OFFICIAL SCHOOL FEES & LEVY LEDGER`],
    [`Generated Date: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`],
    [`Filter Scope: Term=${options.term || "All Terms"}, Clearance=${options.clearanceFilter || "All"}`],
    [],
    headers,
    ...rows,
    emptyRow,
    totalsRow
  ]
    .map(row => row.map(escapeCsvCell).join(","))
    .join("\r\n");

  const timestamp = new Date().toISOString().split("T")[0];
  const safeTerm = options.term && options.term !== "all" ? `_${options.term.replace(/\s+/g, "_")}` : "";
  downloadCsvFile(csvContent, `Bread_of_Life_Fee_Ledger${safeTerm}_${timestamp}.csv`);
}

/**
 * Exports Pupil-by-Pupil Fee Summary & Access Clearance Status to CSV / Excel.
 */
export function exportStudentFeeSummaryCsv(
  students: Student[],
  fees: FeeItem[],
  classes: ClassStream[],
  options: {
    term?: string;
    schoolName?: string;
  } = {}
): void {
  const school = options.schoolName || SCHOOL_NAME;

  const headers = [
    "Reference No",
    "Pupil Full Name",
    "Gender",
    "Section",
    "Grade & Stream",
    "Class Teacher",
    "Guardian Full Name",
    "Guardian Phone",
    "Guardian Email",
    "Total Billed (ZMW)",
    "Total Paid (ZMW)",
    "Outstanding Balance (ZMW)",
    "Clearance Ratio (%)",
    "Academic Results Access Status",
    "Active Invoices Count"
  ];

  let totalBilledAll = 0;
  let totalPaidAll = 0;
  let totalBalAll = 0;
  let clearedCount = 0;
  let withheldCount = 0;

  const rows = students.map(st => {
    const cls = classes.find(c => c.id === st.classId);
    const studentFees = fees.filter(f => f.studentId === st.id && (options.term === "all" || !options.term || f.term === options.term));
    const billed = studentFees.reduce((sum, f) => sum + f.amountZMW, 0);
    const paid = studentFees.reduce((sum, f) => sum + f.paidAmountZMW, 0);
    const bal = Math.max(0, billed - paid);
    const isCleared = studentFees.length === 0 || bal <= 0;
    const ratio = billed > 0 ? Math.min(100, Math.round((paid / billed) * 100)) : 100;

    totalBilledAll += billed;
    totalPaidAll += paid;
    totalBalAll += bal;

    if (isCleared) clearedCount++;
    else withheldCount++;

    return [
      st.eczNo,
      st.name,
      st.gender,
      st.section || (parseInt(st.grade.replace(/\D/g, ""), 10) >= 8 ? "Secondary" : "Primary"),
      `${st.grade} ${st.stream}`,
      cls ? cls.teacherName : "N/A",
      st.guardianName,
      st.guardianPhone,
      st.guardianEmail,
      billed.toFixed(2),
      paid.toFixed(2),
      bal.toFixed(2),
      `${ratio}%`,
      isCleared ? "UNLOCKED (Cleared to View Report Card)" : "WITHHELD (Fees Outstanding)",
      String(studentFees.length)
    ];
  });

  const emptyRow: string[] = new Array(headers.length).fill("");
  const totalsRow: string[] = [
    "SUMMARY TOTALS",
    `Total Pupils: ${students.length}`,
    "",
    "",
    "",
    "",
    "",
    "",
    "Total Amount (ZMW):",
    totalBilledAll.toFixed(2),
    totalPaidAll.toFixed(2),
    totalBalAll.toFixed(2),
    `${totalBilledAll > 0 ? Math.round((totalPaidAll / totalBilledAll) * 100) : 100}%`,
    `Cleared: ${clearedCount} | Withheld: ${withheldCount}`,
    ""
  ];

  const csvContent = [
    [`${school} - STUDENT RESULTS CLEARANCE & FEE BALANCE SUMMARY`],
    [`Generated Date: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`],
    [`Scope: Term=${options.term || "All Terms"}`],
    [],
    headers,
    ...rows,
    emptyRow,
    totalsRow
  ]
    .map(row => row.map(escapeCsvCell).join(","))
    .join("\r\n");

  const timestamp = new Date().toISOString().split("T")[0];
  downloadCsvFile(csvContent, `Bread_of_Life_Pupil_Fee_Clearance_Summary_${timestamp}.csv`);
}

/**
 * Splits CSV lines while respecting quoted fields containing newlines or commas
 */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  // Clean BOM if present
  const cleanText = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentCell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\r" || char === "\n") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      currentRow.push(currentCell.trim());
      // Only push non-empty rows
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Parses raw CSV content and validates against school class structure.
 */
export function parseStudentImportCsv(
  csvText: string,
  classes: ClassStream[],
  existingStudents: Student[] = []
): StudentImportResult {
  const rows = parseCsvRows(csvText);

  if (rows.length === 0) {
    return {
      validRows: [],
      invalidRows: [],
      totalRows: 0,
      errors: ["The CSV file is completely empty."]
    };
  }

  // Identify column indices from header
  const headerRow = rows[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  
  const findColIndex = (keywords: string[]) => {
    return headerRow.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const nameIdx = findColIndex(["fullname", "pupilname", "studentname", "name"]);
  const genderIdx = findColIndex(["gender", "sex"]);
  const ageIdx = findColIndex(["age", "dob", "years"]);
  const gradeIdx = findColIndex(["grade", "level", "year"]);
  const streamIdx = findColIndex(["stream", "section", "classstream"]);
  const pathwayIdx = findColIndex(["pathway", "secondarypathway", "track", "specialization"]);
  const eczIdx = findColIndex(["ecz", "examno", "referenceno", "refno", "idno", "admissionno"]);
  const guardianNameIdx = findColIndex(["guardianname", "parentname", "guardian", "parent", "father", "mother"]);
  const guardianPhoneIdx = findColIndex(["guardianphone", "parentphone", "phone", "contact", "mobile", "tel"]);
  const guardianEmailIdx = findColIndex(["guardianemail", "parentemail", "email", "mail"]);

  if (nameIdx === -1) {
    return {
      validRows: [],
      invalidRows: [],
      totalRows: rows.length - 1,
      errors: ["Missing required 'Pupil Full Name' column in CSV header."]
    };
  }

  const validRows: ParsedStudentImportRow[] = [];
  const invalidRows: ParsedStudentImportRow[] = [];
  const existingEczSet = new Set(existingStudents.map(s => s.eczNo.toLowerCase()));

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 0 || row.every(c => c.trim() === "")) continue;

    const rawName = (row[nameIdx] || "").trim();
    const rawGender = (genderIdx !== -1 ? row[genderIdx] || "" : "").trim();
    const rawAge = (ageIdx !== -1 ? row[ageIdx] || "" : "").trim();
    const rawGrade = (gradeIdx !== -1 ? row[gradeIdx] || "" : "").trim();
    const rawStream = (streamIdx !== -1 ? row[streamIdx] || "" : "").trim();
    const rawPathway = (pathwayIdx !== -1 ? row[pathwayIdx] || "" : "").trim();
    let rawEcz = (eczIdx !== -1 ? row[eczIdx] || "" : "").trim();
    const rawGuardianName = (guardianNameIdx !== -1 ? row[guardianNameIdx] || "" : "").trim();
    const rawGuardianPhone = (guardianPhoneIdx !== -1 ? row[guardianPhoneIdx] || "" : "").trim();
    const rawGuardianEmail = (guardianEmailIdx !== -1 ? row[guardianEmailIdx] || "" : "").trim();

    const issues: string[] = [];

    // 1. Validate Name
    if (!rawName || rawName.length < 2) {
      issues.push("Pupil full name is required.");
    }

    // 2. Normalize Gender
    let gender: "Male" | "Female" = "Male";
    const lowerG = rawGender.toLowerCase();
    if (lowerG.startsWith("f") || lowerG === "female" || lowerG === "girl") {
      gender = "Female";
    } else if (lowerG.startsWith("m") || lowerG === "male" || lowerG === "boy") {
      gender = "Male";
    } else if (rawGender) {
      issues.push(`Invalid gender '${rawGender}' (defaulted to Male).`);
    }

    // 3. Normalize Age
    const parsedAge = parseInt(rawAge, 10);
    const age = !isNaN(parsedAge) && parsedAge >= 4 && parsedAge <= 19 ? parsedAge : 12;

    // 4. Resolve Class Stream
    let gradeStr = rawGrade || "Grade 7";
    if (/^\d+$/.test(gradeStr)) {
      gradeStr = `Grade ${gradeStr}`;
    }

    let streamStr = rawStream || "Eagle";
    const gradeNum = parseInt(gradeStr.replace(/\D/g, ""), 10) || 7;
    const isSecondary = gradeNum >= 8;

    // Resolve Pathway
    let resolvedPathway: ParsedStudentImportRow["pathway"] = undefined;
    if (isSecondary) {
      const lowerP = rawPathway.toLowerCase();
      if (lowerP.includes("science") || lowerP.includes("stem") || lowerP.includes("natural")) {
        resolvedPathway = "Natural Sciences";
      } else if (lowerP.includes("bus") || lowerP.includes("comm") || lowerP.includes("account")) {
        resolvedPathway = "Business & Commercial";
      } else if (lowerP.includes("social") || lowerP.includes("human") || lowerP.includes("art")) {
        resolvedPathway = "Social Sciences & Humanities";
      } else if (lowerP.includes("tech") || lowerP.includes("voc") || lowerP.includes("tevet")) {
        resolvedPathway = "Technical & Vocational";
      } else if (gradeNum <= 9) {
        resolvedPathway = "Junior Secondary Core";
      } else {
        resolvedPathway = "Natural Sciences";
      }
    }

    // Match with available classes
    let matchedClass = classes.find(c => 
      c.gradeNum === gradeNum &&
      (c.streamName.toLowerCase() === streamStr.toLowerCase() || c.name.toLowerCase().includes(streamStr.toLowerCase())) &&
      (!resolvedPathway || !c.pathway || c.pathway === resolvedPathway)
    );

    if (!matchedClass) {
      matchedClass = classes.find(c => c.gradeNum === gradeNum);
    }

    if (!matchedClass) {
      matchedClass = classes[0];
      issues.push(`Assigned to ${matchedClass.name} as '${rawGrade} ${rawStream}' was not found.`);
    }

    // 5. Reference Number
    if (!rawEcz) {
      const randSuffix = Math.floor(1000 + Math.random() * 9000);
      rawEcz = `260100450${randSuffix}`;
    } else if (existingEczSet.has(rawEcz.toLowerCase())) {
      issues.push(`Duplicate Reference Number '${rawEcz}' (already enrolled).`);
    }

    const isFatal = !rawName || rawName.length < 2;

    const parsedRow: ParsedStudentImportRow = {
      rowNumber: r + 1,
      name: rawName,
      gender,
      age,
      grade: matchedClass ? `Grade ${matchedClass.gradeNum}` : gradeStr,
      stream: matchedClass ? matchedClass.streamName : streamStr,
      classId: matchedClass ? matchedClass.id : classes[0].id,
      className: matchedClass ? matchedClass.name : "Grade 7 Eagle",
      section: isSecondary ? "Secondary" : "Primary",
      pathway: resolvedPathway,
      eczNo: rawEcz,
      guardianName: rawGuardianName || `${rawName.split(" ").slice(-1)[0] || "Guardian"} (Parent)`,
      guardianPhone: rawGuardianPhone || "+260 977 000000",
      guardianEmail: rawGuardianEmail || "",
      status: isFatal ? "Error" : issues.length > 0 ? "Warning" : "Valid",
      notes: issues.join(" | ")
    };

    if (isFatal) {
      invalidRows.push(parsedRow);
    } else {
      validRows.push(parsedRow);
    }
  }

  return {
    validRows,
    invalidRows,
    totalRows: rows.length - 1,
    errors: []
  };
}

/**
 * Generic exportToCsv helper for dictionaries / objects
 */
export function exportToCsv(filename: string, rows: Record<string, unknown>[]): void {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvLines: string[] = [];
  
  // Header line
  csvLines.push(headers.map(h => escapeCsvCell(h)).join(","));
  
  // Data rows
  rows.forEach(row => {
    const values = headers.map(h => escapeCsvCell(row[h] as string | number | undefined));
    csvLines.push(values.join(","));
  });

  const fullFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  downloadCsvFile(csvLines.join("\r\n"), fullFilename);
}

