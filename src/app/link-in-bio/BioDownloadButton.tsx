"use client";

import { useSmartRedirect } from "@/hooks/useSmartRedirect";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  appId: string;
  color: string;
  className?: string;
}

export default function BioDownloadButton({ appId, color, className }: Props) {
  const { handleDownload, isRedirecting } = useSmartRedirect();
  const { t } = useLanguage();

  const buttonClass = className || "bio-download-btn";

  return (
    <button
      className={`${buttonClass} ${isRedirecting ? "loading" : ""}`}
      style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}40` }}
      onClick={() => handleDownload(appId, "link-in-bio")}
      disabled={isRedirecting}
    >
      {isRedirecting ? t("redirecting_btn") : t("download_btn")}
    </button>
  );
}
