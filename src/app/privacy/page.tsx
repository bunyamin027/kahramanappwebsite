import { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Kahraman App",
  description: "Privacy Policy for Kahraman App",
};

export default function PrivacyPolicy() {
  return <PrivacyContent />;
}
