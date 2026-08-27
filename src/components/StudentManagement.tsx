import React, { useState } from "react";
import {
  Student,
  ClassStream,
  Teacher,
  AcademicBatch,
  SubjectDefinition,
  SecondaryPathway,
  SchoolSection,
  SchoolProfile
} from "../types";
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Upload,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Sparkles,
  Layers,
  BookOpen,
  BookmarkCheck,
  Building2,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  Filter,
  UserCheck,
  IdCard,
  Eye,
  X,
  Phone,
  Mail,
  ChevronRight
} from "lucide-react";
import { BulkStudentImportModal } from "./BulkStudentImportModal";
import { ClassCreationModal } from "./ClassCreationModal";
import { BatchCreationModal } from "./BatchCreationModal";
import { SubjectCreationModal } from "./SubjectCreationModal";
import { StudentCreationModal } from "./StudentCreationModal";
import {
  downloadStudentImportTemplateCsv,
  exportStudentRosterCsv,
  exportClassesCsv,
  exportBatchesCsv,
  exportSubjectsCatalogCsv
} from "../utils/csvExporter";
import { SECONDARY_PATHWAYS } from "../data/zambianSchoolData";

export interface StudentManagementProps {
  students: Student[];
  classes: ClassStream[];
  teachers?: Teacher[];
  batches?: AcademicBatch[];
  subjectsCatalog?: SubjectDefinition[];
  onAddStudent: (newStudent: Omit<Student, "id">) => void;
  onAddBulkStudents?: (newStudents: Omit<Student, "id">[]) => void;
  onEditStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (id: number) => void;
  onAddClass?: (newClass: Omit<ClassStream, "id"> | ClassStream) => void;
  onEditClass?: (updatedClass: ClassStream) => void;
  onDeleteClass?: (classId: number) => void;
  onAddBatch?: (newBatch: AcademicBatch) => void;
  onEditBatch?: (updatedBatch: AcademicBatch) => void;
  onDeleteBatch?: (batchId: string) => void;
  onAddSubject?: (newSubject: SubjectDefinition) => void;
  onEditSubject?: (updatedSubject: SubjectDefinition) => void;
  onDeleteSubject?: (subjectId: string) => void;
  canManage: boolean;
  schoolProfile?: SchoolProfile;
}

