"use client";

import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { AppRow } from "@/types/database";

interface Props {
  app: AppRow;
}

export default function MediaKitDownloader({ app }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const zip = new JSZip();

      // 1. Add Text File
      const pressRelease = `
PRESS RELEASE: ${app.name}
----------------------------------------
Tagline: ${app.tagline}
Company: ${app.company_name}
Contact: ${app.contact_email}
Release Date: ${app.release_date || "N/A"}
Version: ${app.version}
Price: ${app.price === 0 ? "Free" : `$${app.price}`}

DESCRIPTION:
${app.description}

LINKS:
App Store: ${app.app_store_url}
Play Store: ${app.play_store_url}
`;
      zip.file(`${app.name}_PressRelease.txt`, pressRelease);

      // Helper function to fetch and add images as blob
      const addImageToZip = async (url: string, filename: string) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          zip.file(filename, blob);
        } catch (err) {
          console.error(`Failed to fetch image: ${url}`, err);
        }
      };

      // 2. Add App Icon
      if (app.icon_url) {
        // Extract extension or default to png
        const ext = app.icon_url.split('.').pop()?.split('?')[0] || 'png';
        await addImageToZip(app.icon_url, `Icon.${ext}`);
      }

      // 3. Add Screenshots
      if (app.screenshots && app.screenshots.length > 0) {
        const screensFolder = zip.folder("Screenshots");
        if (screensFolder) {
          await Promise.all(
            app.screenshots.map((url, i) => {
              const ext = url.split('.').pop()?.split('?')[0] || 'png';
              return addImageToZip(url, `Screenshots/Screenshot_${i + 1}.${ext}`);
            })
          );
        }
      }

      // Generate Zip
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${app.name}_MediaKit.zip`);
    } catch (error) {
      console.error("Failed to generate zip", error);
      alert("An error occurred while generating the media kit.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      className={`media-kit-btn ${isGenerating ? "loading" : ""}`}
      style={{ backgroundColor: app.color, boxShadow: `0 0 20px ${app.color}80` }}
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? "Bundling Assets..." : "Download Full Media Kit (.zip)"}
    </button>
  );
}
