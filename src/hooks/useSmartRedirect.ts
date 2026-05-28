import { useState } from "react";

function getDeviceOS(): string {
  if (typeof window === "undefined") return "Unknown";
  
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as Window & { opera?: string }).opera;
  const safeUserAgent = userAgent || "";

  // iOS detection
  if (/iPad|iPhone|iPod/.test(safeUserAgent) && !(window as Window & { MSStream?: boolean }).MSStream) {
    return "iOS";
  }
  
  // Android detection
  if (/android/i.test(safeUserAgent)) {
    return "Android";
  }

  // Windows
  if (/Win/i.test(safeUserAgent)) {
    return "Windows";
  }

  // Mac
  if (/Mac/i.test(safeUserAgent)) {
    return "Mac";
  }

  return "Other";
}

export function useSmartRedirect() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleDownload = async (appId: string, sourcePage: string) => {
    setIsRedirecting(true);
    
    const osType = getDeviceOS();
    
    // Parse UTMs if they exist
    const searchParams = new URLSearchParams(window.location.search);
    const utmSource = searchParams.get("utm_source") || "";
    const utmMedium = searchParams.get("utm_medium") || "";
    const utmCampaign = searchParams.get("utm_campaign") || "";

    try {
      const res = await fetch("/api/track-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appId,
          osType,
          sourcePage,
          utmSource,
          utmMedium,
          utmCampaign,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to track click");
      }

      const data = await res.json();
      
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        // Fallback if API doesn't return a URL
        window.alert("Redirect URL not found for this platform.");
      }
    } catch (error) {
      console.error("Redirect error:", error);
      // Fallback behavior if analytics fails — we could still try to redirect them
      // if we passed the fallback url as an argument, but for now we'll just log.
      window.alert("Unable to redirect at this time. Please try again later.");
    } finally {
      setIsRedirecting(false);
    }
  };

  return { handleDownload, isRedirecting, getDeviceOS };
}
