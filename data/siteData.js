export const clinicInfo = {
  name: 'Abid Hearing Care Centre',
  shortName: 'AHCC',
  tagline: 'Hearing means quality of life — Make better living',
  subtagline: 'Leading audiology and digital hearing aid fitting clinic in Bangladesh since 2014.',
  estYear: 2014,
  experienceYears: 10,
  happyPatients: '10,000+',
  address: {
    line1: 'Oasis Complex, House-59, Sonargaon Janapath Road (1st Floor)',
    line2: 'Sector-7, Uttara, Dhaka-1230, Bangladesh',
    short: 'Sector-7, Uttara, Dhaka-1230'
  },
  phones: [
    { display: '0177 123 77 40', raw: '01771237740', primary: true },
    { display: '0171 51 90901', raw: '01715190901', primary: false }
  ],
  landline: '+8802-48961612',
  whatsapp: '8801771237740',
  emails: ['abidhearing@gmail.com', 'info@abidhearing.com'],
  hours: {
    regular: 'Saturday – Thursday: 10:00 AM – 8:00 PM',
    friday: 'Friday: By appointment only'
  },
  googleMapsUrl: 'https://maps.google.com/maps?q=Abid+Hearing+Care+Center+Sector+7+Uttara+Dhaka&hl=en&z=16&output=embed',
  social: {
    facebook: 'https://facebook.com/abidhearing',
    whatsapp: 'https://wa.me/8801771237740'
  }
};

export const navItems = [
  { label: 'Home', url: '/' },
  {
    label: 'Hearing Aids',
    url: '/hearing-aid',
    children: [
      { label: 'Hearing Aids Overview', url: '/hearing-aid' },
      { label: 'Hearing Aids Style', url: '/hearing-aids-style' },
      { label: 'How do Hearing Aids Work', url: '/how-do-hearing-aid-work' },
      { label: 'Hearing Aids for Children', url: '/hearing-aid-for-children' },
      { label: 'Hearing Aid Brands in Bangladesh', url: '/hearing-aid-brand-in-bangladesh' }
    ]
  },
  { label: 'Products', url: '/products' },
  { label: 'Services', url: '/services' },
  { label: 'Photo Gallery', url: '/photo-gallery' },
  {
    label: 'Others',
    url: '/about-us',
    children: [
      { label: 'About Us', url: '/about-us' },
      { label: 'Management & Team', url: '/management' },
      { label: 'NGO Affiliations', url: '/affiliation' },
      { label: 'Hearing Test', url: '/hearing-test' }
    ]
  },
  { label: 'Blog', url: '/blog' },
  { label: 'Contact Us', url: '/contact-us' }
];

