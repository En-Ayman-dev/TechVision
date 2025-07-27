// This layout is needed for the root page, but it doesn't need any content.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
