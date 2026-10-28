import os

svgs = {
    'ecommerce-ad.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F1633"/>
      <stop offset="50%" stop-color="#0F0C18"/>
      <stop offset="100%" stop-color="#08060D"/>
    </linearGradient>
    <linearGradient id="purple-glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="100%" stop-color="#C4B5FD"/>
    </linearGradient>
  </defs>
  <rect width="720" height="1280" fill="url(#bg-grad)"/>
  <circle cx="360" cy="640" r="320" fill="#8B5CF6" opacity="0.08"/>
  <rect x="40" y="60" width="120" height="32" rx="16" fill="#8B5CF6" opacity="0.2"/>
  <text x="60" y="82" fill="#C4B5FD" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="2">E-COM AD</text>
  <text x="640" y="82" fill="#A7A1B3" font-family="monospace" font-size="14" text-anchor="end">9:16 REEL</text>
  <rect x="80" y="280" width="560" height="480" rx="24" fill="#15121C" stroke="#8B5CF6" stroke-width="2" stroke-opacity="0.3"/>
  <circle cx="360" cy="460" r="70" fill="#8B5CF6" opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
  <polygon points="350,430 385,460 350,490" fill="#C4B5FD"/>
  <text x="360" y="580" fill="#F5F3F8" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle" letter-spacing="1">MAMA RAHIK LAUNCH</text>
  <text x="360" y="620" fill="#C4B5FD" font-family="sans-serif" font-size="18" font-weight="600" text-anchor="middle">100K+ ORGANIC VIEWS</text>
  <g transform="translate(160, 840)" fill="#8B5CF6" opacity="0.6">
    <rect x="0" y="20" width="6" height="40" rx="3"/>
    <rect x="15" y="10" width="6" height="60" rx="3"/>
    <rect x="30" y="0" width="6" height="80" rx="3"/>
    <rect x="45" y="15" width="6" height="50" rx="3"/>
    <rect x="60" y="5" width="6" height="70" rx="3"/>
    <rect x="75" y="25" width="6" height="30" rx="3"/>
    <rect x="90" y="10" width="6" height="60" rx="3"/>
    <rect x="105" y="0" width="6" height="80" rx="3"/>
    <rect x="120" y="20" width="6" height="40" rx="3"/>
    <rect x="135" y="5" width="6" height="70" rx="3"/>
    <rect x="150" y="15" width="6" height="50" rx="3"/>
    <rect x="165" y="0" width="6" height="80" rx="3"/>
    <rect x="180" y="25" width="6" height="30" rx="3"/>
    <rect x="195" y="10" width="6" height="60" rx="3"/>
    <rect x="210" y="18" width="6" height="44" rx="3"/>
    <rect x="225" y="5" width="6" height="70" rx="3"/>
    <rect x="240" y="0" width="6" height="80" rx="3"/>
    <rect x="255" y="15" width="6" height="50" rx="3"/>
    <rect x="270" y="22" width="6" height="36" rx="3"/>
    <rect x="285" y="8" width="6" height="64" rx="3"/>
    <rect x="300" y="0" width="6" height="80" rx="3"/>
    <rect x="315" y="12" width="6" height="56" rx="3"/>
    <rect x="330" y="25" width="6" height="30" rx="3"/>
    <rect x="345" y="15" width="6" height="50" rx="3"/>
    <rect x="360" y="5" width="6" height="70" rx="3"/>
    <rect x="375" y="20" width="6" height="40" rx="3"/>
    <rect x="390" y="30" width="6" height="20" rx="3"/>
  </g>
  <rect x="160" y="1020" width="400" height="64" rx="32" fill="url(#purple-glow)"/>
  <text x="360" y="1060" fill="#0B0A0F" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle" letter-spacing="1">HIGH ROAS HOOK PACING</text>
</svg>''',

    'corporate-film.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181424"/>
      <stop offset="50%" stop-color="#0E0B16"/>
      <stop offset="100%" stop-color="#08060E"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg-grad2)"/>
  <line x1="60" y1="60" x2="120" y2="60" stroke="#8B5CF6" stroke-width="2"/>
  <line x1="60" y1="60" x2="60" y2="120" stroke="#8B5CF6" stroke-width="2"/>
  <line x1="1220" y1="60" x2="1160" y2="60" stroke="#8B5CF6" stroke-width="2"/>
  <line x1="1220" y1="60" x2="1220" y2="120" stroke="#8B5CF6" stroke-width="2"/>
  <line x1="60" y1="660" x2="120" y2="660" stroke="#8B5CF6" stroke-width="2"/>
  <line x1="60" y1="660" x2="60" y2="600" stroke="#8B5CF6" stroke-width="2"/>
  <line x1="1220" y1="660" x2="1160" y2="660" stroke="#8B5CF6" stroke-width="2"/>
  <line x1="1220" y1="660" x2="1220" y2="600" stroke="#8B5CF6" stroke-width="2"/>
  <text x="80" y="100" fill="#8B5CF6" font-family="monospace" font-size="14" letter-spacing="2">4K DCI // 24.00 FPS</text>
  <text x="1200" y="100" fill="#C4B5FD" font-family="monospace" font-size="14" text-anchor="end">REC [TC 00:01:24:18]</text>
  <circle cx="640" cy="360" r="80" fill="#8B5CF6" opacity="0.12" stroke="#8B5CF6" stroke-width="2"/>
  <polygon points="630,325 670,360 630,395" fill="#C4B5FD"/>
  <text x="640" y="490" fill="#F5F3F8" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle" letter-spacing="2">ATTIJARIWAFA BANK &amp; CDD</text>
  <text x="640" y="525" fill="#A7A1B3" font-family="sans-serif" font-size="16" text-anchor="middle" letter-spacing="1">INSTITUTIONAL CORPORATE CAMPAIGN</text>
</svg>''',

    'real-estate.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-grad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#161221"/>
      <stop offset="100%" stop-color="#0B0A0F"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg-grad3)"/>
  <path d="M200,600 L640,240 L1080,600" fill="none" stroke="#8B5CF6" stroke-width="1.5" opacity="0.35"/>
  <path d="M350,600 L640,340 L930,600" fill="none" stroke="#C4B5FD" stroke-width="1" opacity="0.25"/>
  <line x1="640" y1="200" x2="640" y2="600" stroke="#8B5CF6" stroke-width="1" stroke-dasharray="6 6" opacity="0.4"/>
  <circle cx="640" cy="360" r="60" fill="#8B5CF6" opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
  <polygon points="632,335 660,360 632,385" fill="#F5F3F8"/>
  <text x="640" y="470" fill="#F5F3F8" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle" letter-spacing="2">SIDEPARK &amp; AJIAL RESIDENCES</text>
  <text x="640" y="505" fill="#C4B5FD" font-family="sans-serif" font-size="15" text-anchor="middle" letter-spacing="1">LUXURY ARCHITECTURAL &amp; INTERIOR FILMS</text>