export const services = [
  {
    id: 'hearing-test',
    icon: '🎧',
    title: 'Diagnostic Hearing Evaluations',
    shortDesc: 'A clear picture of how well you hear with ISO-standard audiometry.',
    description: 'We perform comprehensive diagnostic tests to determine the exact type, degree, and frequency configuration of hearing loss. Testing is conducted in a sound-treated booth with calibrated clinical audiometers.',
    tests: [
      'Pure Tone Audiometry (PTA) — Air & bone conduction testing',
      'Auditory Brainstem Response (ABR / BERA) for neuro-audiology and infants',
      'Auditory Steady-State Response (ASSR) for frequency-specific thresholds',
      'Otoacoustic Emissions (OAE) for infant cochlear screening',
      'Tympanometry & Acoustic Reflex testing for middle ear health'
    ]
  },
  {
    id: 'hearing-aids',
    icon: '🦻',
    title: 'Hearing Aid Selection & Digital Fitting',
    shortDesc: 'World-class digital hearing aids matched to your hearing, lifestyle, and budget.',
    description: 'Using computerized prescription target fitting software, our clinical audiologists precisely map hearing device amplification curves to your pure-tone audiogram. Real-ear measurement ensures comfortable loudness.',
    tests: [
      'Target gain curve computer programming',
      'Feedback cancellation and adaptive noise reduction configuration',
      'Bluetooth audio streaming pairing for Android and Apple iOS devices',
      'Free 30-day follow-up adaptation sessions'
    ]
  },
  {
    id: 'ear-mould',
    icon: '🧪',
    title: 'Custom Ear Mould & Shell Laboratory',
    shortDesc: 'Custom-crafted medical grade silicone & acrylic ear moulds for acoustic comfort.',
    description: 'Our in-house acoustic earmould laboratory fabricates tailor-made earmoulds and custom hearing aid shells based on deep ear canal 3D silicone impressions.',
    tests: [
      'Ultra-soft medical silicone moulds for pediatric high-power devices',
      'Hard acrylic moulds for longevity and easy geriatric insertion',
      'Micro-shell custom fabrication for Completely-in-Canal (CIC) invisible devices',
      'Custom swim plugs and musician hearing protection filters'
    ]
  },
  {
    id: 'servicing',
    icon: '🔧',
    title: 'Repairing & Technical Servicing',
    shortDesc: 'Full maintenance workshop to keep your hearing devices at peak acoustic performance.',
    description: 'Equipped with precision soldering and diagnostic acoustic analyzers to inspect, service, clean, and repair all major brands including Phonak, Rexton, Signia, Unitron, Widex, and Oticon.',
    tests: [
      'Speaker/Receiver replacement & harmonic distortion repair',
      'Microphone mesh cleaning and moisture extraction',
      'Deep ultrasonic vac-cleaning & wax removal',
      'Battery door, volume rocker, and casing shell refurbishing'
    ]
  },
  {
    id: 'accessories',
    icon: '🔋',
    title: 'Accessories & Batteries Supply',
    shortDesc: 'Zinc-air batteries (Sizes 10, 13, 312, 675), wax filters, dehumidifiers, remotes.',
    description: 'Genuine clinical accessories to maintain your device longevity. We stock imported German/Swiss zinc-air long-life batteries, drying capsules, desiccant pucks, wax filters, and Roger wireless assistive systems.',
    tests: [
      'Rexton & Rayovac zinc-air batteries (Size 10, Size 312, Size 13, Size 675)',
      'CeruStop wax guards & cleaning brush kits',
      'Roger Table Mic II, Roger On wireless classroom microphones',
      'Phonak TV Connector & Wireless Remote Controls'
    ]
  },
  {
    id: 'tinnitus',
    icon: '🔔',
    title: 'Tinnitus Evaluation & Relief',
    shortDesc: 'Clinical masking and habituation therapy for ringing and buzzing in the ears.',
    description: 'Specialized counseling and acoustic sound therapy tailored for individuals suffering from tinnitus (ringing, buzzing, whistling in ears). Modern digital hearing aids feature built-in broadband white-noise sound generators to desensitize the brain.',
    tests: [
      'Tinnitus pitch & loudness matching',
      'Sound therapy habituation protocols',
      'Programmable notch therapy & ocean wave maskers',
      'Preventive acoustic protection counseling'
    ]
  }
];

export const leadership = [
  {
    name: 'Mohammad Haidar Ali',
    role: 'Founder & Lead Audiologist',
    credentials: 'Clinical Competence in Audiology (CCA)',
    experience: '12+ Years Experience in Diagnostic Audiology & Digital Fitting',
    bio: 'Dedicated to ethical, patient-centered hearing healthcare in Bangladesh. Specializes in complex pediatric hearing fittings, bone-conduction systems, and audiological diagnostics.'
  },
  {
    name: 'Md. Abu Bakar',
    role: 'Head of Human Resources (HR)',
    credentials: 'M.Com, HRM Specialist',
    bio: 'Oversees clinic organizational efficiency, continuing clinical education, and patient care standards.'
  },
  {
    name: 'Md. Abdul Rahim',
    role: 'HR Manager & Clinic Operations',
    credentials: 'Clinic Administration',
    bio: 'Manages patient appointments, diagnostic scheduling, and clinical protocol implementation.'
  },
  {
    name: 'Md. Rukun Uddin',
    role: 'Head of Finance & Procurement',
    credentials: 'Financial Administration',
    bio: 'Oversees genuine device procurement directly from authorized Swiss & German manufacturers.'
  },
  {
    name: 'Md. Jaker Hossin Raju',
    role: 'Head of Marketing & Outreach',
    credentials: 'Public Health Communications',
    bio: 'Leads community hearing screening drives and educational awareness partnerships across Bangladesh.'
  },
  {
    name: 'Md. Rezaul Karim',
    role: 'Marketing & Patient Relations Officer',
    credentials: 'Patient Advocacy Specialist',
    bio: 'Coordinates NGO community programs, remote patient follow-ups, and regional clinic camps.'
  },
  {
    name: 'Md. Abul Kalam Azad',
    role: 'Marketing & Hospital Liaison Officer',
    credentials: 'Medical Networks Specialist',
    bio: 'Liaises with ENT departments, pediatric clinics, and neurology hospitals across Dhaka.'
  }
];

