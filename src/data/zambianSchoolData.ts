import {
  EczGradeInfo,
  EczGradePoint,
  SchoolSection,
  SecondaryPathway,
  SecondaryPathwayInfo,
  Student,
  Teacher,
  StaffMember,
  ClassStream,
  SubjectAssessment,
  GradebookData,
  FeeItem,
  PaymentReceipt,
  HomeworkTask,
  ExamSchedule,
  LibraryBook,
  BookCheckout,
  InventoryItem,
  DisciplineRecord,
  HostelDormitory,
  HostelAllocation,
  TransportRoute,
  TransportVehicle,
  TransportPupilAssignment,
  SchoolEvent,
  ParentAccount,
  TermlyReportCard,
  UserMessage,
  AcademicTerm,
  ZambianHoliday,
  EventCategory,
  AcademicBatch,
  SubjectDefinition,
  ReportPublishStatus,
  TermResultsApproval,
  SchoolProfile,
  SchoolHouse,
  AuditLogEntry,
  TimetablePeriod
} from "../types";

export const SYSTEM_NAME = "RYNTECH School Management System";
export const SCHOOL_NAME = "Bread of Life School";
export const SCHOOL_SLOGAN = "Quality Education in a Christian Environment";
export const SCHOOL_ADDRESS = "Plot 26523, Corner of Vubu & Lumumba Road, P.O. Box 37486, Lusaka, Zambia";
export const SCHOOL_PHONE = "+260977421180 / +260 977451325";
export const SCHOOL_EMAIL = "info@myblci.org";
export const MINISTRY_CENTRE_CODE = "Centre No: 0412";
export const CENTRE_CODE = MINISTRY_CENTRE_CODE;

export const ZAMBIAN_PROVINCES: Record<string, string[]> = {
  "Lusaka Province": ["Lusaka", "Chongwe", "Kafue", "Chilanga", "Luangwa", "Rufunsa", "Shibuyunji"],
  "Copperbelt Province": ["Ndola", "Kitwe", "Chingola", "Mufulira", "Luanshya", "Kalulushi", "Chililabombwe", "Lufwanyama", "Masaiti", "Mpongwe"],
  "Central Province": ["Kabwe", "Chibombo", "Kapiri Mposhi", "Mkushi", "Mumbwa", "Serenje", "Chisamba", "Luano", "Ngabwe", "Shibuyunji"],
  "Southern Province": ["Choma", "Livingstone", "Mazabuka", "Monze", "Kalomo", "Sinazongwe", "Gwembe", "Namwala", "Pemba", "Zimba", "Kazungula", "Chikankata"],
  "Eastern Province": ["Chipata", "Lundazi", "Petauke", "Katete", "Nyimba", "Mambwe", "Sinda", "Chadiza", "Vubwi", "Chasefu", "Lumezi"],
  "Northern Province": ["Kasama", "Mbala", "Mporokoso", "Luwingu", "Mpulungu", "Kaputa", "Mungwi", "Nsama", "Chilubi", "Lupososhi"],
  "Luapula Province": ["Mansa", "Kawambwa", "Nchelenge", "Samfya", "Mwense", "Chiengi", "Milenge", "Mwansabombwe", "Chipili", "Chembe", "Chifunabuli"],
  "North-Western Province": ["Solwezi", "Kasempa", "Mwinilunga", "Zambezi", "Kabompo", "Chavuma", "Mufumbwe", "Manyinga", "Ikelenge", "Kalumbila", "Mushindamo"],
  "Western Province": ["Mongu", "Kaoma", "Senanga", "Sesheke", "Kalabo", "Shang'ombo", "Lukulu", "Sioma", "Nalolo", "Limulunga", "Luampa", "Mitete", "Sikongo"],
  "Muchinga Province": ["Chinsali", "Mpika", "Isoka", "Nakonde", "Mafinga", "Shiwang'andu", "Kanchibiya", "Lavushimanda"]
};

export const initialHouses: SchoolHouse[] = [
  { id: "house-eagle", name: "Eagle House", color: "#1e40af", motto: "Soaring to Academic Heights", patronName: "Mr. Davison Banda", studentCount: 38 },
  { id: "house-kafue", name: "Kafue House", color: "#047857", motto: "Flowing with Wisdom and Grace", patronName: "Mrs. Mutale Musonda", studentCount: 36 },
  { id: "house-victoria", name: "Victoria House", color: "#b45309", motto: "Thundering with Power and Virtue", patronName: "Mr. Kelvin Phiri", studentCount: 35 },
  { id: "house-zambezi", name: "Zambezi House", color: "#6d28d9", motto: "Mighty in Character and Truth", patronName: "Mrs. Gertrude Tembo", studentCount: 37 }
];

export const initialDepartments: string[] = [
  "Mathematics & Computing",
  "Natural Sciences",
  "Languages & Literature",
  "Social Sciences & Humanities",
  "Business & Commercial Studies",
  "TEVET & Vocational Skills",
  "Expressive & Performing Arts",
  "Religious & Moral Education"
];

export const initialSchoolProfile: SchoolProfile = {
  name: "Bread of Life School",
  systemName: "RYNTECH School Management System",
  slogan: "Quality Education in a Christian Environment",
  motto: "Knowledge, Excellence & Christian Character",
  registrationNumber: "MOE/REG/LUS/2026/0412",
  examinationCenterCode: "ECZ-CENTRE-0412",
  schoolType: "Combined School (Primary & Secondary)",
  ownership: "Private (Mission / Church)",
  headteacherName: "Mr. Davison Banda",
  deputyHeadName: "Mrs. Mutale Musonda",
  phone: "+260 977 421180",
  altPhone: "+260 977 451325",
  email: "info@myblci.org",
  address: "Plot 26523, Corner of Vubu & Lumumba Road",
  city: "Lusaka",
  province: "Lusaka Province",
  district: "Lusaka District",
  country: "Zambia",
  currentYear: 2026,
  activeTerm: "Term 2",
  termStartDate: "2026-05-11",
  termEndDate: "2026-08-07",
  nextTermStartDate: "2026-08-31",
  missionStatement: "To provide holistic, Christ-centred quality education that equips pupils with academic excellence, vocational skills, moral integrity, and national leadership qualities.",
  visionStatement: "To be a premier Christian educational institution in Zambia producing self-reliant, God-fearing, and innovative leaders for national development.",
  bankName: "Indo Zambia Bank / ZANACO",
  bankAccountName: "Bread of Life Church International School",
  bankAccountNumber: "0120285491024",
  bankBranch: "Lusaka Main Branch",
  mobileMoneyNumber: "*115*4*1*40285# (Airtel) / MTN MoMo Pay: 882014",
  themeColor: "#065f46",
  houses: initialHouses,
  departments: initialDepartments,
  currency: "ZMW",
  smsGatewayEnabled: true,
  whatsappGatewayEnabled: true,
  momoGatewayEnabled: true
};

export const initialTimetableData: TimetablePeriod[] = [
  // Monday
  { id: "p-mon-1", classId: 1, day: "Monday", time: "07:30 - 08:30", subject: "Mathematics", teacher: "Mr. Davison Banda", room: "Room 1" },
  { id: "p-mon-2", classId: 1, day: "Monday", time: "08:30 - 09:30", subject: "English Language", teacher: "Mrs. Mutale Musonda", room: "Room 1" },
  { id: "p-mon-3", classId: 1, day: "Monday", time: "09:30 - 10:00", subject: "Morning Break (Tea & Snacks)", teacher: "Duty Staff", isBreak: true },
  { id: "p-mon-4", classId: 1, day: "Monday", time: "10:00 - 11:00", subject: "Integrated Science", teacher: "Mr. Kelvin Phiri", room: "Science Lab" },
  { id: "p-mon-5", classId: 1, day: "Monday", time: "11:00 - 12:00", subject: "Social Studies", teacher: "Mrs. Gertrude Tembo", room: "Room 1" },
  { id: "p-mon-6", classId: 1, day: "Monday", time: "12:00 - 13:00", subject: "Icibemba / Zambian Language", teacher: "Mr. Davison Banda", room: "Room 1" },

  // Tuesday
  { id: "p-tue-1", classId: 1, day: "Tuesday", time: "07:30 - 08:30", subject: "English Language", teacher: "Mrs. Mutale Musonda", room: "Room 1" },
  { id: "p-tue-2", classId: 1, day: "Tuesday", time: "08:30 - 09:30", subject: "Mathematics", teacher: "Mr. Davison Banda", room: "Room 1" },
  { id: "p-tue-3", classId: 1, day: "Tuesday", time: "09:30 - 10:00", subject: "Morning Break", teacher: "Duty Staff", isBreak: true },
  { id: "p-tue-4", classId: 1, day: "Tuesday", time: "10:00 - 11:00", subject: "Technology Studies / ICT", teacher: "Mr. Kelvin Phiri", room: "Computer Lab" },
  { id: "p-tue-5", classId: 1, day: "Tuesday", time: "11:00 - 12:00", subject: "Home Economics", teacher: "Mrs. Gertrude Tembo", room: "HE Room" },
  { id: "p-tue-6", classId: 1, day: "Tuesday", time: "12:00 - 13:00", subject: "Creative and Performing Arts", teacher: "Mrs. Mutale Musonda", room: "Hall" },

  // Wednesday
  { id: "p-wed-1", classId: 1, day: "Wednesday", time: "07:30 - 08:30", subject: "Mathematics", teacher: "Mr. Davison Banda", room: "Room 1" },
  { id: "p-wed-2", classId: 1, day: "Wednesday", time: "08:30 - 09:30", subject: "Integrated Science", teacher: "Mr. Kelvin Phiri", room: "Science Lab" },
  { id: "p-wed-3", classId: 1, day: "Wednesday", time: "09:30 - 10:00", subject: "Morning Break", teacher: "Duty Staff", isBreak: true },
  { id: "p-wed-4", classId: 1, day: "Wednesday", time: "10:00 - 11:00", subject: "Social Studies", teacher: "Mrs. Gertrude Tembo", room: "Room 1" },
  { id: "p-wed-5", classId: 1, day: "Wednesday", time: "11:00 - 12:00", subject: "Special Paper 1 / Reasoning", teacher: "Mr. Davison Banda", room: "Room 1" },
  { id: "p-wed-6", classId: 1, day: "Wednesday", time: "12:00 - 13:00", subject: "Physical Education & Sports", teacher: "Coach Chanda", room: "Sports Ground" },

  // Thursday
  { id: "p-thu-1", classId: 1, day: "Thursday", time: "07:30 - 08:30", subject: "English Language (Composition)", teacher: "Mrs. Mutale Musonda", room: "Room 1" },
  { id: "p-thu-2", classId: 1, day: "Thursday", time: "08:30 - 09:30", subject: "Mathematics", teacher: "Mr. Davison Banda", room: "Room 1" },
  { id: "p-thu-3", classId: 1, day: "Thursday", time: "09:30 - 10:00", subject: "Morning Break", teacher: "Duty Staff", isBreak: true },
  { id: "p-thu-4", classId: 1, day: "Thursday", time: "10:00 - 11:00", subject: "Special Paper 2 / Aptitude", teacher: "Mr. Kelvin Phiri", room: "Room 1" },
  { id: "p-thu-5", classId: 1, day: "Thursday", time: "11:00 - 12:00", subject: "Religious Education (RE)", teacher: "Mrs. Gertrude Tembo", room: "Room 1" },
  { id: "p-thu-6", classId: 1, day: "Thursday", time: "12:00 - 13:00", subject: "Library & Silent Reading", teacher: "Mrs. Mutale Musonda", room: "Library" },

  // Friday
  { id: "p-fri-1", classId: 1, day: "Friday", time: "07:30 - 08:30", subject: "Weekly Revision & Mock Drill", teacher: "Mr. Davison Banda", room: "Room 1" },
  { id: "p-fri-2", classId: 1, day: "Friday", time: "08:30 - 09:30", subject: "Integrated Science Quiz", teacher: "Mr. Kelvin Phiri", room: "Science Lab" },
  { id: "p-fri-3", classId: 1, day: "Friday", time: "09:30 - 10:00", subject: "Morning Break", teacher: "Duty Staff", isBreak: true },
  { id: "p-fri-4", classId: 1, day: "Friday", time: "10:00 - 11:00", subject: "Zambian Languages & Culture", teacher: "Mrs. Gertrude Tembo", room: "Room 1" },
  { id: "p-fri-5", classId: 1, day: "Friday", time: "11:00 - 12:00", subject: "School Assembly & Clubs (JETS / SU)", teacher: "All Staff", room: "Assembly Ground" }
];

