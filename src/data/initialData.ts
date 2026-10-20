import { Pin, Board, ActivityNotification } from "../types";

export const SCHOOL_CLASSES = [
  "Pry 4",
  "Pry 5",
  "Pry 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
];

export const INITIAL_CATEGORIES = [
  "All Classes",
  "Pry 4",
  "Pry 5",
  "Pry 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SSS 1",
  "SSS 2",
  "SSS 3",
];

export const INITIAL_COLOR_PALETTES = [
  { name: "Warm Terracotta", hex: "#C86D51" },
  { name: "Sage & Forest", hex: "#607B65" },
  { name: "Warm Ochre", hex: "#D4A373" },
  { name: "Minimal Oatmeal", hex: "#EAE2D6" },
  { name: "Raw Concrete", hex: "#8E9196" },
  { name: "Midnight Indigo", hex: "#1D2A44" },
  { name: "Deep Espresso", hex: "#3E2A20" },
  { name: "Alabaster White", hex: "#FAFAF8" },
];

export const INITIAL_COLLABORATORS = [
  {
    id: "user-elena",
    name: "Elena Rostova",
    handle: "@elena_arch",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    email: "elena.rostova@pinspire.studio",
    role: "owner" as const,
    activeNow: true,
    lastActive: "Just now",
  },
  {
    id: "user-marcus",
    name: "Marcus Vance",
    handle: "@marcus_v",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    email: "marcus.vance@pinspire.studio",
    role: "editor" as const,
    activeNow: true,
    lastActive: "5m ago",
  },
  {
    id: "user-chloe",
    name: "Chloe Fontaine",
    handle: "@chloe_design",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    email: "chloe.fontaine@pinspire.studio",
    role: "editor" as const,
    activeNow: false,
    lastActive: "23m ago",
  },
  {
    id: "user-david",
    name: "David Kim",
    handle: "@david_artisan",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    email: "david.kim@pinspire.studio",
    role: "viewer" as const,
    activeNow: true,
    lastActive: "Just now",
  },
];

