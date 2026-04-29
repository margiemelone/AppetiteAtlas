import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts';
import founderPhoto from './founder.jpg';

// =============================================================================
// APPETITE ATLAS — Unified App
// =============================================================================
// Marketing site + v3 assessment (TFEQ-R21 + RED-13 + Satisfaction module)
// + post-results behavioral consultation CTA.
//
// STRUCTURE
//   1. Brand & content constants (FOUNDER_NAME, etc.)
//   2. Instruments (TFEQ-R21, RED-13, satisfaction module options)
//   3. Scoring + phenotypes
//   4. Hooks & global styles
//   5. Shared (Logo, Button, SectionHeader, PrototypeBanner)
//   6. Marketing site
//   7. Assessment screens (Context → Satisfaction → TFEQ → RED → Demo → Results)
//   8. Main App (routing between site & assessment)
//
// PLACEHOLDERS TO REPLACE BEFORE LAUNCH (search the file):
//   • FOUNDER_NAME              — top of file
//   • CONTACT_EMAIL             — top of file
//   • FOUNDER_BIO               — about section
//   • Photo                     — about section gradient placeholder
//
// LEGAL NOTES (don't change without re-running analysis):
//   • Founder is PhD eating-behavior scientist, NOT licensed RDN/LDN.
//   • The 1:1 offering is a *behavioral consultation* — educational only.
//   • "PROTOTYPE" banner stays on assessment screens because the validated
//     instrument items shown are placeholder wording. Required academic honesty.
// =============================================================================


// =============================================================================
// 1. BRAND & CONTENT CONSTANTS
// =============================================================================

const BRAND_NAME = 'Appetite Atlas';
const FOUNDER_NAME = 'Margaret Melone';
const CONTACT_EMAIL = 'margie@appetiteatlas.health';

const COLORS = {
  cream:      '#F5F1E8',
  card:       '#FEFCF7',
  text:       '#1C1A17',
  muted:      '#5C574D',
  mutedSoft:  '#807966',
  border:     '#E5DFD1',
  borderDark: '#CFC6B2',
  forest:     '#2D4739',
  forestDark: '#1F3327',
  terracotta: '#C8664A',
  amber:      '#D9A648',
  sage:       '#A8B5A3',
};

const FONT_SERIF = '"Instrument Serif", Georgia, serif';
const FONT_SANS  = '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif';
const FONT_MONO  = '"IBM Plex Mono", ui-monospace, monospace';


// =============================================================================
// 2. INSTRUMENTS
// =============================================================================
// NOTE: TFEQ-R21 items below are working prototype items closely
// reflecting published wording. Final production items must use the officially
// validated versions (Karlsson et al. 2000 / de Lauzon et al. 2004 for
// TFEQ-R21, licensed via Mapi Research Trust / ePROVIDE).
// RED-13 items are taken from Vainik et al. 2019 (Obesity 27:325-331),
// Table 1, with subscale assignments per the original Mason et al. 2017
// validation paper. Pending written confirmation from Mason regarding the
// canonical wording, particularly item RED3 (publisher typo corrected to
// "It is difficult..." from "If it difficult...").

const TFEQ_ITEMS = [
  { id: 'cr1', text: 'I deliberately take small helpings as a means of controlling my weight.', scale: 'CR' },
  { id: 'cr2', text: 'I consciously hold back at meals in order not to gain weight.', scale: 'CR' },
  { id: 'cr3', text: 'I do not eat some foods because they make me fat.', scale: 'CR' },
  { id: 'cr4', text: 'I avoid stocking up on tempting foods.', scale: 'CR' },
  { id: 'cr5', text: 'I am likely to consciously eat less than I want.', scale: 'CR' },
  { id: 'cr6', text: 'On a typical day, I pay close attention to what I eat.', scale: 'CR' },

  { id: 'ue1', text: 'Sometimes when I start eating, I just can’t seem to stop.', scale: 'UE' },
  { id: 'ue2', text: 'Being with someone who is eating often makes me hungry enough to eat too.', scale: 'UE' },
  { id: 'ue3', text: 'When I smell a delicious food, I find it very difficult to keep from eating—even if I just finished a meal.', scale: 'UE' },
  { id: 'ue4', text: 'I am always hungry enough to eat at any time.', scale: 'UE' },
  { id: 'ue5', text: 'I’m always hungry, so it’s hard for me to stop eating before I finish everything on my plate.', scale: 'UE' },
  { id: 'ue6', text: 'When I see a real delicacy, I often get so hungry that I have to eat right away.', scale: 'UE' },
  { id: 'ue7', text: 'Sometimes I get so hungry that my stomach feels like a bottomless pit.', scale: 'UE' },
  { id: 'ue8', text: 'I often feel so hungry that I just have to eat something.', scale: 'UE' },
  { id: 'ue9', text: 'When I feel hungry, I find it hard to wait until mealtime.', scale: 'UE' },

  { id: 'ee1', text: 'When I feel anxious, I find myself eating.', scale: 'EE' },
  { id: 'ee2', text: 'When I feel blue, I often overeat.', scale: 'EE' },
  { id: 'ee3', text: 'When I feel lonely, I console myself by eating.', scale: 'EE' },
  { id: 'ee4', text: 'When I feel tense or wound up, I have the urge to eat.', scale: 'EE' },
  { id: 'ee5', text: 'When I feel sad or discouraged, I often eat too much.', scale: 'EE' },
  { id: 'ee6', text: 'When I feel irritated or angry, I often have an urge to eat.', scale: 'EE' },
];

const TFEQ_OPTIONS = [
  { value: 1, label: 'Definitely false' },
  { value: 2, label: 'Mostly false' },
  { value: 3, label: 'Mostly true' },
  { value: 4, label: 'Definitely true' },
];

const RED_ITEMS = [
  // Loss of Control (LOC) — 6 items
  { id: 'red1',  text: 'I feel out of control in the presence of delicious food.', scale: 'LOC' },
  { id: 'red2',  text: 'When I start eating, I just can’t seem to stop.', scale: 'LOC' },
  { id: 'red3',  text: 'It is difficult for me to leave food on my plate.', scale: 'LOC' },
  { id: 'red4',  text: 'When it comes to foods I love, I have no willpower.', scale: 'LOC' },
  { id: 'red11', text: 'I find myself continuing to consume certain foods even though I am no longer hungry.', scale: 'LOC' },
  { id: 'red13', text: 'If food tastes good to me, I eat more than usual.', scale: 'LOC' },

  // Lack of Satiety (LOS) — 3 items
  { id: 'red5',  text: 'I get so hungry that my stomach often feels like a bottomless pit.', scale: 'LOS' },
  { id: 'red6',  text: 'I don’t get full easily.', scale: 'LOS' },
  { id: 'red10', text: 'I feel hungry all the time.', scale: 'LOS' },

  // Preoccupation With Food (PWF) — 4 items
  { id: 'red7',  text: 'It seems like most of my waking hours are preoccupied by thoughts about eating or not eating.', scale: 'PWF' },
  { id: 'red8',  text: 'I have days when I can’t seem to think about anything else but food.', scale: 'PWF' },
  { id: 'red9',  text: 'Food is always on my mind.', scale: 'PWF' },
  { id: 'red12', text: 'I can’t stop thinking about eating no matter how hard I try.', scale: 'PWF' },
];

const RED_OPTIONS = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neither agree nor disagree' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
];

const GLP1_QUESTIONS = [
  { id: 'medication', q: 'Which medication are you currently taking?',
    options: ['Semaglutide (Ozempic)', 'Semaglutide (Wegovy)', 'Tirzepatide (Mounjaro)', 'Tirzepatide (Zepbound)', 'Liraglutide (Saxenda / Victoza)', 'Other GLP-1 / GIP agonist', 'Not currently taking one'] },
  { id: 'duration', q: 'How long have you been taking it?',
    options: ['Less than 4 weeks', '1–3 months', '3–6 months', '6–12 months', 'More than 12 months', 'Not currently taking'] },
  { id: 'dose_phase', q: 'Where are you in your titration?',
    options: ['Starting dose', 'Mid-titration', 'At therapeutic dose', 'Maintenance', 'Tapering off', 'Not sure'] },
  { id: 'reason', q: 'What’s the primary reason you’re taking it?',
    options: ['Weight management', 'Type 2 diabetes', 'Both weight and diabetes', 'PCOS or metabolic health', 'Other'] },
  { id: 'prior_attempts', q: 'Any prior attempts at GLP-1 therapy?',
    options: ['This is my first time', 'One prior attempt', 'Multiple prior attempts'] },
];

const SATISFACTION_SLIDERS = [
  { id: 'sat_overall', label: 'Overall, how satisfied are you with your GLP-1 experience?' },
  { id: 'sat_food',    label: 'How would you rate your current relationship with food?' },
];

const PLATEAU_OPTIONS = [
  'Yes, a clear plateau',
  'Some slowing',
  'No, still progressing',
  'Not sure yet',
];

const TRAJECTORY_OPTIONS = [
  'Significantly better',
  'Somewhat better',
  'About the same',
  'Somewhat worse',
  'Significantly worse',
];

