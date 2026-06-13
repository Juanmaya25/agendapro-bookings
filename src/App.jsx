import { useState, useMemo, useCallback } from 'react';

import { INIT_SERVICES, INIT_BOOKINGS, INIT_CLIENTS, INIT_STYLISTS, HOURS, STATS_WEEK } from './data/seed.js';
import { themes } from './data/themes.js';
import { makeStyles, makeFocusHandlers } from './utils/styles.js';
import { downloadCSV } from './utils/csv.js';
import { nextId, randomHexColor } from './utils/ids.js';
import { useToast } from './hooks/useToast.js';

import { Sidebar } from './components/Sidebar.jsx';
import { Modal } from './components/Modal.jsx';
import { ConfirmDialog } from './components/ConfirmDialog.jsx';
import { Toast } from './components/Toast.jsx';
import { BookingWizard, TOTAL_STEPS } from './components/BookingWizard.jsx';
import { ServiceForm } from './components/ServiceForm.jsx';
import { ClientForm } from './components/ClientForm.jsx';

import { Dashboard } from './pages/Dashboard.jsx';
import { Bookings } from './pages/Bookings.jsx';
import { Calendar } from './pages/Calendar.jsx';
import { Services } from './pages/Services.jsx';
import { Clients } from './pages/Clients.jsx';
import { Team } from './pages/Team.jsx';
import { Analytics } from './pages/Analytics.jsx';

