import axios from 'axios';

const BASE_URL = '/api/v1';

export const ENDPOINTS = {
  MOSTRAR_CUENTAS: '/accounts',
  CREAR_TRANSFERENCIA: '/transfer',

};

// export const ENDPOINTS = {
//   MOSTRAR_CUENTAS: '/cuentas',                 // Método GET (sin parámetros)
//   CREAR_TRANSFERENCIA: '/transfer',      // Método POST (IDCuentaOrigen, IDCuentaDestino, monto)
//   // METODO_ADICIONAL: '/endpoint-adicional',     // Espacio reservado para el 3er método
// };

// Instancia preconfigurada de Axios
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor opcional para agregar tokens o manejar errores globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en petición API:', error);
    return Promise.reject(error);
  }
);

/**
 * Mostrar Cuentas
 * No recibe ningún parámetro.
 */
export const mostrarCuentas = async () => {
  const response = await apiClient.get(ENDPOINTS.MOSTRAR_CUENTAS);
  return response.data;
};

/**
 * Crear Transferencia
 * @param {Object} datosTransferencia
 * @param {string|number} datosTransferencia.IDCuentaOrigen
 * @param {string|number} datosTransferencia.IDCuentaDestino
 * @param {number} datosTransferencia.monto
 */
export const crearTransferencia = async ({ IDCuentaOrigen, IDCuentaDestino, monto }) => {
  const payload = {
    IDCuentaOrigen,
    IDCuentaDestino,
    monto: Number(monto),
  };
  const response = await apiClient.post(ENDPOINTS.CREAR_TRANSFERENCIA, payload);
  return response.data;
};


// export const ejecutarTercerMetodo = async (params = {}) => {
//   const response = await apiClient.get(ENDPOINTS.METODO_ADICIONAL, { params });
//   return response.data;
// };

export default apiClient;