export const SECONDARY_PATHWAYS: Record<SecondaryPathway, SecondaryPathwayInfo> = {
  "Natural Sciences": {
    id: "Natural Sciences",
    name: "Natural Sciences & STEM",
    code: "SCI-STEM",
    description: "Designed for pupils pursuing medicine, biological sciences, physical engineering, computing, and technological innovations.",
    badgeColor: "#059669",
    accentColor: "emerald",
    iconName: "Atom",
    level: "Senior Secondary (Grades 10-12)",
    coreSubjects: ["English Language", "Mathematics", "Civic Education"],
    specializationSubjects: ["Pure Physics", "Pure Chemistry", "Biology", "Additional Mathematics", "Computer Science"],
    careerPaths: [
      "Medicine & Surgery (MBChB)",
      "Civil / Electrical / Mechanical Engineering",
      "Computer Science & Software Systems",
      "Pharmacy & Biotechnology",
      "Architecture & Quantity Surveying"
    ],
    entryRequirements: "Distinction or Merit in Grade 9 Mathematics and Integrated Science."
  },
  "Business & Commercial": {
    id: "Business & Commercial",
    name: "Business, Commercial & Finance",
    code: "BUS-COM",
    description: "Tailored for future corporate leaders, chartered accountants, economists, bankers, and innovative entrepreneurs.",
    badgeColor: "#d97706",
    accentColor: "amber",
    iconName: "TrendingUp",
    level: "Senior Secondary (Grades 10-12)",
    coreSubjects: ["English Language", "Mathematics", "Civic Education"],
    specializationSubjects: ["Principles of Accounts", "Commerce", "Economics", "Business Studies", "Information Technology"],
    careerPaths: [
      "Chartered Accountancy (ZICA / ACCA)",
      "Banking & Financial Management",
      "Economics & Macroeconomic Policy",
      "Business Administration & Marketing",
      "Procurement & Supply Chain Management"
    ],
    entryRequirements: "Strong pass in Grade 9 Mathematics and Business Studies."
  },
  "Social Sciences & Humanities": {
    id: "Social Sciences & Humanities",
    name: "Social Sciences, Humanities & Arts",
    code: "SOC-HUM",
    description: "Focused on legal jurisprudence, governance, diplomacy, literary arts, communication, and social transformation.",
    badgeColor: "#7c3aed",
    accentColor: "purple",
    iconName: "BookOpen",
    level: "Senior Secondary (Grades 10-12)",
    coreSubjects: ["English Language", "Mathematics", "Civic Education"],
    specializationSubjects: ["History", "Geography", "Literature in English", "Religious Education (2046)", "Zambian Languages (Icibemba / Cinyanja)", "Art & Design"],
    careerPaths: [
      "Law & Legal Practice (LLB)",
      "Mass Communication & Investigative Journalism",
      "International Relations & Diplomatic Service",
      "Public Policy & Human Resource Management",
      "Secondary School & Higher Education Teaching"
    ],
    entryRequirements: "Distinction or Merit in Grade 9 English Language and Social Studies."
  },
  "Technical & Vocational": {
    id: "Technical & Vocational",
    name: "Technical, Vocational & Applied STEM (TEVET)",
    code: "TECH-VOC",
    description: "Practical and industry-aligned hands-on craftsmanship, agricultural biotechnology, construction design, and food science.",
    badgeColor: "#0284c7",
    accentColor: "sky",
    iconName: "Wrench",
    level: "Senior Secondary (Grades 10-12)",
    coreSubjects: ["English Language", "Mathematics", "Civic Education"],
    specializationSubjects: ["Design & Technology", "Technical Drawing", "Agricultural Science", "Food & Nutrition", "Computer Studies"],
    careerPaths: [
      "Applied Industrial Engineering & Instrumentation",
      "Commercial Agriculture & Agribusiness",
      "Building Construction & Structural Drafting",
      "Food Processing Technology & Nutrition",
      "Applied ICT & Hardware Engineering"
    ],
    entryRequirements: "Interest in practical technology, agriculture, or design crafts."
  },
  "Junior Secondary Core": {
    id: "Junior Secondary Core",
    name: "Junior Secondary Foundational Pathway",
    code: "JUNIOR-SEC",
    description: "Comprehensive preparatory foundation for Grades 8 and 9 covering core sciences, humanities, languages, and technical previews before pathway selection.",
    badgeColor: "#475569",
    accentColor: "slate",
    iconName: "GraduationCap",
    level: "Junior Secondary (Grades 8-9)",
    coreSubjects: ["English Language", "Mathematics", "Integrated Science", "Social Studies", "Civic Education"],
    specializationSubjects: ["Business Studies", "Computer Studies", "Agricultural Science", "Religious Education", "Icibemba / Cinyanja"],
    careerPaths: [
      "Preparation for Senior Secondary Pathway Allocation",
      "National Junior Secondary School Leaving Examination (Grade 9)"
    ],
    entryRequirements: "Successful completion of Primary School (Grade 7 Examination)."
  }
};

export const ECZ_GRADE_SCALE: Record<EczGradePoint, EczGradeInfo> = {
  1: { point: 1, label: "Distinction", description: "Distinction (75 - 100%)", badgeColor: "#16a34a" },
  2: { point: 2, label: "Distinction", description: "Distinction (70 - 74%)", badgeColor: "#22c55e" },
  3: { point: 3, label: "Merit", description: "Merit (65 - 69%)", badgeColor: "#0284c7" },
  4: { point: 4, label: "Merit", description: "Merit (60 - 64%)", badgeColor: "#0ea5e9" },
  5: { point: 5, label: "Credit", description: "Credit (55 - 59%)", badgeColor: "#d97706" },
  6: { point: 6, label: "Credit", description: "Credit (50 - 54%)", badgeColor: "#f59e0b" },
  7: { point: 7, label: "Satisfactory", description: "Satisfactory (45 - 49%)", badgeColor: "#64748b" },
  8: { point: 8, label: "Satisfactory", description: "Satisfactory (40 - 44%)", badgeColor: "#94a3b8" },
  9: { point: 9, label: "Unsatisfactory", description: "Unsatisfactory (0 - 39%)", badgeColor: "#ef4444" },
};

export const GRADE_SCALE = ECZ_GRADE_SCALE;
export const SCHOOL_GRADE_SCALE = ECZ_GRADE_SCALE;

export interface GradeStructureInfo {
  id: string;
  name: string;
  section: SchoolSection;
  stage: string;
  ageRange: string;
  code: string;
  gradeNum: number;
}

export const ZAMBIAN_GRADE_STRUCTURE: GradeStructureInfo[] = [
  // Early Childhood Education (ECE)
  { id: "Baby Class", name: "Baby Class", section: "Early Childhood", stage: "Early Childhood Education (ECE)", ageRange: "3 - 4 Years", code: "ECE-BC", gradeNum: 0 },
  { id: "Middle Class", name: "Middle Class", section: "Early Childhood", stage: "Early Childhood Education (ECE)", ageRange: "4 - 5 Years", code: "ECE-MC", gradeNum: 0 },
  { id: "Reception", name: "Reception", section: "Early Childhood", stage: "Early Childhood Education (ECE)", ageRange: "5 - 6 Years", code: "ECE-REC", gradeNum: 0 },

  // Primary School (Grades 1 to 7)
  { id: "Grade 1", name: "Grade 1", section: "Primary", stage: "Lower Primary", ageRange: "6 - 7 Years", code: "PRI-G1", gradeNum: 1 },
  { id: "Grade 2", name: "Grade 2", section: "Primary", stage: "Lower Primary", ageRange: "7 - 8 Years", code: "PRI-G2", gradeNum: 2 },
  { id: "Grade 3", name: "Grade 3", section: "Primary", stage: "Lower Primary", ageRange: "8 - 9 Years", code: "PRI-G3", gradeNum: 3 },
  { id: "Grade 4", name: "Grade 4", section: "Primary", stage: "Lower Primary", ageRange: "9 - 10 Years", code: "PRI-G4", gradeNum: 4 },
  { id: "Grade 5", name: "Grade 5", section: "Primary", stage: "Upper Primary", ageRange: "10 - 11 Years", code: "PRI-G5", gradeNum: 5 },
  { id: "Grade 6", name: "Grade 6", section: "Primary", stage: "Upper Primary", ageRange: "11 - 12 Years", code: "PRI-G6", gradeNum: 6 },
  { id: "Grade 7", name: "Grade 7", section: "Primary", stage: "Upper Primary (Primary Leaving Exam)", ageRange: "12 - 13 Years", code: "PRI-G7", gradeNum: 7 },

  // Secondary School (Form 1 to Form 4)
  { id: "Form 1", name: "Form 1", section: "Secondary", stage: "Junior Secondary", ageRange: "13 - 14 Years", code: "SEC-F1", gradeNum: 8 },
  { id: "Form 2", name: "Form 2", section: "Secondary", stage: "Junior Secondary (JSCE Exam)", ageRange: "14 - 15 Years", code: "SEC-F2", gradeNum: 9 },
  { id: "Form 3", name: "Form 3", section: "Secondary", stage: "Senior Secondary (Pathways)", ageRange: "15 - 16 Years", code: "SEC-F3", gradeNum: 10 },
  { id: "Form 4", name: "Form 4", section: "Secondary", stage: "Senior Secondary (Graduating Form / School Leaving)", ageRange: "16 - 17 Years", code: "SEC-F4", gradeNum: 12 }
];

export function calculateEczGrade(score: number): { point: EczGradePoint; label: string; remark: string } {
  if (score >= 75) return { point: 1, label: "Distinction", remark: "Distinction (Outstanding performance)" };
  if (score >= 70) return { point: 2, label: "Distinction", remark: "Distinction (Very good understanding)" };
  if (score >= 65) return { point: 3, label: "Merit", remark: "Merit (Good command of subject)" };
  if (score >= 60) return { point: 4, label: "Merit", remark: "Merit (Above average work)" };
  if (score >= 55) return { point: 5, label: "Credit", remark: "Credit (Sound understanding)" };
  if (score >= 50) return { point: 6, label: "Credit", remark: "Credit (Satisfactory progress)" };
  if (score >= 45) return { point: 7, label: "Satisfactory", remark: "Satisfactory (Basic pass level)" };
  if (score >= 40) return { point: 8, label: "Satisfactory", remark: "Satisfactory (Marginal pass)" };
  return { point: 9, label: "Unsatisfactory", remark: "Unsatisfactory (Needs urgent improvement)" };
}

export function getZambianSubjectsForGrade(gradeInput: number | string, pathway?: SecondaryPathway): string[] {
  const gStr = String(gradeInput).toLowerCase().trim();

  // Early Childhood Education (Baby Class, Middle Class, Reception)
  if (
    gStr.includes("baby") ||
    gStr.includes("middle") ||
    gStr.includes("reception") ||
    gStr.includes("ece") ||
    gradeInput === 0
  ) {
    return [
      "Language & Pre-Literacy",
      "Early Numbers & Mathematical Concepts",
      "Social & Environmental Exploration",
      "Creative & Expressive Arts",
      "Physical Development & Motor Skills",
      "Christian Character & Moral Values"
    ];
  }

  // Lower Primary (Grades 1-4)
  if (
    gStr === "1" || gStr === "2" || gStr === "3" || gStr === "4" ||
    gStr === "grade 1" || gStr === "grade 2" || gStr === "grade 3" || gStr === "grade 4" ||
    (typeof gradeInput === "number" && gradeInput >= 1 && gradeInput <= 4)
  ) {
    return [
      "Literacy & English",
      "Icibemba / Zambian Language",
      "Mathematics",
      "Integrated Science",
      "Social & Development Studies",
      "Creative & Technology Studies (CTS)"
    ];
  }

  // Upper Primary (Grades 5-7)
  if (
    gStr === "5" || gStr === "6" || gStr === "7" ||
    gStr === "grade 5" || gStr === "grade 6" || gStr === "grade 7" ||
    (typeof gradeInput === "number" && gradeInput >= 5 && gradeInput <= 7)
  ) {
    return [
      "English Language",
      "Mathematics",
      "Integrated Science",
      "Social Studies",
      "Icibemba / Cinyanja (Zambian Language)",
      "Creative & Technology Studies (CTS)",
      "Expressive Arts & R.E."
    ];
  }

  // Junior Secondary (Form 1, Form 2 or Grade 8-9)
  if (
    gStr.includes("form 1") || gStr.includes("form 2") ||
    gStr.includes("grade 8") || gStr.includes("grade 9") ||
    gradeInput === 8 || gradeInput === 9
  ) {
    return [
      "English Language",
      "Mathematics",
      "Integrated Science",
      "Social Studies",
      "Civic Education",
      "Business Studies",
      "Computer Studies",
      "Agricultural Science",
      "Religious Education"
    ];
  }

  // Senior Secondary (Form 3, Form 4 or Grade 10-12) mapped to Pathway
  switch (pathway) {
    case "Natural Sciences":
      return [
        "English Language",
        "Mathematics",
        "Civic Education",
        "Pure Physics",
        "Pure Chemistry",
        "Biology",
        "Additional Mathematics",
        "Computer Science"
      ];
    case "Business & Commercial":
      return [
        "English Language",
        "Mathematics",
        "Civic Education",
        "Principles of Accounts",
        "Commerce",
        "Economics",
        "Business Studies",
        "Information Technology"
      ];
    case "Social Sciences & Humanities":
      return [
        "English Language",
        "Mathematics",
        "Civic Education",
        "History",
        "Geography",
        "Literature in English",
        "Religious Education (2046)",
        "Zambian Languages (Icibemba / Cinyanja)"
      ];
    case "Technical & Vocational":
      return [
        "English Language",
        "Mathematics",
        "Civic Education",
        "Design & Technology",
        "Technical Drawing",
        "Agricultural Science",
        "Food & Nutrition",
        "Computer Studies"
      ];
    default:
      return [
        "English Language",
        "Mathematics",
        "Civic Education",
        "Pure Physics",
        "Pure Chemistry",
        "Biology",
        "Principles of Accounts",
        "History"
      ];
  }
}

export const initialBatches: AcademicBatch[] = [
  {
    id: "batch-2026-main",
    code: "BAT-2026-ALL",
    name: "2026 Academic Cohort (Full School)",
    academicYear: 2026,
    intakeTerm: "Term 1",
    targetGrades: ["All Grades (Grades 1 to 12)"],
    startDate: "2026-01-12",
    endDate: "2026-12-04",
    description: "Main school-wide academic session for 2026 comprising Primary, Junior Secondary and Senior Secondary pathways.",
    status: "Active",
    maxPupils: 600,
    leadTeacherName: "Mr. Davison Banda",
    leadTeacherId: 4
  },
  {
    id: "batch-2026-g7",
    code: "BAT-2026-G7",
    name: "2026 Grade 7 Candidate Cohort",
    academicYear: 2026,
    intakeTerm: "Term 1",
    targetGrades: ["Grade 7"],
    startDate: "2026-01-12",
    endDate: "2026-11-20",
    description: "Primary school leaving certificate candidates preparing for national Grade 7 ECZ examinations.",
    status: "Active",
    maxPupils: 85,
    leadTeacherName: "Mr. Davison Banda",
    leadTeacherId: 4
  },
  {
    id: "batch-2026-g9",
    code: "BAT-2026-G9",
    name: "2026 Junior Secondary Leaving (Grade 9)",
    academicYear: 2026,
    intakeTerm: "Term 1",
    targetGrades: ["Grade 9"],
    startDate: "2026-01-12",
    endDate: "2026-11-27",
    description: "Grade 9 JSSLE national examination candidates preparing for Senior Secondary pathway placements.",
    status: "Active",
    maxPupils: 80,
    leadTeacherName: "Mrs. Naomi Mwila",
    leadTeacherId: 6
  },
  {
    id: "batch-2026-g12",
    code: "BAT-2026-G12",
    name: "2026 Senior Secondary Finalist (Grade 12)",
    academicYear: 2026,
    intakeTerm: "Term 1",
    targetGrades: ["Grade 12"],
    startDate: "2026-01-12",
    endDate: "2026-11-15",
    description: "Graduating class sitting for Examinations Council of Zambia (ECZ) Senior Secondary School Certificate (SSSC).",
    status: "Active",
    maxPupils: 75,
    leadTeacherName: "Dr. Emmanuel Zulu",
    leadTeacherId: 7
  },
  {
    id: "batch-2026-stem",
    code: "BAT-2026-STEM",
    name: "2026 Senior STEM & Natural Sciences Stream",
    academicYear: 2026,
    intakeTerm: "Term 1",
    targetGrades: ["Grade 10", "Grade 11", "Grade 12"],
    startDate: "2026-01-12",
    endDate: "2026-12-04",
    description: "Specialized senior cohort for medical, engineering and biological laboratory science streams.",
    status: "Active",
    maxPupils: 110,
    leadTeacherName: "Dr. Emmanuel Zulu",
    leadTeacherId: 7
  },
  {
    id: "batch-2027-intake",
    code: "BAT-2027-PRE",
    name: "2027 Early Enrollment Batch",
    academicYear: 2027,
    intakeTerm: "Term 1",
    targetGrades: ["Grade 1", "Grade 8", "Grade 10"],
    startDate: "2027-01-11",
    endDate: "2027-12-03",
    description: "Early admissions and pre-registered pupils for the upcoming 2027 academic school year.",
    status: "Upcoming",
    maxPupils: 150,
    leadTeacherName: "Mrs. Beauty Tembo",
    leadTeacherId: 1
  }
];

