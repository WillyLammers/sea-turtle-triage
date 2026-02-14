// ---------------------------------------------------------------------------
// Stage 3 — Release Decision Scenarios
// ---------------------------------------------------------------------------

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';

export interface ReleaseScenario {
  id: string;
  species: string;
  rehabSummary: string;
  locationOptions: string[];
  correctLocation: string;
  seasonOptions: Season[];
  correctSeason: Season;
  educationalBlurb: string;
}

export const SEASON_OPTIONS: Season[] = ['Spring', 'Summer', 'Fall', 'Winter'];

export const RELEASE_SCENARIOS: ReleaseScenario[] = [
  {
    id: 'r1',
    species: 'Kemps Ridley',
    rehabSummary:
      'Juvenile Kemp\'s ridley, SCL 28 cm, was cold-stunned in Cape Cod Bay, MA in November. After 4 months of rehabilitation including slow warming, fluid therapy, antibiotics for secondary pneumonia, and nutritional support, the turtle has fully recovered. Body weight is normal, bloodwork is within healthy limits, and the turtle is diving, foraging, and behaving normally in the rehab tank.',
    locationOptions: [
      'Cape Cod Bay, MA (original stranding location)',
      'Warm waters off the coast of central Florida',
      'Gulf of Mexico, near Padre Island, TX',
      'Chesapeake Bay, VA',
    ],
    correctLocation: 'Warm waters off the coast of central Florida',
    seasonOptions: SEASON_OPTIONS,
    correctSeason: 'Spring',
    educationalBlurb:
      'Cold-stunned turtles should NOT be released back at their stranding location during cold months, as they would immediately face the same dangerous conditions. Instead, they are released into warm waters (typically off central or south Florida) in spring when water temperatures are safely above 20 degrees C. Releasing in warm Gulf Stream-influenced waters gives the turtle the best chance of rejoining the population. Kemp\'s ridleys from Cape Cod were likely carried north by currents and failed to migrate south before the fall temperature drop.',
  },
  {
    id: 'r2',
    species: 'Green',
    rehabSummary:
      'Sub-adult green turtle, SCL 45 cm, was treated for fibropapillomatosis (FP) at a Florida rehabilitation facility. All external tumors were surgically removed over three procedures. The turtle has been tumor-free for 6 months, has regained normal body weight, and CT scan shows no internal tumors. Bloodwork is normal. The turtle is eating a healthy diet of seagrass and algae in the rehab tank.',
    locationOptions: [
      'Indian River Lagoon, FL (original capture location)',
      'Open ocean, 50 miles offshore',
      'Florida Keys nearshore seagrass habitat',
      'Chesapeake Bay, VA seagrass beds',
    ],
    correctLocation: 'Indian River Lagoon, FL (original capture location)',
    seasonOptions: SEASON_OPTIONS,
    correctSeason: 'Spring',
    educationalBlurb:
      'FP-recovered turtles should be released near their original capture location whenever possible, as green turtles show strong site fidelity to specific foraging grounds. The Indian River Lagoon is a critical developmental habitat for juvenile and sub-adult green turtles in Florida. Spring release ensures warm water temperatures and abundant seagrass growth. Although FP prevalence is high in the lagoon, releasing elsewhere would put the turtle in an unfamiliar foraging environment. A 6-month tumor-free period with clean imaging is the standard threshold for release clearance.',
  },
  {
    id: 'r3',
    species: 'Loggerhead',
    rehabSummary:
      'Adult female loggerhead, SCL 92 cm, was rehabilitated after a boat-strike injury that fractured two carapace scutes. The fractures were stabilized with epoxy and zip ties, and the turtle received 8 weeks of antibiotic therapy. The carapace has healed with stable fibrous tissue. The turtle is swimming and diving normally, eating blue crabs and horseshoe crabs, and all bloodwork has returned to normal. She was originally found stranded on Topsail Beach, NC in late summer.',
    locationOptions: [
      'Nearshore waters off Topsail Beach, NC (original stranding location)',
      'Deep water Gulf Stream off Cape Hatteras, NC',
      'Florida nesting beach',
      'Bermuda offshore waters',
    ],
    correctLocation: 'Nearshore waters off Topsail Beach, NC (original stranding location)',
    seasonOptions: SEASON_OPTIONS,
    correctSeason: 'Summer',
    educationalBlurb:
      'Adult loggerheads should be released near their stranding location when water temperatures are appropriate. Summer release in North Carolina provides warm coastal waters (24-28 degrees C) ideal for loggerheads. Releasing an adult female during summer also allows her to potentially participate in the nesting season if she is reproductively active. North Carolina\'s coast is within the loggerhead\'s normal foraging range, and nearshore release gives access to preferred benthic (bottom-dwelling) prey like crabs and mollusks. Releasing offshore in the Gulf Stream would push the turtle away from coastal foraging habitat.',
  },
  {
    id: 'r4',
    species: 'Leatherback',
    rehabSummary:
      'Sub-adult leatherback, SCL 110 cm, was entangled in lobster pot gear off Massachusetts in September. Disentanglement team freed the turtle, but deep flipper lacerations required surgical repair. After 3 months of wound care and monitoring, the flippers have healed well and the turtle is swimming with normal flipper function. The leatherback is eating jellyfish and maintaining body condition. Bloodwork is normal.',
    locationOptions: [
      'Cape Cod Bay, MA (near entanglement location)',
      'Warm offshore waters in the Gulf Stream south of Cape Hatteras',
      'Nesting beach in Trinidad',
      'Long Island Sound, NY',
    ],
    correctLocation: 'Warm offshore waters in the Gulf Stream south of Cape Hatteras',
    seasonOptions: SEASON_OPTIONS,
    correctSeason: 'Fall',
    educationalBlurb:
      'Leatherbacks are highly migratory and pelagic — they do not stay in nearshore coastal waters like other species. Releasing in the Gulf Stream south of Cape Hatteras in fall aligns with their natural southward migration pattern. By December, Massachusetts waters are dangerously cold even for leatherbacks (which tolerate colder water than other sea turtles due to counter-current heat exchange in their flippers). The Gulf Stream provides the warm-water corridor that leatherbacks use during migration. Releasing at a nesting beach would be inappropriate as this is a sub-adult, not a breeding adult, and forced proximity to a nesting area is not ecologically sound.',
  },
  {
    id: 'r5',
    species: 'Hawksbill',
    rehabSummary:
      'Juvenile hawksbill, SCL 30 cm, was found stranded on a beach in the Florida Keys with buoyancy disorder. Diagnostics revealed a small pneumocoelom (air trapped in the body cavity) likely from a minor lung laceration. After 6 weeks of supportive care, the air was reabsorbed and the turtle is diving and foraging on sponges normally. Body condition is excellent and bloodwork is within normal limits.',
    locationOptions: [
      'Coral reef habitat in the Florida Keys (near original stranding site)',
      'Seagrass beds in Tampa Bay, FL',
      'Offshore pelagic sargassum habitat',
      'Mangrove estuary, Everglades National Park',
    ],
    correctLocation: 'Coral reef habitat in the Florida Keys (near original stranding site)',
    seasonOptions: SEASON_OPTIONS,
    correctSeason: 'Summer',
    educationalBlurb:
      'Hawksbills are closely associated with coral reef habitats, where they feed primarily on sponges. The Florida Keys contains the only barrier reef in the continental United States and is critical hawksbill habitat. Releasing near the original stranding site in the Keys during summer provides warm water (26-30 degrees C) and access to abundant reef sponges. Summer also coincides with peak coral reef productivity. Hawksbills are critically endangered, and every successful rehabilitation and release contributes meaningfully to population recovery. Releasing in seagrass or mangrove habitat would be inappropriate as it does not match their specialized diet and ecological niche.',
  },
  {
    id: 'r6',
    species: 'Green',
    rehabSummary:
      'Juvenile green turtle, SCL 32 cm, was found stranded on Mustang Island, TX with severe plastic ingestion. After 2 months of treatment — including passage of over 40 pieces of plastic debris, fluid therapy, and nutritional rehabilitation — the turtle has fully recovered. Radiographs confirm the GI tract is clear. The turtle is eating seagrass and algae normally and has reached a healthy body weight. All bloodwork is normal.',
    locationOptions: [
      'Nearshore waters off Mustang Island, TX (original stranding site)',
      'Offshore waters in the central Gulf of Mexico',
      'Indian River Lagoon, FL',
      'South Padre Island, TX jetty',
    ],
    correctLocation: 'Nearshore waters off Mustang Island, TX (original stranding site)',
    seasonOptions: SEASON_OPTIONS,
    correctSeason: 'Spring',
    educationalBlurb:
      'Green turtles in the western Gulf of Mexico forage in the seagrass beds along the Texas coast. Releasing near the original stranding site maintains the turtle\'s connection to its familiar foraging ground. Spring release in Texas provides water temperatures above 20 degrees C as the Gulf warms, and coincides with the spring seagrass growing season — ensuring abundant food availability. Releasing offshore would be inappropriate as juvenile greens are primarily nearshore, benthic foragers. This case highlights the devastating impact of marine debris: over 40 pieces of plastic in a turtle with a 32 cm shell. Public education about reducing single-use plastics is critical for sea turtle conservation.',
  },
];
