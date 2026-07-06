export type NotificationType = "approved" | "rejected" | "unpublished";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  message: string;
  category: string;
  date: string; // e.g. "24 Mar 2026"
  time: string; // e.g. "02:29 PM"
  unread?: boolean;
};

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    type: "approved",
    message:
      "🎉 NEP 2020 - Policy Formulation In Education is approved and live in our eBook store! Congratulations! 📚🚀",
    category: "Book Approved",
    date: "24 Mar 2026",
    time: "02:29 PM",
    unread: true,
  },
  {
    id: "n2",
    type: "approved",
    message:
      "🎉 The Innocents Abroad is approved and live in our eBook store! Congratulations! 📚🚀",
    category: "Book Approved",
    date: "23 Mar 2026",
    time: "06:22 PM",
    unread: true,
  },
  {
    id: "n3",
    type: "rejected",
    message:
      "🔍 Unfortunately, Of the Just Shaping of Letters wasn't approved. Please review our feedback and resubmit. Thank you for your understanding. 📖",
    category: "Book Rejected",
    date: "26 Feb 2026",
    time: "05:34 PM",
  },
  {
    id: "n4",
    type: "rejected",
    message:
      "🔍 Unfortunately, NEP 2020 - Policy Formulation In Education wasn't approved. Please review our feedback and resubmit. Thank you for your understanding. 📖",
    category: "Book Rejected",
    date: "26 Feb 2026",
    time: "02:32 PM",
  },
  {
    id: "n5",
    type: "unpublished",
    message:
      "🔍 Unfortunately, Of the Just Shaping of Letters has been unpublished. Please review our feedback and resubmit. Thank you for your understanding. 📖",
    category: "Book Unpublished",
    date: "26 Feb 2026",
    time: "11:58 AM",
  },
];

export function groupByDate(items: NotificationItem[]) {
  const groups: { date: string; items: NotificationItem[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.date === item.date) {
      last.items.push(item);
    } else {
      groups.push({ date: item.date, items: [item] });
    }
  }
  return groups;
}