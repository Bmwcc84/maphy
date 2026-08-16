export type HelpCategory =
  | "All"
  | "Payment"
  | "Access"
  | "Tests"
  | "Notes"
  | "Account";

export type HelpArticle = {
  question: string;
  answer: string;
  category: Exclude<HelpCategory, "All">;
};

export const helpArticles: HelpArticle[] = [
  {
    category: "Payment",
    question: "Payment successful hai, lekin course ya PDF unlock nahi hua. Kya karun?",
    answer:
      "Same email se login karke Dashboard kholen aur Recover Purchase use karein. Razorpay payment ID ready rakhein. Phir bhi access na mile to neeche feedback form mein Payment issue select karke payment ID bhejein.",
  },
  {
    category: "Payment",
    question: "Payment account se kata, lekin checkout failed dikh raha hai.",
    answer:
      "Razorpay mein failed ya pending payment ka final status bank confirmation ke baad update hota hai. Duplicate payment na karein. Payment ID ke saath support request bhejein, hum transaction verify karenge.",
  },
  {
    category: "Notes",
    question: "Paid handwritten notes ka PDF kaise download hoga?",
    answer:
      "Payment wale email se login karke Dashboard ya Notes section kholen. Purchased chapter ke saamne Download PDF option active dikhega. Browser mein pop-up aur downloads allowed rakhein.",
  },
  {
    category: "Notes",
    question: "One-time notes preview dobara kyun nahi khul raha?",
    answer:
      "Free preview har email login ko sirf ek baar milta hai. Preview time complete hone ke baad full PDF payment ke baad hi unlock hota hai.",
  },
  {
    category: "Tests",
    question: "Test submit karne ke baad result aur question PDF kahan milega?",
    answer:
      "Submit ke turant baad score, correct answers aur explanations result screen par milte hain. Usi result section mein branded question PDF download button hota hai.",
  },
  {
    category: "Access",
    question: "30-day test access kab expire hota hai?",
    answer:
      "Access successful payment aur activation ke samay se 30 din tak valid rehta hai. Expiry Dashboard mein purchase ke saath dikhai jati hai.",
  },
  {
    category: "Account",
    question: "Google login kaam nahi kar raha hai.",
    answer:
      "Browser cookies aur pop-ups allow karke dobara try karein. Wahi Google email use karein jis se payment ya preview liya tha. Incognito mode ya doosre browser mein bhi check kar sakte hain.",
  },
  {
    category: "Tests",
    question: "Kya main test mein question skip karke submit kar sakta hoon?",
    answer:
      "Haan. Har question attempt karna zaroori nahi hai. Submit button test ke dauran available rehta hai aur skipped questions result mein unattempted dikhte hain.",
  },
];
