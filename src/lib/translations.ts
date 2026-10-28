import { Locale } from '@/types/portfolio';

export interface TranslationDictionary {
  nav: {
    brand: string;
    work: string;
    services: string;
    about: string;
    experience: string;
    contact: string;
    downloadCv: string;
    cvBadge: string;
    studio: string;
    themeToggle: string;
    languageToggle: string;
    menuOpen: string;
    menuClose: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    exploreWork: string;
    talkCta: string;
    showreelTitle: string;
    showreelBadge: string;
    locationBadge: string;
    availableBadge: string;
    watchShowreel: string;
  };
  portfolio: {
    sectionTitle: string;
    sectionSubtitle: string;
    allCategories: string;
    viewProject: string;
    previewHover: string;
    featuredBadge: string;
    emptyTitle: string;
    emptySubtitle: string;
    openStudio: string;
    viewAllArchive: string;
  };
  caseStudy: {
    backToWork: string;
    client: string;
    year: string;
    role: string;
    format: string;
    software: string;
    tags: string;
    theBrief: string;
    creativeApproach: string;
    rhythm: string;
    hookStrategy: string;
    visualHierarchy: string;
    captionStrategy: string;
    soundDesign: string;
    motionGraphics: string;
    colorTreatment: string;
    editingBreakdown: string;
    results: string;
    editorsNotes: string;
    theDetailThatMatters: string;
    moreLikeThis: string;
    projectCtaTitle: string;
    projectCtaSubtitle: string;
    projectCtaButton: string;
  };
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    deliverables: string;
    toolsUsed: string;
    bookService: string;
  };
  about: {
    sectionTitle: string;
    sectionSubtitle: string;
    bioTitle: string;
    experienceTitle: string;
    educationTitle: string;
    skillsTitle: string;
    languagesTitle: string;
    downloadCvEn: string;
    downloadCvFr: string;
  };
  contact: {
    sectionTitle: string;
    sectionSubtitle: string;
    optionATitle: string;
    optionADesc: string;
    optionABtn: string;
    optionBTitle: string;
    optionBDesc: string;
    fullName: string;
    fullNamePlaceholder: string;
    emailAddress: string;
    emailPlaceholder: string;
    preferredMethod: string;
    methodWhatsApp: string;
    methodEmail: string;
    methodPhone: string;
    phoneOrWhatsApp: string;
    phonePlaceholder: string;
    serviceType: string;
    selectService: string;
    budgetRange: string;
    selectBudget: string;
    budgetUnder500: string;
    budget500to1500: string;
    budget1500to3000: string;
    budgetAbove3000: string;
    deadline: string;
    deadlinePlaceholder: string;
    projectMessage: string;
    projectMessagePlaceholder: string;
    submitInquiry: string;
    submitting: string;
    successMessage: string;
    errorMessage: string;
    directEmailFallback: string;
  };
  footer: {
    brandTagline: string;
    quickLinks: string;
    contactDirect: string;
    socials: string;
    rights: string;
    backToTop: string;
  };
}

