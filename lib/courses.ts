export const courses = [
  {
    id: "neet-physics",
    title: "NEET Physics",
    detail: "Complete NEET Physics course with concepts, DPPs, PYQs and revision support.",
    priceInPaise: 199900,
    displayPrice: "Rs 1,999",
    tag: "Medical",
    contentFile: null,
  },
  {
    id: "jee-physics",
    title: "JEE Physics",
    detail: "JEE Main and Advanced preparation with problem-solving sessions and test strategy.",
    priceInPaise: 249900,
    displayPrice: "Rs 2,499",
    tag: "Engineering",
    contentFile: null,
  },
  {
    id: "class-12-board",
    title: "Class 12 Board",
    detail: "CBSE and Bihar Board Physics with exam-focused notes, numericals and revision.",
    priceInPaise: 149900,
    displayPrice: "Rs 1,499",
    tag: "Boards",
    contentFile: null,
  },
  {
    id: "electrostatics-handwritten-notes",
    title: "Electrostatics Handwritten Notes",
    detail: "Class 12 Physics Electrostatics handwritten notes for quick revision and board-level clarity.",
    priceInPaise: 5000,
    displayPrice: "Rs 50",
    tag: "12th Physics Notes",
    contentFile: "electrostatics-handwritten-notes.pdf",
  },
] as const;

export type CourseId = (typeof courses)[number]["id"];

export const class12PhysicsFolder = {
  title: "12th Physics",
  description: "Chapter-wise handwritten notes aur revision material.",
  courseIds: ["electrostatics-handwritten-notes"],
} as const;

export const class12PhysicsChapters = courses.filter((course) =>
  class12PhysicsFolder.courseIds.includes(course.id as (typeof class12PhysicsFolder.courseIds)[number]),
);

export function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId);
}
