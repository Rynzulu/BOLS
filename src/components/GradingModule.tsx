import React, { useState, useRef, useEffect } from "react";
import {
  Student,
  ClassStream,
  GradebookData,
  SubjectAssessment,
  EczGradePoint,
  TermResultsApproval
} from "../types";
import {
  getZambianSubjectsForGrade,
  calculateEczGrade,
  GRADE_SCALE
} from "../data/zambianSchoolData";
import {
  exportDetailedGradebookCsv,
  exportSummaryMatrixCsv
} from "../utils/csvExporter";
import {
  Award,
  Save,
  CheckCircle2,
  Calculator,
  Info,
  FileSpreadsheet,
  Download,
  ChevronDown,
  Check,
  Table,
  Layers,
  Database
} from "lucide-react";

interface GradingModuleProps {
  classes: ClassStream[];
  students: Student[];
  gradebook: GradebookData;
  onUpdateGradebook: (newGradebook: GradebookData) => void;
  canEdit: boolean;
  resultsApprovals?: Record<number, Record<string, TermResultsApproval>> | TermResultsApproval[];
  onUpdateApprovalStatus?: (studentIdOrApprovalId: any, termOrStatus: any, statusOrApprovedBy?: any, notesOrComment?: string) => void;
  onBatchApproveClass?: (classId: number, term?: any, academicYearOrApprovedBy?: any, approvedByOrComment?: string) => void;
  isHeadteacher?: boolean;
  filterTeacherName?: string;
  filterStudentId?: number;
}

