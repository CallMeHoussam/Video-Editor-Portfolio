import { PortfolioData } from '@/types/portfolio';

export const initialPortfolioData: PortfolioData = {
  settings: {
    brandName: "Evoless",
    editorName: "Houssam Elmsafer",
    editorTitle: {
      en: "Creative Video Editor & Motion Designer",
      fr: "Monteur Vidéo Créatif & Motion Designer"
    },
    bioSummary: {
      en: "Video editor with 2 years of professional experience crafting dynamic, conversion-focused edits for brands, agencies, and creators. Specializing in high-retention short-form (Reels, TikTok) and cinematic long-form storytelling. Master of Premiere Pro and After Effects, delivering punctuality, rhythm, and visual polish.",
      fr: "Monteur vidéo avec 2 ans d'expérience professionnelle concevant des montages dynamiques et axés sur la conversion pour marques, agences et créateurs. Spécialiste des formats courts à haute rétention (Reels, TikTok) et du storytelling long format. Maîtrise de Premiere Pro et After Effects avec rigueur et sens du rythme."
    },
    location: "Casablanca, Morocco",
    phone: "+212 774-288879",
    whatsappNumber: "212774288879",
    whatsappStarterMessage: {
      en: "Hi Houssam, I'd like to discuss a video editing project.",
      fr: "Bonjour Houssam, j'aimerais échanger avec vous au sujet d'un projet de montage vidéo."
    },
    contactEmail: "elmsaferhoussam@gmail.com",
    linkedInUrl: "https://www.linkedin.com/in/elmsafer-houssam",
    instagramUrl: "",
    xUrl: "",
    youtubeUrl: "",
    showreel: {
      provider: "placeholder",
      videoUrl: "",
      poster: "/images/showreel-poster.svg",
      title: {
        en: "Evoless 2026/2027 Showreel — Visual Rhythm & Motion",
        fr: "Bande Démo Evoless 2026/2027 — Rythme Visuel & Motion"
      }
    },

    cvFiles: {
      en: "/files/cv/Houssam_CV_ENG.pdf",
      fr: "/files/cv/Houssam_CV_FRA.pdf"
    }
  },

  categories: [
    {
      id: "ads-commercials",
      slug: "ads-commercials",
      name: {
        en: "Ads & Commercials",
        fr: "Publicités & Spots"
      },
      order: 1
    },
    {
      id: "ugc-performance",
      slug: "ugc-performance",
      name: {
        en: "UGC & Performance Creative",
        fr: "UGC & Vidéos de Performance"
      },
      order: 2
    },
    {
      id: "motion-graphics",
      slug: "motion-graphics",
      name: {
        en: "Motion Graphics",
        fr: "Motion Design"
      },
      order: 3
    },
    {
      id: "social-media",
      slug: "social-media",
      name: {
        en: "Social Media Content",
        fr: "Contenu Réseaux Sociaux"
      },
      order: 4
    },
    {
      id: "brand-films",
      slug: "brand-films",
      name: {
        en: "Brand Films",
        fr: "Films de Marque"
      },
      order: 5
    },
    {
      id: "other-projects",
      slug: "other-projects",
      name: {
        en: "Other Projects",
        fr: "Autres Projets"
      },
      order: 6
    }
  ],

  services: [
    {
      id: "service-1",
      slug: "video-editing",
      title: {
        en: "Full-Cycle Video Editing",
        fr: "Montage Vidéo Intégral"
      },
      tagline: {
        en: "Pacing, narrative arc, and seamless flow for YouTube and long-form productions.",
        fr: "Rythme, arc narratif et fluidité pour YouTube et productions long format."
      },
      description: {
        en: "Comprehensive video post-production tailored for maximum viewer engagement. Multi-camera assembly, pacing refinement, seamless cutaways, dialogue cleanup, and dynamic visual hooks that keep audiences watching till the last second.",
        fr: "Post-production vidéo complète pensée pour maximiser la rétention d'audience. Dérushage multi-caméras, affinage du rythme, coupes fluides, nettoyage des dialogues et accroches visuelles dynamiques."
      },
      deliverables: {
        en: [
          "Multi-cam and A/B roll synchronization",
          "Audio mastering & ambient sound design",
          "Color correction and contrast balance",
          "Thumbnails & teaser cuts"
        ],
        fr: [
          "Synchronisation multi-caméras et plans B-roll",
          "Mastering audio et sound design immersif",
          "Étalonnage et harmonisation des couleurs",
          "Déclinaisons teasers et miniatures"
        ]
      },
      tools: ["Adobe Premiere Pro", "Audition", "DaVinci Resolve"],
      highlight: {
        en: "Optimized for audience watch-time and narrative momentum.",
        fr: "Optimisé pour la durée de visionnage et l'élan narratif."
      },
      order: 1
    },
    {
      id: "service-2",
      slug: "ads-commercials",
      title: {
        en: "Advertising & Commercial Videos",
        fr: "Publicités & Spots Commerciaux"
      },
      tagline: {
        en: "High-impact visual commercials engineered to convert attention into action.",
        fr: "Spots percutants conçus pour convertir l'attention en action mesurable."
      },
      description: {
        en: "Direct-response and brand commercials built around proven hook structures, product benefits, and clear calls-to-action. Designed specifically for ecommerce launches, brand awareness campaigns, and high-CTR marketing funnels.",
        fr: "Spots publicitaires orientés conversion bâtis autour d'accroches éprouvées, de la mise en valeur des bénéfices et d'appels à l'action clairs pour l'e-commerce et les campagnes d'acquisition."
      },
      deliverables: {
        en: [
          "3-second scroll-stopping hook variations",
          "Dynamic kinetic typography & badges",
          "Product feature callouts & motion overlays",
          "Multi-aspect ratio exports (9:16, 1:1, 16:9)"
        ],
        fr: [
          "Déclinaisons d'accroches 3 secondes anti-scroll",
          "Typographie cinétique et badges dynamiques",
          "Mise en avant graphique des bénéfices produits",
          "Exports multi-formats (9:16, 1:1, 16:9)"
        ]
      },
      tools: ["Premiere Pro", "After Effects", "CapCut"],
      highlight: {
        en: "Campaign proven with 100k+ organic views on flagship product launch.",
        fr: "Éprouvé en campagne avec plus de 100k vues organiques sur lancement produit."
      },
      order: 2
    },
    {
      id: "service-3",
      slug: "ugc-performance",
      title: {
        en: "UGC & Performance Creative",
        fr: "UGC & Créatifs de Performance"
      },
      tagline: {
        en: "Authentic, high-converting creator-style edits for Meta, TikTok & YouTube Shorts.",
        fr: "Montages authentiques style créateur à fort taux de conversion pour TikTok, Reels et Shorts."
      },
      description: {
        en: "Transforming raw user-generated footage and smartphone clips into polished, native-feeling social ads. Featuring trending sound design, dynamic captions, B-roll punch-ins, and fast-paced editorial rhythm that feels authentic yet persuasive.",
        fr: "Transformation de rushs bruts et séquences smartphone en publicités sociales natives et percutantes. Sous-titres dynamiques, punch-ins rythmés, transitions tendance et ambiance sonore engageante."
      },
      deliverables: {
        en: [
          "Animated subtitles with keyword highlights",
          "Visual pacing with micro-zooms and jump cuts",
          "Sound effect sweetening (whooshes, risers, pops)",
          "Split testing hook variants"
        ],
        fr: [
          "Sous-titres animés avec surbrillance des mots-clés",
          "Rythme visuel avec micro-zooms et coupes franches",
          "Habillage sonore (whooshes, impacts, pops)",
          "Variantes de hooks pour A/B testing"
        ]
      },
      tools: ["CapCut Pro", "Premiere Pro", "After Effects"],
      highlight: {
        en: "Native social feel with professional editing polish.",
        fr: "Aspect natif réseaux sociaux allié à une finition professionnelle."
      },
      order: 3
    },
    {
      id: "service-4",
      slug: "motion-graphics",
      title: {
        en: "Motion Graphics & Kinetic Typography",
        fr: "Motion Design & Typographie Cinétique"
      },
      tagline: {
        en: "Custom 2D visual assets, animated titles, UI mockups, and corporate lower-thirds.",
        fr: "Habillage 2D sur-mesure, titres animés, incrustations d'interfaces et titrages modernes."
      },
      description: {
        en: "Adding motion design energy to clarify complex concepts and elevate brand perception. From logo reveals and infographic overlays to custom lower-thirds and kinetic text sequences that hold attention.",
        fr: "Apport de dynamisme graphique pour clarifier les concepts et sublimer l'identité visuelle. Animations de logos, bandeaux titrés, infographies animées et séquences typographiques percutantes."
      },
      deliverables: {
        en: [
          "Custom animated title sequences & lower-thirds",
          "Product UI & screen mockups animation",
          "Clean logo animations and stingers",
          "Color-graded motion graphics overlays"
        ],
        fr: [
          "Titres animés personnalisés et synthés corporate",
          "Animation d'écrans et démonstrations d'interfaces",
          "Animation de logo et jingles visuels",
          "Overlays graphiques étalonnés"
        ]
      },
      tools: ["Adobe After Effects", "Illustrator", "Photoshop"],
      highlight: {
        en: "Crisp vector motion tailored to corporate and creative standards.",
        fr: "Animations vectorielles précises conformes aux chartes de marque."
      },
      order: 4
    },
    {
      id: "service-5",
      slug: "short-form-content",
      title: {
        en: "Short-Form Social Content (Reels / TikTok)",
        fr: "Formats Courts Réseaux Sociaux (Reels / TikTok)"
      },
      tagline: {
        en: "High-retention 15–60s vertical storytelling designed to drive viral distribution.",
        fr: "Formats verticaux 15–60s à haute rétention conçus pour maximiser l'algorithme."
      },
      description: {
        en: "End-to-end editing for TikTok, Instagram Reels, and YouTube Shorts. Every cut is engineered around viewer drop-off points, ensuring high average percentage viewed and strong shareability.",
        fr: "Montage de A à Z pour TikTok, Instagram Reels et YouTube Shorts. Chaque coupe est calculée pour minimiser la perte d'attention et maximiser le taux de complétion et de partage."
      },
      deliverables: {
        en: [
          "Batch editing for consistent content calendars",
          "Trend-aware sound integration & sync",
          "Hook optimization for instant retention",
          "Seamless looping edit points"
        ],
        fr: [
          "Montage par lots pour calendrier de publication régulier",
          "Intégration et synchronisation des sons tendance",
          "Optimisation du hook pour rétention immédiate",
          "Coupes de bouclage en loop parfaite"
        ]
      },
      tools: ["Premiere Pro", "CapCut", "After Effects"],
      highlight: {
        en: "Built to beat the algorithm with retention-first editing.",
        fr: "Pensé pour dompter l'algorithme grâce à une rétention maximale."
      },
      order: 5
    }
  ],

  projects: [
    {
      id: "project-1",
      slug: "mama-rahik-product-launch",
      title: {
        en: "MAMA RAHIK — Product Launch Campaign",
        fr: "MAMA RAHIK — Campagne de Lancement Produit"
      },
      shortDescription: {
        en: "High-conversion product launch advertisement that surpassed 100,000 organic views through retention-driven rhythm and punchy hook pacing.",
        fr: "Publicité de lancement de produit à fort taux de conversion ayant dépassé 100 000 vues organiques grâce à un rythme dynamique et une accroche percutante."
      },
      categories: ["ads-commercials", "ugc-performance", "social-media"],
      tags: ["E-commerce", "Premiere Pro", "After Effects", "CapCut", "Hook Pacing", "100k+ Views"],
      year: "2026",
      client: "MAMA RAHIK / Stay in Media",
      role: {
        en: "Lead Video Editor & Sound Designer",
        fr: "Monteur Vidéo Principal & Sound Designer"
      },
      format: "9:16 Vertical Reel (1080x1920)",
      aspectRatio: "9:16",
      software: ["Adobe Premiere Pro", "Adobe After Effects", "CapCut"],
      thumbnail: "/images/projects/mama-rahik-thumb.jpg",
      previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      videoProvider: "direct",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      brief: {
        en: "The brand needed to launch its flagship product into a competitive social marketplace where viewer attention drops within the first 1.5 seconds. The objective was to stop the scroll, clearly demonstrate the primary product benefit in seconds, and direct organic viewers directly to the storefront.",
        fr: "La marque devait lancer son produit phare dans un flux social ultra-concurrentiel où l'attention s'évapore en 1,5 seconde. L'objectif était de stopper le défilement, de prouver le bénéfice clé en quelques secondes et de guider les spectateurs vers la boutique en ligne."
      },
      creativeApproach: {
        rhythm: {
          en: "Cut pacing begins at 0.6 seconds per cut during the first 3 seconds, gradually expanding into a comfortable 1.2-second rhythm once the problem-solution dynamic is anchored.",
          fr: "Le rythme démarre à 0,6 seconde par plan sur les 3 premières secondes, puis se stabilise à 1,2 seconde une fois le problème-solution fermement établi."
        },
        hookStrategy: {
          en: "Visual mismatch in the opening frame followed by an immediate kinetic text headline, forcing curiosity before the user could swipe away.",
          fr: "Rupture visuelle dès la première image combinée à une typographie cinétique percutante pour susciter la curiosité avant le swipe."
        },
        visualHierarchy: {
          en: "Center-weighted product framing designed to remain unhindered by TikTok/Reels UI overlays (like buttons, comment drawer, and description).",
          fr: "Cadrage produit centré pour éviter les zones d'obstruction de l'interface TikTok et Instagram Reels (boutons like, commentaires, légende)."
        },
        captionStrategy: {
          en: "Custom styled subtitles with active word highlight matching brand palette colors, increasing mute-view comprehension.",
          fr: "Sous-titres sur mesure avec surbrillance dynamique du mot prononcé respectant la charte graphique de la marque pour le visionnage sans son."
        },
        soundDesign: {
          en: "Layered organic swooshes, sub-bass thuds on product appearance, and precise audio ducking under speech.",
          fr: "Superposition de swooshes organiques, impacts sub-bass sur les apparitions du produit et ducking précis sous la voix."
        },
        colorTreatment: {
          en: "Vibrant warm saturation boost to make the organic ingredients pop against neutral backgrounds.",
          fr: "Rehaussement chaleureux de la saturation pour faire ressortir les ingrédients naturels sur des fonds neutres."
        }
      },
      breakdowns: [
        {
          id: "hook-breakdown",
          title: {
            en: "0–3s Scroll-Stopping Hook Architecture",
            fr: "Architecture du Hook 0–3s Anti-Scroll"
          },
          type: "hook",
          content: {
            en: "By pairing an unexpected physical motion with a direct problem callout, average initial watch time jumped by 42% compared to standard static product intros.",
            fr: "En associant un mouvement physique inattendu à la formulation directe d'un problème concret, le temps de visionnage initial a augmenté de 42% par rapport aux intros classiques."
          }
        },
        {
          id: "sound-design",
          title: {
            en: "Multi-Track Foley & Sound Design",
            fr: "Sound Design Multi-Pistes & Effets Foley"
          },
          type: "sound",
          content: {
            en: "14 discrete sound effects were balanced across 4 audio tracks: whoosh transitions, packaging textures, tactile clicks, and frequency-tailored background music.",
            fr: "14 effets sonores distincts répartis sur 4 pistes audio : transitions whoosh, bruits de texture packaging, clics tactiles et musique de fond calibrée."
          }
        }
      ],
      results: {
        metrics: [
          {
            label: {
              en: "Organic Views",
              fr: "Vues Organiques"
            },
            value: "100,000+"
          },
          {
            label: {
              en: "Average Watch Retention",
              fr: "Taux de Rétention Moyen"
            },
            value: "68%"
          },
          {
            label: {
              en: "Format Optimization",
              fr: "Optimisation Format"
            },
            value: "9:16 Native"
          }
        ],
        description: {
          en: "Surpassed 100,000 organic views on launch as documented in career achievements, delivering strong brand engagement and verifiable e-commerce traffic.",
          fr: "A dépassé 100 000 vues organiques dès le lancement tel que documenté dans le parcours professionnel, générant un engagement client soutenu et du trafic qualifié."
        }
      },
      editorsNotes: {
        note: {
          en: "Notice how the cut never occurs when an action is complete; rather, each transition happens mid-motion. Cutting on action maintains forward psychological momentum and prevents the viewer from feeling a natural exit point.",
          fr: "Remarquez que la coupe n'intervient jamais quand une action est terminée, mais en plein mouvement. Couper sur l'action maintient l'élan psychologique et supprime tout point de sortie naturel."
        },
        detailThatMatters: {
          en: "The micro-zoom on the packaging text at 0:04 forces the eye to focus on the key certified organic badge without interrupting voiceover flow.",
          fr: "Le micro-zoom sur le texte du packaging à 0:04 force le regard sur le label bio certifié sans interrompre la fluidité de la voix off."
        }
      },
      featured: true,
      published: true,
      order: 1
    },
    {
      id: "project-2",
      slug: "sidepark-architectural-film",
      title: {
        en: "SidePark Residences — Architectural Showcase",
        fr: "Résidences SidePark — Film Architectural"
      },
      shortDescription: {
        en: "Cinematic promotional showcase for premium residential real estate, blending elegant architectural pacing with refined motion graphics.",
        fr: "Présentation promotionnelle cinématographique pour l'immobilier haut de gamme, alliant élégance du rythme architectural et motion design épuré."
      },
      categories: ["brand-films", "ads-commercials", "motion-graphics"],
      tags: ["Real Estate", "SenseiProd", "Premiere Pro", "After Effects", "Color Grading", "Cinematic"],
      year: "2026",
      client: "SidePark & Ajial Résidences / SenseiProd",
      role: {
        en: "Video Editor & Motion Designer",
        fr: "Monteur Vidéo & Motion Designer"
      },
      format: "16:9 4K UHD Commercial (3840x2160)",
      aspectRatio: "16:9",
      software: ["Adobe Premiere Pro", "Adobe After Effects"],
      thumbnail: "/images/projects/sidepark-thumb.jpg",
      previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      videoProvider: "direct",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      brief: {
        en: "Highlight the spatial elegance, natural light, and premium architectural finishes of the SidePark luxury residential development for prospective buyers and investors.",
        fr: "Mettre en valeur l'élégance des volumes, la lumière naturelle et les finitions haut de gamme du projet résidentiel SidePark auprès des acquéreurs et investisseurs."
      },
      creativeApproach: {
        rhythm: {
          en: "Slow, sweeping camera moves complemented by deliberate, musical match cuts on ambient string swells.",
          fr: "Mouvements de caméra amples et posés, rythmés par des match-cuts musicaux sur les envolées de cordes."
        },
        motionGraphics: {
          en: "Minimalist floor-plan annotations and typography floating in 3D camera space, integrated seamlessly without cluttering the architectural frames.",
          fr: "Titrage et annotations de plans minimalistes intégrés dans l'espace 3D sans surcharger la perspective des pièces."
        },
        colorTreatment: {
          en: "Clean architectural color grade with neutral balanced shadows, rich wood tones, and warm natural window highlights.",
          fr: "Étalonnage architectural épuré avec ombres neutres équilibrées, tons bois chaleureux et hautes lumières douces."
        }
      },
      breakdowns: [
        {
          id: "match-cuts",
          title: {
            en: "Interior-to-Exterior Spatial Match Cuts",
            fr: "Match-Cuts Spatiaux Intérieur / Extérieur"
          },
          type: "motion",
          content: {
            en: "Transitions align the leading vertical architectural lines of living spaces directly with exterior terrace garden horizons.",
            fr: "Les transitions alignent les lignes verticales maîtresses du salon avec l'horizon des jardins extérieurs."
          }
        }
      ],
      results: {
        metrics: [
          {
            label: {
              en: "Client Approval",
              fr: "Validation Client"
            },
            value: "First Cut"
          },
          {
            label: {
              en: "Resolution",
              fr: "Résolution"
            },
            value: "4K Master"
          }
        ],
        description: {
          en: "Adopted as the primary sales gallery visual presentation for the real estate group.",
          fr: "Adopté comme support visuel principal de présentation dans le bureau des ventes du groupe immobilier."
        }
      },
      editorsNotes: {
        note: {
          en: "In luxury real estate, cutting too quickly destroys the feeling of spaciousness. Letting the frame breathe communicates quality and architectural intention far better than high-frequency edits.",
          fr: "Dans l'immobilier de prestige, un montage trop rapide détruit la sensation d'espace. Laisser respirer les plans valorise les volumes et le calme bien mieux qu'un découpage frénétique."
        },
        detailThatMatters: {
          en: "The sound of gentle breeze through balcony foliage was mixed precisely at the transition between living room and exterior, providing subtle sensory immersion.",
          fr: "Le son du vent léger dans les feuillages a été mixé exactement sur la transition entre intérieur et terrasse pour renforcer l'immersion sensorielle."
        }
      },
      featured: true,
      published: true,
      order: 2
    },
    {
      id: "project-3",
      slug: "attijariwafa-bank-corporate-spot",
      title: {
        en: "Attijariwafa Bank — Institutional Brand Film",
        fr: "Attijariwafa bank — Film Institutionnel"
      },
      shortDescription: {
        en: "Prestige corporate spot combining sleek typography, rhythmic kinetic graphics, and documentary-style pacing for one of North Africa's largest banking institutions.",
        fr: "Spot institutionnel prestigieux combinant typographie moderne, graphisme cinétique rythmé et montage documentaire pour un groupe bancaire majeur."
      },
      categories: ["brand-films", "ads-commercials", "motion-graphics"],
      tags: ["Corporate", "Banking", "SenseiProd", "Premiere Pro", "After Effects", "Kinetic Typography"],
      year: "2026",
      client: "Attijariwafa bank / SenseiProd",
      role: {
        en: "Motion Designer & Video Editor",
        fr: "Motion Designer & Monteur Vidéo"
      },
      format: "16:9 Broadcast Commercial (1920x1080)",
      aspectRatio: "16:9",
      software: ["Adobe Premiere Pro", "Adobe After Effects"],
      thumbnail: "/images/projects/attijariwafa-thumb.jpg",
      previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      videoProvider: "direct",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      brief: {
        en: "Produce a reliable, modern, and forward-thinking corporate video illustrating business growth, entrepreneurial support, and digital banking innovation.",
        fr: "Concevoir un film institutionnel inspirant et moderne illustrant l'accompagnement des entrepreneurs et l'innovation bancaire numérique."
      },
      creativeApproach: {
        rhythm: {
          en: "Steady, confident tempo synchronized to a modern orchestral beat, conveying stability and forward vision.",
          fr: "Tempo régulier et assuré calé sur des pulsations orchestrales modernes, transmettant solidité et confiance."
        },
        motionGraphics: {
          en: "Precision kinetic lower-thirds and typographic cards utilizing exact brand typography and geometric line accents.",
          fr: "Bandeaux titrés et cartes typographiques cinétiques respectant rigoureusement la charte graphique et ses lignes directrices."
        }
      },
      editorsNotes: {
        note: {
          en: "Corporate videos risk feeling sterile if the human element is overshadowed by charts. We balanced financial metrics with authentic expressions of Moroccan entrepreneurs.",
          fr: "Le film corporate risque de paraître froid si les graphiques étouffent l'humain. Nous avons équilibré les données financières avec des regards authentiques d'entrepreneurs."
        },
        detailThatMatters: {
          en: "The audio transition at 0:22 ducks music completely for 0.4 seconds to let the key voiceover message ring with absolute clarity.",
          fr: "La transition audio à 0:22 coupe la musique pendant 0,4 seconde pour laisser résonner la phrase clé de la voix off avec un impact total."
        }
      },
      featured: true,
      published: true,
      order: 3
    },
    {
      id: "project-4",
      slug: "castingvoixoff-sawtia-ugc-series",
      title: {
        en: "CastingVoixOFF & Sawtia — Voice Talent UGC Series",
        fr: "CastingVoixOFF & Sawtia — Série UGC Voix Off"
      },
      shortDescription: {
        en: "Fast-paced creator UGC videos featuring voice-over artists in action, with waveform reactive graphics and high-energy social captions.",
        fr: "Vidéos UGC dynamiques mettant en scène les comédiens voix off en studio, avec animations d'ondes sonores et sous-titrage énergique."
      },
      categories: ["ugc-performance", "social-media", "motion-graphics"],
      tags: ["UGC", "Audio Visualizer", "SenseiProd", "Premiere Pro", "CapCut", "Reels"],
      year: "2026",
      client: "CastingVoixOFF & Sawtia / SenseiProd",
      role: {
        en: "UGC Video Editor & Audio Sweetener",
        fr: "Monteur Vidéo UGC & Traitement Audio"
      },
      format: "9:16 Vertical Reel (1080x1920)",
      aspectRatio: "9:16",
      software: ["Adobe Premiere Pro", "CapCut", "Adobe After Effects"],
      thumbnail: "/images/projects/sawtia-thumb.jpg",
      previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      videoProvider: "direct",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
      brief: {
        en: "Highlight the quality, versatility, and studio environment of Moroccan voice talents on media platforms CastingVoixOFF and Sawtia for casting directors and agencies.",
        fr: "Mettre en valeur le talent, la polyvalence et les coulisses des comédiens voix off sur CastingVoixOFF et Sawtia auprès des directeurs de casting."
      },
      creativeApproach: {
        soundDesign: {
          en: "Microphone isolation and noise-gate tuning to let the raw studio vocal nuances resonate crisply in headphones.",
          fr: "Isolement microphonique et calibration de porte de bruit pour faire ressortir la richesse de la voix en studio."
        },
        captionStrategy: {
          en: "Color-coded karaoke style captions highlighting emotional emphasis and vocal tone shifts.",
          fr: "Sous-titrage style karaoké coloré mettant en exergue les variations de ton et les émotions vocales."
        }
      },
      editorsNotes: {
        note: {
          en: "When the primary product is sound, the visuals must celebrate acoustics: tight closeups on studio microphones, mouth articulation, and headphones.",
          fr: "Quand le produit est la voix, le visuel doit célébrer l'acoustique : gros plans sur les micros de studio, l'articulation et les casques audio."
        },
        detailThatMatters: {
          en: "Visualizing the audio waveform subtly behind the talent created an instant visual anchor for the audio quality.",
          fr: "L'onde sonore animée discrètement derrière le comédien a créé un repère visuel immédiat pour attester de la pureté du son."
        }
      },
      featured: true,
      published: true,
      order: 4
    },
    {
      id: "project-5",
      slug: "tucoso-naza-conversion-ads",
      title: {
        en: "TUCOSO & Naza Agency — High-CTR E-commerce Ads",
        fr: "TUCOSO & Naza Agency — Publicités E-commerce Haute Conversion"
      },
      shortDescription: {
        en: "Multi-angle direct response ads engineered for online stores, testing split hooks and rapid benefit demonstration.",
        fr: "Publicités d'acquisition directe multi-angles pour boutiques e-commerce avec tests d'accroches et démonstration rapide des bénéfices."
      },
      categories: ["ads-commercials", "ugc-performance"],
      tags: ["Direct Response", "E-commerce", "Stay in Media", "TUCOSO", "Naza Agency", "High CTR"],
      year: "2026",
      client: "TUCOSO & Naza Agency / Stay in Media",
      role: {
        en: "Performance Video Editor",
        fr: "Monteur Vidéo Performance"
      },
      format: "9:16 Vertical Reel (1080x1920)",
      aspectRatio: "9:16",
      software: ["Adobe Premiere Pro", "CapCut", "After Effects"],
      thumbnail: "/images/projects/tucoso-thumb.jpg",
      previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      videoProvider: "direct",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      brief: {
        en: "Create high-converting social media creatives for partner ecommerce stores looking to decrease cost-per-acquisition (CPA) on TikTok Ads and Meta Ads.",
        fr: "Concevoir des vidéos créatives à forte conversion pour boutiques partenaires cherchant à réduire leur coût par acquisition (CPA)."
      },
      creativeApproach: {
        hookStrategy: {
          en: "Split 3 distinct 2-second hook variations (Problem-first, Shock-visual, and Direct-question) for systematic A/B media buying tests.",
          fr: "Découpage de 3 variations de hook de 2 secondes (Problème direct, Visuel surprenant, Question frontale) pour A/B testing média."
        }
      },
      editorsNotes: {
        note: {
          en: "In performance creative, an extra 0.2 seconds of dead air in the intro directly translates into a 15% drop in click-through rate. We trimmed every breath and silences to zero.",
          fr: "En publicité de performance, 0,2 seconde de blanc dans l'intro engendre 15% de baisse de clics. Nous avons coupé chaque respiration inutile."
        },
        detailThatMatters: {
          en: "The animated review star rating popping up exactly as the testimonial speaker smiles provided subconscious proof.",
          fr: "L'apparition des 5 étoiles animées au moment précis du sourire de l'utilisatrice apporte une preuve sociale immédiate."
        }
      },
      featured: false,
      published: true,
      order: 5
    }
  ],

  experiences: [
    {
      id: "exp-1",
      company: "Stay in Media",
      title: {
        en: "Freelance Video Editor for Ecommerce and Ads",
        fr: "Monteur Vidéo Freelance (E-commerce & Publicités)"
      },
      location: "Remote",
      period: "07/2026 – Present",
      responsibilities: {
        en: [
          "Created ads that bring sales for online stores and partner agencies, including TUCOSO and Naza Agency.",
          "Edited product launch videos, including MAMA RAHIK, which surpassed 100,000 organic views.",
          "Created educational and promotional medical videos for eyecare specialists and clinics."
        ],
        fr: [
          "Réalisation de publicités axées sur la conversion pour des boutiques en ligne et agences partenaires (TUCOSO, Naza Agency).",
          "Montage de vidéos de lancement produit dont MAMA RAHIK ayant dépassé 100 000 vues organiques.",
          "Création de vidéos médicales informatives et promotionnelles pour spécialistes de la vue et cliniques."
        ]
      },
      verifiedAchievement: {
        en: "MAMA RAHIK campaign achieved 100k+ organic views.",
        fr: "Campagne MAMA RAHIK ayant atteint plus de 100 000 vues organiques."
      },
      order: 1
    },
    {
      id: "exp-2",
      company: "Tagui Media",
      title: {
        en: "Videographer and Video Editor",
        fr: "Cadreur et Monteur Vidéo"
      },
      location: "Casablanca, Morocco",
      period: "09/2026 – 10/2026",
      responsibilities: {
        en: [
          "Mastered professional camera work and filmed video projects on site.",
          "Improved After Effects skills and created advanced motion graphics.",
          "Edited promotional videos and social media content for clients."
        ],
        fr: [
          "Prise en main professionnelle de la caméra et tournage de projets vidéo sur le terrain.",
          "Perfectionnement sur After Effects et création d'animations motion graphics avancées.",
          "Montage de vidéos promotionnelles et de contenus réseaux sociaux pour les clients."
        ]
      },
      order: 2
    },
    {
      id: "exp-3",
      company: "SenseiProd",
      title: {
        en: "Video Editor and Motion Designer",
        fr: "Monteur Vidéo et Motion Designer"
      },
      location: "Casablanca, Morocco",
      period: "05/2026 – 09/2026",
      responsibilities: {
        en: [
          "Created modern dynamic videos for real estate and corporate companies, including SidePark and Ajial Residences.",
          "Created advertisements and professional videos for prestigious clients, including Attijariwafa bank and Club des Dirigeants CDD.",
          "Handled full video editing and UGC content for media and voice platforms, including CastingVoixOFF and Sawtia."
        ],
        fr: [
          "Création de vidéos modernes et dynamiques pour le secteur immobilier et corporate (SidePark, Ajial Résidences).",
          "Réalisation de spots publicitaires et vidéos institutionnelles pour de grands comptes (Attijariwafa bank, Club des Dirigeants CDD).",
          "Gestion complète du montage vidéo et des contenus UGC pour plateformes médias et voix (CastingVoixOFF, Sawtia)."
        ]
      },
      order: 3
    },
    {
      id: "exp-4",
      company: "Technaps",
      title: {
        en: "Video Editor",
        fr: "Monteur Vidéo"
      },
      location: "Remote",
      period: "10/2025 – 12/2025",
      responsibilities: {
        en: [
          "Edited dynamic promotional videos and social media Reels for agency clients."
        ],
        fr: [
          "Montage de vidéos promotionnelles dynamiques et de reels pour les réseaux sociaux des clients de l'agence."
        ]
      },
      order: 4
    }
  ],

  education: [
    {
      id: "edu-1",
      institution: "LionsGeek",
      program: {
        en: "Content Creation & Media Training",
        fr: "Création de Contenu & Formation Médias"
      },
      period: "10/2025 – 05/2026",
      focusAreas: {
        en: [
          "Digital marketing",
          "Personal branding",
          "Community management",
          "Graphic design",
          "Audiovisual production"
        ],
        fr: [
          "Marketing digital",
          "Personal branding",
          "Community management",
          "Design graphique",
          "Production audiovisuelle"
        ]
      },
      order: 1
    },
    {
      id: "edu-2",
      institution: "Faculté des Sciences Juridiques, Économiques et Sociales – Mohammedia (FSJESM)",
      program: {
        en: "Bachelor Degree in International Trade",
        fr: "Licence en Commerce International"
      },
      period: "09/2023 – 07/2026",
      focusAreas: {
        en: [
          "International trade strategies",
          "Marketing and business communication",
          "Economic analysis & project management"
        ],
        fr: [
          "Stratégies du commerce international",
          "Marketing et communication d'affaires",
          "Analyse économique et gestion de projet"
        ]
      },
      order: 2
    }
  ],

  skills: [
    {
      id: "skill-group-video",
      title: {
        en: "Video Editing & Motion",
        fr: "Montage Vidéo & Motion"
      },
      skills: [
        "Adobe Premiere Pro",
        "Adobe After Effects",
        "CapCut",
        "Motion Graphics",
        "Visual Storytelling",
        "Sound Design",
        "Color Correction",
        "Camera Operation"
      ],
      order: 1
    },
    {
      id: "skill-group-digital",
      title: {
        en: "Digital & Production Tools",
        fr: "Outils Numériques & Production"
      },
      skills: [
        "Community Management",
        "Google Workspace",
        "Microsoft Excel",
        "AI Tools for Creators",
        "Visual Rhythm",
        "Multi-cam Synchronization"
      ],
      order: 2
    },
    {
      id: "skill-group-professional",
      title: {
        en: "Professional Strengths",
        fr: "Atouts Professionnels"
      },
      skills: [
        "Teamwork",
        "Good Organization",
        "Adaptability",
        "Problem Solving",
        "Fast Learning",
        "Reliable Delivery"
      ],
      order: 3
    }
  ],

  languages: [
    {
      id: "lang-ar",
      name: {
        en: "Arabic",
        fr: "Arabe"
      },
      level: {
        en: "Native language",
        fr: "Langue maternelle"
      }
    },
    {
      id: "lang-en",
      name: {
        en: "English",
        fr: "Anglais"
      },
      level: {
        en: "B2 — Professional Working Proficiency",
        fr: "B2 — Niveau Professionnel Opérationnel"
      }
    },
    {
      id: "lang-fr",
      name: {
        en: "French",
        fr: "Français"
      },
      level: {
        en: "A2 — Elementary Proficiency",
        fr: "A2 — Niveau Élémentaire"
      }
    }
  ]
};
