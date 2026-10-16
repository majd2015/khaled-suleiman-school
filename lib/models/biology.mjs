import {makeKit} from './shared.mjs';
export function createBiologyModel(THREE) {
  const k=makeKit(THREE,'Biology'),p=k.palette, a=[],b=[];
  for(let i=0;i<=64;i++){
    const t=i/64*Math.PI*3.4, y=-1.35+i/64*2.7;
    a.push([.65*Math.cos(t),y,.65*Math.sin(t)]);
    b.push([-.65*Math.cos(t),y,-.65*Math.sin(t)]);
  }
  k.tube(a,.065,p.cyan);k.tube(b,.065,p.violet);
  for(let i=2;i<64;i+=4){
    const middle=[0,a[i][1],0];
    k.rod(a[i],middle,.035,p.pearl);k.rod(middle,b[i],.035,p.silver);
    k.ball(.09,p.pearl,a[i]);k.ball(.09,p.pearl,b[i]);
  }
  // Symbolic DNA geometry. This is not a molecular-scale model.
  return k.finish();
}

