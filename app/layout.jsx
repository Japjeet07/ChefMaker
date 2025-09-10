import "../styles/globals.css";

//components
import Header from "../components/Header";
import TrackingComponents from "../components/TrackingComponents";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.jsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <AuthProvider>
          <Header />
          <TrackingComponents />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
