// Definicion de las 9 Gerencias del proyecto universitario
export const GERENCIAS = [
  {
    id: 'gerente-general',
    nombre: 'Gerente General',
    icono: 'Building2',
    color: 'indigo',
    responsable: '',
    descripcion: 'Liderazgo estrategico y coordinacion general',
  },
  {
    id: 'gerente-finanzas',
    nombre: 'Gerente de Finanzas',
    icono: 'DollarSign',
    color: 'emerald',
    responsable: '',
    descripcion: 'Gestion financiera y ROI para inversionistas',
  },
  {
    id: 'gerente-rrhh',
    nombre: 'Gerente de Recursos Humanos',
    icono: 'Users',
    color: 'blue',
    responsable: '',
    descripcion: 'Gestion del talento y cultura organizacional',
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
    nombre: 'Gerente de Relaciones Publicas',
    icono: 'MessageSquare',
    color: 'purple',
    responsable: '',
    descripcion: 'Imagen corporativa y stakeholders',
  },
  {
    id: 'subgerente-rrpp',
    nombre: 'Subgerente de Relaciones Publicas',
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
    descripcion: 'Estrategia de marca y campanas digitales',
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
    descripcion: 'Soporte operativo y gestion de recursos',
  },
];

export const COLOR_MAP = {
  indigo:  { bg: 'bg-indigo-500/20',  text: 'text-indigo-400',  border: 'border-indigo-500/30',  solid: 'bg-indigo-600',  badge: 'bg-indigo-900/50 text-indigo-300' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', solid: 'bg-emerald-600', badge: 'bg-emerald-900/50 text-emerald-300' },
  blue:    { bg: 'bg-blue-500/20',    text: 'text-blue-400',    border: 'border-blue-500/30',    solid: 'bg-blue-600',    badge: 'bg-blue-900/50 text-blue-300' },
  orange:  { bg: 'bg-orange-500/20',  text: 'text-orange-400',  border: 'border-orange-500/30',  solid: 'bg-orange-600',  badge: 'bg-orange-900/50 text-orange-300' },
  purple:  { bg: 'bg-purple-500/20',  text: 'text-purple-400',  border: 'border-purple-500/30',  solid: 'bg-purple-600',  badge: 'bg-purple-900/50 text-purple-300' },
  violet:  { bg: 'bg-violet-500/20',  text: 'text-violet-400',  border: 'border-violet-500/30',  solid: 'bg-violet-600',  badge: 'bg-violet-900/50 text-violet-300' },
  pink:    { bg: 'bg-pink-500/20',    text: 'text-pink-400',    border: 'border-pink-500/30',    solid: 'bg-pink-600',    badge: 'bg-pink-900/50 text-pink-300' },
  teal:    { bg: 'bg-teal-500/20',    text: 'text-teal-400',    border: 'border-teal-500/30',    solid: 'bg-teal-600',    badge: 'bg-teal-900/50 text-teal-300' },
  cyan:    { bg: 'bg-cyan-500/20',    text: 'text-cyan-400',    border: 'border-cyan-500/30',    solid: 'bg-cyan-600',    badge: 'bg-cyan-900/50 text-cyan-300' },
};

export const META_ROI = 60; // Porcentaje minimo de ROI para inversionistas
