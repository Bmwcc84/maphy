export const courses = [
  {
    id: "neet-physics",
    title: "NEET Physics",
    detail: "Complete NEET Physics course with concepts, DPPs, PYQs and revision support.",
    priceInPaise: 199900,
    displayPrice: "Rs 1,999",
    tag: "Medical",
    contentFile: null,
    previewPath: null,
  },
  {
    id: "jee-physics",
    title: "JEE Physics",
    detail: "JEE Main and Advanced preparation with problem-solving sessions and test strategy.",
    priceInPaise: 249900,
    displayPrice: "Rs 2,499",
    tag: "Engineering",
    contentFile: null,
    previewPath: null,
  },
  {
    id: "class-12-board",
    title: "Class 12 Board",
    detail: "CBSE and Bihar Board Physics with exam-focused notes, numericals and revision.",
    priceInPaise: 149900,
    displayPrice: "Rs 1,499",
    tag: "Boards",
    contentFile: null,
    previewPath: null,
  },
  {
    id: "electrostatics-handwritten-notes",
    title: "Electrostatics Handwritten Notes",
    detail: "Class 12 Physics Electrostatics handwritten notes for quick revision and board-level clarity.",
    priceInPaise: 5000,
    displayPrice: "Rs 50",
    tag: "12th Physics Notes",
    contentFile: "electrostatics-handwritten-notes.pdf",
    previewPath: "/preview/electrostatics",
  },
  {
    id: "current-electricity-handwritten-notes",
    title: "Current Electricity Handwritten Notes",
    detail: "Class 12 Physics Current Electricity handwritten notes with concepts, circuits, cells and power revision.",
    priceInPaise: 5000,
    displayPrice: "Rs 50",
    tag: "12th Physics Notes",
    contentFile: "current-electricity-handwritten-notes.pdf",
    previewPath: "/preview/current-electricity",
  },
] as const;

export const bpscPhysicsTest = {
  id: "bpsc-physics-tre-4-test-series",
  title: "BPSC Physics TRE 4.0 Complete Test",
  detail: "One bilingual shuffled Physics test with all questions, instant result, explanations and a downloadable question PDF.",
  priceInPaise: 9900,
  displayPrice: "Rs 99",
  tag: "BPSC TRE 4.0",
  contentFile: null,
  previewPath: null,
  accessDurationDays: 30,
} as const;

export const class12BoardTestSeries = {
  id: "class-12-board-2027-physics-test-series",
  title: "Class 12 Board 2027 Physics Test Series",
    detail: "Complete 30-test bilingual Physics cycle with instant results and explanations.",
  priceInPaise: 3000,
  displayPrice: "Rs 30",
  tag: "Board 2027 Test Series",
  contentFile: null,
  previewPath: null,
  accessDurationDays: 30,
} as const;

export const paymentProducts = [
  ...courses,
  bpscPhysicsTest,
  class12BoardTestSeries,
] as const;

export type CourseId = (typeof paymentProducts)[number]["id"];

export const class12PhysicsFolder = {
  title: "12th Physics",
  description: "Chapter-wise handwritten notes aur revision material.",
  courseIds: [
    "electrostatics-handwritten-notes",
    "current-electricity-handwritten-notes",
  ],
} as const;

export const class12PhysicsChapters = courses.filter((course) =>
  class12PhysicsFolder.courseIds.includes(course.id as (typeof class12PhysicsFolder.courseIds)[number]),
);

export function getCourse(courseId: string) {
  return paymentProducts.find((course) => course.id === courseId);
}

export function getCourseAccessDurationSeconds(courseId: string) {
  const course = getCourse(courseId);
  if (!course || !("accessDurationDays" in course)) return null;
  return course.accessDurationDays * 24 * 60 * 60;
}

export function getCourseAccessExpiresAt(courseId: string, activatedAt: number) {
  const durationSeconds = getCourseAccessDurationSeconds(courseId);
  return durationSeconds === null ? null : activatedAt + durationSeconds * 1000;
}
