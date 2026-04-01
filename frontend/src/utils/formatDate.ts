const TR_DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const TR_MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

/** "1 Haziran Pazartesi 22.00" */
export const formatLongDate = (isoString: string, dayOnly = false, noWeekday = false): string => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const day = d.getDate();
  const month = TR_MONTHS[d.getMonth()];
  const weekday = TR_DAYS[d.getDay()];
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (dayOnly) return `${day} ${month} ${weekday}`;
  if (noWeekday) return `${day} ${month} ${hh}.${mm}`;
  return `${day} ${month} ${weekday} ${hh}.${mm}`;
};

/** "22.00" */
export const formatOnlyTime = (isoString: string): string => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString.slice(-5).replace(":", ".");
  return `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
};

/** "5 dakika önce" */
export const formatRelativeTime = (isoString: string): string => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const diffSec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (diffSec < 60) return "az önce";
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min} dakika önce`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} saat önce`;
  return `${Math.floor(hr / 24)} gün önce`;
};

/** "12g 5s 30dk" countdown */
export const countdownText = (isoString: string): string => {
  if (!isoString) return "-";
  const target = new Date(isoString);
  if (isNaN(target.getTime())) return "-";
  let diff = Math.floor((target.getTime() - Date.now()) / 1000);
  if (diff <= 0) return "Başladı";
  const days = Math.floor(diff / 86400);
  diff -= days * 86400;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const mins = Math.floor(diff / 60);
  return `${days}g ${hours}s ${mins}dk`;
};

/** Kept for MatchCard backward compat */
export const formatMatchDate = formatLongDate;