export const affiliations = [
  {
    name: 'SEDAD • Dhaka',
    fullName: 'Socio-economic Development Association for Disabled',
    authority: 'Registered under NGO Affairs Bureau, Government of Bangladesh',
    desc: 'Collaborating to sponsor hearing aids and pediatric testing for underprivileged children.'
  },
  {
    name: 'DWDO • Dhaka',
    fullName: 'Disabled Women Development Organization',
    authority: 'Registered under NGO Affairs Bureau, Government of Bangladesh',
    desc: 'Empowering hearing-impaired women through accessible hearing health and free counseling.'
  },
  {
    name: 'PKS • Jessore',
    fullName: 'Protibondhi Kollyan Somiti',
    authority: 'Registered under Ministry of Social Welfare',
    desc: 'Regional mobile audiology camps and diagnostic screening in southwestern Bangladesh.'
  },
  {
    name: 'DMWDO • Magura',
    fullName: 'Magura Women Disabled Organization',
    authority: 'Registered under Ministry of Social Welfare',
    desc: 'Rural community hearing screening drives and hearing aid battery distribution.'
  },
  {
    name: 'UPS • Dinajpur',
    fullName: 'Uttaran Protibondhi Songstha',
    authority: 'Registered with Ministry of Social Welfare',
    desc: 'Northern Bangladesh hearing outreach and school screening programs.'
  }
];

export const brands = [
  {
    name: 'Phonak',
    country: 'Switzerland (Sonova Group)',
    badge: 'Flagship Clinical Partner',
    desc: 'The global market leader in pediatric audiology, AutoSense OS 5.0, Roger wireless technology, and high-power Naída & Audéo instruments.',
    features: ['Direct iOS/Android streaming', 'Roger wireless integration', 'Waterproof Audéo Life', 'Pediatric Sky Marvel']
  },
  {
    name: 'Rexton',
    country: 'Germany (WS Audiology)',
    badge: 'German Precision Engineering',
    desc: 'World-renowned for durability, moisture-repellent casing, high-gain analog trimmers, and reliable rechargeable platforms.',
    features: ['Rugged housing', 'SpeechBeam directional microphones', 'Affordable BTE models', 'Long battery life']
  },
  {
    name: 'Unitron',
    country: 'Canada (Sonova Group)',
    badge: 'Natural Conversation Technology',
    desc: 'Engineered for exceptional conversational clarity in noisy social environments like weddings, family dinners, and conferences.',
    features: ['Discover Next sound engine', 'FLEX:UPGRADE technology', 'Rechargeable options', 'Comfort-focused domes']
  },
  {
    name: 'Signia (Siemens)',
    country: 'Germany',
    badge: 'Dual Processor Innovation',
    desc: 'Known for Augmented Xperience (AX) dual-processor architecture separating speech from ambient sound for effortless clarity.',
    features: ['Own Voice Processing (OVP)', 'Acoustic-motion sensors', 'Signia Assistant AI', 'Ultra-slim designs']
  }
];