const FRUSTRATION_OPTIONS = [
  'Nausea or GI side effects',
  'Cost or insurance hassles',
  'Plateaus or slow progress',
  'Fear of stopping the medication',
  'Social situations and eating out',
  'Fatigue or low energy',
  'Food not feeling enjoyable anymore',
  'Feeling judged for taking it',
  'None of these — it’s been smooth',
];


// =============================================================================
// 3. SCORING + PHENOTYPES
// =============================================================================

function transformTo100(raw, lowest, range) {
  return ((raw - lowest) / range) * 100;
}

function scoreTFEQ(answers) {
  const crItems = TFEQ_ITEMS.filter(i => i.scale === 'CR');
  const ueItems = TFEQ_ITEMS.filter(i => i.scale === 'UE');
  const eeItems = TFEQ_ITEMS.filter(i => i.scale === 'EE');
  const sum = (items) => items.reduce((acc, it) => acc + (answers[it.id] || 0), 0);
  return {
    CR: transformTo100(sum(crItems), crItems.length, crItems.length * 3),
    UE: transformTo100(sum(ueItems), ueItems.length, ueItems.length * 3),
    EE: transformTo100(sum(eeItems), eeItems.length, eeItems.length * 3),
  };
}

function scoreRED(answers) {
  const locItems = RED_ITEMS.filter(i => i.scale === 'LOC');
  const losItems = RED_ITEMS.filter(i => i.scale === 'LOS');
  const pwfItems = RED_ITEMS.filter(i => i.scale === 'PWF');
  const mean = (items) => items.reduce((acc, it) => acc + (answers[it.id] || 0), 0) / items.length;
  const LOC = mean(locItems), LOS = mean(losItems), PWF = mean(pwfItems);
  // RED-13 is treated as largely unidimensional (Vainik et al. 2019); aggregate
  // is computed across all 13 items rather than averaging subscale means, so the
  // aggregate is not biased by which subscale has more items.
  const allItems = RED_ITEMS;
  const AGG = mean(allItems);
  const toPct = (v) => ((v - 1) / 4) * 100;
  return { LOC, LOS, PWF, AGG, LOC_pct: toPct(LOC), LOS_pct: toPct(LOS), PWF_pct: toPct(PWF), AGG_pct: toPct(AGG) };
}

function determinePhenotype(tfeq, red) {
  const elevated = {
    restraint:    tfeq.CR > 55,
    rewardDriven: tfeq.UE > 55 || red.AGG_pct > 50,
    emotional:    tfeq.EE > 45,
  };
  const driveCount = [elevated.rewardDriven, elevated.emotional].filter(Boolean).length;
  if (driveCount === 0 && !elevated.restraint) return 'homeostatic';
  if (driveCount === 0 && elevated.restraint) return 'cognitive_restrainer';
  if (driveCount === 2) return 'multi_driver';
  if (driveCount === 1 && elevated.restraint) return 'effortful_restrainer';
  if (elevated.rewardDriven) return 'reward_driven';
  if (elevated.emotional) return 'emotional_eater';
  return 'mixed';
}

const PHENOTYPES = {
  homeostatic: {
    name: 'Homeostatic Eater',
    tagline: 'Your eating is largely driven by physiological hunger.',
    paragraph: 'Your profile suggests that reward-based eating, emotional triggers, and loss-of-control eating are not prominent drivers for you. Eating appears to respond primarily to physical hunger signals rather than to environmental cues, internal states, or food preoccupation.',
    glp1: [
      'GLP-1 medications tend to produce straightforward appetite reduction in this profile, without dramatic shifts in how food feels psychologically.',
      'Your main risk is under-eating: because satiety comes easily, you may need to consciously meet protein and calorie targets to preserve lean mass.',
      'Discontinuation risk is moderate but typically more about hunger signals returning than about reward-driven relapse.',
    ],
    focus: ['Protein targets', 'Strength training', 'Planned eating windows'],
  },
  cognitive_restrainer: {
    name: 'Cognitive Restrainer',
    tagline: 'You manage eating through conscious control, with relatively quiet food drives.',
    paragraph: 'You show elevated cognitive restraint without strong reward-driven or emotional eating tendencies. This is an adaptive pattern for many people, but it depends on sustained cognitive effort that can be disrupted by stress, sleep loss, or dietary rules that are too rigid.',
    glp1: [
      'GLP-1 medications often feel confirming for this profile: they reduce the low-grade appetite noise you’ve been managing cognitively.',
      'Watch for reliance on the drug to maintain restraint. Skills-based support during treatment builds discontinuation resilience.',
      'Rigid rule-based restraint can tip into disinhibition if rules are broken. Flexible restraint (planning, not prohibition) is more sustainable long-term.',
    ],
    focus: ['Flexible vs rigid restraint', 'Discontinuation planning', 'Stress buffering'],
  },
  effortful_restrainer: {
    name: 'Effortful Restrainer',
    tagline: 'You use cognitive control to manage strong food drives.',
    paragraph: 'Your profile shows the classic restraint-disinhibition tension: high conscious control combined with an elevated drive (reward-based or emotional). This is the pattern most at risk for the counter-regulatory rebound when restraint breaks down, and one of the most common profiles in chronic dieters.',
    glp1: [
      'GLP-1 medications can feel transformative for this profile—for the first time, control doesn’t require white-knuckling. This is often the group that reports "the food noise is gone."',
      'The risk is that the drug is doing the regulatory work your restraint was doing before. Without building skills, discontinuation tends to produce rebound.',
      'This is the profile where behavioral support during the drug window matters most for long-term outcomes.',
    ],
    focus: ['Skill-building during treatment', 'Trigger identification', 'Discontinuation planning'],
  },
  emotional_eater: {
    name: 'Emotional Eater',
    tagline: 'Your eating is meaningfully driven by affective states.',
    paragraph: 'Emotional eating is your dominant driver. Eating in response to negative affect (anxiety, sadness, loneliness, irritation) is common and largely serves a self-regulation function—food reliably, if briefly, reduces distress.',
    glp1: [
      'GLP-1 medications reduce physiological hunger but often leave emotional eating relatively intact. The urge to eat when stressed or sad may persist even when hunger is absent.',
      'This is the profile where GLP-1s sometimes feel "less effective than expected"—because the drug isn’t directly targeting your main driver.',
      'Emotion regulation skills (not just diet skills) are the right intervention here. Consider this a window to build them while appetite noise is reduced.',
    ],
    focus: ['Emotion regulation', 'Non-food coping strategies', 'Distress tolerance'],
  },
  reward_driven: {
    name: 'Reward-Driven Eater',
    tagline: 'Your eating is driven by food reward, preoccupation, and difficulty satiating.',
    paragraph: 'Your profile shows elevated reward-based eating drive: a tendency to eat past fullness when food is rewarding, frequent food-related thoughts, and difficulty stopping once started. This is the eating pattern most directly aligned with the brain reward and satiation circuits that GLP-1 medications act on.',
    glp1: [
      'This is often the profile that reports the most striking subjective change on GLP-1s—food preoccupation drops, satiety feels real, and the loss-of-control episodes quiet.',
      'Pay attention to whether reward-driven episodes persist despite reduced hunger. If they do, the pattern may be more binge-type and warrants specific behavioral support.',
      'The risk window is discontinuation: when reward signaling returns, your food environment is still the same one that drove the original pattern. Reshape it now.',
    ],
    focus: ['Environmental restructuring', 'Regular meal structure', 'Screening for binge pattern'],
  },
  multi_driver: {
    name: 'Multi-Driver Profile',
    tagline: 'Multiple eating drivers are elevated simultaneously.',
    paragraph: 'Your profile shows elevations across both emotional and reward-driven eating, with or without restraint in the mix. This is a more complex presentation that typically benefits from layered support—different drivers respond to different interventions, and treating them as one tends to produce uneven results.',
    glp1: [
      'GLP-1 medications will likely address some drivers (particularly reward and satiation) more than others (particularly emotional).',
      'Expect a mixed experience: some eating patterns may quiet dramatically while others persist. This is informative, not failure—it tells you which driver to target with skills-based work.',
      'A phased approach—targeting one driver at a time with tailored skills—often works better than trying to change everything at once.',
    ],
    focus: ['Layered assessment', 'Sequenced skill-building', 'Specialist consultation'],
  },
  mixed: {
    name: 'Mixed Profile',
    tagline: 'Your profile shows moderate elevations without a clearly dominant pattern.',
    paragraph: 'No single driver stands out strongly in your profile, but several are moderately elevated. This is common and interpretable: you likely respond to a range of cues and contexts rather than one dominant pathway.',
    glp1: [
      'Your GLP-1 response is likely to be generally positive but without the dramatic single-channel changes some profiles experience.',
      'Retaking this assessment at 3 and 6 months will show whether a clearer pattern emerges as the drug affects different systems.',
      'Tracking which situations still trigger eating will help identify your actual dominant driver over time.',
    ],
    focus: ['Longitudinal tracking', 'Situation journaling', 'Flexible skill practice'],
  },
};


