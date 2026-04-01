import { useRef, useState } from "react";
import { client } from "../api/client";

type Status = { type: "idle" | "loading" | "ok" | "error"; message?: string };

export const AdminPage = () => {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [syncStatus, setSyncStatus] = useState<Status>({ type: "idle" });
  const [csvStatus, setCsvStatus] = useState<Status>({ type: "idle" });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) setAuthed(true);
  };

  const handleSync = async () => {
    setSyncStatus({ type: "loading" });
    try {
      const res = await client.post("/admin/sync", null, {
        headers: { "X-Admin-Password": password },
      });
      setSyncStatus({ type: "ok", message: `Senkronize edildi. Güncellenen maç: ${res.data.matches_updated}` });
    } catch (err: any) {
      const msg = err.response?.status === 401 ? "Yanlış şifre." : (err.response?.data?.detail ?? "Hata oluştu.");
      setSyncStatus({ type: "error", message: msg });
    }
  };

  const handleCsvUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setCsvStatus({ type: "loading" });
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await client.post("/admin/import-csv", form, {
        headers: { "X-Admin-Password": password, "Content-Type": "multipart/form-data" },
      });
      const d = res.data;
      setCsvStatus({ type: "ok", message: `İçe aktarıldı. Katılımcı: ${d.participants_upserted}, Tahmin: ${d.predictions_upserted}` });
    } catch (err: any) {
      const msg = err.response?.status === 401 ? "Yanlış şifre." : (err.response?.data?.detail ?? "Hata oluştu.");
      setCsvStatus({ type: "error", message: msg });
    }
  };

  if (!authed) {
    return (
      <section className="page">
        <h2 className="page__title">Admin</h2>
        <div className="card admin-gate">
          <form onSubmit={handleAuth}>
            <label className="admin-label">Şifre</label>
            <input
              className="admin-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button className="admin-btn" type="submit">Giriş</button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <h2 className="page__title">Admin</h2>

      <div className="card admin-card">
        <h3 className="admin-card__title">Maç Senkronizasyonu</h3>
        <p className="admin-card__desc">football-data.org'dan tüm maçları günceller.</p>
        <button
          className="admin-btn"
          onClick={handleSync}
          disabled={syncStatus.type === "loading"}
        >
          {syncStatus.type === "loading" ? "Senkronize ediliyor..." : "Şimdi Senkronize Et"}
        </button>
        {syncStatus.message && (
          <p className={`admin-msg admin-msg--${syncStatus.type}`}>{syncStatus.message}</p>
        )}
      </div>

      <div className="card admin-card">
        <h3 className="admin-card__title">CSV İçe Aktar</h3>
        <p className="admin-card__desc">Google Forms CSV dışa aktarımını yükle. Mevcut tahminlerin üzerine yazar.</p>
        <input ref={fileRef} type="file" accept=".csv" className="admin-file" />
        <button
          className="admin-btn"
          onClick={handleCsvUpload}
          disabled={csvStatus.type === "loading"}
        >
          {csvStatus.type === "loading" ? "Yükleniyor..." : "CSV Yükle"}
        </button>
        {csvStatus.message && (
          <p className={`admin-msg admin-msg--${csvStatus.type}`}>{csvStatus.message}</p>
        )}
      </div>
    </section>
  );
};
