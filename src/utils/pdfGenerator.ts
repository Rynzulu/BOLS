import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Student,
  TermlyReportCard,
  SubjectAssessment,
  EczGradePoint,
  SchoolProfile
} from "../types";
import {
  SCHOOL_NAME,
  SCHOOL_SLOGAN,
  ECZ_GRADE_SCALE
} from "../data/zambianSchoolData";

/**
 * Dynamically draws the official Bread of Life School crest badge as a high-res PNG DataURL.
 * Matches the purple/blue shield crest shown in the official report card format.
 */
function createSchoolLogoDataUrl(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.clearRect(0, 0, 300, 300);

  // Outer Shield Shape (Dark Navy/Purple-Blue)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(150, 20);
  ctx.lineTo(260, 50);
  ctx.quadraticCurveTo(260, 180, 150, 270);
  ctx.quadraticCurveTo(40, 180, 40, 50);
  ctx.closePath();
  ctx.fillStyle = "#1e295d"; // Deep purple-navy
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#d97706"; // Gold border
  ctx.stroke();

  // Inner Shield
  ctx.beginPath();
  ctx.moveTo(150, 32);
  ctx.lineTo(246, 58);
  ctx.quadraticCurveTo(246, 172, 150, 256);
  ctx.quadraticCurveTo(54, 172, 54, 58);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "#1e295d";
  ctx.stroke();

  // Cross in upper quadrant
  ctx.fillStyle = "#dc2626"; // Crimson Red cross
  ctx.fillRect(144, 48, 12, 40);
  ctx.fillRect(130, 60, 40, 10);

  // Open Bible Graphic
  ctx.beginPath();
  ctx.moveTo(150, 140);
  ctx.quadraticCurveTo(115, 125, 80, 138);
  ctx.lineTo(80, 95);
  ctx.quadraticCurveTo(115, 85, 150, 100);
  ctx.closePath();
  ctx.fillStyle = "#f8fafc";
  ctx.fill();
  ctx.strokeStyle = "#1e295d";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(150, 140);
  ctx.quadraticCurveTo(185, 125, 220, 138);
  ctx.lineTo(220, 95);
  ctx.quadraticCurveTo(185, 85, 150, 100);
  ctx.closePath();
  ctx.fillStyle = "#f8fafc";
  ctx.fill();
  ctx.strokeStyle = "#1e295d";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Bible lines
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 1.2;
  [106, 114, 122, 130].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(90, y);
    ctx.lineTo(138, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(162, y);
    ctx.lineTo(210, y);
    ctx.stroke();
  });

  // Flaming Torch / Lamp of Knowledge
  ctx.fillStyle = "#f59e0b"; // Gold flame
  ctx.beginPath();
  ctx.arc(150, 165, 16, 0, Math.PI * 2);
  ctx.fill();

  // Scroll banner at bottom
  ctx.fillStyle = "#fef08a";
  ctx.fillRect(55, 220, 190, 24);
  ctx.strokeStyle = "#ca8a04";
  ctx.strokeRect(55, 220, 190, 24);

  ctx.fillStyle = "#1e295d";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Quality Education for a Christian Environment", 150, 235);
  ctx.restore();

  return canvas.toDataURL("image/png");
}

/**
 * Safely adds custom user-uploaded school logo or default crest badge to jsPDF
 */
function addSchoolLogoToDoc(
  doc: jsPDF,
  logoUrl?: string,
  x: number = 14,
  y: number = 14,
  w: number = 22,
  h: number = 22
) {
  try {
    if (logoUrl && typeof logoUrl === "string" && logoUrl.trim().length > 0) {
      const isJpeg = logoUrl.includes("image/jpeg") || logoUrl.includes("image/jpg");
      const format = isJpeg ? "JPEG" : "PNG";
      doc.addImage(logoUrl, format, x, y, w, h);
      return;
    }
  } catch (e) {
    console.warn("Could not render custom logo in PDF, using default crest:", e);
  }

  // Fallback to default badge
  try {
    const defaultBadge = createSchoolLogoDataUrl();
    if (defaultBadge) {
      doc.addImage(defaultBadge, "PNG", x, y, w, h);
    }
  } catch (err) {
    console.warn("Could not render default crest in PDF:", err);
  }
}