// =============================================================================
// 4. HOOKS & GLOBAL STYLES
// =============================================================================

function useFonts() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('appetite-atlas-fonts')) return;
    const link = document.createElement('link');
    link.id = 'appetite-atlas-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);
}

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

function GlobalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body { background: ${COLORS.cream}; }
      ::selection { background: ${COLORS.forest}; color: ${COLORS.cream}; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes drawLine {
        from { transform: scaleX(0); }
        to   { transform: scaleX(1); }
      }
      @keyframes bounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40% { transform: translateY(-8px); opacity: 1; }
      }

      .fade-up   { animation: fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
      .draw-line { animation: drawLine 1s ease-out 0.4s forwards; transform: scaleX(0); transform-origin: left; }
      .d1 { animation-delay: 0.1s; }
      .d2 { animation-delay: 0.25s; }
      .d3 { animation-delay: 0.4s; }
      .d4 { animation-delay: 0.55s; }
      .d5 { animation-delay: 0.7s; }

      .nav-link { cursor: pointer; transition: color 0.2s ease; color: ${COLORS.muted}; }
      .nav-link:hover { color: ${COLORS.forest}; }

      .grain-overlay {
        position: absolute; inset: 0; pointer-events: none;
        opacity: 0.30; mix-blend-mode: multiply;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E");
      }

      input, textarea { font-family: ${FONT_SANS}; }

      @media (max-width: 768px) {
        .hide-mobile { display: none !important; }
        .grid-2 { grid-template-columns: 1fr !important; gap: 32px !important; }
        .grid-3 { grid-template-columns: 1fr !important; gap: 32px !important; }
        .grid-4 { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        .section-pad { padding: 80px 24px !important; }
        .hero-pad { padding: 120px 24px 80px !important; }
      }

      /* PRINT STYLES (for "Download PDF" button on results) */
      @media print {
        body { background: white; }
        .no-print { display: none !important; }
        .print-page-break { page-break-before: always; }
        .print-avoid-break { page-break-inside: avoid; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `}</style>
  );
}


// =============================================================================
// 5. SHARED COMPONENTS
// =============================================================================

function Logo({ size = 26, onClick }) {
  // Drawn natively in code — renders crisp at any size and matches the rest of
  // the site's typography (Instrument Serif). The tagline that lives in the
  // larger brand lockup is intentionally NOT in the nav logo; it has too many
  // characters to read at nav-bar sizes. The tagline can live elsewhere on
  // the page (hero, footer) as full-size text where it has room to breathe.
  //
  // The `size` prop is the wordmark font size in pixels. Symbol scales with it.
  const symbolSize = size * 1.15;
  const tmSize = size * 0.4;
  const stroke = Math.max(1, size * 0.08);

  return (
    <div onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center',
      gap: size * 0.4,
      cursor: onClick ? 'pointer' : 'default',
      lineHeight: 1,
    }}>
      {/* Compass-X symbol */}
      <svg
        width={symbolSize}
        height={symbolSize}
        viewBox="0 0 100 100"
        style={{ flexShrink: 0, display: 'block' }}
        aria-hidden="true"
      >
        <line x1="12" y1="12" x2="38" y2="38" stroke={COLORS.forest} strokeWidth={stroke * 1.2} strokeLinecap="round" />
        <line x1="88" y1="12" x2="62" y2="38" stroke={COLORS.forest} strokeWidth={stroke * 1.2} strokeLinecap="round" />
        <line x1="12" y1="88" x2="38" y2="62" stroke={COLORS.forest} strokeWidth={stroke * 1.2} strokeLinecap="round" />
        <line x1="88" y1="88" x2="62" y2="62" stroke={COLORS.forest} strokeWidth={stroke * 1.2} strokeLinecap="round" />
        <circle cx="50" cy="50" r={13} fill={COLORS.forest} />
      </svg>

      {/* Wordmark with TM */}
      <div style={{
        fontFamily: FONT_SERIF,
        fontSize: size,
        color: COLORS.forest,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}>
        {BRAND_NAME}
        <sup style={{
          fontFamily: FONT_SANS,
          fontSize: tmSize,
          verticalAlign: 'super',
          marginLeft: '0.05em',
          fontWeight: 400,
        }}>™</sup>
      </div>
    </div>
  );
}

function Button({ children, onClick, variant = 'primary', disabled, style, type, ...rest }) {
  const base = {
    fontFamily: FONT_SANS, fontSize: 15, fontWeight: 500,
    padding: '14px 26px', borderRadius: 2,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 200ms ease', border: 'none',
    display: 'inline-flex', alignItems: 'center', gap: 10,
    letterSpacing: '0.01em', opacity: disabled ? 0.4 : 1,
    textDecoration: 'none',
  };
  const variants = {
    primary: { background: COLORS.forest, color: COLORS.cream },
    ghost:   { background: 'transparent', color: COLORS.muted, padding: '10px 14px' },
    outline: { background: 'transparent', color: COLORS.text, border: `1px solid ${COLORS.borderDark}` },
    cream:   { background: COLORS.cream, color: COLORS.forest },
  };
  return (
    <button type={type || 'button'} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }} {...rest}>
      {children}
    </button>
  );
}

function SectionHeader({ number, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 56 }}>
      <span style={{ fontFamily: FONT_SERIF, fontSize: 17, color: COLORS.terracotta, fontStyle: 'italic' }}>{number}</span>
      <div style={{ height: 1, width: 56, background: COLORS.terracotta }} />
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.muted }}>{label}</span>
    </div>
  );
}

function PrototypeBanner() {
  return (
    <div className="no-print" style={{
      background: '#3D2E1F',
      color: '#F5E8D8',
      padding: '8px 28px',
      fontSize: 11,
      fontFamily: FONT_MONO,
      letterSpacing: '0.05em',
      textAlign: 'center',
    }}>
      PROTOTYPE · TFEQ-R21 and RED-13 items shown are placeholder approximations of the validated wording
    </div>
  );
}


// =============================================================================
// 6. MARKETING SITE
// =============================================================================

function MarketingSite({ onStartAssessment }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmitError('');
    if (!email || !email.includes('@') || !email.includes('.')) {
      setSubmitError('Please enter a valid email.');
      return;
    }
    // TODO: replace with real waitlist endpoint (Formspree, ConvertKit, etc.)
    setSubmitted(true);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ background: COLORS.cream, color: COLORS.text, fontFamily: FONT_SANS, WebkitFontSmoothing: 'antialiased', minHeight: '100vh' }}>
      <Nav onNav={scrollTo} />
      <Hero onStartAssessment={onStartAssessment} onNav={scrollTo} />
      <Gap />
      <Approach />
      <AssessmentSection onStartAssessment={onStartAssessment} />
      <About />
      <Waitlist email={email} setEmail={setEmail} submitted={submitted} submitError={submitError} onSubmit={handleSubmit} />
      <Footer />
    </div>
  );
}

function Nav({ onNav }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(245, 241, 232, 0.84)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid rgba(207, 198, 178, 0.5)`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <div className="hide-mobile" style={{ display: 'flex', gap: 36, fontSize: 14, fontFamily: FONT_SANS }}>
          <span className="nav-link" onClick={() => onNav('approach')}>Approach</span>
          <span className="nav-link" onClick={() => onNav('assessment')}>Assessment</span>
          <span className="nav-link" onClick={() => onNav('about')}>About</span>
          <span className="nav-link" onClick={() => onNav('waitlist')}>Waitlist</span>
        </div>
      </div>
    </nav>
  );
}

function Hero({ onStartAssessment, onNav }) {
  return (
    <section className="hero-pad" style={{
      position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '140px 48px 100px', overflow: 'hidden',
    }}>
      <div className="grain-overlay" />
      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative' }}>
        <div className="fade-up d1" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <div className="draw-line" style={{ width: 48, height: 1, background: COLORS.terracotta, transformOrigin: 'left' }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.muted }}>
            Eating Behavior Science · For GLP-1 Patients
          </span>
        </div>

        <h1 className="fade-up d2" style={{
          fontFamily: FONT_SERIF,
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          lineHeight: 0.98,
          fontWeight: 400,
          letterSpacing: '-0.025em',
          margin: '0 0 40px 0',
          maxWidth: '17ch',
          color: COLORS.text,
        }}>
          GLP-1 changed how you eat. <em style={{ fontStyle: 'italic', color: COLORS.forest }}>{BRAND_NAME}<sup style={{ fontSize: '0.4em', fontStyle: 'normal', verticalAlign: 'super', marginLeft: '0.05em', fontWeight: 400 }}>™</sup> helps you understand why.</em>
        </h1>

        <p className="fade-up d3" style={{
          fontSize: 'clamp(1.1rem, 1.55vw, 1.3rem)',
          lineHeight: 1.55,
          color: COLORS.muted,
          maxWidth: '54ch',
          margin: '0 0 56px 0',
        }}>
          An evidence-based eating-behavior assessment, built for the questions your medication can’t answer. Designed by a PhD researcher in human eating behavior — for the people actually living through this.
        </p>

        <div className="fade-up d4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Button onClick={onStartAssessment}>
            Take the assessment
            <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
          </Button>
          <Button variant="outline" onClick={() => onNav('approach')}>Learn the science</Button>
        </div>

        <div className="fade-up d5" style={{
          position: 'absolute', bottom: -60, right: 0,
          fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span>Currently in private beta</span>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: COLORS.terracotta }} />
        </div>
      </div>
    </section>
  );
}

function Gap() {
  return (
    <section className="section-pad" id="gap" style={{ padding: '140px 48px', borderTop: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionHeader number="01" label="The Gap" />
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96 }}>
          <h2 style={{
            fontFamily: FONT_SERIF, fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            lineHeight: 1.1, fontWeight: 400, letterSpacing: '-0.02em',
            margin: 0, color: COLORS.text,
          }}>
            Most GLP-1 apps track. <em style={{ fontStyle: 'italic', color: COLORS.forest }}>None of them ask why you eat.</em>
          </h2>
          <div>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: COLORS.text, margin: '0 0 24px 0' }}>
              The medication quiets hunger. It doesn’t change emotional eating, response to highly palatable food, or the way restraint plays out across your week. Roughly two-thirds of patients discontinue within a year, and most regain weight when they do — because the drug was never the part that addressed eating behavior.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: COLORS.text, margin: 0 }}>
              {BRAND_NAME} fills the gap that calorie counters and habit trackers don’t. It uses validated instruments from eating-behavior research to map how you actually relate to food — and what that means for your time on, off, and after GLP-1.
            </p>
            <div style={{
              marginTop: 56, paddingTop: 32, borderTop: `1px solid ${COLORS.border}`,
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32,
            }}>
              <Stat number="~67%" label="discontinue within 12 months" />
              <Stat number="~50%" label="regain most weight after stopping" />
              <Stat number="0" label="apps built around eating behavior" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <div style={{
        fontFamily: FONT_SERIF, fontSize: 'clamp(2rem, 3.4vw, 2.6rem)',
        fontWeight: 400, color: COLORS.forest, letterSpacing: '-0.015em', marginBottom: 8,
      }}>
        {number}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, color: COLORS.muted }}>{label}</div>
    </div>
  );
}

