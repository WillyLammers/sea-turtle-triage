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
  {
    id: 's2',
    species: 'Green',
    size: 34,
    locationFound: 'Surf zone, Padre Island, TX',
    injuries: 'No external injuries.',
    condition:
      'Juvenile turtle is completely unresponsive. Body is stiff with rigor mortis. Barnacle growth is heavy on the carapace. No heartbeat detected.',
    correctCode: 'CC0',
    explanation:
      'Rigor mortis and absence of heartbeat confirm death. Heavy barnacle loading ("epibiota") on a juvenile often indicates the turtle was debilitated for an extended period before death, as healthy turtles keep barnacle loads in check through normal activity.',
  },
  {
    id: 's3',
    species: 'Kemps Ridley',
    size: 24,
    locationFound: 'Tidal flat, Cape Cod Bay, MA',
    injuries: 'No external injuries.',
    condition:
      'Small juvenile found partially buried in sand. No movement, no reflexes, no cloacal response. Body is cold and flaccid. Likely cold-stunned and deceased.',
    correctCode: 'CC0',
    explanation:
      'Cold-stunned turtles that have been exposed to lethal water temperatures (below 5 degrees C) for too long will die. The absence of any reflex, including the cloacal reflex (a last indicator of life), confirms this animal is dead.',
  },

  // ── CC1 — Alive-Good ───────────────────────────────────────────────
  {
    id: 's4',
    species: 'Green',
    size: 42,
    locationFound: 'Nearshore waters, Key West, FL',
    injuries: 'Minor superficial scratches on carapace. Small barnacle cluster on left rear flipper.',
    condition:
      'Turtle is alert and actively trying to swim. Eyes are bright and responsive. Strong flipper movements. Reacts immediately when touched. Good body condition — plastron is rounded, no visible emaciation.',
    correctCode: 'CC1',
    explanation:
      'This turtle is alert, responsive, and in good body condition. The minor scratches and small barnacle cluster are insignificant. CC1 turtles may have been reported by the public or captured incidentally but are essentially healthy. After documentation and tagging, this turtle could be quickly released.',
  },
  {
    id: 's5',
    species: 'Loggerhead',
    size: 72,
    locationFound: 'Fishing pier, Jacksonville Beach, FL',
    injuries: 'Small fishing hook embedded in left front flipper. Minimal monofilament entanglement.',
    condition:
      'Turtle is vigorous and struggling. Eyes are clear. Strong withdrawal reflex. Good muscle tone throughout. Breathing regularly. Body weight appears normal.',
    correctCode: 'CC1',
    explanation:
      'Despite the hook and minor entanglement, this loggerhead is in excellent overall condition. It is alert, strong, and well-nourished. The hook can be removed by a trained responder and the turtle assessed for release. Hook ingestion should be ruled out with imaging if the line goes into the mouth.',
  },
  {
    id: 's6',
    species: 'Hawksbill',
    size: 38,
    locationFound: 'Reef flat, St. Croix, USVI',
    injuries: 'Healed scar on posterior carapace margin, likely old shark bite.',
    condition:
      'Active and alert. Attempting to bite handler. Strong rear flipper kicks. Eyes bright. No signs of current disease or distress. Excellent body condition.',
    correctCode: 'CC1',
    explanation:
      'This hawksbill is feisty and healthy. The old, healed shark-bite scar is evidence of a prior encounter but poses no current health risk. Hawksbills are critically endangered, so documentation, photos, and tagging are especially important before release.',
  },

  // ── CC2 — Alive-Fair ───────────────────────────────────────────────
  {
    id: 's7',
    species: 'Green',
    size: 48,
    locationFound: 'Beach strand, Hutchinson Island, FL',
    injuries: 'Multiple small fibropapilloma tumors around eyes and flippers.',
    condition:
      'Turtle is lethargic but responsive to touch. Eyes partially obscured by tumors but still tracks movement. Moderate body condition. Breathing is regular. Can move all four flippers.',
    correctCode: 'CC2',
    explanation:
      'Fibropapillomatosis (FP) is a tumor-causing disease common in green turtles. This animal is responsive and in moderate body condition, but the tumors are affecting vision and flipper function. CC2 is appropriate — the turtle needs rehabilitation and likely surgical tumor removal but is not in immediate danger.',
  },
  {
    id: 's8',
    species: 'Loggerhead',
    size: 65,
    locationFound: 'Nearshore sandbar, Topsail Beach, NC',
    injuries: 'Moderate entanglement — nylon rope wrapped around right front flipper causing edema and minor abrasion.',
    condition:
      'Turtle is responsive but sluggish. Swelling (edema) on the entangled flipper is significant. Other three flippers function normally. Turtle appears mildly dehydrated — eyes slightly sunken. Moderate body condition.',
    correctCode: 'CC2',
    explanation:
      'The entanglement is causing significant soft-tissue swelling but has not yet caused flipper loss or systemic decline. The mild dehydration and lethargy bump this from CC1 to CC2. After disentanglement, anti-inflammatory treatment, fluids, and monitoring are needed before release.',
  },
  {
    id: 's9',
    species: 'Kemps Ridley',
    size: 28,
    locationFound: 'Beach strand, Cape Hatteras, NC',
    injuries: 'No external injuries. Minor epibiota (barnacles, algae).',
    condition:
      'Cold-stunned juvenile. Lethargic but responsive to flipper pinch. Slow eye blink reflex. Can weakly move rear flippers. Core body temperature 12 degrees C (normal is 20-30 degrees C).',
    correctCode: 'CC2',
    explanation:
      'Cold stunning occurs when turtles are trapped in rapidly cooling waters, commonly in Cape Cod Bay and along the mid-Atlantic. At 12 degrees C this turtle is hypothermic but still responsive. Slow, controlled warming in a rehabilitation facility is critical — warming too quickly can cause shock.',
  },

  // ── CC3 — Alive-Poor ───────────────────────────────────────────────
  {
    id: 's10',
    species: 'Green',
    size: 55,
    locationFound: 'Beach strand, South Padre Island, TX',
    injuries: 'Severe fibropapilloma tumors covering both eyes, all flipper joints, and cloaca.',
    condition:
      'Minimally responsive — only reacts to deep flipper pinch. Severely emaciated (plastron deeply concave). Unable to lift head. Tumors obstructing vision completely. Breathing is shallow and irregular.',
    correctCode: 'CC3',
    explanation:
      'This turtle has advanced fibropapillomatosis with tumors obstructing vision, feeding, and waste elimination. Severe emaciation indicates it has been unable to feed for an extended period. The minimal responsiveness and labored breathing warrant CC3. Prognosis is guarded even with intensive rehabilitation.',
  },
  {
    id: 's11',
    species: 'Loggerhead',
    size: 78,
    locationFound: 'Beach strand, Kiawah Island, SC',
    injuries: 'Deep propeller lacerations across posterior carapace. Two scutes fractured. Old, infected wound with necrotic tissue.',
    condition:
      'Turtle has weak flipper response to pain stimulus. Eyes are dull and partially closed. Emaciated — shoulder bones and hip bones prominently visible. Foul smell from infected wound. Breathing is present but labored.',
    correctCode: 'CC3',
    explanation:
      'Boat-strike injuries with secondary infection and emaciation indicate a prolonged decline. The turtle is alive but in poor condition. Treatment would require surgical debridement of necrotic tissue, systemic antibiotics, nutritional support, and long-term rehabilitation. The prognosis depends on the extent of internal injuries.',
  },
  {
    id: 's12',
    species: 'Hawksbill',
    size: 32,
    locationFound: 'Mangrove shoreline, Florida Keys, FL',
    injuries: 'Heavy fishing line entanglement around neck and both front flippers. Deep lacerations from line cutting into tissue.',
    condition:
      'Barely responsive. Severe edema on head and flippers from circulatory restriction. Cannot move front flippers. Eyes are swollen shut. Emaciated. Very weak cloacal reflex.',
    correctCode: 'CC3',
    explanation:
      'Prolonged entanglement has caused severe circulatory compromise and tissue damage. The turtle is emaciated from inability to feed and dive. CC3 is appropriate given the minimal responsiveness and systemic decline. Immediate veterinary intervention is needed, but the prognosis is poor.',
  },

  // ── CC4 — Alive-Critical ───────────────────────────────────────────
  {
    id: 's13',
    species: 'Leatherback',
    size: 142,
    locationFound: 'Entangled in lobster pot lines, 5 miles offshore, MA',
    injuries: 'Deep entanglement wounds around both front flippers and neck. Lines have cut to bone on right flipper.',
    condition:
      'Unresponsive to all stimuli except faint heartbeat detected. Barely breathing — only 1 breath observed in 5 minutes. Severe hemorrhage from flipper wounds. Body limp.',
    correctCode: 'CC4',
    explanation:
      'This leatherback is in critical condition with life-threatening injuries. The faint heartbeat is the only sign of life. Leatherbacks are especially prone to entanglement due to their pelagic lifestyle. Emergency veterinary intervention is needed immediately, but survival chances are very low.',
  },
  {
    id: 's14',
    species: 'Green',
    size: 40,
    locationFound: 'Beach strand, Galveston, TX',
    injuries: 'No external injuries visible.',
    condition:
      'Cold-stunned juvenile found floating motionless in 6 degree C water. Completely unresponsive to stimuli. Core body temperature 7 degrees C. Faint heartbeat detected with Doppler. No voluntary breathing observed — only occasional gasping reflex.',
    correctCode: 'CC4',
    explanation:
      'Severe hypothermia at 7 degrees C has rendered this turtle nearly comatose. The faint Doppler heartbeat and occasional gasping reflex are the only signs of life, distinguishing this from CC0 (dead). Emergency slow-warming protocol is critical. Many severely cold-stunned turtles can recover if warmed carefully, but mortality at this level of hypothermia is high.',
  },
  {
    id: 's15',
    species: 'Loggerhead',
    size: 82,
    locationFound: 'Surf zone, Wrightsville Beach, NC',
    injuries: 'Massive boat strike — carapace fractured in three places with exposed coelomic cavity. Internal organs partially visible.',
    condition:
      'Unresponsive except for faint cloacal reflex. Severe blood loss. Exposed lung tissue. Body limp with no voluntary movement. Extremely labored, infrequent breathing.',
    correctCode: 'CC4',
    explanation:
      'This is a catastrophic boat-strike injury. The exposed coelomic cavity and visible organs indicate the injury is likely unsurvivable. However, the faint cloacal reflex means the animal is technically alive and must be assessed by a veterinarian. Humane euthanasia may be the most compassionate outcome.',
  },

  // ── Additional mixed cases for variety ──────────────────────────────
  {
    id: 's16',
    species: 'Kemps Ridley',
    size: 62,
    locationFound: 'Shrimp trawl bycatch, Gulf of Mexico',
    injuries: 'No external injuries. Captured in trawl net — estimated submergence time 45 minutes.',
    condition:
      'Turtle is comatose and unresponsive. No spontaneous breathing. Seawater draining from mouth and nares. Faint heartbeat present. Flippers are limp.',
    correctCode: 'CC4',
    explanation:
      'Forced submergence in shrimp trawl nets is a leading cause of sea turtle mortality. After 45 minutes underwater, this Kemp\'s ridley is in critical condition from near-drowning. The faint heartbeat means resuscitation should be attempted: position the turtle with the head tilted downward to drain water, and provide respiratory support. Turtle excluder devices (TEDs) in trawl nets are designed to prevent exactly this scenario.',
  },
  {
    id: 's17',
    species: 'Leatherback',
    size: 150,
    locationFound: 'Nesting beach, Juno Beach, FL',
    injuries: 'Shark bite — large crescent-shaped wound on right rear flipper, approximately 30 cm diameter. Active bleeding.',
    condition:
      'Turtle is responsive and attempting to crawl back to ocean. Head up, eyes open. Strong front flipper movement. Rear flipper function compromised by wound. Appears well-nourished despite the injury.',
    correctCode: 'CC2',
    explanation:
      'Despite the dramatic shark bite, this leatherback is alert, responsive, and in good body condition. Sea turtles can survive significant flipper injuries, including partial loss. The active bleeding needs to be controlled, and the wound assessed for infection risk, but the strong overall condition warrants CC2 rather than CC3.',
  },
  {
    id: 's18',
    species: 'Green',
    size: 30,
    locationFound: 'Beach strand, Mustang Island, TX',
    injuries: 'Buoyancy disorder — turtle cannot submerge, floating with right side elevated.',
    condition:
      'Turtle is alert and active at the surface. Eyes are bright. Trying to dive but unable to submerge — keeps bobbing back up. Good body condition. All flippers functional. No external injuries.',
    correctCode: 'CC2',
    explanation:
      'Buoyancy disorder (sometimes called "bubble butt") in sea turtles is often caused by gas accumulation from gut fermentation, pneumonia, or trapped air from a boat-strike fracture. This turtle is otherwise healthy and alert (CC1 features), but the inability to dive is a life-threatening condition that requires diagnostic imaging and rehabilitation, making CC2 the correct code.',
  },
];
