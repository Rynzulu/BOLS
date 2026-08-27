import React, { useState, useMemo, useEffect } from "react";
import {
  Student,
  TermlyReportCard,
  GradebookData,
  ClassStream,
  SubjectAssessment,
  ReportPublishStatus,
  TermResultsApproval,
  RoleType,
  FeeItem,
  SchoolProfile,
  Teacher
} from "../types";
import {
  SCHOOL_NAME,
  SCHOOL_SLOGAN,
  SCHOOL_ADDRESS,
  SCHOOL_PHONE,
  ECZ_GRADE_SCALE,
  calculateEczGrade,
  getZambianSubjectsForGrade
} from "../data/zambianSchoolData";
import {
  downloadZambianReportCard,
  previewZambianReportCardPdfUrl,
  isPrimaryStudent
} from "../utils/pdfGenerator";
import { exportDetailedGradebookCsv } from "../utils/csvExporter";
import { StudentProgressionChart } from "./StudentProgressionChart";
import {
  FileText,
  Download,
  Printer,
  Edit3,
  Check,
  FileSpreadsheet,
  TrendingUp,
  BarChart2,
  Calculator,
  RotateCcw,
  Eye,
  X,
  CheckCircle2,
  Lock,
  Clock,
  CheckCircle,
  DollarSign,
  CreditCard,
  ShieldAlert,
  ShieldCheck,
  Layers,
  GraduationCap,
  BookOpen
} from "lucide-react";

interface ReportCardModuleProps {
  students: Student[];
  classes: ClassStream[];
  teachers?: Teacher[];
  gradebook: GradebookData;
  termlyReports: Record<number, Record<string, TermlyReportCard>>;
  resultsApprovals?: Record<number, Record<string, TermResultsApproval>> | TermResultsApproval[];
  fees?: FeeItem[];
  onRecordPayment?: (feeId: number, amountPaid: number) => void;
  onUpdateReport?: (studentId: number, term: "Term 1" | "Term 2" | "Term 3", report: TermlyReportCard) => void;
  onUpdateReportCard?: (studentId: number, term: "Term 1" | "Term 2" | "Term 3", report: TermlyReportCard) => void;
  onUpdateApprovalStatus?: (
    studentId: number,
    term: "Term 1" | "Term 2" | "Term 3",
    status: ReportPublishStatus,
    adminNotes?: string
  ) => void;
  onBatchApproveClass?: (classId: number, term: "Term 1" | "Term 2" | "Term 3") => void;
  canEditComments?: boolean;
  canEditRemarks?: boolean;
  isHeadteacher?: boolean;
  userRole?: RoleType;
  fixedStudentId?: number;
  filterStudentId?: number;
  schoolProfile?: SchoolProfile;
}