function Approach() {
  return (
    <section className="section-pad" id="approach" style={{
      padding: '140px 48px', background: '#EDE6D5', position: 'relative', overflow: 'hidden',
    }}>
      <div className="grain-overlay" />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <SectionHeader number="02" label="The Approach" />

        <h2 style={{
          fontFamily: FONT_SERIF, fontSize: 'clamp(2.25rem, 5vw, 4.25rem)',
          lineHeight: 1.05, fontWeight: 400, letterSpacing: '-0.025em',
          margin: '0 0 80px 0', maxWidth: '20ch', color: COLORS.text,
        }}>
          Built on the research, not the trend cycle.
        </h2>

        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48 }}>
          <Pillar
            label="Validated Instruments"
            text="The assessment uses items from the Three-Factor Eating Questionnaire (TFEQ-R21) and the Reward-based Eating Drive scale (RED-13) — gold standards for measuring cognitive restraint, emotional eating, uncontrolled eating, and reward-driven eating patterns."
          />
          <Pillar
            label="Phenotype, Not Diet"
            text="Seven distinct eating profiles, not one set of rules. The same GLP-1 dose lands very differently depending on whether you’re a Cognitive Restrainer or a Reward-Driven Eater. Your phenotype tells you what to actually focus on."
          />
          <Pillar
            label="GLP-1 Native"
            text={`Most behavioral nutrition tools were built for a pre-GLP-1 world. ${BRAND_NAME} is designed for the questions you actually have right now — about plateaus, food noise, tapering, and what comes next.`}
          />
        </div>

        <div className="grid-2" style={{
          marginTop: 96, paddingTop: 48, borderTop: `1px solid ${COLORS.border}`,
          display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 80,
        }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.muted }}>
            From the founder
          </div>
          <p style={{
            fontFamily: FONT_SERIF, fontSize: 'clamp(1.4rem, 2.2vw, 1.95rem)',
            lineHeight: 1.4, fontStyle: 'italic', fontWeight: 400,
            color: COLORS.text, margin: 0, letterSpacing: '-0.01em',
          }}>
            "After a decade studying eating behavior, what I see in the GLP-1 conversation is a missing piece. The medication is a tool. Understanding the way you eat is the rest of the work — and it’s the part that has to come from you."
          </p>
        </div>
      </div>
    </section>
  );
}

function Pillar({ label, text }) {
  return (
    <div>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.2em',
        textTransform: 'uppercase', color: COLORS.terracotta,
        fontWeight: 500, marginBottom: 20,
      }}>
        {label}
      </div>
      <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.text, margin: 0 }}>{text}</p>
    </div>
  );
}

