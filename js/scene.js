import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createRoomScene(stage, specials, menuItems, { onSelect, onMenuItem, onOpenMenu, onHover, onSeatChange, reducedMotion, onReady }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label', 'Interactive restaurant room with eight chef specials on the centre table and a wall menu.');
  renderer.domElement.style.touchAction = 'none';
  stage.append(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#3b292a');
  const camera = new THREE.PerspectiveCamera(48, 1, .08, 80);
  const homePosition = new THREE.Vector3(.2, 1.72, 4.5);
  const homeLook = new THREE.Vector3(0, 1.05, -.1);
  camera.position.copy(homePosition); camera.lookAt(homeLook);
  scene.add(new THREE.HemisphereLight(0xffe6c6, 0x423033, 1.35));
  const key = new THREE.DirectionalLight(0xffddb4, 1.1);
  key.position.set(-2, 5, 3); key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.00022; key.shadow.normalBias = 0.025;
  key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
  scene.add(key);
  for (const [x, z] of [[0,0],[-3,-2],[3,-2]]) {
    const light = new THREE.PointLight(0xffc88a, 7, 10, 2);
    light.position.set(x, 3.7, z); scene.add(light);
  }
  const groups=[]; const hitTargets=[]; const seatTargets=[]; const loader=new GLTFLoader();
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;
  const shadowContext=shadowCanvas.getContext('2d');
  const shadowGradient=shadowContext.createRadialGradient(64,64,8,64,64,62);
  shadowGradient.addColorStop(0,'rgba(22,12,13,.38)');shadowGradient.addColorStop(.48,'rgba(22,12,13,.22)');shadowGradient.addColorStop(1,'rgba(22,12,13,0)');
  shadowContext.fillStyle=shadowGradient;shadowContext.fillRect(0,0,128,128);
  const contactShadowTexture=new THREE.CanvasTexture(shadowCanvas);
  const turntable=new THREE.Group(); scene.add(turntable);
  let tableSurface=null;
  const midpoint=Math.ceil(menuItems.length/2);
  const posters=[
    createWallMenu(menuItems.slice(0,midpoint),'left'),
    createWallMenu(menuItems.slice(midpoint),'right')
  ];
  posters.forEach(poster=>scene.add(poster.mesh));
  // Artwork belongs on the opposite (rear) wall, behind the visitor at the default view.
  scene.add(createBackWallArt());
  loader.load('assets/models/olive-arch-bistro-room.glb?v=2', gltf => {
    scene.add(gltf.scene);
    gltf.scene.updateMatrixWorld(true);
    // Blender procedural shaders do not all survive glTF export, so restore their palette here.
    const finishes = {
      'Dark walnut natural grain': '#543021',
      'Deep chocolate walnut bar finish': '#35251f',
      'Amber glass': '#b66a36',
      'Satin ivory carved mouldings': '#e2d3bf',
      'Bronze black': '#292021',
      'Brushed antique champagne brass': '#b8955e',
      'Ivory bottle labels': '#eee3d1',
      'Warm chandelier opal': '#ffedcf',
      'Candle flame warm': '#ffb764',
      'Porcelain': '#efe3cf',
      'Natural oatmeal boucle': '#dbccba',
      'Layered warm limewash': '#c9ac91',
      'Travertine': '#c9aa8c',
      'Ivory glazed porcelain': '#f4e8d5',
      'Olive leaf satin': '#6d6949',
      'Vintage botanical floral linen': '#a68072',
      'Fine ivory woven linen': '#e2d1ba',
      'Polished silver cutlery': '#aeb2b1',
      'Glazed textured stoneware': '#6a5d54',
      'Olive velvet upholstery': '#88866a',
      'Olive branches': '#555a3d',
      'Emerald liquor glass': '#436c4d',
      'Amber liquor glass': '#b87336',
      'Champagne liquor glass': '#d7b67b',
      'Polished Calacatta white marble': '#e4d9c9'
    };
    gltf.scene.traverse(object => {
      // The authored hero table had a vase and small place-setting props baked onto it.
      // Keep the real walnut furniture, but clear that surface for the rotating specials.
      if (object.isMesh && !['Base','Pedestal','Round walnut top'].includes(object.name)) {
        const worldPosition=object.getWorldPosition(new THREE.Vector3());
        if (worldPosition.y>.8 && worldPosition.y<1.8 && Math.hypot(worldPosition.x,worldPosition.z)<1.02) object.visible=false;
      }
      if (['Brass wall sconce back','Brass wall sconce back.001','Opaline sconce globe','Opaline sconce globe.001','Sconce arm','Sconce arm.001'].includes(object.name)) object.visible = false;
      if (!object.isMesh) return;
      object.receiveShadow = true; object.castShadow = false;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      for (const material of materials) {
        if (finishes[material.name]) material.color.set(finishes[material.name]);
        if (material.name.startsWith('Oak parquet tone')) {
          const tone = Number(material.name.slice(-2));
          material.color.setHSL(.087, .37, .38 + tone * .005);
        }
      }
    });
    for (const name of ['Base','Pedestal','Round walnut top']) {
      const part=gltf.scene.getObjectByName(name);
      if(part) {
        turntable.attach(part);
        part.receiveShadow = true;
        part.castShadow = true;
        if(name==='Round walnut top') tableSurface=part;
      }
    }
    onReady();
  }, undefined, error => {
    console.error('Could not load the restaurant room', error);
    onReady(false);
  });
  const seatLayout=[[0,-1.64],[1.42,-.82],[1.42,.82],[0,1.64],[-1.42,.82],[-1.42,-.82]];
  seatLayout.forEach(( [x,z], index )=>{
    const hit=new THREE.Mesh(new THREE.SphereGeometry(.43,16,12),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
    hit.position.set(x,.62,z);hit.userData.seat={index,position:new THREE.Vector3(x,0,z)};seatTargets.push(hit);scene.add(hit);
  });
  specials.forEach((special,index) => {
    const group=new THREE.Group();
    // Table top is at y=.795 in the Blender export; seat the plates on it.
    group.position.set(special.position[0]*.45,.828,special.position[2]*.45);
    group.userData.special=special;
    turntable.add(group); groups.push(group);
    const contactShadow=new THREE.Mesh(new THREE.PlaneGeometry(.56,.48),new THREE.MeshBasicMaterial({map:contactShadowTexture,color:0x241416,transparent:true,opacity:.82,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,side:THREE.DoubleSide}));
    contactShadow.rotation.x=-Math.PI/2;contactShadow.position.y=-.032;contactShadow.renderOrder=1;group.add(contactShadow);
    const image=new THREE.TextureLoader().load(special.image);image.colorSpace=THREE.SRGBColorSpace;
    if(special.modelPath){
      loader.load(special.modelPath,gltf=>{
        gltf.scene.scale.setScalar(.38);
        // Blender dish models use a centered tabletop origin and a shallow, consistent scale.
        gltf.scene.position.y=-.032;
        gltf.scene.traverse(object=>{if(object.isMesh)object.castShadow=true;});
        group.add(gltf.scene);
      },undefined,error=>console.error('Dish model failed',error));
    }else if(special.model==='jar'){
      const saucer=new THREE.Mesh(new THREE.CylinderGeometry(.19,.18,.016,32),new THREE.MeshStandardMaterial({color:0xf2e6d6,roughness:.3}));
      saucer.position.y=-.025;saucer.castShadow=true;saucer.receiveShadow=true;group.add(saucer);
      const glass=new THREE.MeshStandardMaterial({color:0xe9dfca,roughness:.24,transparent:true,opacity:.88});
      const jar=new THREE.Mesh(new THREE.CylinderGeometry(.14,.13,.26,24),glass);jar.position.y=.11;jar.castShadow=true;group.add(jar);
      const label=new THREE.Mesh(new THREE.PlaneGeometry(.23,.19),new THREE.MeshBasicMaterial({map:image,side:THREE.DoubleSide}));
      label.position.set(0,.1,.136);group.add(label);
      const lid=new THREE.Mesh(new THREE.CylinderGeometry(.145,.145,.025,24),new THREE.MeshStandardMaterial({color:0x2c2021,roughness:.4}));lid.position.y=.26;group.add(lid);
    }else{
      const saucer=new THREE.Mesh(new THREE.CylinderGeometry(.19,.18,.016,32),new THREE.MeshStandardMaterial({color:0xf2e6d6,roughness:.3}));
      saucer.position.y=-.025;saucer.castShadow=true;saucer.receiveShadow=true;group.add(saucer);
      const dark=new THREE.MeshStandardMaterial({color:0x252326,roughness:.28});
      const bowl=new THREE.Mesh(new THREE.CylinderGeometry(.18,.145,.085,32),dark);bowl.position.y=.025;bowl.castShadow=true;group.add(bowl);
      const food=new THREE.Mesh(new THREE.CircleGeometry(.16,32),new THREE.MeshBasicMaterial({map:image,side:THREE.DoubleSide}));food.rotation.x=-Math.PI/2;food.position.y=.071;group.add(food);
    }
    const hit=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.45,16),new THREE.MeshBasicMaterial({visible:false}));
    hit.position.y=.1;hit.userData.group=group;group.add(hit);hitTargets.push(hit);
  });
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  const canvas=renderer.domElement;
  let pointerActive=false,dragging=false,moved=false,downX=0,downY=0,lastX=0,lastY=0;
  let hover=null, hoverSeat=false, focusedMenu=null, seated=false, currentSeat=null, menuZoom=0, cameraGoal=homePosition.clone(), lookGoal=homeLook.clone();
  let currentLook=homeLook.clone(), frame=0, last=performance.now();
  // Standing visitors can orbit the whole room; seated visitors get a fixed chair view.
  let roomYaw=Math.atan2(homePosition.x,homePosition.z),roomPitch=0,roomRadius=homePosition.length();
  const menuPosition={left:new THREE.Vector3(-3.2,2.38,-2.8),right:new THREE.Vector3(3.2,2.38,-2.8)};
  const menuLook={left:new THREE.Vector3(-3.2,2.4,-6.85),right:new THREE.Vector3(3.2,2.4,-6.85)};
  function locate(event){
    const rect=canvas.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
    pointer.set(x*2-1,1-y*2);raycaster.setFromCamera(pointer,camera);
    const boardHit=raycaster.intersectObjects(posters.map(p=>p.mesh),false)[0];
    const dishHit=raycaster.intersectObjects(hitTargets,false)[0];
    const seatHit=seated?null:raycaster.intersectObjects(seatTargets,false)[0];
    const tableHit=tableSurface?raycaster.intersectObject(tableSurface,true)[0]:null;
    return {boardHit,dishHit,seatHit,tableHit};
  }
  canvas.addEventListener('pointerdown',event=>{
    const hit=locate(event);
    pointerActive=true;
    // From a chair, only a press on the tabletop can start the table-turn gesture.
    dragging=!focusedMenu&&(!seated||Boolean(hit.tableHit));
    moved=false;downX=lastX=event.clientX;downY=lastY=event.clientY;
    if(dragging)canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove',event=>{
    if(pointerActive){
      const dx=event.clientX-lastX,dy=event.clientY-lastY;lastX=event.clientX;lastY=event.clientY;
      if(Math.abs(event.clientX-downX)+Math.abs(event.clientY-downY)>6)moved=true;
      if(dragging&&seated&&!focusedMenu)turntable.rotation.y+=dx*.012;
      else if(dragging&&!seated&&!focusedMenu){roomYaw-=dx*.006;roomPitch=THREE.MathUtils.clamp(roomPitch+dy*.004,-.18,.52);}
      return;
    }
    const hit=locate(event);
    const group=hit.dishHit?.object.userData.group||null;
    const chair=Boolean(hit.seatHit);
    if(group!==hover||chair!==hoverSeat){hover=group;hoverSeat=chair;onHover(group?.userData.special||null,event,chair);}
    canvas.style.cursor=group||hit.boardHit||chair?'pointer':hit.tableHit?'grab':seated?'default':'grab';
  });
  canvas.addEventListener('pointerup',event=>{
    if(!pointerActive)return;pointerActive=false;dragging=false;if(moved)return;
    const {boardHit,dishHit,seatHit}=locate(event);
    if(boardHit){
      const poster=posters.find(p=>p.mesh===boardHit.object);
      const canvasY=(1-boardHit.uv.y)*2000;
      const row=poster.rows.find(item=>canvasY>=item.top&&canvasY<=item.bottom);
      if(row&&focusedMenu===poster.side)onMenuItem(row.item);
      else onOpenMenu(poster.side);
    }else if(seatHit&&!seated){
      sitAt(seatHit.object.userData.seat.index);
    }else if(dishHit)onSelect(dishHit.object.userData.group.userData.special);
  });
  canvas.addEventListener('pointercancel',()=>{pointerActive=false;dragging=false;});
  canvas.addEventListener('pointerleave',()=>{if(!dragging){hover=null;hoverSeat=false;onHover(null,null,false);}});
  function sitAt(index){currentSeat=seatTargets[index]?.userData.seat;if(!currentSeat)return;seated=true;focusedMenu=null;setSeatCamera();onSeatChange(true);onHover(null,null,false);}
  function setSeatCamera(){
    const outward=currentSeat.position.clone().normalize();
    cameraGoal.set(outward.x*2.72,1.48,outward.z*2.72);
    lookGoal.set(0,1.03,0);
  }
  function focusMenu(side='right'){
    focusedMenu=side;
    const distance=menuPosition[side].distanceTo(menuLook[side]);
    cameraGoal.copy(menuPosition[side]).lerp(menuLook[side],menuZoom/distance);
    lookGoal.copy(menuLook[side]);
  }
  function setMenuZoom(amount){menuZoom=THREE.MathUtils.clamp(menuZoom+amount,0,1.15);if(focusedMenu)focusMenu(focusedMenu);}
  function resetView(){focusedMenu=null;menuZoom=0;if(seated)setSeatCamera();}
  function standUp(){
    if(currentSeat)roomYaw=Math.atan2(currentSeat.position.x,currentSeat.position.z);
    roomPitch=0;roomRadius=4.5;seated=false;currentSeat=null;focusedMenu=null;menuZoom=0;onSeatChange(false);
  }
  function zoomIn(){setMenuZoom(.3)}
  function zoomOut(){setMenuZoom(-.3)}
  canvas.addEventListener('wheel',event=>{
    if(focusedMenu){setMenuZoom(event.deltaY<0?.08:-.08);event.preventDefault();}
    else if(!seated){roomRadius=THREE.MathUtils.clamp(roomRadius+event.deltaY*.003,3.7,5.25);event.preventDefault();}
  },{passive:false});
  const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);};
  const observer=new ResizeObserver(resize);observer.observe(stage);resize();
  function animate(now){
    frame=requestAnimationFrame(animate);
    if(document.hidden){last=now;return;}
    const dt=Math.min((now-last)/1000,.05);last=now;
    const freePosition=new THREE.Vector3(Math.sin(roomYaw)*roomRadius,homePosition.y+roomPitch,Math.cos(roomYaw)*roomRadius);
    const position=focusedMenu||seated?cameraGoal:freePosition;
    if(!focusedMenu&&!seated)lookGoal.copy(homeLook);
    camera.position.lerp(position,reducedMotion?1:.075);
    currentLook.lerp(lookGoal,reducedMotion?1:.075);
    camera.lookAt(currentLook);
    if(!reducedMotion)turntable.rotation.y+=dt*.09;
    for(const group of groups){
      const target=group===hover?1.15:1;
      const s=THREE.MathUtils.lerp(group.scale.x,target,reducedMotion?1:.15);group.scale.setScalar(s);
      if(group.userData.special.modelPath&&!reducedMotion)group.rotation.y+=dt*.14;
    }
    renderer.render(scene,camera);
  }
  frame=requestAnimationFrame(animate);
  return {focusMenu,resetView,standUp,sitAt,zoomIn,zoomOut,isMenuFocused:(side)=>side?focusedMenu===side:Boolean(focusedMenu),isSeated:()=>seated,dispose(){cancelAnimationFrame(frame);observer.disconnect();renderer.dispose();canvas.remove();}};
}
function createBackWallArt(){
  const group=new THREE.Group();
  // Positive Z is the wall behind the visitor when entering the room.
  group.position.set(0,3.45,6.88);
  group.rotation.y=Math.PI;
  const bronze=new THREE.MeshStandardMaterial({color:0xb8955e,metalness:.68,roughness:.3});
  const dark=new THREE.MeshStandardMaterial({color:0x33232a,metalness:.28,roughness:.42});
  const backing=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.3,.1),bronze);
  backing.castShadow=true;backing.receiveShadow=true;group.add(backing);
  const inset=new THREE.Mesh(new THREE.BoxGeometry(3.49,1.19,.035),dark);
  inset.position.z=.055;inset.castShadow=true;group.add(inset);
  const rails=[
    [3.44,.03,.025,0,.57,.085],[3.44,.03,.025,0,-.57,.085],
    [.03,1.14,.025,-1.72,0,.085],[.03,1.14,.025,1.72,0,.085]
  ];
  rails.forEach(([w,h,d,x,y,z])=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),bronze);mesh.position.set(x,y,z);group.add(mesh);});
  const photoMaterial=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,toneMapped:false});
  const photo=new THREE.Mesh(new THREE.PlaneGeometry(3.32,1.02),photoMaterial);
  photo.position.z=.077;group.add(photo);
  new THREE.TextureLoader().load('assets/images/brand/back-wall-table-still-life.jpg',source=>{
    const image=source.image,canvas=document.createElement('canvas');canvas.width=1200;canvas.height=368;
    const ctx=canvas.getContext('2d');
    const cropHeight=image.width*(canvas.height/canvas.width);
    ctx.drawImage(image,0,(image.height-cropHeight)/2,image.width,cropHeight,0,0,canvas.width,canvas.height);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
    photoMaterial.map=texture;photoMaterial.needsUpdate=true;
  });
  // Brass sunburst medallions and fine lines add detail around the rear-wall artwork.
  for(const side of [-1,1]){
    const medallion=new THREE.Group();medallion.position.set(side*1.48,-.88,.045);group.add(medallion);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.22,.02,8,40),bronze);medallion.add(ring);
    const center=new THREE.Mesh(new THREE.CircleGeometry(.17,32),dark);center.position.z=-.006;medallion.add(center);
    for(let i=0;i<8;i++){
      const ray=new THREE.Mesh(new THREE.BoxGeometry(.018,.28,.012),bronze);
      ray.rotation.z=i*Math.PI/4;ray.position.z=.012;medallion.add(ray);
    }
  }
  for(const y of [-.9,-.77,.77,.9]){
    const detail=new THREE.Mesh(new THREE.BoxGeometry(2.65,.012,.01),bronze);
    detail.position.set(0,y,.06);group.add(detail);
  }
  return group;
}
function createWallMenu(items,side){
  const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=2000;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#281e23';ctx.fillRect(0,0,1200,2000);
  ctx.strokeStyle='#bc9468';ctx.lineWidth=22;ctx.strokeRect(30,30,1140,1940);
  ctx.strokeStyle='#8f6e50';ctx.lineWidth=2;ctx.strokeRect(58,58,1084,1884);
  ctx.fillStyle='#e6c8a3';ctx.textAlign='center';
  ctx.font='700 38px Arial';ctx.fillText('SUPERNORMAL',600,118);
  ctx.font='700 75px Georgia';ctx.fillText(side==='left'?'The Menu · I':'The Menu · II',600,210);
  ctx.font='23px Arial';ctx.fillText('FROM THE KITCHEN · TAP A DISH',600,255);
  ctx.beginPath();ctx.moveTo(130,286);ctx.lineTo(1070,286);ctx.stroke();
  const rows=[];
  const rowHeight=102,start=305;
  items.forEach((item,index)=>{
    const top=start+index*rowHeight,bottom=top+rowHeight-5;
    ctx.fillStyle=index%2?'#36272b':'#302329';ctx.fillRect(90,top,1020,rowHeight-5);
    ctx.textAlign='left';ctx.fillStyle='#fff4e4';
    let fontSize=29;ctx.font=`bold ${fontSize}px Arial`;
    while(ctx.measureText(item.name).width>950&&fontSize>19){fontSize--;ctx.font=`bold ${fontSize}px Arial`;}
    ctx.fillText(item.name,115,top+40);
    ctx.fillStyle='#d6ad7d';ctx.font='21px Arial';ctx.fillText(item.category.toUpperCase(),115,top+76);
    ctx.textAlign='right';ctx.fillText(item.price,1080,top+76);
    rows.push({top,bottom,item});
  });
  ctx.textAlign='center';ctx.fillStyle='#e6c8a3';ctx.font='27px Arial';ctx.fillText('VIEW ALL DISHES  ↗',600,1910);
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=4;
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.02,2.78),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));
  mesh.position.set(side==='left'?-3.2:3.2,2.4,-6.84);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(2.12,2.88,.055),new THREE.MeshStandardMaterial({color:0x926b48,metalness:.52,roughness:.35}));
  frame.position.set(0,0,-.04);mesh.add(frame);
  return {mesh,rows,side};
}
