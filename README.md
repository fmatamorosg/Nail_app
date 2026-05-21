# NailApp – Sistema de Gestión de Citas

## Descripción del Proyecto

NailApp es una plataforma web para la gestión de citas y clientas de un salón de uñas.
El sistema permite agendar citas a través de WhatsApp e Instagram, sincronizarlas con Google Calendar y visualizar la información del negocio desde un dashboard administrativo.

---

## Tecnologías utilizadas

- **Ruby on Rails** – Backend y API REST
- **React + Inertia.js** – Frontend SPA
- **Tailwind CSS** – Estilos
- **PostgreSQL** – Base de datos
- **WhatsApp API / Instagram API** – Canales de mensajería
- **Google Calendar API** – Sincronización de citas

---

## Instalación y configuración

### Requisitos previos

- Ruby instalado (versión 3.x o superior)
- Rails instalado (`gem install rails`)
- PostgreSQL instalado y corriendo
- Node.js instalado

### Pasos para correr el proyecto

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/nail_app.git
cd nail_app
```

2. Instalar dependencias de Ruby:

```bash
bundle install
```

3. Instalar dependencias de JavaScript:

```bash
npm install
```

4. Crear la base de datos:

```bash
bin/rails db:create
bin/rails db:migrate
```

5. Correr el servidor:

```bash
bin/dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## Estructura del Proyecto

```
nail_app/
├── app/
│   ├── controllers/     # Controladores Rails
│   ├── models/          # Modelos de base de datos
│   └── frontend/        # Componentes React
├── config/              # Configuración de rutas y aplicación
├── db/                  # Migraciones y esquema
└── public/              # Archivos estáticos
```

---

## Convenciones de Nomenclatura

### Nomenclatura

- Variables y funciones: `camelCase` → Ejemplo: `obtenerCitas()`, `nombreClienta`
- Clases Ruby: `PascalCase` → Ejemplo: `CitasController`, `Clienta`
- Componentes React: `PascalCase` → Ejemplo: `Dashboard.jsx`, `CitaCard.jsx`
- Archivos: `kebab-case` → Ejemplo: `cita-card.jsx`, `dashboard-view.jsx`
- Carpetas: minúsculas → Ejemplo: `components`, `controllers`

### Formato de Código

- Indentación: 2 espacios
- Código limpio y comentado
- Seguir principios de Clean Code

---

## Estrategia de Branches

Se utiliza Git Flow simplificado:

- `main` → Rama de producción
- `develop` → Rama de integración
- `feature-nombre` → Nuevas funcionalidades
- `fix-nombre` → Corrección de errores
- `docs-nombre` → Cambios en documentación

---

## Convención de Commits

Los mensajes de commit siguen la convención:

```
tipo: descripción breve en gerundio
```

**Ejemplos:**
- `[feat]: agregando vista de citas del día`
- `[fix]: corrigiendo validación de formulario`
- `[docs]: actualizando instrucciones de instalación`

### Tipos de Commit

| Tipo | Uso |
|------|-----|
| `[new]` | Creación inicial de archivos o módulos |
| `[feat]` | Nueva funcionalidad |
| `[fix]` | Corrección de errores |
| `[docs]` | Cambios en documentación |
| `[style]` | Cambios de formato sin alterar lógica |
| `[refactor]` | Mejora interna del código |
| `[test]` | Pruebas |
| `[chore]` | Tareas de mantenimiento |

---

## Funcionalidades principales

- Recepción de mensajes por WhatsApp e Instagram
- Agendamiento automático de citas vía bot
- Sincronización con Google Calendar
- Dashboard para visualizar citas, clientas e ingresos
- Historial de clientas y servicios

---

## Colaboradores

| Nombre | Rol |
|--------|-----|
| Fabiola | Desarrolladora |