function AssessmentSection({ onStartAssessment }) {
  return (
    <section className="section-pad" id="assessment" style={{ padding: '140px 48px', borderTop: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionHeader number="03" label="The Assessment" />
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 96, alignItems: 'start' }}>
          <div>
            <h2 style={{
              fontFamily: FONT_SERIF, fontSize: 'clamp(2.25rem, 4.6vw, 3.75rem)',
              lineHeight: 1.05, fontWeight: 400, letterSpacing: '-0.025em',
              margin: '0 0 32px 0',
            }}>
              About ten minutes. <em style={{ fontStyle: 'italic', color: COLORS.forest }}>One precise picture of how you eat.</em>
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: COLORS.text, margin: '0 0 40px 0' }}>
              You’ll answer about 35 questions drawn from validated eating-behavior research. We map your responses across four dimensions — cognitive restraint, uncontrolled eating, emotional eating, and reward-based eating drive — and surface the eating phenotype that fits your patterns most closely.
            </p>

            <ProcessStep number="01" title="Answer" text="Questions about how you eat, why you eat, and what foods do to you. Plus a short module on how your GLP-1 experience is actually going." />
            <ProcessStep number="02" title="Map" text="Your responses are scored across the four research-grounded dimensions and matched to one of seven eating phenotypes." />
            <ProcessStep number="03" title="Understand" text="A personalized profile that names your patterns, explains what they mean for GLP-1 specifically, and points to where the work actually lives for you." last />

            <div style={{ marginTop: 48 }}>
              <Button onClick={onStartAssessment}>Begin assessment <span style={{ fontSize: 18, lineHeight: 1 }}>→</span></Button>
              <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 16 }}>
                Free during private beta. No account required.
              </p>
            </div>
          </div>

          {/* Sample output card */}
          <div style={{
            background: COLORS.forest, color: COLORS.cream,
            padding: '48px 40px', borderRadius: 4, position: 'sticky', top: 100,
          }}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.22em',
              textTransform: 'uppercase', color: COLORS.amber, marginBottom: 24, fontWeight: 500,
            }}>
              Sample output
            </div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 16, color: COLORS.sage, marginBottom: 6, fontStyle: 'italic' }}>
              Your eating phenotype
            </div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 42, fontWeight: 400, letterSpacing: '-0.015em', marginBottom: 24, lineHeight: 1.05 }}>
              Reward-Driven Eater
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: '#D8DDD3', margin: '0 0 32px 0' }}>
              Your eating is shaped less by hunger and more by food reward, preoccupation, and difficulty satiating. GLP-1 likely takes the edge off cravings — but the underlying patterns haven’t gone away.
            </p>
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.15)`, paddingTop: 24 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.amber, marginBottom: 16, fontWeight: 500 }}>
                Score profile
              </div>
              <ScoreBar label="Cognitive Restraint" value={32} />
              <ScoreBar label="Uncontrolled Eating" value={48} />
              <ScoreBar label="Emotional Eating" value={29} />
              <ScoreBar label="Reward-Based Eating Drive" value={78} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ number, title, text, last }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24,
      paddingBottom: last ? 0 : 28, marginBottom: last ? 0 : 28,
      borderBottom: last ? 'none' : `1px solid ${COLORS.border}`,
    }}>
      <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: COLORS.terracotta, paddingTop: 2, fontStyle: 'italic' }}>{number}</div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 15, color: COLORS.muted, lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#D8DDD3', marginBottom: 6 }}>
        <span style={{ fontFamily: FONT_SANS }}>{label}</span>
        <span style={{ fontFamily: FONT_MONO, color: COLORS.cream }}>{value}</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: COLORS.terracotta, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="section-pad" id="about" style={{
      padding: '140px 48px', background: '#EDE6D5',
      borderTop: `1px solid ${COLORS.border}`, position: 'relative', overflow: 'hidden',
    }}>
      <div className="grain-overlay" />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <SectionHeader number="04" label="The Founder" />
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96, alignItems: 'start' }}>
          <div>
            <div style={{
              aspectRatio: '4 / 5',
              borderRadius: 4, position: 'relative', overflow: 'hidden', marginBottom: 16,
              background: COLORS.borderDark,
            }}>
              <img
                src={founderPhoto}
                alt="Margaret Melone, PhD"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  objectPosition: 'center 30%',
                  display: 'block',
                }}
              />
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted, fontWeight: 500 }}>
              {/* FOUNDER_NAME */}
              {FOUNDER_NAME}, PhD
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Founder, {BRAND_NAME}</div>
          </div>

          <div>
            <h2 style={{
              fontFamily: FONT_SERIF, fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              lineHeight: 1.1, fontWeight: 400, letterSpacing: '-0.02em',
              margin: '0 0 32px 0',
            }}>
              I’ve spent a decade asking <em style={{ fontStyle: 'italic', color: COLORS.forest }}>why people eat the way they do.</em>
            </h2>

            {/* FOUNDER_BIO — placeholder paragraphs, please rewrite */}
            <p style={{ fontSize: 17, lineHeight: 1.65, color: COLORS.text, margin: '0 0 24px 0' }}>
              I hold a PhD in eating behavior, with research focused on the psychological and behavioral mechanisms that shape how, when, and why people eat. Before {BRAND_NAME}, my work centered on [research focus — e.g., appetite regulation, reward-based eating, behavioral phenotyping in obesity].
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: COLORS.text, margin: '0 0 24px 0' }}>
              I started {BRAND_NAME} because I kept seeing the same gap. GLP-1 medications are doing real, measurable good — and at the same time, the apps built around them are mostly calorie counters with new branding. None of them speak to the actual lived experience of having your appetite rewired, or to the questions about what happens when the drug stops doing the work.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: COLORS.text, margin: '0 0 32px 0' }}>
              The eating-behavior science is there. The validated instruments exist. What’s missing is a product that translates them into something useful for the millions of people taking these medications right now. That’s what {BRAND_NAME} is.
            </p>

            <div style={{
              paddingTop: 32, borderTop: `1px solid ${COLORS.border}`,
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32,
            }}>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.terracotta, marginBottom: 8, fontWeight: 500 }}>
                  Background
                </div>
                <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.6 }}>PhD, Eating Behavior Science</div>
              </div>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.terracotta, marginBottom: 8, fontWeight: 500 }}>
                  Focus
                </div>
                <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.6 }}>Behavioral phenotyping, GLP-1 patient experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Waitlist({ email, setEmail, submitted, submitError, onSubmit }) {
  return (
    <section className="section-pad" id="waitlist" style={{
      padding: '140px 48px', background: COLORS.forest, color: COLORS.cream,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 32, height: 1, background: COLORS.terracotta }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.amber, fontWeight: 500 }}>
            05 · Join the Waitlist
          </span>
          <div style={{ width: 32, height: 1, background: COLORS.terracotta }} />
        </div>

        <h2 style={{
          fontFamily: FONT_SERIF, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: 1, fontWeight: 400, letterSpacing: '-0.025em',
          margin: '0 0 24px 0',
        }}>
          Be first when {BRAND_NAME} opens.
        </h2>

        <p style={{ fontSize: 18, lineHeight: 1.55, color: '#D8DDD3', maxWidth: '52ch', margin: '0 auto 56px' }}>
          Early access to the assessment, plus the research notes and writing I’m publishing along the way. No spam, no daily emails — I write when there’s something worth saying.
        </p>

        {!submitted ? (
          <form onSubmit={onSubmit} style={{ display: 'flex', gap: 12, maxWidth: 520, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: '1 1 240px', padding: '16px 20px', fontSize: 15,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                color: COLORS.cream, borderRadius: 2, outline: 'none', fontFamily: FONT_SANS,
              }}
            />
            <Button type="submit" variant="cream">Join waitlist</Button>
            {submitError && (
              <div style={{ width: '100%', fontFamily: FONT_MONO, fontSize: 12, color: '#E8B098', marginTop: 8 }}>
                {submitError}
              </div>
            )}
          </form>
        ) : (
          <div style={{
            maxWidth: 520, margin: '0 auto', padding: '24px 32px',
            background: 'rgba(255,255,255,0.08)', border: `1px solid ${COLORS.terracotta}`, borderRadius: 2,
          }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 400, marginBottom: 8 }}>
              You’re on the list.
            </div>
            <div style={{ fontSize: 15, color: '#D8DDD3' }}>
              We’ll be in touch when the assessment opens. Thank you.
            </div>
          </div>
        )}

        <div style={{ marginTop: 48, fontFamily: FONT_MONO, fontSize: 11, color: COLORS.sage, letterSpacing: '0.05em' }}>
          Your email stays private. We use it once — to tell you when {BRAND_NAME} is ready.
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: '48px 48px 56px', background: COLORS.cream, borderTop: `1px solid ${COLORS.border}` }}>
      <div className="grid-2" style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'end',
      }}>
        <div>
          <Logo size={20} />
          <div style={{
            fontFamily: FONT_SERIF,
            fontSize: 14,
            fontStyle: 'italic',
            color: COLORS.forest,
            marginTop: 10,
            letterSpacing: '0.005em',
          }}>
            Know your appetite. Navigate your journey.
          </div>
          <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, maxWidth: '40ch', marginTop: 14 }}>
            An eating-behavior assessment for GLP-1 patients. Educational; not a substitute for medical advice or treatment.
          </div>
        </div>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 11, color: COLORS.muted,
          display: 'flex', gap: 24, justifyContent: 'flex-end', flexWrap: 'wrap', letterSpacing: '0.05em',
        }}>
          <span>© 2026 {BRAND_NAME}<sup style={{ fontSize: '0.7em', verticalAlign: 'super', marginLeft: '0.1em' }}>™</sup></span>
          <a className="nav-link" style={{ textDecoration: 'none', cursor: 'pointer' }}>Privacy</a>
          <a className="nav-link" style={{ textDecoration: 'none', cursor: 'pointer' }}>Terms</a>
          <a style={{ color: COLORS.muted, textDecoration: 'none' }} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </div>
    </footer>
  );
}


// =============================================================================
// 7. ASSESSMENT
// =============================================================================

function AssessmentApp({ onBackToSite }) {
  const [step, setStep] = useState('context');
  const [context, setContext] = useState({});
  const [satisfaction, setSatisfaction] = useState({});
  const [tfeqA, setTfeqA] = useState({});
  const [redA, setRedA] = useState({});
  const [demo, setDemo] = useState({});
  const [tfeqIdx, setTfeqIdx] = useState(0);
  const [redIdx, setRedIdx] = useState(0);

  const runScoring = () => {
    setStep('computing');
    setTimeout(() => setStep('results'), 1600);
  };

  const reset = () => {
    setContext({}); setSatisfaction({}); setTfeqA({}); setRedA({}); setDemo({});
    setTfeqIdx(0); setRedIdx(0); setStep('context');
  };

  if (step === 'context') {
    return (
      <ContextScreen
        answers={context} setAnswers={setContext}
        onBack={onBackToSite} onNext={() => setStep('satisfaction')}
        onLogoClick={onBackToSite}
      />
    );
  }
  if (step === 'satisfaction') {
    return (
      <SatisfactionScreen
        answers={satisfaction} setAnswers={setSatisfaction}
        onBack={() => setStep('context')} onNext={() => setStep('tfeq')}
        onLogoClick={onBackToSite}
      />
    );
  }
  if (step === 'tfeq') {
    return (
      <QuestionnaireScreen
        items={TFEQ_ITEMS} options={TFEQ_OPTIONS} answers={tfeqA} setAnswers={setTfeqA}
        idx={tfeqIdx} setIdx={setTfeqIdx}
        partName="Eating patterns" partNum={3} totalParts={5}
        progressBase={25} progressRange={45}
        onComplete={() => setStep('red')} onBack={() => setStep('satisfaction')}
        onLogoClick={onBackToSite}
      />
    );
  }
  if (step === 'red') {
    return (
      <QuestionnaireScreen
        items={RED_ITEMS} options={RED_OPTIONS} answers={redA} setAnswers={setRedA}
        idx={redIdx} setIdx={setRedIdx}
        partName="Reward & food drive" partNum={4} totalParts={5}
        progressBase={70} progressRange={20}
        onComplete={() => setStep('demo')}
        onBack={() => { setTfeqIdx(TFEQ_ITEMS.length - 1); setStep('tfeq'); }}
        onLogoClick={onBackToSite}
      />
    );
  }
  if (step === 'demo') {
    return (
      <DemographicsScreen
        answers={demo} setAnswers={setDemo}
        onBack={() => { setRedIdx(RED_ITEMS.length - 1); setStep('red'); }}
        onNext={runScoring}
        onLogoClick={onBackToSite}
      />
    );
  }
  if (step === 'computing') {
    return <ComputingScreen onLogoClick={onBackToSite} />;
  }
  if (step === 'results') {
    const tfeqScores = scoreTFEQ(tfeqA);
    const redScores = scoreRED(redA);
    const phenotypeKey = determinePhenotype(tfeqScores, redScores);
    return (
      <ResultsScreen
        tfeq={tfeqScores} red={redScores} phenotypeKey={phenotypeKey}
        satisfaction={satisfaction}
        onRetake={reset} onBackToSite={onBackToSite}
      />
    );
  }
  return null;
}

function AssessmentShell({ children, progress, onLogoClick }) {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream, color: COLORS.text, fontFamily: FONT_SANS }}>
      <PrototypeBanner />
      <header className="no-print" style={{
        borderBottom: `1px solid ${COLORS.border}`, padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Logo onClick={onLogoClick} />
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          The Eating Profile Assessment
        </span>
      </header>
      {progress != null && (
        <div className="no-print" style={{ height: 2, background: COLORS.border, position: 'relative' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: COLORS.forest, transition: 'width 400ms ease' }} />
        </div>
      )}
      <main>{children}</main>
    </div>
  );
}

function ContextScreen({ answers, setAnswers, onNext, onBack, onLogoClick }) {
  const allAnswered = GLP1_QUESTIONS.every(q => answers[q.id]);
  return (
    <AssessmentShell progress={8} onLogoClick={onLogoClick}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '56px 28px 120px' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 16 }}>
          Part 1 of 5 &middot; Your context
        </div>
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: 40, lineHeight: 1.1, margin: '0 0 16px', fontWeight: 400 }}>
          A few questions to anchor your profile.
        </h2>
        <p style={{ color: COLORS.muted, fontSize: 16, marginBottom: 40, lineHeight: 1.5 }}>
          The basics about your medication and where you are in your treatment.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {GLP1_QUESTIONS.map((q, qi) => (
            <div key={q.id}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.muted, letterSpacing: '0.05em' }}>{String(qi + 1).padStart(2, '0')}</span>
                <div style={{ fontSize: 17, lineHeight: 1.4 }}>{q.q}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingLeft: 28 }}>
                {q.options.map(opt => {
                  const selected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                      style={{
                        fontFamily: FONT_SANS, fontSize: 14, padding: '8px 14px', borderRadius: 2,
                        border: `1px solid ${selected ? COLORS.forest : COLORS.borderDark}`,
                        background: selected ? COLORS.forest : 'transparent',
                        color: selected ? COLORS.cream : COLORS.text,
                        cursor: 'pointer', transition: 'all 150ms ease',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56 }}>
          <Button variant="ghost" onClick={onBack}>← Back to site</Button>
          <Button onClick={onNext} disabled={!allAnswered}>Continue →</Button>
        </div>
      </div>
    </AssessmentShell>
  );
}

function SatisfactionSlider({ value, onChange }) {
  const v = value ?? 5;
  const labelFor = (n) => {
    if (n <= 2) return 'Very dissatisfied';
    if (n <= 4) return 'Dissatisfied';
    if (n === 5) return 'Neutral';
    if (n <= 7) return 'Satisfied';
    return 'Very satisfied';
  };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.muted, letterSpacing: '0.05em' }}>
          {value == null ? 'Drag to set' : labelFor(v)}
        </div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 28, color: value == null ? COLORS.borderDark : COLORS.forest }}>
          {value == null ? '—' : `${v}/10`}
        </div>
      </div>
      <input
        type="range" min="1" max="10" step="1" value={v}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{ width: '100%', accentColor: COLORS.forest, cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 10, color: COLORS.muted, letterSpacing: '0.1em', marginTop: 4 }}>
        <span>1</span><span>5</span><span>10</span>
      </div>
    </div>
  );
}

function SatisfactionScreen({ answers, setAnswers, onNext, onBack, onLogoClick }) {
  const slidersAnswered = SATISFACTION_SLIDERS.every(s => answers[s.id] != null);
  const plateauAnswered = !!answers.plateau;
  const trajectoryAnswered = !!answers.trajectory;
  const frustrationAnswered = !!answers.topFrustration;
  const canContinue = slidersAnswered && plateauAnswered && trajectoryAnswered && frustrationAnswered;

  return (
    <AssessmentShell progress={18} onLogoClick={onLogoClick}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '56px 28px 120px' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 16 }}>
          Part 2 of 5 &middot; How it’s going
        </div>
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: 40, lineHeight: 1.1, margin: '0 0 16px', fontWeight: 400 }}>
          Now, how is the experience itself?
        </h2>
        <p style={{ color: COLORS.muted, fontSize: 16, marginBottom: 48, lineHeight: 1.5 }}>
          Your subjective experience matters as much as your eating phenotype. We’ll use both to interpret your results.
        </p>

        {/* SATISFACTION SLIDERS — now 2 instead of 4 */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 24 }}>
            Satisfaction · 1–10
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {SATISFACTION_SLIDERS.map(s => (
              <div key={s.id}>
                <div style={{ fontSize: 16, lineHeight: 1.4, marginBottom: 16 }}>{s.label}</div>
                <SatisfactionSlider value={answers[s.id]} onChange={(v) => setAnswers({ ...answers, [s.id]: v })} />
              </div>
            ))}
          </div>
        </div>

        {/* PLATEAU */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 16 }}>
            Plateau
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.4, marginBottom: 16 }}>Have you hit a plateau in the last month?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PLATEAU_OPTIONS.map(opt => {
              const selected = answers.plateau === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, plateau: opt })}
                  style={{
                    fontFamily: FONT_SANS, fontSize: 14, padding: '10px 16px', borderRadius: 2,
                    border: `1px solid ${selected ? COLORS.forest : COLORS.borderDark}`,
                    background: selected ? COLORS.forest : 'transparent',
                    color: selected ? COLORS.cream : COLORS.text,
                    cursor: 'pointer', transition: 'all 150ms ease',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* BIGGEST FRUSTRATION — single-select instead of multi + follow-up */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 16 }}>
            Biggest frustration
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.4, marginBottom: 16 }}>
            What has been your biggest frustration so far?
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FRUSTRATION_OPTIONS.map(opt => {
              const selected = answers.topFrustration === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, topFrustration: opt })}
                  style={{
                    fontFamily: FONT_SANS, fontSize: 15, padding: '12px 18px', textAlign: 'left',
                    borderRadius: 2,
                    border: `1px solid ${selected ? COLORS.forest : COLORS.borderDark}`,
                    background: selected ? COLORS.forest : COLORS.card,
                    color: selected ? COLORS.cream : COLORS.text,
                    cursor: 'pointer', transition: 'all 150ms ease',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* TRAJECTORY */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 16 }}>
            Recent trajectory
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.4, marginBottom: 16 }}>Compared to a month ago, my progress has been...</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {TRAJECTORY_OPTIONS.map(opt => {
              const selected = answers.trajectory === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, trajectory: opt })}
                  style={{
                    fontFamily: FONT_SANS, fontSize: 15, padding: '12px 18px', textAlign: 'left',
                    borderRadius: 2,
                    border: `1px solid ${selected ? COLORS.forest : COLORS.borderDark}`,
                    background: selected ? COLORS.forest : COLORS.card,
                    color: selected ? COLORS.cream : COLORS.text,
                    cursor: 'pointer', transition: 'all 150ms ease',
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
          <Button variant="ghost" onClick={onBack}>← Back</Button>
          <Button onClick={onNext} disabled={!canContinue}>Continue →</Button>
        </div>
      </div>
    </AssessmentShell>
  );
}

function QuestionnaireScreen({ items, options, answers, setAnswers, idx, setIdx, partName, partNum, totalParts, onComplete, onBack, progressBase, progressRange, onLogoClick }) {
  const item = items[idx];
  const answered = answers[item.id] != null;
  const itemProgress = progressBase + (idx / items.length) * progressRange;

  const handleAnswer = (val) => {
    setAnswers({ ...answers, [item.id]: val });
    setTimeout(() => {
      if (idx < items.length - 1) setIdx(idx + 1);
      else onComplete();
    }, 220);
  };
  const handleBack = () => { if (idx === 0) onBack(); else setIdx(idx - 1); };

  return (
    <AssessmentShell progress={itemProgress} onLogoClick={onLogoClick}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '56px 28px 120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted }}>
            Part {partNum} of {totalParts} &middot; {partName}
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: COLORS.muted, letterSpacing: '0.1em' }}>
            {String(idx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </div>
        </div>
        <div style={{ minHeight: 180, display: 'flex', alignItems: 'center' }}>
          <h2 key={item.id} style={{
            fontFamily: FONT_SERIF, fontSize: 34, lineHeight: 1.22, margin: 0,
            fontWeight: 400, letterSpacing: '-0.01em', animation: 'fadeIn 320ms ease',
          }}>
            {item.text}
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 48 }}>
          {options.map(opt => {
            const selected = answers[item.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                style={{
                  fontFamily: FONT_SANS, fontSize: 16, padding: '18px 22px', textAlign: 'left', borderRadius: 2,
                  border: `1px solid ${selected ? COLORS.forest : COLORS.borderDark}`,
                  background: selected ? COLORS.forest : COLORS.card,
                  color: selected ? COLORS.cream : COLORS.text,
                  cursor: 'pointer', transition: 'all 180ms ease',
                  display: 'flex', alignItems: 'center', gap: 16,
                }}
                onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = COLORS.forest; }}
                onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = COLORS.borderDark; }}
              >
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: selected ? COLORS.cream : COLORS.muted, opacity: 0.8, minWidth: 20 }}>
                  {opt.value}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48 }}>
          <Button variant="ghost" onClick={handleBack}>← Back</Button>
          {answered && idx < items.length - 1 && (
            <Button variant="outline" onClick={() => setIdx(idx + 1)}>Next →</Button>
          )}
        </div>
      </div>
    </AssessmentShell>
  );
}

function DemographicsScreen({ answers, setAnswers, onNext, onBack, onLogoClick }) {
  const canContinue = answers.age && answers.sex && answers.height && answers.weight;
  const inputStyle = {
    width: '100%', padding: '14px 16px', fontSize: 16,
    border: `1px solid ${COLORS.borderDark}`, background: COLORS.card,
    fontFamily: FONT_SANS, borderRadius: 2, color: COLORS.text, outline: 'none',
  };
  return (
    <AssessmentShell progress={92} onLogoClick={onLogoClick}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '56px 28px 120px' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 16 }}>
          Part 5 of 5 &middot; About you
        </div>
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: 40, lineHeight: 1.1, margin: '0 0 16px', fontWeight: 400 }}>
          Just a few basics.
        </h2>
        <p style={{ color: COLORS.muted, fontSize: 16, marginBottom: 40, lineHeight: 1.5 }}>
          Used only to compare your scores against the right normative reference group.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label style={{ fontSize: 13, color: COLORS.muted, display: 'block', marginBottom: 8 }}>Age</label>
            <input type="number" value={answers.age || ''} onChange={e => setAnswers({ ...answers, age: e.target.value })} style={inputStyle} placeholder="e.g. 42" />
          </div>
          <div>
            <label style={{ fontSize: 13, color: COLORS.muted, display: 'block', marginBottom: 8 }}>Sex assigned at birth</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Female', 'Male', 'Prefer not to say'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, sex: opt })}
                  style={{
                    flex: 1, padding: '14px 12px', fontSize: 15,
                    border: `1px solid ${answers.sex === opt ? COLORS.forest : COLORS.borderDark}`,
                    background: answers.sex === opt ? COLORS.forest : COLORS.card,
                    color: answers.sex === opt ? COLORS.cream : COLORS.text,
                    cursor: 'pointer', fontFamily: FONT_SANS, borderRadius: 2, transition: 'all 150ms ease',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: COLORS.muted, display: 'block', marginBottom: 8 }}>Height (inches)</label>
              <input type="number" value={answers.height || ''} onChange={e => setAnswers({ ...answers, height: e.target.value })} style={inputStyle} placeholder="e.g. 66" />
            </div>
            <div>
              <label style={{ fontSize: 13, color: COLORS.muted, display: 'block', marginBottom: 8 }}>Current weight (lbs)</label>
              <input type="number" value={answers.weight || ''} onChange={e => setAnswers({ ...answers, weight: e.target.value })} style={inputStyle} placeholder="e.g. 180" />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, color: COLORS.muted, display: 'block', marginBottom: 8 }}>Highest adult weight (lbs, optional)</label>
            <input type="number" value={answers.highestWeight || ''} onChange={e => setAnswers({ ...answers, highestWeight: e.target.value })} style={inputStyle} placeholder="optional" />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56 }}>
          <Button variant="ghost" onClick={onBack}>← Back</Button>
          <Button onClick={onNext} disabled={!canContinue}>See my profile →</Button>
        </div>
      </div>
    </AssessmentShell>
  );
}

function ComputingScreen({ onLogoClick }) {
  return (
    <AssessmentShell progress={100} onLogoClick={onLogoClick}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '160px 28px', textAlign: 'center' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 32 }}>
          Computing your profile
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 32 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%', background: COLORS.forest,
              animation: `bounce 1.2s infinite ${i * 0.15}s`,
            }} />
          ))}
        </div>
        <p style={{ color: COLORS.muted, fontFamily: FONT_SERIF, fontStyle: 'italic', fontSize: 22 }}>
          Mapping your eating phenotype…
        </p>
      </div>
    </AssessmentShell>
  );
}

function StartingPointCallout({ satisfaction }) {
  const overall = satisfaction.sat_overall;
  const trajectoryArrow = {
    'Significantly better': '↑↑',
    'Somewhat better': '↑',
    'About the same': '→',
    'Somewhat worse': '↓',
    'Significantly worse': '↓↓',
  }[satisfaction.trajectory] || '→';
  const satTone = overall >= 8 ? 'a strong place'
    : overall >= 6 ? 'a generally positive place'
    : overall >= 4 ? 'a mixed place'
    : 'a frustrating place';

  return (
    <div className="print-avoid-break" style={{
      background: COLORS.card, border: `1px solid ${COLORS.border}`,
      padding: '32px 36px', marginBottom: 48,
    }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 16 }}>
        Your starting point
      </div>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>Overall satisfaction</div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 32, color: COLORS.forest }}>{overall}/10</div>
        </div>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>Relationship with food</div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 32, color: COLORS.forest }}>{satisfaction.sat_food}/10</div>
        </div>
      </div>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingTop: 20, borderTop: `1px solid ${COLORS.border}` }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>Plateau</div>
          <div style={{ fontSize: 14 }}>{satisfaction.plateau}</div>
        </div>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>Last month {trajectoryArrow}</div>
          <div style={{ fontSize: 14 }}>{satisfaction.trajectory}</div>
        </div>
      </div>
      {satisfaction.topFrustration && (
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${COLORS.border}` }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 6 }}>Biggest frustration</div>
          <div style={{ color: COLORS.terracotta, fontStyle: 'italic', fontFamily: FONT_SERIF, fontSize: 18 }}>{satisfaction.topFrustration}</div>
        </div>
      )}
      <div style={{ marginTop: 20, fontSize: 13, color: COLORS.muted, lineHeight: 1.5, fontStyle: 'italic' }}>
        You’re entering this assessment from {satTone}. Your phenotype below helps explain why—and what to focus on next.
      </div>
    </div>
  );
}