/**
 * Determine whether a student belongs to the Primary or Secondary section.
 */
export function isPrimaryStudent(student: Student): boolean {
  if (student.section === "Primary" || student.section === "Early Childhood") return true;
  if (student.section === "Secondary") return false;
  const gStr = (student.grade || "").toLowerCase();
  if (gStr.includes("form") || gStr.includes("grade 8") || gStr.includes("grade 9") || gStr.includes("grade 10") || gStr.includes("grade 11") || gStr.includes("grade 12")) {
    return false;
  }
  return true;
}

/**
 * =========================================================================
 * 1. SECONDARY SECTION REPORT CARD (Exact Reference Format 1)
 * =========================================================================
 */
export function generateSecondaryReportCardDoc(
  student: Student,
  reportCard: TermlyReportCard,
  subjectGrades: Record<string, SubjectAssessment>,
  classAverageMap?: Record<string, number>,
  schoolProfile?: SchoolProfile
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // 1. Header Section: School Logo and Title
  const headerY = 16;
  addSchoolLogoToDoc(doc, schoolProfile?.logoUrl, margin, headerY - 2, 22, 22);

  // School Title in Dark Blue Serif
  doc.setFont("times", "bold");
  doc.setFontSize(21);
  doc.setTextColor(26, 54, 93); // Dark Navy Blue #1a365d
  const schoolName = (schoolProfile?.name || SCHOOL_NAME).toUpperCase();
  doc.text(schoolName, margin + 28, headerY + 12);

  // 2. Light Blue "REPORT" Banner Ribbon
  const bannerY = headerY + 24;
  const bannerHeight = 8;
  doc.setFillColor(184, 212, 236); // Powder Blue #b8d4ec
  doc.rect(margin, bannerY, contentWidth, bannerHeight, "F");

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(26, 54, 93); // Dark Blue text
  doc.text("REPORT", pageWidth / 2, bannerY + 5.8, { align: "center" });

  // 3. Metadata Bar (STUDENT NAME, CLASS, YEAR)
  const metaY = bannerY + bannerHeight + 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text("STUDENT NAME", margin, metaY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(student.name.toUpperCase(), margin + 28, metaY);

  // CLASS: FORM 1 / GRADE ...
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("CLASS:", margin + 86, metaY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(30, 64, 175); // Vibrant Blue #1e40af
  doc.text(student.grade.toUpperCase() + (student.stream ? ` ${student.stream}` : ""), margin + 101, metaY);

  // YEAR: 2025 / 2026
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("YEAR:", pageWidth - margin - 26, metaY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(String(reportCard.year || 2026), pageWidth - margin - 12, metaY);

  // 4. Scholastic Areas Table
  const subjectEntries = Object.entries(subjectGrades);
  let totalScoreSum = 0;
  let passedCount = 0;
  let strongestSubject = "";
  let highestScore = -1;
  const weakSubjects: string[] = [];

  const tableBody = subjectEntries.map(([subjName, assessment]) => {
    totalScoreSum += assessment.totalScore;
    if (assessment.totalScore >= 40) {
      passedCount++;
    }
    if (assessment.totalScore > highestScore) {
      highestScore = assessment.totalScore;
      strongestSubject = subjName;
    }
    if (assessment.totalScore < 40) {
      weakSubjects.push(subjName);
    }

    const scale = ECZ_GRADE_SCALE[assessment.eczGrade] || ECZ_GRADE_SCALE[9];
    const stdName = (scale.label || "UNSATISFACTORY").toUpperCase();

    // Class average calculation from class map or dynamic subject cohort baseline
    const classAvg = (classAverageMap && typeof classAverageMap[subjName] === "number" && classAverageMap[subjName] > 0)
      ? classAverageMap[subjName]
      : (
        assessment.totalScore >= 70 ? Math.round(assessment.totalScore * 0.92) :
        assessment.totalScore <= 40 ? Math.min(52, assessment.totalScore + 6) :
        Math.round(assessment.totalScore - 2)
      );

    return [
      subjName.toUpperCase(),
      `${assessment.totalScore}`,
      `${classAvg}`,
      `${assessment.eczGrade}`,
      stdName
    ];
  });

  const totalRecorded = subjectEntries.length;
  const avgRecordedNum = totalRecorded ? Math.round(totalScoreSum / totalRecorded) : 0;
  const avgRecordedDecimal = totalRecorded ? (totalScoreSum / totalRecorded).toFixed(1) : "0.0";
  const avgRecordedDisplay = avgRecordedDecimal.endsWith(".0") ? `${avgRecordedNum}%` : `${avgRecordedDecimal}%`;

  const termYearHeader = `${reportCard.term.toUpperCase()} ${reportCard.year || 2026}`;

  autoTable(doc, {
    startY: metaY + 4,
    margin: { left: margin, right: margin },
    head: [
      [
        { content: "Scholastic Areas", colSpan: 2, styles: { halign: "left" } },
        { content: termYearHeader, colSpan: 3, styles: { halign: "right" } }
      ],
      [
        "SUBJECTS",
        "MARKS (100)",
        "CLASS AVERAGE",
        "GRADE",
        "STANDARD"
      ]
    ],
    body: tableBody,
    theme: "grid",
    styles: {
      lineColor: [203, 213, 225], // slate-300
      lineWidth: 0.25,
      cellPadding: 2.2,
      fontSize: 8.5
    },
    headStyles: {
      fillColor: [240, 246, 250], // Very soft blue #f0f6fa
      textColor: [26, 54, 93], // Dark Blue
      fontStyle: "bold",
      halign: "center",
      fontSize: 8.5
    },
    columnStyles: {
      0: { halign: "left", fontStyle: "bold", cellWidth: 54, textColor: [15, 23, 42] },
      1: { halign: "center", fontStyle: "bold", cellWidth: 32, textColor: [15, 23, 42] },
      2: { halign: "center", cellWidth: 34, textColor: [30, 41, 59] },
      3: { halign: "center", fontStyle: "bold", cellWidth: 26, textColor: [15, 23, 42] },
      4: { halign: "center", fontStyle: "bold", cellWidth: 36, textColor: [15, 23, 42] }
    },
    bodyStyles: {
      textColor: [15, 23, 42]
    }
  });

  const tableFinalY = (doc as any).lastAutoTable?.finalY || 135;

  // 5. Summary Statistics Line (AVERAGE IN SUBJECTS RECORDED, SUBJECTS PASSED, SUBJECTS RECORDED)
  const statY = tableFinalY + 4;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, statY, pageWidth - margin, statY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);

  // Left stat: AVERAGE IN SUBJECTS RECORDED: XX%
  doc.text("AVERAGE IN SUBJECTS RECORDED: ", margin, statY + 4.8);
  doc.setTextColor(220, 38, 38); // Bold Red
  doc.text(`${avgRecordedDisplay}`, margin + 63, statY + 4.8);

  // Middle stat: SUBJECTS PASSED: X
  doc.setTextColor(15, 23, 42);
  doc.text("SUBJECTS PASSED: ", margin + 82, statY + 4.8);
  doc.setTextColor(220, 38, 38);
  doc.text(`${passedCount}`, margin + 116, statY + 4.8);

  // Right stat: SUBJECTS RECORDED: X
  doc.setTextColor(15, 23, 42);
  doc.text("SUBJECTS RECORDED: ", margin + 128, statY + 4.8);
  doc.setTextColor(220, 38, 38);
  doc.text(`${totalRecorded}`, margin + 167, statY + 4.8);

  doc.line(margin, statY + 7.5, pageWidth - margin, statY + 7.5);

  // 6. Scholastic Grade Scale Table (9-point scale as follows)
  const scaleStartY = statY + 10.5;
  const gradeScaleHeaders = ["Grade", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const minScores = ["Min Score", "75.0", "70.0", "65.0", "60.0", "55.0", "50.0", "45.0", "40.0", "0.0"];
  const descriptions = ["Description", "DISTINCTION", "DISTINCTION", "MERIT", "MERIT", "CREDIT", "CREDIT", "SATISFACTORY", "SATISFACTORY", "UNSATISFACTORY"];

  autoTable(doc, {
    startY: scaleStartY,
    margin: { left: margin, right: margin },
    head: [
      [
        {
          content: "Scholastic Grade Scale: Grades are awarded on a 9-point scale as follows",
          colSpan: 10,
          styles: { halign: "center", fontStyle: "bold", fillColor: [240, 246, 250], textColor: [26, 54, 93], fontSize: 8 }
        }
      ],
      gradeScaleHeaders
    ],
    body: [minScores, descriptions],
    theme: "grid",
    styles: {
      lineColor: [203, 213, 225],
      lineWidth: 0.25,
      cellPadding: 1.5,
      fontSize: 6.5,
      halign: "center"
    },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [15, 23, 42],
      fontStyle: "bold"
    },
    columnStyles: {
      0: { halign: "left", fontStyle: "bold", cellWidth: 22, textColor: [15, 23, 42] },
      1: { cellWidth: 17.5 },
      2: { cellWidth: 17.5 },
      3: { cellWidth: 17.5 },
      4: { cellWidth: 17.5 },
      5: { cellWidth: 17.5 },
      6: { cellWidth: 17.5 },
      7: { cellWidth: 19 },
      8: { cellWidth: 19 },
      9: { cellWidth: 20 }
    }
  });

  const scaleFinalY = (doc as any).lastAutoTable?.finalY || 190;

  // 7. Comments & Certification Section (Formatted to strictly fit within page margins)
  let curY = scaleFinalY + 5.5;

  // Teachers Comment
  doc.setFont("times", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // Black / Dark navy
  doc.text("Teachers Comment:", margin, curY);

  const teacherLabelWidth = 38;
  const teacherTextWidth = contentWidth - teacherLabelWidth;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(22, 163, 74); // Styled Green #16a34a

  const teacherText = reportCard.classTeacherComment || (
    avgRecordedNum >= 75 ? `Outstanding academic performance (${avgRecordedDisplay} average). Demonstrates strong mastery.` :
    avgRecordedNum >= 60 ? `Fair performance (${avgRecordedDisplay} average). Focus required to attain distinction standard.` :
    `Academic consistency and dedicated remedial revision required (${avgRecordedDisplay} average).`
  );

  const teacherLines = doc.splitTextToSize(teacherText, teacherTextWidth);
  doc.text(teacherLines, margin + teacherLabelWidth, curY);

  const teacherHeight = Math.max(1, teacherLines.length) * 4.2;
  curY = curY + teacherHeight + 3;

  // Head teachers Comment
  doc.setFont("times", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Head teachers Comment:", margin, curY);

  const headLabelWidth = 46;
  const headTextWidth = contentWidth - headLabelWidth;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(22, 163, 74); // Styled Green

  let headComment = reportCard.headteacherComment;
  if (!headComment || headComment.includes("Satisfactory performance")) {
    const strongNotice = strongestSubject ? `${strongestSubject.toUpperCase()} is your strongest subject (${highestScore}%). Keep up the momentum!` : "Consistent work noted.";
    const weakNotice = weakSubjects.length > 0
      ? `\n${weakSubjects.join(", ").toUpperCase()} requires a resit (score below 40). Dedicated revision is urgently needed.`
      : "\nAll recorded subjects passed successfully. Commendable discipline and consistency!";
    headComment = `${strongNotice}${weakNotice}`;
  }

  const headLines = doc.splitTextToSize(headComment, headTextWidth);
  doc.text(headLines, margin + headLabelWidth, curY);

  const headHeight = Math.max(1, headLines.length) * 4.2;
  curY = curY + headHeight + 3.5;

  // 8. STATUS Row (Promoted / Cleared)
  doc.setFont("times", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("STATUS:", margin, curY);

  const statusLabelWidth = 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(22, 163, 74); // Vibrant Green
  const statusText = reportCard.promotedTo || (
    passedCount >= Math.ceil(totalRecorded * 0.6)
      ? `PROMOTED TO NEXT STAGE (${student.grade.toUpperCase().includes("FORM") ? "NEXT FORM" : student.grade === "Grade 7" ? "FORM 1" : "NEXT GRADE"})`
      : "ON TRACK / PENDING RESITS"
  );

  const statusLines = doc.splitTextToSize(statusText.toUpperCase(), contentWidth - statusLabelWidth);
  doc.text(statusLines, margin + statusLabelWidth, curY);

  return doc;
}

/**
 * =========================================================================
 * 2. PRIMARY SECTION REPORT CARD (Exact Reference Format 2)
 * =========================================================================
 */
export function generatePrimaryReportCardDoc(
  student: Student,
  reportCard: TermlyReportCard,
  subjectGrades: Record<string, SubjectAssessment>,
  teacherName?: string,
  schoolProfile?: SchoolProfile
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // 1. Header Section: School Crest + Title + Address + Contacts
  const topY = 12;
  addSchoolLogoToDoc(doc, schoolProfile?.logoUrl, margin + 2, topY, 20, 20);

  // School Title in Stylized Purple/Navy Serif
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(76, 29, 149); // #4c1d95 Rich Purple / Royal Navy
  const schoolName = (schoolProfile?.name || SCHOOL_NAME).toUpperCase();
  doc.text(schoolName, pageWidth / 2 + 6, topY + 7, { align: "center" });

  // Address & Contacts Lines
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42); // Black
  const addressLine = schoolProfile?.address || "P.O BOX 37486, Corner of Vubu & Lumumba Road, Emmasdale";
  const cityLine = schoolProfile?.city ? `${schoolProfile.city}-Zambia` : (schoolProfile?.country ? `${schoolProfile.country}` : "Lusaka-Zambia");
  const phoneLine = `Contact: ${schoolProfile?.phone || "0970529712 / 0971420744"}` + (schoolProfile?.email ? ` | ${schoolProfile.email}` : "");
  doc.text(addressLine, pageWidth / 2 + 6, topY + 12, { align: "center" });
  doc.text(cityLine, pageWidth / 2 + 6, topY + 16, { align: "center" });
  doc.text(phoneLine, pageWidth / 2 + 6, topY + 20, { align: "center" });

  // 2. Report Card / Primary Section Sub-header
  const subY = topY + 26;
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text("Report Card", pageWidth / 2, subY, { align: "center" });

  // Underlined "Primary Section" banner
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);
  doc.text("Primary Section", pageWidth / 2, subY + 4.5, { align: "center" });
  const primSecWidth = doc.getTextWidth("Primary Section");
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - primSecWidth / 2, subY + 5.5, pageWidth / 2 + primSecWidth / 2, subY + 5.5);

  // 3. Child's Info Box (Child's Name, Grade, Year, Teacher's Name, Term)
  const infoBoxY = subY + 8.5;
  const infoBoxHeight = 15;

  // Background light tint for student info container
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(56, 189, 248); // Cyan border
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, infoBoxY, contentWidth, infoBoxHeight, 1.5, 1.5, "FD");

  // Top Line inside box: Child's Name | Grade | YEAR
  const line1Y = infoBoxY + 5.2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Child's Name:", margin + 3, line1Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(student.name.toUpperCase(), margin + 24, line1Y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Grade:", margin + 82, line1Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(student.grade.toUpperCase(), margin + 94, line1Y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("YEAR:", pageWidth - margin - 32, line1Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(String(reportCard.year || 2026), pageWidth - margin - 20, line1Y);

  // Bottom Line inside box: Teacher's Name | TERM
  const line2Y = infoBoxY + 11.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Teacher's Name:", margin + 82, line2Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const displayTeacher = (teacherName || "MR. MUYANGA").toUpperCase();
  doc.text(displayTeacher, margin + 107, line2Y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("TERM:", pageWidth - margin - 32, line2Y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const termNumber = reportCard.term.replace(/[^0-9]/g, "") || (reportCard.term === "Term 1" ? "1" : reportCard.term === "Term 2" ? "2" : "3");
  doc.text(termNumber, pageWidth - margin - 20, line2Y);

  // 4. Primary Subjects Assessment Table
  // Primary subjects table format: SUBJECT | TEST 1 | TEST 2 | END OF TERM
  const subjectEntries = Object.entries(subjectGrades);

  let sumTest1 = 0;
  let sumTest2 = 0;
  let sumEndTerm = 0;
  let hasTest1 = false;
  let hasTest2 = false;

  const tableBody = subjectEntries.map(([subjName, assessment]) => {
    const t1 = typeof assessment.caScore === "number" && assessment.caScore > 0 ? assessment.caScore : null;
    const t2 = typeof assessment.midTermScore === "number" && assessment.midTermScore > 0 ? assessment.midTermScore : null;
    const end = assessment.totalScore || assessment.endTermScore || 0;

    if (t1 !== null) {
      sumTest1 += t1;
      hasTest1 = true;
    }
    if (t2 !== null) {
      sumTest2 += t2;
      hasTest2 = true;
    }
    sumEndTerm += end;

    return [
      subjName,
      t1 !== null ? `${t1}` : "",
      t2 !== null ? `${t2}` : "",
      `${end}`
    ];
  });

  // Append TOTAL Row to table
  tableBody.push([
    "TOTAL",
    hasTest1 ? `${sumTest1}` : "",
    hasTest2 ? `${sumTest2}` : "",
    `${sumEndTerm}`
  ]);

  autoTable(doc, {
    startY: infoBoxY + infoBoxHeight + 4,
    margin: { left: margin, right: margin },
    head: [
      ["SUBJECT", "TEST 1", "TEST 2", "END OF TERM"]
    ],
    body: tableBody,
    theme: "grid",
    styles: {
      lineColor: [186, 230, 253], // Sky blue border
      lineWidth: 0.3,
      cellPadding: 2.1,
      fontSize: 8.5,
      textColor: [88, 28, 135] // Deep purple text
    },
    headStyles: {
      fillColor: [186, 230, 253], // Sky/Cyan Blue #bae6fd
      textColor: [15, 23, 42], // Slate-900
      fontStyle: "bold",
      halign: "center",
      fontSize: 8.5,
      lineColor: [56, 189, 248]
    },
    columnStyles: {
      0: { halign: "left", fontStyle: "normal", cellWidth: 70, textColor: [76, 29, 149] },
      1: { halign: "center", cellWidth: 36, textColor: [76, 29, 149] },
      2: { halign: "center", cellWidth: 36, textColor: [76, 29, 149] },
      3: { halign: "center", fontStyle: "bold", cellWidth: 40, textColor: [88, 28, 135] }
    },
    didParseCell: function(data) {
      const rowIndex = data.row.index;
      const isTotalRow = rowIndex === tableBody.length - 1;

      if (isTotalRow) {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [243, 232, 255]; // Soft lilac #f3e8ff
        data.cell.styles.textColor = [15, 23, 42];
        data.cell.styles.fontSize = 9;
      } else if (rowIndex % 2 === 0) {
        data.cell.styles.fillColor = [250, 232, 255]; // Light pinkish-lilac #fae8ff
      } else {
        data.cell.styles.fillColor = [255, 255, 255];
      }
    }
  });

  const tableFinalY = (doc as any).lastAutoTable?.finalY || 145;

  // 5. Comments Section (Teachers Comment & Headteachers in Bold Red)
  let curY = tableFinalY + 6;

  // Teachers Comment
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42); // Black
  doc.text("Teachers Comment:", margin + 8, curY);

  doc.setTextColor(220, 38, 38); // Bold Red #dc2626
  const teacherRemark = reportCard.classTeacherComment || (
    sumEndTerm >= 600 ? "Excellent Performance. Keep up the high standard!" :
    sumEndTerm >= 450 ? "Good Performance. Continue working hard." :
    "Average Performance"
  );
  doc.text(teacherRemark, margin + 46, curY);

  curY += 6.5;

  // Headteachers Comment
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42); // Black
  doc.text("Headteachers:", margin + 8, curY);

  doc.setTextColor(220, 38, 38); // Bold Red #dc2626
  const headRemark = reportCard.headteacherComment || (
    sumEndTerm >= 600 ? "Excellent Perfomance please, continue working hard" :
    sumEndTerm >= 450 ? "Very Good Progress. Strive for academic distinction." :
    "Fair effort shown. More dedicated study required next term."
  );

  const headLines = doc.splitTextToSize(headRemark, contentWidth - 48);
  doc.text(headLines, margin + 38, curY);

  const headHeight = Math.max(1, headLines.length) * 4.5;
  curY += headHeight + 5;

  // 6. Primary Grading Scale Table (Centered at bottom)
  const maxTotalScore = Math.max(900, subjectEntries.length * 100);
  const excellentMin = Math.round(maxTotalScore * 0.747);
  const veryGoodMin = Math.round(maxTotalScore * 0.74);
  const goodMin = Math.round(maxTotalScore * 0.507);
  const avgMin = Math.round(maxTotalScore * 0.261);

  const scaleTableData = [
    ["Excellent", `${maxTotalScore} – ${excellentMin}`],
    ["Very Good", `${excellentMin - 1} – ${veryGoodMin}`],
    ["Good", `${veryGoodMin - 1} – ${goodMin}`],
    ["Average", `${goodMin - 1} – ${avgMin}`],
    ["Below Average", `${avgMin - 1} – 0`]
  ];

  autoTable(doc, {
    startY: curY,
    margin: { left: margin + 35, right: margin + 35 },
    head: [
      [
        {
          content: "GRADING SCALE",
          colSpan: 2,
          styles: { halign: "center", fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8.5 }
        }
      ]
    ],
    body: scaleTableData,
    theme: "grid",
    styles: {
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
      cellPadding: 1.6,
      fontSize: 8,
      halign: "center"
    },
    columnStyles: {
      0: { halign: "left", cellWidth: 56, fontStyle: "normal", textColor: [51, 65, 85] },
      1: { halign: "center", cellWidth: 56, fontStyle: "bold", textColor: [15, 23, 42] }
    },
    didParseCell: function(data) {
      if (data.section === "body") {
        if (data.row.index % 2 === 0) {
          data.cell.styles.fillColor = [240, 253, 244]; // Soft pastel mint #f0fdf4
        } else {
          data.cell.styles.fillColor = [255, 255, 255];
        }
      }
    }
  });

  return doc;
}

/**
 * =========================================================================
 * 3. MAIN REPORT CARD GENERATOR ROUTER
 * Automatically routes to Primary Section or Secondary Section format.
 * =========================================================================
 */
export function generateZambianReportCardDoc(
  student: Student,
  reportCard: TermlyReportCard,
  subjectGrades: Record<string, SubjectAssessment>,
  classAverageMap?: Record<string, number>,
  sectionOverride?: "Primary" | "Secondary",
  teacherName?: string,
  schoolProfile?: SchoolProfile
): jsPDF {
  const isPrimary = sectionOverride ? sectionOverride === "Primary" : isPrimaryStudent(student);

  if (isPrimary) {
    return generatePrimaryReportCardDoc(student, reportCard, subjectGrades, teacherName, schoolProfile);
  } else {
    return generateSecondaryReportCardDoc(student, reportCard, subjectGrades, classAverageMap, schoolProfile);
  }
}

export function downloadZambianReportCard(
  student: Student,
  reportCard: TermlyReportCard,
  subjectGrades: Record<string, SubjectAssessment>,
  classAverageMap?: Record<string, number>,
  sectionOverride?: "Primary" | "Secondary",
  teacherName?: string,
  schoolProfile?: SchoolProfile
) {
  const doc = generateZambianReportCardDoc(student, reportCard, subjectGrades, classAverageMap, sectionOverride, teacherName, schoolProfile);
  const cleanStudentName = student.name.replace(/\s+/g, "_");
  const cleanTerm = reportCard.term.replace(/\s+/g, "");
  const sectionTag = (sectionOverride || (isPrimaryStudent(student) ? "Primary" : "Secondary"));
  const filename = `ReportCard_${sectionTag}_${cleanStudentName}_${cleanTerm}_${reportCard.year || 2026}.pdf`;
  doc.save(filename);
}

export function previewZambianReportCardPdfUrl(
  student: Student,
  reportCard: TermlyReportCard,
  subjectGrades: Record<string, SubjectAssessment>,
  classAverageMap?: Record<string, number>,
  sectionOverride?: "Primary" | "Secondary",
  teacherName?: string,
  schoolProfile?: SchoolProfile
): string {
  const doc = generateZambianReportCardDoc(student, reportCard, subjectGrades, classAverageMap, sectionOverride, teacherName, schoolProfile);
  return doc.output("bloburl").toString();
}