export const stylesList = [
  {
    code: 'BTE',
    title: 'Behind-The-Ear (BTE)',
    image: '/images/abid-phonak-naida-ultra-power-bte-hearing-aid-uttara-dhaka.png',
    bestFor: 'Mild to Profound Hearing Loss · All Ages & Children',
    desc: 'The core electronics reside comfortably in a case behind the ear, delivering sound through a clear acoustic hook and custom earmould. Offers maximal amplification power, long battery life, and tamperproof child-safe doors.'
  },
  {
    code: 'RIC',
    title: 'Receiver-In-Canal (RIC / RITE)',
    image: '/images/abid-phonak-naida-rechargeable-bte-hearing-aid-dhaka-bangladesh.webp',
    bestFor: 'Mild to Severe Hearing Loss · Most Popular Adult Style',
    desc: 'The speaker is positioned directly inside the ear canal connected by an ultra-thin clear wire. Provides the most natural sound experience with minimal occlusion and virtually invisible cosmetics.'
  },
  {
    code: 'ITE',
    title: 'In-The-Ear (ITE)',
    image: '/images/abid-phonak-virto-custom-in-the-ear-hearing-aid-dhaka-bangladesh.jpg',
    bestFor: 'Mild to Severe Hearing Loss · Easy Handling',
    desc: 'Custom-built from an impression of your ear to fill the outer ear concha. Larger size makes battery changes and manual volume wheel controls easy for individuals with reduced finger dexterity.'
  },
  {
    code: 'CIC / IIC',
    title: 'Completely-In-Canal (CIC) & Invisible (IIC)',
    image: '/images/abid-completely-in-canal-cic-invisible-hearing-aid-bangladesh.jpg',
    bestFor: 'Mild to Moderately Severe Loss · Maximum Discretion',
    desc: 'Molded custom to sit deep within the ear canal. Virtually undetectable to onlookers. Uses the natural acoustic pinna of the human ear for realistic spatial localization.'
  }
];

export const blogPosts = [
  {
    slug: 'signs-of-hearing-loss-and-when-to-act',
    title: '7 Early Signs of Hearing Loss and Why You Shouldn’t Wait 10 Years',
    date: 'October 2026',
    readTime: '4 min read',
    category: 'Hearing Health',
    excerpt: 'Studies show patients wait 7-10 years on average before addressing hearing difficulties. Learn the subtle early signs and why early audiological intervention protects cognitive brain health.',
    content: `
      <p>Hearing loss rarely happens overnight. In the vast majority of adults, it creeps in gradually over years. Often, family members notice you asking "What?" or turning up the television volume long before you realize anything is wrong.</p>
      <h3>The Most Common Early Warning Signs</h3>
      <ul>
        <li><strong>Consonant confusion:</strong> You can hear that people are speaking, but words sound muffled or unclear (especially high-frequency sounds like 's', 'f', 'th', 'p').</li>
        <li><strong>Difficulty in noisy rooms:</strong> In restaurants, family dawat, or traffic noise, following a conversation requires intense mental exhaustion.</li>
        <li><strong>Frequent TV volume complaints:</strong> Others comment that your TV, radio, or phone volume is uncomfortably loud.</li>
        <li><strong>Tinnitus (Ringing in the ear):</strong> Persistent whistling, buzzing, or humming sounds often indicate damaged hair cells in the cochlea.</li>
        <li><strong>Feeling drained after meetings:</strong> Straining to read lips and piece together sentences causes auditory fatigue.</li>
      </ul>
      <h3>Why Waiting Harms Brain Health</h3>
      <p>When the brain is deprived of clear sound inputs, the auditory cortex undergoes cognitive atrophy. Modern medical research confirms a strong correlation between untreated hearing loss and accelerated cognitive decline. Booking a simple 20-minute pure tone audiometry test gives you clear answers.</p>
    `
  },
  {
    slug: 'pediatric-hearing-care-speech-development',
    title: 'Pediatric Hearing Care: Why Early Detection Shapes a Child’s Speech & Future',
    date: 'October 2026',
    readTime: '5 min read',
    category: 'Pediatric Audiology',
    excerpt: 'Hearing is the gateway to spoken language. Discover how newborn OAE/BERA screening and pediatric hearing aids empower children to achieve normal speech milestones.',
    content: `
      <p>From the moment a baby is born, their brain is hardwired to absorb spoken phonemes from parents and surroundings. If hearing loss goes undetected during infancy, speech development, vocabulary acquisition, and scholastic learning are drastically impacted.</p>
      <h3>How to Spot Hearing Delay in Infants & Toddlers</h3>
      <ul>
        <li>Does not startle at loud sudden noises (door slamming, clapping) at 0–3 months.</li>
        <li>Does not turn their head toward mother’s voice by 6 months.</li>
        <li>Does not babble syllables like "ba-ba", "ma-ma" by 9–12 months.</li>
        <li>Seems inattentive or struggles to follow simple spoken commands in school.</li>
      </ul>
      <h3>Specialized Pediatric Hearing Devices</h3>
      <p>Children require unique hearing aids like the <strong>Phonak Sky Marvel</strong> line. These include tamperproof battery drawers to prevent battery swallowing, bright visual LED status indicators, water-resistant IP68 nano-coating, and Roger wireless FM compatibility for school classrooms.</p>
    `
  },
  {
    slug: 'hearing-aid-maintenance-cleaning-guide',
    title: 'How to Care for Your Hearing Aids in Bangladesh’s Humid Climate',
    date: 'October 2026',
    readTime: '3 min read',
    category: 'Care & Maintenance',
    excerpt: 'Humidity, sweat, and earwax are the top enemies of delicate microelectronics. Follow our clinical audiologist’s daily maintenance checklist.',
    content: `
      <p>Bangladesh’s hot and humid tropical climate poses unique challenges for delicate miniature hearing aids. Sweat, atmospheric moisture, and natural earwax can clog sound bores and corrode battery contacts if not properly maintained.</p>
      <h3>Daily Care Checklist</h3>
      <ol>
        <li><strong>Nightly Drying:</strong> Always open the battery door at night and place your hearing aids inside a dehumidifier drying box with active desiccant capsules.</li>
        <li><strong>Clean Earwax Daily:</strong> Use the provided wax brush to gently wipe the receiver dome or earmould sound outlet before inserting it into your ear.</li>
        <li><strong>Avoid Direct Water & Chemicals:</strong> Never wear your hearing aids in the shower, swimming pool, or while applying hairspray or face creams.</li>
        <li><strong>Use Genuine Zinc-Air Batteries:</strong> Always remove the sticky protective tab and wait 1 full minute for oxygen activation before closing the battery door.</li>
      </ol>
      <p>If you experience weak volume or distorted sound, visit Abid Hearing Care Centre in Uttara for complimentary ultrasonic vacuum cleaning and diagnostic checks.</p>
    `
  }
];

