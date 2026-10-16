import {makeKit} from './shared.mjs';
export function createMathModel(THREE) {
  const k=makeKit(THREE,'Mathematics'), p=k.palette;
  k.plate(3.65,2.8,.12,.3,p.glass,[0,0,-.18]);
  k.rod([-1.5,-.85,.05],[1.5,-.85,.05],.025,p.silver);
  k.rod([-1.15,-1.05,.05],[-1.15,1.15,.05],.025,p.silver);
  for(let i=0;i<7;i++)k.rod([-1.5+i*.5,-1.05,-.08],[-1.5+i*.5,1.05,-.08],.009,p.pearl);
  const points=Array.from({length:61},(_,i)=>{const x=-1.45+i*2.9/60;return[x,.65*Math.sin(x*2.8),.16]});
  k.tube(points,.06,p.cyan); const marker=k.ball(.12,p.blue,points[40]);
  return k.finish(t=>{const x=-1.4+(Math.sin(t*.45)+1)*1.4;marker.position.set(x,.65*Math.sin(x*2.8),.16)});
}

