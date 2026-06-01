import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@sistema.com' },
    update: {},
    create: {
      email: 'admin@sistema.com',
      password: hashedPassword,
      name: 'Administrador',
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'usuario@sistema.com' },
    update: {},
    create: {
      email: 'usuario@sistema.com',
      password: hashedPassword,
      name: 'Usuário Padrão',
      role: Role.USER,
    },
  });

  await prisma.product.createMany({
    data: [
      { name: 'Produto Alpha', description: 'Primeiro produto do sistema', price: 99.90, stock: 50, category: 'Eletrônicos', createdById: admin.id },
      { name: 'Produto Beta', description: 'Segundo produto do sistema', price: 149.90, stock: 30, category: 'Acessórios', createdById: admin.id },
      { name: 'Produto Gamma', description: 'Terceiro produto do sistema', price: 299.90, stock: 15, category: 'Eletrônicos', createdById: user.id },
    ],
    skipDuplicates: true,
  });

  await prisma.report.createMany({
    data: [
      { title: 'Relatório Mensal - Janeiro', content: 'Resumo de vendas e métricas do mês de janeiro.', type: 'mensal', createdById: admin.id },
      { title: 'Relatório de Estoque', content: 'Análise completa do estoque atual.', type: 'estoque', createdById: admin.id },
    ],
    skipDuplicates: true,
  });

  console.log('Seed executado com sucesso!');
  console.log('Admin:', admin.email, '/ Senha: admin123');
  console.log('Usuário:', user.email, '/ Senha: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
