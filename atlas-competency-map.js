/* ============================================================
   BIO 004 Human Anatomy, Fall 2026
   atlas-competency-map.js

   WHICH ATLAS STRUCTURES COUNT TOWARD WHICH MASTERY OS COMPETENCY.

   Name it mode (atlas-name-it.js) reads this file. When a student
   finishes a Name it round, every structure they marked is looked up
   here, and one evidence entry per competency is written to
   localStorage['bio004-evidence-v1'], the same log Mastery OS reads
   for its weak spot board. The atlas and the course site are both
   served from drsrennie-stack.github.io, so they share that storage.

   Competency ids come from competenciesfall2026.js in the course repo
   (new-build-bio4-solano). card-competency-map.js and loops-index.js
   in that repo map whole topics to whole units. This file is tighter
   on purpose: a heart round where a student missed only valves should
   pull down "Heart valves", not every heart competency at once.

   HOW A STRUCTURE IS MATCHED
   --------------------------
   Each page has a list of groups. A group can narrow by:
     sets     card set keys from the page's DECK.sets
     cards    card numbers (DECK card n)
     match    a case-insensitive pattern tested on the structure name
     exclude  a pattern that takes a structure back out of the group
   Every group a structure fits adds its comps. A structure that fits
   no group is still practiced in Name it, it just logs nothing.

   Only clear matches are mapped: the structure has to be named in, or
   plainly belong to, the competency's own "can" statement. Anything
   doubtful (the deep back muscles, triceps, the joint naming cards,
   nerves and skeletal muscle on vessel slides, and similar) is left
   out rather than guessed at.

   Adding a page later: add one entry keyed by the page's DECK.id.
   ============================================================ */
