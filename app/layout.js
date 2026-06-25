import "animate.css/animate.min.css";
import "flatpickr/dist/themes/material_green.css";
import "./globals.css";

export const metadata = {
  title: "ERIC.CO",
  description: "Web aplikasi cafe modern dengan pemesanan, kasir, admin, dan dashboard."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
