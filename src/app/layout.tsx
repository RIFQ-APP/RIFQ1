import type { Metadata } from "next";
import { Cairo, Amiri } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "رِفْق | RIFQ - منصة إسلامية متكاملة للقرآن الكريم",
    template: "%s | رِفْق",
  },
  description:
    "تعلّم برفق، وافهم بعمق، واستمر بخطوات ثابتة. منصة متكاملة لقراءة القرآن وحفظه ومراجعته وفهم معانيه وتعلّم التجويد والعلوم الإسلامية.",
  keywords: [
    "قرآن",
    "حفظ القرآن",
    "تجويد",
    "تفسير",
    "حديث",
    "أذكار",
    "سيرة",
    "فقه",
    "RIFQ",
    "رِفْق",
  ],
  authors: [{ name: "RIFQ Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "رِفْق | RIFQ",
    description: "منصة إسلامية متكاملة للقرآن الكريم والحفظ والفهم والتعلّم",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${amiri.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Lateef:wght@400;600&family=Noto+Naskh+Arabic:wght@400;600&family=Scheherazade+New:wght@400;600&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('rifq_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${cairo.variable} ${amiri.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
