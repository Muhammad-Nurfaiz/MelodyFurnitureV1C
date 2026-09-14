import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Melody Furniture",
  description: "Melody Furniture - furnitur rumah minimalis berkualitas.",
  openGraph: {
    title: "Checkout | Melody Furniture",
    description: "Melody Furniture - furnitur rumah minimalis berkualitas.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