export default function App() {
  const [theme, setTheme]               = useState('dark');
  const [page, setPage]                 = useState('dashboard');
  const [services, setServices]         = useState(INIT_SERVICES);
  const [bookings, setBookings]         = useState(INIT_BOOKINGS);
  const [clients, setClients]           = useState(INIT_CLIENTS);
  const [stylists]                      = useState(INIT_STYLISTS);
  const [modal, setModal]               = useState(null);
  const [editTarget, setEditTarget]     = useState(null);
  const [form, setForm]                 = useState({});
  const [search, setSearch]             = useState('');
  const [confirm, setConfirm]           = useState(null);
  const [bookingStep, setBookingStep]   = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');

  const [toast, showToast] = useToast();

  const C = themes[theme];
  const S = useMemo(() => makeStyles(C), [C]);
  const focusH = useMemo(() => makeFocusHandlers(C), [C]);

  const fv = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const closeModal = useCallback(() => {
    setModal(null); setEditTarget(null); setForm({}); setBookingStep(1);
  }, []);

  const validate = (fields) => {
    for (const [k, v] of fields) {
      if (!v && v !== 0) { showToast(`"${k}" es requerido`, 'error'); return false; }
    }
    return true;
  };

  const saveBooking = () => {
    if (!validate([['Cliente', form.client], ['Servicio', form.service], ['Hora', form.time]])) return;
    if (!editTarget) {
      setBookings(bb => [...bb, { ...form, id: nextId(bb), date: form.date || '2026-05-04', status:'confirmed', stylist: form.stylist || 'Ana' }]);
      showToast('Reserva creada — confirmación enviada por WhatsApp');
    } else {
      setBookings(bb => bb.map(x => x.id === editTarget.id ? { ...x, ...form } : x));
      showToast('Reserva actualizada');
    }
    closeModal();
  };

  const cancelBooking = id => setConfirm({
    msg: '¿Cancelar esta reserva?',
    onYes: () => {
      setBookings(bb => bb.map(b => b.id === id ? { ...b, status:'cancelled' } : b));
      showToast('Reserva cancelada — cliente notificado');
      setConfirm(null);
    }
  });

  const completeBooking = id => {
    setBookings(bb => bb.map(b => b.id === id ? { ...b, status:'done' } : b));
    showToast('Servicio completado');
  };

  const saveService = () => {
    if (!validate([['Nombre', form.name], ['Precio', form.price]])) return;
    const s = { ...form, duration: +form.duration || 30, price: +form.price || 0 };
    if (!editTarget) {
      setServices(ss => [...ss, { ...s, id: nextId(ss), color: randomHexColor() }]);
      showToast('Servicio agregado');
    } else {
      setServices(ss => ss.map(x => x.id === editTarget.id ? { ...x, ...s } : x));
      showToast('Servicio actualizado');
    }
    closeModal();
  };

  const delService = id => setConfirm({
    msg: '¿Eliminar este servicio?',
    onYes: () => { setServices(ss => ss.filter(x => x.id !== id)); showToast('Servicio eliminado'); setConfirm(null); }
  });

  const saveClient = () => {
    if (!validate([['Nombre', form.name]])) return;
    if (!editTarget) {
      setClients(cc => [...cc, { ...form, id: nextId(cc), visits:0, total:0, loyalty:'silver', lastVisit:'-' }]);
    } else {
      setClients(cc => cc.map(x => x.id === editTarget.id ? { ...x, ...form } : x));
    }
    showToast(editTarget ? 'Cliente actualizado' : 'Cliente agregado');
    closeModal();
  };

  const exportCSV = (data, name) => {
    if (!data.length) { showToast('No hay datos', 'error'); return; }
    downloadCSV(data, name);
    showToast(`${name}.csv descargado`);
  };

  const todayBookings = useMemo(() => bookings.filter(b => b.date === '2026-05-04'), [bookings]);
  const todayActive   = useMemo(() => todayBookings.filter(b => b.status !== 'cancelled'), [todayBookings]);
  const todayRevenue  = useMemo(() => todayActive.reduce((s, b) => {
    const svc = services.find(x => x.name === b.service);
    return s + (svc?.price || 0);
  }, 0), [todayActive, services]);
  const monthRevenue  = STATS_WEEK.reduce((s, d) => s + d.revenue, 0);

  const filteredBookings = useMemo(() => bookings.filter(b => {
    const q = search.toLowerCase();
    const matchQ = b.client.toLowerCase().includes(q) || b.service.toLowerCase().includes(q);
    const matchS = filterStatus === 'all' || b.status === filterStatus;
    return matchQ && matchS;
  }), [bookings, search, filterStatus]);

  const openBookingWizard = (presetForm = {}) => { setModal('booking'); setEditTarget(null); setForm(presetForm); setBookingStep(1); };

  // Booking wizard step logic
  const wizardSave = bookingStep < TOTAL_STEPS
    ? () => {
        if (bookingStep === 1 && !form.service) { showToast('Selecciona un servicio', 'error'); return; }
        if (bookingStep === 2 && !form.time)    { showToast('Selecciona una hora',    'error'); return; }
        setBookingStep(s => s + 1);
      }
    : saveBooking;

  const pages = {
    dashboard: (
      <Dashboard
        clients={clients} todayBookings={todayBookings} todayActive={todayActive}
        todayRevenue={todayRevenue} monthRevenue={monthRevenue}
        onNewBooking={() => { setPage('bookings'); openBookingWizard({}); }}
        onNewClient={() => { setPage('clients'); setModal('client'); setForm({}); }}
        onNewService={() => { setPage('services'); setModal('service'); setForm({}); }}
        onViewReports={() => setPage('analytics')}
        C={C} S={S}
      />
    ),
    bookings: (
      <Bookings
        bookings={bookings} filteredBookings={filteredBookings}
        search={search} onSearch={setSearch} filterStatus={filterStatus} onFilter={setFilterStatus}
        onExport={() => exportCSV(filteredBookings, 'reservas')}
        onNew={() => openBookingWizard({date:'2026-05-04', time:'10:00'})}
        onComplete={completeBooking} onCancel={cancelBooking}
        C={C} S={S} focusH={focusH}
      />
    ),
    calendar: (
      <Calendar
        bookings={bookings}
        onNewBooking={date => openBookingWizard({date, time:'10:00'})}
        C={C} S={S}
      />
    ),
    services: (
      <Services
        services={services}
        onNew={() => { setModal('service'); setEditTarget(null); setForm({}); }}
        onEdit={s => { setModal('service'); setEditTarget(s); setForm({ ...s }); }}
        onDelete={delService}
        C={C} S={S}
      />
    ),
    clients: (
      <Clients
        clients={clients}
        onExport={() => exportCSV(clients, 'clientes')}
        onNew={() => { setModal('client'); setEditTarget(null); setForm({}); }}
        onEdit={c => { setModal('client'); setEditTarget(c); setForm({ ...c }); }}
        C={C} S={S}
      />
    ),
    team: (
      <Team
        stylists={stylists}
        onAdd={() => showToast('Próximamente: agregar nuevo estilista')}
        C={C} S={S}
      />
    ),
    analytics: <Analytics monthRevenue={monthRevenue} C={C} S={S} />,
  };

  return (
    <div className="ap-shell" style={{
      minHeight:'100vh',
      background: theme === 'dark'
        ? `radial-gradient(circle at 0% 0%, rgba(168, 85, 247, .15), transparent 50%), radial-gradient(circle at 100% 100%, rgba(244, 114, 182, .12), transparent 50%), ${C.bg}`
        : `radial-gradient(circle at 0% 0%, rgba(124, 58, 237, .08), transparent 50%), radial-gradient(circle at 100% 100%, rgba(219, 39, 119, .06), transparent 50%), ${C.bg}`,
      fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
      color:C.text, fontSize:14,
      display:'grid', gridTemplateColumns:'78px 1fr',
    }}>

      {/* MODALS — booking wizard */}
      {modal === 'booking' && (
        <Modal title={`Nueva reserva · Paso ${bookingStep}/${TOTAL_STEPS}`} onSave={wizardSave} onClose={closeModal} C={C} S={S}>
          <BookingWizard
            step={bookingStep} onBack={() => setBookingStep(s => s - 1)}
            form={form} setForm={setForm} fv={fv}
            services={services} stylists={stylists} HOURS={HOURS}
            C={C} S={S} focusH={focusH}
          />
        </Modal>
      )}

      {modal === 'service' && (
        <Modal title={editTarget ? 'Editar servicio' : 'Nuevo servicio'} onSave={saveService} onClose={closeModal} C={C} S={S}>
          <ServiceForm form={form} fv={fv} S={S} focusH={focusH} />
        </Modal>
      )}

      {modal === 'client' && (
        <Modal title={editTarget ? 'Editar cliente' : 'Nuevo cliente'} onSave={saveClient} onClose={closeModal} C={C} S={S}>
          <ClientForm form={form} fv={fv} S={S} focusH={focusH} />
        </Modal>
      )}

      <ConfirmDialog confirm={confirm} onCancel={() => setConfirm(null)} C={C} S={S} />
      <Toast toast={toast} C={C} />

      <Sidebar page={page} onNavigate={setPage} theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} C={C} />

      {/* MAIN */}
      <main style={{padding:'28px 32px 60px', maxWidth:1500, margin:'0 auto', width:'100%'}}>
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}
