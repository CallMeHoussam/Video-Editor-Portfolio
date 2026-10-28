import { WorkExperienceItem, EducationItem, SkillCategory } from '@/types';

export const workExperience: WorkExperienceItem[] = [
  {
    id: 'stay-in-media',
    company: 'Stay in Media',
    roleEn: 'Freelance Video Editor for Ecommerce and Ads',
    roleFr: 'Monteur Vidéo Freelance (E-commerce & Publicités)',
    locationEn: 'Remote',
    locationFr: 'À distance',
    periodEn: '07/2026 - Present',
    periodFr: '07/2026 - Présent',
    bulletsEn: [
      'Engineered conversion-focused video advertisements for online stores and partner agencies including TUCOSO and Naza Agency.',
      'Edited product launch videos like MAMA RAHIK, generating over 100k organic views and direct revenue impact.',
      'Created educational and promotional medical videos for eyecare specialists and private health clinics.',
    ],
    bulletsFr: [
      'Réalisation de publicités axées sur la conversion pour des boutiques en ligne et agences partenaires (TUCOSO, Naza Agency).',
      'Montage de vidéos de lancement produit comme MAMA RAHIK, atteignant plus de 100k vues organiques.',
      'Création de vidéos médicales informatives et promotionnelles pour des spécialistes de la vue et des cliniques.',
    ],
    tags: ['E-Commerce Ads', 'Retention Editing', 'Healthcare Video', 'Remote Workflow'],
  },
  {
    id: 'tagui-media',
    company: 'Tagui Media',
    roleEn: 'Videographer and Video Editor',
    roleFr: 'Cadreur et Monteur Vidéo',
    locationEn: 'Casablanca, Morocco',
    locationFr: 'Casablanca, Maroc',
    periodEn: '09/2026 - 10/2026',
    periodFr: '09/2026 - 10/2026',
    bulletsEn: [
      'Operated professional camera rigs on location and captured high-fidelity video footage across diverse production sets.',
      'Advanced skills in Adobe After Effects to produce higher-end kinetic typography and motion graphics.',
      'Edited promotional videos and social media content for active agency clients.',
    ],
    bulletsFr: [
      'Prise en main professionnelle de la caméra et tournage de projets vidéo sur le terrain.',
      'Perfectionnement sur After Effects et création d’animations motion graphics plus avancées.',
      'Montage de vidéos promotionnelles et de contenus réseaux sociaux pour les clients.',
    ],
    tags: ['Camera Operation', 'Motion Graphics', 'Field Production', 'After Effects'],
  },
  {
    id: 'senseiprod',
    company: 'SenseiProd',
    roleEn: 'Video Editor and Motion Designer',
    roleFr: 'Monteur Vidéo et Motion Designer',
    locationEn: 'Casablanca, Morocco',
    locationFr: 'Casablanca, Maroc',
    periodEn: '05/2026 - 09/2026',
    periodFr: '05/2026 - 09/2026',
    bulletsEn: [
      'Produced modern, dynamic videos for real estate and corporate property firms like SidePark and Ajial Residences.',
      'Created commercial spots and corporate institutional videos for major accounts including Attijariwafa bank and Club des Dirigeants CDD.',
      'Handled complete video editing and UGC content production for media and voice platforms such as CastingVoixOFF and Sawtia.',
    ],
    bulletsFr: [
      'Création de vidéos modernes et dynamiques pour le secteur immobilier et corporate (SidePark, Ajial Résidences).',
      'Réalisation de spots publicitaires et vidéos institutionnelles pour de grands comptes (Attijariwafa bank, Club des Dirigeants CDD).',
      'Gestion complète du montage vidéo et des contenus UGC pour des plateformes médias et voix (CastingVoixOFF, Sawtia).',
    ],
    tags: ['Real Estate Films', 'Corporate Video', 'Attijariwafa Bank', 'UGC Platforms'],
  },
  {
    id: 'technaps',
    company: 'Technaps',
    roleEn: 'Video Editor',
    roleFr: 'Monteur Vidéo',
    locationEn: 'Remote',
    locationFr: 'À distance',
    periodEn: '10/2025 - 12/2025',
    periodFr: '10/2025 - 12/2025',
    bulletsEn: [
      'Edited dynamic promotional videos and short-form social reels for agency roster clients.',
      'Applied rapid cut techniques, sound synchronization, and engaging motion cues.',
    ],
    bulletsFr: [
      'Montage de vidéos promotionnelles dynamiques et de reels pour les réseaux sociaux des clients de l’agence.',
      'Application de techniques de cut rapide, synchronisation sonore et animations d’accroche.',
    ],
    tags: ['Promo Videos', 'Social Reels', 'Speed Editing'],
  },
];

