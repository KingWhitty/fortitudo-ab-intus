import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

/* ============================================================
   FORTITUDO AB INTUS — training + nutrition logger
   Single-file React app. Persists via window.storage.
   ============================================================ */

const CSS = `
:root{
  --slate:#151A1F;
  --slate-2:#1D242B;
  --slate-3:#273038;
  --chalk:#E8E6DF;
  --chalk-dim:#9AA3AA;
  --verdigris:#5FB8A6;
  --bronze:#C98B45;
  --oxblood:#B4453C;
  --line:#33404A;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.tl-root{
  background:var(--slate);color:var(--chalk);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  min-height:100vh;padding:0 0 152px;
}
.tl-wrap{max-width:720px;margin:0 auto;padding:0 16px}
.tl-mono{font-family:ui-monospace,SFMono-Regular,"SF Mono",Menlo,monospace;font-variant-numeric:tabular-nums}
.tl-serif{font-family:ui-serif,Georgia,"Times New Roman",serif}

.tl-head{padding:16px 0 14px;border-bottom:1px solid var(--line);margin-bottom:16px}
.tl-crest{width:52px;height:52px;border-radius:8px;object-fit:cover;flex:0 0 auto;
  border:1px solid var(--line)}
.tl-title{font-size:13px;letter-spacing:.22em;text-transform:uppercase;font-weight:700;color:var(--chalk)}
.tl-title span{color:var(--verdigris)}
.tl-sub{font-size:11.5px;color:var(--chalk-dim);margin-top:4px;letter-spacing:.04em}

.tl-tabs{position:fixed;bottom:0;left:0;right:0;background:var(--slate-2);
  border-top:1px solid var(--line);display:flex;z-index:40;padding-bottom:env(safe-area-inset-bottom)}
.tl-tab{flex:1;background:none;border:0;color:var(--chalk-dim);padding:13px 4px 15px;
  font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;cursor:pointer}
.tl-tab[data-on="1"]{color:var(--verdigris);box-shadow:inset 0 2px 0 var(--verdigris)}
.tl-tab:focus-visible{outline:2px solid var(--verdigris);outline-offset:-2px}

.tl-card{background:var(--slate-2);border:1px solid var(--line);border-radius:10px;
  padding:14px;margin-bottom:12px}
.tl-card h3{margin:0 0 3px;font-size:14px;font-weight:700;letter-spacing:.01em}
.tl-meta{font-size:11.5px;color:var(--chalk-dim);letter-spacing:.03em}

.tl-eyebrow{font-size:10px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--chalk-dim);font-weight:700;margin:20px 0 8px}

.tl-row{display:flex;gap:8px;align-items:center}
.tl-grow{flex:1;min-width:0}

.tl-in{background:var(--slate-3);border:1px solid var(--line);color:var(--chalk);
  border-radius:8px;padding:11px 10px;font-size:16px;width:100%;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-numeric:tabular-nums}
.tl-in:focus{outline:2px solid var(--verdigris);outline-offset:1px;border-color:transparent}
.tl-in::placeholder{color:#5E6B75}

.tl-btn{background:var(--slate-3);border:1px solid var(--line);color:var(--chalk);
  border-radius:8px;padding:11px 14px;font-size:13px;font-weight:600;cursor:pointer;
  letter-spacing:.03em}
.tl-btn:hover{border-color:var(--verdigris)}
.tl-btn:focus-visible{outline:2px solid var(--verdigris);outline-offset:2px}
.tl-btn[data-primary="1"]{background:var(--verdigris);color:#10201C;border-color:var(--verdigris)}
.tl-btn[data-ghost="1"]{background:none;color:var(--chalk-dim);border-color:transparent;padding:8px}
.tl-btn[data-danger="1"]{color:var(--oxblood);border-color:var(--oxblood);background:none}

.tl-chiprow{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px;-webkit-overflow-scrolling:touch}
.tl-chip{flex:0 0 auto;background:var(--slate-2);border:1px solid var(--line);color:var(--chalk-dim);
  border-radius:999px;padding:8px 13px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap}
.tl-chip[data-on="1"]{background:var(--verdigris);color:#10201C;border-color:var(--verdigris)}

.tl-set{display:grid;grid-template-columns:26px 1fr 1fr 58px 34px;gap:6px;align-items:center;margin-top:7px}
.tl-setno{font-size:11px;color:var(--chalk-dim);text-align:center;font-weight:700}
.tl-done{background:rgba(95,184,166,.10);border-color:var(--verdigris)}

.tl-plates{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px;align-items:center}
.tl-plate{font-size:11px;font-weight:700;padding:4px 8px;border-radius:4px;
  background:var(--bronze);color:#1A1206;font-family:ui-monospace,Menlo,monospace}
.tl-plate[data-small="1"]{background:var(--slate-3);color:var(--chalk-dim);border:1px solid var(--line)}

.tl-bar{height:6px;background:var(--slate-3);border-radius:99px;overflow:hidden;margin-top:6px}
.tl-bar i{display:block;height:100%;background:var(--verdigris);border-radius:99px;transition:width .3s}
.tl-bar i[data-over="1"]{background:var(--bronze)}

.tl-macro{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:4px}
.tl-macro > div{background:var(--slate-3);border-radius:8px;padding:9px 8px;text-align:center}
.tl-macro b{display:block;font-size:17px;font-family:ui-monospace,Menlo,monospace;font-weight:700}
.tl-macro span{font-size:9.5px;letter-spacing:.13em;text-transform:uppercase;color:var(--chalk-dim)}

.tl-tblwrap{overflow-x:auto}
table.tl-t{width:100%;border-collapse:collapse;font-size:12.5px}
table.tl-t th{text-align:left;font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--chalk-dim);padding:7px 8px;border-bottom:1px solid var(--line);white-space:nowrap}
table.tl-t td{padding:9px 8px;border-bottom:1px solid var(--line);white-space:nowrap}
table.tl-t tr:last-child td{border-bottom:0}

.tl-empty{text-align:center;padding:34px 18px;color:var(--chalk-dim);font-size:13px;line-height:1.6}
.tl-note{font-size:11.5px;color:var(--chalk-dim);line-height:1.55;margin-top:8px}
.tl-quote{font-size:13px;line-height:1.6;color:var(--chalk-dim);text-align:center;padding:22px 10px 6px}
.tl-quote b{display:block;color:var(--verdigris);font-weight:600;margin-bottom:3px}
.tl-howto{background:var(--slate-3);border-radius:8px;padding:11px 12px;margin-top:10px;
  font-size:12px;line-height:1.55;color:var(--chalk)}
.tl-howto a{color:var(--verdigris);font-weight:600}
.tl-name{background:none;border:0;color:var(--chalk);font:inherit;font-size:14px;font-weight:700;
  padding:0;text-align:left;cursor:pointer}
.tl-name i{font-style:normal;color:var(--chalk-dim);font-size:11px;font-weight:600;margin-left:6px}
.tl-sel{background:var(--slate-3);border:1px solid var(--line);color:var(--chalk);border-radius:8px;
  padding:8px 9px;font-size:13px;width:100%;margin-top:9px}
.tl-savebar{position:fixed;bottom:52px;left:0;right:0;background:var(--slate-2);
  border-top:1px solid var(--line);z-index:45;padding:8px 16px calc(8px + env(safe-area-inset-bottom))}
.tl-savebar .in{max-width:720px;margin:0 auto;display:flex;gap:10px;align-items:center}
.tl-savestate{font-size:11px;color:var(--chalk-dim);flex:1;min-width:0;line-height:1.35}
.tl-savestate b{color:var(--bronze)}
.tl-banner{background:rgba(180,69,60,.14);border:1px solid var(--oxblood);color:var(--chalk);
  border-radius:8px;padding:11px 12px;font-size:12px;line-height:1.5;margin-bottom:12px}
.tl-flash{position:fixed;left:50%;transform:translateX(-50%);bottom:78px;background:var(--verdigris);
  color:#10201C;padding:9px 16px;border-radius:99px;font-size:12.5px;font-weight:700;z-index:60}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;

/* ---------------------------- programs ---------------------------- */

const ex = (id, name, sets, reps, pct, note, extra) =>
  ({ id, name, sets, reps, pct, note, kind: "lift", ...(extra || {}) });

/* column layout per exercise kind */
const COLS = {
  lift:   [{ k: "w", ph: "lb", mode: "decimal" }, { k: "r", ph: "reps", mode: "numeric" }, { k: "rpe", ph: "RPE", mode: "decimal" }],
  cardio: [{ k: "min", ph: "min", mode: "decimal" }, { k: "res", ph: "level", mode: "numeric" }, { k: "rpe", ph: "RPE", mode: "decimal" }],
  hold:   [{ k: "sec", ph: "sec", mode: "numeric" }, { k: "rpe", ph: "RPE", mode: "decimal" }],
};

/* form cues — written, not borrowed. Tap an exercise name to open. */
const CUES = {
  "Back squat": "Bar on the rear delts, not the neck. Brace before you unrack. Sit between the hips, knees tracking over the middle toes. Drive the whole foot through the floor.",
  "Front squat": "Elbows high through the whole rep. The moment they drop, the bar rolls forward and the rep is over.",
  "Goblet squat": "Bell at the chest, elbows inside the knees at the bottom. Depth over load.",
  "Bulgarian split squat": "Rear foot elevated, front shin near vertical. Lean the torso slightly forward to bias the glute. Slow down, drive up.",
  "Deadlift": "Bar over mid-foot, shoulders just in front of the bar. Take the slack out before you pull. Stop the set the moment your lower back rounds — that rep does not count.",
  "Trap bar deadlift": "Same brace, easier on the lower back. Push the floor away rather than pulling with the arms.",
  "Romanian deadlift": "Push the hips back, soft knees, bar dragging the thighs. Stop when the hamstrings stop stretching — not when the bar hits the floor.",
  "Barbell hip thrust": "Bar over the hips, chin tucked, ribs down. Two-second squeeze at the top. Do not arch the lower back to get higher.",
  "Hip thrust": "Bar over the hips, chin tucked, ribs down. Two-second squeeze at lockout.",
  "Bench press": "Shoulder blades pinned back and down. Bar to the lower chest, elbows around 45°, not flared to 90°.",
  "Incline DB press": "30–45° bench. Full stretch at the bottom, squeeze at the top without banging the bells together.",
  "Overhead press": "Squeeze the glutes so the lower back does not take the load. Head moves through the window as the bar passes the forehead.",
  "Weighted pull-up": "Full hang at the bottom. Pull the elbows down and back, chest to the bar. No kipping.",
  "Pull-up": "Full hang, chest to bar, controlled descent. Band-assist rather than swing if you cannot get there clean.",
  "Lat pulldown": "Chest up, pull to the collarbone. Think elbows to hips, not hands to chest.",
  "Chest-supported row": "Squeeze the shoulder blades at the end of the pull. No yanking with the lower back.",
  "Barbell row (Pendlay)": "Flat back, bar from the floor each rep, no body english. Strict or nothing.",
  "Face pull": "Rope to the forehead, elbows high, external rotation at the end. Light. This is shoulder insurance.",
  "Lateral raise": "Light, strict, slight forward lean. Lead with the elbows, stop at shoulder height.",
  "Rear delt fly": "Elbows soft, squeeze the back of the shoulder. Undertrained and highly visible.",
  "Weighted dip": "Slight forward lean, elbows tucked. Stop when the upper arm is parallel — deeper is a shoulder problem waiting.",
  "Overhead triceps extension": "Elbows pointed forward and still. Deep stretch at the bottom — that is where the long head grows.",
  "Overhead cable extension": "Elbows locked in place, deep stretch behind the head. This is the back of the arm.",
  "Rope pushdown": "Elbows pinned to the ribs. Squeeze straight at the bottom, do not lean into it.",
  "Barbell curl": "No swinging. If the hips move, the weight is too heavy.",
  "Hammer curl": "Neutral grip, thumbs up. Builds forearm and brachialis thickness.",
  "Leg press": "Feet mid-platform, knees track over the toes. Do not let the lower back round off the pad at the bottom.",
  "Leg curl": "Slow negative. Point the toes toward the shins to bring in more hamstring.",
  "Leg extension": "Squeeze at the top, control down. Do not slam into full lockout under heavy load.",
  "Standing calf raise": "Full stretch at the bottom, two-second pause at the top. Range beats load here.",
  "Kettlebell swing": "A hinge, not a squat. The bell floats — you do not lift it with the arms. Snap the hips and glutes.",
  "KB clean & press": "Tame the arc so the bell does not bang the forearm. Press from a solid rack position.",
  "Box jump": "Land soft and quiet, knees out. Step down between reps — never rebound off a jump when tired.",
  "Push-up": "Body in one line, elbows around 45°. Elevate the hands before you let the hips sag.",
  "Floor wiper": "Bar locked out overhead, legs sweep side to side under control. Do not let the lower back arch off the floor.",
  "Hanging leg raise": "Full hang, no swinging. Curl the pelvis at the top rather than just lifting the legs.",
  "Hanging knee raise": "Same as the leg raise, knees bent. Master this before straight legs.",
  "Dead hang": "Shoulders active, not slumped in the sockets. Log the seconds.",
  "Weighted plank": "Ribs down, glutes on, neutral neck. Quality beats duration.",
  "Front plank": "Ribs down, glutes on. Watch the midline for any ridge pushing up — stop if it appears.",
  "Dead bug": "Lower back stays flat against the floor. If it lifts, shorten the range. The single best deep-core exercise there is.",
  "Pallof press": "Resist the rotation, do not create it. This trains the corset muscle under load.",
  "Cable crunch": "Kneeling, curl the ribs toward the hips. Do not just bow at the hips. Load it — abs are muscle.",
  "Suitcase carry": "Heavy, one side only. Do not lean. Anti-lateral-flexion is where obliques get strong.",
  "Farmer carry": "Tall posture, shoulders down, quick steps. Grip and trunk.",
  "Cable kickback": "Full hip extension, squeeze at the end. Do not swing the leg or arch the back.",
  "Seated hip abduction": "Lean forward slightly — it hits the glute medius harder than sitting upright.",
  "Cable pull-through": "Pure hip hinge, no spinal load. Finish with a glute squeeze, not a lower-back arch.",
  "Back extension": "Round the upper back slightly and squeeze the glutes to lift. Do not hyperextend at the top.",
  "Step-up onto box": "Knee-height box. Drive through the heel of the top foot. No push-off from the back foot — that is cheating.",
  "Walking lunge": "Long stride. Short strides turn it into a quad exercise.",
};

const cueFor = (name) => CUES[name] || null;

const PROGRAMS = {
  mike: {
    label: "The 300 — Cut Protocol",
    who: "245 → 205 lb · 32 weeks",
    targets: { kcal: 2500, p: 240, c: 215, f: 75 },
    targetNote: "Block 1. Weeks 16–25: 2,400 / 230 P. Weeks 26–32: 2,300 / 225 P.",
    days: [
      { n: 1, title: "Tension + Pump: Squat", items: [
        ex("bs", "Back squat", 5, "3", 0.81, "RPE 8 · 3 min rest", { alts: ["Back squat", "Front squat", "Goblet squat"] }),
        ex("bss", "Bulgarian split squat", 3, "6 ea", null, "Dumbbells · 90 s"),
        ex("lp", "Leg press", 3, "15", null, "pick your variation", { alts: ["Leg press", "Hack squat", "DB walking lunge"] }),
        ex("lc", "Leg curl", 3, "15", null, "pick your variation", { alts: ["Leg curl", "KB Romanian deadlift", "Nordic curl"] }),
        ex("calf", "Standing calf raise", 4, "20", null, "Pause at the top"),
        ex("pelB", "Peloton — 8 × 30 s hard", 8, "30 s", null, "90 s easy between", { kind: "cardio" }),
      ]},
      { n: 2, title: "Tension + Pump: Press & Pull", items: [
        ex("bp", "Bench press", 5, "4", 0.79, "RPE 8 · 3 min rest"),
        ex("wpu", "Weighted pull-up", 5, "4", null, "3 min rest", { alts: ["Weighted pull-up", "Pull-up", "Lat pulldown"] }),
        ex("ohp", "Overhead press", 3, "5", 0.75, "Strict · 2 min"),
        ex("idb", "Incline DB press", 3, "12", null, "60 s"),
        ex("csr", "Chest-supported row", 3, "12", null, "60 s", { alts: ["Chest-supported row", "Single-arm DB row", "Cable row"] }),
        ex("lat", "Lateral raise", 4, "15", null, "Light and strict"),
        ex("fp", "Face pull", 3, "20", null, "Shoulder insurance"),
      ]},
      { n: 3, title: "Peloton Intervals + Trunk", items: [
        ex("tab", "Tabata — 8 × 20 s / 10 s", 2, "8 rds", null, "5 min easy between blocks", { kind: "cardio" }),
        ex("hlr", "Hanging leg raise", 4, "12", null, "Control the descent"),
        ex("fw", "Floor wiper", 4, "10 ea", null, "135 lb bar"),
        ex("wpl", "Weighted plank", 3, "45 s", null, "", { kind: "hold" }),
        ex("dh", "Dead hang", 3, "max", null, "Log the seconds", { kind: "hold" }),
      ]},
      { n: 4, title: "The Circuit — scored", items: [
        ex("kbs", "Kettlebell swing", 1, "20 / rd", null, "3–5 rounds · 90 s between"),
        ex("pu", "Push-up", 1, "20 / rd", null, ""),
        ex("bj", "Box jump 24 in", 1, "15 / rd", null, ""),
        ex("kbcp", "KB clean & press", 1, "10 ea / rd", null, ""),
        ex("pull", "Pull-up", 1, "10 / rd", null, ""),
        ex("gs", "Goblet squat", 1, "20 / rd", null, ""),
        ex("spr", "Peloton sprint", 1, "45 s / rd", null, "Log total circuit time in notes", { kind: "cardio" }),
      ]},
      { n: 5, title: "Tension + Pump: Hinge & Arms", items: [
        ex("dl", "Deadlift", 5, "3", 0.81, "RPE 8 · 3 min rest", { alts: ["Deadlift", "Trap bar deadlift"] }),
        ex("dip", "Weighted dip", 4, "6", null, "2 min"),
        ex("rdl", "Romanian deadlift", 3, "12", null, "Hamstring stretch"),
        ex("curl", "Barbell curl", 4, "12", null, ""),
        ex("tri", "Overhead triceps extension", 4, "12", null, ""),
        ex("ham", "Hammer curl", 3, "15", null, ""),
        ex("fc", "Farmer carry", 4, "40 yd", null, "Heavy"),
      ]},
      { n: 6, title: "Long Aerobic + Carries", items: [
        ex("z2", "Peloton Z2", 1, "60–80 min", null, "Conversational pace", { kind: "cardio" }),
        ex("sc", "Suitcase carry", 4, "60 s ea", null, "", { kind: "hold" }),
        ex("mob", "Mobility", 1, "10 min", null, "Hips and thoracic", { kind: "cardio" }),
      ]},
      { n: 7, title: "Regeneration", items: [
        ex("spin", "Easy spin", 1, "20–30 min", null, "Very easy", { kind: "cardio" }),
        ex("mob2", "Full-body mobility", 1, "15 min", null, "", { kind: "cardio" }),
      ]},
    ],
  },
  kalli: {
    label: "Lisa — Kallipygos Protocol",
    who: "117 lb · recomposition · 20 weeks",
    targets: { kcal: 1850, p: 115, c: 210, f: 62 },
    targetNote: "Maintenance with protein high. Weight holds 115–118 while shape changes — judge it by the tape, not the scale.",
    days: [
      { n: 1, title: "Glutes & Hamstrings (heavy)", items: [
        ex("ht", "Barbell hip thrust", 4, "8–10", null, "2 s squeeze at the top · 2 min"),
        ex("rdl", "Romanian deadlift", 4, "8–10", null, "Hips back, soft knees · 2 min"),
        ex("bss", "Bulgarian split squat", 3, "8–10 ea", null, "Torso leaned forward"),
        ex("kb", "Cable kickback", 3, "12–15 ea", null, "Full hip extension"),
        ex("abd", "Seated hip abduction", 4, "15–20", null, "Lean forward slightly"),
        ex("core1", "Core block", 1, "10–12 min", null, "Current phase", { kind: "cardio" }),
      ]},
      { n: 2, title: "Upper Push & Triceps", items: [
        ex("dbb", "Dumbbell bench press", 4, "8–10", null, "Full range"),
        ex("dbsp", "Seated DB shoulder press", 3, "8–10", null, ""),
        ex("dip", "Assisted dip", 3, "8–12", null, "Direct triceps under load", { alts: ["Assisted dip", "Bench dip", "Close-grip DB press"] }),
        ex("ohx", "Overhead cable extension", 4, "12–15", null, "The long head"),
        ex("pd", "Rope pushdown", 3, "12–15", null, "Elbows pinned"),
        ex("lat", "Lateral raise", 3, "15", null, "Light and strict"),
      ]},
      { n: 3, title: "Legs & Glute Medius", items: [
        ex("gsq", "Goblet squat", 4, "8–10", null, "Depth over weight", { alts: ["Goblet squat", "Front squat", "Hack squat"] }),
        ex("lp", "Leg press, feet high & wide", 3, "10–12", null, ""),
        ex("wl", "Walking lunge", 3, "12 ea", null, "Long stride"),
        ex("lc", "Leg curl", 3, "12–15", null, "pick your variation", { alts: ["Leg curl", "Nordic curl", "Romanian deadlift"] }),
        ex("calf", "Standing calf raise", 4, "15–20", null, "2 s pause at top"),
        ex("band", "Lateral band walk", 3, "20 steps ea", null, "Glute medius burnout"),
        ex("core3", "Core block", 1, "10–12 min", null, "Current phase", { kind: "cardio" }),
      ]},
      { n: 4, title: "Upper Pull & Arms", items: [
        ex("lpd", "Lat pulldown", 4, "8–10", null, "Wide grip"),
        ex("csr", "Chest-supported DB row", 4, "10–12", null, ""),
        ex("fp", "Face pull", 3, "15–20", null, "Posture"),
        ex("cgp", "Close-grip DB press", 3, "10–12", null, "Triceps, session two"),
        ex("ohd", "Overhead DB extension", 3, "12–15", null, "Deep stretch"),
        ex("curl", "Dumbbell curl", 3, "12", null, ""),
        ex("rdf", "Rear delt fly", 3, "15", null, ""),
      ]},
      { n: 5, title: "Glute Pump & Core", items: [
        ex("ht2", "Hip thrust (volume)", 4, "15–20", null, "Lighter than Day 1"),
        ex("be", "Glute-biased back extension", 4, "15", null, ""),
        ex("su", "Step-up onto box", 3, "12 ea", null, "Knee-height, no push-off"),
        ex("pt", "Cable pull-through", 3, "15", null, "Pure hinge"),
        ex("tri", "Triceps pushdown", 3, "15", null, "Session three"),
        ex("sc", "Suitcase carry", 4, "40 yd ea", null, "Do not lean"),
        ex("core5", "Full core block", 1, "10–12 min", null, "Current phase", { kind: "cardio" }),
      ]},
      { n: 6, title: "Optional — walk or yoga", items: [
        ex("walk", "Walk, hike or yoga", 1, "30–60 min", null, "No structured cardio needed", { kind: "cardio" }),
      ]},
      { n: 7, title: "Rest", items: [
        ex("rest", "Rest", 1, "—", null, "Eat. Sleep.", { kind: "cardio" }),
      ]},
    ],
  },

  michael: {
    label: "The Lupus Protocol — Mass",
    who: "205 → 215 lb · block 1 of the build to 235",
    targets: { kcal: 4000, p: 235, c: 550, f: 95 },
    targetNote: "Mass block. Deload weeks 7 and 14: 3,750 kcal. 235 is a two-year target, not a 20-week one.",
    days: [
      { n: 1, title: "Squat & Quads", items: [
        ex("bs", "Back squat", 5, "4", 0.80, "RPE 8 · 3 min rest", { alts: ["Back squat", "Front squat"] }),
        ex("bss", "Bulgarian split squat", 3, "8 ea", null, "Tempo 3-1-1"),
        ex("lp", "Leg press", 4, "12", null, ""),
        ex("le", "Leg extension", 3, "15", null, ""),
        ex("lc", "Leg curl", 3, "15", null, ""),
        ex("calf", "Standing calf raise", 4, "15", null, "2 s pause at top"),
      ]},
      { n: 2, title: "Horizontal Press & Row", items: [
        ex("bp", "Bench press", 5, "4", 0.80, "RPE 8 · 3 min rest"),
        ex("row", "Barbell row (Pendlay)", 4, "6", 0.72, "Strict"),
        ex("idb", "Incline DB press", 4, "10", null, ""),
        ex("csr", "Chest-supported row", 4, "12", null, ""),
        ex("fly", "Cable or DB fly", 3, "15", null, "Stretch at the bottom"),
        ex("rdf", "Rear delt fly", 4, "15", null, ""),
        ex("fp", "Face pull", 3, "20", null, ""),
      ]},
      { n: 3, title: "Intervals + Trunk", items: [
        ex("int", "8 × 30 s hard / 90 s easy", 8, "30 s", null, "Bike or rower", { kind: "cardio" }),
        ex("hlr", "Hanging leg raise", 4, "12", null, ""),
        ex("fw", "Floor wiper", 4, "10 ea", null, "135 lb bar"),
        ex("cc", "Weighted cable crunch", 4, "15", null, "Load it"),
        ex("sc", "Suitcase carry", 4, "40 yd ea", null, ""),
      ]},
      { n: 4, title: "Hinge & Posterior", items: [
        ex("dl", "Deadlift", 5, "3", 0.82, "RPE 8 · 3 min rest", { alts: ["Deadlift", "Trap bar deadlift"] }),
        ex("wpu", "Weighted pull-up", 5, "5", null, ""),
        ex("rdl", "Romanian deadlift", 4, "10", null, "Tempo 3-1-1"),
        ex("ht", "Hip thrust", 4, "12", null, ""),
        ex("shr", "Barbell shrug", 4, "15", null, "2 s hold"),
        ex("be", "Back extension", 3, "15", null, ""),
      ]},
      { n: 5, title: "Vertical Press & Pull + Arms", items: [
        ex("ohp", "Overhead press", 5, "5", 0.75, "Strict · no leg drive"),
        ex("dip", "Weighted dip", 4, "8", null, ""),
        ex("lpd", "Lat pulldown", 4, "12", null, "Wide grip", { alts: ["Lat pulldown", "Pull-up"] }),
        ex("lat", "Lateral raise", 5, "15", null, "Light, strict, high volume"),
        ex("curl", "Barbell curl", 4, "10", null, ""),
        ex("tri", "Overhead triceps extension", 4, "12", null, "Long head"),
        ex("ham", "Hammer curl", 3, "15", null, ""),
      ]},
      { n: 6, title: "The Circuit + Z2", items: [
        ex("kbs", "Kettlebell swing", 1, "25 / rd", null, "4 rounds · 90 s between"),
        ex("pu", "Push-up", 1, "25 / rd", null, ""),
        ex("bj", "Box jump 24 in", 1, "15 / rd", null, ""),
        ex("kbcp", "KB clean & press", 1, "10 ea / rd", null, ""),
        ex("pull", "Pull-up", 1, "12 / rd", null, ""),
        ex("gs", "Goblet squat", 1, "20 / rd", null, ""),
        ex("z2", "Z2 ride after", 1, "30 min", null, "Easy", { kind: "cardio" }),
      ]},
      { n: 7, title: "Regeneration", items: [
        ex("spin", "Easy spin", 1, "20–30 min", null, "", { kind: "cardio" }),
        ex("mob2", "Full-body mobility", 1, "15 min", null, "", { kind: "cardio" }),
      ]},
    ],
  },
};

const LIFT_MAXES = [
  { id: "bs", label: "Back squat" },
  { id: "bp", label: "Bench press" },
  { id: "dl", label: "Deadlift" },
  { id: "ohp", label: "Overhead press" },
  { id: "row", label: "Barbell row" },
];

const QUICK_FOODS = [
  { name: "Chicken breast, 6 oz", kcal: 280, p: 53, c: 0, f: 6 },
  { name: "Salmon, 6 oz", kcal: 350, p: 34, c: 0, f: 22 },
  { name: "Whole egg", kcal: 72, p: 6, c: 0, f: 5 },
  { name: "Egg whites, 1 cup", kcal: 125, p: 26, c: 2, f: 0 },
  { name: "Greek yogurt 0%, 1 cup", kcal: 130, p: 23, c: 9, f: 0 },
  { name: "Cottage cheese, 1 cup", kcal: 180, p: 28, c: 8, f: 5 },
  { name: "Whey isolate, 1 scoop", kcal: 110, p: 25, c: 2, f: 1 },
  { name: "Jasmine rice, 1 cup ckd", kcal: 205, p: 4, c: 45, f: 0 },
  { name: "Oats, 1 cup dry", kcal: 307, p: 11, c: 55, f: 5 },
  { name: "Sweet potato, medium", kcal: 115, p: 2, c: 27, f: 0 },
  { name: "Light tuna, 1 can", kcal: 110, p: 25, c: 0, f: 1 },
  { name: "Banana", kcal: 105, p: 1, c: 27, f: 0 },
  { name: "Almond butter, 2 tbsp", kcal: 196, p: 7, c: 6, f: 18 },
  { name: "Olive oil, 1 tbsp", kcal: 119, p: 0, c: 0, f: 14 },
  { name: "Whole milk, 1 cup", kcal: 150, p: 8, c: 12, f: 8 },
  { name: "Turkey breast, 5 oz", kcal: 190, p: 40, c: 0, f: 3 },
];

/* ---------------------------- helpers ---------------------------- */

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const parseKey = (k) => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
const fmtShort = (k) => parseKey(k).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const dayName = (k) => parseKey(k).toLocaleDateString(undefined, { weekday: "short" });
const shiftKey = (k, n) => {
  const d = parseKey(k); d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const monKey = (k) => { const d = parseKey(k); const off = (d.getDay() + 6) % 7; return shiftKey(k, -off); };
const monthKey = (k) => k.slice(0, 7);
const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };

function plateMath(total) {
  const bar = 45;
  if (!total || total <= bar) return null;
  let side = (total - bar) / 2;
  const sizes = [45, 35, 25, 10, 5, 2.5];
  const out = [];
  for (const s of sizes) {
    let c = Math.floor(side / s + 1e-6);
    if (c > 0) { out.push({ s, c }); side = +(side - c * s).toFixed(2); }
  }
  return { plates: out, leftover: side };
}

const EMPTY = { logs: {}, maxes: {}, profile: "mike" };

/* ---------------------------- app ---------------------------- */

const BLANK_ENTRY = { day: null, sets: {}, food: [], weight: "", sleep: "", notes: "" };

export default function FortitudoLog() {
  const [data, setData] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("train");
  const [date, setDate] = useState(todayKey());
  const [flash, setFlash] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [storageOk, setStorageOk] = useState(true);

  /* dataRef always holds the newest state, so two quick edits can no longer
     overwrite each other using a stale render snapshot. */
  const dataRef = useRef(EMPTY);

  const profile = data.profile || "mike";
  const program = PROGRAMS[profile];

  const writeOut = useCallback(async (d) => {
    try {
      await window.storage.set(`t300:${d.profile}`, JSON.stringify({ logs: d.logs, maxes: d.maxes }));
      setSavedAt(new Date());
      setDirty(false);
      setErr("");
      return true;
    } catch {
      setErr("Save failed. Don't close the app — tap Save again, or pull a backup from the Export tab.");
      return false;
    }
  }, []);

  const saveNow = useCallback(async () => {
    const ok = await writeOut(dataRef.current);
    if (ok) { setFlash("Saved"); setTimeout(() => setFlash(""), 1400); }
  }, [writeOut]);

  useEffect(() => {
    let live = true;
    (async () => {
      let ok = true;
      try {
        await window.storage.set("t300:probe", "1");
        const pr = await window.storage.get("t300:probe");
        if (!pr || pr.value !== "1") ok = false;
      } catch { ok = false; }
      if (live) setStorageOk(ok);

      try {
        const p = await window.storage.get("t300:profile");
        const prof = p && p.value ? p.value : "mike";
        let d = { ...EMPTY, profile: prof };
        try {
          const r = await window.storage.get(`t300:${prof}`);
          if (r && r.value) d = { ...d, ...JSON.parse(r.value), profile: prof };
        } catch { /* first run for this profile */ }
        if (live) { dataRef.current = d; setData(d); setReady(true); }
      } catch {
        if (live) { dataRef.current = EMPTY; setData(EMPTY); setReady(true); }
      }
    })();
    return () => { live = false; };
  }, []);

  /* flush to storage whenever the app leaves the foreground */
  useEffect(() => {
    const flush = () => { if (ready) writeOut(dataRef.current); };
    const onVis = () => { if (document.visibilityState === "hidden") flush(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", flush);
    window.addEventListener("blur", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("blur", flush);
    };
  }, [ready, writeOut]);

  const mutate = useCallback((fn) => {
    const next = fn(dataRef.current);
    dataRef.current = next;
    setData(next);
    setDirty(true);
    writeOut(next);
  }, [writeOut]);

  const persist = useCallback((patch) => {
    mutate((prev) => ({ ...prev, ...patch }));
  }, [mutate]);

  const switchProfile = async (prof) => {
    await writeOut(dataRef.current);
    setReady(false);
    try { await window.storage.set("t300:profile", prof); } catch { /* non-fatal */ }
    let d = { ...EMPTY, profile: prof };
    try {
      const r = await window.storage.get(`t300:${prof}`);
      if (r && r.value) d = { ...d, ...JSON.parse(r.value), profile: prof };
    } catch { /* none yet */ }
    dataRef.current = d; setData(d); setDirty(false); setReady(true);
  };

  const entry = data.logs[date] || BLANK_ENTRY;

  /* patch may be an object, or a function of the current day's entry */
  const update = useCallback((patch) => {
    mutate((prev) => {
      const cur = prev.logs[date] || BLANK_ENTRY;
      const p = typeof patch === "function" ? patch(cur) : patch;
      return { ...prev, logs: { ...prev.logs, [date]: { ...cur, ...p } } };
    });
  }, [mutate, date]);

  const toast = (m) => { setFlash(m); setTimeout(() => setFlash(""), 1600); };

  if (!ready) {
    return (
      <div className="tl-root">
        <style>{CSS}</style>
        <div className="tl-wrap"><div className="tl-empty">Loading your log…</div></div>
      </div>
    );
  }

  return (
    <div className="tl-root">
      <style>{CSS}</style>
      <div className="tl-wrap">
        <header className="tl-head">
          <div className="tl-row">
            <img src="/crest.jpg" alt="" className="tl-crest" />
            <div className="tl-grow">
              <div className="tl-title">FORTITUDO AB <span>INTUS</span></div>
              <div className="tl-sub">{program.label} · {program.who}</div>
            </div>
            <select
              className="tl-in" style={{ width: 116, fontSize: 12, padding: "8px" }}
              value={profile} onChange={(e) => switchProfile(e.target.value)} aria-label="Whose log">
              <option value="mike">Mike</option>
              <option value="michael">Michael</option>
              <option value="kalli">Lisa</option>
            </select>
          </div>
          <Countdown />
          {err && <div className="tl-note" style={{ color: "var(--oxblood)" }}>{err}</div>}
        </header>

        {!storageOk && (
          <div className="tl-banner">
            <b>This browser isn't storing anything.</b> That usually means Private Browsing. Open the site
            in a normal tab or add it to your home screen — otherwise nothing you log here survives
            closing the app.
          </div>
        )}

        <DateBar date={date} setDate={setDate} />

        {tab === "train" && <Train program={program} entry={entry} update={update} maxes={data.maxes} toast={toast} />}
        {tab === "food" && <Food program={program} entry={entry} update={update} toast={toast} />}
        {tab === "history" && <History data={data} program={program} />}
        {tab === "export" && <Export data={data} program={program} persist={persist} toast={toast} />}
      </div>

      <nav className="tl-tabs">
        {[["train", "Train"], ["food", "Food"], ["history", "History"], ["export", "Export"]].map(([k, l]) => (
          <button key={k} className="tl-tab" data-on={tab === k ? "1" : "0"} onClick={() => setTab(k)}>{l}</button>
        ))}
      </nav>

      <div className="tl-savebar">
        <div className="in">
          <div className="tl-savestate">
            {dirty
              ? <><b>Unsaved changes</b> — tap Save</>
              : savedAt
                ? <>Saved {savedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</>
                : <>Nothing logged yet</>}
          </div>
          <button className="tl-btn" data-primary={dirty ? "1" : undefined}
            style={{ padding: "9px 18px" }} onClick={saveNow}>Save</button>
        </div>
      </div>

      {flash && <div className="tl-flash">{flash}</div>}
    </div>
  );
}

/* ---------------------------- countdown ---------------------------- */

function Countdown() {
  const target = new Date(2027, 3, 2);
  const now = new Date();
  const days = Math.max(0, Math.ceil((target - now) / 86400000));
  const total = Math.ceil((target - new Date(2026, 7, 17)) / 86400000);
  const pct = Math.min(100, Math.max(0, ((total - days) / total) * 100));
  return (
    <div style={{ marginTop: 12 }}>
      <div className="tl-row" style={{ fontSize: 11 }}>
        <div className="tl-grow tl-meta" style={{ letterSpacing: ".16em", textTransform: "uppercase" }}>
          To 2 April 2027
        </div>
        <div className="tl-mono" style={{ color: "var(--bronze)", fontWeight: 700 }}>{days} days</div>
      </div>
      <div className="tl-bar"><i style={{ width: pct + "%" }} /></div>
    </div>
  );
}

/* ---------------------------- date bar ---------------------------- */

function DateBar({ date, setDate }) {
  const isToday = date === todayKey();
  return (
    <div className="tl-row" style={{ marginBottom: 12 }}>
      <button className="tl-btn" onClick={() => setDate(shiftKey(date, -1))} aria-label="Previous day">‹</button>
      <div className="tl-grow" style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".04em" }}>
          {dayName(date)} · {fmtShort(date)}
        </div>
        {!isToday && (
          <button className="tl-btn" data-ghost="1" style={{ fontSize: 11 }} onClick={() => setDate(todayKey())}>
            back to today
          </button>
        )}
      </div>
      <button className="tl-btn" onClick={() => setDate(shiftKey(date, 1))}
        disabled={date >= todayKey()} style={{ opacity: date >= todayKey() ? 0.35 : 1 }} aria-label="Next day">›</button>
    </div>
  );
}

/* ---------------------------- train ---------------------------- */

function Train({ program, entry, update, maxes }) {
  const day = entry.day;
  const chosen = program.days.find((d) => d.n === day);

  const setSets = (exId, sets) => update((cur) => ({ sets: { ...(cur.sets || {}), [exId]: sets } }));
  const setPick = (exId, val) => update((cur) => ({ picks: { ...(cur.picks || {}), [exId]: val } }));
  const addOwn = (item) => update((cur) => ({ custom: [...(cur.custom || []), item] }));
  const dropOwn = (id) => update((cur) => ({
    custom: (cur.custom || []).filter((c) => c.id !== id),
    sets: Object.fromEntries(Object.entries(cur.sets || {}).filter(([k]) => k !== id)),
  }));

  return (
    <>
      <div className="tl-eyebrow">Today's session</div>
      <div className="tl-chiprow">
        {program.days.map((d) => (
          <button key={d.n} className="tl-chip" data-on={day === d.n ? "1" : "0"}
            onClick={() => update({ day: d.n })}>Day {d.n}</button>
        ))}
      </div>

      {!chosen ? (
        <div className="tl-empty">Pick the day you're training.<br />Everything you log lands on {fmtShort(todayKey()) === fmtShort(todayKey()) ? "this date" : ""}.</div>
      ) : (
        <>
          <div className="tl-card">
            <h3>Day {chosen.n} — {chosen.title}</h3>
            <div className="tl-meta">{chosen.items.length} movements</div>
          </div>

          {chosen.items.map((item) => (
            <Exercise key={item.id} item={item} logged={entry.sets[item.id] || []}
              onChange={(s) => setSets(item.id, s)} est1rm={num(maxes[item.id])}
              pick={(entry.picks || {})[item.id]} onPick={(v) => setPick(item.id, v)} />
          ))}

          {(entry.custom || []).length > 0 && <div className="tl-eyebrow">Added by you</div>}
          {(entry.custom || []).map((item) => (
            <Exercise key={item.id} item={item} logged={entry.sets[item.id] || []}
              onChange={(s) => setSets(item.id, s)} est1rm={0}
              onRemove={() => dropOwn(item.id)} />
          ))}

          <div className="tl-eyebrow">Anything else</div>
          <AddOwn onAdd={addOwn} />

          <div className="tl-eyebrow">Body</div>
          <div className="tl-card">
            <div className="tl-row">
              <div className="tl-grow">
                <label className="tl-meta" htmlFor="bw">Morning weight (lb)</label>
                <input id="bw" className="tl-in" inputMode="decimal" value={entry.weight}
                  onChange={(e) => update({ weight: e.target.value })} placeholder="—" />
              </div>
              <div className="tl-grow">
                <label className="tl-meta" htmlFor="sl">Hours slept</label>
                <input id="sl" className="tl-in" inputMode="decimal" value={entry.sleep}
                  onChange={(e) => update({ sleep: e.target.value })} placeholder="—" />
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label className="tl-meta" htmlFor="nt">Notes — circuit time, how it felt</label>
              <input id="nt" className="tl-in" style={{ fontFamily: "inherit" }} value={entry.notes}
                onChange={(e) => update({ notes: e.target.value })} placeholder="e.g. circuit 18:42, felt strong" />
            </div>
          </div>

          <div className="tl-quote">
            <b>Fortitudo ab intus</b>
            Strength from within.
          </div>
        </>
      )}
    </>
  );
}

function Exercise({ item, logged, onChange, est1rm, pick, onPick, onRemove }) {
  const [open, setOpen] = useState(false);
  const name = pick || item.name;
  const kind = item.kind || "lift";
  const cols = COLS[kind] || COLS.lift;
  const target = kind === "lift" && est1rm && item.pct ? Math.round((est1rm * item.pct) / 5) * 5 : null;

  const rows = useMemo(() => {
    const base = Array.from({ length: item.sets || 1 }, () => ({ done: false }));
    return logged.length ? logged : base;
  }, [logged, item.sets]);

  const setRow = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const addSet = () => onChange([...rows, { done: false }]);

  const pm = target ? plateMath(target) : null;
  const doneCount = rows.filter((r) => r.done).length;
  const cue = cueFor(name);
  const gridCols = `26px ${cols.map(() => "1fr").join(" ")} 34px`;

  return (
    <div className="tl-card">
      <div className="tl-row">
        <div className="tl-grow">
          <button className="tl-name" onClick={() => setOpen(!open)} aria-expanded={open}>
            {name}<i>{open ? "close" : "how to"}</i>
          </button>
          <div className="tl-meta">
            {item.sets > 1 ? `${item.sets} × ${item.reps}` : item.reps}
            {item.note ? ` · ${item.note}` : ""}
          </div>
        </div>
        <div className="tl-mono" style={{ fontSize: 12, color: doneCount ? "var(--verdigris)" : "var(--chalk-dim)" }}>
          {doneCount}/{rows.length}
        </div>
        {onRemove && (
          <button className="tl-btn" data-ghost="1" onClick={onRemove} aria-label={`Remove ${name}`}>×</button>
        )}
      </div>

      {open && (
        <div className="tl-howto">
          <div>{cue || "No written cue for this one yet — the video search below will cover it."}</div>
          <div style={{ marginTop: 8 }}>
            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(name + " proper form technique")}`}
               target="_blank" rel="noreferrer">Watch demo videos →</a>
          </div>
        </div>
      )}

      {item.alts && item.alts.length > 1 && (
        <select className="tl-sel" value={name} onChange={(e) => onPick(e.target.value)}
          aria-label={`Variation for ${item.name}`}>
          {item.alts.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      )}

      {target && (
        <div className="tl-plates">
          <span className="tl-plate">{target} lb</span>
          <span className="tl-meta" style={{ fontSize: 10.5 }}>
            {Math.round(item.pct * 100)}% · per side:
          </span>
          {pm && pm.plates.length
            ? pm.plates.map((p, i) => (
                <span key={i} className="tl-plate" data-small="1">{p.c}×{p.s}</span>
              ))
            : <span className="tl-plate" data-small="1">bar only</span>}
        </div>
      )}

      {rows.map((r, i) => (
        <div className="tl-set" key={i} style={{ gridTemplateColumns: gridCols }}>
          <div className="tl-setno">{i + 1}</div>
          {cols.map((c) => (
            <input key={c.k} className="tl-in" inputMode={c.mode} placeholder={c.ph}
              value={r[c.k] || ""} onChange={(e) => setRow(i, { [c.k]: e.target.value })}
              aria-label={`Set ${i + 1} ${c.ph}`} />
          ))}
          <button className="tl-btn" data-primary={r.done ? "1" : undefined}
            style={{ padding: "10px 0", fontSize: 14 }}
            onClick={() => setRow(i, { done: !r.done })}
            aria-label={`Mark set ${i + 1} ${r.done ? "not done" : "done"}`}>✓</button>
        </div>
      ))}

      <button className="tl-btn" data-ghost="1" style={{ marginTop: 8, fontSize: 12 }} onClick={addSet}>
        + add a set
      </button>
    </div>
  );
}

