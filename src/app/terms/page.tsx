import { Metadata } from "next";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Use (EULA) | Kahraman App",
  description: "End User License Agreement for Kahraman App",
};

export default function TermsOfUse() {
  return <TermsContent />;
}