export const initialSubjectsCatalog: SubjectDefinition[] = [
  // Primary Core Subjects
  {
    id: "SUB-PRI-ENG",
    code: "101",
    name: "English Language & Literacy",
    category: "Core",
    section: "Primary",
    gradesApplicable: [1, 2, 3, 4, 5, 6, 7],
    passMark: 50,
    weeklyPeriods: 7,
    department: "Languages",
    assignedTeacherName: "Mr. Davison Banda",
    assignedTeacherId: 4,
    description: "Reading comprehension, creative writing, grammar, phonics and communicative competence."
  },
  {
    id: "SUB-PRI-MATH",
    code: "102",
    name: "Mathematics",
    category: "Core",
    section: "Primary",
    gradesApplicable: [1, 2, 3, 4, 5, 6, 7],
    passMark: 50,
    weeklyPeriods: 7,
    department: "Mathematics & Computing",
    assignedTeacherName: "Mr. Mulenga Musonda",
    assignedTeacherId: 2,
    description: "Numeracy, arithmetic, basic geometry, fractions, percentages and word problem solving."
  },
  {
    id: "SUB-PRI-SCI",
    code: "103",
    name: "Integrated Science",
    category: "Core",
    section: "Primary",
    gradesApplicable: [1, 2, 3, 4, 5, 6, 7],
    passMark: 50,
    weeklyPeriods: 5,
    department: "Natural Sciences",
    assignedTeacherName: "Ms. Chileshe Phiri",
    assignedTeacherId: 3,
    description: "Human body, plant and animal biology, environment, energy, weather and matter."
  },
  {
    id: "SUB-PRI-SOC",
    code: "104",
    name: "Social Studies",
    category: "Core",
    section: "Primary",
    gradesApplicable: [1, 2, 3, 4, 5, 6, 7],
    passMark: 45,
    weeklyPeriods: 4,
    department: "Social Sciences",
    assignedTeacherName: "Ms. Chileshe Phiri",
    assignedTeacherId: 3,
    description: "Zambian history, geography, governance, civic duty and cultural heritage."
  },
  {
    id: "SUB-PRI-ZAM",
    code: "105",
    name: "Icibemba / Cinyanja (Zambian Language)",
    category: "Core",
    section: "Primary",
    gradesApplicable: [1, 2, 3, 4, 5, 6, 7],
    passMark: 45,
    weeklyPeriods: 4,
    department: "Languages",
    assignedTeacherName: "Mrs. Beauty Tembo",
    assignedTeacherId: 1,
    description: "Mother tongue literacy, local proverbs, oral traditions and Zambian cultural expression."
  },
  {
    id: "SUB-PRI-CTS",
    code: "106",
    name: "Creative & Technology Studies (CTS)",
    category: "Vocational / Practical",
    section: "Primary",
    gradesApplicable: [1, 2, 3, 4, 5, 6, 7],
    passMark: 45,
    weeklyPeriods: 3,
    department: "Practical Skills",
    assignedTeacherName: "Mr. Mulenga Musonda",
    assignedTeacherId: 2,
    description: "Arts, physical education, practical crafts, music and foundational computer awareness."
  },
  {
    id: "SUB-PRI-RE",
    code: "107",
    name: "Religious Education & Christian Values",
    category: "Religious & Moral",
    section: "Primary",
    gradesApplicable: [1, 2, 3, 4, 5, 6, 7],
    passMark: 50,
    weeklyPeriods: 3,
    department: "Social Sciences",
    assignedTeacherName: "Mr. Davison Banda",
    assignedTeacherId: 4,
    description: "Biblical ethics, character development, moral integrity and Christian living."
  },

  // Junior & Senior Secondary Subjects
  {
    id: "SUB-SEC-ENG",
    code: "1121",
    name: "English Language",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [8, 9, 10, 11, 12],
    passMark: 50,
    weeklyPeriods: 6,
    department: "Languages",
    assignedTeacherName: "Ms. Tendai Lungu",
    assignedTeacherId: 9,
    description: "ECZ Paper 1 (Composition & Summary) and Paper 2 (Comprehension & Structures)."
  },
  {
    id: "SUB-SEC-MATH",
    code: "4024",
    name: "Mathematics",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [8, 9, 10, 11, 12],
    passMark: 50,
    weeklyPeriods: 7,
    department: "Mathematics & Computing",
    assignedTeacherName: "Mr. Kelvin Chinyama",
    assignedTeacherId: 5,
    description: "Algebra, trigonometry, statistics, calculus, matrices, vectors and coordinate geometry."
  },
  {
    id: "SUB-SEC-CIV",
    code: "2030",
    name: "Civic Education",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [8, 9, 10, 11, 12],
    passMark: 50,
    weeklyPeriods: 4,
    department: "Social Sciences",
    assignedTeacherName: "Mrs. Naomi Mwila",
    assignedTeacherId: 6,
    description: "Constitution, human rights, rule of law, anti-corruption, democracy and international relations."
  },
  {
    id: "SUB-SEC-PHY",
    code: "5124",
    name: "Pure Physics",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Natural Sciences",
    passMark: 50,
    weeklyPeriods: 6,
    department: "Natural Sciences",
    assignedTeacherName: "Dr. Emmanuel Zulu",
    assignedTeacherId: 7,
    description: "Mechanics, thermal physics, wave optics, electricity, electromagnetism and modern nuclear physics."
  },
  {
    id: "SUB-SEC-CHE",
    code: "5070",
    name: "Pure Chemistry",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Natural Sciences",
    passMark: 50,
    weeklyPeriods: 6,
    department: "Natural Sciences",
    assignedTeacherName: "Dr. Emmanuel Zulu",
    assignedTeacherId: 7,
    description: "Atomic structure, stoichiometry, chemical bonding, organic chemistry and laboratory analysis."
  },
  {
    id: "SUB-SEC-BIO",
    code: "5090",
    name: "Biology",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Natural Sciences",
    passMark: 50,
    weeklyPeriods: 5,
    department: "Natural Sciences",
    assignedTeacherName: "Dr. Emmanuel Zulu",
    assignedTeacherId: 7,
    description: "Human physiology, cell biology, genetics, ecology, botany and microbiology."
  },
  {
    id: "SUB-SEC-ADDM",
    code: "4037",
    name: "Additional Mathematics",
    category: "Elective",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Natural Sciences",
    passMark: 50,
    weeklyPeriods: 5,
    department: "Mathematics & Computing",
    assignedTeacherName: "Mr. Kelvin Chinyama",
    assignedTeacherId: 5,
    description: "Advanced calculus, binomial series, circular measure, permutations and trigonometry."
  },
  {
    id: "SUB-SEC-ACC",
    code: "7110",
    name: "Principles of Accounts",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Business & Commercial",
    passMark: 50,
    weeklyPeriods: 6,
    department: "Business Studies",
    assignedTeacherName: "Mr. Patrick Mulenga",
    assignedTeacherId: 8,
    description: "Ledger entries, trial balances, financial statements, bank reconciliations and partnership accounting."
  },
  {
    id: "SUB-SEC-COM",
    code: "7100",
    name: "Commerce",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Business & Commercial",
    passMark: 50,
    weeklyPeriods: 5,
    department: "Business Studies",
    assignedTeacherName: "Mr. Patrick Mulenga",
    assignedTeacherId: 8,
    description: "Trade, banking, insurance, transportation, marketing and international commerce."
  },
  {
    id: "SUB-SEC-ECO",
    code: "2281",
    name: "Economics",
    category: "Elective",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Business & Commercial",
    passMark: 50,
    weeklyPeriods: 5,
    department: "Business Studies",
    assignedTeacherName: "Mr. Patrick Mulenga",
    assignedTeacherId: 8,
    description: "Microeconomics, macroeconomic policy, inflation, monetary systems and global economic trade."
  },
  {
    id: "SUB-SEC-LIT",
    code: "2010",
    name: "Literature in English",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Social Sciences & Humanities",
    passMark: 50,
    weeklyPeriods: 5,
    department: "Languages",
    assignedTeacherName: "Ms. Tendai Lungu",
    assignedTeacherId: 9,
    description: "African prose, Shakespearean drama, world poetry and literary critical appreciation."
  },
  {
    id: "SUB-SEC-HIS",
    code: "2167",
    name: "History",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Social Sciences & Humanities",
    passMark: 50,
    weeklyPeriods: 5,
    department: "Social Sciences",
    assignedTeacherName: "Ms. Tendai Lungu",
    assignedTeacherId: 9,
    description: "Central African history, pre-colonial civilizations, nationalism, and 20th-century world events."
  },
  {
    id: "SUB-SEC-GEO",
    code: "2218",
    name: "Geography",
    category: "Core",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Social Sciences & Humanities",
    passMark: 50,
    weeklyPeriods: 5,
    department: "Social Sciences",
    assignedTeacherName: "Mrs. Naomi Mwila",
    assignedTeacherId: 6,
    description: "Physical geography, map reading, climatology, economic geography of Zambia and SADC region."
  },
  {
    id: "SUB-SEC-RE2046",
    code: "2046",
    name: "Religious Education (2046)",
    category: "Elective",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Social Sciences & Humanities",
    passMark: 50,
    weeklyPeriods: 4,
    department: "Social Sciences",
    assignedTeacherName: "Ms. Tendai Lungu",
    assignedTeacherId: 9,
    description: "Christian teachings, moral dilemmas, social justice, ethics and contemporary spiritual issues."
  },
  {
    id: "SUB-SEC-CS",
    code: "7010",
    name: "Computer Studies & ICT",
    category: "Vocational / Practical",
    section: "Secondary",
    gradesApplicable: [8, 9, 10, 11, 12],
    passMark: 50,
    weeklyPeriods: 5,
    department: "Mathematics & Computing",
    assignedTeacherName: "Eng. Bwalya Kaunda",
    assignedTeacherId: 10,
    description: "Algorithm design, database systems, spreadsheets, network fundamentals and introductory coding."
  },
  {
    id: "SUB-SEC-DT",
    code: "6043",
    name: "Design & Technology (D&T)",
    category: "Vocational / Practical",
    section: "Secondary",
    gradesApplicable: [10, 11, 12],
    pathway: "Technical & Vocational",
    passMark: 50,
    weeklyPeriods: 6,
    department: "Practical Skills",
    assignedTeacherName: "Eng. Bwalya Kaunda",
    assignedTeacherId: 10,
    description: "Orthographic projection, workshop fabrication, electronics, materials science and product design."
  },
  {
    id: "SUB-SEC-AGRI",
    code: "5038",
    name: "Agricultural Science",
    category: "Vocational / Practical",
    section: "Secondary",
    gradesApplicable: [8, 9, 10, 11, 12],
    pathway: "Technical & Vocational",
    passMark: 50,
    weeklyPeriods: 5,
    department: "Practical Skills",
    assignedTeacherName: "Eng. Bwalya Kaunda",
    assignedTeacherId: 10,
    description: "Crop husbandry, animal science, soil fertility, farm management and agricultural mechanization."
  }
];

export const initialClasses: ClassStream[] = [
  // Early Childhood Education (Baby Class to Reception)
  { id: 12, name: "Baby Class Sunshine", gradeNum: 0, streamName: "Sunshine", section: "Early Childhood", batchId: "batch-2026-main", teacherName: "Mrs. Beauty Tembo", teacherId: 1, room: "ECE Wing - Room 1", capacity: 25 },
  { id: 13, name: "Middle Class Rainbow", gradeNum: 0, streamName: "Rainbow", section: "Early Childhood", batchId: "batch-2026-main", teacherName: "Mrs. Beauty Tembo", teacherId: 1, room: "ECE Wing - Room 2", capacity: 28 },
  { id: 14, name: "Reception Stars", gradeNum: 0, streamName: "Stars", section: "Early Childhood", batchId: "batch-2026-main", teacherName: "Mrs. Beauty Tembo", teacherId: 1, room: "ECE Wing - Room 3", capacity: 30 },

  // Primary Section (Grades 1 to 7)
  { id: 1, name: "Grade 1 Blue", gradeNum: 1, streamName: "Blue", section: "Primary", batchId: "batch-2026-main", teacherName: "Mrs. Beauty Tembo", teacherId: 1, room: "Block A - Room 1", capacity: 35 },
  { id: 2, name: "Grade 3 Eagle", gradeNum: 3, streamName: "Eagle", section: "Primary", batchId: "batch-2026-main", teacherName: "Mr. Mulenga Musonda", teacherId: 2, room: "Block A - Room 4", capacity: 38 },
  { id: 3, name: "Grade 5 Rhino", gradeNum: 5, streamName: "Rhino", section: "Primary", batchId: "batch-2026-main", teacherName: "Ms. Chileshe Phiri", teacherId: 3, room: "Block B - Room 2", capacity: 40 },
  { id: 4, name: "Grade 7 Eagle (Exam)", gradeNum: 7, streamName: "Eagle", section: "Primary", batchId: "batch-2026-g7", teacherName: "Mr. Davison Banda", teacherId: 4, room: "Block C - Room 1", capacity: 42 },

  // Secondary Section - Junior Secondary (Form 1 to Form 2)
  { id: 5, name: "Form 1 Alpha", gradeNum: 8, streamName: "Alpha", section: "Secondary", pathway: "Junior Secondary Core", batchId: "batch-2026-main", teacherName: "Mr. Kelvin Chinyama", teacherId: 5, room: "Secondary Wing - S1", capacity: 40 },
  { id: 6, name: "Form 2 Beta (Exam)", gradeNum: 9, streamName: "Beta", section: "Secondary", pathway: "Junior Secondary Core", batchId: "batch-2026-g9", teacherName: "Mrs. Naomi Mwila", teacherId: 6, room: "Secondary Wing - S2", capacity: 40 },

  // Secondary Section - Senior Secondary (Form 3 to Form 4 Pathways)
  { id: 7, name: "Form 3 Science", gradeNum: 10, streamName: "Science", section: "Secondary", pathway: "Natural Sciences", batchId: "batch-2026-stem", teacherName: "Dr. Emmanuel Zulu", teacherId: 7, room: "Science Complex Lab 1", capacity: 35 },
  { id: 8, name: "Form 3 Commerce", gradeNum: 10, streamName: "Commerce", section: "Secondary", pathway: "Business & Commercial", batchId: "batch-2026-main", teacherName: "Mr. Patrick Mulenga", teacherId: 8, room: "Business Suite B1", capacity: 35 },
  { id: 9, name: "Form 4 Arts", gradeNum: 12, streamName: "Arts", section: "Secondary", pathway: "Social Sciences & Humanities", batchId: "batch-2026-main", teacherName: "Ms. Tendai Lungu", teacherId: 9, room: "Humanities Wing H2", capacity: 35 },
  { id: 10, name: "Form 4 Technical (Exam)", gradeNum: 12, streamName: "Technical", section: "Secondary", pathway: "Technical & Vocational", batchId: "batch-2026-g12", teacherName: "Eng. Bwalya Kaunda", teacherId: 10, room: "TEVET Workshop W1", capacity: 32 },
  { id: 11, name: "Form 4 STEM (Exam)", gradeNum: 12, streamName: "STEM", section: "Secondary", pathway: "Natural Sciences", batchId: "batch-2026-g12", teacherName: "Dr. Emmanuel Zulu", teacherId: 7, room: "Advanced Physics Lab", capacity: 35 }
];