/* ---------------------------- add your own ---------------------------- */

function AddOwn({ onAdd }) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("lift");
  const [sets, setSets] = useState("3");

  const submit = () => {
    if (!name.trim()) return;
    onAdd({
      id: "c" + Date.now().toString(36),
      name: name.trim(),
      kind,
      sets: Math.max(1, Math.min(12, parseInt(sets, 10) || 1)),
      reps: kind === "cardio" ? "logged in minutes" : kind === "hold" ? "logged in seconds" : "your call",
      note: "added by you",
    });
    setName(""); setSets("3");
  };

  return (
    <div className="tl-card">
      <h3>Add anything else you did</h3>
      <div className="tl-meta">Elliptical warm-up, stretching, a machine you like — it all lands in your log and your exports.</div>
      <input className="tl-in" style={{ fontFamily: "inherit", marginTop: 10 }} value={name}
        onChange={(e) => setName(e.target.value)} placeholder="e.g. Elliptical warm-up" aria-label="Exercise name" />
      <div className="tl-row" style={{ marginTop: 8 }}>
        <select className="tl-sel" style={{ marginTop: 0 }} value={kind}
          onChange={(e) => setKind(e.target.value)} aria-label="Type">
          <option value="lift">Weight &amp; reps</option>
          <option value="cardio">Minutes</option>
          <option value="hold">Seconds held</option>
        </select>
        <input className="tl-in" style={{ width: 74 }} inputMode="numeric" value={sets}
          onChange={(e) => setSets(e.target.value)} placeholder="sets" aria-label="How many sets" />
      </div>
      <button className="tl-btn" data-primary="1" style={{ width: "100%", marginTop: 9 }} onClick={submit}>
        Add to today
      </button>
    </div>
  );
}

