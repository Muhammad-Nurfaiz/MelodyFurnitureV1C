import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Tracking | Melody Furniture",
  description: "Melody Furniture - furnitur rumah minimalis berkualitas.",
  icons: {
    icon: "favicon.ico",
  },
  openGraph: {
    title: "Order Tracking | Melody Furniture",
    description: "Melody Furniture - furnitur rumah minimalis berkualitas.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