export const hearingQuizQuestions = [
  {
    id: 1,
    question: 'Do you frequently ask people to repeat themselves, especially in group conversations?',
    options: [
      { text: 'Rarely or Never', score: 0 },
      { text: 'Sometimes (in noisy places)', score: 1 },
      { text: 'Frequently or Always', score: 2 }
    ]
  },
  {
    id: 2,
    question: 'Do family members complain that your television or mobile phone volume is too loud?',
    options: [
      { text: 'Never, volume is normal', score: 0 },
      { text: 'Occasionally on certain programs', score: 1 },
      { text: 'Yes, they frequently ask me to turn it down', score: 2 }
    ]
  },
  {
    id: 3,
    question: 'Do you feel mentally exhausted or drained after social gatherings or dinner parties?',
    options: [
      { text: 'No, listening feels effortless', score: 0 },
      { text: 'Sometimes when multiple people talk at once', score: 1 },
      { text: 'Yes, concentrating to follow conversations is exhausting', score: 2 }
    ]
  },
  {
    id: 4,
    question: 'Do you experience persistent ringing, whistling, or buzzing sounds in either ear (Tinnitus)?',
    options: [
      { text: 'No, never', score: 0 },
      { text: 'Occasionally in complete silence', score: 1 },
      { text: 'Yes, frequently or constantly', score: 2 }
    ]
  },
  {
    id: 5,
    question: 'Do words sound muffled, as if people are mumbling or missing consonant sounds (s, th, f)?',
    options: [
      { text: 'No, speech is crisp and clear', score: 0 },
      { text: 'Sometimes with children or soft voices', score: 1 },
      { text: 'Yes, very frequently', score: 2 }
    ]
  }
];