/* ---------------------------- food ---------------------------- */

function Food({ program, entry, update, toast }) {
  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [p, setP] = useState("");
  const [c, setC] = useState("");
  const [f, setF] = useState("");

  const items = entry.food || [];
  const tot = items.reduce((a, i) => ({
    kcal: a.kcal + num(i.kcal), p: a.p + num(i.p), c: a.c + num(i.c), f: a.f + num(i.f),
  }), { kcal: 0, p: 0, c: 0, f: 0 });

  const T = program.targets;

  const add = (item) => {
    update((cur) => ({ food: [...(cur.food || []), item] }));
    toast("Added");
  };
  const addManual = () => {
    if (!name.trim()) return;
    add({ name: name.trim(), kcal: num(kcal), p: num(p), c: num(c), f: num(f) });
    setName(""); setKcal(""); setP(""); setC(""); setF("");
  };
  const remove = (i) => update((cur) => ({ food: (cur.food || []).filter((_, j) => j !== i) }));

  const Bar = ({ label, val, target, unit }) => {
    const pctv = target ? Math.min(200, (val / target) * 100) : 0;
    return (
      <div style={{ marginBottom: 10 }}>
        <div className="tl-row" style={{ fontSize: 12 }}>
          <div className="tl-grow tl-meta">{label}</div>
          <div className="tl-mono">{Math.round(val)}{unit} <span style={{ color: "var(--chalk-dim)" }}>/ {target}{unit}</span></div>
        </div>
        <div className="tl-bar"><i style={{ width: `${Math.min(100, pctv)}%` }} data-over={val > target * 1.05 ? "1" : "0"} /></div>
      </div>
    );
  };

  return (
    <>
      <div className="tl-eyebrow">Against target</div>
      <div className="tl-card">
        <Bar label="Calories" val={tot.kcal} target={T.kcal} unit="" />
        <Bar label="Protein" val={tot.p} target={T.p} unit="g" />
        <Bar label="Carbs" val={tot.c} target={T.c} unit="g" />
        <Bar label="Fat" val={tot.f} target={T.f} unit="g" />
        <div className="tl-note">{program.targetNote}</div>
      </div>

      <div className="tl-eyebrow">Quick add</div>
      <div className="tl-chiprow">
        {QUICK_FOODS.map((q) => (
          <button key={q.name} className="tl-chip" onClick={() => add({ ...q })}>
            {q.name.split(",")[0]} · {q.p}p
          </button>
        ))}
      </div>

      <div className="tl-card">
        <input className="tl-in" style={{ fontFamily: "inherit", marginBottom: 8 }} value={name}
          onChange={(e) => setName(e.target.value)} placeholder="Food name" aria-label="Food name" />
        <div className="tl-row">
          <input className="tl-in" inputMode="numeric" value={kcal} onChange={(e) => setKcal(e.target.value)} placeholder="kcal" aria-label="Calories" />
          <input className="tl-in" inputMode="numeric" value={p} onChange={(e) => setP(e.target.value)} placeholder="P" aria-label="Protein grams" />
          <input className="tl-in" inputMode="numeric" value={c} onChange={(e) => setC(e.target.value)} placeholder="C" aria-label="Carb grams" />
          <input className="tl-in" inputMode="numeric" value={f} onChange={(e) => setF(e.target.value)} placeholder="F" aria-label="Fat grams" />
        </div>
        <button className="tl-btn" data-primary="1" style={{ width: "100%", marginTop: 9 }} onClick={addManual}>
          Add to today
        </button>
      </div>

      <div className="tl-eyebrow">Eaten today</div>
      {items.length === 0 ? (
        <div className="tl-empty">Nothing logged yet. Tap a quick-add above, or enter it by hand.</div>
      ) : (
        <div className="tl-card">
          {items.map((i, idx) => (
            <div className="tl-row" key={idx} style={{ padding: "8px 0", borderBottom: idx < items.length - 1 ? "1px solid var(--line)" : "none" }}>
              <div className="tl-grow">
                <div style={{ fontSize: 13 }}>{i.name}</div>
                <div className="tl-meta tl-mono">{i.kcal} kcal · {i.p}p {i.c}c {i.f}f</div>
              </div>
              <button className="tl-btn" data-ghost="1" onClick={() => remove(idx)} aria-label={`Remove ${i.name}`}>×</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ---------------------------- history ---------------------------- */

function summarize(logs, keys) {
  let sessions = 0, sets = 0, volume = 0, kcal = 0, p = 0, c = 0, f = 0;
  const weights = [], sleeps = [];
  keys.forEach((k) => {
    const e = logs[k]; if (!e) return;
    if (e.day) sessions++;
    Object.values(e.sets || {}).forEach((arr) =>
      arr.forEach((s) => { if (s.done || s.r) { sets++; volume += num(s.w) * num(s.r); } }));
    (e.food || []).forEach((i) => { kcal += num(i.kcal); p += num(i.p); c += num(i.c); f += num(i.f); });
    if (num(e.weight)) weights.push(num(e.weight));
    if (num(e.sleep)) sleeps.push(num(e.sleep));
  });
  const days = keys.filter((k) => logs[k] && (logs[k].food || []).length).length || 1;
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  return {
    sessions, sets, volume,
    avgKcal: kcal / days, avgP: p / days, avgC: c / days, avgF: f / days,
    avgWeight: avg(weights), avgSleep: avg(sleeps),
    firstWeight: weights[0] || 0, lastWeight: weights[weights.length - 1] || 0,
  };
}

function History({ data, program }) {
  const keys = Object.keys(data.logs).sort();
  if (!keys.length) return <div className="tl-empty">Nothing logged yet.<br />Your weekly and monthly rollups appear here once you start.</div>;

  const weeks = {};
  keys.forEach((k) => { const w = monKey(k); (weeks[w] = weeks[w] || []).push(k); });
  const months = {};
  keys.forEach((k) => { const m = monthKey(k); (months[m] = months[m] || []).push(k); });

  const Stat = ({ label, val }) => (
    <div><b className="tl-mono">{val}</b><span>{label}</span></div>
  );

  return (
    <>
      <div className="tl-eyebrow">By week</div>
      {Object.keys(weeks).sort().reverse().map((w) => {
        const s = summarize(data.logs, weeks[w]);
        const delta = s.firstWeight && s.lastWeight ? (s.lastWeight - s.firstWeight).toFixed(1) : null;
        return (
          <div className="tl-card" key={w}>
            <h3>Week of {fmtShort(w)}</h3>
            <div className="tl-meta">
              {s.sessions} sessions · {s.sets} sets · {Math.round(s.volume).toLocaleString()} lb total volume
              {delta ? ` · weight ${delta > 0 ? "+" : ""}${delta} lb` : ""}
            </div>
            <div className="tl-macro">
              <Stat label="kcal/day" val={Math.round(s.avgKcal) || "—"} />
              <Stat label="protein" val={Math.round(s.avgP) || "—"} />
              <Stat label="carbs" val={Math.round(s.avgC) || "—"} />
              <Stat label="sleep" val={s.avgSleep ? s.avgSleep.toFixed(1) : "—"} />
            </div>
          </div>
        );
      })}

      <div className="tl-eyebrow">By month</div>
      {Object.keys(months).sort().reverse().map((m) => {
        const s = summarize(data.logs, months[m]);
        const label = parseKey(m + "-01").toLocaleDateString(undefined, { month: "long", year: "numeric" });
        return (
          <div className="tl-card" key={m}>
            <h3>{label}</h3>
            <div className="tl-meta">
              {s.sessions} sessions · {Math.round(s.volume).toLocaleString()} lb volume ·
              {" "}avg {Math.round(s.avgKcal) || "—"} kcal, {Math.round(s.avgP) || "—"} g protein
            </div>
            <div className="tl-note">
              Average morning weight {s.avgWeight ? s.avgWeight.toFixed(1) + " lb" : "not logged"} ·
              {" "}target {program.targets.kcal} kcal / {program.targets.p} g protein
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ---------------------------- export + settings ---------------------------- */

function toCSV(logs, program) {
  const head = ["date", "weekday", "day_n", "session", "exercise", "type", "set",
                "weight_lb", "reps", "minutes", "level", "seconds", "rpe", "done"];
  const lines = [head.join(",")];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  Object.keys(logs).sort().forEach((k) => {
    const e = logs[k];
    const d = program.days.find((x) => x.n === e.day);
    Object.entries(e.sets || {}).forEach(([exId, arr]) => {
      const item = (d && d.items.find((i) => i.id === exId)) ||
                   (e.custom || []).find((c) => c.id === exId);
      const nm = (e.picks || {})[exId] || (item ? item.name : exId);
      const kind = item ? (item.kind || "lift") : "lift";
      arr.forEach((s, i) => {
        lines.push([k, dayName(k), e.day || "", d ? d.title : "", nm, kind, i + 1,
          s.w || "", s.r || "", s.min || "", s.res || "", s.sec || "",
          s.rpe || "", s.done ? "yes" : "no"].map(q).join(","));
      });
    });
  });
  return lines.join("\n");
}

function foodCSV(logs) {
  const lines = ["date,food,kcal,protein_g,carbs_g,fat_g"];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  Object.keys(logs).sort().forEach((k) => {
    (logs[k].food || []).forEach((i) => {
      lines.push([k, i.name, i.kcal, i.p, i.c, i.f].map(q).join(","));
    });
  });
  return lines.join("\n");
}

function dailyCSV(logs) {
  const lines = ["date,weekday,morning_weight_lb,hours_slept,kcal,protein_g,carbs_g,fat_g,sets_logged,notes"];
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  Object.keys(logs).sort().forEach((k) => {
    const e = logs[k];
    const t = (e.food || []).reduce((a, i) => ({
      kcal: a.kcal + num(i.kcal), p: a.p + num(i.p), c: a.c + num(i.c), f: a.f + num(i.f),
    }), { kcal: 0, p: 0, c: 0, f: 0 });
    let sets = 0;
    Object.values(e.sets || {}).forEach((arr) => arr.forEach((s) => { if (s.done || s.r) sets++; }));
    lines.push([k, dayName(k), e.weight || "", e.sleep || "",
      Math.round(t.kcal), Math.round(t.p), Math.round(t.c), Math.round(t.f), sets, e.notes || ""].map(q).join(","));
  });
  return lines.join("\n");
}

function download(text, filename) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Export({ data, program, persist, toast }) {
  const [confirm, setConfirm] = useState(false);
  const stamp = todayKey();
  const who = data.profile;

  const setMax = (id, v) => persist({ maxes: { ...data.maxes, [id]: v } });

  return (
    <>
      <div className="tl-eyebrow">Your estimated maxes</div>
      <div className="tl-card">
        <div className="tl-note" style={{ marginTop: 0, marginBottom: 10 }}>
          Enter these after your 5RM testing week. Formula: <span className="tl-mono">weight × (1 + reps ÷ 30)</span>.
          Once they're in, every tension lift shows its working weight and the plates per side.
        </div>
        {LIFT_MAXES.map((l) => (
          <div className="tl-row" key={l.id} style={{ marginBottom: 8 }}>
            <div className="tl-grow" style={{ fontSize: 13 }}>{l.label}</div>
            <input className="tl-in" style={{ width: 96 }} inputMode="decimal" placeholder="lb"
              value={data.maxes[l.id] || ""} onChange={(e) => setMax(l.id, e.target.value)}
              aria-label={`${l.label} estimated max`} />
          </div>
        ))}
      </div>

      <div className="tl-eyebrow">Download your log</div>
      <div className="tl-card">
        <div className="tl-note" style={{ marginTop: 0 }}>
          CSV files open in Excel, Numbers or Google Sheets. Every set, every meal, every morning weigh-in.
          Your log lives in this browser only — pull a backup now and then, and definitely before you
          change phones.
        </div>
        <button className="tl-btn" data-primary="1" style={{ width: "100%", marginTop: 10 }}
          onClick={() => { download(dailyCSV(data.logs), `log-daily-${who}-${stamp}.csv`); toast("Daily summary downloaded"); }}>
          Daily summary
        </button>
        <button className="tl-btn" style={{ width: "100%", marginTop: 8 }}
          onClick={() => { download(toCSV(data.logs, program), `log-training-${who}-${stamp}.csv`); toast("Training log downloaded"); }}>
          Every set logged
        </button>
        <button className="tl-btn" style={{ width: "100%", marginTop: 8 }}
          onClick={() => { download(foodCSV(data.logs), `log-food-${who}-${stamp}.csv`); toast("Food log downloaded"); }}>
          Every meal logged
        </button>
        <button className="tl-btn" style={{ width: "100%", marginTop: 8 }}
          onClick={() => { download(JSON.stringify(data, null, 2), `log-backup-${who}-${stamp}.json`); toast("Backup downloaded"); }}>
          Full backup (JSON)
        </button>
      </div>

      <div className="tl-eyebrow">Start over</div>
      <div className="tl-card">
        {!confirm ? (
          <button className="tl-btn" data-danger="1" style={{ width: "100%" }} onClick={() => setConfirm(true)}>
            Clear this log
          </button>
        ) : (
          <>
            <div className="tl-note" style={{ marginTop: 0 }}>
              This erases every session, meal and weigh-in for this profile. Download a backup first if you want one.
            </div>
            <div className="tl-row" style={{ marginTop: 10 }}>
              <button className="tl-btn tl-grow" onClick={() => setConfirm(false)}>Keep it</button>
              <button className="tl-btn tl-grow" data-danger="1"
                onClick={() => { persist({ logs: {}, maxes: {} }); setConfirm(false); toast("Log cleared"); }}>
                Erase everything
              </button>
            </div>
          </>
        )}
      </div>

      <div className="tl-quote">
        {who === "kalli" ? (
          <><b>et vera incessu patuit dea</b>And by her walk she was revealed a true goddess.</>
        ) : who === "michael" ? (
          <><b>Lupus non curat numerum ovium</b>The wolf does not care about the number of the sheep.</>
        ) : (
          <><b>Paulatim summa petuntur</b>The heights are reached little by little.</>
        )}
      </div>
    </>
  );
}
