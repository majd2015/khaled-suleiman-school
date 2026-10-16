// Procedural source templates. Pass the application's THREE namespace.
export function makeKit(THREE, name) {
  const group = new THREE.Group();
  group.name = 'KS/' + name;
  const geometry = new Set(), materials = new Set();
  function material(color, glass = false) {
    const m = new THREE.MeshPhysicalMaterial({
      color, metalness: glass ? 0.03 : 0.22, roughness: glass ? 0.22 : 0.3,
      clearcoat: 1, clearcoatRoughness: 0.12,
      transmission: glass ? 0.48 : 0, thickness: glass ? 0.3 : 0, ior: 1.45
    });
    materials.add(m); return m;
  }
  const palette = {
    pearl: material('#F5F8FC'), silver: material('#CBD5E1'),
    cyan: material('#06B6D4', true), blue: material('#2563EB', true),
    violet: material('#7C3AED', true), copper: material('#EA580C'),
    glass: material('#E6F5FF', true), ink: material('#10182F')
  };
  function mesh(g, m, at = [0,0,0], parent = group) {
    geometry.add(g); const o = new THREE.Mesh(g,m);
    o.position.set(...at); parent.add(o); return o;
  }
  function ball(radius, m, at = [0,0,0], parent = group) {
    return mesh(new THREE.SphereGeometry(radius,24,16),m,at,parent);
  }
  function rod(a,b,radius,m,parent = group) {
    const p = new THREE.Vector3(...a), q = new THREE.Vector3(...b);
    const delta = q.clone().sub(p), len = delta.length();
    if (len < 1e-6) throw new Error('Rod endpoints must differ');
    const o = mesh(new THREE.CylinderGeometry(radius,radius,len,12),m,[0,0,0],parent);
    o.position.copy(p.add(q).multiplyScalar(.5));
    o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
    return o;
  }
  function tube(points,radius,m,parent = group) {
    const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    return mesh(new THREE.TubeGeometry(curve,Math.max(40,points.length*2),radius,10,false),m,[0,0,0],parent);
  }
  function plate(w,h,d,r,m,at = [0,0,0],parent = group) {
    r=Math.min(r,w/2,h/2);
    const s = new THREE.Shape(), x=-w/2, y=-h/2;
    s.moveTo(x+r,y); s.lineTo(x+w-r,y); s.quadraticCurveTo(x+w,y,x+w,y+r);
    s.lineTo(x+w,y+h-r); s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    s.lineTo(x+r,y+h); s.quadraticCurveTo(x,y+h,x,y+h-r);
    s.lineTo(x,y+r); s.quadraticCurveTo(x,y,x+r,y); s.closePath();
    const bevel=Math.min(.035,d/4,r/3);
    const g = new THREE.ExtrudeGeometry(s,{depth:d,steps:1,curveSegments:6,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:3});
    g.translate(0,0,-d/2);
    return mesh(g,m,at,parent);
  }
  let dead=false;
  function finish(update = ()=>{}) {
    return {group, update: t=>{if(!dead) update(t);}, dispose(){
      if(dead)return; dead=true; group.parent?.remove(group);
      for(const g of geometry)g.dispose();
      for(const m of materials)m.dispose();
      group.clear(); geometry.clear(); materials.clear();
    }};
  }
  return {THREE,group,palette,mesh,ball,rod,tube,plate,finish};
}

