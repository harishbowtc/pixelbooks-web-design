export type BundleStatus = "Rejected" | "Approved" | "Pending";

export type Bundle = {
  id: string;
  title: string;
  bookCount: number;
  status: BundleStatus;
  pricing: number;
  active: boolean;
  cover: string;
  initials: string;
};

export const gradients = [
  "linear-gradient(160deg, oklch(0.55 0.14 240), oklch(0.32 0.09 240))",
  "linear-gradient(160deg, oklch(0.45 0.09 145), oklch(0.28 0.06 145))",
  "linear-gradient(160deg, oklch(0.5 0.13 30), oklch(0.32 0.08 30))",
  "linear-gradient(160deg, oklch(0.55 0.12 300), oklch(0.32 0.08 300))",
  "linear-gradient(160deg, oklch(0.5 0.1 60), oklch(0.32 0.06 60))",
];

const seed: Bundle[] = [
  {
    id: "1",
    title: "Test eBook bundle",
    bookCount: 1,
    status: "Rejected",
    pricing: 0,
    active: true,
    cover: gradients[0],
    initials: "TST",
  },
  {
    id: "2",
    title: "Monsoon Reads Collection",
    bookCount: 5,
    status: "Approved",
    pricing: 499,
    active: true,
    cover: gradients[1],
    initials: "MRC",
  },
  {
    id: "3",
    title: "Kids Storytime Pack",
    bookCount: 8,
    status: "Approved",
    pricing: 799,
    active: false,
    cover: gradients[2],
    initials: "KSP",
  },
  {
    id: "4",
    title: "Business Essentials",
    bookCount: 4,
    status: "Pending",
    pricing: 1299,
    active: true,
    cover: gradients[3],
    initials: "BUS",
  },
  {
    id: "5",
    title: "Poetry Corner",
    bookCount: 3,
    status: "Rejected",
    pricing: 249,
    active: false,
    cover: gradients[4],
    initials: "POE",
  },
];

const LOCAL_STORAGE_KEY = "pixelbooks_bundles";

export function getBundles(): Bundle[] {
  if (typeof window === "undefined") {
    return seed;
  }
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return seed;
  }
}

export function saveBundles(bundles: Bundle[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bundles));
}

export function getBundleById(id: string): Bundle | undefined {
  const list = getBundles();
  return list.find((b) => b.id === id);
}

export function updateBundleStatus(id: string, status: BundleStatus): Bundle[] {
  const list = getBundles();
  const updated = list.map((b) => (b.id === id ? { ...b, status } : b));
  saveBundles(updated);
  return updated;
}
