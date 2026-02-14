// ---------------------------------------------------------------------------
// Stage 2 — Stranding Triage / Condition Coding
// ---------------------------------------------------------------------------

export type Species =
  | 'Green'
  | 'Loggerhead'
  | 'Leatherback'
  | 'Hawksbill'
  | 'Kemps Ridley';

export type ConditionCode = 'CC0' | 'CC1' | 'CC2' | 'CC3' | 'CC4';

export interface StrandingCard {
  id: string;
  species: Species;
  /** Straight Carapace Length in centimeters */
  size: number;
  locationFound: string;
  injuries: string;
  condition: string;
  correctCode: ConditionCode;
  explanation: string;
}

export const CONDITION_CODE_LABELS: Record<ConditionCode, string> = {
  CC0: 'Dead',
  CC1: 'Alive — Good',
  CC2: 'Alive — Fair',
  CC3: 'Alive — Poor',
  CC4: 'Alive — Critical',
};

export const STRANDING_CARDS: StrandingCard[] = [
  // ── CC0 — Dead ──────────────────────────────────────────────────────
  {
    id: 's1',
    species: 'Loggerhead',
    size: 87,
    locationFound: 'Wrack line, Folly Beach, SC',
    injuries: 'No external injuries visible. Strong odor of decomposition.',
    condition:
      'Turtle is bloated and rigid. Eyes are sunken and clouded. No response to any stimuli. Skin is sloughing off the flippers. Advanced decomposition.',
    correctCode: 'CC0',
    explanation:
      'Bloating, rigor, skin sloughing, clouded eyes, and decomposition odor are definitive signs of death. This turtle likely died at sea and washed ashore. A necropsy could help determine cause of death (e.g., drowning in fishing gear, disease).',
  },

  // ── CC1 — Alive-Good ───────────────────────────────────────────────
  {
    id: 's2',
    species: 'Green',
    size: 42,
    locationFound: 'Nearshore waters, Sullivan\'s Island, SC',
    injuries: 'Minor superficial scratches on carapace. Small barnacle cluster on left rear flipper.',
    condition:
      'Turtle is alert and actively trying to swim. Eyes are bright and responsive. Strong flipper movements. Reacts immediately when touched. Good body condition — plastron is rounded, no visible emaciation.',
    correctCode: 'CC1',
    explanation:
      'This turtle is alert, responsive, and in good body condition. The minor scratches and small barnacle cluster are insignificant. CC1 turtles may have been reported by the public or captured incidentally but are essentially healthy. After documentation and tagging, this turtle could be quickly released.',
  },

  // ── CC2 — Alive-Fair ───────────────────────────────────────────────
  {
    id: 's3',
    species: 'Green',
    size: 48,
    locationFound: 'Beach strand, Isle of Palms, SC',
    injuries: 'Multiple small fibropapilloma tumors around eyes and flippers.',
    condition:
      'Turtle is lethargic but responsive to touch. Eyes partially obscured by tumors but still tracks movement. Moderate body condition. Breathing is regular. Can move all four flippers.',
    correctCode: 'CC2',
    explanation:
      'Fibropapillomatosis (FP) is a tumor-causing disease common in green turtles. This animal is responsive and in moderate body condition, but the tumors are affecting vision and flipper function. CC2 is appropriate — the turtle needs rehabilitation and likely surgical tumor removal but is not in immediate danger.',
  },

  // ── CC3 — Alive-Poor ───────────────────────────────────────────────
  {
    id: 's4',
    species: 'Green',
    size: 55,
    locationFound: 'Beach strand, Kiawah Island, SC',
    injuries: 'Severe fibropapilloma tumors covering both eyes, all flipper joints, and cloaca.',
    condition:
      'Minimally responsive — only reacts to deep flipper pinch. Severely emaciated (plastron deeply concave). Unable to lift head. Tumors obstructing vision completely. Breathing is shallow and irregular.',
    correctCode: 'CC3',
    explanation:
      'This turtle has advanced fibropapillomatosis with tumors obstructing vision, feeding, and waste elimination. Severe emaciation indicates it has been unable to feed for an extended period. The minimal responsiveness and labored breathing warrant CC3. Prognosis is guarded even with intensive rehabilitation.',
  },

  // ── CC4 — Alive-Critical ───────────────────────────────────────────
  {
    id: 's5',
    species: 'Loggerhead',
    size: 82,
    locationFound: 'Surf zone, Seabrook Island, SC',
    injuries: 'Massive boat strike — carapace fractured in three places with exposed coelomic cavity. Internal organs partially visible.',
    condition:
      'Unresponsive except for faint cloacal reflex. Severe blood loss. Exposed lung tissue. Body limp with no voluntary movement. Extremely labored, infrequent breathing.',
    correctCode: 'CC4',
    explanation:
      'This is a catastrophic boat-strike injury. The exposed coelomic cavity and visible organs indicate the injury is likely unsurvivable. However, the faint cloacal reflex means the animal is technically alive and must be assessed by a veterinarian. Humane euthanasia may be the most compassionate outcome.',
  },
];
