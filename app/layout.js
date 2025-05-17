import AppBody from "./AppBody";
import "@/app/_styles/globals.css";
export const metadata = {
  title: {
    default: "Welcome / Baluti spaces",
    template: "%s / Baluti spaces",
  },
  description:
    "Luxurious space hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AppBody>{children}</AppBody>
    </html>
  );
}
