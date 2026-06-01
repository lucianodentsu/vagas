import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, UserX, Shield, Loader2 } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  function fetchUsers(page = 1) {
    setLoading(true);
    api.get('/users', { params: { page, limit: 10, search: search || undefined } })
      .then((res) => {
        setUsers(res.data.data);
        setPagination(res.data.pagination);
        setLoading(false);
      });
  }

  useEffect(() => { fetchUsers(); }, []);

  function handleSearch() { fetchUsers(1); }

  async function handleToggleActive(userId: string) {
    await api.delete(`/users/${userId}`);
    fetchUsers(pagination.page);
  }

  async function handleChangeRole(userId: string, role: string) {
    await api.put(`/users/${userId}`, { role });
    fetchUsers(pagination.page);
  }

  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-headline text-surface-900">Usuarios</h2>
          <p className="text-body text-surface-400 mt-1">{pagination.total} registros</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-100 flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="input pl-10"
            />
          </div>
          <button onClick={handleSearch} className="btn-primary">Buscar</button>
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
                  <th className="px-6 py-3 table-header">Email</th>
                  <th className="px-6 py-3 table-header">Cargo</th>
                  <th className="px-6 py-3 table-header">Status</th>
                  <th className="px-6 py-3 table-header">Criado em</th>
                  {isAdmin && <th className="px-6 py-3 table-header">Acoes</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-surface-50 last:border-0 hover:bg-surface-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-surface-900">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-surface-500">{u.email}</td>
                    <td className="px-6 py-4">
                      {isAdmin ? (
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          className="input py-1.5 px-2.5 text-xs w-auto"
                        >
                          <option value="USER">USER</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span className="badge-info">{u.role}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={u.active ? 'badge-success' : 'badge-danger'}>
                        {u.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-400">
                      {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleToggleActive(u.id)}
                            className="btn-ghost p-2 text-surface-400 hover:text-red-500 hover:bg-red-50"
                            title="Desativar usuario"
                          >
                            <UserX size={15} strokeWidth={1.7} />
                          </button>
                          <button
                            className="btn-ghost p-2 text-surface-400 hover:text-surface-700"
                            title="Permissoes"
                          >
                            <Shield size={15} strokeWidth={1.7} />
                          </button>
                        </div>
                      </td>
                    )}
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
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="btn-secondary p-2"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="btn-secondary p-2"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