function ResultsScreen({ tfeq, red, phenotypeKey, satisfaction, onRetake, onBackToSite }) {
  const pheno = PHENOTYPES[phenotypeKey];

  const scoreData = [
    { name: 'Cognitive\nRestraint', score: tfeq.CR,    category: tfeq.CR > 55     ? 'high' : tfeq.CR > 35     ? 'mid' : 'low' },
    { name: 'Emotional\nEating',    score: tfeq.EE,    category: tfeq.EE > 45     ? 'high' : tfeq.EE > 25     ? 'mid' : 'low' },
    { name: 'Uncontrolled\nEating', score: tfeq.UE,    category: tfeq.UE > 55     ? 'high' : tfeq.UE > 35     ? 'mid' : 'low' },
    { name: 'Reward-Based\nEating', score: red.AGG_pct, category: red.AGG_pct > 50 ? 'high' : red.AGG_pct > 30 ? 'mid' : 'low' },
  ];
  const categoryColor = (cat) => ({ high: COLORS.terracotta, mid: COLORS.amber, low: COLORS.sage }[cat]);

  // Custom tick renderer: splits 'Cognitive\nRestraint' into two stacked lines.
  // Recharts does not natively wrap on \n, which was causing overlap.
  const TwoLineTick = ({ x, y, payload }) => {
    const lines = String(payload.value).split('\n');
    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line, i) => (
          <text
            key={i}
            x={0}
            y={i * 14 + 14}
            textAnchor="middle"
            fill={COLORS.text}
            fontFamily="IBM Plex Sans"
            fontSize={12}
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream, color: COLORS.text, fontFamily: FONT_SANS }}>
      <PrototypeBanner />
      <header className="no-print" style={{
        borderBottom: `1px solid ${COLORS.border}`, padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Logo onClick={onBackToSite} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" onClick={() => window.print()}>Download PDF</Button>
          <Button variant="ghost" onClick={onRetake}>Retake</Button>
        </div>
      </header>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '64px 28px 120px' }}>
        <StartingPointCallout satisfaction={satisfaction} />

        {/* HERO */}
        <div className="print-avoid-break" style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.terracotta, marginBottom: 20 }}>
            Your eating phenotype
          </div>
          <h1 style={{ fontFamily: FONT_SERIF, fontSize: 84, lineHeight: 0.98, letterSpacing: '-0.025em', margin: '0 0 20px', fontWeight: 400 }}>
            {pheno.name}
          </h1>
          <p style={{ fontFamily: FONT_SERIF, fontSize: 26, fontStyle: 'italic', color: COLORS.muted, lineHeight: 1.3, margin: '0 0 32px', maxWidth: 720 }}>
            {pheno.tagline}
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.65, maxWidth: 680, color: COLORS.text }}>
            {pheno.paragraph}
          </p>
        </div>

        {/* SCORE CARD */}
        <div className="print-avoid-break" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, padding: '40px 40px 32px', marginBottom: 48 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 8 }}>
            Your subscale scores
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 24, marginBottom: 28, fontWeight: 400 }}>
            Where you fall on each dimension
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} margin={{ top: 20, right: 20, left: 0, bottom: 50 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={<TwoLineTick />} interval={0} height={50} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: COLORS.muted, fontFamily: 'IBM Plex Mono' }} ticks={[0, 25, 50, 75, 100]} />
                <ReferenceLine y={50} stroke={COLORS.borderDark} strokeDasharray="2 4" />
                <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                  {scoreData.map((entry, idx) => <Cell key={idx} fill={categoryColor(entry.category)} />)}
                  <LabelList dataKey="score" position="top" formatter={(v) => Math.round(v)} style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fill: COLORS.text }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            display: 'flex', gap: 20, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${COLORS.border}`,
            fontFamily: FONT_MONO, fontSize: 12, color: COLORS.muted, letterSpacing: '0.05em',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: COLORS.sage, borderRadius: 2 }} /> Low</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: COLORS.amber, borderRadius: 2 }} /> Moderate</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: COLORS.terracotta, borderRadius: 2 }} /> Elevated</span>
            <span style={{ marginLeft: 'auto', textTransform: 'none', fontFamily: FONT_SANS }}>Scores on 0–100 scale. Dashed line = population median.</span>
          </div>
        </div>

        {/* GLP-1 IMPLICATIONS */}
        <div className="print-avoid-break" style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.terracotta, marginBottom: 16 }}>
            For your GLP-1 journey
          </div>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: 40, lineHeight: 1.1, margin: '0 0 32px', fontWeight: 400 }}>
            What this means while you’re on the drug.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {pheno.glp1.map((text, i) => (
              <div key={i} style={{ display: 'flex', gap: 20, padding: '20px 24px', background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 28, color: COLORS.terracotta, lineHeight: 1, fontStyle: 'italic', minWidth: 32 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.6, color: COLORS.text }}>{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FOCUS AREAS */}
        <div className="print-avoid-break" style={{ marginBottom: 48, background: COLORS.forest, color: COLORS.cream, padding: '48px 40px' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.sage, marginBottom: 16 }}>
            Where to focus
          </div>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: 32, lineHeight: 1.2, margin: '0 0 28px', fontWeight: 400 }}>
            Three areas matched to your phenotype.
          </h2>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {pheno.focus.map((f, i) => (
              <div key={i} style={{ borderTop: `1px solid ${COLORS.sage}`, paddingTop: 16 }}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.sage, letterSpacing: '0.15em', marginBottom: 8 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 22, lineHeight: 1.2 }}>{f}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSULTATION CTA */}
        <ConsultationCTA phenotype={pheno} />

        {/* DETAILED SCORES */}
        <div className="print-avoid-break" style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 16 }}>
            The numbers
          </div>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: 32, lineHeight: 1.1, margin: '0 0 32px', fontWeight: 400 }}>
            Your full score profile.
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${COLORS.borderDark}` }}>
                {['Instrument', 'Subscale', 'Your score', 'Reference'].map((h, i) => (
                  <th key={i} style={{
                    textAlign: i >= 2 ? 'right' : 'left', padding: '12px 0',
                    fontFamily: FONT_MONO, fontSize: 11, color: COLORS.muted,
                    textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 400,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontFamily: FONT_SANS }}>
              {[
                ['TFEQ-R21', 'Cognitive Restraint', tfeq.CR.toFixed(1), '45 (pop.)'],
                ['TFEQ-R21', 'Uncontrolled Eating', tfeq.UE.toFixed(1), '40 (pop.)'],
                ['TFEQ-R21', 'Emotional Eating',    tfeq.EE.toFixed(1), '35 (pop.)'],
                ['RED-13',   'Loss of Control',     red.LOC.toFixed(2),  '~2.5'],
                ['RED-13',   'Lack of Satiety',     red.LOS.toFixed(2),  '~2.3'],
                ['RED-13',   'Preoccupation',       red.PWF.toFixed(2),  '~2.4'],
                ['RED-13',   'Aggregate',           red.AGG.toFixed(2), '~2.4'],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: '14px 0', fontSize: 14, color: COLORS.muted, fontFamily: FONT_MONO }}>{row[0]}</td>
                  <td style={{ padding: '14px 0', fontSize: 15 }}>{row[1]}</td>
                  <td style={{ padding: '14px 0', fontSize: 15, textAlign: 'right', fontFamily: FONT_MONO }}>{row[2]}</td>
                  <td style={{ padding: '14px 0', fontSize: 13, textAlign: 'right', color: COLORS.muted, fontFamily: FONT_MONO }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER NOTE */}
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 32, fontSize: 13, color: COLORS.muted, lineHeight: 1.65, maxWidth: 640 }}>
          <p style={{ margin: '0 0 12px' }}>
            This assessment is based on the Three-Factor Eating Questionnaire–R21 (Karlsson et al., 2000; de Lauzon et al., 2004) and the Reward-based Eating Drive scale, 13-item version (Mason et al., 2017; Vainik et al., 2019). Both are validated self-report measures of eating behavior.
          </p>
          <p style={{ margin: 0 }}>
            Scores reflect a snapshot of your eating tendencies, not a clinical diagnosis. Consider retaking the assessment at 3 and 6 months into your GLP-1 treatment, and again if you taper or discontinue, to see how your profile shifts.
          </p>
        </div>
      </div>
    </div>
  );
}

