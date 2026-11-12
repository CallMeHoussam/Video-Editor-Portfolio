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
      headline: "Cut for rhythm, pace, and attention.",
      subheadline: "Video editing and motion design — commercials, brand films, and short-form social cuts.",
      exploreWork: "Selected Work",
      talkCta: "Start a Project",
      showreelTitle: "Evoless Showreel",
      showreelBadge: "Showreel",
      locationBadge: "Casablanca",
      availableBadge: "Available for commissions",
      watchShowreel: "Watch Showreel"
    },
    portfolio: {
      sectionTitle: "Selected Work",
      sectionSubtitle: "Organized by client folder. Lead selection first, remaining cuts below.",
      allCategories: "All Work",
      viewProject: "Open Film",
      previewHover: "Preview",
      featuredBadge: "Best One",
      emptyTitle: "No videos in this folder yet",
      emptySubtitle: "Publish projects from the Studio dashboard to feature them here.",
      openStudio: "Open Studio",
      viewAllArchive: "Full Archive"
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
      sectionTitle: "Editing Capabilities",
      sectionSubtitle: "From raw dailies and pacing structure to sound design and motion delivery.",
      deliverables: "Deliverables",
      toolsUsed: "Tools",
      bookService: "Inquire"
    },
    about: {
      sectionTitle: "Profile",
      sectionSubtitle: "Houssam Elmsafer — video editor & motion designer based in Casablanca.",
      bioTitle: "Houssam Elmsafer",
      experienceTitle: "Experience",
      educationTitle: "Education",
      skillsTitle: "Capabilities & Tools",
      languagesTitle: "Languages",
      downloadCvEn: "CV (English)",
      downloadCvFr: "CV (French)"
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
      brandTagline: "Video editing & motion design by Houssam Elmsafer.",
      quickLinks: "Navigation",
      contactDirect: "Direct Contact",
      socials: "Elsewhere",
      rights: "All rights reserved.",
      backToTop: "Top"
    }
  },

  fr: {
    nav: {
      brand: "Evoless",
      work: "Projets",
      services: "Services",
      about: "Profil",
      experience: "Parcours",
      contact: "Contact",
      downloadCv: "CV (FR)",
      cvBadge: "FR",
      studio: "Studio",
      themeToggle: "Changer de thème",
      languageToggle: "Changer de langue",
      menuOpen: "Ouvrir le menu de navigation",
      menuClose: "Fermer le menu de navigation"
    },
    hero: {
      headline: "Montage conçu pour le rythme et l’attention.",
      subheadline: "Montage vidéo et motion design — films de marque, publicités et formats courts.",
      exploreWork: "Travaux Sélectionnés",
      talkCta: "Démarrer un Projet",
      showreelTitle: "Bande Démo Evoless",
      showreelBadge: "Showreel",
      locationBadge: "Casablanca",
      availableBadge: "Disponible pour projets",
      watchShowreel: "Voir la Bande Démo"
    },
    portfolio: {
      sectionTitle: "Projets Sélectionnés",
      sectionSubtitle: "Classés par dossier client. Sélection principale en tête, autres formats ci-dessous.",
      allCategories: "Tout voir",
      viewProject: "Voir le film",
      previewHover: "Aperçu",
      featuredBadge: "Best One",
      emptyTitle: "Aucune vidéo dans ce dossier",
      emptySubtitle: "Publiez des projets depuis le Studio pour les afficher ici.",
      openStudio: "Ouvrir le Studio",
      viewAllArchive: "Archives"
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
      sectionTitle: "Savoir-Faire",
      sectionSubtitle: "Des rushs bruts et du rythme narratif jusqu’au sound design et à l’habillage.",
      deliverables: "Livrables",
      toolsUsed: "Outils",
      bookService: "Discuter"
    },
    about: {
      sectionTitle: "Profil",
      sectionSubtitle: "Houssam Elmsafer — monteur vidéo et motion designer basé à Casablanca.",
      bioTitle: "Houssam Elmsafer",
      experienceTitle: "Expérience",
      educationTitle: "Formation",
      skillsTitle: "Compétences & Outils",
      languagesTitle: "Langues",
      downloadCvEn: "CV (Anglais)",
      downloadCvFr: "CV (Français)"
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
      brandTagline: "Montage vidéo et motion design par Houssam Elmsafer.",
      quickLinks: "Navigation",
      contactDirect: "Contact",
      socials: "Réseaux",
      rights: "Tous droits réservés.",
      backToTop: "Haut"
    }
  }
};
