// Optional browser host. It owns its renderer, environment, DOM, and model instance.
// Call the returned dispose() when the component unmounts.
export function mountModelViewer({THREE,container,createModel,fallbackUrl,label='مجسّم تعليمي'}) {
  if(!container)throw new Error('A container is required');
  const panel=document.createElement('section');panel.className='ks-model-viewer';
  const stage=document.createElement('div');stage.className='ks-model-stage';
  const fallback=document.createElement('img');fallback.src=fallbackUrl;fallback.alt=label;
  fallback.className='ks-model-fallback';stage.append(fallback);
  const controls=document.createElement('div');controls.className='ks-model-controls';
  const status=document.createElement('p');status.className='ks-model-status';status.setAttribute('aria-live','polite');
  panel.append(stage,controls,status);container.append(panel);
  let renderer, model, environmentTarget, environmentScene, pmrem;
  let dead=false,failed=false,playing=false,visible=false,frame=0,last=0,time=0;
  let pointer=null,px=0,py=0;const removeListeners=[];
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);
  const rotator=new THREE.Group();scene.add(rotator);
  function on(target,type,fn){target.addEventListener(type,fn);removeListeners.push(()=>target.removeEventListener(type,fn));}
  function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
  function active(){return !dead&&!failed&&visible&&!document.hidden;}
  function render(){if(active()){try{renderer.render(scene,camera);}catch{fail();}}}
  function tick(now){
    frame=0;if(!active()||!playing||media.matches){last=0;return;}
    const delta=last?Math.min((now-last)/1000,.05):0;time+=delta;last=now;
    rotator.rotation.y+=delta*.13;model.update(time);render();
    if(active()&&playing)frame=requestAnimationFrame(tick);
  }
  function sync(){stop();render();if(active()&&playing&&!media.matches)frame=requestAnimationFrame(tick);}
  function fail(){
    failed=true;stop();fallback.hidden=false;if(renderer)renderer.domElement.hidden=true;
    for(const b of controls.querySelectorAll('button'))b.disabled=true;
    status.textContent='تظهر الصورة الثابتة لأن العرض التفاعلي غير متاح.';
  }
  function button(text,handler){
    const b=document.createElement('button');b.type='button';b.textContent=text;b.className='ks-btn ks-btn--secondary';
    on(b,'click',handler);controls.append(b);return b;
  }
  let observer,resizeObserver;
  function dispose(){
    if(dead)return;dead=true;stop();observer?.disconnect();resizeObserver?.disconnect();
    for(const remove of removeListeners)remove();
    model?.dispose();environmentTarget?.dispose();pmrem?.dispose();
    environmentScene?.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});
    renderer?.dispose();panel.remove();
  }
  try{
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setClearColor('#F5F8FC',0);
    if('outputColorSpace' in renderer)renderer.outputColorSpace=THREE.SRGBColorSpace;
    else renderer.outputEncoding=THREE.sRGBEncoding;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
    const canvas=renderer.domElement;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',label+'؛ يمكن تدويره بالأزرار المجاورة أو بالسحب');
    stage.append(canvas);fallback.hidden=true;
    model=createModel(THREE);rotator.add(model.group);rotator.rotation.set(-.08,-.25,0);
    // A tiny local studio environment avoids a remote HDR download.
    environmentScene=new THREE.Scene();environmentScene.background=new THREE.Color('#DDE7F5');
    for(const [color,position,scale] of [
      ['#FFFFFF',[-3,5,4],[4,6,1]],['#B5EFFE',[4,2,0],[3,5,1]],['#DBCDFF',[-4,0,-3],[3,5,1]]
    ]){
      const lightPanel=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));
      lightPanel.position.set(...position);lightPanel.scale.set(...scale);lightPanel.lookAt(0,0,0);environmentScene.add(lightPanel);
    }
    pmrem=new THREE.PMREMGenerator(renderer);environmentTarget=pmrem.fromScene(environmentScene,.08);
    scene.environment=environmentTarget.texture;
    scene.add(new THREE.HemisphereLight('#FFFFFF','#8BA4C8',1.5));
    const light=new THREE.DirectionalLight('#FFFFFF',2.2);light.position.set(3,5,5);scene.add(light);
    const fill=new THREE.DirectionalLight('#C7EFFF',.8);fill.position.set(-4,1,2);scene.add(fill);
    const bounds=new THREE.Box3().setFromObject(rotator),sphere=bounds.getBoundingSphere(new THREE.Sphere());
    const center=sphere.center.clone();rotator.position.sub(center);
    function resize(){
      if(dead||failed)return;const w=stage.clientWidth,h=stage.clientHeight;if(w<1||h<1)return;
      renderer.setSize(w,h,false);camera.aspect=w/h;
      const vertical=camera.fov*Math.PI/180,horizontal=2*Math.atan(Math.tan(vertical/2)*camera.aspect);
      const distance=sphere.radius/Math.sin(Math.min(vertical,horizontal)/2)*1.12;
      camera.position.set(.28,.18,1).normalize().multiplyScalar(distance);
      camera.lookAt(0,0,0);camera.updateProjectionMatrix();render();
    }
    const play=button('تشغيل الحركة',()=>{
      playing=!playing;play.textContent=playing?'إيقاف الحركة':'تشغيل الحركة';play.setAttribute('aria-pressed',String(playing));sync();
    });play.setAttribute('aria-pressed','false');
    button('تدوير يمينًا',()=>{rotator.rotation.y+=Math.PI/12;render();});
    button('تدوير يسارًا',()=>{rotator.rotation.y-=Math.PI/12;render();});
    button('إعادة الوضع',()=>{rotator.rotation.set(-.08,-.25,0);time=0;model.update(0);render();});
    function motion(){
      if(media.matches){playing=false;play.textContent='تشغيل الحركة';play.setAttribute('aria-pressed','false');}
      play.disabled=media.matches;
      status.textContent=media.matches?'الحركة التلقائية متوقفة حسب تفضيلاتك. يمكنك التدوير بالأزرار.':'اسحب المجسّم أو استخدم أزرار التدوير. الحركة اختيارية.';
      sync();
    }
    on(media,'change',motion);on(document,'visibilitychange',sync);
    on(canvas,'pointerdown',e=>{if(e.button!==0)return;pointer=e.pointerId;px=e.clientX;py=e.clientY;canvas.setPointerCapture(pointer);});
    on(canvas,'pointermove',e=>{
      if(pointer!==e.pointerId)return;rotator.rotation.y+=(e.clientX-px)*.008;
      rotator.rotation.x=Math.max(-.7,Math.min(.7,rotator.rotation.x+(e.clientY-py)*.004));
      px=e.clientX;py=e.clientY;render();
    });
    const release=()=>{pointer=null;};
    on(canvas,'pointerup',release);on(canvas,'pointercancel',release);on(canvas,'lostpointercapture',release);
    on(canvas,'webglcontextlost',e=>{e.preventDefault();fail();});
    // A fresh mount restores 3D after context loss; the static fallback remains usable meanwhile.
    if('IntersectionObserver' in window){
      observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});observer.observe(stage);
    }else visible=true;
    if('ResizeObserver' in window){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);}
    else on(window,'resize',resize);
    resize();motion();
  }catch(error){fail();console.warn('School 3D preview fallback:',error);}
  return {dispose};
}