function ConsultationCTA({ phenotype }) {
  const subject = encodeURIComponent(`Behavioral consultation request — ${phenotype.name}`);
  const body = encodeURIComponent(
    `Hi ${FOUNDER_NAME},\n\nI just took the ${BRAND_NAME} assessment and I’d like to book a 1:1 behavioral consultation.\n\nMy phenotype: ${phenotype.name}\n\nThank you,\n`
  );
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  return (
    <div className="print-avoid-break" style={{
      marginBottom: 48,
      background: COLORS.card,
      border: `1px solid ${COLORS.borderDark}`,
      borderLeft: `4px solid ${COLORS.terracotta}`,
      padding: '48px 40px',
    }}>
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: COLORS.terracotta, marginBottom: 16, fontWeight: 500,
          }}>
            Go deeper
          </div>
          <h2 style={{
            fontFamily: FONT_SERIF, fontSize: 36, lineHeight: 1.1, margin: '0 0 16px', fontWeight: 400,
          }}>
            Walk through your profile with the founder.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: COLORS.text, margin: '0 0 24px' }}>
            A 60-minute behavioral consultation with {FOUNDER_NAME}, PhD. We’ll go through your phenotype together — the research behind your patterns, what they mean for your specific GLP-1 context, and the behavioral focus areas where the work actually lives for you.
          </p>
          <ul style={{ paddingLeft: 18, color: COLORS.text, fontSize: 15, lineHeight: 1.8, margin: '0 0 28px' }}>
            <li>Personalized interpretation of your scores by an eating-behavior scientist</li>
            <li>Discussion of your three focus areas, tailored to your medication context</li>
            <li>Time for your specific questions — plateaus, food noise, tapering, or whatever you’re sitting with</li>
          </ul>
          <p style={{
            fontSize: 11, color: COLORS.muted, lineHeight: 1.55, fontFamily: FONT_MONO,
            letterSpacing: '0.02em', maxWidth: '60ch', margin: 0,
          }}>
            Behavioral consultations are educational sessions grounded in eating-behavior research. They are not nutrition counseling, medical nutrition therapy, or treatment for any condition. For medical decisions, always work with your prescribing physician.
          </p>
        </div>

        <div style={{
          background: COLORS.forest, color: COLORS.cream,
          padding: '32px 28px', borderRadius: 4, textAlign: 'center',
        }}>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: COLORS.amber, marginBottom: 12,
          }}>
            1:1 with {FOUNDER_NAME}, PhD
          </div>
          <div style={{
            fontFamily: FONT_SERIF, fontSize: 56, lineHeight: 1, fontWeight: 400, marginBottom: 4,
          }}>
            $199
          </div>
          <div style={{ fontSize: 13, color: '#D8DDD3', marginBottom: 24 }}>
            60 minutes · video call
          </div>
          <a href={mailto} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: COLORS.cream, color: COLORS.forest,
            padding: '14px 26px', borderRadius: 2,
            fontFamily: FONT_SANS, fontSize: 14, fontWeight: 500,
            textDecoration: 'none', letterSpacing: '0.01em',
          }}>
            Request a session →
          </a>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.05em',
            color: COLORS.sage, marginTop: 16,
          }}>
            Limited availability during private beta
          </div>
        </div>
      </div>
    </div>
  );
}


// =============================================================================
// 8. MAIN APP
// =============================================================================

export default function App() {
  useFonts();
  useDocumentTitle(`${BRAND_NAME}\u2122 — Eating-Behavior Assessment for GLP-1 Patients`);
  const [view, setView] = useState('site'); // 'site' | 'assessment'

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <>
      <GlobalStyles />
      {view === 'site' && <MarketingSite onStartAssessment={() => setView('assessment')} />}
      {view === 'assessment' && <AssessmentApp onBackToSite={() => setView('site')} />}
    </>
  );
}