export const initialResultsApprovals: Record<number, Record<string, TermResultsApproval>> = {
  // 101 - Chanda Bwalya (Approved and published for Term 1)
  101: {
    "Term 1": {
      studentId: 101,
      term: "Term 1",
      year: 2026,
      status: "Approved_Published",
      submittedByTeacherName: "Mr. Davison Banda",
      submittedDate: "2026-04-10",
      approvedByAdminName: "Mr. Davison Banda (Headmaster)",
      approvedDate: "2026-04-12",
      adminNotes: "Results approved and officially certified for publication."
    },
    "Term 2": {
      studentId: 101,
      term: "Term 2",
      year: 2026,
      status: "Pending_Approval",
      submittedByTeacherName: "Mr. Davison Banda",
      submittedDate: "2026-08-15"
    }
  },
  102: {
    "Term 1": {
      studentId: 102,
      term: "Term 1",
      year: 2026,
      status: "Approved_Published",
      submittedByTeacherName: "Mr. Davison Banda",
      submittedDate: "2026-04-10",
      approvedByAdminName: "Mr. Davison Banda (Headmaster)",
      approvedDate: "2026-04-12"
    }
  },
  103: {
    "Term 1": {
      studentId: 103,
      term: "Term 1",
      year: 2026,
      status: "Approved_Published",
      submittedByTeacherName: "Mr. Davison Banda",
      submittedDate: "2026-04-10",
      approvedByAdminName: "Mr. Davison Banda (Headmaster)",
      approvedDate: "2026-04-12"
    }
  },
  104: {
    "Term 1": {
      studentId: 104,
      term: "Term 1",
      year: 2026,
      status: "Approved_Published",
      submittedByTeacherName: "Mrs. Beauty Tembo",
      submittedDate: "2026-04-10",
      approvedByAdminName: "Mr. Davison Banda (Headmaster)",
      approvedDate: "2026-04-12"
    }
  },
  106: {
    "Term 1": {
      studentId: 106,
      term: "Term 1",
      year: 2026,
      status: "Approved_Published",
      submittedByTeacherName: "Dr. Emmanuel Zulu",
      submittedDate: "2026-04-10",
      approvedByAdminName: "Mr. Davison Banda (Headmaster)",
      approvedDate: "2026-04-12"
    }
  }
};

export const initialTeachers: Teacher[] = [
  // Primary Teachers
  { id: 1, name: "Mrs. Beauty Tembo", tscNumber: "TCZ/2014/08492", primarySubject: "Literacy & Early Childhood", classesAssigned: [1], experienceYrs: 11, section: "Primary", status: "Active", username: "beauty.tembo" },
  { id: 2, name: "Mr. Mulenga Musonda", tscNumber: "TCZ/2016/11204", primarySubject: "Mathematics & Science", classesAssigned: [2], experienceYrs: 8, section: "Primary", status: "Active", username: "mulenga.musonda" },
  { id: 3, name: "Ms. Chileshe Phiri", tscNumber: "TCZ/2018/15903", primarySubject: "Social Studies & CTS", classesAssigned: [3], experienceYrs: 6, section: "Primary", status: "Active", username: "chileshe.phiri" },
  { id: 4, name: "Mr. Davison Banda", tscNumber: "TCZ/2011/04310", primarySubject: "English & Primary Exam Prep", classesAssigned: [4], experienceYrs: 15, section: "Primary", status: "Active", username: "davison.banda" },

  // Secondary Teachers & Pathway Specialists
  { id: 5, name: "Mr. Kelvin Chinyama", tscNumber: "TCZ/2017/09432", primarySubject: "Junior Mathematics & Science", classesAssigned: [5], experienceYrs: 7, section: "Secondary", pathways: ["Junior Secondary Core"], status: "Active", username: "kelvin.chinyama" },
  { id: 6, name: "Mrs. Naomi Mwila", tscNumber: "TCZ/2014/06118", primarySubject: "Junior Social Studies & Business", classesAssigned: [6], experienceYrs: 10, section: "Secondary", pathways: ["Junior Secondary Core"], status: "Active", username: "naomi.mwila" },
  { id: 7, name: "Dr. Emmanuel Zulu", tscNumber: "TCZ/2009/01284", primarySubject: "Pure Physics & Chemistry", classesAssigned: [7, 11], experienceYrs: 16, section: "Secondary", pathways: ["Natural Sciences"], status: "Active", username: "emmanuel.zulu" },
  { id: 8, name: "Mr. Patrick Mulenga", tscNumber: "TCZ/2012/03319", primarySubject: "Principles of Accounts & Commerce", classesAssigned: [8], experienceYrs: 12, section: "Secondary", pathways: ["Business & Commercial"], status: "Active", username: "patrick.mulenga" },
  { id: 9, name: "Ms. Tendai Lungu", tscNumber: "TCZ/2015/07842", primarySubject: "Literature in English & History", classesAssigned: [9], experienceYrs: 9, section: "Secondary", pathways: ["Social Sciences & Humanities"], status: "Active", username: "tendai.lungu" },
  { id: 10, name: "Eng. Bwalya Kaunda", tscNumber: "TCZ/2010/02911", primarySubject: "Design & Technology / Technical Drawing", classesAssigned: [10], experienceYrs: 14, section: "Secondary", pathways: ["Technical & Vocational"], status: "Active", username: "bwalya.kaunda" }
];

export const initialStudents: Student[] = [
  // Primary Pupils
  {
    id: 101,
    eczNo: "26010045001",
    name: "Chanda Bwalya",
    gender: "Male",
    grade: "Grade 7",
    stream: "Eagle",
    classId: 4,
    age: 13,
    section: "Primary",
    guardianName: "Bwalya Joseph",
    guardianPhone: "+260 977 123456",
    guardianEmail: "bwalya.joseph@gmail.com",
    status: "Active",
    username: "chanda.bwalya",
    routeId: 1
  },
  {
    id: 102,
    eczNo: "26010045002",
    name: "Mutinta Banda",
    gender: "Female",
    grade: "Grade 7",
    stream: "Eagle",
    classId: 4,
    age: 12,
    section: "Primary",
    guardianName: "Banda Grace",
    guardianPhone: "+260 966 876543",
    guardianEmail: "grace.banda@yahoo.com",
    status: "Active",
    username: "mutinta.banda",
    routeId: 1
  },
  {
    id: 103,
    eczNo: "26010045003",
    name: "Kunda Musonda",
    gender: "Male",
    grade: "Grade 7",
    stream: "Eagle",
    classId: 4,
    age: 13,
    section: "Primary",
    guardianName: "Musonda Charles",
    guardianPhone: "+260 955 334455",
    guardianEmail: "charles.musonda@zamtel.zm",
    status: "Active",
    username: "kunda.musonda",
    routeId: 2
  },
  {
    id: 104,
    eczNo: "26010045004",
    name: "Nchimunya Lungu",
    gender: "Female",
    grade: "Grade 5",
    stream: "Rhino",
    classId: 3,
    age: 11,
    section: "Primary",
    guardianName: "Lungu Patrick",
    guardianPhone: "+260 978 998877",
    guardianEmail: "patrick.lungu@gmail.com",
    status: "Active",
    username: "nchimunya.lungu",
    routeId: 2
  },
  {
    id: 105,
    eczNo: "26010045005",
    name: "Mapalo Mwansa",
    gender: "Female",
    grade: "Grade 3",
    stream: "Eagle",
    classId: 2,
    age: 9,
    section: "Primary",
    guardianName: "Mwansa Agness",
    guardianPhone: "+260 967 554433",
    guardianEmail: "agness.mwansa@outlook.com",
    status: "Active",
    username: "mapalo.mwansa",
    routeId: 1
  },
  {
    id: 106,
    eczNo: "26010045006",
    name: "Tiseke Zimba",
    gender: "Male",
    grade: "Grade 1",
    stream: "Blue",
    classId: 1,
    age: 7,
    section: "Primary",
    guardianName: "Zimba George",
    guardianPhone: "+260 971 221100",
    guardianEmail: "george.zimba@gmail.com",
    status: "Active",
    username: "tiseke.zimba",
    routeId: 2
  },

  // Secondary Pupils - Junior Secondary (Grades 8 & 9)
  {
    id: 201,
    eczNo: "26010045021",
    name: "Lubona Chilufya",
    gender: "Female",
    grade: "Grade 8",
    stream: "Alpha",
    classId: 5,
    age: 14,
    section: "Secondary",
    pathway: "Junior Secondary Core",
    guardianName: "Chilufya Moses",
    guardianPhone: "+260 977 445566",
    guardianEmail: "moses.chilufya@zamtel.zm",
    status: "Active",
    username: "lubona.chilufya",
    routeId: 1
  },
  {
    id: 202,
    eczNo: "26010045022",
    name: "Bupe Chileshe",
    gender: "Male",
    grade: "Grade 9",
    stream: "Beta",
    classId: 6,
    age: 15,
    section: "Secondary",
    pathway: "Junior Secondary Core",
    guardianName: "Chileshe Miriam",
    guardianPhone: "+260 966 331188",
    guardianEmail: "miriam.chileshe@gmail.com",
    status: "Active",
    username: "bupe.chileshe",
    routeId: 2
  },

  // Secondary Pupils - Senior Secondary Pathways (Grades 10, 11, 12)
  {
    id: 203,
    eczNo: "26010045031",
    name: "Mwamba Mulenga",
    gender: "Male",
    grade: "Grade 10",
    stream: "Science",
    classId: 7,
    age: 16,
    section: "Secondary",
    pathway: "Natural Sciences",
    guardianName: "Mulenga Beatrice",
    guardianPhone: "+260 971 889900",
    guardianEmail: "beatrice.mulenga@yahoo.com",
    status: "Active",
    username: "mwamba.mulenga",
    routeId: 1
  },
  {
    id: 204,
    eczNo: "26010045041",
    name: "Natasha Sakala",
    gender: "Female",
    grade: "Grade 11",
    stream: "Commerce",
    classId: 8,
    age: 17,
    section: "Secondary",
    pathway: "Business & Commercial",
    guardianName: "Sakala Enock",
    guardianPhone: "+260 955 776655",
    guardianEmail: "enock.sakala@bankofzambia.zm",
    status: "Active",
    username: "natasha.sakala",
    routeId: 2
  },
  {
    id: 205,
    eczNo: "26010045051",
    name: "Taonga Phiri",
    gender: "Female",
    grade: "Grade 11",
    stream: "Arts",
    classId: 9,
    age: 17,
    section: "Secondary",
    pathway: "Social Sciences & Humanities",
    guardianName: "Phiri Vincent",
    guardianPhone: "+260 967 114422",
    guardianEmail: "vincent.phiri@moe.gov.zm",
    status: "Active",
    username: "taonga.phiri",
    routeId: 1
  },
  {
    id: 206,
    eczNo: "26010045061",
    name: "Kondwani Tembo",
    gender: "Male",
    grade: "Grade 12",
    stream: "Technical",
    classId: 10,
    age: 18,
    section: "Secondary",
    pathway: "Technical & Vocational",
    guardianName: "Tembo Judith",
    guardianPhone: "+260 978 332211",
    guardianEmail: "judith.tembo@zesco.co.zm",
    status: "Active",
    username: "kondwani.tembo",
    routeId: 2
  },
  {
    id: 207,
    eczNo: "26010045071",
    name: "Dalitso Zulu",
    gender: "Male",
    grade: "Grade 12",
    stream: "STEM",
    classId: 11,
    age: 18,
    section: "Secondary",
    pathway: "Natural Sciences",
    guardianName: "Zulu Martha",
    guardianPhone: "+260 977 990011",
    guardianEmail: "martha.zulu@unza.zm",
    status: "Active",
    username: "dalitso.zulu",
    routeId: 1
  }
];

export const initialParentAccounts: ParentAccount[] = [
  { id: 1, name: "Bwalya Joseph", nrcNumber: "294021/11/1", phone: "+260 977 123456", email: "bwalya.joseph@gmail.com", childIds: [101], username: "bwalya.joseph" },
  { id: 2, name: "Banda Grace", nrcNumber: "183920/52/1", phone: "+260 966 876543", email: "grace.banda@yahoo.com", childIds: [102], username: "grace.banda" },
  { id: 3, name: "Musonda Charles", nrcNumber: "349102/67/1", phone: "+260 955 334455", email: "charles.musonda@zamtel.zm", childIds: [103], username: "charles.musonda" },
  { id: 4, name: "Lungu Patrick", nrcNumber: "220194/10/1", phone: "+260 978 998877", email: "patrick.lungu@gmail.com", childIds: [104], username: "patrick.lungu" },
  { id: 5, name: "Mulenga Beatrice", nrcNumber: "148201/10/1", phone: "+260 971 889900", email: "beatrice.mulenga@yahoo.com", childIds: [203], username: "beatrice.mulenga" },
  { id: 6, name: "Sakala Enock", nrcNumber: "301928/51/1", phone: "+260 955 776655", email: "enock.sakala@bankofzambia.zm", childIds: [204], username: "enock.sakala" },
  { id: 7, name: "Zulu Martha", nrcNumber: "219034/11/1", phone: "+260 977 990011", email: "martha.zulu@unza.zm", childIds: [207], username: "martha.zulu" }
];