export const INITIAL_PINS: Pin[] = [
  {
    id: "pin-1",
    title: "Plant Biology & Leaf Photosynthesis Guide",
    description:
      "Illustrated cross-section of leaf anatomy, chlorophyll energy absorption, and cellular gas exchange.",
    imageUrl:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "2/3",
    category: "Pry 4",
    tags: [
      "photosynthesis",
      "leaf anatomy",
      "plant science",
      "pry4",
      "chlorophyll",
      "botany",
    ],
    dominantColor: { name: "Botanical Green", hex: "#406343" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    featured: true,
    savedCount: 1420,
    likesCount: 384,
    likedByUser: false,
    isFavourite: true,
    createdAt: "2026-10-12T09:30:00Z",
    comments: [],
    aiAnalysis: {
      aestheticVibe: "Primary Botanical Science",
      suggestedTags: ["photosynthesis", "nature study", "leaf cells", "pry 4"],
      dominantColors: [
        { name: "Forest Green", hex: "#2F4F2F" },
        { name: "Leaf Lime", hex: "#8FBC8F" },
        { name: "Earth Ochre", hex: "#D2B48C" },
      ],
      recognizedSubjects: ["Plant Leaf", "Cellular Photosynthesis Diagram"],
      category: "Pry 4",
      confidenceScore: 0.98,
    },
  },
  {
    id: "pin-2",
    title: "Introductory Algebra & Number Sequences",
    description:
      "Visual study on linear algebraic balance, unknown variables, and geometric number patterns.",
    imageUrl:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "3/4",
    category: "JSS 1",
    tags: [
      "algebra",
      "mathematics",
      "jss1",
      "equations",
      "variables",
      "number patterns",
    ],
    dominantColor: { name: "Graphite Slate", hex: "#2B2D42" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    featured: true,
    savedCount: 890,
    likesCount: 247,
    likedByUser: true,
    isFavourite: true,
    createdAt: "2026-10-13T14:15:00Z",
    comments: [],
    aiAnalysis: {
      aestheticVibe: "Mathematical Logic Study",
      suggestedTags: ["algebra", "equations", "jss 1", "maths"],
      dominantColors: [
        { name: "Midnight Navy", hex: "#1D2A44" },
        { name: "Gold Accent", hex: "#E0A96D" },
      ],
      recognizedSubjects: ["Algebraic Equations", "Geometric Graphs"],
      category: "JSS 1",
      confidenceScore: 0.96,
    },
  },
  {
    id: "pin-3",
    title: "Periodic Table of Elements & Atomic Shells",
    description:
      "High-contrast graphic representation of noble gases, alkali metals, and electron valence orbits.",
    imageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "2/3",
    category: "JSS 2",
    tags: [
      "chemistry",
      "periodic table",
      "jss2",
      "atomic structure",
      "electrons",
      "basic science",
    ],
    dominantColor: { name: "Cyan Glow", hex: "#0077B6" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 2310,
    likesCount: 512,
    likedByUser: false,
    createdAt: "2026-10-10T11:00:00Z",
    comments: [],
    aiAnalysis: {
      aestheticVibe: "Scientific Laboratory Aesthetics",
      suggestedTags: ["periodic table", "chemistry", "atoms", "jss 2"],
      dominantColors: [
        { name: "Cyan Blue", hex: "#0077B6" },
        { name: "Pure White", hex: "#FFFFFF" },
      ],
      recognizedSubjects: ["Periodic Table", "Atomic Shells"],
      category: "JSS 2",
      confidenceScore: 0.99,
    },
  },
  {
    id: "pin-4",
    title: "Earth Water Cycle & Atmospheric Condensation",
    description:
      "Comprehensive diagram illustrating evaporation, transpiration, condensation, and freshwater precipitation.",
    imageUrl:
      "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "1/1",
    category: "Pry 5",
    tags: [
      "water cycle",
      "geography",
      "pry5",
      "atmosphere",
      "precipitation",
      "weather",
    ],
    dominantColor: { name: "Atmosphere Azure", hex: "#4895EF" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 740,
    likesCount: 198,
    likedByUser: true,
    isFavourite: true,
    createdAt: "2026-10-11T16:20:00Z",
    comments: [],
  },
  {
    id: "pin-5",
    title: "Pythagorean Theorem & Right-Angled Triangles",
    description:
      "Geometric visual proof of a² + b² = c² with square area representations and trigonometric ratios.",
    imageUrl:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "3/4",
    category: "JSS 3",
    tags: [
      "pythagoras",
      "geometry",
      "jss3",
      "triangles",
      "mathematics",
      "trigonometry",
    ],
    dominantColor: { name: "Math Chalkboard", hex: "#2A3439" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 1120,
    likesCount: 310,
    likedByUser: false,
    createdAt: "2026-10-09T08:45:00Z",
    comments: [],
  },
  {
    id: "pin-6",
    title: "Newtonian Mechanics & Gravitational Vectors",
    description:
      "Dynamics of force, acceleration, and friction vectors analyzed in free body diagrams for physics students.",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "2/3",
    category: "SSS 1",
    tags: [
      "physics",
      "mechanics",
      "sss1",
      "vectors",
      "newton laws",
      "kinematics",
    ],
    dominantColor: { name: "Cosmic Blue", hex: "#0B3C5D" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 1640,
    likesCount: 420,
    likedByUser: false,
    createdAt: "2026-10-12T18:00:00Z",
    comments: [],
  },
  {
    id: "pin-7",
    title: "Human Circulatory & Respiratory Systems Model",
    description:
      "3D rendering of cardiopulmonary circulation, heart ventricles, oxygenation, and systemic arterial flow.",
    imageUrl:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "2/3",
    category: "Pry 6",
    tags: [
      "biology",
      "human anatomy",
      "heart",
      "pry6",
      "science",
      "circulation",
    ],
    dominantColor: { name: "Crimson Heart", hex: "#B80000" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 3180,
    likesCount: 890,
    likedByUser: true,
    isFavourite: true,
    createdAt: "2026-10-08T10:10:00Z",
    comments: [],
  },
  {
    id: "pin-8",
    title: "Electromagnetic Spectrum & Wave Optics",
    description:
      "Wavelength spectrum ranging from radio to gamma radiation, photon frequencies, and prism refraction indices.",
    imageUrl:
      "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "16/9",
    category: "SSS 2",
    tags: [
      "physics",
      "electromagnetism",
      "sss2",
      "optics",
      "waves",
      "light spectrum",
    ],
    dominantColor: { name: "Prism Violet", hex: "#480CA8" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 940,
    likesCount: 280,
    likedByUser: false,
    createdAt: "2026-10-07T12:00:00Z",
    comments: [],
  },
  {
    id: "pin-9",
    title: "Organic Chemistry: Hydrocarbons & Reaction Mechanisms",
    description:
      "Alkanes, alkenes, benzene rings, IUPAC nomenclature, and electrophilic substitution mechanisms for senior exams.",
    imageUrl:
      "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "3/4",
    category: "SSS 3",
    tags: [
      "organic chemistry",
      "hydrocarbons",
      "sss3",
      "benzene",
      "waec",
      "molecules",
    ],
    dominantColor: { name: "Amber Reaction", hex: "#F77F00" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 620,
    likesCount: 175,
    likedByUser: false,
    createdAt: "2026-10-06T15:30:00Z",
    comments: [],
  },
  {
    id: "pin-10",
    title: "Solar System & Planetary Scale Guide",
    description:
      "Orbital distances, terrestrial vs gas giants, and satellite planetary rings for primary learners.",
    imageUrl:
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "2/3",
    category: "Pry 4",
    tags: ["solar system", "planets", "pry4", "space", "science", "astronomy"],
    dominantColor: { name: "Deep Space", hex: "#0B0C10" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 2890,
    likesCount: 650,
    likedByUser: false,
    createdAt: "2026-10-05T09:15:00Z",
    comments: [],
  },
  {
    id: "pin-11",
    title: "Fractions & Proportions Geometric Chart",
    description:
      "Visual circle and bar partitions explaining equivalent fractions, decimals, and percentage equivalencies.",
    imageUrl:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "1/1",
    category: "Pry 5",
    tags: ["fractions", "math", "pry5", "geometry", "arithmetic", "decimals"],
    dominantColor: { name: "Golden Chalk", hex: "#E9C46A" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 820,
    likesCount: 215,
    likedByUser: false,
    createdAt: "2026-10-04T17:40:00Z",
    comments: [],
  },
  {
    id: "pin-12",
    title: "Microbial Ecology: Bacteria, Fungi & Protozoa",
    description:
      "Stained microscopic study showing cellular membrane morphology, binary fission, and unicellular life.",
    imageUrl:
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "3/4",
    category: "Pry 6",
    tags: [
      "microbiology",
      "cells",
      "pry6",
      "microscope",
      "bacteria",
      "science",
    ],
    dominantColor: { name: "Microscope Teal", hex: "#2A9D8F" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 1190,
    likesCount: 340,
    likedByUser: false,
    createdAt: "2026-10-03T11:25:00Z",
    comments: [],
  },
  {
    id: "pin-13",
    title: "Cellular Mitosis & Genetic DNA Double Helix",
    description:
      "Stages of cellular division from prophase to cytokinesis alongside nucleotide adenine-thymine base pairs.",
    imageUrl:
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "2/3",
    category: "SSS 2",
    tags: ["genetics", "dna", "sss2", "mitosis", "biology", "chromosomes"],
    dominantColor: { name: "Emerald Gene", hex: "#2E8B57" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 1540,
    likesCount: 460,
    likedByUser: false,
    createdAt: "2026-10-02T10:00:00Z",
    comments: [],
  },
  {
    id: "pin-14",
    title: "Differential Calculus & Tangent Limit Curves",
    description:
      "Graphing first and second derivatives, stationary inflection points, and rate of change proofs.",
    imageUrl:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "3/4",
    category: "SSS 3",
    tags: [
      "calculus",
      "derivatives",
      "sss3",
      "advanced math",
      "limits",
      "waec",
    ],
    dominantColor: { name: "Slate Blue", hex: "#3D5A80" },
    author: {
      name: "School Admin",
      handle: "@peterotunuya",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "admin",
    },
    curatedByAdmin: true,
    savedCount: 2100,
    likesCount: 620,
    likedByUser: true,
    isFavourite: true,
    createdAt: "2026-10-01T15:30:00Z",
    comments: [],
  },
];

export const INITIAL_BOARDS: Board[] = [
  {
    id: "board-1",
    title: "Warm Minimalist Interiors & Plaster",
    description:
      "Curated spatial moods with tactile materials, limewash walls, and natural diffused light for our European project.",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    pinIds: ["pin-1", "pin-3", "pin-5", "pin-7"],
    category: "Interior & Furniture",
    isSecret: false,
    isCollaborative: true,
    collaborators: [
      INITIAL_COLLABORATORS[0], // Elena (owner)
      INITIAL_COLLABORATORS[1], // Marcus (editor)
      INITIAL_COLLABORATORS[2], // Chloe (editor)
    ],
    activityFeed: [
      {
        id: "act-1",
        userName: "Elena Rostova",
        userAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        action: "added_pin",
        targetTitle: "Sculptural Curved Limewash Staircase",
        timestamp: "12m ago",
      },
      {
        id: "act-2",
        userName: "Marcus Vance",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        action: "added_pin",
        targetTitle: "Mid-Century Teak Lounge Chair",
        timestamp: "1h ago",
      },
      {
        id: "act-3",
        userName: "Chloe Fontaine",
        userAvatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        action: "joined_board",
        targetTitle: "Warm Minimalist Interiors",
        timestamp: "Yesterday",
      },
    ],
    updatedAt: "2026-10-14T12:30:00Z",
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "board-2",
    title: "Modernist Swiss Typographic Identity",
    description:
      "Grid systems, brutalist sans-serif layouts, and vibrant chromatic contrast for upcoming branding launch.",
    coverImage:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80",
    pinIds: ["pin-2", "pin-9"],
    category: "Graphic Design & Typography",
    isSecret: false,
    isCollaborative: true,
    collaborators: [
      INITIAL_COLLABORATORS[1], // Marcus
      INITIAL_COLLABORATORS[2], // Chloe
      INITIAL_COLLABORATORS[3], // David
    ],
    activityFeed: [
      {
        id: "act-4",
        userName: "Chloe Fontaine",
        userAvatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        action: "added_pin",
        targetTitle: "Swiss Typographic Poster Study in Vermilion",
        timestamp: "2h ago",
      },
    ],
    updatedAt: "2026-10-13T16:00:00Z",
    createdAt: "2026-10-02T14:00:00Z",
  },
  {
    id: "board-3",
    title: "Tactile Objects & Ceramic Sculptures",
    description:
      "Wheel-thrown stoneware, terracotta forms, and organic tableware with rough textured glazes.",
    coverImage:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80",
    pinIds: ["pin-4", "pin-11", "pin-12"],
    category: "Product & Industrial Design",
    isSecret: false,
    isCollaborative: false,
    collaborators: [INITIAL_COLLABORATORS[0]],
    activityFeed: [
      {
        id: "act-5",
        userName: "Elena Rostova",
        userAvatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        action: "created_board",
        targetTitle: "Tactile Objects & Ceramic Sculptures",
        timestamp: "3 days ago",
      },
    ],
    updatedAt: "2026-10-11T16:30:00Z",
    createdAt: "2026-10-05T08:00:00Z",
  },
  {
    id: "board-4",
    title: "Brutalist Concrete & Forest Escapes",
    description:
      "Monolithic architecture embedded in raw nature, mossy stones, and pine canopies.",
    coverImage:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    pinIds: ["pin-8", "pin-10"],
    category: "Architecture & Living",
    isSecret: false,
    isCollaborative: true,
    collaborators: [INITIAL_COLLABORATORS[0], INITIAL_COLLABORATORS[3]],
    activityFeed: [
      {
        id: "act-6",
        userName: "David Kim",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        action: "added_pin",
        targetTitle: "Brutalist Concrete Pavilion in Dense Pine Forest",
        timestamp: "4h ago",
      },
    ],
    updatedAt: "2026-10-14T09:00:00Z",
    createdAt: "2026-10-06T11:00:00Z",
  },
];

export const INITIAL_NOTIFICATIONS: ActivityNotification[] = [
  {
    id: "notif-1",
    type: "invite",
    title: "Collaborative Board Invitation",
    message:
      'Marcus Vance invited you to collaborate on "Warm Minimalist Interiors & Plaster" as an Editor.',
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    timestamp: "4m ago",
    read: false,
    boardId: "board-1",
    actionLabel: "View Shared Board",
  },
  {
    id: "notif-2",
    type: "pin_saved",
    title: "Pin Added to Shared Board",
    message:
      'Elena added "Sculptural Curved Limewash Staircase" to your collaborative board.',
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    timestamp: "18m ago",
    read: false,
    pinId: "pin-1",
    boardId: "board-1",
    actionLabel: "Inspect Pin",
  },
  {
    id: "notif-3",
    type: "comment",
    title: "New Discussion Comment",
    message:
      'David Kim commented: "The joinery in that armrest is sublime. Adding to our concept!"',
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    timestamp: "2h ago",
    read: true,
    pinId: "pin-7",
    actionLabel: "Reply",
  },
  {
    id: "notif-4",
    type: "trending",
    title: "AI Aesthetic Trend Alert",
    message:
      '"Warm Brutalism & Limewash" is surging by +180% saves across design studios this week.',
    avatar:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=200&q=80",
    timestamp: "5h ago",
    read: true,
    actionLabel: "Explore Trend",
  },
];
