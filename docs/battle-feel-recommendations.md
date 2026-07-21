# Bringing the Battles to Life — Research & Recommendations

*Prepared July 2026. Scoped to the current vanilla-JS / DOM+CSS battle system so every suggestion stays no-build and Steam-wrap-safe.*

## Where the battles stand today

The bones are good — the trapezoid banner, cropped enemy portraits, overlapping HP bars, and diamond action slots all match your mockup. But mechanically a hit currently resolves as: colored `+N`/`−N` text appears in the top banner, the HP bar tweens down, a hurt SFX plays. The enemy portraits are **static images** — no reaction when struck, no idle motion, no death animation beyond dimming — and nothing moves on the *attacker's* side. There's no screen shake, no impact moment, no floating numbers over the target. So the fight reads as a menu updating rather than blows landing. The encouraging part: you already have the exact hooks needed to fix this cheaply — `battleUiState.enemySlots[i].el` gives you each enemy's DOM node, you already use the "remove → reflow → re-add class" trick for replayable CSS animations (`flashHealthDamage`, `portrait-enter`), and `runQueue()` already paces turns with `setTimeout`, which is where hit-stop and animation beats slot in.

## What the acclaimed turn-based RPGs do well

**The impact trifecta.** Research on hit feel consistently points to three things carrying the most weight: **hit-stop** (a brief freeze at the moment of contact), **sound coherence**, and **camera control** (screen shake). None of these require sprite art.

**The "juice" package.** The famous *Juice It or Lose It* demonstration turned a bland Breakout clone fun purely by adding **flash, screen shake, floating text, sound effects, and particles** — no new mechanics. That exact package is the cheapest, highest-impact upgrade available to you.

**Animation principles = weight.** Disney's **anticipation** (a windup before an action) and **squash & stretch** (deform on impact, volume preserved) are what make a hit feel like it has mass. The pro trick: add the *visual beat* of anticipation without actually delaying the action, so it feels weighty but still snappy.

**Persona 5** — presentation as a feature. Its combat is beloved largely for **snappy, stylish UI**: every input leads to fast, satisfying motion and character **cut-ins** on special moves. The lesson: menu/UI polish is combat polish.