export function buildDefaultGradebook(): GradebookData {
  const gb: GradebookData = {};

  // Initialize gb structure for all 11 classes
  initialClasses.forEach(cls => {
    gb[cls.id] = { "Term 1": {}, "Term 2": {}, "Term 3": {} };
  });

  // Seed sample grades for Grade 7 Eagle (Class 4)
  const grade7Students = [101, 102, 103];
  const grade7Subjects = getZambianSubjectsForGrade(7);

  // Progressive scores across Term 1, Term 2, and Term 3 showing academic improvement
  const termProgression: Record<string, Record<number, Record<string, { ca: number; mid: number; end: number }>>> = {
    "Term 1": {
      101: {
        "English Language": { ca: 26, mid: 17, end: 43 }, // 86
        "Mathematics": { ca: 27, mid: 18, end: 43 }, // 88
        "Integrated Science": { ca: 24, mid: 16, end: 40 }, // 80
        "Social Studies": { ca: 23, mid: 15, end: 38 }, // 76
        "Icibemba / Cinyanja (Zambian Language)": { ca: 25, mid: 17, end: 41 }, // 83
        "Creative & Technology Studies (CTS)": { ca: 22, mid: 14, end: 36 }, // 72
        "Expressive Arts & R.E.": { ca: 23, mid: 16, end: 36 } // 75
      },
      102: {
        "English Language": { ca: 21, mid: 13, end: 35 }, // 69
        "Mathematics": { ca: 19, mid: 12, end: 31 }, // 62
        "Integrated Science": { ca: 20, mid: 14, end: 33 }, // 67
        "Social Studies": { ca: 19, mid: 12, end: 30 }, // 61
        "Icibemba / Cinyanja (Zambian Language)": { ca: 24, mid: 16, end: 38 }, // 78
        "Creative & Technology Studies (CTS)": { ca: 20, mid: 13, end: 32 }, // 65
        "Expressive Arts & R.E.": { ca: 20, mid: 13, end: 31 } // 64
      },
      103: {
        "English Language": { ca: 16, mid: 10, end: 25 }, // 51
        "Mathematics": { ca: 14, mid: 9, end: 21 }, // 44
        "Integrated Science": { ca: 17, mid: 11, end: 25 }, // 53
        "Social Studies": { ca: 15, mid: 10, end: 23 }, // 48
        "Icibemba / Cinyanja (Zambian Language)": { ca: 18, mid: 12, end: 28 }, // 58
        "Creative & Technology Studies (CTS)": { ca: 16, mid: 10, end: 24 }, // 50
        "Expressive Arts & R.E.": { ca: 17, mid: 11, end: 26 } // 54
      }
    },
    "Term 2": {
      101: {
        "English Language": { ca: 27, mid: 18, end: 44 }, // 89
        "Mathematics": { ca: 28, mid: 19, end: 46 }, // 93
        "Integrated Science": { ca: 25, mid: 17, end: 42 }, // 84
        "Social Studies": { ca: 24, mid: 16, end: 39 }, // 79
        "Icibemba / Cinyanja (Zambian Language)": { ca: 26, mid: 18, end: 43 }, // 87
        "Creative & Technology Studies (CTS)": { ca: 24, mid: 16, end: 38 }, // 78
        "Expressive Arts & R.E.": { ca: 25, mid: 17, end: 38 } // 80
      },
      102: {
        "English Language": { ca: 23, mid: 15, end: 37 }, // 75
        "Mathematics": { ca: 21, mid: 14, end: 34 }, // 69
        "Integrated Science": { ca: 22, mid: 15, end: 36 }, // 73
        "Social Studies": { ca: 21, mid: 14, end: 32 }, // 67
        "Icibemba / Cinyanja (Zambian Language)": { ca: 26, mid: 17, end: 40 }, // 83
        "Creative & Technology Studies (CTS)": { ca: 22, mid: 15, end: 35 }, // 72
        "Expressive Arts & R.E.": { ca: 22, mid: 15, end: 33 } // 70
      },
      103: {
        "English Language": { ca: 18, mid: 12, end: 28 }, // 58
        "Mathematics": { ca: 17, mid: 11, end: 24 }, // 52
        "Integrated Science": { ca: 19, mid: 13, end: 28 }, // 60
        "Social Studies": { ca: 18, mid: 12, end: 26 }, // 56
        "Icibemba / Cinyanja (Zambian Language)": { ca: 21, mid: 14, end: 31 }, // 66
        "Creative & Technology Studies (CTS)": { ca: 19, mid: 12, end: 27 }, // 58
        "Expressive Arts & R.E.": { ca: 20, mid: 13, end: 29 } // 62
      }
    },
    "Term 3": {
      101: {
        "English Language": { ca: 29, mid: 19, end: 46 }, // 94
        "Mathematics": { ca: 29, mid: 20, end: 48 }, // 97
        "Integrated Science": { ca: 27, mid: 18, end: 44 }, // 89
        "Social Studies": { ca: 26, mid: 17, end: 41 }, // 84
        "Icibemba / Cinyanja (Zambian Language)": { ca: 28, mid: 19, end: 45 }, // 92
        "Creative & Technology Studies (CTS)": { ca: 26, mid: 17, end: 40 }, // 83
        "Expressive Arts & R.E.": { ca: 26, mid: 18, end: 41 } // 85
      },
      102: {
        "English Language": { ca: 25, mid: 17, end: 40 }, // 82
        "Mathematics": { ca: 24, mid: 16, end: 37 }, // 77
        "Integrated Science": { ca: 25, mid: 16, end: 39 }, // 80
        "Social Studies": { ca: 23, mid: 15, end: 35 }, // 73
        "Icibemba / Cinyanja (Zambian Language)": { ca: 27, mid: 18, end: 43 }, // 88
        "Creative & Technology Studies (CTS)": { ca: 24, mid: 16, end: 38 }, // 78
        "Expressive Arts & R.E.": { ca: 24, mid: 16, end: 36 } // 76
      },
      103: {
        "English Language": { ca: 21, mid: 14, end: 32 }, // 67
        "Mathematics": { ca: 20, mid: 13, end: 30 }, // 63
        "Integrated Science": { ca: 22, mid: 15, end: 33 }, // 70
        "Social Studies": { ca: 21, mid: 14, end: 30 }, // 65
        "Icibemba / Cinyanja (Zambian Language)": { ca: 24, mid: 16, end: 35 }, // 75
        "Creative & Technology Studies (CTS)": { ca: 22, mid: 14, end: 32 }, // 68
        "Expressive Arts & R.E.": { ca: 23, mid: 15, end: 33 } // 71
      }
    }
  };

  ["Term 1", "Term 2", "Term 3"].forEach(termKey => {
    gb[4][termKey] = {};
    grade7Subjects.forEach(subj => {
      gb[4][termKey][subj] = {};
      grade7Students.forEach(stId => {
        const perf = termProgression[termKey]?.[stId]?.[subj] || { ca: 20, mid: 12, end: 30 };
        const total = perf.ca + perf.mid + perf.end;
        const gz = calculateEczGrade(total);
        gb[4][termKey][subj][stId] = {
          caScore: perf.ca,
          midTermScore: perf.mid,
          endTermScore: perf.end,
          totalScore: total,
          eczGrade: gz.point,
          remark: gz.remark,
          teacherInitials: "D.B."
        };
      });
    });
  });

  // Seed sample grades for Grade 12 STEM (Class 11, student Dalitso Zulu 207)
  const stemSubjects = getZambianSubjectsForGrade(12, "Natural Sciences");
  ["Term 1", "Term 2", "Term 3"].forEach(termKey => {
    if (!gb[11][termKey]) gb[11][termKey] = {};
    stemSubjects.forEach(subj => {
      if (!gb[11][termKey][subj]) gb[11][termKey][subj] = {};
      const baseScores: Record<string, number> = {
        "English Language": 84,
        "Mathematics": 92,
        "Civic Education": 88,
        "Pure Physics": 89,
        "Pure Chemistry": 86,
        "Biology": 90,
        "Additional Mathematics": 85,
        "Computer Science": 94
      };
      const total = baseScores[subj] || 82;
      const ca = Math.round(total * 0.3);
      const mid = Math.round(total * 0.2);
      const end = total - ca - mid;
      const gz = calculateEczGrade(total);
      gb[11][termKey][subj][207] = {
        caScore: ca,
        midTermScore: mid,
        endTermScore: end,
        totalScore: total,
        eczGrade: gz.point,
        remark: gz.remark,
        teacherInitials: "E.Z."
      };
    });
  });

  // Seed sample grades for Grade 11 Commerce (Class 8, Natasha Sakala 204)
  const commSubjects = getZambianSubjectsForGrade(11, "Business & Commercial");
  ["Term 1", "Term 2", "Term 3"].forEach(termKey => {
    if (!gb[8][termKey]) gb[8][termKey] = {};
    commSubjects.forEach(subj => {
      if (!gb[8][termKey][subj]) gb[8][termKey][subj] = {};
      const baseScores: Record<string, number> = {
        "English Language": 86,
        "Mathematics": 84,
        "Civic Education": 91,
        "Principles of Accounts": 93,
        "Commerce": 88,
        "Economics": 85,
        "Business Studies": 89,
        "Information Technology": 90
      };
      const total = baseScores[subj] || 84;
      const ca = Math.round(total * 0.3);
      const mid = Math.round(total * 0.2);
      const end = total - ca - mid;
      const gz = calculateEczGrade(total);
      gb[8][termKey][subj][204] = {
        caScore: ca,
        midTermScore: mid,
        endTermScore: end,
        totalScore: total,
        eczGrade: gz.point,
        remark: gz.remark,
        teacherInitials: "P.M."
      };
    });
  });

  // Also seed default subjects across other classes
  initialClasses.forEach(cls => {
    const subs = getZambianSubjectsForGrade(cls.gradeNum, cls.pathway);
    ["Term 1", "Term 2", "Term 3"].forEach(termKey => {
      if (!gb[cls.id]) gb[cls.id] = { "Term 1": {}, "Term 2": {}, "Term 3": {} };
      if (!gb[cls.id][termKey]) gb[cls.id][termKey] = {};
      subs.forEach(subj => {
        if (!gb[cls.id][termKey][subj]) {
          gb[cls.id][termKey][subj] = {};
        }
      });
    });
  });

  return gb;
}

export const initialTermlyReports: Record<number, Record<string, TermlyReportCard>> = {
  101: {
    "Term 1": {
      studentId: 101,
      term: "Term 1",
      year: 2026,
      daysOpened: 62,
      daysPresent: 60,
      daysAbsent: 2,
      conduct: "Excellent",
      interests: "School Prefect, Mathematics Club, Athletics Team",
      classTeacherComment: "Chanda is an exemplary pupil with outstanding academic drive. On track for Division 1 in Grade 7 final examinations.",
      headteacherComment: "An impressive Term 1 result. Keep maintaining this standard of excellence.",
      promotedTo: "Grade 8 (Pending Final Results)",
      reportDate: "2026-04-18"
    },
    "Term 2": {
      studentId: 101,
      term: "Term 2",
      year: 2026,
      daysOpened: 64,
      daysPresent: 63,
      daysAbsent: 1,
      conduct: "Excellent",
      interests: "Head Boy, Science Fair Winner, Debate Club",
      classTeacherComment: "Chanda showed remarkable growth across Mathematics and Sciences, achieving +5% gains.",
      headteacherComment: "Outstanding academic dedication. Highest aggregate in the Grade 7 cohort.",
      promotedTo: "Grade 8 (Recommended for STEM Stream)",
      reportDate: "2026-08-08"
    },
    "Term 3": {
      studentId: 101,
      term: "Term 3",
      year: 2026,
      daysOpened: 60,
      daysPresent: 60,
      daysAbsent: 0,
      conduct: "Excellent",
      interests: "Graduation Valedictorian, Math Olympiad Finalist",
      classTeacherComment: "Distinction across all 7 primary subjects. Ready for top secondary school admission.",
      headteacherComment: "A stellar year at Bread of Life School. Congratulations to Chanda and family.",
      promotedTo: "Grade 8 (Admitted to Secondary School)",
      reportDate: "2026-12-04"
    }
  },
  102: {
    "Term 1": {
      studentId: 102,
      term: "Term 1",
      year: 2026,
      daysOpened: 62,
      daysPresent: 59,
      daysAbsent: 3,
      conduct: "Good",
      interests: "Drama Society, Traditional Dance, Science Club",
      classTeacherComment: "Mutinta has worked steadily this term. Good performance in Zambian Language and Science.",
      headteacherComment: "Good effort. Encourage extra practice in Mathematics ahead of final exams.",
      promotedTo: "Grade 8 (Pending Final Results)",
      reportDate: "2026-04-18"
    },
    "Term 2": {
      studentId: 102,
      term: "Term 2",
      year: 2026,
      daysOpened: 64,
      daysPresent: 61,
      daysAbsent: 3,
      conduct: "Excellent",
      interests: "Drama Captain, Netball Team",
      classTeacherComment: "Significant improvement in Mathematics and CTS. Consistent effort paid off.",
      headteacherComment: "Commendable progress. The revision clinics are bearing fruit.",
      promotedTo: "Grade 8 (On Track)",
      reportDate: "2026-08-08"
    },
    "Term 3": {
      studentId: 102,
      term: "Term 3",
      year: 2026,
      daysOpened: 60,
      daysPresent: 58,
      daysAbsent: 2,
      conduct: "Excellent",
      interests: "Performing Arts Award, Choir",
      classTeacherComment: "Completed Grade 7 with distinctions and merits across all subject disciplines.",
      headteacherComment: "Well done Mutinta. Ready for Grade 8.",
      promotedTo: "Grade 8 (Promoted)",
      reportDate: "2026-12-04"
    }
  },
  103: {
    "Term 1": {
      studentId: 103,
      term: "Term 1",
      year: 2026,
      daysOpened: 62,
      daysPresent: 54,
      daysAbsent: 8,
      conduct: "Satisfactory",
      interests: "Football Team, Choir",
      classTeacherComment: "Kunda shows potential but needs to improve attendance and focus during Mathematics revision.",
      headteacherComment: "Fair performance. Needs closer supervision at home during exam prep.",
      promotedTo: "Grade 8 (Pending Final Results)",
      reportDate: "2026-04-18"
    },
    "Term 2": {
      studentId: 103,
      term: "Term 2",
      year: 2026,
      daysOpened: 64,
      daysPresent: 60,
      daysAbsent: 4,
      conduct: "Good",
      interests: "School Soccer XI, Music",
      classTeacherComment: "Great turnaround in attendance and +8% jump in Mathematics and Social Studies.",
      headteacherComment: "Very encouraging academic growth. Keep up the strong effort.",
      promotedTo: "Grade 8 (Progressing Well)",
      reportDate: "2026-08-08"
    },
    "Term 3": {
      studentId: 103,
      term: "Term 3",
      year: 2026,
      daysOpened: 60,
      daysPresent: 58,
      daysAbsent: 2,
      conduct: "Good",
      interests: "Sports Captain, Scouting",
      classTeacherComment: "Substantial mastery across all primary subjects, leaping from Satisfactory to Credit and Merit.",
      headteacherComment: "One of the biggest academic improvement stories this year. Congratulations!",
      promotedTo: "Grade 8 (Promoted)",
      reportDate: "2026-12-04"
    }
  },
  207: {
    "Term 2": {
      studentId: 207,
      term: "Term 2",
      year: 2026,
      daysOpened: 64,
      daysPresent: 64,
      daysAbsent: 0,
      conduct: "Excellent",
      interests: "Science Olympiad Captain, Robotics Club, Head Boy",
      classTeacherComment: "Dalitso is performing exceptionally well across the Natural Sciences Pathway with 6 Distinctions (Aggregate 6). Exemplary laboratory competence in Pure Physics and Chemistry.",
      headteacherComment: "A first-class senior secondary candidate. On course for outstanding School Leaving Certificate results and university STEM scholarship.",
      promotedTo: "Grade 12 Senior Secondary Examination Candidate",
      reportDate: "2026-08-08"
    }
  },
  204: {
    "Term 2": {
      studentId: 204,
      term: "Term 2",
      year: 2026,
      daysOpened: 64,
      daysPresent: 62,
      daysAbsent: 2,
      conduct: "Excellent",
      interests: "Junior Achievers Zambia, Debate Club, Business Fair Leader",
      classTeacherComment: "Natasha displays mastery in Principles of Accounts and Commerce in the Business Pathway. Diligent and focused.",
      headteacherComment: "Very strong commercial foundation. Commendable work ethics.",
      promotedTo: "Grade 12 Business Pathway",
      reportDate: "2026-08-08"
    }
  }
};