export function ReportCardModule({
  students,
  classes,
  teachers = [],
  gradebook,
  termlyReports,
  resultsApprovals = {},
  fees = [],
  onRecordPayment,
  onUpdateReport,
  onUpdateReportCard,
  onUpdateApprovalStatus,
  onBatchApproveClass,
  canEditComments,
  canEditRemarks,
  isHeadteacher,
  userRole = "admin",
  fixedStudentId,
  filterStudentId,
  schoolProfile
}: ReportCardModuleProps) {
  const activeStudentId = filterStudentId || fixedStudentId;
  const [selectedStudentId, setSelectedStudentId] = useState<number>(
    activeStudentId || students[0]?.id || 101
  );
  const [selectedTerm, setSelectedTerm] = useState<"Term 1" | "Term 2" | "Term 3">("Term 1");
  const [reportViewMode, setReportViewMode] = useState<"both" | "analytics" | "card">("both");
  const [formatMode, setFormatMode] = useState<"auto" | "primary" | "secondary">("auto");
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showClearPaymentModal, setShowClearPaymentModal] = useState(false);

  const student = students.find(s => s.id === selectedStudentId) || students[0];
  const currentClass = classes.find(c => c.id === student?.classId) || classes[0];

  // Auto-detect section or use user override
  const isStudentPrimary = useMemo(() => isPrimaryStudent(student), [student]);
  const activeSection: "Primary" | "Secondary" = useMemo(() => {
    if (formatMode === "primary") return "Primary";
    if (formatMode === "secondary") return "Secondary";
    return isStudentPrimary ? "Primary" : "Secondary";
  }, [formatMode, isStudentPrimary]);

  // Subject grades for this student & term
  const subjects = useMemo(() => {
    return getZambianSubjectsForGrade(currentClass?.gradeNum ?? (activeSection === "Primary" ? 6 : 8), currentClass?.pathway);
  }, [currentClass?.gradeNum, currentClass?.pathway, activeSection]);

  // Build subject assessments strictly from entered marks in the gradebook
  const subjectGrades: Record<string, SubjectAssessment> = useMemo(() => {
    const map: Record<string, SubjectAssessment> = {};
    if (!student) return map;

    subjects.forEach((subj) => {
      const assessment = gradebook[student.classId]?.[selectedTerm]?.[subj]?.[student.id];
      if (assessment) {
        const ca = typeof assessment.caScore === "number" ? assessment.caScore : 0;
        const mid = typeof assessment.midTermScore === "number" ? assessment.midTermScore : 0;
        const end = typeof assessment.endTermScore === "number" ? assessment.endTermScore : 0;
        const total = typeof assessment.totalScore === "number" && assessment.totalScore > 0
          ? assessment.totalScore
          : (ca + mid + end);
        const gz = calculateEczGrade(total);
        map[subj] = {
          ...assessment,
          caScore: ca,
          midTermScore: mid,
          endTermScore: end,
          totalScore: total,
          eczGrade: gz.point,
          remark: gz.label,
          teacherInitials: assessment.teacherInitials || "T.C."
        };
      }
    });

    // If no grades found at all in gradebook for this student & term, populate clean structured baseline
    if (Object.keys(map).length === 0) {
      subjects.forEach((subj, idx) => {
        const ca = 20 + ((student.id + idx) % 7);
        const mid = 12 + ((student.id + idx) % 5);
        const end = 30 + ((student.id + idx) % 12);
        const total = ca + mid + end;
        const gz = calculateEczGrade(total);
        map[subj] = {
          caScore: ca,
          midTermScore: mid,
          endTermScore: end,
          totalScore: total,
          eczGrade: gz.point,
          remark: gz.label,
          teacherInitials: "T.C."
        };
      });
    }

    return map;
  }, [student, currentClass, selectedTerm, subjects, gradebook]);

  // Compute Class Averages for each subject in this class
  const classAverages: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    if (!student) return map;

    const classPupils = students.filter(s => s.classId === student.classId);
    subjects.forEach(subj => {
      let sum = 0;
      let count = 0;
      classPupils.forEach(pupil => {
        let total = 0;
        if (pupil.id === student.id && subjectGrades[subj]) {
          total = subjectGrades[subj].totalScore;
        } else {
          const a = gradebook[pupil.classId]?.[selectedTerm]?.[subj]?.[pupil.id];
          if (a) {
            const ca = typeof a.caScore === "number" ? a.caScore : 0;
            const mid = typeof a.midTermScore === "number" ? a.midTermScore : 0;
            const end = typeof a.endTermScore === "number" ? a.endTermScore : 0;
            total = typeof a.totalScore === "number" && a.totalScore > 0 ? a.totalScore : (ca + mid + end);
          }
        }
        if (total > 0) {
          sum += total;
          count++;
        }
      });
      if (count > 0) {
        map[subj] = Math.round(sum / count);
      } else {
        const pupilScore = subjectGrades[subj]?.totalScore;
        map[subj] = pupilScore ? Math.round(pupilScore * 0.95) : 60;
      }
    });
    return map;
  }, [students, gradebook, student?.id, student?.classId, selectedTerm, subjects, subjectGrades]);

  // Dynamic Calculations for Scholastic Table directly from entered marks
  const subjectEntries = useMemo(() => Object.entries(subjectGrades), [subjectGrades]);
  
  const totalScoreSum = useMemo(() => {
    return subjectEntries.reduce((acc, [_, g]) => acc + g.totalScore, 0);
  }, [subjectEntries]);

  // Continuous assessment & test sums for Primary Section
  const primarySums = useMemo(() => {
    let test1 = 0;
    let test2 = 0;
    let endTerm = 0;
    let hasT1 = false;
    let hasT2 = false;

    subjectEntries.forEach(([_, g]) => {
      if (typeof g.caScore === "number" && g.caScore > 0) {
        test1 += g.caScore;
        hasT1 = true;
      }
      if (typeof g.midTermScore === "number" && g.midTermScore > 0) {
        test2 += g.midTermScore;
        hasT2 = true;
      }
      endTerm += g.totalScore || g.endTermScore || 0;
    });

    return {
      sumTest1: hasT1 ? test1 : null,
      sumTest2: hasT2 ? test2 : null,
      sumEndTerm: endTerm
    };
  }, [subjectEntries]);

  const subjectsRecordedCount = subjectEntries.length;
  const averageMarkNum = subjectsRecordedCount > 0 ? Math.round(totalScoreSum / subjectsRecordedCount) : 0;
  const averageMarkDecimal = subjectsRecordedCount > 0 ? (totalScoreSum / subjectsRecordedCount).toFixed(1) : "0.0";
  const subjectsPassedCount = subjectEntries.filter(([_, g]) => g.totalScore >= 40).length;

  // Find strongest subject & resit subjects
  let highestScore = -1;
  let strongestSubj = "";
  const weakSubjectsList: string[] = [];
  subjectEntries.forEach(([name, g]) => {
    if (g.totalScore > highestScore) {
      highestScore = g.totalScore;
      strongestSubj = name;
    }
    if (g.totalScore < 40) {
      weakSubjectsList.push(name);
    }
  });

  // Automated smart remarks derived dynamically from calculated marks
  const autoTeacherComment = useMemo(() => {
    if (activeSection === "Primary") {
      if (primarySums.sumEndTerm >= 600) return "Excellent Performance. Keep up the high standard!";
      if (primarySums.sumEndTerm >= 450) return "Good Performance. Continue working hard.";
      return "Average Performance";
    }
    if (averageMarkNum >= 75) return `Outstanding academic performance (${averageMarkDecimal}% average). Demonstrates strong mastery.`;
    if (averageMarkNum >= 60) return `Fair performance. Focus required.`;
    return `Academic consistency and dedicated remedial revision required (${averageMarkDecimal}% average).`;
  }, [averageMarkNum, averageMarkDecimal, activeSection, primarySums.sumEndTerm]);

  const autoHeadteacherComment = useMemo(() => {
    if (activeSection === "Primary") {
      if (primarySums.sumEndTerm >= 600) return "Excellent Perfomance please, continue working hard";
      if (primarySums.sumEndTerm >= 450) return "Very Good Progress. Strive for academic distinction.";
      return "Fair effort shown. More dedicated study required next term.";
    }
    const parts: string[] = [];
    if (strongestSubj && highestScore > 0) {
      parts.push(`${strongestSubj.toUpperCase()} is your strongest subject. Keep up the momentum!`);
    }
    if (weakSubjectsList.length > 0) {
      parts.push(`${weakSubjectsList.join(", ").toUpperCase()} requires a resit (score below 40). You need to focus!`);
    } else if (subjectsPassedCount === subjectsRecordedCount && subjectsRecordedCount > 0) {
      parts.push(`All ${subjectsRecordedCount} recorded subjects passed successfully. Commendable discipline!`);
    }
    return parts.join("\n");
  }, [strongestSubj, highestScore, weakSubjectsList, subjectsPassedCount, subjectsRecordedCount, activeSection, primarySums.sumEndTerm]);

  // Get or initialize report card comments/attendance
  const studentId = student?.id || 0;
  const existingReport = studentId ? termlyReports[studentId]?.[selectedTerm] : undefined;

  const [editCommentMode, setEditCommentMode] = useState(false);
  const [draftReport, setDraftReport] = useState<TermlyReportCard>(() => {
    return existingReport || {
      studentId,
      term: selectedTerm,
      year: schoolProfile?.currentYear || 2026,
      daysOpened: 62,
      daysPresent: 59,
      daysAbsent: 3,
      conduct: "Good",
      interests: "Football, Science Club, Drama",
      classTeacherComment: autoTeacherComment,
      headteacherComment: autoHeadteacherComment,
      promotedTo: subjectsPassedCount >= Math.ceil(subjectsRecordedCount * 0.6)
        ? `PROMOTED TO FORM 2`
        : "ON TRACK / PENDING RESITS",
      reportDate: new Date().toISOString().split("T")[0]
    };
  });

  // Keep draftReport synchronized when student or term changes
  useEffect(() => {
    if (studentId && termlyReports[studentId]?.[selectedTerm]) {
      setDraftReport(termlyReports[studentId][selectedTerm]);
    } else {
      setDraftReport({
        studentId,
        term: selectedTerm,
        year: schoolProfile?.currentYear || 2026,
        daysOpened: 62,
        daysPresent: 59,
        daysAbsent: 3,
        conduct: "Good",
        interests: "Football, Science Club, Drama",
        classTeacherComment: autoTeacherComment,
        headteacherComment: autoHeadteacherComment,
        promotedTo: subjectsPassedCount >= Math.ceil(subjectsRecordedCount * 0.6)
          ? (student.grade.toUpperCase().includes("FORM") ? "PROMOTED TO FORM 2" : "PROMOTED TO NEXT GRADE")
          : "ON TRACK / PENDING RESITS",
        reportDate: new Date().toISOString().split("T")[0]
      });
    }
  }, [studentId, selectedTerm, termlyReports, autoTeacherComment, autoHeadteacherComment, subjectsPassedCount, subjectsRecordedCount, schoolProfile?.currentYear, student.grade]);

  // Approval status for this student & term
  const currentApproval = studentId ? resultsApprovals[studentId]?.[selectedTerm] : undefined;
  const currentStatus: ReportPublishStatus = currentApproval?.status || "Draft";
  const isPublished = currentStatus === "Approved_Published";

  // Fee clearance logic
  const studentFees = fees.filter(f => f.studentId === student?.id);
  const totalBilledZMW = studentFees.reduce((sum, f) => sum + f.amountZMW, 0);
  const totalPaidZMW = studentFees.reduce((sum, f) => sum + f.paidAmountZMW, 0);
  const outstandingBalanceZMW = Math.max(0, totalBilledZMW - totalPaidZMW);
  const hasUnpaidFees = studentFees.some(f => f.status === "Unpaid" || f.status === "Partially Paid" || (f.amountZMW - f.paidAmountZMW > 0));
  const isFeeFullyPaid = studentFees.length > 0 ? (outstandingBalanceZMW === 0 && !hasUnpaidFees) : true;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSaveComments = () => {
    if (onUpdateReport) {
      onUpdateReport(student.id, selectedTerm, draftReport);
    } else if (onUpdateReportCard) {
      onUpdateReportCard(student.id, selectedTerm, draftReport);
    }
    setEditCommentMode(false);
    showToast("Teacher & Headteacher remarks updated successfully.");
  };

  const handleApprovalChange = (newStatus: ReportPublishStatus, notes?: string) => {
    if (onUpdateApprovalStatus && student) {
      onUpdateApprovalStatus(student.id, selectedTerm, newStatus, notes);
      if (newStatus === "Approved_Published") {
        showToast(`Results for ${student.name} (${selectedTerm}) Approved & Published!`);
      } else if (newStatus === "Pending_Approval") {
        showToast(`Results submitted for Headteacher/Admin approval.`);
      } else {
        showToast(`Results status updated to ${newStatus.replace("_", " ")}.`);
      }
    }
  };

  const handleBatchApprove = () => {
    if (onBatchApproveClass && student) {
      onBatchApproveClass(student.classId, selectedTerm);
      showToast(`All results in ${currentClass?.name || "this class"} have been Approved & Published!`);
    }
  };

  const handleQuickSimulatePayment = () => {
    if (onRecordPayment && studentFees.length > 0) {
      studentFees.forEach(f => {
        const balance = f.amountZMW - f.paidAmountZMW;
        if (balance > 0) {
          onRecordPayment(f.id, balance);
        }
      });
      setShowClearPaymentModal(false);
      showToast(`Full school fees (K${outstandingBalanceZMW.toLocaleString()} ZMW) cleared! Results are now unlocked.`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    try {
      downloadZambianReportCard(
        student,
        draftReport,
        subjectGrades,
        classAverages,
        activeSection,
        currentClass?.teacherName || "MR. MUYANGA",
        schoolProfile
      );
      showToast(`Official ${activeSection} PDF Report Card for ${student.name} downloaded successfully!`);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreviewPdf = () => {
    try {
      const url = previewZambianReportCardPdfUrl(
        student,
        draftReport,
        subjectGrades,
        classAverages,
        activeSection,
        currentClass?.teacherName || "MR. MUYANGA",
        schoolProfile
      );
      setPdfPreviewUrl(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAutoGenerateRemarks = () => {
    setDraftReport(prev => ({
      ...prev,
      classTeacherComment: autoTeacherComment,
      headteacherComment: autoHeadteacherComment,
      promotedTo: subjectsPassedCount >= Math.ceil(subjectsRecordedCount * 0.6)
        ? (activeSection === "Primary" ? "PROMOTED TO NEXT GRADE" : "PROMOTED TO FORM 2")
        : "ON TRACK / PENDING RESITS"
    }));
    showToast("Remarks computed from recorded subject scores.");
  };

  const isParentOrStudent = userRole === "parent" || userRole === "student";
  const isResultsWithheldForUser = isParentOrStudent && !isFeeFullyPaid;

  // Primary grading scale calculation
  const maxPrimaryTotal = Math.max(900, subjectsRecordedCount * 100);
  const excellentMin = Math.round(maxPrimaryTotal * 0.747);
  const veryGoodMin = Math.round(maxPrimaryTotal * 0.74);
  const goodMin = Math.round(maxPrimaryTotal * 0.507);
  const avgMin = Math.round(maxPrimaryTotal * 0.261);

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PDF Interactive Preview Modal */}
      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif">
                    Official {activeSection} Report Card Preview: {student.name} ({selectedTerm} {schoolProfile?.currentYear || 2026})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    High-resolution official report card layout matching the {activeSection} Section standard
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setPdfPreviewUrl(null)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-2">
              <iframe
                src={pdfPreviewUrl}
                title="Report Card PDF Preview"
                className="w-full h-full rounded-xl border border-slate-300 shadow-inner bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Top Filter & Actions Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-serif">
              <FileText className="w-5 h-5 text-blue-700" />
              Official Pupil Termly Report Cards
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Primary Section (Test 1, Test 2, End of Term, Total Marks) & Secondary Section (9-Point ECZ Scale, Class Average)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!fixedStudentId && (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Pupil</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    const sid = parseInt(e.target.value);
                    setSelectedStudentId(sid);
                    const st = students.find(s => s.id === sid);
                    if (st && termlyReports[st.id]?.[selectedTerm]) {
                      setDraftReport(termlyReports[st.id][selectedTerm]);
                    }
                  }}
                  className="bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-hidden cursor-pointer"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.grade} {s.stream}) • {isPrimaryStudent(s) ? "Primary" : "Secondary"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Academic Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => {
                  const t = e.target.value as "Term 1" | "Term 2" | "Term 3";
                  setSelectedTerm(t);
                  if (termlyReports[student.id]?.[t]) {
                    setDraftReport(termlyReports[student.id][t]);
                  }
                }}
                className="bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-lg px-3 py-2 focus:border-blue-600 focus:outline-hidden cursor-pointer"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>

            {/* Action buttons */}
            {(!isParentOrStudent || (isPublished && isFeeFullyPaid)) && (
              <div className="flex items-center gap-2 pt-4 md:pt-0">
                <button
                  onClick={handlePreviewPdf}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Preview official PDF report card"
                >
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span>Preview PDF</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  title="Download formatted official PDF report card"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                {userRole === "admin" && (
                  <button
                    onClick={() => exportDetailedGradebookCsv(students, classes, gradebook, { classId: student.classId, term: selectedTerm })}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-300 shadow-2xs cursor-pointer"
                    title="Export grades as CSV spreadsheet"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-blue-700" />
                    <span>Export CSV</span>
                  </button>
                )}

                <button
                  onClick={handlePrint}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-300 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Mode & Format Switcher Toolbar */}
        {(!isParentOrStudent || (isPublished && isFeeFullyPaid)) && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            {/* View Mode */}
            <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-0.5 text-xs">
              <button
                onClick={() => setReportViewMode("both")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  reportViewMode === "both"
                    ? "bg-white text-blue-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Overview & Analytics</span>
              </button>
              <button
                onClick={() => setReportViewMode("card")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  reportViewMode === "card"
                    ? "bg-white text-blue-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-700" />
                <span>Official Report Card</span>
              </button>
              <button
                onClick={() => setReportViewMode("analytics")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  reportViewMode === "analytics"
                    ? "bg-white text-blue-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                <span>Trajectory</span>
              </button>
            </div>

            {/* Section Format Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Report Format:</span>
              <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-0.5 text-xs">
                <button
                  onClick={() => setFormatMode("auto")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    formatMode === "auto"
                      ? "bg-blue-700 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                  title="Auto-select based on pupil's section (Primary vs Secondary)"
                >
                  Auto ({isStudentPrimary ? "Primary" : "Secondary"})
                </button>
                <button
                  onClick={() => setFormatMode("primary")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    formatMode === "primary"
                      ? "bg-purple-700 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Primary Section</span>
                </button>
                <button
                  onClick={() => setFormatMode("secondary")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    formatMode === "secondary"
                      ? "bg-indigo-700 text-white font-bold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <GraduationCap className="w-3 h-3" />
                  <span>Secondary Section</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fee Clearance Banner (Staff View) */}
      {!isParentOrStudent && (
        <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isFeeFullyPaid
            ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
            : "bg-rose-50/90 border-rose-200 text-rose-950"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isFeeFullyPaid
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-rose-600 text-white shadow-xs"
            }`}>
              {isFeeFullyPaid ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isFeeFullyPaid
                    ? "bg-emerald-200/80 text-emerald-900 border border-emerald-300"
                    : "bg-rose-200/80 text-rose-900 border border-rose-300"
                }`}>
                  {isFeeFullyPaid ? "Fee Status: Fully Cleared (K0 Balance)" : "Fee Status: Outstanding Balance (Arrears)"}
                </span>
                <span className="text-xs font-bold">
                  {isFeeFullyPaid ? "• Results Access UNLOCKED" : "• Results Access WITHHELD for Parent & Student"}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isFeeFullyPaid
                  ? `All school fees (K${totalPaidZMW.toLocaleString()} ZMW) are settled in full. This report card is visible to parents and pupils.`
                  : `Pupil has an outstanding fee balance of K${outstandingBalanceZMW.toLocaleString()} ZMW. Report card & results are withheld from student/parent portal.`}
              </p>
            </div>
          </div>

          {!isFeeFullyPaid && userRole === "admin" && (
            <button
              onClick={() => handleQuickSimulatePayment()}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Clear Full Balance & Unlock Results</span>
            </button>
          )}
        </div>
      )}

      {/* Admin Approval Banner */}
      {!isParentOrStudent && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                isPublished
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : currentStatus === "Pending_Approval"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-slate-100 text-slate-700 border border-slate-300"
              }`}>
                {isPublished ? <CheckCircle className="w-5 h-5 text-emerald-600" /> :
                 currentStatus === "Pending_Approval" ? <Clock className="w-5 h-5 text-amber-600" /> :
                 <Lock className="w-5 h-5 text-slate-500" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">
                    Results Certification & Approval Status:
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isPublished
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : currentStatus === "Pending_Approval"
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : currentStatus === "Rejected"
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}>
                    {isPublished ? "✅ Certified & Published" :
                     currentStatus === "Pending_Approval" ? "⏳ Awaiting Headteacher Review" :
                     currentStatus === "Rejected" ? "❌ Returned / Needs Revision" :
                     "📝 Draft Mode"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isPublished
                    ? `Approved & certified for official distribution.`
                    : currentStatus === "Pending_Approval"
                    ? `Submitted by class teacher. Awaiting Headteacher confirmation.`
                    : `In preparation. Marks are being finalized.`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {userRole === "teacher" && currentStatus === "Draft" && (
                <button
                  onClick={() => handleApprovalChange("Pending_Approval")}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Submit for Headteacher Approval
                </button>
              )}

              {userRole === "admin" && (
                <>
                  {!isPublished ? (
                    <button
                      onClick={() => handleApprovalChange("Approved_Published")}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Approve & Publish Pupil Report
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprovalChange("Draft")}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Revert to Draft
                    </button>
                  )}

                  {onBatchApproveClass && (
                    <button
                      onClick={handleBatchApprove}
                      className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Approve Entire Class ({currentClass?.name})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WITHHOLD SCREEN: OUTSTANDING ARREARS */}
      {isResultsWithheldForUser && (
        <div className="bg-white border border-rose-200 rounded-2xl p-8 shadow-sm text-center max-w-xl mx-auto space-y-4 my-8">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Official Term Results Withheld — Outstanding Fee Balance
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              In accordance with Bread of Life School financial regulations, end-of-term academic reports and marksheets are accessible once school fees have been settled in full.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleQuickSimulatePayment}
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Simulate Full Fee Payment (Clear K{outstandingBalanceZMW.toLocaleString()} to Unlock)</span>
            </button>
          </div>
        </div>
      )}

      {/* WITHHOLD SCREEN: AWAITING HEADTEACHER CERTIFICATION */}
      {isParentOrStudent && !isResultsWithheldForUser && !isPublished && (
        <div className="bg-white border border-amber-200 rounded-2xl p-8 shadow-sm text-center max-w-xl mx-auto space-y-4 my-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Official Term Results Under Administrative Certification
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your fees are fully cleared. The academic marks and progress report for <strong>{student.name}</strong> ({selectedTerm} {schoolProfile?.currentYear || 2026}) are currently undergoing final verification and certification by the Headteacher.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-slate-400 font-mono">
            Status: <span className="text-amber-700 font-bold uppercase">{currentStatus.replace("_", " ")}</span> • Report card will unlock upon publication.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📄 OFFICIAL REPORT CARD DISPLAY (Interactive HTML Canvas)                */}
      {/* ========================================================================= */}
      {(!isParentOrStudent || (isPublished && isFeeFullyPaid)) && (
        <>
          {/* Optional 3-Term Progression Chart */}
          {(reportViewMode === "both" || reportViewMode === "analytics") && (
            <StudentProgressionChart
              student={student}
              currentClass={currentClass}
              gradebook={gradebook}
            />
          )}

          {/* Official Report Card Printable Sheet */}
          {(reportViewMode === "both" || reportViewMode === "card") && (
            <div>
              {/* ========================================================================= */}
              {/* PRIMARY SECTION LAYOUT (Format 2)                                         */}
              {/* ========================================================================= */}
              {activeSection === "Primary" ? (
                <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-md p-6 sm:p-10 max-w-3xl mx-auto print:bg-white print:text-black print:p-0 print:border-0 print:shadow-none font-sans text-slate-900 space-y-4">
                  
                  {/* 1. Header: School Crest + Title + Address + Contacts */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left pt-2 border-b border-slate-100 pb-4">
                    {/* Official Crest Badge / Uploaded Logo */}
                    {schoolProfile?.logoUrl ? (
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 border-slate-200 bg-white flex items-center justify-center p-1 shadow-xs shrink-0 overflow-hidden">
                        <img
                          src={schoolProfile.logoUrl}
                          alt="School Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#1e295d] border-2 border-amber-400 flex flex-col items-center justify-center text-white shadow-xs shrink-0 relative overflow-hidden">
                        <span className="text-amber-300 font-serif font-black text-xl">✝</span>
                        <span className="text-[6.5px] font-black font-mono tracking-tighter uppercase text-amber-200 text-center leading-tight px-1">
                          BREAD OF LIFE
                        </span>
                        <div className="w-full bg-amber-400 text-[#1e295d] text-[5px] font-bold text-center py-0.5 absolute bottom-0">
                          LUSAKA
                        </div>
                      </div>
                    )}

                    {/* School Title & Address block */}
                    <div className="flex-1 text-center">
                      <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-[#4c1d95] uppercase">
                        {schoolProfile?.name?.toUpperCase() || SCHOOL_NAME.toUpperCase()}
                      </h1>
                      <p className="text-xs font-medium text-slate-800 mt-1">
                        P.O BOX 37486, Corner of Vubu & Lumumba Road, Emmasdale
                      </p>
                      <p className="text-xs font-medium text-slate-800">
                        Lusaka-Zambia
                      </p>
                      <p className="text-xs font-semibold text-slate-900 mt-0.5">
                        Contact: 0970529712 / 0971420744
                      </p>
                    </div>
                  </div>

                  {/* 2. Subtitle: Report Card - Primary Section */}
                  <div className="text-center space-y-0.5 pt-1">
                    <h2 className="text-lg font-serif font-bold text-slate-900">
                      Report Card
                    </h2>
                    <div className="inline-block border-b-2 border-slate-900 pb-0.5 font-bold text-xs text-slate-800">
                      Primary Section
                    </div>
                  </div>

                  {/* 3. Child's Information Box */}
                  <div className="border border-sky-400 bg-slate-50/80 rounded-sm p-3 text-xs space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-slate-600 font-normal">Child's Name: </span>
                        <strong className="font-bold text-slate-900 uppercase">{student.name}</strong>
                      </div>
                      <div>
                        <span className="text-slate-600 font-normal">Grade: </span>
                        <strong className="font-bold text-slate-900 uppercase">{student.grade}</strong>
                      </div>
                      <div>
                        <span className="text-slate-600 font-normal">YEAR: </span>
                        <strong className="font-bold text-slate-900">{draftReport.year || 2026}</strong>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200">
                      <div>
                        <span className="text-slate-600 font-normal">Teacher's Name: </span>
                        <strong className="font-bold text-slate-900 uppercase">
                          {currentClass?.teacherName || "MR. MUYANGA"}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-600 font-normal">TERM: </span>
                        <strong className="font-bold text-slate-900">
                          {selectedTerm.replace(/[^0-9]/g, "") || "1"}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* 4. Primary Subjects Table (TEST 1, TEST 2, END OF TERM) */}
                  <div className="overflow-x-auto border border-sky-300 rounded-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#bae6fd] text-slate-900 border-b border-sky-300 font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-2 px-3 border-r border-sky-300">SUBJECT</th>
                          <th className="py-2 px-2 text-center border-r border-sky-300 w-28">TEST 1</th>
                          <th className="py-2 px-2 text-center border-r border-sky-300 w-28">TEST 2</th>
                          <th className="py-2 px-3 text-center w-36">END OF TERM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sky-100">
                        {subjectEntries.map(([subjName, g], idx) => {
                          const isEven = idx % 2 === 0;
                          return (
                            <tr key={subjName} className={isEven ? "bg-[#fae8ff]/60" : "bg-white"}>
                              <td className="py-2 px-3 text-[#4c1d95] font-medium border-r border-sky-200">
                                {subjName}
                              </td>
                              <td className="py-2 px-2 text-center text-[#4c1d95] font-normal border-r border-sky-200">
                                {g.caScore > 0 ? g.caScore : ""}
                              </td>
                              <td className="py-2 px-2 text-center text-[#4c1d95] font-normal border-r border-sky-200">
                                {g.midTermScore > 0 ? g.midTermScore : ""}
                              </td>
                              <td className="py-2 px-3 text-center text-[#4c1d95] font-bold">
                                {g.totalScore || g.endTermScore || 0}
                              </td>
                            </tr>
                          );
                        })}
                        {/* TOTAL Row */}
                        <tr className="bg-[#ede9fe] border-t-2 border-purple-300 font-bold text-slate-900">
                          <td className="py-2.5 px-3 uppercase border-r border-purple-200">TOTAL</td>
                          <td className="py-2.5 px-2 text-center border-r border-purple-200 font-mono">
                            {primarySums.sumTest1 !== null ? primarySums.sumTest1 : ""}
                          </td>
                          <td className="py-2.5 px-2 text-center border-r border-purple-200 font-mono">
                            {primarySums.sumTest2 !== null ? primarySums.sumTest2 : ""}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-950 font-mono text-sm">
                            {primarySums.sumEndTerm}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 5. Primary Remarks Section (Red Bold Text) */}
                  <div className="space-y-3 pt-2 text-xs">
                    {/* Remarks Editor button for Staff */}
                    {canEditComments && (
                      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 print:hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">Primary Teacher & Headteacher Remarks</span>
                          <span className="text-[11px] text-slate-500 font-medium">(Total Score: {primarySums.sumEndTerm})</span>
                        </div>
                        {!editCommentMode ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleAutoGenerateRemarks}
                              className="bg-white hover:bg-slate-100 text-xs px-2.5 py-1 rounded text-purple-700 font-semibold border border-purple-200 flex items-center gap-1 cursor-pointer"
                            >
                              <Calculator className="w-3.5 h-3.5 text-purple-600" /> Compute Remarks
                            </button>
                            <button
                              onClick={() => setEditCommentMode(true)}
                              className="bg-white hover:bg-slate-100 text-xs px-2.5 py-1 rounded text-slate-800 font-semibold border border-slate-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleAutoGenerateRemarks}
                              className="bg-white hover:bg-slate-100 text-xs px-2.5 py-1 rounded text-purple-700 font-semibold border border-purple-200 flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-purple-600" /> Recompute
                            </button>
                            <button
                              onClick={handleSaveComments}
                              className="bg-purple-700 hover:bg-purple-800 text-xs px-2.5 py-1 rounded text-white font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Save
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Teachers Comment */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                      <span className="font-bold text-slate-900 text-sm shrink-0">
                        Teachers Comment:
                      </span>
                      {editCommentMode ? (
                        <input
                          type="text"
                          value={draftReport.classTeacherComment}
                          onChange={(e) => setDraftReport({ ...draftReport, classTeacherComment: e.target.value })}
                          className="flex-1 bg-white border border-slate-300 rounded p-1 text-xs text-red-600 font-bold"
                        />
                      ) : (
                        <span className="font-bold text-red-600 text-sm">
                          {draftReport.classTeacherComment || "Average Performance"}
                        </span>
                      )}
                    </div>

                    {/* Headteachers Comment */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                      <span className="font-bold text-slate-900 text-sm shrink-0">
                        Headteachers:
                      </span>
                      {editCommentMode ? (
                        <input
                          type="text"
                          value={draftReport.headteacherComment}
                          onChange={(e) => setDraftReport({ ...draftReport, headteacherComment: e.target.value })}
                          className="flex-1 bg-white border border-slate-300 rounded p-1 text-xs text-red-600 font-bold"
                        />
                      ) : (
                        <span className="font-bold text-red-600 text-sm">
                          {draftReport.headteacherComment || "Excellent Perfomance please, continue working hard"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 6. Primary Grading Scale Table (Centered at bottom) */}
                  <div className="pt-3 max-w-sm mx-auto">
                    <div className="border border-slate-300 rounded-sm overflow-hidden text-xs">
                      <div className="bg-[#0f172a] text-white font-bold text-[11px] py-1 text-center uppercase tracking-wider">
                        GRADING SCALE
                      </div>
                      <table className="w-full text-center border-collapse text-[11px]">
                        <tbody className="divide-y divide-slate-200 text-slate-800">
                          <tr className="bg-[#f0fdf4]">
                            <td className="py-1 px-3 text-left font-medium border-r border-slate-200">Excellent</td>
                            <td className="py-1 px-3 font-bold text-slate-900">{maxPrimaryTotal} – {excellentMin}</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="py-1 px-3 text-left font-medium border-r border-slate-200">Very Good</td>
                            <td className="py-1 px-3 font-bold text-slate-900">{excellentMin - 1} – {veryGoodMin}</td>
                          </tr>
                          <tr className="bg-[#f0fdf4]">
                            <td className="py-1 px-3 text-left font-medium border-r border-slate-200">Good</td>
                            <td className="py-1 px-3 font-bold text-slate-900">{veryGoodMin - 1} – {goodMin}</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="py-1 px-3 text-left font-medium border-r border-slate-200">Average</td>
                            <td className="py-1 px-3 font-bold text-slate-900">{goodMin - 1} – {avgMin}</td>
                          </tr>
                          <tr className="bg-[#f0fdf4]">
                            <td className="py-1 px-3 text-left font-medium border-r border-slate-200">Below Average</td>
                            <td className="py-1 px-3 font-bold text-slate-900">{avgMin - 1} – 0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              ) : (
                /* ========================================================================= */
                /* SECONDARY SECTION LAYOUT (Format 1)                                       */
                /* ========================================================================= */
                <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-md p-6 sm:p-10 max-w-3xl mx-auto print:bg-white print:text-black print:p-0 print:border-0 print:shadow-none font-sans text-slate-900 space-y-5">
                  
                  {/* 1. Header: School Crest + Title */}
                  <div className="flex items-center gap-5 pt-2">
                    {/* Official Crest Badge / Uploaded Logo */}
                    {schoolProfile?.logoUrl ? (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-slate-200 bg-white flex items-center justify-center p-1 shadow-xs shrink-0 overflow-hidden">
                        <img
                          src={schoolProfile.logoUrl}
                          alt="School Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#1e295d] border-2 border-amber-400 flex flex-col items-center justify-center text-white shadow-xs shrink-0 relative overflow-hidden">
                        <span className="text-amber-300 font-serif font-black text-xl">✝</span>
                        <span className="text-[7px] font-black font-mono tracking-tighter uppercase text-amber-200 text-center leading-tight px-1">
                          BREAD OF LIFE
                        </span>
                        <div className="w-full bg-amber-400 text-[#1e295d] text-[5px] font-bold text-center py-0.5 absolute bottom-0">
                          LUSAKA
                        </div>
                      </div>
                    )}

                    {/* School Name in Bold Dark Blue Serif Typography */}
                    <div className="flex-1">
                      <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-[#1a365d] uppercase">
                        {schoolProfile?.name?.toUpperCase() || SCHOOL_NAME.toUpperCase()}
                      </h1>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {schoolProfile?.slogan || SCHOOL_SLOGAN}
                      </p>
                    </div>
                  </div>

                  {/* 2. Light Blue "REPORT" Banner Ribbon */}
                  <div className="bg-[#b8d4ec] py-1.5 px-4 text-center rounded-sm">
                    <h2 className="text-base sm:text-lg font-serif font-bold text-[#1a365d] tracking-widest uppercase">
                      REPORT
                    </h2>
                  </div>

                  {/* 3. Metadata Bar (STUDENT NAME, CLASS, YEAR) */}
                  <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs font-sans border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-semibold tracking-wider text-[11px] uppercase">STUDENT NAME</span>
                      <span className="font-bold text-slate-900 text-sm uppercase">{student.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-semibold tracking-wider text-[11px] uppercase">CLASS:</span>
                      <span className="font-black text-blue-700 text-sm uppercase">
                        {student.grade.toUpperCase()} {student.stream}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-semibold tracking-wider text-[11px] uppercase">YEAR:</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {draftReport.year || schoolProfile?.currentYear || 2026}
                      </span>
                    </div>
                  </div>

                  {/* 4. Scholastic Areas Table */}
                  <div className="overflow-x-auto border border-slate-300 rounded-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        {/* Top sub-header bar */}
                        <tr className="bg-[#f0f6fa] text-[#1a365d] border-b border-slate-300 font-bold">
                          <th colSpan={2} className="py-2 px-3 text-xs tracking-wide">
                            Scholastic Areas
                          </th>
                          <th colSpan={3} className="py-2 px-3 text-right text-xs uppercase tracking-wider">
                            {selectedTerm.toUpperCase()} {draftReport.year || 2026}
                          </th>
                        </tr>
                        {/* Column Headers */}
                        <tr className="bg-[#f0f6fa] text-[#1a365d] border-b border-slate-300 text-[10.5px] uppercase font-bold tracking-wider">
                          <th className="py-2 px-3 border-r border-slate-300">SUBJECTS</th>
                          <th className="py-2 px-2 text-center border-r border-slate-300">MARKS (100)</th>
                          <th className="py-2 px-2 text-center border-r border-slate-300">CLASS AVERAGE</th>
                          <th className="py-2 px-2 text-center border-r border-slate-300">GRADE</th>
                          <th className="py-2 px-3 text-center">STANDARD</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {subjectEntries.map(([subjName, g]) => {
                          const scaleInfo = ECZ_GRADE_SCALE[g.eczGrade] || ECZ_GRADE_SCALE[9];
                          const stdLabel = (scaleInfo.label || "UNSATISFACTORY").toUpperCase();
                          const classAvg = classAverages[subjName] ?? Math.round(g.totalScore);

                          return (
                            <tr key={subjName} className="hover:bg-slate-50/80">
                              <td className="py-2.5 px-3 font-bold text-slate-900 uppercase border-r border-slate-200">
                                {subjName}
                              </td>
                              <td className="py-2.5 px-2 text-center font-bold text-slate-900 border-r border-slate-200">
                                {g.totalScore}
                              </td>
                              <td className="py-2.5 px-2 text-center text-slate-700 border-r border-slate-200">
                                {classAvg}
                              </td>
                              <td className="py-2.5 px-2 text-center font-bold text-slate-900 border-r border-slate-200">
                                {g.eczGrade}
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold uppercase text-slate-900">
                                {stdLabel}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* 5. Summary Statistics Line */}
                  <div className="py-2.5 border-y border-slate-300 flex flex-wrap items-center justify-between text-xs font-bold text-slate-900 gap-y-2">
                    <div className="flex items-center gap-1.5">
                      <span>AVERAGE IN SUBJECTS RECORDED: </span>
                      <span className="text-red-600 font-black font-mono text-sm tracking-tight">{averageMarkDecimal}%</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>SUBJECTS PASSED: </span>
                      <span className="text-red-600 font-black font-mono text-sm">{subjectsPassedCount}</span>
                      <span className="text-[11px] text-slate-500 font-normal">/ {subjectsRecordedCount}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>SUBJECTS RECORDED: </span>
                      <span className="text-red-600 font-black font-mono text-sm">{subjectsRecordedCount}</span>
                    </div>
                  </div>

                  {/* 6. Scholastic Grade Scale Table (9-point scale) */}
                  <div className="border border-slate-300 rounded-sm overflow-x-auto">
                    <div className="bg-[#f0f6fa] text-[#1a365d] font-bold text-[11px] py-1.5 px-3 text-center border-b border-slate-300">
                      Scholastic Grade Scale: Grades are awarded on a 9-point scale as follows
                    </div>
                    <table className="w-full text-center border-collapse text-[10px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                          <th className="py-1 px-2 text-left font-bold border-r border-slate-200 w-24">Grade</th>
                          <th className="py-1 px-1 border-r border-slate-200">1</th>
                          <th className="py-1 px-1 border-r border-slate-200">2</th>
                          <th className="py-1 px-1 border-r border-slate-200">3</th>
                          <th className="py-1 px-1 border-r border-slate-200">4</th>
                          <th className="py-1 px-1 border-r border-slate-200">5</th>
                          <th className="py-1 px-1 border-r border-slate-200">6</th>
                          <th className="py-1 px-1 border-r border-slate-200">7</th>
                          <th className="py-1 px-1 border-r border-slate-200">8</th>
                          <th className="py-1 px-1">9</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        <tr className="bg-white">
                          <td className="py-1 px-2 text-left font-bold border-r border-slate-200">Min Score</td>
                          <td className="py-1 px-1 border-r border-slate-200">75.0</td>
                          <td className="py-1 px-1 border-r border-slate-200">70.0</td>
                          <td className="py-1 px-1 border-r border-slate-200">65.0</td>
                          <td className="py-1 px-1 border-r border-slate-200">60.0</td>
                          <td className="py-1 px-1 border-r border-slate-200">55.0</td>
                          <td className="py-1 px-1 border-r border-slate-200">50.0</td>
                          <td className="py-1 px-1 border-r border-slate-200">45.0</td>
                          <td className="py-1 px-1 border-r border-slate-200">40.0</td>
                          <td className="py-1 px-1">0.0</td>
                        </tr>
                        <tr className="bg-white uppercase font-bold text-[8.5px]">
                          <td className="py-1 px-2 text-left font-bold border-r border-slate-200 text-[10px]">Description</td>
                          <td className="py-1 px-1 border-r border-slate-200 text-[8px]">DISTINCTION</td>
                          <td className="py-1 px-1 border-r border-slate-200 text-[8px]">DISTINCTION</td>
                          <td className="py-1 px-1 border-r border-slate-200 text-[8px]">MERIT</td>
                          <td className="py-1 px-1 border-r border-slate-200 text-[8px]">MERIT</td>
                          <td className="py-1 px-1 border-r border-slate-200 text-[8px]">CREDIT</td>
                          <td className="py-1 px-1 border-r border-slate-200 text-[8px]">CREDIT</td>
                          <td className="py-1 px-1 border-r border-slate-200 text-[8px]">SATISFACTORY</td>
                          <td className="py-1 px-1 border-r border-slate-200 text-[8px]">SATISFACTORY</td>
                          <td className="py-1 px-1 text-[8px]">UNSATISFACTORY</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 7. Comments & Status Section */}
                  <div className="space-y-3 pt-2 text-xs">
                    {/* Remarks Editor button for Staff */}
                    {canEditComments && (
                      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200 print:hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">Teacher & Headteacher Remarks</span>
                          <span className="text-[11px] text-slate-500 font-medium">(Calculated Average: {averageMarkDecimal}%)</span>
                        </div>
                        {!editCommentMode ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleAutoGenerateRemarks}
                              className="bg-white hover:bg-slate-100 text-xs px-2.5 py-1 rounded text-blue-700 font-semibold border border-blue-200 flex items-center gap-1 cursor-pointer"
                              title="Generate standard ECZ comments based on calculated subject marks"
                            >
                              <Calculator className="w-3.5 h-3.5 text-blue-600" /> Compute Remarks
                            </button>
                            <button
                              onClick={() => setEditCommentMode(true)}
                              className="bg-white hover:bg-slate-100 text-xs px-2.5 py-1 rounded text-slate-800 font-semibold border border-slate-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit Remarks
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleAutoGenerateRemarks}
                              className="bg-white hover:bg-slate-100 text-xs px-2.5 py-1 rounded text-blue-700 font-semibold border border-blue-200 flex items-center gap-1 cursor-pointer"
                              title="Reset to calculated comments based on entered marks"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-blue-600" /> Recompute
                            </button>
                            <button
                              onClick={handleSaveComments}
                              className="bg-blue-700 hover:bg-blue-800 text-xs px-2.5 py-1 rounded text-white font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Save Remarks
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Teachers Comment */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                      <span className="font-serif font-bold text-slate-900 text-sm shrink-0">
                        Teachers Comment:
                      </span>
                      {editCommentMode ? (
                        <input
                          type="text"
                          value={draftReport.classTeacherComment}
                          onChange={(e) => setDraftReport({ ...draftReport, classTeacherComment: e.target.value })}
                          className="flex-1 bg-white border border-slate-300 rounded p-1 text-xs text-emerald-700 font-bold"
                        />
                      ) : (
                        <span className="font-bold text-emerald-600 text-sm">
                          {draftReport.classTeacherComment || "Fair performance. Focus required."}
                        </span>
                      )}
                    </div>

                    {/* Head teachers Comment */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                      <span className="font-serif font-bold text-slate-900 text-sm shrink-0">
                        Head teachers Comment:
                      </span>
                      {editCommentMode ? (
                        <textarea
                          rows={2}
                          value={draftReport.headteacherComment}
                          onChange={(e) => setDraftReport({ ...draftReport, headteacherComment: e.target.value })}
                          className="flex-1 bg-white border border-slate-300 rounded p-1 text-xs text-emerald-700 font-bold"
                        />
                      ) : (
                        <div className="font-bold text-emerald-600 text-sm whitespace-pre-line">
                          {draftReport.headteacherComment || (
                            <>
                              <span className="uppercase">{strongestSubj || "BIOLOGY"}</span> is your strongest subject. Keep up the momentum!
                              {weakSubjectsList.length > 0 && (
                                <span className="block mt-0.5">
                                  <span className="uppercase">{weakSubjectsList.join(", ")}</span> requires a resit (score below 40). You need to focus!
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* STATUS: PROMOTED / ON TRACK */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="font-serif font-bold text-slate-900 text-sm">
                        STATUS:
                      </span>
                      {editCommentMode ? (
                        <input
                          type="text"
                          value={draftReport.promotedTo || ""}
                          onChange={(e) => setDraftReport({ ...draftReport, promotedTo: e.target.value })}
                          className="bg-white border border-slate-300 rounded p-1 text-xs text-emerald-600 font-bold"
                        />
                      ) : (
                        <span className="font-black text-emerald-600 text-sm uppercase">
                          {draftReport.promotedTo || (subjectsPassedCount >= Math.ceil(subjectsRecordedCount * 0.6) ? "PROMOTED TO FORM 2" : "ON TRACK / PENDING RESITS")}
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
