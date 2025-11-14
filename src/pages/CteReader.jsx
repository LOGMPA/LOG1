import React, { useState } from "react";
import { Upload, FileSpreadsheet, FileSearch2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../components/ui/table";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";

function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function extractParty(clean, label) {
  const idx = clean.indexOf(label);
  if (idx === -1) return { name: "", cnpj: "" };
  const slice = clean.slice(idx, idx + 650);

  const nameMatch = slice.match(
    new RegExp(label + "\\s+([A-Z0-9 .,&/'-]{3,90}?)\\s+(?:ENDERECO|END|MUNICIPIO|MUN|CNPJ)", "i")
  );
  const name = nameMatch ? nameMatch[1].trim() : "";

  const cnpjMatch = slice.match(/CNPJ(?:\/CPF)?[: ]*([0-9.\-\/]{14,20})/i);
  const cnpj = cnpjMatch ? cnpjMatch[1].trim() : "";

  return { name, cnpj };
}

function parseCte(text) {
  const clean = normalize(text);

  let transportadora = "";
  if (clean.includes("PRINCESA DOS CAMPOS")) transportadora = "EXPRESSO PRINCESA DOS CAMPOS";
  else if (clean.includes("EXPRESSO SAO MIGUEL")) transportadora = "EXPRESSO SAO MIGUEL";
  else if (clean.includes("SUDOESTE TRANSPORTES")) transportadora = "SUDOESTE TRANSPORTES";
  else if (clean.includes("TX LOG ENCOMENDAS EXPRESSAS")) transportadora = "TX LOG ENCOMENDAS EXPRESSAS";

  const serieMatch = clean.match(/SERIE\s+([0-9A-Z]{1,4})/);
  const serie = serieMatch ? serieMatch[1] : "";

  const numeroMatch =
    clean.match(/NUMERO\s+([0-9.]{3,})/) || clean.match(/NR[O0]?\s+([0-9.]{3,})/);
  const numero = numeroMatch ? numeroMatch[1] : "";

  let dataHora = "";
  const dhMatch =
    clean.match(/DATA\/HORA EMISSAO\s+([0-9]{2}\/[0-9]{2}\/[0-9]{4}\s+[0-9]{2}:[0-9]{2}:[0-9]{2})/) ||
    clean.match(/DATA E HORA DE EMISSAO\s+([0-9]{2}\/[0-9]{2}\/[0-9]{4}\s+[0-9]{2}:[0-9]{2}:[0-9]{2})/) ||
    clean.match(/AUTORIZACAO\s+([0-9]{2}\/[0-9]{2}\/[0-9]{2,4}\s+[0-9]{2}:[0-9]{2})/);
  if (dhMatch) dataHora = dhMatch[1];

  const remetente = extractParty(clean, "REMETENTE");
  const destinatario = extractParty(clean, "DESTINATARIO");

  let tomador = extractParty(clean, "TOMADOR DO SERVICO");
  if (!tomador.name && !tomador.cnpj) {
    tomador = extractParty(clean, "TOMADOR");
  }

  let valorServico = "";
  const vMatch =
    clean.match(/VALOR TOTAL DO SERVICO[^0-9]*([0-9.]+,[0-9]{2})/) ||
    clean.match(/VALOR A RECEBER[^0-9]*([0-9.]+,[0-9]{2})/);
  if (vMatch) valorServico = vMatch[1];

  return {
    transportadora,
    serie,
    numero,
    dataHora,
    remetente,
    destinatario,
    tomador,
    valorServico,
  };
}

async function readPdfFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map((it) => it.str);
    fullText += strings.join(" ") + "\n";
  }
  return parseCte(fullText);
}

