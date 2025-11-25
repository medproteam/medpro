import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/BottomNav';
import { BookOpen, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const MEDICAL_TERMS = [
  { term: 'Abdomen', definition: 'The part of the body between the chest and pelvis containing digestive organs.' },
  { term: 'Acute', definition: 'Sudden onset, sharp, severe; not chronic or long-term.' },
  { term: 'Adrenaline', definition: 'A hormone released in response to stress that increases heart rate and blood pressure.' },
  { term: 'Allergen', definition: 'A substance that causes an allergic reaction.' },
  { term: 'Allergy', definition: 'An abnormal immune response to a substance that is normally harmless.' },
  { term: 'Anemia', definition: 'A condition where you lack enough healthy red blood cells to carry adequate oxygen.' },
  { term: 'Anesthesia', definition: 'Loss of sensation or awareness, usually induced for medical procedures.' },
  { term: 'Antibiotic', definition: 'A medicine that inhibits the growth of or destroys microorganisms.' },
  { term: 'Antibody', definition: 'A protein produced by the immune system to fight foreign substances.' },
  { term: 'Artery', definition: 'A blood vessel that carries blood away from the heart.' },
  { term: 'Arthritis', definition: 'Inflammation of one or more joints, causing pain and stiffness.' },
  { term: 'Asthma', definition: 'A respiratory condition marked by spasms in the bronchi, causing difficulty breathing.' },
  { term: 'Autoimmune', definition: 'A condition where the immune system attacks the body\'s own tissues.' },
  { term: 'Bacteria', definition: 'Single-celled microorganisms that can cause infection.' },
  { term: 'Benign', definition: 'Not cancerous or dangerous to health.' },
  { term: 'Biopsy', definition: 'A procedure to remove a sample of tissue for laboratory examination.' },
  { term: 'Blood Pressure', definition: 'The force of blood pushing against artery walls.' },
  { term: 'Bronchitis', definition: 'Inflammation of the bronchial tubes in the lungs.' },
  { term: 'Cancer', definition: 'A disease caused by uncontrolled cell growth.' },
  { term: 'Carcinogen', definition: 'A substance capable of causing cancer.' },
  { term: 'Cardiac', definition: 'Relating to the heart.' },
  { term: 'Cardiovascular', definition: 'Relating to the heart and blood vessels.' },
  { term: 'Cataract', definition: 'Clouding of the lens in the eye affecting vision.' },
  { term: 'Chemotherapy', definition: 'Treatment using drugs to destroy cancer cells.' },
  { term: 'Cholesterol', definition: 'A waxy substance in blood that can cause artery blockage.' },
  { term: 'Chronic', definition: 'Persisting for a long time or constantly recurring.' },
  { term: 'Cirrhosis', definition: 'Scarring of the liver caused by long-term damage.' },
  { term: 'Clot', definition: 'A thickened mass of blood.' },
  { term: 'Coma', definition: 'A state of prolonged unconsciousness.' },
  { term: 'Concussion', definition: 'A brain injury caused by a blow to the head.' },
  { term: 'Congenital', definition: 'Present from birth.' },
  { term: 'CT Scan', definition: 'Computed Tomography, an imaging procedure using X-rays to create detailed body images.' },
  { term: 'Cyst', definition: 'A closed sac filled with fluid or other material.' },
  { term: 'Dehydration', definition: 'Excessive loss of body water.' },
  { term: 'Dementia', definition: 'Decline in mental ability severe enough to interfere with daily life.' },
  { term: 'Dermatology', definition: 'The branch of medicine dealing with skin disorders.' },
  { term: 'Diabetes', definition: 'A chronic condition affecting how your body processes blood sugar (glucose).' },
  { term: 'Diagnosis', definition: 'The identification of a disease or condition by examining symptoms.' },
  { term: 'Dialysis', definition: 'A treatment that filters waste from blood when kidneys fail.' },
  { term: 'Diarrhea', definition: 'Frequent loose or liquid bowel movements.' },
  { term: 'Diuretic', definition: 'A substance that promotes urine production.' },
  { term: 'Dosage', definition: 'The amount of medicine to be taken at one time.' },
  { term: 'ECG/EKG', definition: 'Electrocardiogram, a test recording the electrical activity of the heart.' },
  { term: 'Eczema', definition: 'A condition causing inflamed, itchy, cracked skin.' },
  { term: 'Edema', definition: 'Swelling caused by excess fluid trapped in body tissues.' },
  { term: 'Embolism', definition: 'Blockage of a blood vessel by a blood clot or other substance.' },
  { term: 'Emphysema', definition: 'A lung condition causing shortness of breath.' },
  { term: 'Endocrine', definition: 'Relating to glands that secrete hormones.' },
  { term: 'Endoscopy', definition: 'Examination of internal organs using a flexible tube with a camera.' },
  { term: 'Enzyme', definition: 'A protein that speeds up chemical reactions in the body.' },
  { term: 'Epidemic', definition: 'Rapid spread of disease affecting many people.' },
  { term: 'Epilepsy', definition: 'A neurological disorder causing recurring seizures.' },
  { term: 'Fracture', definition: 'A broken bone.' },
  { term: 'Gastric', definition: 'Relating to the stomach.' },
  { term: 'Gastroenteritis', definition: 'Inflammation of the stomach and intestines.' },
  { term: 'Genetic', definition: 'Relating to genes or heredity.' },
  { term: 'Glaucoma', definition: 'Eye condition causing damage to the optic nerve.' },
  { term: 'Glucose', definition: 'A simple sugar that is the body\'s main source of energy.' },
  { term: 'Gout', definition: 'A form of arthritis causing sudden, severe joint pain.' },
  { term: 'Gynecology', definition: 'The branch of medicine dealing with female reproductive health.' },
  { term: 'Hematology', definition: 'The study of blood and blood disorders.' },
  { term: 'Hemorrhage', definition: 'Excessive bleeding.' },
  { term: 'Hepatitis', definition: 'Inflammation of the liver.' },
  { term: 'Hernia', definition: 'Protrusion of an organ through tissue that normally contains it.' },
  { term: 'Histology', definition: 'The study of tissues under a microscope.' },
  { term: 'Hormone', definition: 'A chemical messenger produced by glands.' },
  { term: 'Hospice', definition: 'Care for terminally ill patients focused on comfort.' },
  { term: 'Hypertension', definition: 'High blood pressure, a condition where the force of blood against artery walls is too high.' },
  { term: 'Hypotension', definition: 'Abnormally low blood pressure.' },
  { term: 'Hypothermia', definition: 'Dangerously low body temperature.' },
  { term: 'Immunity', definition: 'The body\'s ability to resist infection.' },
  { term: 'Immunization', definition: 'The process of making someone immune to infection.' },
  { term: 'Incision', definition: 'A surgical cut made in skin or tissue.' },
  { term: 'Infection', definition: 'Invasion and multiplication of microorganisms in body tissues.' },
  { term: 'Inflammation', definition: 'A localized physical condition with heat, swelling, and pain as a reaction to injury or infection.' },
  { term: 'Influenza', definition: 'A viral infection affecting the respiratory system.' },
  { term: 'Inhalation', definition: 'Breathing in.' },
  { term: 'Injection', definition: 'Administering medicine using a needle and syringe.' },
  { term: 'Insulin', definition: 'A hormone regulating blood sugar levels.' },
  { term: 'Intensive Care', definition: 'Medical care for critically ill patients.' },
  { term: 'Intravenous', definition: 'Administered directly into a vein.' },
  { term: 'Jaundice', definition: 'Yellowing of skin and eyes due to liver problems.' },
  { term: 'Kidney', definition: 'An organ that filters waste from blood to create urine.' },
  { term: 'Leukemia', definition: 'Cancer of blood-forming tissues.' },
  { term: 'Ligament', definition: 'Tissue connecting bones or holding organs in place.' },
  { term: 'Lipid', definition: 'Fat or fat-like substance in the blood.' },
  { term: 'Liver', definition: 'A large organ that processes nutrients and filters toxins.' },
  { term: 'Lymph', definition: 'Fluid containing white blood cells that fights infection.' },
  { term: 'Malignant', definition: 'Cancerous and potentially spreading.' },
  { term: 'Mammogram', definition: 'X-ray examination of the breasts.' },
  { term: 'Melanoma', definition: 'The most serious type of skin cancer.' },
  { term: 'Meningitis', definition: 'Inflammation of membranes covering the brain and spinal cord.' },
  { term: 'Metabolism', definition: 'Chemical processes occurring within cells to maintain life.' },
  { term: 'Metastasis', definition: 'Spread of cancer from one part of the body to another.' },
  { term: 'Migraine', definition: 'A severe recurring headache often with nausea and vision problems.' },
  { term: 'MRI', definition: 'Magnetic Resonance Imaging, using magnetic fields to create detailed organ and tissue images.' },
  { term: 'Mucus', definition: 'Thick fluid produced by membranes in the body.' },
  { term: 'Nausea', definition: 'Feeling of sickness with an urge to vomit.' },
  { term: 'Necrosis', definition: 'Death of body tissue.' },
  { term: 'Nephrology', definition: 'The branch of medicine dealing with kidneys.' },
  { term: 'Neurology', definition: 'The branch of medicine dealing with the nervous system.' },
  { term: 'Obesity', definition: 'Excessive body fat that increases health risks.' },
  { term: 'Oncology', definition: 'The study and treatment of cancer.' },
  { term: 'Ophthalmology', definition: 'The branch of medicine dealing with eye disorders.' },
  { term: 'Orthopedics', definition: 'The branch of medicine dealing with bones and joints.' },
  { term: 'Osteoporosis', definition: 'A condition causing bones to become weak and brittle.' },
  { term: 'Palliative', definition: 'Treatment focused on relief rather than cure.' },
  { term: 'Pandemic', definition: 'A disease prevalent over a whole country or the world.' },
  { term: 'Paralysis', definition: 'Loss of muscle function in part of the body.' },
  { term: 'Parasite', definition: 'An organism living in or on another organism.' },
  { term: 'Pathology', definition: 'The study of disease causes and effects.' },
  { term: 'Pediatrics', definition: 'The branch of medicine dealing with children.' },
  { term: 'Pericardium', definition: 'The membrane enclosing the heart.' },
  { term: 'Placebo', definition: 'An inactive substance given as if it were medicine.' },
  { term: 'Plague', definition: 'A contagious bacterial disease.' },
  { term: 'Plasma', definition: 'The liquid part of blood.' },
  { term: 'Pneumonia', definition: 'Infection causing inflammation in the lungs.' },
  { term: 'Prognosis', definition: 'The likely course or outcome of a disease.' },
  { term: 'Prosthesis', definition: 'An artificial body part.' },
  { term: 'Psychiatry', definition: 'The branch of medicine dealing with mental disorders.' },
  { term: 'Pulmonary', definition: 'Relating to the lungs.' },
  { term: 'Quarantine', definition: 'Isolation to prevent spread of disease.' },
  { term: 'Radiation', definition: 'Energy in the form of waves or particles used in treatment.' },
  { term: 'Radiology', definition: 'The use of imaging to diagnose and treat disease.' },
  { term: 'Relapse', definition: 'Return of symptoms after apparent recovery.' },
  { term: 'Remission', definition: 'Temporary disappearance of disease symptoms.' },
  { term: 'Renal', definition: 'Relating to the kidneys.' },
  { term: 'Respiration', definition: 'The process of breathing.' },
  { term: 'Rheumatology', definition: 'The branch of medicine dealing with joint and muscle disorders.' },
  { term: 'Sepsis', definition: 'A life-threatening response to infection.' },
  { term: 'Serum', definition: 'The clear liquid part of blood.' },
  { term: 'Sprain', definition: 'Injury to a ligament caused by excessive stretching.' },
  { term: 'Stenosis', definition: 'Abnormal narrowing of a passage in the body.' },
  { term: 'Steroid', definition: 'A type of hormone used to reduce inflammation.' },
  { term: 'Stroke', definition: 'Sudden interruption of blood supply to the brain.' },
  { term: 'Suture', definition: 'A stitch or row of stitches holding tissue together.' },
  { term: 'Symptom', definition: 'A physical or mental feature indicating a condition.' },
  { term: 'Syndrome', definition: 'A group of symptoms occurring together.' },
  { term: 'Systemic', definition: 'Affecting the entire body.' },
  { term: 'Tachycardia', definition: 'Abnormally rapid heart rate.' },
  { term: 'Tendon', definition: 'Tissue connecting muscle to bone.' },
  { term: 'Therapy', definition: 'Treatment intended to relieve or heal a disorder.' },
  { term: 'Thrombosis', definition: 'Formation of a blood clot inside a blood vessel.' },
  { term: 'Tissue', definition: 'A group of cells working together to perform a function.' },
  { term: 'Toxin', definition: 'A poisonous substance produced by living cells.' },
  { term: 'Transplant', definition: 'Transfer of an organ or tissue from one body to another.' },
  { term: 'Trauma', definition: 'A physical injury or emotional shock.' },
  { term: 'Tumor', definition: 'An abnormal growth of tissue.' },
  { term: 'Ulcer', definition: 'An open sore on the skin or mucous membrane.' },
  { term: 'Ultrasound', definition: 'Imaging technique using sound waves.' },
  { term: 'Urinalysis', definition: 'Laboratory analysis of urine.' },
  { term: 'Urology', definition: 'The branch of medicine dealing with urinary systems.' },
  { term: 'Vaccine', definition: 'A substance used to stimulate immunity against diseases.' },
  { term: 'Vascular', definition: 'Relating to blood vessels.' },
  { term: 'Vein', definition: 'A blood vessel carrying blood toward the heart.' },
  { term: 'Ventilator', definition: 'A machine that helps with breathing.' },
  { term: 'Vertigo', definition: 'A sensation of spinning or dizziness.' },
  { term: 'Virus', definition: 'A tiny infectious agent that replicates inside living cells.' },
  { term: 'Vital Signs', definition: 'Measurements of basic body functions like heart rate and temperature.' },
  { term: 'Vitamin', definition: 'An organic compound essential for normal growth and nutrition.' },
  { term: 'X-ray', definition: 'A form of electromagnetic radiation used for imaging.' },
  { term: 'Zoonosis', definition: 'A disease transmitted from animals to humans.' },
];

export default function MedicalDictionaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    const search = searchTerm.toLowerCase();
    return MEDICAL_TERMS.filter(item => 
      item.term.toLowerCase().startsWith(search)
    ).slice(0, 5);
  }, [searchTerm]);

  const filteredTerms = useMemo(() => {
    if (!searchTerm) return MEDICAL_TERMS;
    const search = searchTerm.toLowerCase();
    return MEDICAL_TERMS.filter(
      item => item.term.toLowerCase().includes(search) || 
              item.definition.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4 sticky top-0 z-40 backdrop-blur-lg">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-medical-cyan" />
          Medical Dictionary
        </h1>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search medical terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="pl-10"
              />
              {showSuggestions && suggestions.length > 0 && (
                <Card className="absolute z-10 w-full mt-1 p-2 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSearchTerm(suggestion.term);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded-md text-sm transition-colors"
                    >
                      <div className="font-semibold">{suggestion.term}</div>
                      <div className="text-xs text-muted-foreground truncate">{suggestion.definition}</div>
                    </button>
                  ))}
                </Card>
              )}
            </div>
          </Card>

          <div className="space-y-3">
            {filteredTerms.map((item, index) => (
              <motion.div
                key={item.term}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.5) }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-medical-cyan mb-2">
                    {item.term}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.definition}
                  </p>
                </Card>
              </motion.div>
            ))}
            {filteredTerms.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No terms found matching "{searchTerm}"</p>
              </Card>
            )}
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}