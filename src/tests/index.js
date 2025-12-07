// 📁 src/tests/index.js

import aaq_ii from "./aaq-ii";
import assigner from "./assinger";
import beck_anxiety from "./beck-anxiety";
import beck_depression from "./beck-depression";
import emotional_intelligence from "./emotional-intelligence";
import eysenck from "./eysenck";
import geometric_delinger from "./geometric-delinger";
import luscher from "./luscher";
import maslach_burnout from "./maslach-burnout";
import personal_orientation from "./personal-orientation";
import personality from "./personality";
import ptsd_scale from "./ptsd-scale";
import rosenberg from "./rosenberg";
import spiellberger_khanin from "./spiellberger-khanin";
import stress_scale from "./stress-scale";

const tests = {
  "aaq-ii": aaq_ii,
  "assinger": assigner,
  "beck-anxiety": beck_anxiety,
  "beck-depression": beck_depression,
  "emotional-intelligence": emotional_intelligence,
  "eysenck": eysenck,
  "geometric-delinger": geometric_delinger,
  "luscher": luscher,
  "maslach-burnout": maslach_burnout,
  "personal-orientation": personal_orientation,
  "personality": personality,
  "ptsd-scale": ptsd_scale,
  "rosenberg": rosenberg,
  "spiellberger-khanin": spiellberger_khanin,
  "stress-scale": stress_scale,
};

export default tests;