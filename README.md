# IdentiMantto

**Catálogo visual de materiales de mantenimiento**

Aplicación web en React + TypeScript para identificar materiales de mantenimiento
a partir del código registrado en el ERP Nisira, su fotografía real y el nombre
con el que se les conoce en taller.

---

## 1. El problema

El área de mantenimiento trabaja con materiales identificados por códigos de Nisira.
Las descripciones oficiales las define otra área y no siempre resultan claras para el
personal técnico: un mismo repuesto puede llamarse `PITON DE BRONCE P/LLANTA TRACTOR`
en el ERP y "pitón de la llanta" en el taller. El campo de fotografía del ERP
existe pero rara vez está lleno.

Eso produce dos situaciones cotidianas:

| Situación | Qué pasa hoy | Qué hace IdentiMantto |
|---|---|---|
| Tengo el código, no sé qué pieza es | Se consulta a un compañero o se baja al almacén | Se busca el código y se ve la fotografía |
| Tengo la pieza, no sé el código | Se pide "el repuesto de la fumigadora" y llega el equivocado | Se filtra por equipo o palabra clave y se obtiene el código correcto |

## 2. Alcance

**IdentiMantto no reemplaza a Nisira ni escribe en sus registros.** Es una capa de
consulta e identificación que complementa al ERP.

Fuera del alcance de forma deliberada: cantidades, stock, movimientos de almacén,
kardex, costos, compras, proveedores e integración directa con Nisira. Mantener una
segunda fuente de verdad para el stock produciría desincronización con el ERP, que es
un problema mayor que el que se pretende resolver.

## 3. Funcionalidades

- Autenticación con dos roles: **Técnico** (consulta) y **Planificador** (consulta y carga de fotografías)
- Catálogo con búsqueda unificada por código, nombre de taller, descripción, equipo y palabras clave
- Filtros por grupo, equipo, materiales sin fotografía y favoritos
- Ficha individual con datos técnicos completos
- Código QR por material para etiquetar estantes: al escanearlo se abre la ficha
- Carga de fotografías a Cloudinary desde el navegador
- Dashboard con el conteo de materiales sin fotografía pendientes
- Favoritos persistentes
- Estados de carga y error en todas las peticiones
- Diseño adaptable a móvil y escritorio

## 4. Stack

| Tecnología | Uso |
|---|---|
| React 19 + TypeScript | Interfaz y tipado del dominio |
| Vite | Servidor de desarrollo y build |
| React Router DOM 7 | Rutas, rutas anidadas, rutas protegidas y parámetros |
| Zustand + `persist` | Estado global de sesión y favoritos, persistido en localStorage |
| Chakra UI | Sistema de componentes y diseño responsive |
| `qrcode.react` | Generación de códigos QR en SVG |
| MockAPI | API REST de materiales |
| Cloudinary | API de subida de imágenes |

## 5. Decisiones técnicas

**Zustand en lugar de Context API.** El estado global es sesión y favoritos: dos datos
que deben sobrevivir a una recarga de página. El middleware `persist` de Zustand resuelve
la persistencia sin escribir código adicional de sincronización con `localStorage`, y
evita los renders en cascada que produce un Context que cambia con frecuencia.

**Capa de servicios separada.** Ningún componente llama a `fetch` directamente. Todas
las peticiones pasan por `services/`, que centraliza la URL base, el manejo de errores
HTTP y la conversión de respuestas. Cambiar de MockAPI a un backend propio solo requiere
tocar esa carpeta.

**`imagenUrl: string | null`.** El tipo modela explícitamente la ausencia de fotografía,
que es el estado que el dashboard cuenta y que el Planificador resuelve. El dato central
del problema está representado en el sistema de tipos.

**Rutas protegidas mediante outlets.** `RutaPrivada` verifica la sesión y aplica el layout
compartido en un solo lugar; `RutaPublica` impide volver al login con la sesión abierta.
Agregar una pantalla protegida no requiere repetir la verificación.

**Permisos por rol en lugar de rutas separadas.** Técnico y Planificador comparten las
mismas rutas; lo que cambia es la disponibilidad de la carga de fotografías, controlada
por `puedeEditar()` en el store de autenticación.

## 6. Estructura

```text
src/
├── components/          Componentes de estado transversales (carga, error, vacío)
├── pages/
│   ├── login/           Autenticación
│   ├── inicio/          Dashboard con métricas del catálogo
│   └── materiales/      Catálogo, ficha de detalle y sus componentes
├── router/
│   ├── outlets/         Rutas protegidas y públicas
│   ├── AppRoutes.tsx    Declaración de rutas
│   └── routes.ts        Rutas centralizadas
├── services/            Capa de acceso a APIs
├── shared/layout/       Layout compartido
├── store/               Estado global (Zustand)
└── types/               Modelos del dominio
```

## 7. Instalación

Requisitos: Node.js 20 o superior y pnpm.

```bash
pnpm install
cp .env.example .env      # completar con los valores propios
pnpm dev
```

## 8. Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_MATERIALES` | URL base de la API de materiales, sin barra final |
| `VITE_CLOUDINARY_CLOUD_NAME` | Nombre de la cuenta de Cloudinary |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Preset de subida sin firma |

## 9. Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Técnico | `tecnico@mantenimiento.com` | `tecnico123` |
| Planificador | `planificador@mantenimiento.com` | `plan123` |

## 10. Scripts

```bash
pnpm dev        # servidor de desarrollo
pnpm build      # verificación de tipos y build de producción
pnpm lint       # análisis estático
pnpm preview    # previsualizar el build
```

## 11. Mejoras previstas

- Backend propio con base de datos en lugar de MockAPI
- Sincronización periódica de códigos desde Nisira, en un solo sentido
- Impresión de etiquetas QR por lote
- Búsqueda del lado del servidor y paginación cuando el catálogo crezca
- Historial de cambios sobre los datos complementarios