**Octopath Traveler / Grandia** — legible depth. **Visible turn-order** trackers and **break/weakness** systems (hit a weakness → the enemy is stunned/broken, you're rewarded) make the strategy readable and satisfying.

**Sea of Stars / Mario RPG** — active engagement. **Timed hits** (press at the right moment for bonus damage, or to reduce incoming damage) keep the player watching the *animation* instead of zoning out through menus. This is the single biggest lever for "exciting," and it fits your keyboard-only design perfectly.

**Combat sound design.** Convincing hits **layer** a fast *whoosh* (anticipation/motion) into a sharp *contact transient* and a low *body thud* — brightness in the highs, weight in the mids/lows. Games deliberately **exaggerate** because the sound is *feedback*: it has to cut through music and confirm the action landed. Distinct sounds for crit / miss / block do a lot of communicative work.

## Recommendations, by effort

### Tier 1 — cheap and transformative (pure CSS + JS, essentially no new art)

This tier alone will make the battles feel like a different game. All of it is CSS keyframes toggled by classes plus small changes in `main.js`'s attack resolution.

1. **Floating damage numbers over the target.** When an enemy is hit, spawn a number that pops up over *that enemy's* portrait (`enemySlots[i].el`) and floats up while fading. Big gold number + "CRIT!" on criticals, grey for a miss. This is the biggest single readability/impact win and is ~30 lines of JS + one keyframe. Keep the banner text too, or retire it in favor of the floaters.

2. **Per-target hit reaction.** The struck portrait flashes white and shakes/recoils for ~150 ms (reuse your remove-reflow-readd trick on a `.hit` class). Right now the *health bar* flashes; the *body* should react. Pair a subtler version for the player taking damage (you have the bar flash — add a red screen-edge vignette pulse).

3. **Screen shake, scaled to damage.** A keyframe that jitters `#battle` (or `#stage`) for ~120–250 ms, intensity proportional to damage / bumped on crits. This is the classic "immediate, immersive feedback" the research calls out for critical hits.

4. **Hit-stop.** At the exact frame damage applies, freeze everything for ~80–120 ms *before* the HP drains and the next message shows. In your architecture that's a short `await`/`setTimeout` inserted into `playerAttack`/`resolveEnemyTurn` in `runQueue()`. Tiny change, enormous "weight" payoff — this is consistently rated the top contributor to impact feel.

5. **Attacker lunge (anticipation).** The acting side nudges toward its target and snaps back on contact. Enemies can lunge toward the screen/player; the player's chosen action diamond can pulse/thrust. Add the squash frame at the moment of impact so it reads as force, not just movement.

6. **Layered attack SFX.** Add a short **whoosh** on windup → **impact** thud on contact, plus distinct **crit**, **miss/whiff**, and **block/defend** sounds. You already have a clean one-shot system (`audio.sfx`, and `SFX.denied`/`hurt`/`gold` etc.) — this is just new files wired into the same path. Layer bright-highs + weighty-lows per the sound research.

### Tier 2 — medium (more animation, a few assets)

- **Living enemies.** A subtle looping idle bob/breathing keyframe so portraits aren't statues. On death, a dissolve/desaturate + sink/fade instead of just dimming — a small "pop" of particles sells the kill.
- **Attack telegraph.** Before an enemy strikes, a quick flash/windup (anticipation) so the player can read the incoming hit — this also sets up timed defense later.
- **Impact particles.** A burst of spark/slash marks at the hit point (a tiny transparent canvas overlay, or pure-CSS pseudo-element shards). Slash streak for physical, embers for the Torch's fire, etc.
- **Victory & defeat flourish.** Enemies pop/fade out on victory with a short fanfare sting; a brief "Victory!" banner. (Game Over already exists — give it a matching sting.)
- **Turn-order strip.** A small row showing who acts next. This pairs naturally with your new Speed-advantage initiative — it makes "the player goes first this round" *visible*, which is exactly the legibility Octopath/Grandia are praised for.

### Tier 3 — bigger lifts, genre-defining

- **Timed hits (highest gameplay ROI).** Press Space in a window during the attack animation for bonus damage; a defense window to reduce incoming damage. This converts "watching menus" into "playing the fight" and is a perfect fit for your no-mouse, Space-to-confirm scheme. Needs an animation timeline + input-window logic, but it's the thing players will *feel* most.
- **Weakness / break depth — you already have the seed.** Your Torch's "fire vs. wood-bodied foes → double damage + burn" is a latent weakness system. Surface it: a "WEAK!" pop, extra juice, maybe an Octopath-style stagger. Generalizing this to a small element/affinity system gives real strategic texture.
- **Persona-style cut-ins.** A character portrait/nameplate that slams in on a special move with snappy motion — pure DOM/CSS, high style-per-byte, very on-brand for making turns feel cool.
- **Sprite attack animations.** Multi-frame attack/hurt/death frames per enemy. Biggest visual upgrade, but the only item here that needs real art.

## Suggested first pass (highest ROI shortlist)

If you want a single focused session that will most visibly "bring the battles to life," do these six — all Tier 1, all CSS/JS, no art dependency:

1. Floating damage numbers over the target (crit/miss variants)
2. Hit-stop (~100 ms freeze on contact)
3. Per-target flash + shake on the struck combatant
4. Screen shake scaled to damage
5. Attacker lunge with an impact squash frame
6. Whoosh → impact SFX layer, plus crit and miss sounds

Together these are the full *Juice It or Lose It* package plus the impact trifecta (hit-stop + sound + shake), which is precisely what the research says carries the feel.

## Asset needs

- **Sounds (Tier 1):** a light whoosh, a meaty impact/thud, a crit hit, a miss/whiff, a block/defend clink, a short victory sting. (Same freesound-style sourcing as your existing SFX.)
- **Art (optional, Tier 2+):** small particle/spark sprites (or do it pure-CSS), and — only if you go for Tier 3 sprite animation — attack/hurt/death frames per enemy.
- **Everything in the "first pass" shortlist needs zero new art** — it's keyframes, class toggles, and a handful of SFX files.

## Sources

- [What are your favorite turn-based combat systems? (Famiboards)](https://famiboards.com/threads/what-are-your-favorite-turn-based-combat-systems.981/)
- [JRPGs That Reinvented Turn-Based Combat (Game Rant)](https://gamerant.com/jrpgs-reinvented-turn-based-combat/)
- [Persona's Combat System Is Brilliant (TheHans255)](https://thehans255.com/blog/2024/10/persona-combat-system/)
- [Where Does Game Feel Come From: Flash, Shake, Floating Text, Sound, Particle Feedback (BetterLink)](https://eastondev.com/blog/en/posts/dev/20260521-game-feedback-feel/)
- [Game feel on the web: squash, shake, and the art of juice (valdemird)](https://valdemird.com/blog/game-feel-on-the-web/)
- [Disney's 12 Animation Principles Applied to Games (GameJuice)](https://gamejuice.co.uk/articles/disney-12-animation-principles-games)
- [Juice in Game Design (Blood Moon Interactive)](https://www.bloodmooninteractive.com/articles/juice.html)
- [Turn-Based Combat done RIGHT: Sea of Stars (YouTube)](https://www.youtube.com/watch?v=mCE5Q0MRFPs)
- [Sea of Stars Review (Analog Stick Gaming)](https://www.analogstickgaming.com/game-reviews/2023/8/28/sea-of-stars)
- [Does the turn-based combat include timed actions? — Chained Echoes (Steam)](https://steamcommunity.com/app/1229240/discussions/0/3710433479218164360/)
- [Sound Design Is The Secret Sauce (Medium)](https://medium.com/@dyfo45/sound-design-is-the-secret-sauce-how-audio-makes-rpgs-truly-immersive-0836261eef8a)
- [Punch & Impact Sound Effects for Fight Scenes (Pixflow)](https://pixflow.net/blog/punch-impact-sound-effects-for-fight-scenes/)