export function StudentManagement({
  students,
  classes,
  teachers = [],
  batches = [],
  subjectsCatalog = [],
  onAddStudent,
  onAddBulkStudents,
  onEditStudent,
  onDeleteStudent,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddBatch,
  onEditBatch,
  onDeleteBatch,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  canManage = true,
  schoolProfile
}: StudentManagementProps) {
  // Main Sub-Tab Navigation
  const [activeSubTab, setActiveSubTab] = useState<"pupils" | "classes" | "batches" | "subjects">("pupils");

  // Filter States for Pupils
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassFilter, setSelectedClassFilter] = useState<number | "all">("all");
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string | "all">("all");
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<SchoolSection | "all">("all");
  const [selectedPathwayFilter, setSelectedPathwayFilter] = useState<SecondaryPathway | "all">("all");

  // Filter States for Classes
  const [classSectionFilter, setClassSectionFilter] = useState<SchoolSection | "all">("all");
  const [classSearch, setClassSearch] = useState("");

  // Filter States for Subjects
  const [subjectDeptFilter, setSubjectDeptFilter] = useState<string>("all");
  const [subjectSearch, setSubjectSearch] = useState("");

  // Filter States for Batches
  const [batchStatusFilter, setBatchStatusFilter] = useState<string>("all");

  // Modals state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showBulkStudentModal, setShowBulkStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassStream | null>(null);

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<AcademicBatch | null>(null);

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectDefinition | null>(null);

  // Student Profile Quick View Modal
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- PUPIL FILTERING ---
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.eczNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.pathway && s.pathway.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass = selectedClassFilter === "all" || s.classId === selectedClassFilter;
    const matchesBatch = selectedBatchFilter === "all" || s.batchId === selectedBatchFilter;
    const matchesSection = selectedSectionFilter === "all" || s.section === selectedSectionFilter;
    const matchesPathway = selectedPathwayFilter === "all" || s.pathway === selectedPathwayFilter;

    return matchesSearch && matchesClass && matchesBatch && matchesSection && matchesPathway;
  });

  // --- CLASS FILTERING ---
  const filteredClasses = classes.filter(c => {
    const matchesSec = classSectionFilter === "all" || c.section === classSectionFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(classSearch.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(classSearch.toLowerCase()) ||
      c.streamName.toLowerCase().includes(classSearch.toLowerCase()) ||
      (c.room && c.room.toLowerCase().includes(classSearch.toLowerCase()));
    return matchesSec && matchesSearch;
  });

  // --- SUBJECT FILTERING ---
  const filteredSubjects = subjectsCatalog.filter(sub => {
    const matchesDept = subjectDeptFilter === "all" || sub.department === subjectDeptFilter;
    const matchesSearch =
      sub.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      sub.code.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      (sub.assignedTeacherName && sub.assignedTeacherName.toLowerCase().includes(subjectSearch.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  // --- BATCH FILTERING ---
  const filteredBatches = batches.filter(b => {
    const matchesStatus = batchStatusFilter === "all" || b.status === batchStatusFilter;
    return matchesStatus;
  });

  // Calculate quick stats
  const totalEnrolled = students.length;
  const primaryCount = students.filter(s => s.section === "Primary" || s.grade.includes("Grade 1") || s.grade.includes("Grade 3") || s.grade.includes("Grade 5") || s.grade.includes("Grade 7")).length;
  const secondaryCount = students.length - primaryCount;
  const totalClassesCount = classes.length;
  const totalBatchesCount = batches.length;
  const totalSubjectsCount = subjectsCatalog.length;

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Sub-Tabs Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                Academic Management Hub
              </span>
              <span className="text-xs text-slate-400 font-medium">Session 2026</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-serif mt-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Pupils, Classes, Batches & Subjects
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Empowering teachers and school administration to manage student admissions, class streams, cohort batches, and subject allocations.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <div className="px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-center min-w-[70px]">
              <div className="text-xs font-bold text-emerald-900">{totalEnrolled}</div>
              <div className="text-[10px] text-emerald-700 font-medium">Pupils</div>
            </div>
            <div className="px-3 py-2 bg-sky-50 border border-sky-100 rounded-xl text-center min-w-[70px]">
              <div className="text-xs font-bold text-sky-900">{totalClassesCount}</div>
              <div className="text-[10px] text-sky-700 font-medium">Classes</div>
            </div>
            <div className="px-3 py-2 bg-amber-50 border border-amber-100 rounded-xl text-center min-w-[70px]">
              <div className="text-xs font-bold text-amber-900">{totalBatchesCount}</div>
              <div className="text-[10px] text-amber-700 font-medium">Batches</div>
            </div>
            <div className="px-3 py-2 bg-purple-50 border border-purple-100 rounded-xl text-center min-w-[70px]">
              <div className="text-xs font-bold text-purple-900">{totalSubjectsCount}</div>
              <div className="text-[10px] text-purple-700 font-medium">Subjects</div>
            </div>
          </div>
        </div>

        {/* 4 Primary Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 pb-1 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("pupils")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === "pupils"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pupil Directory & Admissions ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("classes")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === "classes"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Classes & Streams ({classes.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("batches")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === "batches"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Batches & Cohorts ({batches.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("subjects")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === "subjects"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Curriculum Subjects ({subjectsCatalog.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SUB-TAB: PUPIL DIRECTORY & ADMISSIONS                                 */}
      {/* ========================================================================= */}
      {activeSubTab === "pupils" && (
        <div className="space-y-4">
          {/* Action & Filter Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by pupil name, ECZ no, guardian or pathway..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-slate-800 bg-slate-50/50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const filterDesc =
                      selectedClassFilter !== "all"
                        ? classes.find((c) => c.id === selectedClassFilter)?.name
                        : selectedSectionFilter !== "all"
                        ? selectedSectionFilter
                        : "All_Pupils";
                    exportStudentRosterCsv(filteredStudents, classes, filterDesc, batches);
                    triggerToast(`Exported ${filteredStudents.length} pupil records to CSV / Excel format.`);
                  }}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Export current filtered pupil table to CSV / Excel"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV ({filteredStudents.length})</span>
                </button>

                {canManage && (
                  <>
                    <button
                      onClick={() => setShowBulkStudentModal(true)}
                      className="px-3 py-2 border border-emerald-200 bg-emerald-50/80 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Bulk CSV Import</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingStudent(null);
                        setShowStudentModal(true);
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Enrol New Pupil</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filters:
              </span>

              {/* Section Filter */}
              <select
                value={selectedSectionFilter}
                onChange={(e) => setSelectedSectionFilter(e.target.value as any)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              >
                <option value="all">All Sections (Baby Class to Form 4)</option>
                <option value="Early Childhood">Early Childhood (Baby to Reception)</option>
                <option value="Primary">Primary Section (Grades 1-7)</option>
                <option value="Secondary">Secondary Section (Forms 1-4)</option>
              </select>

              {/* Class Stream Filter */}
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              >
                <option value="all">All Class Streams</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Batch Cohort Filter */}
              {batches.length > 0 && (
                <select
                  value={selectedBatchFilter}
                  onChange={(e) => setSelectedBatchFilter(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
                >
                  <option value="all">All Academic Batches</option>
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              )}

              {/* Pathway Filter */}
              <select
                value={selectedPathwayFilter}
                onChange={(e) => setSelectedPathwayFilter(e.target.value as any)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium"
              >
                <option value="all">All Secondary Pathways</option>
                <option value="Natural Sciences">Natural Sciences</option>
                <option value="Business & Commercial">Business & Commercial</option>
                <option value="Social Sciences & Humanities">Social Sciences & Humanities</option>
                <option value="Technical & Vocational">Technical & Vocational</option>
                <option value="Junior Secondary Core">Junior Secondary Core</option>
              </select>

              {(searchQuery || selectedClassFilter !== "all" || selectedBatchFilter !== "all" || selectedSectionFilter !== "all" || selectedPathwayFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedClassFilter("all");
                    setSelectedBatchFilter("all");
                    setSelectedSectionFilter("all");
                    setSelectedPathwayFilter("all");
                  }}
                  className="text-[11px] text-rose-600 hover:underline ml-auto font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Pupils Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Pupil Bio & ECZ No.</th>
                    <th className="py-3 px-4">Class Stream</th>
                    <th className="py-3 px-4">Academic Batch</th>
                    <th className="py-3 px-4">Pathway / Section</th>
                    <th className="py-3 px-4">Guardian Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-medium text-slate-600">No pupils match the current search filters</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your filters or click "+ Enrol New Pupil"</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => {
                      const cls = classes.find(c => c.id === st.classId);
                      const batch = batches.find(b => b.id === st.batchId);
                      const isSecondary = (cls?.gradeNum || 7) >= 8 || st.section === "Secondary";

                      return (
                        <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Pupil Bio */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                st.gender === "Female"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}>
                                {st.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{st.name}</div>
                                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                  <span>ECZ: {st.eczNo}</span>
                                  <span>•</span>
                                  <span>{st.gender}, {st.age} yrs</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Class Stream */}
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800">{cls?.name || `${st.grade} ${st.stream}`}</span>
                            <div className="text-[10px] text-slate-400">{cls?.teacherName || "Class Teacher"}</div>
                          </td>

                          {/* Academic Batch */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200 inline-block max-w-[150px] truncate">
                              {batch?.name || "2026 Main Cohort"}
                            </span>
                          </td>

                          {/* Pathway / Section */}
                          <td className="py-3 px-4">
                            {isSecondary ? (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                st.pathway === "Natural Sciences"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : st.pathway === "Business & Commercial"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : st.pathway === "Social Sciences & Humanities"
                                  ? "bg-purple-100 text-purple-800 border-purple-200"
                                  : "bg-sky-100 text-sky-800 border-sky-200"
                              }`}>
                                {st.pathway || "Junior Sec Core"}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                Primary (ECZ)
                              </span>
                            )}
                          </td>

                          {/* Guardian Contact */}
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">{st.guardianName}</div>
                            <div className="text-[10px] text-slate-500">{st.guardianPhone}</div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.status === "Active"
                                ? "bg-emerald-100 text-emerald-800"
                                : st.status === "Transferred"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                            }`}>
                              {st.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setViewingStudent(st)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="View Pupil ID Profile"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {canManage && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingStudent(st);
                                      setShowStudentModal(true);
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                                    title="Edit Pupil Details"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete ${st.name}?`)) {
                                        onDeleteStudent(st.id);
                                        triggerToast(`Pupil ${st.name} removed.`);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                    title="Delete Pupil"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Showing {filteredStudents.length} of {students.length} pupils</span>
              <button
                onClick={() => downloadStudentImportTemplateCsv()}
                className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Download Sample CSV Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUB-TAB: CLASSES & STREAMS MANAGEMENT                                 */}
      {/* ========================================================================= */}
      {activeSubTab === "classes" && (
        <div className="space-y-4">
          {/* Classes Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search class, stream, teacher..."
                  value={classSearch}
                  onChange={(e) => setClassSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden text-slate-800"
                />
              </div>

              <select
                value={classSectionFilter}
                onChange={(e) => setClassSectionFilter(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              >
                <option value="all">All Sections</option>
                <option value="Primary">Primary (Grades 1-7)</option>
                <option value="Secondary">Secondary (Grades 8-12)</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  exportClassesCsv(filteredClasses, students, batches);
                  triggerToast(`Exported ${filteredClasses.length} class streams to CSV / Excel format.`);
                }}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                title="Export classes and capacity utilization to CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export Classes CSV</span>
              </button>

              {canManage && (
                <button
                  onClick={() => {
                    setEditingClass(null);
                    setShowClassModal(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Class / Stream</span>
                </button>
              )}
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls) => {
              const enrolledInClass = students.filter(s => s.classId === cls.id);
              const capacity = cls.capacity || 40;
              const fillPercentage = Math.min(100, Math.round((enrolledInClass.length / capacity) * 100));
              const batch = batches.find(b => b.id === cls.batchId);
              const isExam = cls.gradeNum === 7 || cls.gradeNum === 9 || cls.gradeNum === 12;

              return (
                <div
                  key={cls.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Name & Section Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 font-serif text-sm">
                            {cls.name}
                          </h3>
                          {isExam && (
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                              ECZ Exam
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{cls.room || "Main Class"}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        cls.section === "Primary"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-sky-50 text-sky-800 border-sky-200"
                      }`}>
                        {cls.section || (cls.gradeNum >= 8 ? "Secondary" : "Primary")}
                      </span>
                    </div>

                    {/* Pathway Info if secondary */}
                    {cls.pathway && (
                      <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate font-medium">{cls.pathway}</span>
                      </div>
                    )}

                    {/* Teacher Details */}
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {cls.teacherName ? cls.teacherName.charAt(0) : "T"}
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Class Teacher</div>
                        <div className="font-bold text-slate-800 text-[11px]">{cls.teacherName || "Unassigned"}</div>
                      </div>
                    </div>

                    {/* Cohort Batch */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                      <BookOpen className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">Cohort: <span className="font-medium text-slate-800">{batch?.name || "2026 Main"}</span></span>
                    </div>
                  </div>

                  {/* Bottom: Capacity Bar & Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-600">Enrolled Pupils:</span>
                      <span className="font-mono font-bold text-slate-900">{enrolledInClass.length} / {capacity} ({fillPercentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillPercentage > 90
                            ? "bg-rose-500"
                            : fillPercentage > 70
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedClassFilter(cls.id);
                          setActiveSubTab("pupils");
                        }}
                        className="text-[11px] font-bold text-sky-700 hover:underline flex items-center gap-0.5"
                      >
                        <span>View {enrolledInClass.length} Pupils</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>

                      {canManage && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingClass(cls);
                              setShowClassModal(true);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                            title="Edit Class Stream"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {onDeleteClass && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete class ${cls.name}?`)) {
                                  onDeleteClass(cls.id);
                                  triggerToast(`Class stream ${cls.name} deleted.`);
                                }
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Class"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-TAB: ACADEMIC BATCHES & COHORTS                                    */}
      {/* ========================================================================= */}
      {activeSubTab === "batches" && (
        <div className="space-y-4">
          {/* Batches Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Filter Status:</span>
              <select
                value={batchStatusFilter}
                onChange={(e) => setBatchStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              >
                <option value="all">All Cohort Statuses</option>
                <option value="Active">Active Cohorts</option>
                <option value="Upcoming">Upcoming Admissions</option>
                <option value="Graduated">Graduated / Alumni</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  exportBatchesCsv(filteredBatches, classes, students);
                  triggerToast(`Exported ${filteredBatches.length} academic cohort batches to CSV / Excel format.`);
                }}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                title="Export cohort batches to CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export Batches CSV</span>
              </button>

              {canManage && (
                <button
                  onClick={() => {
                    setEditingBatch(null);
                    setShowBatchModal(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Academic Batch</span>
                </button>
              )}
            </div>
          </div>

          {/* Batches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBatches.map((batch) => {
              const enrolledClasses = classes.filter(c => c.batchId === batch.id);
              const enrolledPupils = students.filter(s => s.batchId === batch.id || enrolledClasses.some(c => c.id === s.classId));

              return (
                <div
                  key={batch.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                          {batch.code}
                        </span>
                        <h3 className="font-bold text-slate-900 font-serif text-sm mt-1">
                          {batch.name}
                        </h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        batch.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : batch.status === "Upcoming"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {batch.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                      {batch.description || "Academic year cohort encompassing scheduled examinations and coursework."}
                    </p>

                    {/* Metadata Badges */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl">
                      <div>
                        <div className="text-[10px] text-slate-400">Academic Year</div>
                        <div className="font-bold text-slate-800">{batch.academicYear} ({batch.intakeTerm})</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Lead Patron</div>
                        <div className="font-bold text-slate-800 truncate">{batch.leadTeacherName || "Head of Section"}</div>
                      </div>
                    </div>

                    {/* Target Grades */}
                    <div className="mt-2.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Grades</div>
                      <div className="flex flex-wrap gap-1">
                        {batch.targetGrades.map((g, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px]">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Stats & Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-[11px] text-slate-600">
                      <span className="font-bold text-slate-900">{enrolledClasses.length}</span> classes • <span className="font-bold text-slate-900">{enrolledPupils.length}</span> pupils
                    </div>

                    {canManage && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingBatch(batch);
                            setShowBatchModal(true);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                          title="Edit Batch"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteBatch && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete batch ${batch.name}?`)) {
                                onDeleteBatch(batch.id);
                                triggerToast(`Batch ${batch.name} deleted.`);
                              }
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Batch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-TAB: CURRICULUM SUBJECTS CATALOGUE                                */}
      {/* ========================================================================= */}
      {activeSubTab === "subjects" && (
        <div className="space-y-4">
          {/* Subjects Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subject, ECZ code, teacher..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden text-slate-800"
                />
              </div>

              <select
                value={subjectDeptFilter}
                onChange={(e) => setSubjectDeptFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              >
                <option value="all">All Departments</option>
                <option value="Mathematics & Computing">Mathematics & Computing</option>
                <option value="Natural Sciences">Natural Sciences</option>
                <option value="Languages">Languages</option>
                <option value="Social Sciences">Social Sciences</option>
                <option value="Business Studies">Business Studies</option>
                <option value="Practical Skills">Practical Skills</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  exportSubjectsCatalogCsv(filteredSubjects);
                  triggerToast(`Exported ${filteredSubjects.length} curriculum subjects to CSV / Excel format.`);
                }}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                title="Export subjects catalog to CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Export Subjects CSV</span>
              </button>

              {canManage && (
                <button
                  onClick={() => {
                    setEditingSubject(null);
                    setShowSubjectModal(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Subject to Curriculum</span>
                </button>
              )}
            </div>
          </div>

          {/* Subjects Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Subject Name & Code</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Category / Section</th>
                    <th className="py-3 px-4">Applicable Grades</th>
                    <th className="py-3 px-4">Periods & Pass Mark</th>
                    <th className="py-3 px-4">Subject Head</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        <BookmarkCheck className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-medium text-slate-600">No curriculum subjects found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Name & Code */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {sub.code ? sub.code.slice(0, 3) : "SUB"}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{sub.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">ECZ Code: {sub.code}</div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-700">{sub.department}</span>
                        </td>

                        {/* Category / Section */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              sub.category === "Core"
                                ? "bg-emerald-100 text-emerald-800"
                                : sub.category === "Elective"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-sky-100 text-sky-800"
                            }`}>
                              {sub.category}
                            </span>
                            <span className="text-[10px] text-slate-400">{sub.section}</span>
                          </div>
                        </td>

                        {/* Applicable Grades */}
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {sub.gradesApplicable.map(g => (
                              <span key={g} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">
                                G{g}
                              </span>
                            ))}
                          </div>
                          {sub.pathway && (
                            <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">{sub.pathway}</div>
                          )}
                        </td>

                        {/* Periods & Pass Mark */}
                        <td className="py-3 px-4">
                          <div className="text-slate-800 font-medium">{sub.weeklyPeriods} periods / wk</div>
                          <div className="text-[10px] text-slate-400">Pass: {sub.passMark}%</div>
                        </td>

                        {/* Subject Head */}
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-800">{sub.assignedTeacherName || "Department Head"}</span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          {canManage && (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditingSubject(sub);
                                  setShowSubjectModal(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                                title="Edit Subject"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              {onDeleteSubject && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete subject ${sub.name}?`)) {
                                      onDeleteSubject(sub.id);
                                      triggerToast(`Subject ${sub.name} deleted.`);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete Subject"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS SECTION                                                           */}
      {/* ========================================================================= */}

      {/* 1. Pupil Creation / Edit Modal */}
      <StudentCreationModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        onSaveStudent={(data) => {
          if (editingStudent) {
            onEditStudent(data as Student);
            triggerToast(`Pupil ${data.name} profile updated successfully.`);
          } else {
            onAddStudent(data as Omit<Student, "id">);
            triggerToast(`New pupil ${data.name} enrolled successfully.`);
          }
        }}
        editingStudent={editingStudent}
        classes={classes}
        batches={batches}
      />

      {/* 2. Bulk Student CSV Import Modal */}
      <BulkStudentImportModal
        isOpen={showBulkStudentModal}
        onClose={() => setShowBulkStudentModal(false)}
        classes={classes}
        existingStudents={students}
        onImportStudents={(imported) => {
          if (onAddBulkStudents) {
            onAddBulkStudents(imported);
          } else {
            imported.forEach(st => onAddStudent(st));
          }
          triggerToast(`Successfully imported ${imported.length} pupils from CSV!`);
        }}
      />

      {/* 3. Class Creation / Edit Modal */}
      <ClassCreationModal
        isOpen={showClassModal}
        onClose={() => setShowClassModal(false)}
        onSaveClass={(data) => {
          if (editingClass && onEditClass) {
            onEditClass(data as ClassStream);
            triggerToast(`Class ${data.name} updated successfully.`);
          } else if (onAddClass) {
            onAddClass(data);
            triggerToast(`New class stream ${data.name} created successfully.`);
          }
        }}
        editingClass={editingClass}
        teachers={teachers}
        batches={batches}
      />

      {/* 4. Batch Creation / Edit Modal */}
      <BatchCreationModal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        onSaveBatch={(data) => {
          if (editingBatch && onEditBatch) {
            onEditBatch(data);
            triggerToast(`Batch ${data.name} updated successfully.`);
          } else if (onAddBatch) {
            onAddBatch(data);
            triggerToast(`New academic batch ${data.name} created successfully.`);
          }
        }}
        editingBatch={editingBatch}
        teachers={teachers}
      />

      {/* 5. Subject Creation / Edit Modal */}
      <SubjectCreationModal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        onSaveSubject={(data) => {
          if (editingSubject && onEditSubject) {
            onEditSubject(data);
            triggerToast(`Subject ${data.name} updated successfully.`);
          } else if (onAddSubject) {
            onAddSubject(data);
            triggerToast(`New subject ${data.name} added to curriculum.`);
          }
        }}
        editingSubject={editingSubject}
        teachers={teachers}
      />

      {/* 6. Pupil ID Profile Card Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* ID Card Header */}
            <div className="bg-emerald-800 text-white p-5 text-center relative">
              <button
                onClick={() => setViewingStudent(null)}
                className="absolute right-3 top-3 p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-full bg-white text-emerald-800 flex items-center justify-center mx-auto font-bold text-lg shadow-md mb-2">
                {viewingStudent.name.charAt(0)}
              </div>
              <h3 className="font-bold font-serif text-base">{viewingStudent.name}</h3>
              <p className="text-xs text-emerald-200 font-mono">ECZ: {viewingStudent.eczNo}</p>
            </div>

            {/* ID Details Body */}
            <div className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Class Stream</div>
                  <div className="font-bold text-slate-800">{viewingStudent.grade} {viewingStudent.stream}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Gender & Age</div>
                  <div className="font-bold text-slate-800">{viewingStudent.gender}, {viewingStudent.age} Years</div>
                </div>
              </div>

              {viewingStudent.pathway && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Secondary Career Pathway</div>
                  <div className="font-bold text-emerald-950">{viewingStudent.pathway}</div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Guardian: <strong className="text-slate-900">{viewingStudent.guardianName}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Phone: <strong className="text-slate-900">{viewingStudent.guardianPhone}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Email: <strong className="text-slate-900">{viewingStudent.guardianEmail}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => setViewingStudent(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
