# Gestion de Empresa - Creacion de Empresa
## Proyecto Universitario - Ingenieria Comercial

Aplicacion web corporativa para gestion y seguimiento de tareas de las 9 gerencias del proyecto universitario.

### Meta Corporativa
**ROI minimo para inversionistas: 60%**

### Gerencias incluidas
1. Gerente General
2. Gerente de Finanzas
3. Gerente de Recursos Humanos
4. Gerente de Ventas / Comercial
5. Gerente de Relaciones Publicas
6. Subgerente de Relaciones Publicas
7. Gerente de Marketing
8. Gerente de Operaciones
9. Subgerente de Operaciones

---

## Instalacion y Configuracion

### Requisitos
- Node.js >= 18
- Una cuenta de Firebase con proyecto creado

### Pasos

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar Firebase:**
   - Copia `.env.example` como `.env`
   - Rellena las credenciales de tu proyecto Firebase:
```bash
cp .env.example .env
```

3. **Configurar Firestore en Firebase Console:**
   - Habilita Cloud Firestore en modo produccion o prueba
   - Aplica las reglas de seguridad del archivo `firestore.rules`

4. **Ejecutar en desarrollo:**
```bash
npm run dev
```

5. **Build para produccion:**
```bash
npm run build
```

---

## Estructura del Proyecto

```
src/
  firebase/
    config.js         # Configuracion Firebase
  hooks/
    useTareas.js      # Hook Firestore para tareas (onSnapshot)
    useComentarios.js # Hook Firestore para comentarios (onSnapshot)
  context/
    AppContext.jsx    # Estado global de la app
  components/
    Sidebar.jsx       # Barra lateral con progreso por gerencia
    Dashboard.jsx     # Vista ejecutiva del Gerente General
    VistaGerencia.jsx # Vista individual de cada gerencia
    TareaCard.jsx     # Tarjeta de tarea con checkbox y deadline
    Comentarios.jsx   # Acordeon de comentarios por tarea
    ModalTarea.jsx    # Modal crear/editar tarea
  App.jsx             # Componente raiz
  constants.js        # Definicion de las 9 gerencias y colores
  utils.js            # Funciones de calculo de progreso y fechas
  index.css           # Estilos Tailwind
```

## Colecciones Firestore

### `tareas`
| Campo | Tipo | Descripcion |
|---|---|---|
| gerenciaId | string | ID de la gerencia |
| titulo | string | Titulo de la tarea |
| descripcion | string | Descripcion del entregable |
| responsable | string | Nombre del alumno |
| fechaLimite | string | Fecha en formato YYYY-MM-DD |
| completada | boolean | Estado de la tarea |
| creadoEn | Timestamp | Fecha de creacion |
| actualizadoEn | Timestamp | Fecha de ultima modificacion |

### `comentarios`
| Campo | Tipo | Descripcion |
|---|---|---|
| tareaId | string | ID de la tarea relacionada |
| texto | string | Contenido del comentario |
| autor | string | Nombre del autor |
| creadoEn | Timestamp | Fecha y hora del comentario |
