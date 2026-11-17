// Characters taken out of a scene but kept for later (2026-11-17).
// Nothing imports this file. When their new scene is built, move the entry
// into that scene's npcs list (and update the position/routine).
//
// Dame Elspeth Varrick: was hiding wounded at the camp by the river in B4
// (2026-10-16 to 2026-11-17). Danny: she goes in the King's castle (B2's
// keep) once it is built. Art: dame_elspeth_varrick.png / _overhead.png;
// voice already in audio.js (elspeth_varrick). Her lines still talk about
// hiding from the barricade, so rewrite them for the castle.
export const RESERVED_NPCS = [
    {
      id: 'elspeth_varrick', name: 'Dame Elspeth Varrick', role: 'KNIGHT OF THE CROWN',
      sprite: 'assets/images/dame_elspeth_varrick_overhead.png',
      portrait: 'assets/images/dame_elspeth_varrick.png',
      // A survivor of the king's search party, hiding wounded beside her tent.
      // Says the north was all cold and that they never once saw the wizard;
      // that is as close to the twist as anything in B4 gets.
      x: 933, y: 2176, speed: 0, startsHome: false, rotation: Math.PI / 2,
      dialog: {
        line: 'Easy. Easy. I’m not going to hurt you, and I’d ask you to return the favor. Are you from the barricade? No? Good. Then you didn’t see me.',
        responses: ['Leave.'],
      },
      chatter: [
        { q: 'Who are you?', a: 'Dame Elspeth Varrick, Knight of the Crown. One of the knights the king sent north after his daughter. There were twenty of us when we rode out. I’m what came back.' },
        { q: 'What happened up there?', a: 'Cold like you wouldn’t believe, past the cliffs. Ice on the inside of our helms. We climbed for days and never saw the wizard. Not once. Not a fire, not a footprint. Only the cold, worse the closer we got, and then something in the ice I still can’t put a name to.' },
        { q: 'Why are you hiding?', a: 'Because the captain at that barricade would have to report me, and the king would want to know why I’m alive when nineteen good knights aren’t. I don’t have an answer for him yet. When I do, I’ll walk into Kingsreach myself.' },
        { q: 'Your wounds look bad.', a: 'They’re healing. Slowly. The river’s cold and clean, and nobody comes this way. Don’t fuss. Just don’t tell anyone I’m here.' },
      ],
    },
];
