import {makeKit} from './shared.mjs';
export function createElectronicsModel(THREE) {
  const k=makeKit(THREE,'Electronics'),p=k.palette;
  k.plate(3.35,3.05,.1,.25,p.glass,[0,0,-.2]);
  k.plate(1.36,1.36,.25,.14,p.silver);
  k.plate(1.06,1.06,.07,.12,p.copper,[0,0,.17]);
  k.plate(.68,.68,.03,.08,p.glass,[0,0,.23]);
  for(let side=0;side<4;side++){
    const assembly=new THREE.Group();assembly.rotation.z=side*Math.PI/2;k.group.add(assembly);
    for(let j=0;j<4;j++){
      const x=-.45+j*.3;
      k.rod([x,.68,0],[x,.94,0],.04,p.silver,assembly);
      const end=[x*1.45,1.25+(j%2)*.1,-.11];
      k.rod([x,.94,-.11],[x,1.08,-.11],.018,p.copper,assembly);
      k.rod([x,1.08,-.11],end,.018,p.copper,assembly);
      k.ball(.045,p.copper,end,assembly);
    }
  }
  return k.finish();
}

