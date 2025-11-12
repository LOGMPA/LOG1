import React, { useState } from "react";
import { useSolicitacoes } from "../hooks/useSolicitacoes";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, Truck, Navigation, CheckCircle, ExternalLink } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatusCard from "../components/logistica/StatusCard";
import SolicitacaoCard from "../components/logistica/SolicitacaoCard";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function PainelLogistica() {
  const [dataInicio, setDataInicio] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [dataFim, setDataFim] = useState(format(new Date(), "yyyy-MM-dd"));
  const { data: solicitacoes = [], isLoading } = useSolicitacoes();

  const statusColors = {
    RECEBIDO: { bg: "bg-gradient-to-br from-gray-50 to-gray-100", accent: "bg-gray-500", text: "text-gray-700", icon: "text-gray-600" },
    PROGRAMADO: { bg: "bg-gradient-to-br from-blue-50 to-blue-100", accent: "bg-blue-500", text: "text-blue-700", icon: "text-blue-600" },
    "EM ROTA": { bg: "bg-gradient-to-br from-amber-50 to-amber-100", accent: "bg-amber-500", text: "text-amber-700", icon: "text-amber-600" },
    CONCLUIDO: { bg: "bg-gradient-to-br from-green-50 to-green-100", accent: "bg-green-500", text: "text-green-700", icon: "text-green-600" }
  };

  const solicitacoesFiltradas = solicitacoes.filter(s => {
    const d = new Date(s.previsao);
    if (String(s.status).includes("(D)")) return false;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    return d >= inicio && d <= fim;
  });

  const contagemStatus = {
    RECEBIDO: solicitacoesFiltradas.filter(s => s.status === "RECEBIDO").length,
    PROGRAMADO: solicitacoesFiltradas.filter(s => s.status === "PROGRAMADO").length,
    "EM ROTA": solicitacoesFiltradas.filter(s => s.status === "EM ROTA").length,
    CONCLUIDO: solicitacoesFiltradas.filter(s => s.status === "CONCLUIDO").length
  };

  const proximosQuinzeDias = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

  const recebidos = solicitacoes.filter(s => s.status === "RECEBIDO" && new Date(s.previsao) <= proximosQuinzeDias)
    .sort((a, b) => new Date(a.previsao) - new Date(b.previsao));
  const programados = solicitacoes.filter(s => s.status === "PROGRAMADO" && new Date(s.previsao) <= proximosQuinzeDias)
    .sort((a, b) => new Date(a.previsao) - new Date(b.previsao));
  const emRota = solicitacoes.filter(s => s.status === "EM ROTA" && new Date(s.previsao) <= proximosQuinzeDias)
    .sort((a, b) => new Date(a.previsao) - new Date(b.previsao));

  const cidades = ["PONTA GROSSA", "CASTRO", "IRATI", "ARAPOTI", "GUARAPUAVA", "PRUDENTÓPOLIS", "QUEDAS DO IGUAÇU", "TIBAGI"];
  const extrairCidade = (texto) => {
    if (!texto) return null;
    const t = String(texto).toUpperCase();
    for (const c of cidades) if (t.includes(c)) return c;
    return null;
  };

  const dadosCustosPorCidade = (() => {
    const custoPorCidade = {};
    solicitacoesFiltradas.forEach(s => {
      const origem = extrairCidade(s.esta);
      const destino = extrairCidade(s.vai);
      const valorUsar = (s.valor_terc || 0) > 0 ? (s.valor_terc || 0) : (s.valor_prop || 0);
      if (origem) custoPorCidade[origem] = (custoPorCidade[origem] || 0) + valorUsar;
      if (destino && destino !== origem) custoPorCidade[destino] = (custoPorCidade[destino] || 0) + valorUsar;
    });
    return Object.entries(custoPorCidade).map(([cidade, valor]) => ({
      cidade: cidade.charAt(0) + cidade.slice(1).toLowerCase(),
      valor
    })).sort((a, b) => b.valor - a.valor).slice(0, 8);
  })();

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Logística 2026</h1>
        <p className="text-gray-600">Visão geral das operações de transporte</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Formulários de Solicitação</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2" asChild>
            <a href="https://forms.office.com/r/SaYf3D9bz4" target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4" />
              Solicitação de Frete de Máquinas
            </a>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <a href="https://forms.office.com/r/A7wSsGC5fV" target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4" />
              Solicitação de Frete de Peças/Fracionados
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard status="RECEBIDO" count={contagemStatus.RECEBIDO} icon={Clock} color={statusColors.RECEBIDO} />
        <StatusCard status="PROGRAMADO" count={contagemStatus.PROGRAMADO} icon={Truck} color={statusColors.PROGRAMADO} />
        <StatusCard status="EM ROTA" count={contagemStatus["EM ROTA"]} icon={Navigation} color={statusColors["EM ROTA"]} />
        <StatusCard status="CONCLUÍDO" count={contagemStatus.CONCLUIDO} icon={CheckCircle} color={statusColors.CONCLUIDO} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-sm font-semibold text-gray-700">RECEBIDO</CardTitle>
          </CardHeader>
          <CardContent className="p-4 max-h-96 overflow-y-auto">
            {recebidos.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">Nenhuma solicitação</p>
             : recebidos.map((sol) => <SolicitacaoCard key={sol.id} solicitacao={sol} />)}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="border-b bg-blue-50">
            <CardTitle className="text-sm font-semibold text-blue-700">PROGRAMADO</CardTitle>
          </CardHeader>
          <CardContent className="p-4 max-h-96 overflow-y-auto">
            {programados.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">Nenhuma solicitação</p>
             : programados.map((sol) => <SolicitacaoCard key={sol.id} solicitacao={sol} />)}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="border-b bg-amber-50">
            <CardTitle className="text-sm font-semibold text-amber-700">EM ROTA</CardTitle>
          </CardHeader>
          <CardContent className="p-4 max-h-96 overflow-y-auto">
            {emRota.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">Nenhuma solicitação</p>
             : emRota.map((sol) => <SolicitacaoCard key={sol.id} solicitacao={sol} />)}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Custos de Transporte por Cidade</CardTitle>
          <p className="text-sm text-gray-600">Valores considerando R$ TERC quando disponível, caso contrário R$ PROP</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosCustosPorCidade} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="cidade" type="category" width={120} />
              <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
              <Bar dataKey="valor" name="Custo (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
