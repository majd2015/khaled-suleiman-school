import {makeKit} from './shared.mjs';
export function createComputingModel(THREE) {
  const k=makeKit(THREE,'Computing'),p=k.palette;
  const screen=new THREE.Group();screen.position.set(0,.3,0);screen.rotation.x=-.12;k.group.add(screen);
  k.plate(2.8,1.8,.18,.18,p.silver,[0,0,0],screen);
  k.plate(2.54,1.5,.05,.12,p.glass,[0,0,.125],screen);
  for(let i=0;i<5;i++){
    const width=[1.25,.85,1.45,.65,1.05][i];
    k.plate(width,.055,.025,.025,i%2?p.violet:p.cyan,[-.95+width/2,.42-i*.2,.18],screen);
  }
  const base=k.plate(3,1.65,.14,.19,p.pearl,[0,-.72,.62]);base.rotation.x=-Math.PI/2;
  const pad=k.plate(.75,.42,.025,.07,p.glass,[0,-.62,1]);pad.rotation.x=-Math.PI/2;
  for(let r=0;r<3;r++)for(let c=0;c<9;c++){
    const key=k.plate(.2,.12,.025,.025,p.silver,[-1+c*.25,-.625,.15+r*.2]);key.rotation.x=-Math.PI/2;
  }
  return k.finish();
}

