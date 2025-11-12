import * as XLSX from "xlsx";

// Map Excel header names to entity keys
const headerMap = {
  "STATUS": "status",
  "FRETE": "frete",
  "HR": "hr",
  "KM": "km",
  "R$ PROP": "valor_prop",
  "R$ TERC": "valor_terc",
  "CHASSI": "chassi_lista",
  "PREV": "previsao",
  "REAL": "real",
  "CLIENTE/NOTA": "nota",
  "SOLICITANTE": "solicitante",
  "ESTÁ:": "esta",
  "VAI:": "vai",
  "TIPO": "tipo",
  "ESTÁ EM:": "estao_em",
  "VAI PARA:": "vai_para",
  "OBS": "obs"
};

function toDateString(v) {
  if (!v) return "";
  // If Excel date number
  if (typeof v === "number") {
    const d = XLSX.SSF.parse_date_code(v);
    const dt = new Date(Date.UTC(d.y, d.m - 1, d.d));
    return dt.toISOString().slice(0,10);
  }
  // If it's already a Date or ISO-like string
  try {
    const dt = new Date(v);
    if (!isNaN(dt)) return dt.toISOString().slice(0,10);
  } catch {}
  return String(v);
}

function splitChassi(val) {
  if (!val) return [];
  return String(val)
    .split(/[;|,|\n|\r]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

export async function loadSolicitacoesFromExcel(url = "data/Solicitacoes.xlsx") {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao carregar o Excel");
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: "" }); // array of objects

  const mapped = rows.map((row, idx) => {
    const obj = {};
    Object.entries(row).forEach(([k, v]) => {
      const key = headerMap[k?.trim()] || null;
      if (!key) return;
      if (key === "previsao" || key === "real") obj[key] = toDateString(v);
      else if (key === "km") obj[key] = Number(String(v).replace(/[^0-9.-]/g, "")) || 0;
      else if (key === "valor_prop" || key === "valor_terc") obj[key] = Number(String(v).replace(/[^0-9.-]/g, "")) || 0;
      else if (key === "chassi_lista") obj[key] = splitChassi(v);
      else obj[key] = typeof v === "string" ? v.trim() : v;
    });
    // Ensure minimal fields
    obj.id = idx + 1;
    // Fallback mapping when some columns use alternate names
    if (!obj.esta && row["ESTÁ EM:"]) obj.esta = String(row["ESTÁ EM:"]).trim();
    if (!obj.vai && row["VAI PARA:"]) obj.vai = String(row["VAI PARA:"]).trim();
    return obj;
  });

  return mapped;
}