export const educationList: EducationItem[] = [
  {
    id: 'lionsgeek',
    institution: 'LionsGeek',
    degreeEn: 'Content Creation & Media Training',
    degreeFr: 'Création de Contenu & Formation Médias',
    periodEn: '10/2025 - 05/2026',
    periodFr: '10/2025 - 05/2026',
    detailsEn: [
      'Comprehensive intensive immersion covering Digital Marketing, Personal Branding, Community Management, Graphic Design, and Professional AudioVisual production.',
    ],
    detailsFr: [
      'Formation intensive et transversale : Marketing digital, Personal branding, Community management, Design graphique et Audiovisuel professionnel.',
    ],
  },
  {
    id: 'fsjesm',
    institution: 'Faculté des Sciences Juridiques, Économiques et Sociales – Mohammedia (FSJESM)',
    degreeEn: 'Bachelor Degree in International Trade',
    degreeFr: 'Licence en Commerce International',
    periodEn: '09/2023 - 07/2026',
    periodFr: '09/2023 - 07/2026',
    detailsEn: [
      'Deep grounding in international business, commercial strategies, market analysis, and cross-cultural communication.',
    ],
    detailsFr: [
      'Solide formation en commerce international, stratégies commerciales, analyse de marché et communication interculturelle.',
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    titleEn: 'Editing Software & Tools',
    titleFr: 'Logiciels & Outils Créatifs',
    skills: [
      { name: 'Adobe Premiere Pro', level: 'Mastery / Daily Driver', levelFr: 'Maîtrise / Quotidien', highlight: true },
      { name: 'Adobe After Effects', level: 'Advanced Motion & FX', levelFr: 'Motion & Titrages Avancés', highlight: true },
      { name: 'CapCut', level: 'Speed & Mobile UGC', levelFr: 'UGC & Formats Mobiles', highlight: true },
      { name: 'AI Video Tools', level: 'Generative & Enhancements', levelFr: 'Outils IA & Optimisation', highlight: true },
      { name: 'Camera Operation', level: 'On-Site Production', levelFr: 'Cadrage & Prise de Vue' },
    ],
  },
  {
    titleEn: 'Core Post-Production Disciplines',
    titleFr: 'Disciplines Post-Production',
    skills: [
      { name: 'Motion Graphics', level: 'Title & 2D Animation', levelFr: 'Animation & Titrages 2D', highlight: true },
      { name: 'Visual Storytelling', level: 'Rhythm & Narrative Flow', levelFr: 'Rythme & Construction Narrative', highlight: true },
      { name: 'Sound Design & Mixing', level: 'Foley, FX & Voice Sync', levelFr: 'Sound Design & Mixage Voix', highlight: true },
      { name: 'Color Correction', level: 'Étalonnage & Look Dev', levelFr: 'Étalonnage & Rendu Ciné' },
      { name: 'Retention Editing', level: 'Hooks, Pacing & Retention', levelFr: 'Hooks, Rythme & Rétention', highlight: true },
    ],
  },
  {
    titleEn: 'Organization & Professional Workflow',
    titleFr: 'Méthodologie & Organisation',
    skills: [
      { name: 'Teamwork & Collaboration', level: 'Agency & Direct Clients', levelFr: 'Travail d’équipe & Agences' },
      { name: 'Good Organization', level: 'Strict Timeline Delivery', levelFr: 'Gestion Rigoureuse des Délais' },
      { name: 'Adaptability & Fast Learning', level: 'Continuous Evolution', levelFr: 'Adaptabilité & Évolution Rapide' },
      { name: 'Community Management', level: 'Audience Engagement', levelFr: 'Engagement d’Audience' },
      { name: 'Google Workspace & Excel', level: 'Asset Tracking & Planning', levelFr: 'Suivi & Planification' },
    ],
  },
  {
    titleEn: 'Spoken Languages',
    titleFr: 'Langues Parlées',
    skills: [
      { name: 'Arabic', level: 'Native Language', levelFr: 'Langue Maternelle', highlight: true },
      { name: 'English', level: 'Professional Working (B2)', levelFr: 'Professionnel Courant (B2)', highlight: true },
      { name: 'French', level: 'Working Proficiency (A2)', levelFr: 'Niveau Professionnel (A2)' },
    ],
  },
];
