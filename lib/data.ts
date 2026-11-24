export type ComponentResult = { name: string; food: string; portion: number; percent: number };
export type Report = {
  id: string; school: string; date: string; menu: string; samples: number;
  portions: number; components: ComponentResult[]; before?: string; after?: string;
  source: "contoh" | "unggahan"; note?: string;
};
export const schools = ["SDN Nusantara 01", "SDN Nusantara 02", "SMP Harapan Bangsa"];
export const components: ComponentResult[] = [
  { name: "Karbohidrat", food: "Kentang panggang", portion: 150, percent: 18 },
  { name: "Lauk", food: "Ayam goreng", portion: 70, percent: 8 },
  { name: "Sayur", food: "Buncis, wortel & edamame", portion: 80, percent: 32 },
  { name: "Buah", food: "Anggur hijau", portion: 100, percent: 5 },
];
export const componentNames = components.map(c => c.name);
export const seedReports: Report[] = [
  { id: "TNT-1019", school: schools[0], date: "2026-11-19", menu: "Ayam goreng, kentang & sayuran", samples: 30, portions: 300, components, source: "contoh" },
  { id: "TNT-1018", school: schools[1], date: "2026-11-19", menu: "Ayam goreng, kentang & sayuran", samples: 25, portions: 250, components: components.map((c, i) => ({ ...c, percent: [15, 6, 28, 4][i] })), source: "contoh" },
  { id: "TNT-1017", school: schools[2], date: "2026-11-18", menu: "Ayam goreng, kentang & sayuran", samples: 40, portions: 400, components: components.map((c, i) => ({ ...c, percent: [22, 12, 36, 9][i] })), source: "contoh" },
  { id: "TNT-1016", school: schools[0], date: "2026-11-17", menu: "Ayam goreng, kentang & sayuran", samples: 30, portions: 300, components: components.map((c, i) => ({ ...c, percent: [24, 10, 38, 8][i] })), source: "contoh" },
  { id: "TNT-1015", school: schools[1], date: "2026-11-16", menu: "Ayam goreng, kentang & sayuran", samples: 25, portions: 250, components: components.map((c, i) => ({ ...c, percent: [20, 14, 33, 7][i] })), source: "contoh" },
  { id: "TNT-1014", school: schools[2], date: "2026-11-13", menu: "Ayam goreng, kentang & sayuran", samples: 40, portions: 400, components: components.map((c, i) => ({ ...c, percent: [26, 16, 40, 10][i] })), source: "contoh" },
];
export const number = (n: number, digits = 1) => new Intl.NumberFormat("id-ID", { maximumFractionDigits: digits }).format(n);
export const rupiah = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
export const dateLabel = (s: string) => new Date(s + "T12:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
export const leftover = (r: Report) => r.components.reduce((sum, c) => sum + c.portion * c.percent / 100, 0);
export const percentage = (r: Report) => leftover(r) / r.components.reduce((s, c) => s + c.portion, 0) * 100;
export function exportCSV(filename: string, rows: (string | number)[][]) {
  const csv = "\uFEFF" + rows.map(row => row.map(value => {
    const text = String(value);
    const safe = /^[=+@\t\r-]/.test(text) ? "'" + text : text;
    return '"' + safe.replace(/"/g, '""') + '"';
  }).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