export const initialFees: FeeItem[] = [
  // Primary Fees
  { id: 1, studentId: 101, description: "Primary Tuition & Development Fee - Term 2", term: "Term 2", year: 2026, amountZMW: 1250, paidAmountZMW: 1250, dueDate: "2026-05-30", status: "Paid" },
  { id: 2, studentId: 101, description: "Grade 7 Primary Examination Fee", term: "Term 2", year: 2026, amountZMW: 250, paidAmountZMW: 250, dueDate: "2026-06-15", status: "Paid" },
  { id: 3, studentId: 102, description: "Primary Tuition & Development Fee - Term 2", term: "Term 2", year: 2026, amountZMW: 1250, paidAmountZMW: 800, dueDate: "2026-05-30", status: "Partially Paid" },
  { id: 4, studentId: 102, description: "PTA Special Project Levy", term: "Term 2", year: 2026, amountZMW: 150, paidAmountZMW: 0, dueDate: "2026-06-05", status: "Unpaid" },
  { id: 5, studentId: 103, description: "Primary Tuition & Development Fee - Term 2", term: "Term 2", year: 2026, amountZMW: 1250, paidAmountZMW: 0, dueDate: "2026-05-30", status: "Unpaid" },
  { id: 6, studentId: 104, description: "Primary Tuition & Development Fee - Term 2", term: "Term 2", year: 2026, amountZMW: 1100, paidAmountZMW: 1100, dueDate: "2026-05-30", status: "Paid" },
  { id: 7, studentId: 105, description: "Primary Tuition & Development Fee - Term 2", term: "Term 2", year: 2026, amountZMW: 950, paidAmountZMW: 950, dueDate: "2026-05-30", status: "Paid" },

  // Secondary Fees & Pathway Levies
  { id: 8, studentId: 201, description: "Junior Secondary Tuition & ICT Fee - Term 2", term: "Term 2", year: 2026, amountZMW: 1650, paidAmountZMW: 1650, dueDate: "2026-05-30", status: "Paid" },
  { id: 9, studentId: 202, description: "Junior Secondary (Grade 9) Exam & Mock Fee", term: "Term 2", year: 2026, amountZMW: 1850, paidAmountZMW: 1850, dueDate: "2026-05-30", status: "Paid" },
  { id: 10, studentId: 203, description: "Senior Secondary Tuition (Natural Sciences) - Term 2", term: "Term 2", year: 2026, amountZMW: 2100, paidAmountZMW: 2100, dueDate: "2026-05-30", status: "Paid" },
  { id: 11, studentId: 204, description: "Senior Secondary Tuition (Business & Commercial) - Term 2", term: "Term 2", year: 2026, amountZMW: 1950, paidAmountZMW: 1950, dueDate: "2026-05-30", status: "Paid" },
  { id: 12, studentId: 206, description: "Senior Secondary Tuition & TEVET Workshop Fee - Term 2", term: "Term 2", year: 2026, amountZMW: 2200, paidAmountZMW: 1500, dueDate: "2026-05-30", status: "Partially Paid" },
  { id: 13, studentId: 207, description: "Senior Secondary (Grade 12 STEM) Exam & Science Lab Fee", term: "Term 2", year: 2026, amountZMW: 2350, paidAmountZMW: 2350, dueDate: "2026-05-30", status: "Paid" }
];

export const initialHomework: HomeworkTask[] = [
  { id: 1, classId: 4, subject: "Mathematics", title: "Past Paper 2023 - Decimals & Ratios", description: "Solve Questions 1 to 15 in your revision notebook. Bring working out tomorrow.", dueDate: "2026-05-28", assignedBy: "Mr. Davison Banda" },
  { id: 2, classId: 4, subject: "Integrated Science", title: "Human Respiratory System Diagram", description: "Draw and label lungs, trachea, and diaphragm. List 3 respiratory diseases.", dueDate: "2026-05-29", assignedBy: "Mr. Davison Banda" },
  { id: 3, classId: 3, subject: "Social Studies", title: "Traditional Ceremonies of Zambia", description: "Write 1 page on Kuomboka or Nc'wala ceremony (location, tribe, significance).", dueDate: "2026-05-30", assignedBy: "Ms. Chileshe Phiri" },
  { id: 4, classId: 2, subject: "Literacy & English", title: "Reading Comprehension Unit 4", description: "Read passage on 'The Wise Hare' and answer questions 1-5 on page 42.", dueDate: "2026-05-28", assignedBy: "Mr. Mulenga Musonda" },
  { id: 5, classId: 11, subject: "Pure Physics", title: "Electromagnetic Induction & Faraday's Law", description: "Complete lab calculations on transformer efficiency and magnetic flux linkage (Questions 4-12).", dueDate: "2026-05-29", assignedBy: "Dr. Emmanuel Zulu" },
  { id: 6, classId: 8, subject: "Principles of Accounts", title: "Preparation of Three-Column Cash Book", description: "Balance the monthly cash transactions for Mwila General Dealers and extract trial balance.", dueDate: "2026-05-30", assignedBy: "Mr. Patrick Mulenga" },
  { id: 7, classId: 10, subject: "Technical Drawing", title: "Isometric Projection & Orthographic Views", description: "Draft the front, plan, and side elevations for the machine bracket on A3 drafting paper.", dueDate: "2026-05-31", assignedBy: "Eng. Bwalya Kaunda" }
];

export const initialExams: ExamSchedule[] = [
  { id: 1, classId: 4, subject: "English Language", date: "2026-06-08", time: "08:30 AM", room: "Hall A", paperType: "Mock Examination" },
  { id: 2, classId: 4, subject: "Mathematics", date: "2026-06-09", time: "08:30 AM", room: "Hall A", paperType: "Mock Examination" },
  { id: 3, classId: 4, subject: "Integrated Science", date: "2026-06-10", time: "08:30 AM", room: "Hall A", paperType: "Mock Examination" },
  { id: 4, classId: 4, subject: "Social Studies", date: "2026-06-11", time: "08:30 AM", room: "Hall A", paperType: "Mock Examination" },
  { id: 5, classId: 6, subject: "Junior Secondary Science Paper 1", date: "2026-06-10", time: "08:30 AM", room: "Secondary Hall B", paperType: "Mock Examination" },
  { id: 6, classId: 11, subject: "Pure Physics Paper 1 & Practical", date: "2026-06-12", time: "08:00 AM", room: "Advanced Physics Lab", paperType: "Mock Examination" },
  { id: 7, classId: 8, subject: "Principles of Accounts Paper 2", date: "2026-06-15", time: "09:00 AM", room: "Business Suite B1", paperType: "Mock Examination" },
  { id: 8, classId: 10, subject: "Design & Technology Practical Paper", date: "2026-06-16", time: "08:30 AM", room: "TEVET Workshop W1", paperType: "Mock Examination" }
];

export const initialBooks: LibraryBook[] = [
  { id: 1, title: "Zambian Primary Mathematics Grade 7", author: "CDC / Ministry of Education", category: "Mathematics", totalCopies: 25, availableCopies: 18 },
  { id: 2, title: "Zambian Primary Science & Environment", author: "Longman Zambia", category: "Science & Nature", totalCopies: 20, availableCopies: 12 },
  { id: 3, title: "Social Studies Pupil's Book Grade 5", author: "Macmillan Zambia", category: "Zambian History & Social", totalCopies: 15, availableCopies: 9 },
  { id: 4, title: "Senior Secondary Physics for Zambia", author: "Longman / CDC", category: "Science & Nature", totalCopies: 30, availableCopies: 24 },
  { id: 5, title: "Principles of Accounts for Senior Secondary", author: "Frank Wood & O. Sangster", category: "Reference & Dictionary", totalCopies: 25, availableCopies: 19 },
  { id: 6, title: "Stories from Zambia: Kalulu the Hare", author: "Stephen A. Mpashi", category: "Story Books", totalCopies: 10, availableCopies: 4 },
  { id: 7, title: "Secondary School English Dictionary & Grammar", author: "Oxford University Press", category: "Reference & Dictionary", totalCopies: 20, availableCopies: 15 },
];

export const initialRoutes: TransportRoute[] = [
  { id: 1, routeName: "Route 1 - Chelstone / Avondale / Great East", driverName: "Mr. Peter Chitembo", driverPhone: "+260 977 881122", busRegNo: "ALB 4022 ZM", stops: [{ name: "Chelstone Market", time: "06:45 AM" }, { name: "Avondale Roundabout", time: "07:00 AM" }, { name: "Munali Flyover", time: "07:15 AM" }, { name: "School Main Gate", time: "07:30 AM" }] },
  { id: 2, routeName: "Route 2 - Woodlands / Kabulonga / Ibex", driverName: "Mr. Francis Maboshe", driverPhone: "+260 966 332211", busRegNo: "BAC 1109 ZM", stops: [{ name: "Woodlands Shopping Mall", time: "06:40 AM" }, { name: "Kabulonga Boys Stop", time: "06:55 AM" }, { name: "Ibex Hill Twin Palm", time: "07:10 AM" }, { name: "School Main Gate", time: "07:30 AM" }] }
];

export const ACADEMIC_TERMS_2026: AcademicTerm[] = [
  {
    id: "Term 1",
    name: "Term 1 (First Term)",
    year: 2026,
    startDate: "2026-01-12",
    endDate: "2026-04-17",
    weeks: 14,
    totalInstructionDays: 68,
    midTermBreak: {
      startDate: "2026-02-20",
      endDate: "2026-02-23",
      description: "Term 1 Mid-Term Long Weekend Break"
    },
    holidayBreak: {
      startDate: "2026-04-18",
      endDate: "2026-05-10",
      description: "First Term School Holiday & Teacher Planning Break (3 Weeks)"
    },
    keyFocus: "Foundational syllabus coverage, baseline diagnostic tests, secondary pathway orientation, and inter-house athletic trials.",
    theme: "Laying Firm Academic & Moral Foundations",
    status: "Completed"
  },
  {
    id: "Term 2",
    name: "Term 2 (Second Term)",
    year: 2026,
    startDate: "2026-05-11",
    endDate: "2026-08-07",
    weeks: 13,
    totalInstructionDays: 64,
    midTermBreak: {
      startDate: "2026-06-19",
      endDate: "2026-06-26",
      description: "Term 2 Mid-Term Holiday Break (1 Week)"
    },
    holidayBreak: {
      startDate: "2026-08-08",
      endDate: "2026-08-30",
      description: "Second Term School Holiday & National Exam Revision Clinics (3 Weeks)"
    },
    keyFocus: "Grade 7, Grade 9 & Grade 12 National Mock Exams, STEM Fair, Career Pathway Guidance, and Inter-House Sports Day.",
    theme: "Excellence Through Dedicated Discipline",
    status: "Active"
  },
  {
    id: "Term 3",
    name: "Term 3 (Third Term)",
    year: 2026,
    startDate: "2026-08-31",
    endDate: "2026-12-04",
    weeks: 14,
    totalInstructionDays: 67,
    midTermBreak: {
      startDate: "2026-10-09",
      endDate: "2026-10-12",
      description: "Term 3 Mid-Term Break & Independence Preparations"
    },
    holidayBreak: {
      startDate: "2026-12-05",
      endDate: "2027-01-10",
      description: "Long End-of-Year Holiday & Festive Recess (5 Weeks)"
    },
    keyFocus: "Examinations Council of Zambia (ECZ) National Final Examinations (Grades 7, 9 & 12), Graduation & Valedictory Ceremony, Annual Prize Giving Day.",
    theme: "Victory, Harvest & Transition to Greater Heights",
    status: "Upcoming"
  }
];

export const ZAMBIAN_HOLIDAYS_2026: ZambianHoliday[] = [
  {
    id: 1,
    name: "New Year's Day",
    date: "2026-01-01",
    dayOfWeek: "Thursday",
    type: "National Public Holiday",
    description: "First day of the new Gregorian calendar year, celebrated nationwide."
  },
  {
    id: 2,
    name: "International Women's Day",
    date: "2026-03-08",
    dayOfWeek: "Sunday",
    type: "Commemoration",
    description: "Celebration of women's social, economic, cultural, and political achievements."
  },
  {
    id: 3,
    name: "Youth Day",
    date: "2026-03-12",
    dayOfWeek: "Thursday",
    type: "National Public Holiday",
    description: "Commemoration of the youth contribution to Zambia's liberation struggle and national development."
  },
  {
    id: 4,
    name: "Good Friday",
    date: "2026-04-03",
    dayOfWeek: "Friday",
    type: "Christian Holiday",
    description: "Solemn Christian commemoration of the crucifixion of Jesus Christ."
  },
  {
    id: 5,
    name: "Holy Saturday",
    date: "2026-04-04",
    dayOfWeek: "Saturday",
    type: "Christian Holiday",
    description: "Easter Eve in the Christian calendar."
  },
  {
    id: 6,
    name: "Easter Monday",
    date: "2026-04-06",
    dayOfWeek: "Monday",
    type: "Christian Holiday",
    description: "Public holiday following Easter Sunday celebrating the resurrection of Christ."
  },
  {
    id: 7,
    name: "Labour Day",
    date: "2026-05-01",
    dayOfWeek: "Friday",
    type: "National Public Holiday",
    description: "Honouring workers' and teachers' contributions across Zambia with marches and awards."
  },
  {
    id: 8,
    name: "Africa Freedom Day",
    date: "2026-05-25",
    dayOfWeek: "Monday",
    type: "National Public Holiday",
    description: "Commemorating the founding of the Organization of African Unity (now African Union) and liberation."
  },
  {
    id: 9,
    name: "Heroes' Day",
    date: "2026-07-06",
    dayOfWeek: "Monday",
    type: "National Public Holiday",
    description: "Honouring the gallant sons and daughters who died fighting for Zambia's freedom."
  },
  {
    id: 10,
    name: "Unity Day",
    date: "2026-07-07",
    dayOfWeek: "Tuesday",
    type: "National Public Holiday",
    description: "Promoting national unity and solidarity under the motto 'One Zambia, One Nation'."
  },
  {
    id: 11,
    name: "Farmers' Day",
    date: "2026-08-03",
    dayOfWeek: "Monday",
    type: "National Public Holiday",
    description: "Recognizing agricultural producers and food security champions across the nation."
  },
  {
    id: 12,
    name: "National Day of Prayer, Fasting, Repentance & Reconciliation",
    date: "2026-10-18",
    dayOfWeek: "Sunday",
    type: "National Public Holiday",
    description: "National day of solemn prayer, thanksgiving, and reconciliation in Christian fellowship."
  },
  {
    id: 13,
    name: "Independence Day",
    date: "2026-10-24",
    dayOfWeek: "Saturday",
    type: "National Public Holiday",
    description: "Zambia's 62nd Independence Anniversary commemorating sovereignty from colonial rule."
  },
  {
    id: 14,
    name: "Christmas Day",
    date: "2026-12-25",
    dayOfWeek: "Friday",
    type: "Christian Holiday",
    description: "Celebrating the birth of Jesus Christ, Saviour and Lord."
  }
];

