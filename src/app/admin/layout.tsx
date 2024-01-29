export const metadata = {
  title: "Admin Dashboard",
  description: "for showing the analytics of the users using gifInfinity",
};
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