(function () {
  'use strict';

  var PAGES = {
    abdves: { title: 'Abdominal and Pelvic Vessels', groups: [
      { match: 'abdominal aorta|celiac|mesenteric artery|renal artery|gastric artery|hepatic artery|gastroduodenal|splenic artery|gonadal arter|common iliac artery|portal vein|splenic vein|mesenteric vein',
        comps: ['w5-lab-abdominal-vessels'] }
    ]},

    back: { title: 'Back and Thorax Muscles', groups: [
      { match: 'trapezius|latissimus|rhomboid|levator scapulae|supraspinatus|infraspinatus|teres|subscapularis',
        comps: ['w4-lab-posterior-shoulder-cuff'] },
      { match: 'pectoralis|serratus anterior|deltoid|biceps brachii|brachialis|coracobrachialis',
        comps: ['w4-lab-chest-anterior-arm'] },
      { match: 'intercostal|diaphragm|central tendon', comps: ['resp-thoracic-diaphragm'] },
      { sets: ['wall'], match: 'esophagus|vena cava|^aorta$', comps: ['resp-thoracic-diaphragm'] },
      { match: 'oblique', comps: ['w5-lab-abdominal-wall'] },
      { match: 'sternocleidomastoid', comps: ['w7-lab-neck'] },
      { match: 'epicranius', comps: ['w7-lab-facial-expression'] }
    ]},

    blood: { title: 'Blood', groups: [
      { sets: ['cells'], comps: ['w4-formed-elements'] },
      { sets: ['tube'], comps: ['w4-blood-composition'] }
    ]},

    bodyplan: { title: 'Body Regions, Planes and Cavities', groups: [
      { sets: ['regions'], comps: ['w1-regional-terms'] },
      { sets: ['planes'], match: 'plane', comps: ['w1-planes-sections'] },
      { sets: ['planes'], exclude: 'plane', comps: ['w1-directional-terms'] },
      { sets: ['cavities'], match: 'quadrant', comps: ['w1-abdominopelvic-map'] },
      { sets: ['cavities'], match: 'parietal|visceral|serous', comps: ['w1-serous-membranes'] },
      { sets: ['cavities'], match: 'pleural cavity|peritoneal cavity', comps: ['w1-body-cavities'] },
      { match: '^mediastinum', comps: ['w1-mediastinum'] },
      { match: 'retroperitoneal', comps: ['w1-peritoneum-relationships'] }
    ]},

    bonetissue: { title: 'Cartilage, Bone Tissue and the Long Bone', groups: [
      { cards: [1, 2, 3, 4, 5, 6], comps: ['w2-cartilage-types'] },
      { cards: [7, 8, 9], comps: ['w2-compact-spongy'] },
      { sets: ['bone'], comps: ['w2-long-bone-gross'] }
    ]},

    brain: { title: 'Brain and Cranial Nerves', groups: [
      { sets: ['meninges', 'dura'], comps: ['w7-cranial-meninges'] },
      { sets: ['cerebrum'], match: 'lobe|sulcus|gyrus|fissure|insula', comps: ['w7-cerebrum-surface'] },
      { match: '^cerebellum$', comps: ['w7-cerebellum'] },
      { match: '^corpus callosum$', comps: ['w7-white-matter-tracts'] },
      { sets: ['stem'], match: 'thalamus|pineal|third ventricle|massa intermedia|hypothalamus', comps: ['w7-diencephalon'] },
      { sets: ['stem'], match: 'midbrain|pons|medulla oblongata', comps: ['w7-brainstem-regions'] },
      { sets: ['stem'], match: 'corpora quadrigemina', comps: ['w7-midbrain'] },
      { match: 'ventricle|interventricular foramen|cerebral aqueduct|central canal', comps: ['w7-ventricles'] },
      { sets: ['vessels'], match: 'cerebral|communicating|carotid|basilar|vertebral|cerebellar', comps: ['w7-circle-of-willis'] },
      { sets: ['cn'], comps: ['w8-cranial-nerves'] }
    ]},

    bvessels: { title: 'Blood Vessels', groups: [
      { match: 'tunica|elastic lamina|vasa vasorum', comps: ['bvn-vessel-tunics'] },
      { match: '^artery$|^vein$|arteriole', comps: ['bvn-vessel-types'] },
      { match: '^valve$', comps: ['bvn-artery-cap-vein-kinds'] }
    ]},

    digest: { title: 'Digestive System and Abdominal Wall', groups: [
      { match: 'fundus|cardiac region|curvature|body of stomach|pyloric|rugae', comps: ['w5-stomach'] },
      { match: 'sphincter', comps: ['w5-canal-sphincters'] },
      { match: '^esophagus$', comps: ['w5-mouth-pharynx-esophagus'] },
      { match: 'duodenum|jejunum|ileum$|small intestine|plicae', comps: ['w5-small-intestine'] },
      { match: 'colon|cecum|appendix|rectum|haustra|teniae|flexure|ileocecal', comps: ['w5-large-intestine'] },
      { match: 'lobe of liver|caudate|quadrate|falciform|ligamentum teres|hepatocyte|sinusoid|lobule|portal triad|central vein|branch of hepatic', comps: ['w5-liver-gross-lobule'] },
      { match: 'gallbladder|hepatic duct|cystic duct|bile duct|bile canaliculi|ampulla', comps: ['w5-bile-path'] },
      { match: 'pancrea', comps: ['w5-pancreas'] },
      { match: 'parotid|submandibular|sublingual', comps: ['w5-salivary-glands'] },
      { match: 'rectus|linea alba|oblique|transversus', comps: ['w5-lab-abdominal-wall'] },
      { match: 'peritoneum|omentum|mesentery', comps: ['w5-peritoneum-folds'] }
    ]},

    headneck: { title: 'Eye Muscles', groups: [
      { sets: ['eye', 'eyem'], comps: ['w7-lab-extraocular'] }
    ]},

    heart: { title: 'Heart', groups: [
      { match: 'valve|tricuspid|bicuspid|mitral|semilunar|pulmonic', comps: ['cv-valves'] },
      { match: 'chordae|papillary', comps: ['cv-valve-support'] },
      { match: 'atrium|ventricle|septum', comps: ['cv-chambers'] },
      { match: 'pericardium|epicardium|myocardium|endocardium|auricle|pectinate|fossa ovalis|trabeculae|apex of the heart|base of the heart|coronary sulcus', comps: ['cv-surfaces'] },
      { match: 'aort|vena cava|pulmonary trunk|pulmonary vein|pulmonary arter|brachiocephalic trunk|common carotid|subclavian artery', exclude: 'valve', comps: ['bvn-great-vessels'] },
      { match: 'coronary|interventricular artery|circumflex|cardiac vein', comps: ['cv-coronary'] },
      { match: 'node|bundle|purkinje', comps: ['cv-conduction-anat'] },
      { match: 'ligamentum arteriosum|fossa ovalis', comps: ['bvn-fetal-remnants'] },
      { match: '^thoracic cavity$', comps: ['w1-body-cavities'] },
      { match: '^mediastinum$', comps: ['w1-mediastinum'] }
    ]},

    joints: { title: 'Joints', groups: [
      { sets: ['knee'], comps: ['w2-shoulder-knee'] }
    ]},

    leg: { title: 'Leg Muscles', groups: [
      { match: 'tibialis|extensor digitorum|fibularis|soleus|gastrocnemius|calcaneal tendon', comps: ['w5-lab-leg-muscles'] },
      { match: 'artery|nerve', comps: ['w5-lab-lower-limb-vessels-nerves'] }
    ]},

    muscle: { title: 'Muscle Tissue', groups: [
      { sets: ['histo'], comps: ['w1-muscle-tissue-id', 'w4-muscle-tissue-types'] },
      { match: 'myofibril|sarcoplasm|tubule|triad|cistern|sarcolemma', comps: ['w4-muscle-fiber-parts'] },
      { match: 'sarcomere|band|zone|line|disc', comps: ['w4-sarcomere'] }
    ]},

    repro: { title: 'Reproductive System', groups: [
      { match: '^ovary$|ovarian ligament|suspensory ligament', comps: ['w6-ovary'] },
      { match: 'uterine tube|fimbriae', comps: ['w6-ovum-path'] },
      { match: 'uterus|myometrium|endometrium|cervix|internal os|broad ligament', comps: ['w6-uterus'] },
      { match: 'vagina|fornix|clitoris|labia|mons pubis', comps: ['w6-vagina-vulva'] },
      { match: 'testis|scrotum|cremaster', comps: ['w6-scrotum-testes'] },
      { match: 'ductus|epididymis|ejaculatory|spermatic cord|inguinal canal|testicular|pampiniform|prostatic urethra|membranous urethra|spongy', comps: ['w6-sperm-path'] },
      { match: 'seminal vesicle|prostate gland|penis|corpus|prepuce|bulbourethral', comps: ['w6-male-glands-penis'] },
      { match: 'urinary bladder|urethra|ureteral', comps: ['w6-urine-path'] }
    ]},

    resp: { title: 'Respiratory System', groups: [
      { match: 'thyroid cartilage|cricoid|arytenoid|cuneiform|corniculate|epiglottis|vocal|glottis|laryngeal prominence|cricothyroid|^larynx$', comps: ['resp-larynx'] },
      { match: 'trache|bronch|carina', comps: ['resp-tree'] },
      { match: 'lobe|fissure|^apex$|^base$|hilum|diaphragmatic surface|pleura', comps: ['resp-lungs-pleura'] },
      { match: 'alveol|pulmonary capillar|capillaries surrounding', comps: ['resp-histo'] },
      { match: 'nasal|nares|concha|meatus|nasopharynx|oropharynx|laryngopharynx', comps: ['resp-upper-tract'] },
      { match: 'palate|uvula|tonsil|^esophagus$', comps: ['w5-mouth-pharynx-esophagus'] },
      { match: 'pseudostratified', comps: ['w1-epithelial-id'] }
    ]},

    skeleton: { title: 'Vertebrae, Pelvis and Lower Limb Bones', groups: [
      { cards: [1, 5, 6], comps: ['w2-regional-vertebrae'] },
      { cards: [2, 3, 4], comps: ['w2-typical-vertebra'] },
      { cards: [2, 3, 4], match: 'transverse foramen|costal facet', comps: ['w2-regional-vertebrae'] },
      { sets: ['pelvis'], exclude: 'joint|^sacrum$', comps: ['w2-pelvic-girdle'] },
      { cards: [11, 12], comps: ['w2-thigh-knee'] },
      { cards: [13, 14], comps: ['w2-leg-bones'] },
      { cards: [15], comps: ['w2-foot-bones'] }
    ]},

    skin: { title: 'Integumentary System (Skin)', groups: [
      { match: '^epidermis$|^dermis$|^hypodermis$|dense irregular', comps: ['w1-skin-layers'] },
      { match: 'stratum', comps: ['w1-epidermal-strata'] },
      { match: 'papillary dermis|reticular dermis|dermal papilla|epidermal ridge|meissner|lamellated|capillary loops|free nerve', comps: ['w1-dermis-layers'] },
      { match: 'gland|hair|arrector', comps: ['w1-skin-accessory'] }
    ]},

    spinal: { title: 'Spinal Cord', groups: [
      { cards: [1, 2], comps: ['w8-cord-external'] },
      { cards: [3], comps: ['w7-spinal-meninges-spaces'] },
      { cards: [4], comps: ['w8-cord-roots'] }
    ]},

    thigh: { title: 'Thigh and Gluteal Muscles', groups: [
      { match: 'gluteus|rectus femoris|vastus|sartorius|gracilis|adductor|tensor|iliotibial|hamstring|biceps femoris|semitendinosus|semimembranosus|piriformis|iliopsoas',
        comps: ['w5-lab-thigh-gluteal'] },
      { match: 'femoral nerve|femoral vein|femoral artery|sciatic nerve', comps: ['w5-lab-lower-limb-vessels-nerves'] }
    ]},

    tissues: { title: 'Epithelial and Connective Tissues', groups: [
      { sets: ['epi'], comps: ['w1-epithelial-id'] },
      { cards: [1], match: 'junction|desmosome', comps: ['w1-cell-junctions'] },
      { sets: ['ct'], comps: ['w1-connective-id'] }
    ]},

    uevn: { title: 'Upper Limb Vessels and Nerves', groups: [
      { match: 'subclavian|axillary artery|axillary vein|brachial artery|radial artery|ulnar artery|palmar arch|cephalic vein|basilic vein|median cubital', comps: ['w4-lab-ue-arteries-veins'] },
      { match: 'axillary nerve|musculocutaneous|radial nerve|median nerve|ulnar nerve|brachial plexus|lateral cord|medial cord|posterior cord', comps: ['w4-lab-ue-nerves'] },
      { match: 'aortic arch|superior vena cava|pulmonary trunk|common carotid', comps: ['bvn-great-vessels'] }
    ]},

    ulbones: { title: 'Upper Limb Bones and Sternum', groups: [
      { sets: ['girdle'], exclude: 'joint|^humerus$', comps: ['w2-pectoral-girdle'] },
      { sets: ['girdle'], match: '^humerus$', comps: ['w2-arm-forearm'] },
      { sets: ['arm', 'forearm'], exclude: 'joint|interosseous', comps: ['w2-arm-forearm'] },
      { sets: ['hand'], comps: ['w2-hand-bones'] },
      { sets: ['thorax'], comps: ['w2-thoracic-cage'] }
    ]},

    upper: { title: 'Upper Extremity Muscles', groups: [
      { match: 'trapezius|latissimus|rhomboid|levator scapulae|supraspinatus|infraspinatus|teres|subscapularis',
        comps: ['w4-lab-posterior-shoulder-cuff'] },
      { match: 'pectoralis|serratus anterior|deltoid|biceps brachii|brachialis|coracobrachialis',
        comps: ['w4-lab-chest-anterior-arm'] },
      { match: 'flexor carpi|flexor digitorum|flexor pollicis longus|extensor carpi|extensor digitorum|extensor digiti minimi|extensor pollicis|extensor indicis|abductor pollicis longus|palmaris|pronator|supinator|brachioradialis',
        comps: ['w4-lab-forearm-compartments'] },
      { match: 'frontalis|epicranius|orbicularis|zygomaticus|levator labii|levator anguli|nasalis|risorius|mentalis|depressor|buccinator|platysma',
        comps: ['w7-lab-facial-expression'] },
      { match: 'masseter|temporalis|pterygoid', comps: ['w7-lab-mastication'] },
      { match: 'sternocleidomastoid', comps: ['w7-lab-neck'] },
      { match: 'intercostal', comps: ['resp-thoracic-diaphragm'] },
      { match: 'oblique', comps: ['w5-lab-abdominal-wall'] }
    ]},

    urinary: { title: 'Urinary System', groups: [
      { match: 'renal capsule|renal fascia|perirenal|hilum|^kidney$|left kidney|right kidney', comps: ['w6-kidney-gross'] },
      { match: 'cortex|medulla|renal column|pyramid|papilla|calyx|renal pelvis|renal sinus', comps: ['w6-kidney-internal'] },
      { match: 'segmental|interlobar|arcuate|cortical radiate|renal artery|renal vein|afferent arteriole', comps: ['w6-kidney-bloodsupply'] },
      { match: 'corpuscle|glomerul|convoluted|nephron loop|collecting duct|hairpin', comps: ['w6-nephron-parts'] },
      { match: 'macula densa|juxtaglomerular', comps: ['w6-jga-filtration'] },
      { match: 'ureter|bladder|detrusor|trigone|urethra|sphincter', comps: ['w6-urine-path'] },
      { match: '^prostate gland$', comps: ['w6-male-glands-penis'] },
      { sets: ['gross', 'histo'], match: 'transitional epithelium', comps: ['w1-epithelial-id'] }
    ]}
  };

  var cache = {};
  function rx(src) {
    if (!src) return null;
    return cache[src] || (cache[src] = new RegExp(src, 'i'));
  }

  /* compsFor('heart', card, 'Tricuspid valve') -> ['cv-valves']
     card is the DECK card object (needs .set and .n). */
  function compsFor(pageId, card, name) {
    var page = PAGES[pageId];
    if (!page) return [];
    var out = [];
    var nm = String(name || '').trim();
    page.groups.forEach(function (g) {
      if (g.sets && g.sets.indexOf(card.set) < 0) return;
      if (g.cards && g.cards.indexOf(card.n) < 0) return;
      if (g.match && !rx(g.match).test(nm)) return;
      if (g.exclude && rx(g.exclude).test(nm)) return;
      g.comps.forEach(function (c) { if (out.indexOf(c) < 0) out.push(c); });
    });
    return out;
  }

  window.ATLAS_COMPETENCY_MAP = { pages: PAGES, compsFor: compsFor };
})();
