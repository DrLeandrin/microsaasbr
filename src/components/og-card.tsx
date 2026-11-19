export function OgCard({ title, kicker }: { title: string; kicker: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#f3f1ea",
        padding: "72px",
        color: "#14202b",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 28, height: 28, borderRadius: 99, background: "#0c5c57" }} />
        <div style={{ width: 42, height: 4, background: "#ddd4c4" }} />
        <div style={{ width: 28, height: 28, borderRadius: 99, background: "#9c3b1e" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
        <div style={{ fontSize: title.length > 48 ? 52 : 72, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
        <div style={{ marginTop: 18, fontSize: 30, color: "#243140", lineHeight: 1.3 }}>{kicker}</div>
      </div>
      <div style={{ fontSize: 22, color: "#4a524b" }}>Diretório independente. Sem vínculo com a n8n GmbH.</div>
    </div>
  );
}
