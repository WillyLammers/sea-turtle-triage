// ---------------------------------------------------------------------------
// Stage 1 — Nest Identification Scenarios
// ---------------------------------------------------------------------------

export type TimeOfDay = 'morning' | 'night';

export type NestType =
  | 'Live Nest'
  | 'False Crawl'
  | 'Predator-Raided'
  | 'Hatched (old)'
  | 'Washed Over';

export const NEST_OPTIONS: NestType[] = [
  'False Crawl',
  'Hatched (old)',
  'Live Nest',
  'Predator-Raided',
  'Washed Over',
];

export interface NestScenario {
  id: string;
  timeOfDay: TimeOfDay;
  description: string;
  visualClues: string[];
  options: NestType[];
  correctAnswer: NestType;
  explanation: string;
}

export const NEST_SCENARIOS: NestScenario[] = [
  {
    id: 'n1',
    timeOfDay: 'morning',
    description:
      'Morning patrol along the beach. You spot a wide crawl track coming up from the surf line. The sand above the high-tide line shows a large, disturbed area with a smooth, slightly raised mound. The track leads back down to the water.',
    visualClues: [
      'Wide crawl track (approx. 80 cm) with symmetrical flipper marks',
      'Body pit — a shallow depression where the turtle rocked side to side',
      'Smooth, patted-down sand mound concealing the egg chamber',
      'Incoming and outgoing crawl tracks both present',
    ],
    options: NEST_OPTIONS,
    correctAnswer: 'Live Nest',
    explanation:
      'The body pit, smooth egg-chamber mound, and paired crawl tracks are textbook signs of a successful nesting event. The turtle dug an egg chamber, deposited eggs, and carefully covered them before returning to the ocean.',
  },
  {
    id: 'n2',
    timeOfDay: 'night',
    description:
      'Night survey on a high-density nesting beach. You observe a loggerhead crawl track that goes about 15 meters up the beach, makes a U-turn near the dune vegetation, and heads straight back to the water. No obvious sand disturbance beyond the track.',
    visualClues: [
      'Single set of crawl tracks forming a U-shaped path',
      'No body pit or egg chamber depression visible',
      'Sand surface is undisturbed aside from flipper scrapes',
      'Turtle appeared to abort at the dune line',
    ],
    options: NEST_OPTIONS,
    correctAnswer: 'False Crawl',
    explanation:
      'A false crawl occurs when a sea turtle emerges from the ocean but does not lay eggs. Reasons include artificial lighting, disturbance, unsuitable sand, or obstacles. The absence of a body pit and egg chamber confirms no nesting occurred.',
  },
  {
    id: 'n3',
    timeOfDay: 'morning',
    description:
      'You approach a previously marked nest site and find the sand has been violently dug up. Broken eggshell fragments are scattered around the site. Small paw prints surround the area, and a few punctured eggs remain in the cavity.',
    visualClues: [
      'Nest cavity fully excavated and exposed',
      'Broken, leathery eggshell pieces scattered up to 2 meters away',
      'Small mammal tracks (5-toed, likely raccoon) around the nest',
      'Punctured eggs with yolk residue visible',
    ],
    options: NEST_OPTIONS,
    correctAnswer: 'Predator-Raided',
    explanation:
      'Raccoons are the most common predator of sea turtle nests on Atlantic and Gulf beaches. The 5-toed tracks, excavated chamber, and scattered punctured shells are definitive signs of predation. Nest screens or cages can help prevent this.',
  },
  {
    id: 'n4',
    timeOfDay: 'morning',
    description:
      'Further down the beach, you notice a gentle sand depression surrounded by dozens of tiny flipper tracks leading toward the ocean. Small, papery eggshell fragments are scattered in the depression.',
    visualClues: [
      'Shallow sand depression (collapsed egg chamber)',
      'Numerous tiny hatchling crawl tracks fanning out toward the surf',
      'Thin, white eggshell fragments in and around the depression',
      'No large adult crawl tracks — this event happened days ago',
    ],
    options: NEST_OPTIONS,
    correctAnswer: 'Hatched (old)',
    explanation:
      'This nest has already hatched successfully. After roughly 50-60 days of incubation, hatchlings emerge (usually at night), leaving characteristic tiny tracks to the ocean. The collapsed egg chamber and papery shell remnants confirm a completed nest.',
  },
  {
    id: 'n5',
    timeOfDay: 'morning',
    description:
      'A strong nor\'easter passed through overnight. A previously staked nest is now in the intertidal zone. The sand is wet and saturated, and a few round, white eggs are partially exposed at the surface. There is standing water in the depression.',
    visualClues: [
      'Nest site is now below the current high-tide wrack line',
      'Sand is waterlogged and has a dark, saturated appearance',
      'Several eggs are exposed at the surface due to erosion',
      'Standing saltwater pooled in the depression',
    ],
    options: NEST_OPTIONS,
    correctAnswer: 'Washed Over',
    explanation:
      'Storm surge and wave action can erode the sand covering a nest, exposing or drowning the eggs. Nests inundated with saltwater for extended periods face significantly reduced hatch success. Relocation of remaining viable eggs may be warranted.',
  },
];
