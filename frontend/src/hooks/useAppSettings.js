import { useEffect, useState } from "react";
import { APP_INFO } from "@/data/content";
import { settingsService } from "@/services/screeningService";

export function useAppSettings() {
  const [settings, setSettings] = useState({
    rs_name: APP_INFO.rsName,
    tagline: APP_INFO.tagline,
    rs_phone: APP_INFO.rsPhone,
    disclaimer: APP_INFO.disclaimer,
  });

  useEffect(() => {
    settingsService
      .getAll()
      .then((res) => setSettings((prev) => ({ ...prev, ...res.data })))
      .catch(() => {});
  }, []);

  return settings;
}
