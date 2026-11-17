import React from 'react';
import { Wallet, CreditCard, RefreshCw } from 'lucide-react';

export default function CuentasGrid({ cuentas, cargando, error, onRecargar }) {
  const formatearMoneda = (valor, moneda = 'HNL') => {
    try {
      return new Intl.NumberFormat('es-HN', {
        style: 'currency',
        currency: moneda,
      }).format(valor);
    } catch {
      return `${moneda} ${Number(valor || 0).toFixed(2)}`;
    }
  };

  if (cargando) {
    return (
      <div className="state-box">
        <RefreshCw className="spin" size={28} />
        <p>Cargando cuentas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-box error-box">
        <p>{error}</p>
        <button className="btn-secondary" onClick={onRecargar}>
          Reintentar conexión
        </button>
      </div>
    );
  }

  if (!cuentas || cuentas.length === 0) {
    return (
      <div className="state-box">
        <p>No hay cuentas disponibles para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="cuentas-grid">
      {cuentas.map((cuenta) => {
        // Soporte flexible para nombres de propiedades comunes de API
        const id = cuenta.IDCuenta ?? cuenta.idCuenta ?? cuenta.id;
        const numero = cuenta.numeroCuenta ?? cuenta.numero ?? `CTA-${id}`;
        const tipo = cuenta.tipoCuenta ?? cuenta.tipo ?? 'Cuenta Monetaria';
        const titular = cuenta.titular ?? cuenta.nombre ?? 'Titular de Cuenta';
        const saldo = cuenta.saldo ?? cuenta.balance ?? 0;
        const moneda = cuenta.moneda ?? 'HNL';

        return (
          <div key={id} className="cuenta-card">
            <div className="card-header">
              <span className="badge-tipo">{tipo}</span>
              <CreditCard size={20} className="card-icon" />
            </div>

            <div className="card-body">
              <p className="cuenta-numero">{numero}</p>
              <p className="cuenta-titular">{titular}</p>
            </div>

            <div className="card-footer">
              <div>
                <span className="saldo-label">Saldo Disponible</span>
                <p className="saldo-valor">{formatearMoneda(saldo, moneda)}</p>
              </div>
              <span className="cuenta-id">ID: {id}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
