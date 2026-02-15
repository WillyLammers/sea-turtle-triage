// ---------------------------------------------------------------------------
// Stage 4 — Lab / Diagnostic Analysis Cases
// ---------------------------------------------------------------------------

export type SubTaskType = 'microscope' | 'stomach' | 'bloodGas' | 'necropsy';

export type StomachItemShape =
  | 'plasticBag'
  | 'penCap'
  | 'balloon'
  | 'fishingLine'
  | 'polystyrene'
  | 'rubberBand'
  | 'crab'
  | 'shrimp'
  | 'seagrass'
  | 'mollusk';

export interface MicroscopeItem {
  id: string;
  label: string;
  isTarget: boolean;
  /** Optional SVG shape hint for stomach content items */
  shape?: StomachItemShape;
}

export interface SubTask {
  id: string;
  type: SubTaskType;
  description: string;
  /** Used for 'microscope' and 'stomach' task types */
  items?: MicroscopeItem[];
  /** Used for 'bloodGas' and 'necropsy' task types */
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation: string;
}

export interface LabCase {
  id: string;
  species: string;
  patientHistory: string;
  subTasks: SubTask[];
}

export const LAB_CASES: LabCase[] = [
  // ── Case 1: Spirorchid Blood Fluke ──────────────────────────────────
  {
    id: 'lab1',
    species: 'Green',
    patientHistory:
      'Adult female green turtle, SCL 94 cm, found stranded and lethargic on a Florida beach. Presented with neurological signs including circling and head tilt. Mild anemia detected on initial bloodwork. Fecal exam positive for trematode eggs. Tissue biopsy taken from the brain during necropsy after the turtle succumbed.',
    subTasks: [
      {
        id: 'lab1-st1',
        type: 'microscope',
        description:
          'Examine the brain tissue slide under the microscope. Identify which structures are spirorchid blood fluke eggs — they appear as oval, thick-walled structures often surrounded by granulomatous inflammation.',
        items: [
          { id: 'lab1-m1', label: 'Oval thick-walled egg with internal miracidium larva', isTarget: true },
          { id: 'lab1-m2', label: 'Round red blood cell cluster', isTarget: false },
          { id: 'lab1-m3', label: 'Granuloma surrounding a brown oval structure', isTarget: true },
          { id: 'lab1-m4', label: 'Normal neuron cell body', isTarget: false },
          { id: 'lab1-m5', label: 'Elongated egg with operculum (lid) in vessel wall', isTarget: true },
          { id: 'lab1-m6', label: 'Lipid droplet artifact', isTarget: false },
          { id: 'lab1-m7', label: 'Calcium deposit (mineralization)', isTarget: false },
          { id: 'lab1-m8', label: 'Egg with surrounding fibrosis in meningeal blood vessel', isTarget: true },
        ],
        correctAnswer: 'lab1-m1,lab1-m3,lab1-m5,lab1-m8',
        points: 50,
        explanation:
          'Spirorchid trematodes (blood flukes) are a major cause of morbidity and mortality in sea turtles, especially greens. Adult flukes live in the cardiovascular system, and their eggs embolize to organs including the brain, causing granulomatous inflammation and neurological disease. The eggs are oval, thick-walled, and often found within or adjacent to blood vessels surrounded by inflammatory cells.',
      },
      {
        id: 'lab1-st2',
        type: 'necropsy',
        description:
          'Based on the tissue findings and clinical history, what is the primary cause of the neurological signs in this turtle?',
        options: [
          'Bacterial meningitis',
          'Spirorchid cardiovascular fluke egg embolization to the brain',
          'Brevetoxin (red tide) poisoning',
          'Traumatic brain injury from boat strike',
        ],
        correctAnswer: 'Spirorchid cardiovascular fluke egg embolization to the brain',
        points: 50,
        explanation:
          'The combination of trematode eggs in feces, anemia, neurological signs, and eggs with granulomatous inflammation in brain tissue confirms spirorchid fluke infection as the cause of disease. Eggs that lodge in brain vasculature trigger an intense immune response that damages surrounding neural tissue.',
      },
      {
        id: 'lab1-st3',
        type: 'bloodGas',
        description:
          'The initial bloodwork showed a packed cell volume (PCV) of 12% (normal: 25-35%). What does this indicate, and what is the most likely cause in this case?',
        options: [
          'Polycythemia from dehydration — administer IV fluids',
          'Regenerative anemia from chronic blood loss due to vascular flukes',
          'Leukemia — begin chemotherapy protocol',
          'Normal variation for a nesting female',
        ],
        correctAnswer: 'Regenerative anemia from chronic blood loss due to vascular flukes',
        points: 50,
        explanation:
          'A PCV of 12% is severely anemic. In the context of spirorchid fluke infection, the anemia is caused by chronic blood loss from adult flukes feeding in the cardiovascular system and from vascular damage caused by migrating eggs. The bone marrow typically responds by increasing red blood cell production (regenerative anemia).',
      },
    ],
  },

  // ── Case 3: Plastic Ingestion ───────────────────────────────────────
  {
    id: 'lab3',
    species: 'Kemps Ridley',
    patientHistory:
      'Juvenile Kemp\'s ridley, SCL 26 cm, found floating lethargically in Galveston Bay, TX. Turtle is underweight with a distended abdomen. Radiographs show gas-distended intestinal loops and foreign material in the GI tract. The turtle passed some plastic fragments in feces. During necropsy, the entire GI tract was opened for examination.',
    subTasks: [
      {
        id: 'lab3-st1',
        type: 'stomach',
        description:
          'Examine the stomach and intestinal contents. Identify which items are anthropogenic (human-made) debris versus natural food items for a Kemp\'s ridley turtle.',
        items: [
          { id: 'lab3-s1', label: 'Fragment of blue plastic bag', isTarget: true, shape: 'plasticBag' },
          { id: 'lab3-s2', label: 'Crab exoskeleton pieces (natural prey)', isTarget: false, shape: 'crab' },
          { id: 'lab3-s3', label: 'Piece of ballpoint pen cap', isTarget: true, shape: 'penCap' },
          { id: 'lab3-s4', label: 'Small shrimp remains (natural prey)', isTarget: false, shape: 'shrimp' },
          { id: 'lab3-s5', label: 'Degraded balloon fragment with ribbon', isTarget: true, shape: 'balloon' },
          { id: 'lab3-s6', label: 'Monofilament fishing line tangle', isTarget: true, shape: 'fishingLine' },
          { id: 'lab3-s7', label: 'Seagrass blades (incidental ingestion)', isTarget: false, shape: 'seagrass' },
          { id: 'lab3-s8', label: 'Foam polystyrene pellets (microplastics)', isTarget: true, shape: 'polystyrene' },
          { id: 'lab3-s9', label: 'Small mollusk shell fragments (natural prey)', isTarget: false, shape: 'mollusk' },
          { id: 'lab3-s10', label: 'Rubber band', isTarget: true, shape: 'rubberBand' },
        ],
        correctAnswer: 'lab3-s1,lab3-s3,lab3-s5,lab3-s6,lab3-s8,lab3-s10',
        points: 50,
        explanation:
          'Kemp\'s ridleys are primarily crab-eaters (carcinivores) but will consume other invertebrates. The plastic bag, pen cap, balloon fragment, fishing line, polystyrene pellets, and rubber band are all anthropogenic debris. Plastic ingestion can cause intestinal obstruction, perforation, starvation (from false satiation), and buoyancy disorders from trapped gas.',
      },
      {
        id: 'lab3-st2',
        type: 'necropsy',
        description:
          'The intestines show areas of redness (hyperemia) and one section is dark purple to black with a pinpoint hole. What is the most accurate pathological finding?',
        options: [
          'Normal intestinal coloring — no pathology present',
          'Intestinal impaction with secondary necrosis and perforation from plastic debris',
          'Infectious enteritis (bacterial intestinal infection)',
          'Intestinal parasitic infestation',
        ],
        correctAnswer: 'Intestinal impaction with secondary necrosis and perforation from plastic debris',
        points: 50,
        explanation:
          'The dark purple-to-black discoloration indicates intestinal necrosis — tissue death from compromised blood supply. The pinpoint hole is a perforation, likely caused by a sharp piece of plastic cutting through the weakened intestinal wall. This leads to septic coelomitis (abdominal infection) and is typically fatal. This is one of the most common lethal outcomes of marine debris ingestion.',
      },
      {
        id: 'lab3-st3',
        type: 'bloodGas',
        description:
          'Pre-mortem bloodwork showed pH 7.18 (normal: 7.35-7.45), lactate 12 mmol/L (normal: <2 mmol/L), and potassium 7.8 mEq/L (normal: 3.5-5.5 mEq/L). What does this indicate?',
        options: [
          'Metabolic alkalosis from vomiting',
          'Normal electrolyte balance',
          'Severe metabolic acidosis with lactic acidemia and hyperkalemia — consistent with tissue necrosis and sepsis',
          'Respiratory alkalosis from hyperventilation',
        ],
        correctAnswer: 'Severe metabolic acidosis with lactic acidemia and hyperkalemia — consistent with tissue necrosis and sepsis',
        points: 50,
        explanation:
          'The low pH (acidosis), elevated lactate (from anaerobic tissue metabolism due to necrosis), and high potassium (released from dying cells) are consistent with severe sepsis secondary to intestinal perforation. This blood gas profile indicates a terminal state where tissues are not receiving adequate oxygen and cells are dying.',
      },
    ],
  },

  // ── Case 4: Cold Stunning ───────────────────────────────────────────
  {
    id: 'lab4',
    species: 'Green',
    patientHistory:
      'Juvenile green turtle, SCL 30 cm, recovered from Cape Cod Bay, MA during a November cold-stunning event. Water temperature was 9 degrees C. Turtle is lethargic, minimally responsive to stimuli. Core body temperature on arrival was 10 degrees C. Blood samples taken before warming protocol initiated.',
    subTasks: [
      {
        id: 'lab4-st1',
        type: 'bloodGas',
        description:
          'Arterial blood gas results: pH 7.08, pCO2 58 mmHg (normal: 25-40 mmHg), HCO3 14 mEq/L (normal: 22-28 mEq/L), lactate 8.2 mmol/L (normal: <2 mmol/L). Interpret these results.',
        options: [
          'Normal blood gas values for a sea turtle',
          'Respiratory alkalosis — the turtle is hyperventilating',
          'Mixed respiratory and metabolic acidosis — consistent with cold stunning',
          'Isolated metabolic alkalosis from prolonged fasting',
        ],
        correctAnswer: 'Mixed respiratory and metabolic acidosis — consistent with cold stunning',
        points: 40,
        explanation:
          'The low pH (acidosis) has two components: elevated pCO2 (respiratory acidosis from depressed breathing at low body temperatures) and low HCO3 with elevated lactate (metabolic acidosis from anaerobic metabolism in cold, poorly perfused tissues). This mixed acid-base disturbance is the hallmark blood gas finding in cold-stunned sea turtles.',
      },
      {
        id: 'lab4-st2',
        type: 'bloodGas',
        description:
          'Additional bloodwork shows glucose 180 mg/dL (normal: 60-120 mg/dL), blood urea nitrogen 95 mg/dL (normal: 20-60 mg/dL), creatine kinase (CK) 4,200 U/L (normal: <500 U/L), and white blood cell count 1,200 cells/uL (normal: 5,000-12,000 cells/uL). What is the clinical significance?',
        options: [
          'Stress hyperglycemia, dehydration, muscle damage, and immune suppression — all consistent with cold-stunning syndrome',
          'Diabetes, kidney failure, and leukemia — unrelated to cold stunning',
          'Normal values — no treatment needed',
          'Liver failure causing all abnormalities',
        ],
        correctAnswer: 'Stress hyperglycemia, dehydration, muscle damage, and immune suppression — all consistent with cold-stunning syndrome',
        points: 40,
        explanation:
          'High glucose is a stress response (catecholamine release). Elevated BUN indicates dehydration (prerenal azotemia). Markedly elevated CK reflects skeletal muscle damage from cold-induced ischemia. Profoundly low white blood cells (leukopenia) reflects immune suppression — cold-stunned turtles are highly susceptible to secondary infections. This panel is diagnostic for cold-stunning syndrome.',
      },
      {
        id: 'lab4-st3',
        type: 'necropsy',
        description:
          'What is the most important treatment principle when warming a severely cold-stunned turtle?',
        options: [
          'Warm the turtle as rapidly as possible using hot water',
          'Warm slowly — no more than 3-5 degrees C per day — to prevent reperfusion injury and cardiac arrhythmias',
          'Do not warm the turtle — let it acclimate on its own in room-temperature water',
          'Only warm the head region and let the body follow',
        ],
        correctAnswer: 'Warm slowly — no more than 3-5 degrees C per day — to prevent reperfusion injury and cardiac arrhythmias',
        points: 70,
        explanation:
          'Rapid warming causes sudden vasodilation, which can lead to cardiovascular collapse and reperfusion injury (damaging ischemic tissues with sudden blood flow return). The standard protocol is to increase water temperature by no more than 3-5 degrees C per day, with continuous monitoring for cardiac arrhythmias. Cold-stunned turtles should also receive fluid therapy and antibiotics to prevent secondary infections during the immunosuppressed recovery period.',
      },
    ],
  },

];
