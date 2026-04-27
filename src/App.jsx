import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts';

// =============================================================================
// MERIDIAN — Unified App
// =============================================================================
// One file that contains both the marketing site and the eating-profile
// assessment. Navigation between them is handled by a single `view` state
// at the bottom of this file.
//
// STRUCTURE
//   1. Constants     → palette, typography, instruments, phenotypes, scoring
//   2. Hooks/styles  → font loading, global keyframes & print styles
//   3. Shared        → Logo, Button, SectionHeader
//   4. Marketing     → Nav, Hero, Gap, Approach, AssessmentSection, About, Waitlist, Footer
//   5. Assessment    → Context, Questionnaire, Demographics, Computing, Results, ConsultationCTA
//   6. Main App      → routing between site & assessment
//
// PLACEHOLDERS TO REPLACE BEFORE LAUNCH (search the file):
//   • FOUNDER_NAME              — used throughout
//   • FOUNDER_BIO               — about-page paragraphs
//   • CONTACT_EMAIL             — used in waitlist + consultation request mailto
//   • Final wording of disclaimer (footer + consultation CTA)
//
// LEGAL NOTES (from prior planning):
//   • Founder is a PhD eating-behavior scientist, NOT licensed RDN/LDN.
//   • The 1:1 offering is positioned as a *behavioral consultation* —
//     educational, not nutrition counseling. Do not change this wording
//     without re-running the legal analysis.
// =============================================================================


// =============================================================================
// 1. CONSTANTS
// =============================================================================

const FOUNDER_NAME = '[Your Name]';      // ← replace with real name
const CONTACT_EMAIL = 'hello@meridian.example'; // ← replace with real email

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

// -- Instruments ---------------------------------------------------------------
// NOTE: TFEQ-R21 and PFS items below closely reflect published wording.
// Final production items must use the officially licensed versions.

