import {makeKit} from './shared.mjs';
export function createPhysicsModel(THREE) {
  const k=makeKit(THREE,'Physics'), p=k.palette;
  k.ball(.36,p.pearl);
  k.ball(.14,p.cyan,[.2,.17,.24]); k.ball(.13,p.violet,[-.21,-.08,.22]);
  const orbits=[];
  for(let i=0;i<3;i++){
    const plane=new THREE.Group();plane.rotation.set(.35+i*.55,i*.7,i*Math.PI/3);k.group.add(plane);
    k.mesh(new THREE.TorusGeometry(1.2,.035,10,96),i===1?p.cyan:p.violet,[0,0,0],plane);
    const electron=k.ball(.115,i===1?p.cyan:p.pearl,[1.2,0,0],plane);
    orbits.push(electron);
  }
  // A symbolic atom, not a scientifically accurate electron trajectory simulation.
  return k.finish(t=>orbits.forEach((o,i)=>o.position.set(1.2*Math.cos(t*.35+i*2),1.2*Math.sin(t*.35+i*2),0)));
}