export const galleryItems = [
  {
    id: 1,
    title: 'Diagnostic Audiometric Evaluation & Pure Tone Testing',
    category: 'Services',
    caption: 'Computerized pure-tone audiometry and frequency threshold testing in our calibrated sound-treated booth.',
    image: '/images/abid-diagnostic-audiometry-evaluation-dhaka-bangladesh.jpg'
  },
  {
    id: 2,
    title: 'Uttara Head Office Clinic & Patient Lounge',
    category: 'Clinics',
    caption: 'Oasis Complex, House-59, Sector-7, Uttara, Dhaka — providing modern audiology diagnostics since 2014.',
    image: '/images/abid-hearing-care-centre-clinic-dhaka-bangladesh.webp'
  },
  {
    id: 3,
    title: 'Personalized Digital Hearing Aid Fitting',
    category: 'Patient Care',
    caption: 'Expert audiology consultation ensuring optimal speech clarity, custom prescription target gain, and comfortable fit.',
    image: '/images/abid-digital-hearing-aid-fitting-specialist-uttara-dhaka-bangladesh.jpg'
  },
  {
    id: 4,
    title: 'Acoustic Repair & Diagnostic Servicing Lab',
    category: 'Services',
    caption: 'Specialized ultrasonic hearing aid cleaning, moisture extraction, and micro-component calibration.',
    image: '/images/abid-hearing-aid-repair-and-servicing-lab-dhaka-bangladesh.jpg'
  },
  {
    id: 5,
    title: 'Clinical Consultation & Testing Suite',
    category: 'Clinics',
    caption: 'Private clinical consultation rooms equipped with state-of-the-art audiological assessment systems.',
    image: '/images/abid-audiology-hearing-test-clinic-uttara-dhaka.jpeg'
  },
  {
    id: 6,
    title: 'Pediatric Hearing Care & Testing Kit',
    category: 'Patient Care',
    caption: 'Specialized pediatric diagnostic accessories, fun child-friendly earmoulds, and gentle infant care.',
    image: '/images/abid-phonak-pediatric-child-hearing-care-kit-bangladesh.png'
  },
  {
    id: 7,
    title: 'Phonak Naida Ultra Power BTE Fitting',
    category: 'Hearing Aids',
    caption: 'Swiss high-power digital hearing solution engineered for severe-to-profound hearing loss.',
    image: '/images/abid-phonak-naida-ultra-power-bte-hearing-aid-uttara-dhaka.png'
  },
  {
    id: 8,
    title: 'Custom Invisible in Canal (CIC) Devices',
    category: 'Hearing Aids',
    caption: 'Ultra-compact custom-crafted completely-in-canal discreet hearing aids crafted for individual ear canals.',
    image: '/images/abid-completely-in-canal-cic-invisible-hearing-aid-bangladesh.jpg'
  },
  {
    id: 9,
    title: 'One-on-One Audiology Consultation',
    category: 'Patient Care',
    caption: 'Comprehensive hearing counselling, lifestyle needs assessment, and patient education.',
    image: '/images/abid-audiologist-hearing-aid-consultation-uttara-dhaka.jpeg'
  },
  {
    id: 10,
    title: 'Roger Multi-Directional Wireless Table Mic',
    category: 'Hearing Aids',
    caption: 'Advanced wireless microphone system for crystal-clear hearing in business meetings and noisy environments.',
    image: '/images/abid-phonak-roger-table-mic-ii-wireless-system-bangladesh.jpg'
  },
  {
    id: 11,
    title: 'Clinical Maintenance & Sanitization Tools',
    category: 'Services',
    caption: 'Professional-grade hearing device cleaning equipment, wax loop tools, and disinfection kits.',
    image: '/images/abid-hearing-aid-cleaning-maintenance-tools-uttara-dhaka.jpg'
  },
  {
    id: 12,
    title: 'Genuine Zinc-Air Batteries & Accessories',
    category: 'Hearing Aids',
    caption: 'Authorized German zinc-air hearing aid batteries (Size 10, 312, 13, 675) and wax protection filters.',
    image: '/images/abid-rexton-hearing-aid-zinc-air-batteries-range-bangladesh.jpg'
  }
];

