import { useState, useEffect, FormEvent } from 'react';
import { Search, Plus, X, ChevronLeft, ChevronRight, Trash2, Edit3, Loader2 } from 'lucide-react';
import api from '../api/client';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  createdBy: { name: string };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const emptyForm = { name: '', description: '', price: '', stock: '', category: '' };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function fetchProducts(page = 1) {
    setLoading(true);
    api.get('/products', { params: { page, limit: 10, search: search || undefined } })
      .then((res) => {
        setProducts(res.data.data);
        setPagination(res.data.pagination);
        setLoading(false);
      });
  }

  useEffect(() => {
    const load = () => fetchProducts();
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      stock: String(p.stock),
      category: p.category,
    });
    setEditingId(p.id);
    setShowModal(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = {
      name: form.name,
      description: form.description || undefined,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      category: form.category,
    };

    if (editingId) {
      await api.put(`/products/${editingId}`, data);
    } else {
      await api.post('/products', data);
    }

    setShowModal(false);
    fetchProducts(pagination.page);
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts(pagination.page);
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-headline text-surface-900">Produtos</h2>
          <p className="text-body text-surface-400 mt-1">{pagination.total} registros</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} strokeWidth={2} />
          Novo Produto
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-100 flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts(1)}
              className="input pl-10"
            />
          </div>
          <button onClick={() => fetchProducts(1)} className="btn-primary">Buscar</button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-surface-300" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-100 bg-surface-50/50">
                  <th className="px-6 py-3 table-header">Nome</th>
                  <th className="px-6 py-3 table-header">Categoria</th>
                  <th className="px-6 py-3 table-header">Preco</th>
                  <th className="px-6 py-3 table-header">Estoque</th>
                  <th className="px-6 py-3 table-header">Criado por</th>
                  <th className="px-6 py-3 table-header">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-surface-50 last:border-0 hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-surface-900">{p.name}</p>
                      {p.description && (
                        <p className="text-caption text-surface-400 truncate max-w-xs mt-0.5">{p.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge-default">{p.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-surface-900 tabular-nums">
                      R$ {Number(p.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium tabular-nums ${p.stock < 10 ? 'text-red-600' : 'text-surface-900'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-400">{p.createdBy.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="btn-ghost p-2 text-surface-400 hover:text-surface-700"
                        >
                          <Edit3 size={15} strokeWidth={1.7} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn-ghost p-2 text-surface-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={15} strokeWidth={1.7} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-surface-100 flex items-center justify-between">
            <span className="text-caption text-surface-400">
              Pagina {pagination.page} de {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchProducts(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn-secondary p-2"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => fetchProducts(pagination.page + 1)}
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
              <h3 className="text-title text-surface-900">
                {editingId ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button onClick={() => setShowModal(false)} className="btn-ghost p-2">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-widest mb-2">Nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-widest mb-2">Descricao</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input min-h-[80px] resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-widest mb-2">Preco (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-widest mb-2">Estoque</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-surface-400 uppercase tracking-widest mb-2">Categoria</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-surface-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
