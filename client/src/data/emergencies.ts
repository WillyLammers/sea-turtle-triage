// ---------------------------------------------------------------------------
// Emergency Scenarios — Client-side display data
// ---------------------------------------------------------------------------
// NOTE: The correct answers are stored server-side only (emergencyManager.ts).
// The client receives scenario data via socket events but this file provides
// the static reference for pre-loading UI and descriptions.
// ---------------------------------------------------------------------------

export interface EmergencyScenario {
  id: string;
  description: string;
  options: string[];
}

export const EMERGENCY_SCENARIOS: EmergencyScenario[] = [
  {
    id: 'e1',
    description:
      'A juvenile leatherback is entangled in a shark net 2 miles offshore. Fishing vessel reports turtle is still moving. What do you do?',
    options: [
      'Dispatch disentanglement team by boat immediately',
      'Wait for the turtle to free itself',
      'Ask the fishing vessel to cut the net',
      'Call the Coast Guard for an airstrike on the net',
    ],
  },
  {
    id: 'e2',
    description:
      'Cold front approaching \u2014 water temps dropping to 8\u00B0C. Reports of 40+ cold-stunned green turtles washing ashore on a 3-mile stretch. What is the priority action?',
    options: [
      'Set up triage stations along the beach with warming supplies',
      'Wait until the cold front passes to collect turtles',
      'Release all turtles back into the water immediately',
      'Only collect the largest turtles',
    ],
  },
  {
    id: 'e3',
    description:
      'Red tide bloom detected near a major nesting beach. Three adult loggerheads found lethargic in the surf zone. What is the correct response?',
    options: [
      'Transport turtles to rehab facility for brevetoxin treatment',
      'Push the turtles back out to deeper water',
      'Leave them alone \u2014 they will recover naturally',
      'Euthanize the affected turtles immediately',
    ],
  },
  {
    id: 'e4',
    description:
      'A nesting hawksbill has been struck by a boat propeller. Deep lacerations on the carapace, bleeding heavily. She is on the beach attempting to nest. What do you do?',
    options: [
      'Allow her to finish nesting, then transport to veterinary care',
      'Immediately remove her from the beach and rush to the vet',
      'Apply bandages on the beach and leave her',
      'Push her back into the ocean',
    ],
  },
];
