# Proyecto React - AppBancaria

## Instalación y ejecución

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Configura tus endpoints en `src/api/bankingClient.js` (y opcionalmente crea un archivo `.env` basado en `.env.example` con `VITE_API_BASE_URL`).

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Configuración del Cliente Axios (`src/api/bankingClient.js`)

En el objeto `ENDPOINTS` solo debes reemplazar las rutas por las de tu backend:
- `MOSTRAR_CUENTAS`: Método `GET` sin parámetros.
- `CREAR_TRANSFERENCIA`: Método `POST` que envía `{ IDCuentaOrigen, IDCuentaDestino, monto }`.
- `METODO_ADICIONAL`: Espacio reservado para el tercer método.
