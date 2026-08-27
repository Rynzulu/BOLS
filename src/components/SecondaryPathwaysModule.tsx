import React, { useState } from "react";
import { Student, ClassStream, SecondaryPathway, UserSession, SecondaryPathwayInfo } from "../types";
import { SECONDARY_PATHWAYS } from "../data/zambianSchoolData";
import {
  Atom,
  TrendingUp,
  BookOpen,
  Wrench,
  GraduationCap,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ChevronRight,
  ArrowRight,
  Award,
  Layers,
  FileSpreadsheet,
  Download,
  Info
} from "lucide-react";
import { downloadCsvFile, escapeCsvCell } from "../utils/csvExporter";

interface SecondaryPathwaysModuleProps {
  session?: UserSession;
  students: Student[];
  classes: ClassStream[];
  onUpdateStudent: (updated: Student) => void;
  showToast?: (msg: string) => void;
  canManage?: boolean;
}

export function SecondaryPathwaysModule({
  session,
  students,
  classes,
  onUpdateStudent,
  showToast,
  canManage = true
}: SecondaryPathwaysModuleProps) {
  const [selectedPathwayTab, setSelectedPathwayTab] = useState<SecondaryPathway | "All">("All");
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPathwayDetails, setSelectedPathwayDetails] = useState<SecondaryPathwayInfo | null>(
    SECONDARY_PATHWAYS["Natural Sciences"]
  );
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [studentToAssign, setStudentToAssign] = useState<Student | null>(null);
  const [newPathwaySelection, setNewPathwaySelection] = useState<SecondaryPathway>("Natural Sciences");
  const [assignmentNote, setAssignmentNote] = useState("");

  // Filter only secondary students (Grades 8 to 12)
  const secondaryStudents = students.filter(s => {
    const num = parseInt(s.grade.replace(/\D/g, ""), 10);
    return num >= 8 && num <= 12;
  });

  // Filtered secondary students
  const filteredStudents = secondaryStudents.filter(s => {
    const matchesPathway =
      selectedPathwayTab === "All" ||
      s.pathway === selectedPathwayTab ||
      (!s.pathway && selectedPathwayTab === "Junior Secondary Core" && (s.grade === "Grade 8" || s.grade === "Grade 9"));

    const matchesGrade = selectedGradeFilter === "All" || s.grade === selectedGradeFilter;

    const matchesSearch =
      searchQuery.trim() === "" ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.eczNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.guardianName && s.guardianName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesPathway && matchesGrade && matchesSearch;
  });

  // Analytics counts
  const countNaturalSciences = secondaryStudents.filter(s => s.pathway === "Natural Sciences").length;
  const countBusiness = secondaryStudents.filter(s => s.pathway === "Business & Commercial").length;
  const countHumanities = secondaryStudents.filter(s => s.pathway === "Social Sciences & Humanities").length;
  const countTechnical = secondaryStudents.filter(s => s.pathway === "Technical & Vocational").length;
  const countJuniorCore = secondaryStudents.filter(
    s => s.pathway === "Junior Secondary Core" || s.grade === "Grade 8" || s.grade === "Grade 9"
  ).length;

  const countGrade9Candidates = secondaryStudents.filter(s => s.grade === "Grade 9").length;
  const countGrade12Candidates = secondaryStudents.filter(s => s.grade === "Grade 12").length;

  const getPathwayIcon = (id: SecondaryPathway) => {
    switch (id) {
      case "Natural Sciences":
        return <Atom className="w-5 h-5 text-emerald-600" />;
      case "Business & Commercial":
        return <TrendingUp className="w-5 h-5 text-amber-600" />;
      case "Social Sciences & Humanities":
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      case "Technical & Vocational":
        return <Wrench className="w-5 h-5 text-sky-600" />;
      case "Junior Secondary Core":
        return <GraduationCap className="w-5 h-5 text-slate-600" />;
    }
  };

  const getPathwayBadge = (pathway?: SecondaryPathway) => {
    switch (pathway) {
      case "Natural Sciences":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Atom className="w-3.5 h-3.5 text-emerald-600" />
            Natural Sciences & STEM
          </span>
        );
      case "Business & Commercial":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            Business & Commercial
          </span>
        );
      case "Social Sciences & Humanities":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            Social Sciences & Arts
          </span>
        );
      case "Technical & Vocational":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <Wrench className="w-3.5 h-3.5 text-sky-600" />
            Technical & TEVET
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            Junior Secondary Core
          </span>
        );
    }
  };

  const handleOpenAssignModal = (student: Student) => {
    setStudentToAssign(student);
    setNewPathwaySelection(student.pathway || "Natural Sciences");
    setAssignmentNote("");
    setIsAssignModalOpen(true);
  };

  const handleSavePathwayAssignment = () => {
    if (!studentToAssign) return;

    // Find matching class for student's grade and pathway
    const gradeNum = parseInt(studentToAssign.grade.replace(/\D/g, ""), 10);
    const targetClass = classes.find(
      c => c.gradeNum === gradeNum && (c.pathway === newPathwaySelection || !c.pathway)
    ) || classes.find(c => c.gradeNum === gradeNum);

    const updatedStudent: Student = {
      ...studentToAssign,
      pathway: newPathwaySelection,
      classId: targetClass ? targetClass.id : studentToAssign.classId,
      stream: targetClass ? targetClass.streamName : studentToAssign.stream
    };

    onUpdateStudent(updatedStudent);
    setIsAssignModalOpen(false);
    showToast(`Assigned ${studentToAssign.name} to ${SECONDARY_PATHWAYS[newPathwaySelection].name}`);
  };

  const handleExportPathwayRoster = () => {
    const headers = [
      "Reference No",
      "Pupil Name",
      "Gender",
      "Age",
      "Grade",
      "Stream",
      "Secondary Pathway",
      "Class Teacher",
      "Guardian Name",
      "Guardian Phone"
    ];

    const rows = filteredStudents.map(s => {
      const cls = classes.find(c => c.id === s.classId);
      return [
        s.eczNo,
        s.name,
        s.gender,
        String(s.age),
        s.grade,
        s.stream,
        s.pathway || "Junior Secondary Core",
        cls ? cls.teacherName : "N/A",
        s.guardianName,
        s.guardianPhone
      ];
    });

    const csvContent = [headers, ...rows].map(row => row.map(escapeCsvCell).join(",")).join("\r\n");
    downloadCsvFile(csvContent, `Bread_of_Life_Secondary_Pathways_${selectedPathwayTab.replace(/\s+/g, "_")}.csv`);
    showToast("Secondary Pathways roster downloaded successfully.");
  };

  return (
    <div id="secondary-pathways-container" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <GraduationCap className="w-3.5 h-3.5" />
                Bread of Life Secondary Section
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                Grades 8 – 12
              </span>
            </div>
            <h2 className="text-2xl font-bold font-serif tracking-tight text-white">
              Secondary Education & Senior Curriculum Pathways
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Standardized 2-Tier Secondary Curriculum comprising Junior Secondary (Grades 8–9) and Senior Secondary (Grades 10–12) 
              specialized pathways tailored for higher education degree programs and technical industry vocations.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="export-pathway-roster-btn"
              onClick={handleExportPathwayRoster}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              Export Pathway Roster
            </button>
          </div>
        </div>

        {/* Section Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-400 font-medium">Total Secondary</p>
            <p className="text-2xl font-bold text-white mt-1">{secondaryStudents.length}</p>
            <p className="text-[11px] text-emerald-400">Enrolled pupils</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            <p className="text-xs text-emerald-300 font-medium">Natural Sciences</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{countNaturalSciences}</p>
            <p className="text-[11px] text-slate-400">STEM & Medicine</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            <p className="text-xs text-amber-300 font-medium">Business & Finance</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{countBusiness}</p>
            <p className="text-[11px] text-slate-400">Accounts & Commerce</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            <p className="text-xs text-purple-300 font-medium">Social Sciences</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{countHumanities}</p>
            <p className="text-[11px] text-slate-400">Law & Humanities</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            <p className="text-xs text-sky-300 font-medium">Technical / TEVET</p>
            <p className="text-2xl font-bold text-sky-400 mt-1">{countTechnical}</p>
            <p className="text-[11px] text-slate-400">Applied Technology</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-300 font-medium">Exam Candidates</p>
            <p className="text-2xl font-bold text-white mt-1">{countGrade9Candidates + countGrade12Candidates}</p>
            <p className="text-[11px] text-slate-400">G9 ({countGrade9Candidates}) / G12 ({countGrade12Candidates})</p>
          </div>
        </div>
      </div>

      {/* Pathway Explorers & Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.values(SECONDARY_PATHWAYS).map(pathway => {
          const isSelected = selectedPathwayDetails?.id === pathway.id;
          return (
            <div
              key={pathway.id}
              onClick={() => setSelectedPathwayDetails(pathway)}
              className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    {getPathwayIcon(pathway.id)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {pathway.code}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-3 leading-snug">{pathway.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pathway.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {pathway.id === "Natural Sciences"
                    ? `${countNaturalSciences} pupils`
                    : pathway.id === "Business & Commercial"
                    ? `${countBusiness} pupils`
                    : pathway.id === "Social Sciences & Humanities"
                    ? `${countHumanities} pupils`
                    : pathway.id === "Technical & Vocational"
                    ? `${countTechnical} pupils`
                    : `${countJuniorCore} pupils`}
                </span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  View <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pathway Detailed Specifications Card */}
      {selectedPathwayDetails && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                {getPathwayIcon(selectedPathwayDetails.id)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-lg">{selectedPathwayDetails.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {selectedPathwayDetails.level}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedPathwayDetails.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedPathwayTab(selectedPathwayDetails.id)}
                className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition"
              >
                Filter Pupils in this Pathway
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Core Compulsory Subjects */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Core Compulsory Subjects
                </h4>
              </div>
              <ul className="space-y-2">
                {selectedPathwayDetails.coreSubjects.map(subj => (
                  <li key={subj} className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{subj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specialization & Electives */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-sky-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Pathway Specialization / Electives
                </h4>
              </div>
              <ul className="space-y-2">
                {selectedPathwayDetails.specializationSubjects.map(subj => (
                  <li key={subj} className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                    <span className="font-medium">{subj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Career & University Roadmap */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Higher Education & Careers
                </h4>
              </div>
              <ul className="space-y-2">
                {selectedPathwayDetails.careerPaths.map(career => (
                  <li key={career} className="flex items-center gap-2 text-xs text-slate-700">
                    <ArrowRight className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{career}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Entry / Placement Recommendation: </span>
              {selectedPathwayDetails.entryRequirements}
            </div>
          </div>
        </div>
      )}

      {/* Secondary Pupils Pathway Enrollment Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Secondary Pupil Pathway Enrollments</h3>
            <p className="text-xs text-slate-500">
              Manage student pathway allocations, stream placement, and secondary examination candidacies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search pupil or reference..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52"
              />
            </div>

            {/* Grade Filter */}
            <select
              value={selectedGradeFilter}
              onChange={e => setSelectedGradeFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            >
              <option value="All">All Grades (8–12)</option>
              <option value="Grade 8">Grade 8 (Junior Sec)</option>
              <option value="Grade 9">Grade 9 (Junior Exam)</option>
              <option value="Grade 10">Grade 10 (Senior Sec)</option>
              <option value="Grade 11">Grade 11 (Senior Sec)</option>
              <option value="Grade 12">Grade 12 (Senior Exam)</option>
            </select>
          </div>
        </div>

        {/* Pathway Filter Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setSelectedPathwayTab("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedPathwayTab === "All"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Secondary ({secondaryStudents.length})
          </button>
          <button
            onClick={() => setSelectedPathwayTab("Natural Sciences")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedPathwayTab === "Natural Sciences"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            Natural Sciences ({countNaturalSciences})
          </button>
          <button
            onClick={() => setSelectedPathwayTab("Business & Commercial")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedPathwayTab === "Business & Commercial"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Business & Commercial ({countBusiness})
          </button>
          <button
            onClick={() => setSelectedPathwayTab("Social Sciences & Humanities")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedPathwayTab === "Social Sciences & Humanities"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-purple-50 text-purple-800 hover:bg-purple-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Social Sciences ({countHumanities})
          </button>
          <button
            onClick={() => setSelectedPathwayTab("Technical & Vocational")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedPathwayTab === "Technical & Vocational"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-sky-50 text-sky-800 hover:bg-sky-100"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            Technical & TEVET ({countTechnical})
          </button>
          <button
            onClick={() => setSelectedPathwayTab("Junior Secondary Core")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedPathwayTab === "Junior Secondary Core"
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Junior Core ({countJuniorCore})
          </button>
        </div>

        {/* Table of Enrolled Students */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Reference No</th>
                <th className="py-3 px-3">Pupil Full Name</th>
                <th className="py-3 px-3">Gender / Age</th>
                <th className="py-3 px-3">Grade & Stream</th>
                <th className="py-3 px-3">Assigned Pathway</th>
                <th className="py-3 px-3">Class Teacher</th>
                <th className="py-3 px-3">Guardian Contact</th>
                {(session.role === "admin" || session.role === "teacher") && (
                  <th className="py-3 px-3 text-center">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No secondary students match the chosen criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const cls = classes.find(c => c.id === student.classId);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-medium text-slate-900">{student.eczNo}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{student.name}</td>
                      <td className="py-3 px-3 text-slate-600">
                        {student.gender}, {student.age} yrs
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{student.grade}</span>{" "}
                        <span className="text-slate-500 font-medium">({student.stream})</span>
                      </td>
                      <td className="py-3 px-3">{getPathwayBadge(student.pathway)}</td>
                      <td className="py-3 px-3 text-slate-600">{cls ? cls.teacherName : "N/A"}</td>
                      <td className="py-3 px-3 text-slate-600">
                        <div>{student.guardianName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{student.guardianPhone}</div>
                      </td>
                      {(session.role === "admin" || session.role === "teacher") && (
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleOpenAssignModal(student)}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition"
                          >
                            Change Pathway
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign / Change Pathway Modal */}
      {isAssignModalOpen && studentToAssign && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Assign Secondary Pathway</h3>
                  <p className="text-xs text-slate-500">
                    {studentToAssign.name} ({studentToAssign.grade} - {studentToAssign.eczNo})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Senior Secondary Pathway
                </label>
                <div className="space-y-2">
                  {Object.values(SECONDARY_PATHWAYS).map(p => (
                    <label
                      key={p.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        newPathwaySelection === p.id
                          ? "bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="pathwayRadio"
                        checked={newPathwaySelection === p.id}
                        onChange={() => setNewPathwaySelection(p.id)}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{p.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                            {p.code}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{p.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Counseling / Guidance Remark (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Student demonstrated strong analytical competencies in Grade 9 mathematics and sciences."
                  value={assignmentNote}
                  onChange={e => setAssignmentNote(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePathwayAssignment}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition shadow-xs"
              >
                Confirm Pathway Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
