import { useState, useEffect, FormEvent } from 'react';
import { Plus, X, Trash2, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

interface Report {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
  createdBy: { name: string };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [form, setForm] = useState({ title: '', content: '', type: '' });
  const { user } = useAuth();

  function fetchReports(page = 1) {
    setLoading(true);
    api.get('/reports', { params: { page, limit: 10 } })
      .then((res) => {
        setReports(res.data.data);
        setPagination(res.data.pagination);
        setLoading(false);
      });
  }

  useEffect(() => {
    const load = () => fetchReports();
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    await api.post('/reports', form);
    setShowModal(false);
    setForm({ title: '', content: '', type: '' });
    fetchReports();
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja remover este relatorio?')) return;
    await api.delete(`/reports/${id}`);
    fetchReports(pagination.page);
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-headline text-surface-900">Relatorios</h2>
          <p className="text-body text-surface-400 mt-1">{pagination.total} registros</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} strokeWidth={2} />
          Novo Relatorio
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-surface-300" />
          </div>
        ) : reports.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-surface-400">Nenhum relatorio encontrado</p>
          </div>
        ) : (
          <div>
            {reports.map((r, i) => (
              <div
                key={r.id}
                className={`px-6 py-5 flex items-center justify-between hover:bg-surface-50/50 transition-colors ${
                  i < reports.length - 1 ? 'border-b border-surface-100' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-medium text-surface-900">{r.title}</h3>
                    <span className="badge-purple">{r.type}</span>
                  </div>
                  <p className="text-caption text-surface-400 mt-1 truncate">{r.content}</p>
                  <p className="text-[11px] text-surface-300 mt-1.5">
                    {r.createdBy.name} &middot; {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-1 ml-6 shrink-0">
                  <button
                    onClick={() => setViewReport(r)}
                    className="btn-ghost p-2 text-surface-400 hover:text-surface-700"
                  >
                    <Eye size={15} strokeWidth={1.7} />
                  </button>
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="btn-ghost p-2 text-surface-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={15} strokeWidth={1.7} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-surface-100 flex items-center justify-between">
            <span className="text-caption text-surface-400">
              Pagina {pagination.page} de {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchReports(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn-secondary p-2"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => fetchReports(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="btn-secondary p-2"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="modal max-w-lg p-8 mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-title text-surface-900">Novo Relatorio</h3>
              <button onClick={() => setShowModal(false)} className="btn-ghost p-2">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-widest mb-2">Titulo</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-widest mb-2">Tipo</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="mensal">Mensal</option>
                  <option value="estoque">Estoque</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="operacional">Operacional</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-widest mb-2">Conteudo</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="input min-h-[140px] resize-none"
                  rows={6}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-surface-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewReport && (
        <div className="overlay" onClick={() => setViewReport(null)}>
          <div className="modal max-w-2xl p-8 mx-4 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-title text-surface-900">{viewReport.title}</h3>
                  <span className="badge-purple">{viewReport.type}</span>
                </div>
                <p className="text-caption text-surface-400">
                  {viewReport.createdBy.name} &middot; {new Date(viewReport.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <button onClick={() => setViewReport(null)} className="btn-ghost p-2">
                <X size={18} />
              </button>
            </div>
            <div className="border-t border-surface-100 pt-6">
              <p className="text-body text-surface-700 whitespace-pre-wrap leading-relaxed">
                {viewReport.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
