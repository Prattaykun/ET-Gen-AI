import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personality Assessment - The Economic Times",
  description: "Tell us about your investment preferences to personalize your news feed.",
};

export default function AssessmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Assessment pages don't show header or market band */}
      {children}
    </>
  );
}