export const translations: Record<Locale, TranslationDictionary> = {
  en: {
    nav: {
      brand: "Evoless",
      work: "Work",
      services: "Services",
      about: "About",
      experience: "Career",
      contact: "Contact",
      downloadCv: "Download CV (EN)",
      cvBadge: "EN",
      studio: "Studio",
      themeToggle: "Toggle Theme",
      languageToggle: "Switch Language",
      menuOpen: "Open Navigation Menu",
      menuClose: "Close Navigation Menu"
    },
    hero: {
      headline: "I TURN IDEAS INTO VISUAL EXPERIENCES.",
      subheadline: "Video Editing · Motion Graphics · Creative Advertising",
      exploreWork: "Explore My Work",
      talkCta: "Let's Work Together",
      showreelTitle: "Evoless 2026/2027 Showreel",
      showreelBadge: "Showreel Montage",
      locationBadge: "Casablanca, Morocco · Available Worldwide",
      availableBadge: "Available for New Projects",
      watchShowreel: "Watch Showreel"
    },
    portfolio: {
      sectionTitle: "Selected Work",
      sectionSubtitle: "Editorial storytelling, high-retention social reels, and high-impact commercial campaigns.",
      allCategories: "All Work",
      viewProject: "View Case Study",
      previewHover: "Preview edit",
      featuredBadge: "Featured Cut",
      emptyTitle: "No projects in this category yet",
      emptySubtitle: "New case studies are frequently published via the Studio dashboard.",
      openStudio: "Open Studio CMS",
      viewAllArchive: "View Full Archive"
    },
    caseStudy: {
      backToWork: "Back to Selected Work",
      client: "Client / Brand",
      year: "Year",
      role: "My Role",
      format: "Aspect / Format",
      software: "Software Used",
      tags: "Keywords & Focus",
      theBrief: "The Brief",
      creativeApproach: "My Creative Approach",
      rhythm: "Editing Rhythm & Pacing",
      hookStrategy: "Opening Hook Strategy",
      visualHierarchy: "Visual Hierarchy & Framing",
      captionStrategy: "Caption Strategy & Retention",
      soundDesign: "Sound Design & Foley Layers",
      motionGraphics: "Motion Graphics & Kinetic Text",
      colorTreatment: "Color Grading & Treatment",
      editingBreakdown: "Editing Breakdown",
      results: "Verified Outcomes",
      editorsNotes: "Editor's Notes",
      theDetailThatMatters: "The Detail That Matters",
      moreLikeThis: "More Like This",
      projectCtaTitle: "Need an edit like this? Let's talk.",
      projectCtaSubtitle: "Whether you need high-retention performance creative, commercials, or motion design, I'm ready to bring your vision to life.",
      projectCtaButton: "Inquire About This Service"
    },
    services: {
      sectionTitle: "Services & Capabilities",
      sectionSubtitle: "Tailored post-production solutions for content creators, agencies, and ambitious brands.",
      deliverables: "Key Deliverables",
      toolsUsed: "Primary Tools",
      bookService: "Book This Service"
    },
    about: {
      sectionTitle: "About & Career",
      sectionSubtitle: "2 years of dedicated post-production craft, continuous learning, and client success.",
      bioTitle: "Video Editor & Visual Storyteller",
      experienceTitle: "Work Experience",
      educationTitle: "Education & Training",
      skillsTitle: "Skills & Technical Stack",
      languagesTitle: "Languages",
      downloadCvEn: "Download CV (EN)",
      downloadCvFr: "Download CV (FR)"
    },
    contact: {
      sectionTitle: "Let's Create Together",
      sectionSubtitle: "Reach out directly on WhatsApp or send a detailed project inquiry below.",
      optionATitle: "Option A: Direct WhatsApp",
      optionADesc: "Fastest way to check availability, share brief references, or discuss immediate project turnarounds.",
      optionABtn: "Let's Talk on WhatsApp",
      optionBTitle: "Option B: Project Inquiry Form",
      optionBDesc: "Provide project specifics, expected deadlines, and format requirements for a structured proposal.",
      fullName: "Full Name",
      fullNamePlaceholder: "e.g. Alex Vance",
      emailAddress: "Email Address",
      emailPlaceholder: "alex@company.com",
      preferredMethod: "Preferred Contact Method",
      methodWhatsApp: "WhatsApp",
      methodEmail: "Email",
      methodPhone: "Phone Call",
      phoneOrWhatsApp: "WhatsApp / Phone (Optional)",
      phonePlaceholder: "+212 ... or your local number",
      serviceType: "Service or Project Type",
      selectService: "Select a service...",
      budgetRange: "Estimated Budget (Optional)",
      selectBudget: "Select a range...",
      budgetUnder500: "< $500 (Short-form test / Single edit)",
      budget500to1500: "$500 – $1,500 (Batch reels / Commercial spot)",
      budget1500to3000: "$1,500 – $3,000 (Multi-video campaign)",
      budgetAbove3000: "$3,000+ (Ongoing retainer / Full package)",
      deadline: "Target Deadline (Optional)",
      deadlinePlaceholder: "e.g. In 2 weeks, or end of month",
      projectMessage: "Project Description & Brief",
      projectMessagePlaceholder: "Tell me about your product, desired vibe, footage status, and goals...",
      submitInquiry: "Send Project Inquiry",
      submitting: "Submitting inquiry...",
      successMessage: "Thank you! Your project inquiry has been sent successfully. I will review your brief and reply within 24 hours.",
      errorMessage: "Could not send the inquiry right now. Please message directly on WhatsApp or email elmsaferhoussam@gmail.com.",
      directEmailFallback: "Direct email fallback:"
    },
    footer: {
      brandTagline: "Visual storytelling, rhythm, and motion design crafted with purpose.",
      quickLinks: "Navigation",
      contactDirect: "Direct Contact",
      socials: "Find Me Online",
      rights: "All rights reserved.",
      backToTop: "Back to top"
    }
  },

  fr: {
    nav: {
      brand: "Evoless",
      work: "Projets",
      services: "Services",
      about: "À Propos",
      experience: "Parcours",
      contact: "Contact",
      downloadCv: "Télécharger mon CV (FR)",
      cvBadge: "FR",
      studio: "Studio",
      themeToggle: "Changer de thème",
      languageToggle: "Changer de langue",
      menuOpen: "Ouvrir le menu de navigation",
      menuClose: "Fermer le menu de navigation"
    },
    hero: {
      headline: "JE TRANSFORME LES IDÉES EN EXPÉRIENCES VISUELLES.",
      subheadline: "Montage Vidéo · Motion Design · Publicités Créatives",
      exploreWork: "Explorer Mes Projets",
      talkCta: "Travaillons Ensemble",
      showreelTitle: "Bande Démo Evoless 2026/2027",
      showreelBadge: "Showreel Montage",
      locationBadge: "Casablanca, Maroc · Disponible à distance",
      availableBadge: "Disponible pour Nouveaux Projets",
      watchShowreel: "Voir la Bande Démo"
    },
    portfolio: {
      sectionTitle: "Projets Sélectionnés",
      sectionSubtitle: "Storytelling éditorial, formats courts à haute rétention et campagnes publicitaires percutantes.",
      allCategories: "Tous les projets",
      viewProject: "Voir l'étude de cas",
      previewHover: "Aperçu vidéo",
      featuredBadge: "Sélection Clé",
      emptyTitle: "Aucun projet dans cette catégorie",
      emptySubtitle: "De nouvelles études de cas sont publiées via le tableau de bord Studio.",
      openStudio: "Accéder au Studio CMS",
      viewAllArchive: "Voir toutes les archives"
    },
    caseStudy: {
      backToWork: "Retour aux projets",
      client: "Client / Marque",
      year: "Année",
      role: "Mon Rôle",
      format: "Format / Ratio",
      software: "Logiciels Utilisés",
      tags: "Mots-Clés & Focus",
      theBrief: "Le Brief",
      creativeApproach: "Mon Approche Créative",
      rhythm: "Rythme & Cadence du Montage",
      hookStrategy: "Stratégie du Hook d'Ouverture",
      visualHierarchy: "Hiérarchie Visuelle & Cadrage",
      captionStrategy: "Stratégie de Sous-titrage & Rétention",
      soundDesign: "Sound Design & Effets Foley",
      motionGraphics: "Motion Design & Typographie",
      colorTreatment: "Étalonnage & Traitement Couleur",
      editingBreakdown: "Découpage & Analyse du Montage",
      results: "Résultats Vérifiés",
      editorsNotes: "Notes du Monteur",
      theDetailThatMatters: "Le Détail Qui Change Tout",
      moreLikeThis: "Projets Similaires",
      projectCtaTitle: "Besoin d'un montage comme celui-ci ? Discutons-en.",
      projectCtaSubtitle: "Que vous cherchiez des formats verticaux à forte rétention, un spot publicitaire ou du motion design, je donne vie à vos idées.",
      projectCtaButton: "Démarrer ce type de projet"
    },
    services: {
      sectionTitle: "Services & Prestations",
      sectionSubtitle: "Solutions de post-production sur-mesure pour créateurs, agences et marques ambitieuses.",
      deliverables: "Livrables Principaux",
      toolsUsed: "Outils de Prédilection",
      bookService: "Réserver cette prestation"
    },
    about: {
      sectionTitle: "À Propos & Parcours",
      sectionSubtitle: "2 ans de pratique dédiée de la post-production, d'apprentissage continu et de satisfaction client.",
      bioTitle: "Monteur Vidéo & Storyteller Visuel",
      experienceTitle: "Expérience Professionnelle",
      educationTitle: "Formation & Diplômes",
      skillsTitle: "Compétences & Outils",
      languagesTitle: "Langues Maîtrisées",
      downloadCvEn: "Télécharger mon CV (EN)",
      downloadCvFr: "Télécharger mon CV (FR)"
    },
    contact: {
      sectionTitle: "Créons Ensemble",
      sectionSubtitle: "Contactez-moi directement sur WhatsApp ou complétez le formulaire de projet ci-dessous.",
      optionATitle: "Option A : WhatsApp Direct",
      optionADesc: "Le moyen le plus direct pour vérifier ma disponibilité, envoyer des rushs ou discuter d'un besoin urgent.",
      optionABtn: "Discuter sur WhatsApp",
      optionBTitle: "Option B : Formulaire de Projet",
      optionBDesc: "Partagez vos objectifs, délais et contraintes techniques pour recevoir une estimation personnalisée.",
      fullName: "Nom & Prénom",
      fullNamePlaceholder: "ex. Karim Benani",
      emailAddress: "Adresse Email",
      emailPlaceholder: "contact@entreprise.com",
      preferredMethod: "Moyen de contact préféré",
      methodWhatsApp: "WhatsApp",
      methodEmail: "Email",
      methodPhone: "Appel Téléphonique",
      phoneOrWhatsApp: "Numéro Téléphone / WhatsApp (Optionnel)",
      phonePlaceholder: "+212 ... ou votre indicatif",
      serviceType: "Prestation souhaitée",
      selectService: "Sélectionnez un service...",
      budgetRange: "Budget Estimé (Optionnel)",
      selectBudget: "Sélectionnez une tranche...",
      budgetUnder500: "< 500 € / $ (Test format court / Montage unique)",
      budget500to1500: "500 – 1 500 € / $ (Lot de reels / Spot publicitaire)",
      budget1500to3000: "1 500 – 3 000 € / $ (Campagne multi-vidéos)",
      budgetAbove3000: "3 000 € / $ + (Accompagnement mensuel / Pack complet)",
      deadline: "Délai Souhaité (Optionnel)",
      deadlinePlaceholder: "ex. D'ici 2 semaines, ou fin de mois",
      projectMessage: "Description & Brief du Projet",
      projectMessagePlaceholder: "Parlez-moi de votre produit, de l'ambiance recherchée, de vos rushs et de vos objectifs...",
      submitInquiry: "Envoyer la Demande",
      submitting: "Envoi en cours...",
      successMessage: "Merci ! Votre demande a été transmise avec succès. Je l'étudierai et vous répondrai sous 24 heures.",
      errorMessage: "Impossible d'envoyer la demande pour le moment. Veuillez me contacter directement sur WhatsApp ou par email à elmsaferhoussam@gmail.com.",
      directEmailFallback: "Adresse email directe :"
    },
    footer: {
      brandTagline: "Storytelling visuel, sens du rythme et motion design au service de vos objectifs.",
      quickLinks: "Navigation",
      contactDirect: "Contact Direct",
      socials: "Retrouvez-moi en ligne",
      rights: "Tous droits réservés.",
      backToTop: "Haut de page"
    }
  }
};
