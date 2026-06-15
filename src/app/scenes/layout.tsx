export default function ScenesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
  );
}