export const initialEvents: SchoolEvent[] = [
  // Term 1 Events (Jan - Apr 2026)
  {
    id: 101,
    title: "Term 1 School Opening & Dedication Chapel",
    date: "2026-01-12",
    time: "07:30 AM - 10:00 AM",
    category: "Term Dates",
    term: "Term 1",
    targetAudience: "All School",
    location: "Main Assembly Pavilion",
    description: "Official re-opening for Term 1, welcoming new Grade 1 pupils and Grade 8 secondary entrants with a dedicatory chapel service.",
    isImportant: true
  },
  {
    id: 102,
    title: "Secondary Pathway Orientation & Subject Briefing",
    date: "2026-01-23",
    time: "09:00 AM - 13:00 PM",
    category: "Academic",
    term: "Term 1",
    targetAudience: "Secondary Section",
    location: "Secondary Science Complex",
    description: "Guidance on Senior Secondary career pathways (Natural Sciences, Business, Social Sciences, TEVET) for Grade 10 and Grade 8 pupils."
  },
  {
    id: 103,
    title: "Term 1 Mid-Term Long Weekend Break",
    date: "2026-02-20",
    endDate: "2026-02-23",
    category: "Holiday",
    term: "Term 1",
    targetAudience: "All School",
    description: "School closes on Friday afternoon and resumes on Tuesday morning for mid-term rest."
  },
  {
    id: 104,
    title: "Youth Day Parade & National Celebrations",
    date: "2026-03-12",
    time: "08:00 AM - 14:00 PM",
    category: "National Holiday",
    term: "Term 1",
    targetAudience: "All School",
    location: "Freedom Statue & School Campus",
    description: "Bread of Life Scouts and Girl Guides lead the Youth Day contingent parade.",
    isImportant: true
  },
  {
    id: 105,
    title: "PTA Annual General Meeting (AGM)",
    date: "2026-03-27",
    time: "14:00 PM - 17:00 PM",
    category: "PTA Meeting",
    term: "Term 1",
    targetAudience: "Parents & PTA",
    location: "Bread of Life Main Hall",
    description: "Annual meeting of parents, guardians, and teaching management to review school developments and approve the budget.",
    isImportant: true
  },
  {
    id: 106,
    title: "Term 1 End-of-Term Assessment Week",
    date: "2026-04-06",
    endDate: "2026-04-10",
    time: "08:00 AM - 15:30 PM",
    category: "Examinations",
    term: "Term 1",
    targetAudience: "All School",
    location: "Examination Halls",
    description: "Term 1 formal assessments across all primary and secondary subject divisions."
  },
  {
    id: 107,
    title: "Term 1 Closing & Report Card Issuance",
    date: "2026-04-17",
    time: "08:00 AM - 12:00 PM",
    category: "Term Dates",
    term: "Term 1",
    targetAudience: "All School",
    location: "Respective Classrooms",
    description: "Official conclusion of Term 1. Termly report cards distributed to parents and guardians."
  },

  // Term 2 Events (May - Aug 2026)
  {
    id: 201,
    title: "Term 2 School Re-Opening & Assembly",
    date: "2026-05-11",
    time: "07:30 AM - 09:30 AM",
    category: "Term Dates",
    term: "Term 2",
    targetAudience: "All School",
    location: "School Grounds",
    description: "Term 2 begins with full academic schedule and continuous assessment rollout.",
    isImportant: true
  },
  {
    id: 202,
    title: "Africa Freedom Day Commemoration",
    date: "2026-05-25",
    category: "National Holiday",
    term: "Term 2",
    targetAudience: "All School",
    description: "National public holiday. School closed in honour of African unity and liberation."
  },
  {
    id: 203,
    title: "National Mock Examinations (Grades 7, 9 & 12)",
    date: "2026-06-08",
    endDate: "2026-06-16",
    time: "08:00 AM - 16:00 PM",
    category: "Examinations",
    term: "Term 2",
    targetAudience: "Exam Candidates (Grades 7, 9, 12)",
    location: "Secondary Hall B & Exam Suites",
    description: "Full simulation of ECZ examination conditions for primary and secondary candidate classes.",
    isImportant: true
  },
  {
    id: 204,
    title: "Term 2 Mid-Term Holiday Break",
    date: "2026-06-19",
    endDate: "2026-06-26",
    category: "Holiday",
    term: "Term 2",
    targetAudience: "All School",
    description: "Mid-term recess for pupils. School offices remain open for administrative consultations."
  },
  {
    id: 205,
    title: "Inter-House Sports Day & Cultural Gala",
    date: "2026-07-03",
    time: "08:00 AM - 16:30 PM",
    category: "Sports & Culture",
    term: "Term 2",
    targetAudience: "All School",
    location: "Heroes National Stadium Grounds",
    description: "Track and field events, relay races, traditional Zambian dance showcases, and house trophy awarding.",
    isImportant: true
  },
  {
    id: 206,
    title: "Heroes & Unity Days Long Weekend",
    date: "2026-07-06",
    endDate: "2026-07-07",
    category: "National Holiday",
    term: "Term 2",
    targetAudience: "All School",
    description: "Consecutive national public holidays honouring Zambian national heroes and national solidarity."
  },
  {
    id: 207,
    title: "Parent-Teacher Consultation & Academic Review Day",
    date: "2026-07-17",
    time: "13:30 PM - 17:30 PM",
    category: "PTA Meeting",
    term: "Term 2",
    targetAudience: "Parents & PTA",
    location: "School Main Hall & Classrooms",
    description: "One-on-one academic consultations between guardians and subject teachers ahead of Term 3 exams."
  },
  {
    id: 208,
    title: "Science Fair, Robotics & STEM Innovation Expo",
    date: "2026-07-24",
    time: "09:00 AM - 15:00 PM",
    category: "Academic",
    term: "Term 2",
    targetAudience: "All School",
    location: "Secondary Science Complex",
    description: "Pupil-led science experiments, solar energy models, mobile app prototypes, and agricultural demonstrations."
  },
  {
    id: 209,
    title: "Term 2 Official Closing & Report Card Collection",
    date: "2026-08-07",
    time: "08:00 AM - 12:00 PM",
    category: "Term Dates",
    term: "Term 2",
    targetAudience: "All School",
    location: "Respective Classrooms",
    description: "End of Term 2. Distribution of continuous assessment score summaries and report cards."
  },

  // Term 3 Events (Aug - Dec 2026)
  {
    id: 301,
    title: "Term 3 School Re-Opening & Final Term Dedication",
    date: "2026-08-31",
    time: "07:30 AM - 09:30 AM",
    category: "Term Dates",
    term: "Term 3",
    targetAudience: "All School",
    location: "Main Assembly Pavilion",
    description: "Term 3 commences with intense focus on final ECZ national examinations and end-of-year assessments.",
    isImportant: true
  },
  {
    id: 302,
    title: "Grade 7 Composite Examination (ECZ Final)",
    date: "2026-09-21",
    endDate: "2026-09-25",
    time: "08:30 AM - 13:00 PM",
    category: "Examinations",
    term: "Term 3",
    targetAudience: "Exam Candidates (Grades 7, 9, 12)",
    location: "National Examination Centre A",
    description: "Official Examinations Council of Zambia primary school leaving certificate examinations.",
    isImportant: true
  },
  {
    id: 303,
    title: "Term 3 Mid-Term Break",
    date: "2026-10-09",
    endDate: "2026-10-12",
    category: "Holiday",
    term: "Term 3",
    targetAudience: "All School",
    description: "Mid-term long weekend break."
  },
  {
    id: 304,
    title: "National Day of Prayer & Repentance",
    date: "2026-10-18",
    category: "National Holiday",
    term: "Term 3",
    targetAudience: "All School",
    location: "Bread of Life Worship Sanctuary",
    description: "Special inter-denominational school prayer service for examination candidates and peace in Zambia."
  },
  {
    id: 305,
    title: "Zambia Independence Day Jubilee Celebrations",
    date: "2026-10-24",
    time: "08:30 AM - 14:00 PM",
    category: "National Holiday",
    term: "Term 3",
    targetAudience: "All School",
    location: "Main Campus Grounds",
    description: "Parades, poetry, traditional food exhibitions, and historical plays honoring Zambia's independence.",
    isImportant: true
  },
  {
    id: 306,
    title: "Grade 9 (JSSLE) & Grade 12 (ECZ) National Final Examinations",
    date: "2026-10-26",
    endDate: "2026-11-20",
    time: "08:00 AM - 16:30 PM",
    category: "Examinations",
    term: "Term 3",
    targetAudience: "Exam Candidates (Grades 7, 9, 12)",
    location: "Secondary Examination Halls",
    description: "National secondary school leaving certification examinations written under invigilation.",
    isImportant: true
  },
  {
    id: 307,
    title: "Annual Speech, Prize Giving Day & Cultural Festival",
    date: "2026-11-27",
    time: "09:00 AM - 15:30 PM",
    category: "Religious & School Ceremony",
    term: "Term 3",
    targetAudience: "All School",
    location: "Bread of Life Cathedral Hall",
    description: "Rewarding academic distinction, leadership excellence, best sporting achievements, and pathway medals.",
    isImportant: true
  },
  {
    id: 308,
    title: "Graduation & Valedictory Ceremony (Grades 7 & 12)",
    date: "2026-12-03",
    time: "09:30 AM - 14:00 PM",
    category: "Religious & School Ceremony",
    term: "Term 3",
    targetAudience: "All School",
    location: "Main Auditorium",
    description: "Graduation service and valedictory speeches for graduating primary pupils and secondary school leavers.",
    isImportant: true
  },
  {
    id: 309,
    title: "Term 3 School Closing & Long Holiday Recess",
    date: "2026-12-04",
    time: "08:00 AM - 12:00 PM",
    category: "Term Dates",
    term: "Term 3",
    targetAudience: "All School",
    location: "Respective Classrooms",
    description: "Official end of 2026 academic year. Collection of annual report cards and promotion certificates.",
    isImportant: true
  }
];

export const initialMessages: UserMessage[] = [
  { id: 1, fromName: "Mr. Davison Banda (Head Teacher)", fromRole: "Head Teacher", toName: "Bwalya Joseph", toRole: "Parent", subject: "Grade 7 Mock Exam Preparation", body: "Dear Parent, please ensure Chanda spends time revising his Mathematics & Science past papers daily in preparation for the upcoming mock exams.", date: "2026-05-20", read: true, channel: "Internal Message" },
  { id: 2, fromName: "Mrs. Beauty Tembo", fromRole: "Teacher", toName: "Zimba George", toRole: "Parent", subject: "Welcome to Grade 1 Blue", body: "Tiseke is settling in well with his literacy lessons. Please check his homework book daily.", date: "2026-05-22", read: false, channel: "SMS Alert" },
  { id: 3, fromName: "Mr. Chileshe Mumba (Bursar)", fromRole: "Accountant", toName: "All Parents", toRole: "Parent", subject: "Term 2 Fee Clearance Notice", body: "Gentle reminder: All term 2 tuition and examination fees must be settled prior to the commencement of mid-term examinations.", date: "2026-05-25", read: false, channel: "WhatsApp Notice" }
];

export const initialStaffData: StaffMember[] = [
  {
    id: 1,
    name: "Eng. Kelvin Chileshe",
    nrc: "294812/11/1",
    phone: "+260 977 100200",
    email: "superadmin@ryntech.edu.zm",
    role: "super_admin",
    roleTitle: "Super Administrator / IT Director",
    department: "Executive Management & ICT",
    employmentDate: "2020-01-15",
    status: "Active",
    qualifications: "M.Sc. Information Systems, B.Eng. Computer Engineering (UNZA)",
    leaveDaysRemaining: 24,
    salaryZMW: 32000,
    username: "superadmin"
  },
  {
    id: 2,
    name: "Mrs. Grace Mwape",
    nrc: "184920/67/1",
    phone: "+260 978 223344",
    email: "admin@ryntech.edu.zm",
    role: "school_admin",
    roleTitle: "School Administrator & Registrar",
    department: "School Administration",
    employmentDate: "2021-03-01",
    status: "Active",
    qualifications: "B.A. Educational Administration & Management (CBU)",
    leaveDaysRemaining: 18,
    salaryZMW: 24000,
    username: "admin"
  },
  {
    id: 3,
    name: "Mr. Davison Banda",
    nrc: "142981/10/1",
    phone: "+260 977 421180",
    email: "headteacher@ryntech.edu.zm",
    role: "head_teacher",
    roleTitle: "Head Teacher / Headmaster",
    department: "Executive Academic Leadership",
    employmentDate: "2018-01-10",
    status: "Active",
    qualifications: "M.Ed. Educational Leadership (UNZA), B.Ed. Mathematics",
    leaveDaysRemaining: 15,
    salaryZMW: 28000,
    username: "headteacher"
  },
  {
    id: 4,
    name: "Mrs. Mutale Musonda",
    nrc: "302914/11/1",
    phone: "+260 977 451325",
    email: "deputyhead@ryntech.edu.zm",
    role: "deputy_head",
    roleTitle: "Deputy Head Teacher (Academics)",
    department: "Curriculum & Academic Standards",
    employmentDate: "2019-05-15",
    status: "Active",
    qualifications: "B.Ed. English Literature & Linguistics (UNZA)",
    leaveDaysRemaining: 20,
    salaryZMW: 22000,
    username: "deputyhead"
  },
  {
    id: 5,
    name: "Mr. Chileshe Mumba",
    nrc: "119832/52/1",
    phone: "+260 979 556677",
    email: "bursar@ryntech.edu.zm",
    role: "accountant",
    roleTitle: "Senior Accountant / Bursar",
    department: "Finance & Accounts",
    employmentDate: "2020-08-01",
    status: "Active",
    qualifications: "ZICA Professional, B.Acc. Accounting & Finance (CBU)",
    leaveDaysRemaining: 21,
    salaryZMW: 19500,
    username: "bursar"
  },
  {
    id: 6,
    name: "Ms. Rabecca Lungu",
    nrc: "420193/11/1",
    phone: "+260 976 778899",
    email: "secretary@ryntech.edu.zm",
    role: "secretary",
    roleTitle: "Executive School Secretary",
    department: "Front Office & Secretarial",
    employmentDate: "2022-02-14",
    status: "Active",
    qualifications: "Diploma in Secretarial & Office Management (Evelyn Hone)",
    leaveDaysRemaining: 16,
    salaryZMW: 12500,
    username: "secretary"
  },
  {
    id: 7,
    name: "Mrs. Beatrice Phiri",
    nrc: "254910/11/1",
    phone: "+260 975 334455",
    email: "librarian@ryntech.edu.zm",
    role: "librarian",
    roleTitle: "Chief Librarian & Information Specialist",
    department: "Library & Learning Resource Centre",
    employmentDate: "2021-06-01",
    status: "Active",
    qualifications: "B.A. Library & Information Science (UNZA)",
    leaveDaysRemaining: 22,
    salaryZMW: 14000,
    username: "librarian"
  },
  {
    id: 8,
    name: "Mr. Kelvin Phiri",
    nrc: "198421/11/1",
    phone: "+260 977 889900",
    email: "kphiri@ryntech.edu.zm",
    role: "teacher",
    roleTitle: "Senior Science & Physics Teacher",
    department: "Natural Sciences",
    employmentDate: "2019-01-08",
    status: "Active",
    qualifications: "B.Sc. with Education - Physics & Chemistry (UNZA)",
    leaveDaysRemaining: 19,
    salaryZMW: 16000,
    username: "kphiri"
  }
];

