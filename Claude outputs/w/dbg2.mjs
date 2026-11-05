import { World } from '../../js/world.js';
import b3 from '../../js/data/b3.js';
globalThis.Image = class { set src(v){} };
const w = new World({ getContext: () => ({}) }, b3, {});
w.player.x=-5000; w.player.y=-5000;
const dt=1/30;
for (let i=0;i<700*30;i++){ w.update(dt,{});
  if (i%(60*30)===0 || i===700*30-1) console.log(Math.round(i/30), w.npcs.filter(n=>['ines_calderra','vikram_ashvale','lio_shen','maudlin_pryce'].includes(n.id)).map(n=>n.id.split('_')[0]+(n.atHome?':home':':'+Math.round(n.x)+','+Math.round(n.y)+' step'+n.routineIndex)).join('  '));
}
