import { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Box,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  FileText,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  Users,
  Wallet,
  X,
} from 'lucide-react';

const navigation = [
  { label: 'Visão geral', icon: LayoutDashboard },
  { label: 'Clientes', icon: Users },
  { label: 'Produtos', icon: Box, badge: '3' },
  { label: 'Vendas', icon: ShoppingBag },
  { label: 'Documentos', icon: FileText },
];

const transactions = [
  { initials: 'MC', name: 'Marta Costa', detail: 'Fatura #FT-2024-084', date: 'Hoje, 10:42', amount: '+ 248,00 €', tone: 'coral' },
  { initials: 'RA', name: 'Rui Almeida', detail: 'Orçamento #OR-2024-031', date: 'Hoje, 09:18', amount: '612,50 €', tone: 'blue' },
  { initials: 'LS', name: 'Loja Sol Nascente', detail: 'Fatura #FT-2024-083', date: 'Ontem, 16:30', amount: '+ 89,90 €', tone: 'green' },
];

const bars = [32, 45, 39, 62, 51, 72, 58, 83, 68, 91, 73, 100];

function Metric({ label, value, change, positive, icon: Icon, tint }) {
  return (
    <article className="metric-panel">
      <div className="metric-topline">
        <span>{label}</span>
        <span className={`metric-icon ${tint}`}><Icon size={17} strokeWidth={1.8} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot">
        <span className={`change ${positive ? 'positive' : 'negative'}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}
        </span>
        <span>vs. mês anterior</span>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const [active, setActive] = useState('Visão geral');
  const [menuOpen, setMenuOpen] = useState(false);
  const [period, setPeriod] = useState('Últimos 12 meses');

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#inicio" aria-label="Forma, início">
          <span className="brand-mark">f<span>.</span></span>
          <span>forma<span className="brand-period">.</span></span>
        </a>
        <div className="workspace-switch">
          <div className="workspace-avatar">A</div>
          <div className="workspace-copy"><strong>Atelier Norte</strong><span>Plano essencial</span></div>
          <ChevronDown size={15} />
        </div>
        <div className="nav-caption">MENU PRINCIPAL</div>
        <nav className="main-nav" aria-label="Navegação principal">
          {navigation.map(({ label, icon: Icon, badge }) => (
            <button key={label} className={`nav-item ${active === label ? 'nav-active' : ''}`} onClick={() => { setActive(label); setMenuOpen(false); }}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>{badge && <span className="nav-badge">{badge}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item"><Settings2 size={18} strokeWidth={1.8} /><span>Definições</span></button>
          <button className="nav-item"><CircleHelp size={18} strokeWidth={1.8} /><span>Ajuda e suporte</span></button>
          <div className="profile-row">
            <div className="profile-avatar">JS</div>
            <div className="workspace-copy"><strong>Joana Silva</strong><span>Administradora</span></div>
            <MoreHorizontal size={19} />
          </div>
        </div>
      </aside>

      {menuOpen && <button className="mobile-scrim" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <div className="breadcrumb">Atelier Norte <span>/</span> <strong>{active}</strong></div>
          <div className="topbar-actions">
            <label className="search-field"><Search size={16} /><input aria-label="Pesquisar" placeholder="Pesquisar..." /><kbd>⌘ K</kbd></label>
            <button className="icon-button notification-button" aria-label="Notificações"><Bell size={18} /><i /></button>
            <div className="topbar-divider" />
            <button className="date-button"><CalendarDays size={16} /><span>15 out, 2026</span><ChevronDown size={14} /></button>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">QUINTA-FEIRA, 15 DE OUTUBRO</p>
              <h1>Bom dia, Joana <span>☀</span></h1>
              <p className="welcome-subtitle">Aqui está o resumo do seu negócio.</p>
            </div>
            <button className="primary-button"><Plus size={17} /> Nova venda</button>
          </section>

          <section className="metrics-grid" aria-label="Indicadores principais">
            <Metric label="Receita total" value="12 480,00 €" change="12,8%" positive icon={Wallet} tint="tint-coral" />
            <Metric label="Vendas realizadas" value="48" change="8,2%" positive icon={ShoppingBag} tint="tint-blue" />
            <Metric label="Clientes ativos" value="126" change="4,6%" positive icon={Users} tint="tint-green" />
            <Metric label="Despesas" value="3 240,00 €" change="2,1%" positive={false} icon={ArrowDownRight} tint="tint-yellow" />
          </section>

          <section className="content-grid">
            <article className="surface revenue-panel">
              <div className="panel-heading">
                <div><h2>Receita ao longo do tempo</h2><p>Acompanhe o desempenho do seu negócio</p></div>
                <select aria-label="Período do gráfico" value={period} onChange={(event) => setPeriod(event.target.value)} className="period-select">
                  <option>Últimos 12 meses</option><option>Últimos 6 meses</option><option>Este ano</option>
                </select>
              </div>
              <div className="chart-summary"><strong>12 480,00 €</strong><span className="change positive"><ArrowUpRight size={14} />12,8%</span></div>
              <div className="chart-wrap" role="img" aria-label="Gráfico de barras com receita mensal crescente">
                <div className="chart-gridlines"><span>4 000 €</span><span>3 000 €</span><span>2 000 €</span><span>1 000 €</span></div>
                <div className="chart-bars">{bars.map((height, index) => <div key={index} className="bar-column"><div className={`chart-bar ${index === 9 ? 'bar-highlight' : ''}`} style={{ height: `${height}%` }} /><span>{['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'][index]}</span></div>)}</div>
              </div>
            </article>

            <article className="surface stock-panel">
              <div className="panel-heading"><div><h2>Stock a repor</h2><p>Produtos abaixo do mínimo</p></div><button className="text-link" onClick={() => setActive('Produtos')}>Ver tudo <ArrowUpRight size={14} /></button></div>
              <div className="stock-list">
                <div className="stock-row"><span className="product-swatch swatch-coral">✳</span><div className="stock-copy"><strong>Vela Botânica</strong><span>SKU VB-024</span></div><span className="stock-count critical">2 un.</span></div>
                <div className="stock-row"><span className="product-swatch swatch-blue">◈</span><div className="stock-copy"><strong>Sabonete Cítrico</strong><span>SKU SC-011</span></div><span className="stock-count warning">4 un.</span></div>
                <div className="stock-row"><span className="product-swatch swatch-green">✿</span><div className="stock-copy"><strong>Óleo de Lavanda</strong><span>SKU OL-008</span></div><span className="stock-count warning">5 un.</span></div>
              </div>
              <button className="outline-button" onClick={() => setActive('Produtos')}><Box size={15} /> Gerir inventário</button>
            </article>
          </section>

          <section className="surface transactions-panel">
            <div className="panel-heading transactions-heading"><div><h2>Atividade recente</h2><p>Últimas movimentações da sua empresa</p></div><button className="text-link" onClick={() => setActive('Vendas')}>Ver todas <ArrowUpRight size={14} /></button></div>
            <div className="table-scroll"><table><thead><tr><th>CLIENTE</th><th>DOCUMENTO</th><th>DATA</th><th className="amount-heading">VALOR</th><th aria-label="Ações" /></tr></thead><tbody>{transactions.map((item) => <tr key={item.detail}><td><div className="client-cell"><span className={`client-avatar avatar-${item.tone}`}>{item.initials}</span><strong>{item.name}</strong></div></td><td className="muted-cell">{item.detail}</td><td className="muted-cell">{item.date}</td><td className={`amount-cell ${item.amount.startsWith('+') ? 'amount-positive' : ''}`}>{item.amount}</td><td><button className="row-more" aria-label={`Mais opções: ${item.name}`}><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table></div>
          </section>

          <footer className="dashboard-footer"><span>© 2026 Forma Gestão</span><span><span className="status-dot" /> Todos os sistemas operacionais</span></footer>
        </div>
      </main>
    </div>
  );
}