const TFEQ_ITEMS = [
  { id: 'cr1', text: 'I deliberately take small helpings as a means of controlling my weight.', scale: 'CR' },
  { id: 'cr2', text: 'I consciously hold back at meals in order not to gain weight.', scale: 'CR' },
  { id: 'cr3', text: 'I do not eat some foods because they make me fat.', scale: 'CR' },
  { id: 'cr4', text: 'I avoid stocking up on tempting foods.', scale: 'CR' },
  { id: 'cr5', text: 'I am likely to consciously eat less than I want.', scale: 'CR' },
  { id: 'cr6', text: 'On a typical day, I pay close attention to what I eat.', scale: 'CR' },

  { id: 'ue1', text: 'Sometimes when I start eating, I just can\u2019t seem to stop.', scale: 'UE' },
  { id: 'ue2', text: 'Being with someone who is eating often makes me hungry enough to eat too.', scale: 'UE' },
  { id: 'ue3', text: 'When I smell a delicious food, I find it very difficult to keep from eating\u2014even if I just finished a meal.', scale: 'UE' },
  { id: 'ue4', text: 'I am always hungry enough to eat at any time.', scale: 'UE' },
  { id: 'ue5', text: 'I\u2019m always hungry, so it\u2019s hard for me to stop eating before I finish everything on my plate.', scale: 'UE' },
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

const PFS_ITEMS = [
  { id: 'fa1', text: 'I find myself thinking about food even when I\u2019m not physically hungry.', scale: 'FA' },
  { id: 'fa2', text: 'I get more pleasure from eating than I do from almost anything else.', scale: 'FA' },
  { id: 'fa3', text: 'It\u2019s scary to think of the power that food has over me.', scale: 'FA' },
  { id: 'fa4', text: 'I often find myself thinking about what foods I\u2019ll eat later.', scale: 'FA' },
  { id: 'fa5', text: 'I love the taste of certain foods so much that I can\u2019t avoid eating them even if they\u2019re bad for me.', scale: 'FA' },
  { id: 'fp1', text: 'When I\u2019m around fattening food I love, it\u2019s hard to stop myself from at least tasting it.', scale: 'FP' },
  { id: 'fp2', text: 'If I see or smell a food I like, I get a powerful urge to have some.', scale: 'FP' },
  { id: 'fp3', text: 'When I know a delicious food is available, I can\u2019t help thinking about having some.', scale: 'FP' },
  { id: 'fp4', text: 'Seeing an appetizing meal on TV or in a magazine makes me want to eat.', scale: 'FP' },
  { id: 'fp5', text: 'When delicious foods are right in front of me, it\u2019s very difficult to wait.', scale: 'FP' },
  { id: 'ft1', text: 'When I eat delicious food, I focus a lot on how good it tastes.', scale: 'FT' },
  { id: 'ft2', text: 'Just before I taste a favorite food, I feel intense anticipation.', scale: 'FT' },
  { id: 'ft3', text: 'When I taste a favorite food, I feel intense pleasure.', scale: 'FT' },
  { id: 'ft4', text: 'Before I eat a food I love, my mouth tends to flood with saliva.', scale: 'FT' },
  { id: 'ft5', text: 'When I eat delicious food, the pleasure I feel is so strong it can be hard to control.', scale: 'FT' },
];

const PFS_OPTIONS = [
  { value: 1, label: 'Don\u2019t agree at all' },
  { value: 2, label: 'Slightly agree' },
  { value: 3, label: 'Moderately agree' },
  { value: 4, label: 'Strongly agree' },
  { value: 5, label: 'Agree very strongly' },
];

const GLP1_QUESTIONS = [
  { id: 'medication', q: 'Which medication are you currently taking?',
    options: ['Semaglutide (Ozempic)', 'Semaglutide (Wegovy)', 'Tirzepatide (Mounjaro)', 'Tirzepatide (Zepbound)', 'Liraglutide (Saxenda / Victoza)', 'Other GLP-1 / GIP agonist', 'Not currently taking one'] },
  { id: 'duration', q: 'How long have you been taking it?',
    options: ['Less than 4 weeks', '1\u20133 months', '3\u20136 months', '6\u201312 months', 'More than 12 months', 'Not currently taking'] },
  { id: 'dose_phase', q: 'Where are you in your titration?',
    options: ['Starting dose', 'Mid-titration', 'At therapeutic dose', 'Maintenance', 'Tapering off', 'Not sure'] },
  { id: 'reason', q: 'What\u2019s the primary reason you\u2019re taking it?',
    options: ['Weight management', 'Type 2 diabetes', 'Both weight and diabetes', 'PCOS or metabolic health', 'Other'] },
  { id: 'plateau', q: 'Have you hit a plateau in the last month?',
    options: ['Yes, a clear plateau', 'Some slowing', 'No, still progressing', 'Not sure yet'] },
  { id: 'considered_stopping', q: 'Have you considered stopping the medication?',
    options: ['Yes, actively', 'Sometimes I think about it', 'Not really', 'I\u2019ve already stopped'] },
  { id: 'prior_attempts', q: 'Any prior attempts at GLP-1 therapy?',
    options: ['This is my first time', 'One prior attempt', 'Multiple prior attempts'] },
];

// -- Scoring -------------------------------------------------------------------

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

function scorePFS(answers) {
  const faItems = PFS_ITEMS.filter(i => i.scale === 'FA');
  const fpItems = PFS_ITEMS.filter(i => i.scale === 'FP');
  const ftItems = PFS_ITEMS.filter(i => i.scale === 'FT');
  const mean = (items) => items.reduce((acc, it) => acc + (answers[it.id] || 0), 0) / items.length;
  const FA = mean(faItems), FP = mean(fpItems), FT = mean(ftItems);
  const AGG = (FA + FP + FT) / 3;
  const toPct = (v) => ((v - 1) / 4) * 100;
  return { FA, FP, FT, AGG, FA_pct: toPct(FA), FP_pct: toPct(FP), FT_pct: toPct(FT), AGG_pct: toPct(AGG) };
}

function determinePhenotype(tfeq, pfs) {
  const elevated = {
    restraint:    tfeq.CR > 55,
    uncontrolled: tfeq.UE > 55,
    emotional:    tfeq.EE > 45,
    hedonic:      pfs.AGG_pct > 50,
  };
  const driveCount = [elevated.uncontrolled, elevated.emotional, elevated.hedonic].filter(Boolean).length;
  if (driveCount === 0 && !elevated.restraint) return 'homeostatic';
  if (driveCount === 0 && elevated.restraint) return 'cognitive_restrainer';
  if (driveCount >= 2 && elevated.restraint) return 'effortful_restrainer';
  if (driveCount >= 2) return 'multi_driver';
  if (elevated.hedonic) return 'hedonic_responder';
  if (elevated.emotional) return 'emotional_eater';
  if (elevated.uncontrolled) return 'disinhibited_eater';
  return 'mixed';
}

const PHENOTYPES = {
  homeostatic: {
    name: 'Homeostatic Eater',
    tagline: 'Your eating is largely driven by physiological hunger.',
    paragraph: 'Your profile suggests that food reward, emotional triggers, and loss-of-control eating are not prominent drivers for you. Eating appears to respond primarily to physical hunger signals rather than to environmental cues or internal states.',
    glp1: [
      'GLP-1 medications tend to produce straightforward appetite reduction in this profile, without dramatic changes in how food feels psychologically.',
      'Your main risk is under-eating: because satiety comes easily, you may need to consciously meet protein and calorie targets to preserve lean mass.',
      'Discontinuation risk is moderate but typically more about hunger signals returning than about reward-driven relapse.',
    ],
    focus: ['Protein targets', 'Strength training', 'Planned eating windows'],
  },
  cognitive_restrainer: {
    name: 'Cognitive Restrainer',
    tagline: 'You manage eating through conscious control, with relatively quiet food drives.',
    paragraph: 'You show elevated cognitive restraint without the strong uncontrolled, emotional, or hedonic drives that often accompany it. This is an adaptive pattern for many people\u2014but it depends on sustained cognitive effort that can be disrupted by stress, sleep loss, or dietary rules that are too rigid.',
    glp1: [
      'GLP-1 medications often feel confirming for this profile: they reduce the low-grade appetite noise you\u2019ve been managing cognitively.',
      'Watch for reliance on the drug to maintain restraint. Skills-based support during treatment builds discontinuation resilience.',
      'Rigid rule-based restraint can tip into disinhibition if rules are broken. Flexible restraint (planning, not prohibition) is more sustainable.',
    ],
    focus: ['Flexible vs rigid restraint', 'Discontinuation planning', 'Stress buffering'],
  },
  effortful_restrainer: {
    name: 'Effortful Restrainer',
    tagline: 'You use cognitive control to manage strong, multi-channel food drives.',
    paragraph: 'Your profile shows the classic restraint-disinhibition tension: high conscious control combined with elevated drives (emotional, hedonic, or uncontrolled). This is the pattern most at risk for the counter-regulatory rebound when restraint breaks down, and one of the most common profiles in chronic dieters.',
    glp1: [
      'GLP-1 medications can feel transformative for this profile\u2014for the first time, control doesn\u2019t require white-knuckling. This is often the group that reports "the food noise is gone."',
      'The risk is that the drug is doing the regulatory work your restraint was doing before. Without building skills, discontinuation tends to produce rebound.',
      'This is the profile where behavioral support during the drug window matters most for long-term outcomes.',
    ],
    focus: ['Skill-building during treatment', 'Emotion regulation', 'Identifying personal triggers'],
  },
  emotional_eater: {
    name: 'Emotional Eater',
    tagline: 'Your eating is meaningfully driven by affective states.',
    paragraph: 'Emotional eating is your dominant driver. Eating in response to negative affect (anxiety, sadness, loneliness, irritation) is common and largely serves a self-regulation function\u2014food reliably, if briefly, reduces distress.',
    glp1: [
      'GLP-1 medications reduce physiological hunger but often leave emotional eating relatively intact. The urge to eat when stressed or sad may persist even when hunger is absent.',
      'This is the profile where GLP-1s sometimes feel "less effective than expected"\u2014because the drug isn\u2019t targeting your main driver.',
      'Emotion regulation skills (not just diet skills) are the right intervention here. Consider this a window to build them while appetite noise is reduced.',
    ],
    focus: ['Emotion regulation', 'Non-food coping strategies', 'Distress tolerance'],
  },
  hedonic_responder: {
    name: 'Hedonic Responder',
    tagline: 'Your eating is driven by food reward and environmental cues.',
    paragraph: 'Your profile shows elevated sensitivity to the reward properties of food\u2014the sight, smell, anticipation, and taste of palatable food are unusually motivating for you. This is sometimes called hedonic hunger: wanting food in the absence of caloric need.',
    glp1: [
      'GLP-1 medications affect reward circuitry in addition to homeostatic hunger, and many Hedonic Responders report the most striking subjective change\u2014food loses some of its pull.',
      'The risk is that when the drug is discontinued, reward signaling returns; if you haven\u2019t changed your food environment, the old cues are still there.',
      'This is an ideal window to reshape your food environment: what\u2019s in your home, what routes you take, which cues you\u2019ve been responding to.',
    ],
    focus: ['Environmental restructuring', 'Cue exposure awareness', 'Planning for discontinuation'],
  },
  disinhibited_eater: {
    name: 'Disinhibited Eater',
    tagline: 'Your eating is marked by loss-of-control episodes and strong hunger signals.',
    paragraph: 'Your profile shows elevated uncontrolled eating: strong hunger signals, difficulty stopping once started, and responsiveness to external eating cues. This pattern overlaps with but is not identical to binge eating.',
    glp1: [
      'GLP-1 medications are generally highly effective for this profile\u2014reducing hunger intensity and interrupting the eating cascades that define the pattern.',
      'Pay attention to whether loss-of-control episodes persist despite reduced hunger. If they do, the pattern may be more binge-type and warrants specific behavioral support.',
      'Building regular eating structure (not skipping meals) is counterintuitively protective against disinhibition.',
    ],
    focus: ['Regular meal structure', 'Satiety-cue recognition', 'Screening for binge pattern'],
  },
  multi_driver: {
    name: 'Multi-Driver Profile',
    tagline: 'Multiple eating drivers are elevated simultaneously.',
    paragraph: 'Your profile shows elevations across two or more of emotional, hedonic, and uncontrolled eating. This is a more complex presentation that typically benefits from more layered support\u2014different drivers respond to different interventions.',
    glp1: [
      'GLP-1 medications will likely address some drivers (particularly hunger and reward) more than others (particularly emotional).',
      'Expect a mixed experience: some eating patterns may quiet dramatically while others persist. This is informative, not failure.',
      'A phased approach\u2014targeting one driver at a time with tailored skills\u2014often works better than trying to change everything at once.',
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
// 2. HOOKS & GLOBAL STYLES
// =============================================================================

function useFonts() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById('meridian-fonts')) return;
    const link = document.createElement('link');
    link.id = 'meridian-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);
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
        .section-pad { padding: 80px 24px !important; }
        .hero-pad { padding: 120px 24px 80px !important; }
      }

      /* PRINT STYLES (for the "Download PDF" button on results) */
      @media print {
        body { background: white; }
        .no-print { display: none !important; }
        .print-page-break { page-break-before: always; }
        .print-avoid-break { page-break-inside: avoid; }
        .print-bg-light { background: white !important; color: ${COLORS.text} !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `}</style>
  );
}


// =============================================================================
// 3. SHARED COMPONENTS
// =============================================================================

function Logo({ size = 22, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: COLORS.forest, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: size * 0.27, borderRadius: '50%', background: COLORS.cream }} />
      </div>
      <span style={{ fontFamily: FONT_SERIF, fontSize: size, letterSpacing: '0.01em', color: COLORS.text }}>Meridian</span>
    </div>
  );
}

function Button({ children, onClick, variant = 'primary', disabled, style, ...rest }) {
  const base = {
    fontFamily: FONT_SANS,
    fontSize: 15,
    fontWeight: 500,
    padding: '14px 26px',
    borderRadius: 2,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 200ms ease',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    letterSpacing: '0.01em',
    opacity: disabled ? 0.4 : 1,
    textDecoration: 'none',
  };
  const variants = {
    primary: { background: COLORS.forest, color: COLORS.cream },
    ghost:   { background: 'transparent', color: COLORS.muted, padding: '10px 14px' },
    outline: { background: 'transparent', color: COLORS.text, border: `1px solid ${COLORS.borderDark}` },
    cream:   { background: COLORS.cream, color: COLORS.forest },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }} {...rest}>
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


// =============================================================================
// 4. MARKETING SITE
// =============================================================================

function MarketingSite({ onStartAssessment }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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
          GLP-1 changed how you eat. <em style={{ fontStyle: 'italic', color: COLORS.forest }}>Meridian helps you understand why.</em>
        </h1>

        <p className="fade-up d3" style={{
          fontSize: 'clamp(1.1rem, 1.55vw, 1.3rem)',
          lineHeight: 1.55,
          color: COLORS.muted,
          maxWidth: '54ch',
          margin: '0 0 56px 0',
        }}>
          An evidence-based eating-behavior assessment, built for the questions your medication can\u2019t answer. Designed by a PhD researcher in human eating behavior \u2014 for the people actually living through this.
        </p>

        <div className="fade-up d4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Button onClick={onStartAssessment}>
            Take the assessment
            <span style={{ fontSize: 18, lineHeight: 1 }}>\u2192</span>
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
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            lineHeight: 1.1,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            margin: 0,
            color: COLORS.text,
          }}>
            Most GLP-1 apps track. <em style={{ fontStyle: 'italic', color: COLORS.forest }}>None of them ask why you eat.</em>
          </h2>
          <div>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: COLORS.text, margin: '0 0 24px 0' }}>
              The medication quiets hunger. It doesn\u2019t change emotional eating, response to highly palatable food, or the way restraint plays out across your week. Roughly two-thirds of patients discontinue within a year, and most regain weight when they do \u2014 because the drug was never the part that addressed eating behavior.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: COLORS.text, margin: 0 }}>
              Meridian fills the gap that calorie counters and habit trackers don\u2019t. It uses validated instruments from eating-behavior research to map how you actually relate to food \u2014 and what that means for your time on, off, and after GLP-1.
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
        fontFamily: FONT_SERIF,
        fontSize: 'clamp(2rem, 3.4vw, 2.6rem)',
        fontWeight: 400,
        color: COLORS.forest,
        letterSpacing: '-0.015em',
        marginBottom: 8,
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
      padding: '140px 48px',
      background: '#EDE6D5',
      position: 'relative', overflow: 'hidden',
    }}>
      <div className="grain-overlay" />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <SectionHeader number="02" label="The Approach" />

        <h2 style={{
          fontFamily: FONT_SERIF,
          fontSize: 'clamp(2.25rem, 5vw, 4.25rem)',
          lineHeight: 1.05,
          fontWeight: 400,
          letterSpacing: '-0.025em',
          margin: '0 0 80px 0',
          maxWidth: '20ch',
          color: COLORS.text,
        }}>
          Built on the research, not the trend cycle.
        </h2>

        <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48 }}>
          <Pillar
            label="Validated Instruments"
            text="The assessment uses items from the Three-Factor Eating Questionnaire (TFEQ-R21) and Power of Food Scale \u2014 the gold standards for measuring cognitive restraint, emotional eating, uncontrolled eating, and hedonic responsiveness."
          />
          <Pillar
            label="Phenotype, Not Diet"
            text="Eight distinct eating profiles, not one set of rules. The same GLP-1 dose lands very differently depending on whether you\u2019re a Cognitive Restrainer or an Emotional Eater. Your phenotype tells you what to actually focus on."
          />
          <Pillar
            label="GLP-1 Native"
            text="Most behavioral nutrition tools were built for a pre-GLP-1 world. Meridian is designed for the questions you actually have right now \u2014 about plateaus, food noise, tapering, and what comes next."
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
            fontFamily: FONT_SERIF,
            fontSize: 'clamp(1.4rem, 2.2vw, 1.95rem)',
            lineHeight: 1.4,
            fontStyle: 'italic',
            fontWeight: 400,
            color: COLORS.text,
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            "After a decade studying eating behavior, what I see in the GLP-1 conversation is a missing piece. The medication is a tool. Understanding the way you eat is the rest of the work \u2014 and it\u2019s the part that has to come from you."
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
        fontFamily: FONT_MONO,
        fontSize: 10,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: COLORS.terracotta,
        fontWeight: 500,
        marginBottom: 20,
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
              fontFamily: FONT_SERIF,
              fontSize: 'clamp(2.25rem, 4.6vw, 3.75rem)',
              lineHeight: 1.05,
              fontWeight: 400,
              letterSpacing: '-0.025em',
              margin: '0 0 32px 0',
            }}>
              Ten minutes. <em style={{ fontStyle: 'italic', color: COLORS.forest }}>One precise picture of how you eat.</em>
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.65, color: COLORS.text, margin: '0 0 40px 0' }}>
              You\u2019ll answer questions drawn from validated eating-behavior research. We map your responses across four dimensions \u2014 cognitive restraint, uncontrolled eating, emotional eating, and hedonic responsiveness to food \u2014 and surface the eating phenotype that fits your patterns most closely.
            </p>

            <ProcessStep number="01" title="Answer" text="Roughly 30 questions about how you eat, why you eat, and what foods do to you. No tracking, no logging." />
            <ProcessStep number="02" title="Map" text="Your responses are scored across the four research-grounded dimensions and matched to one of eight eating phenotypes." />
            <ProcessStep number="03" title="Understand" text="A personalized profile that names your patterns, explains what they mean for GLP-1 specifically, and points to where the work actually lives for you." last />

            <div style={{ marginTop: 48 }}>
              <Button onClick={onStartAssessment}>Begin assessment <span style={{ fontSize: 18, lineHeight: 1 }}>\u2192</span></Button>
              <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 16 }}>
                Free during private beta. No account required.
              </p>
            </div>
          </div>

          {/* Sample output card */}
          <div style={{
            background: COLORS.forest,
            color: COLORS.cream,
            padding: '48px 40px',
            borderRadius: 4,
            position: 'sticky',
            top: 100,
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
              The Hedonic Responder
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: '#D8DDD3', margin: '0 0 32px 0' }}>
              Your eating is shaped less by hunger and more by the appetitive pull of available food. GLP-1 likely takes the edge off cravings \u2014 but the underlying responsiveness to food cues hasn\u2019t gone away.
            </p>
            <div style={{ borderTop: `1px solid rgba(255,255,255,0.15)`, paddingTop: 24 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.amber, marginBottom: 16, fontWeight: 500 }}>
                Score profile
              </div>
              <ScoreBar label="Cognitive Restraint" value={32} />
              <ScoreBar label="Uncontrolled Eating" value={48} />
              <ScoreBar label="Emotional Eating" value={29} />
              <ScoreBar label="Hedonic Responsiveness" value={78} />
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
              background: 'linear-gradient(135deg, #C9BBA5 0%, #A89378 100%)',
              borderRadius: 4, position: 'relative', overflow: 'hidden', marginBottom: 16,
            }}>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.6)', fontFamily: FONT_MONO,
                fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>
                Photo placeholder
              </div>
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.muted, fontWeight: 500 }}>
              {/* FOUNDER_NAME */}
              {FOUNDER_NAME}, PhD
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Founder, Meridian</div>
          </div>

          <div>
            <h2 style={{
              fontFamily: FONT_SERIF,
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              lineHeight: 1.1,
              fontWeight: 400,
              letterSpacing: '-0.02em',
              margin: '0 0 32px 0',
            }}>
              I\u2019ve spent a decade asking <em style={{ fontStyle: 'italic', color: COLORS.forest }}>why people eat the way they do.</em>
            </h2>

            {/* FOUNDER_BIO — placeholder paragraphs, please rewrite */}
            <p style={{ fontSize: 17, lineHeight: 1.65, color: COLORS.text, margin: '0 0 24px 0' }}>
              I hold a PhD in eating behavior, with research focused on the psychological and behavioral mechanisms that shape how, when, and why people eat. Before Meridian, my work centered on [research focus \u2014 e.g., appetite regulation, hedonic eating, behavioral phenotyping in obesity].
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: COLORS.text, margin: '0 0 24px 0' }}>
              I started Meridian because I kept seeing the same gap. GLP-1 medications are doing real, measurable good \u2014 and at the same time, the apps built around them are mostly calorie counters with new branding. None of them speak to the actual lived experience of having your appetite rewired, or to the questions about what happens when the drug stops doing the work.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.65, color: COLORS.text, margin: '0 0 32px 0' }}>
              The eating-behavior science is there. The validated instruments exist. What\u2019s missing is a product that translates them into something useful for the millions of people taking these medications right now. That\u2019s what Meridian is.
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
          fontFamily: FONT_SERIF,
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          lineHeight: 1,
          fontWeight: 400,
          letterSpacing: '-0.025em',
          margin: '0 0 24px 0',
        }}>
          Be first when Meridian opens.
        </h2>

        <p style={{ fontSize: 18, lineHeight: 1.55, color: '#D8DDD3', maxWidth: '52ch', margin: '0 auto 56px' }}>
          Early access to the assessment, plus the research notes and writing I\u2019m publishing along the way. No spam, no daily emails \u2014 I write when there\u2019s something worth saying.
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
            <Button variant="cream" type="submit" onClick={onSubmit}>Join waitlist</Button>
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
              You\u2019re on the list.
            </div>
            <div style={{ fontSize: 15, color: '#D8DDD3' }}>
              We\u2019ll be in touch when the assessment opens. Thank you.
            </div>
          </div>
        )}

        <div style={{ marginTop: 48, fontFamily: FONT_MONO, fontSize: 11, color: COLORS.sage, letterSpacing: '0.05em' }}>
          Your email stays private. We use it once \u2014 to tell you when Meridian is ready.
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
          <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, maxWidth: '40ch', marginTop: 12 }}>
            An eating-behavior assessment for GLP-1 patients. Educational; not a substitute for medical advice or treatment.
          </div>
        </div>
        <div style={{
          fontFamily: FONT_MONO, fontSize: 11, color: COLORS.muted,
          display: 'flex', gap: 24, justifyContent: 'flex-end', flexWrap: 'wrap', letterSpacing: '0.05em',
        }}>
          <span>\u00a9 2026 Meridian</span>
          <a className="nav-link" style={{ textDecoration: 'none', cursor: 'pointer' }}>Privacy</a>
          <a className="nav-link" style={{ textDecoration: 'none', cursor: 'pointer' }}>Terms</a>
          <a style={{ color: COLORS.muted, textDecoration: 'none' }} href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
      </div>
    </footer>
  );
}


// =============================================================================
// 5. ASSESSMENT
// =============================================================================

function AssessmentApp({ onBackToSite }) {
  const [step, setStep] = useState('context');
  const [context, setContext] = useState({});
  const [tfeqA, setTfeqA] = useState({});
  const [pfsA, setPfsA] = useState({});
  const [demo, setDemo] = useState({});
  const [tfeqIdx, setTfeqIdx] = useState(0);
  const [pfsIdx, setPfsIdx] = useState(0);

  const runScoring = () => {
    setStep('computing');
    setTimeout(() => setStep('results'), 1600);
  };

  const reset = () => {
    setContext({}); setTfeqA({}); setPfsA({}); setDemo({});
    setTfeqIdx(0); setPfsIdx(0); setStep('context');
  };

  if (step === 'context') {
    return (
      <ContextScreen
        answers={context}
        setAnswers={setContext}
        onBack={onBackToSite}
        onNext={() => setStep('tfeq')}
        onLogoClick={onBackToSite}
      />
    );
  }
  if (step === 'tfeq') {
    return (
      <QuestionnaireScreen
        items={TFEQ_ITEMS} options={TFEQ_OPTIONS} answers={tfeqA} setAnswers={setTfeqA}
        idx={tfeqIdx} setIdx={setTfeqIdx}
        partName="Eating patterns" partNum={2} totalParts={4}
        progressBase={15} progressRange={45}
        onComplete={() => setStep('pfs')}
        onBack={() => setStep('context')}
        onLogoClick={onBackToSite}
      />
    );
  }
  if (step === 'pfs') {
    return (
      <QuestionnaireScreen
        items={PFS_ITEMS} options={PFS_OPTIONS} answers={pfsA} setAnswers={setPfsA}
        idx={pfsIdx} setIdx={setPfsIdx}
        partName="Food reward" partNum={3} totalParts={4}
        progressBase={60} progressRange={25}
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
        onBack={() => { setPfsIdx(PFS_ITEMS.length - 1); setStep('pfs'); }}
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
    const pfsScores = scorePFS(pfsA);
    const phenotypeKey = determinePhenotype(tfeqScores, pfsScores);
    return (
      <ResultsScreen
        tfeq={tfeqScores} pfs={pfsScores} phenotypeKey={phenotypeKey}
        context={context} demo={demo}
        onRetake={reset}
        onBackToSite={onBackToSite}
      />
    );
  }
  return null;
}

function AssessmentShell({ children, progress, onLogoClick }) {
  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream, color: COLORS.text, fontFamily: FONT_SANS }}>
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
    <AssessmentShell progress={10} onLogoClick={onLogoClick}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '56px 28px 120px' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 16 }}>
          Part 1 of 4 &middot; Your context
        </div>
        <h2 style={{ fontFamily: FONT_SERIF, fontSize: 40, lineHeight: 1.1, margin: '0 0 16px', fontWeight: 400 }}>
          A few questions to anchor your profile.
        </h2>
        <p style={{ color: COLORS.muted, fontSize: 16, marginBottom: 40, lineHeight: 1.5 }}>
          Your GLP-1 context shapes how we interpret your phenotype scores later.
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
          <Button variant="ghost" onClick={onBack}>\u2190 Back to site</Button>
          <Button onClick={onNext} disabled={!allAnswered}>Continue \u2192</Button>
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
          <Button variant="ghost" onClick={handleBack}>\u2190 Back</Button>
          {answered && idx < items.length - 1 && (
            <Button variant="outline" onClick={() => setIdx(idx + 1)}>Next \u2192</Button>
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
    <AssessmentShell progress={90} onLogoClick={onLogoClick}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '56px 28px 120px' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.muted, marginBottom: 16 }}>
          Part 4 of 4 &middot; About you
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
          <Button variant="ghost" onClick={onBack}>\u2190 Back</Button>
          <Button onClick={onNext} disabled={!canContinue}>See my profile \u2192</Button>
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
          Mapping your eating phenotype\u2026
        </p>
      </div>
    </AssessmentShell>
  );
}

function ResultsScreen({ tfeq, pfs, phenotypeKey, context, demo, onRetake, onBackToSite }) {
  const pheno = PHENOTYPES[phenotypeKey];

  const scoreData = [
    { name: 'Cognitive\nRestraint',  score: tfeq.CR,        norm: 45, category: tfeq.CR > 55       ? 'high' : tfeq.CR > 35       ? 'mid' : 'low' },
    { name: 'Uncontrolled\nEating',  score: tfeq.UE,        norm: 40, category: tfeq.UE > 55       ? 'high' : tfeq.UE > 35       ? 'mid' : 'low' },
    { name: 'Emotional\nEating',     score: tfeq.EE,        norm: 35, category: tfeq.EE > 45       ? 'high' : tfeq.EE > 25       ? 'mid' : 'low' },
    { name: 'Hedonic\nHunger',       score: pfs.AGG_pct,    norm: 40, category: pfs.AGG_pct > 50   ? 'high' : pfs.AGG_pct > 30   ? 'mid' : 'low' },
  ];
  const categoryColor = (cat) => ({ high: COLORS.terracotta, mid: COLORS.amber, low: COLORS.sage }[cat]);

  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream, color: COLORS.text, fontFamily: FONT_SANS }}>
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
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} margin={{ top: 20, right: 20, left: 0, bottom: 40 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fill: COLORS.text, fontFamily: 'IBM Plex Sans' }} interval={0} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: COLORS.muted, fontFamily: 'IBM Plex Mono' }} ticks={[0, 25, 50, 75, 100]} />
                <ReferenceLine y={50} stroke={COLORS.borderDark} strokeDasharray="2 4" />
                <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                  {scoreData.map((entry, idx) => (
                    <Cell key={idx} fill={categoryColor(entry.category)} />
                  ))}
                  <LabelList dataKey="score" position="top" formatter={(v) => Math.round(v)}
                    style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, fill: COLORS.text }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{
            display: 'flex', gap: 20, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${COLORS.border}`,
            fontFamily: FONT_MONO, fontSize: 12, color: COLORS.muted, letterSpacing: '0.05em',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: COLORS.sage, borderRadius: 2 }} /> Low
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: COLORS.amber, borderRadius: 2 }} /> Moderate
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: COLORS.terracotta, borderRadius: 2 }} /> Elevated
            </span>
            <span style={{ marginLeft: 'auto', textTransform: 'none', fontFamily: FONT_SANS }}>
              Scores on 0\u2013100 scale. Dashed line = population median.
            </span>
          </div>
        </div>

        {/* GLP-1 IMPLICATIONS */}
        <div className="print-avoid-break" style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.terracotta, marginBottom: 16 }}>
            For your GLP-1 journey
          </div>
          <h2 style={{ fontFamily: FONT_SERIF, fontSize: 40, lineHeight: 1.1, margin: '0 0 32px', fontWeight: 400 }}>
            What this means while you\u2019re on the drug.
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
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

        {/* CONSULTATION CTA — NEW */}
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
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ fontFamily: FONT_SANS }}>
              {[
                ['TFEQ-R21', 'Cognitive Restraint', tfeq.CR.toFixed(1), '45 (pop.)'],
                ['TFEQ-R21', 'Uncontrolled Eating', tfeq.UE.toFixed(1), '40 (pop.)'],
                ['TFEQ-R21', 'Emotional Eating',    tfeq.EE.toFixed(1), '35 (pop.)'],
                ['PFS',      'Food Available',      pfs.FA.toFixed(2),  '~2.0'],
                ['PFS',      'Food Present',        pfs.FP.toFixed(2),  '~2.2'],
                ['PFS',      'Food Tasted',         pfs.FT.toFixed(2),  '~2.8'],
                ['PFS',      'Aggregate',           pfs.AGG.toFixed(2), '~2.3'],
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
            This assessment is based on the Three-Factor Eating Questionnaire\u2013R21 (Karlsson et al., 2000; de Lauzon et al., 2004) and the Power of Food Scale (Lowe et al., 2009). Both are validated self-report measures of eating behavior.
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
  const subject = encodeURIComponent(`Behavioral consultation request \u2014 ${phenotype.name}`);
  const body = encodeURIComponent(
    `Hi ${FOUNDER_NAME},\n\nI just took the Meridian assessment and I\u2019d like to book a 1:1 behavioral consultation.\n\nMy phenotype: ${phenotype.name}\n\nThank you,\n`
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
      <div style={{
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'center',
      }} className="grid-2">
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
            A 60-minute behavioral consultation with {FOUNDER_NAME}, PhD. We\u2019ll go through your phenotype together \u2014 the research behind your patterns, what they mean for your specific GLP-1 context, and the behavioral focus areas where the work actually lives for you.
          </p>
          <ul style={{ paddingLeft: 18, color: COLORS.text, fontSize: 15, lineHeight: 1.8, margin: '0 0 28px' }}>
            <li>Personalized interpretation of your scores by an eating-behavior scientist</li>
            <li>Discussion of your three focus areas, tailored to your medication context</li>
            <li>Time for your specific questions \u2014 plateaus, food noise, tapering, or whatever you\u2019re sitting with</li>
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
            Request a session \u2192
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
// 6. MAIN APP
// =============================================================================

export default function App() {
  useFonts();
  const [view, setView] = useState('site'); // 'site' | 'assessment'

  useEffect(() => {
    // Reset scroll when switching views.
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <>
      <GlobalStyles />
      {view === 'site' && (
        <MarketingSite onStartAssessment={() => setView('assessment')} />
      )}
      {view === 'assessment' && (
        <AssessmentApp onBackToSite={() => setView('site')} />
      )}
    </>
  );
}
