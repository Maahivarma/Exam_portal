// company logos provided by you
export const COMPANY_LOGOS = {
  tcs: "https://tse4.mm.bing.net/th/id/OIP.iz0l2PLYQDTZgy32ELt1UAHaEa?pid=Api&P=0&h=180",
  google: "https://tse3.mm.bing.net/th/id/OIP.SqEICC59PL1VrdefhGEqqgHaCg?pid=Api&P=0&h=180",
  wipro: "https://tse3.mm.bing.net/th/id/OIP.M4Y1e3NX9p4umo17F1twtgHaCT?pid=Api&P=0&h=180",
  infosys: "https://tse2.mm.bing.net/th/id/OIP.YuXcQzrVCR0Fpkc5tGqSSwHaEP?pid=Api&P=0&h=180",
  microsoft: "https://tse3.mm.bing.net/th/id/OIP.OQBt0lC1V5njMUlM66nGXQHaHa?pid=Api&P=0&h=180",
  amazon: "https://tse4.mm.bing.net/th/id/OIP.Ku4iy6JfyZOZAKxOkfp0ewHaEK?pid=Api&P=0&h=180",
  facebook: "https://tse4.mm.bing.net/th/id/OIP.KCzWnbfabdUUli4v25y-_AHaEK?pid=Api&P=0&h=180",
  oracle: "https://logos-world.net/wp-content/uploads/2020/09/Oracle-Logo.png",
  apple: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
  ibm: "https://logos-world.net/wp-content/uploads/2020/11/IBM-Logo.png",
  meta: "https://logos-world.net/wp-content/uploads/2021/10/Meta-Logo.png"
};

function makeMCQ(idBase, i) {
  return {
    id: `${idBase}-mcq-${i}`,
    type: "mcq",
    text: `Sample MCQ ${i} for ${idBase}: compute ${i} + ${i}`,
    options: [
      { id: "a", text: `${i}`, correct: false },
      { id: "b", text: `${i + i}`, correct: true },
      { id: "c", text: `${i + i + 1}`, correct: false },
      { id: "d", text: `${i + 1}`, correct: false }
    ]
  };
}
function makeSubj(idBase, i) {
  return {
    id: `${idBase}-sub-${i}`,
    type: "subjective",
    text: `Explain concept ${i} related to ${idBase} in brief.`,
    reference_answers: [
      `Concept ${i} for ${idBase} is about principles and core ideas.`,
      `In short, concept ${i} explains main usage and examples.`
    ]
  };
}

const COMPANY_META = [
  { id: "tcs", name: "TCS" },
  { id: "google", name: "Google" },
  { id: "wipro", name: "Wipro" },
  { id: "infosys", name: "Infosys" },
  { id: "microsoft", name: "Microsoft" },
  { id: "amazon", name: "Amazon" },
  { id: "facebook", name: "Meta" },
  { id: "oracle", name: "Oracle" },
  { id: "apple", name: "Apple" },
  { id: "ibm", name: "IBM" }
];

// Pricing for different tests
const TEST_PRICING = {
  "tcs-core-1": { isPremium: false, price: 0, originalPrice: 0 },
  "tcs-adv-1": { isPremium: true, price: 149, originalPrice: 399 },
  "google-core-1": { isPremium: false, price: 0, originalPrice: 0 },
  "google-adv-1": { isPremium: true, price: 299, originalPrice: 699 },
  "wipro-core-1": { isPremium: false, price: 0, originalPrice: 0 },
  "wipro-adv-1": { isPremium: true, price: 129, originalPrice: 349 },
  "infosys-core-1": { isPremium: false, price: 0, originalPrice: 0 },
  "infosys-adv-1": { isPremium: true, price: 149, originalPrice: 399 },
  "microsoft-core-1": { isPremium: true, price: 199, originalPrice: 499 },
  "microsoft-adv-1": { isPremium: true, price: 349, originalPrice: 799 },
  "amazon-core-1": { isPremium: true, price: 249, originalPrice: 599 },
  "amazon-adv-1": { isPremium: true, price: 399, originalPrice: 899 },
  "facebook-core-1": { isPremium: true, price: 199, originalPrice: 499 },
  "facebook-adv-1": { isPremium: true, price: 349, originalPrice: 799 },
  "oracle-core-1": { isPremium: false, price: 0, originalPrice: 0 },
  "oracle-adv-1": { isPremium: true, price: 179, originalPrice: 449 },
  "apple-core-1": { isPremium: true, price: 229, originalPrice: 549 },
  "apple-adv-1": { isPremium: true, price: 379, originalPrice: 849 },
  "ibm-core-1": { isPremium: false, price: 0, originalPrice: 0 },
  "ibm-adv-1": { isPremium: true, price: 159, originalPrice: 399 }
};

export const COMPANIES = COMPANY_META.map((c) => {
  const tests = [
    {
      id: `${c.id}-core-1`,
      title: `${c.name} Core Mock`,
      duration_minutes: 30,
      description: `Core mock test for ${c.name}. Practice fundamental concepts and commonly asked questions.`,
      questions: [],
      ...TEST_PRICING[`${c.id}-core-1`]
    },
    {
      id: `${c.id}-adv-1`,
      title: `${c.name} Advanced Mock`,
      duration_minutes: 40,
      description: `Advanced mock test for ${c.name}. In-depth questions covering complex topics and scenarios.`,
      questions: [],
      ...TEST_PRICING[`${c.id}-adv-1`]
    }
  ];
  tests.forEach((t) => {
    for (let i = 1; i <= 35; i++) {
      if (i % 5 === 0) t.questions.push(makeSubj(t.id, i));
      else t.questions.push(makeMCQ(t.id, i));
    }
  });
  return { id: c.id, name: c.name, tests };
});

// Check if user has purchased a test
export function hasPurchased(testId) {
  const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
  return purchases.some(p => p.testId === testId);
}

// Get all purchases
export function getPurchases() {
  return JSON.parse(localStorage.getItem("purchases") || "[]");
}