export const initialDisciplineData: DisciplineRecord[] = [
  {
    id: 1,
    studentId: 101,
    studentName: "Chanda Bwalya",
    grade: "Grade 7",
    stream: "Eagle",
    incidentDate: "2026-05-18",
    category: "Lateness / Truancy",
    description: "Arrived 35 minutes late for morning Mathematics period without written parent note.",
    actionTaken: "Verbal Warning",
    recordedBy: "Mr. Davison Banda",
    recordedByRole: "Class Teacher",
    parentNotified: true,
    resolutionStatus: "Resolved",
    resolutionNotes: "Pupil explained delayed transport due to heavy rains on Lumumba road. Guardian phoned and confirmed."
  },
  {
    id: 2,
    studentId: 104,
    studentName: "Chileshe Mwila",
    grade: "Grade 7",
    stream: "Rhino",
    incidentDate: "2026-05-22",
    category: "Fighting / Bullying",
    description: "Involved in verbal altercation and pushing during lunch break near football pitch.",
    actionTaken: "Detention",
    recordedBy: "Mr. Kelvin Phiri",
    recordedByRole: "Senior Teacher",
    parentNotified: true,
    followUpDate: "2026-05-29",
    resolutionStatus: "In Progress" as any,
    resolutionNotes: "Served 1-hour supervised library study detention and offered sincere apology to classmate."
  },
  {
    id: 3,
    studentId: 106,
    studentName: "Zimba George",
    grade: "Grade 10",
    stream: "Commerce",
    incidentDate: "2026-05-14",
    category: "Uniform / Grooming Violation",
    description: "Wore non-regulation trainers and omitted official school necktie on assembly morning.",
    actionTaken: "Written Warning",
    recordedBy: "Mrs. Mutale Musonda",
    recordedByRole: "Deputy Head",
    parentNotified: true,
    resolutionStatus: "Resolved",
    resolutionNotes: "Guardian brought official school uniform footwear before 10:00 AM break."
  }
];

export const initialInventoryData: InventoryItem[] = [
  {
    id: 1,
    code: "ICT-PC-001",
    name: "HP ProDesk Desktop Computers (Core i5, 16GB)",
    category: "Computers & ICT",
    quantity: 35,
    condition: "Excellent",
    location: "Main Computer Laboratory (Room 12)",
    purchaseDate: "2024-02-15",
    purchasePriceZMW: 285000,
    supplier: "Bytes & Chips Technologies Zambia Ltd",
    assignedDepartment: "Mathematics & Computing",
    serialNumber: "HP-LAB-01 TO HP-LAB-35",
    maintenanceNotes: "Quarterly antivirus updates and OS maintenance scheduled for July 2026."
  },
  {
    id: 2,
    code: "FUR-DSK-001",
    name: "Standard Dual Pupil Hardwood Desks & Metal Frames",
    category: "Desks & Tables",
    quantity: 180,
    condition: "Good",
    location: "Primary & Secondary Classrooms",
    purchaseDate: "2023-08-20",
    purchasePriceZMW: 162000,
    supplier: "Lusaka Timber & Furniture Craftsmen",
    assignedDepartment: "General School Property",
    maintenanceNotes: "Inspected annually before commencement of Term 1."
  },
  {
    id: 3,
    code: "SCI-MIC-001",
    name: "Olympus Binocular Compound Microscopes (1000x)",
    category: "Laboratory Equipment",
    quantity: 16,
    condition: "Excellent",
    location: "Senior Biology Laboratory",
    purchaseDate: "2025-01-10",
    purchasePriceZMW: 84000,
    supplier: "Scientific & Educational Supplies Zambia",
    assignedDepartment: "Natural Sciences",
    serialNumber: "OLY-MIC-101 TO OLY-MIC-116",
    maintenanceNotes: "Lenses cleaned and optical alignment calibrated."
  },
  {
    id: 4,
    code: "VEH-BUS-001",
    name: "Toyota Coaster 30-Seater School Bus (Reg: BAF 4219 ZM)",
    category: "Vehicles",
    quantity: 1,
    condition: "Good",
    location: "Campus Transport Depot",
    purchaseDate: "2022-05-18",
    purchasePriceZMW: 650000,
    supplier: "Toyota Zambia Ltd",
    assignedDepartment: "School Transport Operations",
    serialNumber: "JT751928401",
    maintenanceNotes: "RTSA Road Fitness renewed May 2026. Servicing done every 5,000 km."
  },
  {
    id: 5,
    code: "SPT-KIT-001",
    name: "Football & Netball Tournament Match Kits & Goal Posts",
    category: "Sports & Physical Ed",
    quantity: 24,
    condition: "Good",
    location: "Sports Pavilion Equipment Store",
    purchaseDate: "2025-03-01",
    purchasePriceZMW: 26000,
    supplier: "Decathlon Sports Africa",
    assignedDepartment: "Expressive & Performing Arts"
  }
];

export const initialHostelData: HostelDormitory[] = [
  {
    id: 1,
    name: "Dag Hammarskjöld Hall (Senior Boys)",
    gender: "Boys",
    houseName: "Eagle House",
    houseMasterName: "Mr. Kelvin Phiri",
    houseMasterPhone: "+260 977 889900",
    capacity: 48,
    occupiedBeds: 36,
    roomCount: 12,
    termFeeZMW: 4500,
    status: "Available"
  },
  {
    id: 2,
    name: "Mama Julia Chikamoneka Hall (Senior Girls)",
    gender: "Girls",
    houseName: "Victoria House",
    houseMasterName: "Mrs. Gertrude Tembo",
    houseMasterPhone: "+260 977 451325",
    capacity: 48,
    occupiedBeds: 42,
    roomCount: 12,
    termFeeZMW: 4500,
    status: "Available"
  }
];

export const initialHostelAllocations: HostelAllocation[] = [
  {
    id: 1,
    studentId: 101,
    studentName: "Chanda Bwalya",
    grade: "Grade 7",
    gender: "Male",
    dormitoryId: 1,
    dormitoryName: "Dag Hammarskjöld Hall (Senior Boys)",
    roomNumber: "Room 102",
    bedNumber: "Bed B-04",
    checkInDate: "2026-05-11",
    status: "Boarding Active",
    emergencyContact: "Mr. Bwalya Joseph (+260 977 123456)"
  },
  {
    id: 2,
    studentId: 105,
    studentName: "Mwila Mulenga",
    grade: "Grade 10",
    gender: "Male",
    dormitoryId: 1,
    dormitoryName: "Dag Hammarskjöld Hall (Senior Boys)",
    roomNumber: "Room 105",
    bedNumber: "Bed B-12",
    checkInDate: "2026-05-11",
    status: "Boarding Active",
    emergencyContact: "Mr. Mulenga David (+260 978 765432)"
  }
];

export const initialLibraryCheckouts: BookCheckout[] = [
  {
    id: 1,
    bookId: 1,
    bookTitle: "Progress in Mathematics Grade 7 Learner's Book",
    borrowerType: "Student",
    borrowerId: 101,
    borrowerName: "Chanda Bwalya",
    borrowerRef: "ECZ-2026-0412-101",
    checkoutDate: "2026-05-15",
    dueDate: "2026-05-29",
    status: "Active"
  },
  {
    id: 2,
    bookId: 3,
    bookTitle: "A Junior Secondary Physics Handbook",
    borrowerType: "Teacher",
    borrowerId: 3,
    borrowerName: "Mr. Kelvin Phiri",
    borrowerRef: "TSC/2019/9481",
    checkoutDate: "2026-05-10",
    dueDate: "2026-06-10",
    status: "Active"
  },
  {
    id: 3,
    bookId: 2,
    bookTitle: "Junior Secondary English for Zambia",
    borrowerType: "Student",
    borrowerId: 103,
    borrowerName: "Lombe Mwila",
    borrowerRef: "ECZ-2026-0412-103",
    checkoutDate: "2026-05-02",
    dueDate: "2026-05-16",
    returnDate: "2026-05-16",
    status: "Returned"
  }
];

export const initialReceiptsData: PaymentReceipt[] = [
  {
    id: 1,
    receiptNumber: "RCT-2026-00891",
    feeItemId: 1,
    studentId: 101,
    studentName: "Chanda Bwalya",
    studentEczNo: "ECZ-2026-0412-101",
    grade: "Grade 7 Eagle",
    amountPaidZMW: 3200,
    paymentMethod: "Airtel Money",
    referenceNumber: "TXN-AIRTEL-982140",
    paymentDate: "2026-05-12",
    description: "Term 2 Tuition & General School Fees 2026",
    previousBalanceZMW: 3200,
    remainingBalanceZMW: 0,
    collectedBy: "Mr. Chileshe Mumba (Bursar)",
    verified: true,
    notes: "Instant mobile money verification confirmed via Airtel Pay gateway."
  },
  {
    id: 2,
    receiptNumber: "RCT-2026-00892",
    feeItemId: 2,
    studentId: 102,
    studentName: "Mutale Musonda",
    studentEczNo: "ECZ-2026-0412-102",
    grade: "Grade 7 Eagle",
    amountPaidZMW: 1500,
    paymentMethod: "MTN MoMo",
    referenceNumber: "MOMO-88392019",
    paymentDate: "2026-05-14",
    description: "Term 2 Tuition Fees (Part-Payment 1/2)",
    previousBalanceZMW: 3200,
    remainingBalanceZMW: 1700,
    collectedBy: "Mr. Chileshe Mumba (Bursar)",
    verified: true,
    notes: "Balance K1,700 committed before mid-term exams."
  },
  {
    id: 3,
    receiptNumber: "RCT-2026-00893",
    feeItemId: 5,
    studentId: 105,
    studentName: "Mwila Mulenga",
    studentEczNo: "ECZ-2026-0412-105",
    grade: "Grade 10 Science",
    amountPaidZMW: 3800,
    paymentMethod: "Bank Deposit",
    referenceNumber: "ZAN-DEP-048192",
    paymentDate: "2026-05-15",
    description: "Term 2 Senior Secondary Tuition & Science Lab Levy",
    previousBalanceZMW: 3800,
    remainingBalanceZMW: 0,
    collectedBy: "Mr. Chileshe Mumba (Bursar)",
    verified: true,
    notes: "ZANACO deposit slip stamped and cleared."
  }
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: "LOG-1001",
    timestamp: "2026-05-24 09:14:22",
    userName: "Eng. Kelvin Chileshe",
    userRole: "Super Administrator",
    action: "System Initialization & Role Audit",
    module: "Security & Access Control",
    details: "Verified system permissions and active user sessions across 10 institutional roles.",
    ipAddress: "196.14.88.102 (Lusaka, ZM)"
  },
  {
    id: "LOG-1002",
    timestamp: "2026-05-24 10:30:15",
    userName: "Mr. Chileshe Mumba",
    userRole: "Accountant / Bursar",
    action: "Fee Payment Recorded",
    module: "Fees & Kwacha Accounts",
    recordId: "RCT-2026-00891",
    details: "Recorded K3,200 payment for pupil Chanda Bwalya (Grade 7 Eagle) via Airtel Money.",
    previousValue: "Balance: K3,200",
    newValue: "Balance: K0.00 (Fully Cleared)",
    ipAddress: "196.14.88.105 (Lusaka, ZM)"
  },
  {
    id: "LOG-1003",
    timestamp: "2026-05-24 11:45:00",
    userName: "Mr. Davison Banda",
    userRole: "Head Teacher",
    action: "Term 2 Results Batch Approval",
    module: "Examinations & Grading",
    recordId: "CLASS-G7-EAGLE",
    details: "Approved Continuous Assessment (CA) and Mid-Term examination results for publishing.",
    previousValue: "Status: Pending_Approval",
    newValue: "Status: Approved_Published",
    ipAddress: "196.14.88.103 (Lusaka, ZM)"
  }
];

export const initialTransportData: TransportVehicle[] = [
  {
    id: 1,
    registrationNumber: "BAF 4219 ZM",
    model: "Toyota Coaster (30-Seater)",
    capacity: 30,
    driverName: "Mr. Patrick Mwale",
    driverPhone: "+260 977 341829",
    routeZone: "Woodlands - Kabulonga - Ibex Hill",
    status: "Active",
    insuranceExpiry: "2026-11-30",
    fitnessExpiry: "2026-12-15",
    termFeeZMW: 1200
  },
  {
    id: 2,
    registrationNumber: "BCA 8812 ZM",
    model: "Mitsubishi Rosa (26-Seater)",
    capacity: 26,
    driverName: "Mr. Christopher Zulu",
    driverPhone: "+260 976 554433",
    routeZone: "Chelstone - Avondale - Salama Park",
    status: "Active",
    insuranceExpiry: "2026-10-15",
    fitnessExpiry: "2026-10-30",
    termFeeZMW: 1350
  },
  {
    id: 3,
    registrationNumber: "BAG 1104 ZM",
    model: "Toyota HiAce (16-Seater)",
    capacity: 16,
    driverName: "Mr. John Tembo",
    driverPhone: "+260 978 998877",
    routeZone: "Chilenje - Libala - Kamwala South",
    status: "Maintenance",
    insuranceExpiry: "2026-09-20",
    fitnessExpiry: "2026-09-30",
    termFeeZMW: 1100
  }
];

export const initialTransportPupils: TransportPupilAssignment[] = [
  {
    id: 1,
    studentId: 101,
    studentName: "Chanda Bwalya",
    grade: "Grade 7",
    vehicleId: 1,
    vehicleReg: "BAF 4219 ZM",
    pickupPoint: "Kabulonga Roundabout (Near Centro Mall)",
    dropoffPoint: "Campus Bus Bay A",
    guardianPhone: "+260 977 123456",
    status: "Active"
  },
  {
    id: 2,
    studentId: 103,
    studentName: "Lombe Mwila",
    grade: "Grade 7",
    vehicleId: 2,
    vehicleReg: "BCA 8812 ZM",
    pickupPoint: "Chelstone Market Entrance",
    dropoffPoint: "Campus Bus Bay B",
    guardianPhone: "+260 976 234567",
    status: "Active"
  }
];



