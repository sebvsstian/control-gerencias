// Definicion de las 9 Gerencias oficiales del proyecto universitario
export const GERENCIAS = [
  {
    id: 'gerente-general',
    nombre: 'Gerente General',
    icono: 'Building2',
    color: 'indigo',
    responsable: '',
    descripcion: 'Liderazgo estratégico y coordinación general',
  },
  {
    id: 'gerente-finanzas',
    nombre: 'Gerente de Finanzas',
    icono: 'DollarSign',
    color: 'emerald',
    responsable: '',
    descripcion: 'Gestión financiera y ROI para inversionistas',
  },
  {
    id: 'gerente-rrhh',
    nombre: 'Gerente de Recursos Humanos',
    icono: 'Users',
    color: 'blue',
    responsable: '',
    descripcion: 'Gestión del talento y cultura organizacional',
  },
  {
    id: 'gerente-ventas',
    nombre: 'Gerente de Ventas / Comercial',
    icono: 'TrendingUp',
    color: 'orange',
    responsable: '',
    descripcion: 'Estrategia comercial y cumplimiento de metas',
  },
  {
    id: 'gerente-rrpp',
    nombre: 'Gerente de Relaciones Públicas',
    icono: 'MessageSquare',
    color: 'purple',
    responsable: '',
    descripcion: 'Imagen corporativa y stakeholders',
  },
  {
    id: 'subgerente-rrpp',
    nombre: 'Subgerente de Relaciones Públicas',
    icono: 'MessageCircle',
    color: 'violet',
    responsable: '',
    descripcion: 'Apoyo en comunicaciones y relaciones externas',
  },
  {
    id: 'gerente-marketing',
    nombre: 'Gerente de Marketing',
    icono: 'Megaphone',
    color: 'pink',
    responsable: '',
    descripcion: 'Estrategia de marca y campañas digitales',
  },
  {
    id: 'gerente-operaciones',
    nombre: 'Gerente de Operaciones',
    icono: 'Settings',
    color: 'teal',
    responsable: '',
    descripcion: 'Eficiencia operativa y procesos internos',
  },
  {
    id: 'subgerente-operaciones',
    nombre: 'Subgerente de Operaciones',
    icono: 'Cog',
    color: 'cyan',
    responsable: '',
    descripcion: 'Soporte operativo y gestión de recursos',
  },
];

export const COLOR_MAP = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-500/30',
    solid: 'bg-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    btn: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60'
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-500/30',
    solid: 'bg-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    btn: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-500/30',
    solid: 'bg-blue-600',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    btn: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60'
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    iconBg: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-500/30',
    solid: 'bg-orange-600',
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    btn: 'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/60 dark:text-orange-300 dark:hover:bg-orange-900/60'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    iconBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-500/30',
    solid: 'bg-purple-600',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    btn: 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60'
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    iconBg: 'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-500/30',
    solid: 'bg-violet-600',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
    btn: 'bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/60 dark:text-violet-300 dark:hover:bg-violet-900/60'
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    iconBg: 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300',
    text: 'text-pink-600 dark:text-pink-400',
    border: 'border-pink-200 dark:border-pink-500/30',
    solid: 'bg-pink-600',
    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    btn: 'bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-950/60 dark:text-pink-300 dark:hover:bg-pink-900/60'
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    iconBg: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-500/30',
    solid: 'bg-teal-600',
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    btn: 'bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900/60'
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-500/30',
    solid: 'bg-cyan-600',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    btn: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/60 dark:text-cyan-300 dark:hover:bg-cyan-900/60'
  },
};

export const META_ROI = 60; // Porcentaje minimo de ROI para inversionistas