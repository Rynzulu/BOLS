import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Student, ClassStream } from "../types";
import {
  downloadStudentImportTemplateCsv,
  parseStudentImportCsv,
  ParsedStudentImportRow,
  StudentImportResult
} from "../utils/csvExporter";
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  FileText,
  Trash2,
  Users,
  Check,
  Sparkles,
  HelpCircle,
  Info
} from "lucide-react";

interface BulkStudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: ClassStream[];
  existingStudents: Student[];
  onImportStudents: (newStudents: Omit<Student, "id">[]) => void;
}

export function BulkStudentImportModal({
  isOpen,
  onClose,
  classes,
  existingStudents,
  onImportStudents
}: BulkStudentImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<StudentImportResult | null>(null);
  const [defaultClassOverride, setDefaultClassOverride] = useState<string>("auto");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv" && file.type !== "application/vnd.ms-excel") {
      alert("Please select a valid CSV (.csv) file format.");
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        const result = parseStudentImportCsv(text, classes, existingStudents);
        setParsedData(result);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      alert("Error reading file. Please check file permissions and try again.");
      setIsProcessing(false);
    };
    reader.readAsText(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSampleData = () => {
    const sampleCsv = `Pupil Full Name,Gender,Age,Grade,Stream,Reference No,Guardian Full Name,Guardian Phone,Guardian Email
Chilufya Mwape,Male,12,Grade 7,Eagle,26010045081,Besa Mwape,+260 977 123456,besa.mwape@example.com
Mapalo Chileshe,Female,12,Grade 7,Eagle,26010045082,Joyce Chileshe,+260 966 234567,joyce.c@example.com
Dalitso Sakala,Male,11,Grade 6,Falcon,26010045083,Reuben Sakala,+260 955 345678,reuben.sakala@example.com
Kondwani Lungu,Male,10,Grade 5,Lion,26010045084,Patrick Lungu,+260 971 456789,patrick.l@example.com
Bupe Tembo,Female,9,Grade 4,Cheetah,26010045085,Dorothy Tembo,+260 978 567890,dorothy.t@example.com`;

    setFileName("Sample_Bread_of_Life_Pupils_Batch.csv");
    setFileSize("1.2 KB");
    const result = parseStudentImportCsv(sampleCsv, classes, existingStudents);
    setParsedData(result);
  };

  const handleRemoveRow = (index: number) => {
    if (!parsedData) return;
    const updated = [...parsedData.validRows];
    updated.splice(index, 1);
    setParsedData({
      ...parsedData,
      validRows: updated
    });
  };

  const handleConfirmImport = () => {
    if (!parsedData || parsedData.validRows.length === 0) return;

    const overrideClassObj = defaultClassOverride !== "auto" 
      ? classes.find(c => c.id === parseInt(defaultClassOverride))
      : null;

    const studentsToEnrol: Omit<Student, "id">[] = parsedData.validRows.map(row => {
      const targetClass = overrideClassObj || classes.find(c => c.id === row.classId) || classes[0];
      const username = row.name.toLowerCase().replace(/[^a-z0-9]/g, ".") + (Math.floor(10 + Math.random() * 89));
      const gradeNum = targetClass.gradeNum;
      const isSec = gradeNum >= 8;

      return {
        eczNo: row.eczNo,
        name: row.name,
        gender: row.gender,
        grade: `Grade ${targetClass.gradeNum}`,
        stream: targetClass.streamName,
        classId: targetClass.id,
        section: isSec ? "Secondary" : "Primary",
        pathway: row.pathway || targetClass.pathway || (isSec ? "Junior Secondary Core" : undefined),
        age: row.age,
        guardianName: row.guardianName,
        guardianPhone: row.guardianPhone,
        guardianEmail: row.guardianEmail,
        status: "Active",
        username: username,
        password: "demo123"
      };
    });

    onImportStudents(studentsToEnrol);
    onClose();
  };

  const validCount = parsedData?.validRows.length || 0;
  const invalidCount = parsedData?.invalidRows.length || 0;
  const warningCount = parsedData?.validRows.filter(r => r.status === "Warning").length || 0;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-serif">
                Bulk Enrol Pupils via CSV Spreadsheet
              </h2>
              <p className="text-xs text-slate-500">
                Upload student rosters, Bread of Life candidate reference numbers, and guardian details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Step 1 & 2 Guidance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Step 1: Download Standard Template</span>
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  CSV Template
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Use the official Bread of Life template with columns for Pupil Name, Gender, Grade, Stream, Reference Number, and Guardian phone.
              </p>
              <button
                type="button"
                onClick={downloadStudentImportTemplateCsv}
                className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Pupil_Import_Template.csv</span>
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Quick Test Option</span>
                </span>
                <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                  Instant Demo
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Want to test without creating a file? Load 5 pre-configured Zambian primary pupil records instantly.
              </p>
              <button
                type="button"
                onClick={handleLoadSampleData}
                className="w-full py-2 px-3 bg-sky-50 hover:bg-sky-100 border border-sky-300 rounded-lg font-bold text-sky-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load 5 Sample Pupil Records</span>
              </button>
            </div>
          </div>

          {/* Upload Drop Zone */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv,application/vnd.ms-excel"
              onChange={handleFileInput}
              className="hidden"
              id="csv-file-upload-input"
            />

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-emerald-500 bg-emerald-50/50 scale-[0.99]"
                  : "border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-slate-50"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    Drag and drop your filled pupil CSV file here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    or click anywhere in this box to browse from your computer
                  </p>
                </div>

                {fileName && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold border border-emerald-300">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>{fileName}</span>
                    <span className="text-[10px] text-emerald-700 font-mono">({fileSize})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Parse Results Preview Table */}
          {parsedData && (
            <div className="space-y-4">
              {/* Summary Metrics Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{validCount} Ready for Enrolment</span>
                  </div>

                  {warningCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{warningCount} with Auto-Corrections</span>
                    </div>
                  )}

                  {invalidCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                      <XCircle className="w-4 h-4" />
                      <span>{invalidCount} Skipped (Missing Name)</span>
                    </div>
                  )}
                </div>

                {/* Stream Override Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-600">Assign all to:</label>
                  <select
                    value={defaultClassOverride}
                    onChange={(e) => setDefaultClassOverride(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="auto">Auto (Match CSV Grade & Stream)</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (Room {c.room})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Pupil Full Name</th>
                        <th className="py-2.5 px-3">Gender / Age</th>
                        <th className="py-2.5 px-3">Bread of Life Reference</th>
                        <th className="py-2.5 px-3">Target Stream</th>
                        <th className="py-2.5 px-3">Guardian Contact</th>
                        <th className="py-2.5 px-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {parsedData.validRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                            {row.rowNumber}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.status === "Valid" ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                Valid
                              </span>
                            ) : (
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800"
                                title={row.notes}
                              >
                                Warning
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            {row.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {row.gender}, {row.age} yrs
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                            {row.eczNo}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-800 border border-slate-200">
                              {defaultClassOverride !== "auto"
                                ? classes.find(c => c.id === parseInt(defaultClassOverride))?.name
                                : row.className}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            <div className="truncate max-w-[140px]" title={`${row.guardianName} (${row.guardianPhone})`}>
                              <span className="font-semibold text-slate-800">{row.guardianName}</span>
                              <span className="text-[10px] block text-slate-400 font-mono">{row.guardianPhone}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(idx)}
                              className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Remove from import queue"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notice / Guidance */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p>
                  Each imported pupil will automatically receive a portal username formatted as <span className="font-mono font-bold">firstname.lastname</span> with default password <span className="font-mono font-bold">demo123</span> for self-service report card and fee checks.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={validCount === 0 || isProcessing}
              onClick={handleConfirmImport}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                validCount > 0 && !isProcessing
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {isProcessing ? "Processing..." : `Enrol ${validCount} ${validCount === 1 ? "Pupil" : "Pupils"} Now`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
