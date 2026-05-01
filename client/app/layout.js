import "./globals.css";

export const metadata = {
  title: "ViralBoost AI",
  description: "AI social media SaaS with premium trial access",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