function toCsvRow(values) {
  return values
    .map((v) => {
      const s = (v ?? "").toString().replace(/"/g, '""');
      return `"${s}"`;
    })
    .join(";");
}

export default function CteReader() {
  const [files, setFiles] = useState([]);
  const [rows, setRows] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 30) {
      setError("Selecione no máximo 30 PDFs por vez.");
      setFiles([]);
      return;
    }
    setError("");
    setFiles(selected);
    setRows([]);
  }

  async function handleProcess() {
    if (!files.length) return;
    setIsProcessing(true);
    setError("");
    const results = [];
    for (const file of files) {
      try {
        const parsed = await readPdfFile(file);
        results.push({ fileName: file.name, ...parsed });
      } catch (err) {
        console.error(err);
        results.push({
          fileName: file.name,
          transportadora: "",
          serie: "",
          numero: "",
          dataHora: "",
          remetente: { name: "", cnpj: "" },
          destinatario: { name: "", cnpj: "" },
          tomador: { name: "", cnpj: "" },
          valorServico: "",
          error: "Falha ao ler PDF",
        });
      }
    }
    setRows(results);
    setIsProcessing(false);
  }

  function handleDownloadCsv() {
    if (!rows.length) return;
    const header = [
      "Arquivo",
      "Transportadora",
      "Serie",
      "Numero",
      "DataHora",
      "RemetenteNome",
      "RemetenteCNPJ",
      "DestinatarioNome",
      "DestinatarioCNPJ",
      "TomadorNome",
      "TomadorCNPJ",
      "ValorServico",
    ];
    const lines = [header.join(";")];
    for (const r of rows) {
      lines.push(
        toCsvRow([
          r.fileName,
          r.transportadora,
          r.serie,
          r.numero,
          r.dataHora,
          r.remetente?.name || "",
          r.remetente?.cnpj || "",
          r.destinatario?.name || "",
          r.destinatario?.cnpj || "",
          r.tomador?.name || "",
          r.tomador?.cnpj || "",
          r.valorServico,
        ])
      );
    }
    const csv = lines.join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cte-extracao.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto space-y-6 text-slate-50">
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 border border-slate-700 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300 w-fit">
          <FileSearch2 className="w-3 h-3 text-macLilac" />
          <span>Ferramenta interna</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight flex items-center gap-2">
          Leitor de CTe{" "}
          <span className="text-macLilac text-xl md:text-2xl">• versão fofinha</span>
        </h1>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl">
          Carregue de 1 a 30 CT-es em PDF. O painel lê os layouts conhecidos (Princesa, São Miguel,
          Sudoeste, TX LOG) e monta uma tabela com Remetente, Destinatário, Tomador, número e valor
          do serviço para confronto com o sistema da empresa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Arquivos PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start">
            <div className="space-y-2">
              <Label htmlFor="pdfs">Selecione de 1 a 30 PDFs de CTe</Label>
              <input
                id="pdfs"
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-800 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-slate-900 file:text-slate-50 hover:file:bg-slate-800 cursor-pointer"
              />
              <p className="text-xs text-slate-500">
                Arquivos selecionados: {files.length}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50/80 border border-slate-200 px-3 py-3 text-xs text-slate-700">
              <p className="font-semibold mb-1">Dicas rápidas:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Somente CT-e em PDF (sem ZIP, sem imagem solta).</li>
                <li>Layouts suportados: Princesa, São Miguel, Sudoeste, TX LOG.</li>
                <li>O CSV gerado usa ponto e vírgula, perfeito para Excel PT-BR.</li>
              </ul>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleProcess} disabled={!files.length || isProcessing}>
              <Upload className="w-4 h-4 mr-2" />
              {isProcessing ? "Processando PDFs..." : "Ler PDFs"}
            </Button>

            <Button variant="outline" onClick={handleDownloadCsv} disabled={!rows.length}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Baixar CSV (Excel)
            </Button>
          </div>
        </CardContent>
      </Card>

      {rows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da leitura ({rows.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Transportadora</TableHead>
                    <TableHead>Série</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Data / Hora</TableHead>
                    <TableHead>Remetente</TableHead>
                    <TableHead>CNPJ Remetente</TableHead>
                    <TableHead>Destinatário</TableHead>
                    <TableHead>CNPJ Destinatário</TableHead>
                    <TableHead>Tomador</TableHead>
                    <TableHead>CNPJ Tomador</TableHead>
                    <TableHead>Valor do Serviço</TableHead>
                    <TableHead>Erro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, idx) => (
                    <TableRow key={idx} className="bg-white/80 hover:bg-macLilac/10">
                      <TableCell>{r.fileName}</TableCell>
                      <TableCell>{r.transportadora}</TableCell>
                      <TableCell>{r.serie}</TableCell>
                      <TableCell>{r.numero}</TableCell>
                      <TableCell>{r.dataHora}</TableCell>
                      <TableCell>{r.remetente?.name}</TableCell>
                      <TableCell>{r.remetente?.cnpj}</TableCell>
                      <TableCell>{r.destinatario?.name}</TableCell>
                      <TableCell>{r.destinatario?.cnpj}</TableCell>
                      <TableCell>{r.tomador?.name}</TableCell>
                      <TableCell>{r.tomador?.cnpj}</TableCell>
                      <TableCell>{r.valorServico}</TableCell>
                      <TableCell className="text-[11px] text-red-500">
                        {r.error || ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
