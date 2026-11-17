import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { crearTransferencia } from '../api/bankingClient';

export default function TransferenciaModal({ isOpen, onClose, cuentas, onTransferenciaExitosa }) {
  const [idCuentaOrigen, setIdCuentaOrigen] = useState('');
  const [idCuentaDestino, setIdCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm('');

    if (!idCuentaOrigen) {
      setErrorForm('Debes seleccionar una cuenta de origen.');
      return;
    }
    if (!idCuentaDestino.trim()) {
      setErrorForm('Debes ingresar la cuenta destino.');
      return;
    }
    if (String(idCuentaOrigen) === String(idCuentaDestino).trim()) {
      setErrorForm('La cuenta de origen y destino no pueden ser la misma.');
      return;
    }
    if (!monto || Number(monto) <= 0) {
      setErrorForm('El monto debe ser mayor a 0.');
      return;
    }

    try {
      setEnviando(true);
      await crearTransferencia({
        IDCuentaOrigen: idCuentaOrigen,
        IDCuentaDestino: idCuentaDestino.trim(),
        monto: Number(monto),
      });

      // Limpiar y cerrar
      setIdCuentaOrigen('');
      setIdCuentaDestino('');
      setMonto('');
      onTransferenciaExitosa();
      onClose();
    } catch (err) {
      const mensajeApi =
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        'No se pudo procesar la transferencia. Verifica el endpoint o los datos enviados.';
      setErrorForm(mensajeApi);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nueva Transferencia</h2>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="transfer-form">
          {errorForm && (
            <div className="alert-error">
              <AlertCircle size={18} />
              <span>{errorForm}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="cuentaOrigen">Cuenta Origen</label>
            <select
              id="cuentaOrigen"
              value={idCuentaOrigen}
              onChange={(e) => setIdCuentaOrigen(e.target.value)}
              required
            >
              <option value="">-- Selecciona una cuenta origen --</option>
              {cuentas.map((cuenta) => {
                const id = cuenta.IDCuenta ?? cuenta.idCuenta ?? cuenta.id;
                const numero = cuenta.numeroCuenta ?? cuenta.numero ?? `Cuenta #${id}`;
                const saldo = cuenta.saldo ?? cuenta.balance ?? 0;
                const moneda = cuenta.moneda ?? 'HNL';
                return (
                  <option key={id} value={id}>
                    {numero} (ID: {id}) — Saldo: {moneda} {Number(saldo).toFixed(2)}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cuentaDestino">Cuenta Destino (ID o Número)</label>
            <input
              id="cuentaDestino"
              type="text"
              placeholder="Ej. 1002"
              value={idCuentaDestino}
              onChange={(e) => setIdCuentaDestino(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="monto">Monto a Transferir</label>
            <input
              id="monto"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={enviando}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={enviando}>
              <Send size={16} />
              {enviando ? 'Transfiriendo...' : 'Confirmar Transferencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