export function GradingModule({
  classes,
  students,
  gradebook,
  onUpdateGradebook,
  canEdit,
  resultsApprovals = [],
  onUpdateApprovalStatus,
  onBatchApproveClass,
  isHeadteacher = false,
  filterTeacherName,
  filterStudentId
}: GradingModuleProps) {
  const [selectedClassId, setSelectedClassId] = useState<number>(classes[0]?.id || 1);
  const [selectedTerm, setSelectedTerm] = useState<string>("Term 1");
  
  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classSubjects = getZambianSubjectsForGrade(currentClass?.gradeNum || 7);
  const initialSubject = classSubjects[0] || "English Language";
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);

  const classStudents = students.filter(s => s.classId === selectedClassId);

  // Local draft state for editing marks before saving
  const [draftScores, setDraftScores] = useState<Record<number, { ca: string; mid: string; end: string }>>(() => {
    const init: Record<number, { ca: string; mid: string; end: string }> = {};
    classStudents.forEach(s => {
      const existing = gradebook[selectedClassId]?.[selectedTerm]?.[initialSubject]?.[s.id];
      init[s.id] = {
        ca: existing ? String(existing.caScore) : "20",
        mid: existing ? String(existing.midTermScore) : "12",
        end: existing ? String(existing.endTermScore) : "30"
      };
    });
    return init;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync draft scores when class/term/subject changes
  const handleSubjectOrClassChange = (classId: number, term: string, subject: string) => {
    setSelectedClassId(classId);
    setSelectedTerm(term);
    setSelectedSubject(subject);

    const targetStudents = students.filter(s => s.classId === classId);
    const newDraft: Record<number, { ca: string; mid: string; end: string }> = {};
    targetStudents.forEach(s => {
      const existing = gradebook[classId]?.[term]?.[subject]?.[s.id];
      newDraft[s.id] = {
        ca: existing ? String(existing.caScore) : "20",
        mid: existing ? String(existing.midTermScore) : "12",
        end: existing ? String(existing.endTermScore) : "30"
      };
    });
    setDraftScores(newDraft);
  };

  const handleScoreChange = (studentId: number, field: "ca" | "mid" | "end", val: string) => {
    setDraftScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { ca: "0", mid: "0", end: "0" }),
        [field]: val
      }
    }));
  };

  const handleSaveGrades = () => {
    const updatedGb: GradebookData = JSON.parse(JSON.stringify(gradebook));

    if (!updatedGb[selectedClassId]) updatedGb[selectedClassId] = {};
    if (!updatedGb[selectedClassId][selectedTerm]) updatedGb[selectedClassId][selectedTerm] = {};
    if (!updatedGb[selectedClassId][selectedTerm][selectedSubject]) {
      updatedGb[selectedClassId][selectedTerm][selectedSubject] = {};
    }

    classStudents.forEach(s => {
      const draft = draftScores[s.id] || { ca: "0", mid: "0", end: "0" };
      const caScore = Math.min(30, Math.max(0, parseInt(draft.ca) || 0));
      const midTermScore = Math.min(20, Math.max(0, parseInt(draft.mid) || 0));
      const endTermScore = Math.min(50, Math.max(0, parseInt(draft.end) || 0));
      const totalScore = caScore + midTermScore + endTermScore;
      const gz = calculateEczGrade(totalScore);

      updatedGb[selectedClassId][selectedTerm][selectedSubject][s.id] = {
        caScore,
        midTermScore,
        endTermScore,
        totalScore,
        eczGrade: gz.point,
        remark: gz.remark,
        teacherInitials: "T.C."
      };
    });

    onUpdateGradebook(updatedGb);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // CSV Export Handlers
  const handleExportCurrentSubject = () => {
    exportDetailedGradebookCsv(students, classes, gradebook, {
      classId: selectedClassId,
      term: selectedTerm,
      subject: selectedSubject
    });
    setShowExportMenu(false);
    setExportNotice(`Exported ${selectedSubject} CSV for ${currentClass.name} (${selectedTerm})`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleExportClassMasterMatrix = () => {
    exportSummaryMatrixCsv(selectedClassId, selectedTerm, students, classes, gradebook);
    setShowExportMenu(false);
    setExportNotice(`Exported Master Summary Matrix CSV for ${currentClass.name} (${selectedTerm})`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  const handleExportFullSchoolBackup = () => {
    exportDetailedGradebookCsv(students, classes, gradebook, {});
    setShowExportMenu(false);
    setExportNotice(`Exported Full School Master Gradebook Backup CSV`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Filter Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-serif">
              <Calculator className="w-5 h-5 text-emerald-600" />
              Student Assessment & Primary Grading
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Test 1 (30%) + Midterm Test (20%) + End-Term Exam (50%) = Grade Point (1-9)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Class Stream</label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  const cid = parseInt(e.target.value);
                  const cls = classes.find(c => c.id === cid);
                  const subs = getZambianSubjectsForGrade(cls?.gradeNum || 7);
                  handleSubjectOrClassChange(cid, selectedTerm, subs[0] || "English Language");
                }}
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.teacherName})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Academic Term</label>
              <select
                value={selectedTerm}
                onChange={(e) => handleSubjectOrClassChange(selectedClassId, e.target.value, selectedSubject)}
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none"
              >
                <option value="Term 1">Term 1 (Jan - Apr)</option>
                <option value="Term 2">Term 2 (May - Aug)</option>
                <option value="Term 3">Term 3 (Sep - Dec)</option>
              </select>
            </div>

            {/* Export CSV Dropdown in Filter Bar */}
            <div className="relative self-end" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => setShowExportMenu(prev => !prev)}
                className="bg-white border border-slate-300 hover:border-emerald-500 text-slate-800 hover:text-emerald-700 text-xs font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export CSV</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      Export Gradebook to Spreadsheet
                    </p>
                    <p className="text-[10px] text-slate-500">Compatible with Microsoft Excel, Google Sheets, & Numbers</p>
                  </div>

                  <button
                    onClick={handleExportCurrentSubject}
                    className="w-full px-3 py-2.5 text-left hover:bg-emerald-50 flex items-start gap-2.5 transition-colors group"
                  >
                    <Table className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-emerald-800">
                        Export {selectedSubject} CSV
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Current subject scores for {currentClass.name} ({selectedTerm})
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleExportClassMasterMatrix}
                    className="w-full px-3 py-2.5 text-left hover:bg-emerald-50 flex items-start gap-2.5 transition-colors group border-t border-slate-100"
                  >
                    <Layers className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-sky-800">
                        Class Summary Matrix CSV
                      </p>
                      <p className="text-[10px] text-slate-500">
                        All subjects in columns + Average % & Best 5 Aggregate Points
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleExportFullSchoolBackup}
                    className="w-full px-3 py-2.5 text-left hover:bg-emerald-50 flex items-start gap-2.5 transition-colors group border-t border-slate-100"
                  >
                    <Database className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-purple-800">
                        Full School Master Backup CSV
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Complete archive of all classes, terms, and pupils
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject Pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
          {classSubjects.map(subj => (
            <button
              key={subj}
              onClick={() => handleSubjectOrClassChange(selectedClassId, selectedTerm, subj)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSubject === subj
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Grading Legend Banner */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-bold text-emerald-950">Primary Grading Key:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">1-2: Distinction (70-100%)</span>
          <span className="bg-sky-100 border border-sky-300 text-sky-900 px-2 py-0.5 rounded font-mono font-bold">3-4: Merit (60-69%)</span>
          <span className="bg-amber-100 border border-amber-300 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">5-6: Credit (50-59%)</span>
          <span className="bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">7-8: Satisfactory (40-49%)</span>
          <span className="bg-rose-100 border border-rose-300 text-rose-900 px-2 py-0.5 rounded font-mono font-bold">9: Unsatisfactory (0-39%)</span>
        </div>
      </div>

      {/* Export Notice Feedback */}
      {exportNotice && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 text-xs text-sky-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            <span className="font-bold">{exportNotice}</span>
          </div>
          <span className="text-[10px] text-sky-600 font-mono">Downloaded (.CSV)</span>
        </div>
      )}

      {/* Grade Entry Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Grade Sheet: <span className="text-emerald-700">{selectedSubject}</span> — {currentClass.name}
            </h3>
            <p className="text-xs text-slate-500">Showing {classStudents.length} enrolled pupils for {selectedTerm}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCurrentSubject}
              className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Download CSV for this subject"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export This Sheet</span>
            </button>

            {canEdit && (
              <button
                onClick={handleSaveGrades}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Class Assessment</span>
              </button>
            )}
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2 justify-center font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Assessment marks and grade points successfully saved!
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Pupil Name</th>
                <th className="py-3 px-4">Test 1 (30%)</th>
                <th className="py-3 px-4">Midterm Test (20%)</th>
                <th className="py-3 px-4">End Exam (50%)</th>
                <th className="py-3 px-4">Total (100%)</th>
                <th className="py-3 px-4">Grade Point</th>
                <th className="py-3 px-4">Descriptor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((student) => {
                const draft = draftScores[student.id] || { ca: "20", mid: "12", end: "30" };
                const caVal = Math.min(30, Math.max(0, parseInt(draft.ca) || 0));
                const midVal = Math.min(20, Math.max(0, parseInt(draft.mid) || 0));
                const endVal = Math.min(50, Math.max(0, parseInt(draft.end) || 0));
                const total = caVal + midVal + endVal;
                const gz = calculateEczGrade(total);
                const scaleInfo = GRADE_SCALE[gz.point];

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{student.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Ref: {student.eczNo}</p>
                    </td>

                    <td className="py-3 px-4">
                      {canEdit ? (
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={draft.ca}
                          onChange={(e) => handleScoreChange(student.id, "ca", e.target.value)}
                          className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      ) : (
                        <span className="font-bold text-slate-700">{caVal}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {canEdit ? (
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={draft.mid}
                          onChange={(e) => handleScoreChange(student.id, "mid", e.target.value)}
                          className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      ) : (
                        <span className="font-bold text-slate-700">{midVal}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {canEdit ? (
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={draft.end}
                          onChange={(e) => handleScoreChange(student.id, "end", e.target.value)}
                          className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-center font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      ) : (
                        <span className="font-bold text-slate-700">{endVal}</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-sm text-slate-900 font-mono">
                        {total}%
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                        gz.point <= 2
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : gz.point <= 4
                          ? "bg-sky-100 text-sky-800 border-sky-300"
                          : gz.point <= 6
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-rose-100 text-rose-800 border-rose-300"
                      }`}>
                        Grade {gz.point}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-600 font-medium">{scaleInfo.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
