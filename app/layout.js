import PageTransition from "@/components/PageTransition";
import "./globals.css";

export const metadata = {
  title: "Wealth Store",
  description: "Discover viral internet products"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

  <PageTransition>

    {children}

  </PageTransition>

</body>
    </html>
  );
}
