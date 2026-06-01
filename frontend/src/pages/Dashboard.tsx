import { useState, useEffect } from 'react';
import { Users, Package, FileText, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/client';

interface DashboardData {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalReports: number;
  };
  recentProducts: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    createdAt: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  productsByCategory: Array<{
    category: string;
    count: number;
    totalStock: number;
  }>;
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="card p-6 group hover:shadow-card transition-shadow duration-300">
      <div className="mb-4">
        <Icon size={20} strokeWidth={1.7} className="text-surface-400 group-hover:text-surface-600 transition-colors" />
      </div>
      <p className="text-3xl font-semibold text-surface-900 tracking-tight">{value}</p>
      <p className="text-caption text-surface-400 mt-1">{label}</p>
    </div>
  );
}

const chartTooltipStyle = {
  backgroundColor: '#18181b',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
  padding: '8px 14px',
  boxShadow: '0 8px 24px -4px rgb(0 0 0 / 0.3)',
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-surface-300" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-headline text-surface-900">Dashboard</h2>
        <p className="text-body text-surface-400 mt-1">Visao geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Users} label="Usuarios" value={data.stats.totalUsers} />
        <StatCard icon={Package} label="Produtos" value={data.stats.totalProducts} />
        <StatCard icon={FileText} label="Relatorios" value={data.stats.totalReports} />
        <StatCard icon={TrendingUp} label="Categorias" value={data.productsByCategory.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <div className="card p-6">
          <h3 className="text-title text-surface-900 mb-6">Produtos por Categoria</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.productsByCategory} barGap={8}>
              <CartesianGrid strokeDasharray="0" stroke="#f4f4f5" vertical={false} />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#a1a1aa', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                cursor={{ fill: '#fafafa' }}
              />
              <Bar dataKey="count" fill="#18181b" name="Quantidade" radius={[4, 4, 0, 0]} />
              <Bar dataKey="totalStock" fill="#d4d4d8" name="Estoque" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-title text-surface-900 mb-6">Ultimos Produtos</h3>
          <div className="space-y-0">
            {data.recentProducts.map((product, i) => (
              <div
                key={product.id}
                className={`flex items-center justify-between py-3.5 ${
                  i < data.recentProducts.length - 1 ? 'border-b border-surface-100' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-surface-900">{product.name}</p>
                  <p className="text-caption text-surface-400 mt-0.5">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-surface-900 tabular-nums">
                    R$ {Number(product.price).toFixed(2)}
                  </p>
                  <p className="text-caption text-surface-400 mt-0.5">{product.stock} un.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-5 border-b border-surface-100">
          <h3 className="text-title text-surface-900">Ultimos Usuarios</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50/50">
                <th className="px-6 py-3 table-header">Nome</th>
                <th className="px-6 py-3 table-header">Email</th>
                <th className="px-6 py-3 table-header">Cargo</th>
                <th className="px-6 py-3 table-header">Data</th>
              </tr>
            </thead>
            <tbody>
              {data.recentUsers.map((u, i) => (
                <tr
                  key={u.id}
                  className={i < data.recentUsers.length - 1 ? 'border-b border-surface-50' : ''}
                >
                  <td className="px-6 py-4 text-sm font-medium text-surface-900">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-surface-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="badge-info">{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-400">
                    {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
