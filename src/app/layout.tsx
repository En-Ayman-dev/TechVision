// // src/app/layout.tsx
// // ...
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en"><body>{children}</body></html> // لا توجد مسافات بين <html> و <body>
//   );
// }

import './globals.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <>{children}</>
  );
}