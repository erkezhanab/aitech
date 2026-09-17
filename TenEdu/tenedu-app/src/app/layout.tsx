// Root layout just passes through — <html>/<body> are rendered
// by src/app/[locale]/layout.tsx, and the middleware redirects
// "/" to the default locale.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
