import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight, RefreshCw, Landmark, CheckCircle2 } from 'lucide-react';
import { mostrarCuentas } from './api/bankingClient';
import CuentasGrid from './components/CuentasGrid';
import TransferenciaModal from './components/TransferenciaModal';

// Datos de respaldo por si aún no conectas tu backend (puedes eliminar esto luego)
const CUENTAS_DEMO = [
  { IDCuenta: 101, numeroCuenta: '001-458920-1', tipoCuenta: 'Ahorros', titular: 'Cuenta Principal', saldo: 15450.00, moneda: 'HNL' },
  { IDCuenta: 102, numeroCuenta: '001-784512-9', tipoCuenta: 'Cheques', titular: 'Cuenta Operativa', saldo: 42300.50, moneda: 'HNL' },
  { IDCuenta: 103, numeroCuenta: '002-993014-4', tipoCuenta: 'Ahorros USD', titular: 'Reserva Dólares', saldo: 3200.00, moneda: 'USD' },
];

export default function App() {
  const [cuentas, setCuentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modoDemo, setModoDemo] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const cargarCuentas = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const data = await mostrarCuentas();
      // Soporta respuesta directa como arreglo [] o envuelta en { cuentas: [] } / { data: [] }
      const lista = Array.isArray(data) ? data : data?.cuentas || data?.data || [];
      setCuentas(lista);
      setModoDemo(false);
    } catch (err) {
      // Si el endpoint aún no está levantado, carga datos de ejemplo para que puedas probar la UI
      // setCuentas(CUENTAS_DEMO);
      // setModoDemo(true);
      setError('Error Obteniendo Cuentas');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarCuentas();
  }, [cargarCuentas]);

  const handleTransferenciaExitosa = () => {
    setMensajeExito('Transferencia realizada con éxito.');
    cargarCuentas();
    setTimeout(() => setMensajeExito(''), 4000);
  };

  return (
    <div className="app-container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <Landmark size={24} />
          </div>
          <div>
            <h1>Panel de Cuentas</h1>
            <p className="subtitle">Consulta de saldos y transferencias</p>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn-secondary" onClick={cargarCuentas} title="Actualizar cuentas">
            <RefreshCw size={16} />
            <span>Actualizar</span>
          </button>
          <button className="btn-primary" onClick={() => setModalAbierto(true)}>
            <ArrowLeftRight size={16} />
            <span>Generar Transferencia</span>
          </button>
        </div>
      </header>

      <main className="main-content">
        {modoDemo && (
          <div className="banner-info">
            Mostrando cuentas de prueba (el backend aún no responde en <code>src/api/bankingClient.js</code>).
          </div>
        )}

        {mensajeExito && (
          <div className="banner-success">
            <CheckCircle2 size={18} />
            <span>{mensajeExito}</span>
          </div>
        )}

        <section className="section-cuentas">
          <div className="section-title">
            <h2>Mis Cuentas</h2>
            <span className="counter-pill">{cuentas.length} cuentas</span>
          </div>

          <CuentasGrid
            cuentas={cuentas}
            cargando={cargando}
            error={error}
            onRecargar={cargarCuentas}
          />
        </section>
      </main>

      <TransferenciaModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        cuentas={cuentas}
        onTransferenciaExitosa={handleTransferenciaExitosa}
      />
    </div>
  );
}