</svg>''',

    'ugc-content.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="100%" height="100%">
  <rect width="720" height="1280" fill="#110E1A"/>
  <circle cx="360" cy="540" r="260" fill="#8B5CF6" opacity="0.1"/>
  <rect x="50" y="80" width="620" height="1120" rx="36" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-opacity="0.3"/>
  <rect x="120" y="320" width="480" height="140" rx="20" fill="#1B1626" stroke="#C4B5FD" stroke-width="1.5" stroke-opacity="0.4"/>
  <text x="160" y="375" fill="#C4B5FD" font-family="sans-serif" font-size="18" font-weight="bold">@CASTINGVOIXOFF &amp; SAWTIA</text>
  <text x="160" y="415" fill="#F5F3F8" font-family="sans-serif" font-size="22" font-weight="bold">Dynamic Voice UGC &amp; Creator Feeds</text>
  <circle cx="360" cy="640" r="75" fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" stroke-width="2"/>
  <polygon points="350,610 385,640 350,670" fill="#F5F3F8"/>
  <text x="360" y="780" fill="#C4B5FD" font-family="monospace" font-size="16" text-anchor="middle" letter-spacing="2">HIGH RETENTION CREATIVE CUTS</text>
</svg>''',

    'medical-promo.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="100%" height="100%">
  <rect width="720" height="1280" fill="#0D0B14"/>
  <circle cx="360" cy="640" r="280" fill="#8B5CF6" opacity="0.08"/>
  <circle cx="360" cy="500" r="160" fill="none" stroke="#8B5CF6" stroke-width="1.5" stroke-opacity="0.4"/>
  <circle cx="360" cy="500" r="90" fill="none" stroke="#C4B5FD" stroke-width="1.5" stroke-dasharray="4 6"/>
  <circle cx="360" cy="500" r="50" fill="#8B5CF6" opacity="0.2"/>
  <polygon points="352,480 376,500 352,520" fill="#F5F3F8"/>
  <text x="360" y="740" fill="#F5F3F8" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">EYECARE CLINICS SERIES</text>
  <text x="360" y="780" fill="#C4B5FD" font-family="sans-serif" font-size="16" text-anchor="middle">EDUCATIONAL &amp; PROMOTIONAL HEALTH</text>
</svg>''',

    'camera-production.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="100%" height="100%">
  <rect width="1280" height="720" fill="#0A090E"/>
  <circle cx="80" cy="80" r="8" fill="#EF4444"/>
  <text x="100" y="86" fill="#EF4444" font-family="monospace" font-size="16" font-weight="bold">REC</text>
  <text x="1200" y="86" fill="#C4B5FD" font-family="monospace" font-size="15" text-anchor="end">ISO 800 // F2.8 // 1/50</text>
  <circle cx="640" cy="360" r="80" fill="#8B5CF6" opacity="0.15" stroke="#8B5CF6" stroke-width="2"/>
  <polygon points="630,325 670,360 630,395" fill="#F5F3F8"/>
  <text x="640" y="490" fill="#F5F3F8" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle" letter-spacing="2">TAGUI MEDIA FIELD PRODUCTION</text>
  <text x="640" y="525" fill="#A7A1B3" font-family="sans-serif" font-size="16" text-anchor="middle">ON-SET CAMERA WORK &amp; CLIENT PROMOS</text>
</svg>''',

    'technaps-reels.svg': '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="100%" height="100%">
  <rect width="720" height="1280" fill="#120F1D"/>
  <circle cx="360" cy="500" r="80" fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" stroke-width="2"/>
  <polygon points="350,470 385,500 350,530" fill="#C4B5FD"/>
  <text x="360" y="660" fill="#F5F3F8" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">TECHNAPS AGENCY REELS</text>
  <text x="360" y="700" fill="#C4B5FD" font-family="sans-serif" font-size="16" text-anchor="middle">DYNAMIC SOCIAL REELS &amp; BEAT CUTS</text>
</svg>'''
}

out_dir = os.path.join('public', 'images', 'projects')
os.makedirs(out_dir, exist_ok=True)
for name, content in svgs.items():
    with open(os.path.join(out_dir, name), 'w', encoding='utf-8') as f:
        f.write(content)
print(f"Generated {len(svgs)} SVG files in {out_dir}")
