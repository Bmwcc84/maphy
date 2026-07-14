export const courses = [
  {
    id: "neet-physics",
    title: "NEET Physics",
    detail: "Complete NEET Physics course with concepts, DPPs, PYQs and revision support.",
    priceInPaise: 199900,
    displayPrice: "₹1,999",
    tag: "Medical",
  },
  {
    id: "jee-physics",
    title: "JEE Physics",
    detail: "JEE Main and Advanced preparation with problem-solving sessions and test strategy.",
    priceInPaise: 249900,
    displayPrice: "₹2,499",
    tag: "Engineering",
  },
  {
    id: "class-12-board",
    title: "Class 12 Board",
    detail: "CBSE and Bihar Board Physics with exam-focused notes, numericals and revision.",
    priceInPaise: 149900,
    displayPrice: "₹1,499",
    tag: "Boards",
  },
] as const;

export type CourseId = (typeof courses)[number]["id"];

export function getCourse(courseId: string) {
  return courses.find((course) => course.id === courseId);
}
