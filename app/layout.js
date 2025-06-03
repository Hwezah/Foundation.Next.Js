import "@/app/_styles/globals.css";
export const metadata = {
  title: {
    default: "Welcome / Foundation",
    template: "%s / Foundation",
  },
  description:
    "Luxurious space hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="w-full max-w-9xl mx-auto px-4">{children}</div>
      </body>
    </html>
  );
}
