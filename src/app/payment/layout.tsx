import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Awaiting Payment | Melody Furniture",
  description: "Melody Furniture - furnitur rumah minimalis berkualitas.",
  openGraph: {
    title: "Awaiting Payment | Melody Furniture",
    description: "Melody Furniture - furnitur rumah minimalis berkualitas.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
