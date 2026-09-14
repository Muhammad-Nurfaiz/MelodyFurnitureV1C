export type Series = {
  slug: string;
  name: string;
  description: string;
};

export const SERIES: Series[] = [
  {
    slug: "ryuki",
    name: "Ryuki Series",
    description:
      "Koleksi bergaya Japandi dengan garis tegas, finishing kayu hangat, dan konstruksi kokoh. Cocok untuk ruang minimalis yang ingin tampil rapi tanpa kehilangan karakter.",
  },
  {
    slug: "aurora",
    name: "Aurora Series",
    description:
      "Perpaduan warna terang dan detail lembut yang membuat ruangan terasa lebih luas dan cerah. Ideal untuk kamar tidur maupun ruang keluarga modern.",
  },
  {
    slug: "nordic",
    name: "Nordic Series",
    description:
      "Desain Skandinavia fungsional dengan kaki ramping dan permukaan bersih. Ringan dipandang, kuat dipakai setiap hari.",
  },
];

export function findSeries(slug?: string): Series | undefined {
  if (!slug) return undefined;
  return SERIES.find((s) => s.slug === slug.toLowerCase());
}
