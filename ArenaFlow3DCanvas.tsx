import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SportType } from '../../types';

export type ArenaZone = 
  | 'hero' 
  | 'football' 
  | 'tennis' 
  | 'padel' 
  | 'cricket' 
  | 'badminton' 
  | 'running' 
  | 'volleyball' 
  | 'pool' 
  | 'map';

export type CourtStatus = 'available' | 'booked' | 'selected';

export interface CourtLocationMarker {
  id: string;
  x: number;
  z: number;
  title: string;
  sport: SportType;
  color: string;
  zone: ArenaZone;
  status: CourtStatus;
  slotsOpen: number;
}

interface ArenaFlow3DCanvasProps {
  scrollProgress?: number; // 0 to 1
  activeZone?: ArenaZone;
  onSelectCourt?: (courtName: string, sport: SportType) => void;
  onSelectZone?: (zone: ArenaZone) => void;
}

export const ArenaFlow3DCanvas: React.FC<ArenaFlow3DCanvasProps> = ({
  scrollProgress = 0,
  activeZone = 'hero',
  onSelectCourt,
  onSelectZone
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  
  // Camera state refs for smooth dampening
  const currentCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 52, 75));
  const currentCamLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 52, 75));
  const targetCamLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Keep track of active props in refs so animation loop uses latest values
  const activeZoneRef = useRef<ArenaZone>(activeZone);
  activeZoneRef.current = activeZone;
  const scrollProgressRef = useRef<number>(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // =========================================================================
    // 1. SCENE & RENDERER SETUP (PREMIUM CHAMPIONSHIP DAYLIGHT COLISEUM)
    // =========================================================================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070b16'); // Deep nocturnal tournament stadium sky
    scene.fog = new THREE.FogExp2('#070b16', 0.0045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1200);
    camera.position.copy(currentCamPos.current);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false, 
      powerPreference: 'high-performance' 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // =========================================================================
    // 2. DIRECTIONAL SUNLIGHT & DAYLIGHT STADIUM LIGHTING SYSTEM
    // =========================================================================
    const ambientLight = new THREE.AmbientLight('#ffffff', 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#ffffff', 1.8);
    sunLight.position.set(40, 90, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 300;
    sunLight.shadow.camera.left = -90;
    sunLight.shadow.camera.right = 90;
    sunLight.shadow.camera.top = 90;
    sunLight.shadow.camera.bottom = -90;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // 4 High-Tech Championship Floodlight Towers
    const floodlightConfigs = [
      { pos: new THREE.Vector3(-55, 34, -45), target: new THREE.Vector3(-25, 0, -20), color: '#0284c7' },
      { pos: new THREE.Vector3(55, 34, -45), target: new THREE.Vector3(25, 0, -20), color: '#0ea5e9' },
      { pos: new THREE.Vector3(-55, 34, 45), target: new THREE.Vector3(-25, 0, 20), color: '#059669' },
      { pos: new THREE.Vector3(55, 34, 45), target: new THREE.Vector3(25, 0, 20), color: '#d97706' },
    ];

    floodlightConfigs.forEach((cfg) => {
      // SpotLight (glow projection without heavy multi-pass shadow overhead)
      const spot = new THREE.SpotLight(cfg.color, 3.5);
      spot.position.copy(cfg.pos);
      const targetObj = new THREE.Object3D();
      targetObj.position.copy(cfg.target);
      scene.add(targetObj);
      spot.target = targetObj;
      spot.angle = Math.PI / 5;
      spot.penumbra = 0.5;
      spot.decay = 1.1;
      spot.distance = 220;
      spot.castShadow = false;
      scene.add(spot);

      // Cyber Tower Structure (Clean White Metallic)
      const towerGeo = new THREE.CylinderGeometry(0.4, 0.9, 34, 8);
      const towerMat = new THREE.MeshStandardMaterial({ 
        color: '#e2e8f0', 
        roughness: 0.2, 
        metalness: 0.7 
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(cfg.pos.x, 17, cfg.pos.z);
      tower.castShadow = false;
      scene.add(tower);

      // Glowing LED Light Panel Head
      const headGeo = new THREE.BoxGeometry(3.5, 1.8, 1.8);
      const headMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(cfg.pos.x, 34, cfg.pos.z);
      scene.add(head);

      // Volumetric Light Beam Cone
      const coneHeight = 38;
      const coneRadius = 14;
      const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 32, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(
        (cfg.pos.x + cfg.target.x) / 2,
        (cfg.pos.y + cfg.target.y) / 2,
        (cfg.pos.z + cfg.target.z) / 2
      );
      cone.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, -1, 0),
        cfg.target.clone().sub(cfg.pos).normalize()
      );
      scene.add(cone);
    });

    // =========================================================================
    // 3. BRIGHT CHAMPIONSHIP ARENA FLOOR & ATHLETIC GRID
    // =========================================================================
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#e2e8f0', // Crisp light tournament concrete
      roughness: 0.4,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Athletic Grid Helper
    const cyberGrid = new THREE.GridHelper(200, 50, '#0284c7', '#cbd5e1');
    cyberGrid.position.y = 0.02;
    scene.add(cyberGrid);

    // Outer Aerodynamic Perimeter Ring (Crisp White Finish)
    const rimGeo = new THREE.TorusGeometry(75, 1.4, 16, 120);
    const rimMat = new THREE.MeshStandardMaterial({ 
      color: '#ffffff', 
      roughness: 0.2, 
      metalness: 0.5 
    });
    const stadiumRim = new THREE.Mesh(rimGeo, rimMat);
    stadiumRim.rotation.x = Math.PI / 2;
    stadiumRim.position.y = 1.6;
    scene.add(stadiumRim);

    // Outer Neon Ring
    const neonRingGeo = new THREE.TorusGeometry(75.6, 0.25, 8, 120);
    const neonRingMat = new THREE.MeshBasicMaterial({ color: '#0284c7' });
    const neonRing = new THREE.Mesh(neonRingGeo, neonRingMat);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = 1.9;
    scene.add(neonRing);

    // Center Holographic Concentric HUD Rings
    const centerRingGeo = new THREE.RingGeometry(44, 44.5, 96);
    const centerRingMat = new THREE.MeshBasicMaterial({ 
      color: '#06b6d4', 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.6 
    });
    const centerRing = new THREE.Mesh(centerRingGeo, centerRingMat);
    centerRing.rotation.x = Math.PI / 2;
    centerRing.position.y = 0.05;
    scene.add(centerRing);

    const innerCenterRingGeo = new THREE.RingGeometry(18, 18.3, 64);
    const innerCenterRingMat = new THREE.MeshBasicMaterial({ 
      color: '#10b981', 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.5 
    });
    const innerCenterRing = new THREE.Mesh(innerCenterRingGeo, innerCenterRingMat);
    innerCenterRing.rotation.x = Math.PI / 2;
    innerCenterRing.position.y = 0.06;
    scene.add(innerCenterRing);

    // =========================================================================
    // 4. FLOATING HOLOGRAPHIC "ARENAFLOW" CENTER DISPLAY (0% HERO VIEW)
    // =========================================================================
    const logoGroup = new THREE.Group();
    logoGroup.position.set(0, 16, 0);

    // Outer rotating holographic hex-shield
    const shieldGeo = new THREE.RingGeometry(12, 12.4, 6);
    const shieldMat = new THREE.MeshBasicMaterial({ 
      color: '#38bdf8', 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.85 
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.rotation.x = Math.PI / 2;
    logoGroup.add(shield);

    // Floating Holographic Core Diamond
    const coreGeo = new THREE.OctahedronGeometry(2.2, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: '#06b6d4',
      roughness: 0.1,
      metalness: 0.9,
      emissive: '#0891b2',
      emissiveIntensity: 0.6
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    logoGroup.add(coreMesh);

    // Vertical Holographic Light Pillar
    const pillarGeo = new THREE.CylinderGeometry(0.1, 0.1, 16, 16);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.5
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = -8;
    logoGroup.add(pillar);

    scene.add(logoGroup);

    // =========================================================================
    // 5. 6-SPORT COURT MODELS WITH NEON GLOWS & DETAILED RIGS
    // =========================================================================
    const courtLocations: CourtLocationMarker[] = [];

    // -------------------------------------------------------------------------
    // SPORT 1: FOOTBALL (5v5 FIFA Approved Turf Pitch)
    // Position: x = -32, z = -14
    // -------------------------------------------------------------------------
    const footballGroup = new THREE.Group();
    footballGroup.position.set(-32, 0.08, -14);

    const fbPitchGeo = new THREE.PlaneGeometry(28, 18);
    const fbPitchMat = new THREE.MeshStandardMaterial({ 
      color: '#14532d', 
      roughness: 0.8,
      metalness: 0.1 
    });
    const fbPitch = new THREE.Mesh(fbPitchGeo, fbPitchMat);
    fbPitch.rotation.x = -Math.PI / 2;
    fbPitch.receiveShadow = true;
    footballGroup.add(fbPitch);

    // Glowing Neon Lime Pitch Boundary Lines
    const fbLinesGeo = new THREE.EdgesGeometry(fbPitchGeo);
    const fbLinesMat = new THREE.LineBasicMaterial({ color: '#4ade80', linewidth: 3 });
    const fbLines = new THREE.LineSegments(fbLinesGeo, fbLinesMat);
    fbLines.rotation.x = -Math.PI / 2;
    fbLines.position.y = 0.03;
    footballGroup.add(fbLines);

    // Center Circle
    const fbCircleGeo = new THREE.RingGeometry(3.6, 3.8, 32);
    const fbCircleMat = new THREE.MeshBasicMaterial({ color: '#4ade80', side: THREE.DoubleSide });
    const fbCircle = new THREE.Mesh(fbCircleGeo, fbCircleMat);
    fbCircle.rotation.x = -Math.PI / 2;
    fbCircle.position.y = 0.04;
    footballGroup.add(fbCircle);

    // Center Halfway Line
    const halfLineGeo = new THREE.PlaneGeometry(0.12, 18);
    const halfLineMat = new THREE.MeshBasicMaterial({ color: '#4ade80', side: THREE.DoubleSide });
    const halfLine = new THREE.Mesh(halfLineGeo, halfLineMat);
    halfLine.rotation.x = -Math.PI / 2;
    halfLine.position.y = 0.035;
    footballGroup.add(halfLine);

    // Goalposts
    const goalGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.6);
    const goalMat = new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.8, roughness: 0.2 });
    const goalPostL1 = new THREE.Mesh(goalGeo, goalMat);
    goalPostL1.position.set(-14, 1.3, 3);
    const goalPostL2 = new THREE.Mesh(goalGeo, goalMat);
    goalPostL2.position.set(-14, 1.3, -3);
    const crossbarGeo = new THREE.CylinderGeometry(0.14, 0.14, 6);
    const crossbar = new THREE.Mesh(crossbarGeo, goalMat);
    crossbar.rotation.x = Math.PI / 2;
    crossbar.position.set(-14, 2.6, 0);
    footballGroup.add(goalPostL1, goalPostL2, crossbar);

    // 3D Soccer Ball with Ambient Light
    const soccerBallGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const soccerBallMat = new THREE.MeshStandardMaterial({ 
      color: '#f8fafc', 
      roughness: 0.2,
      emissive: '#15803d',
      emissiveIntensity: 0.15 
    });
    const soccerBall = new THREE.Mesh(soccerBallGeo, soccerBallMat);
    soccerBall.position.set(-2, 0.55, 1);
    soccerBall.castShadow = true;
    footballGroup.add(soccerBall);

    scene.add(footballGroup);
    courtLocations.push({ 
      id: 'crt-football',
      x: -32, 
      z: -14, 
      title: '5v5 FIFA Approved Turf Pitch', 
      sport: 'football', 
      color: '#10b981', 
      zone: 'football',
      status: 'available',
      slotsOpen: 8
    });

    // -------------------------------------------------------------------------
    // SPORT 2: TENNIS (Centre Grand Slam Red Clay Court)
    // Position: x = 32, z = -14
    // -------------------------------------------------------------------------
    const tennisGroup = new THREE.Group();
    tennisGroup.position.set(32, 0.08, -14);

    const tennisCourtGeo = new THREE.PlaneGeometry(24, 12);
    const tennisCourtMat = new THREE.MeshStandardMaterial({ 
      color: '#9a3412', // Roland Garros Terracotta
      roughness: 0.85, 
      metalness: 0.1 
    });
    const tennisCourt = new THREE.Mesh(tennisCourtGeo, tennisCourtMat);
    tennisCourt.rotation.x = -Math.PI / 2;
    tennisCourt.receiveShadow = true;
    tennisGroup.add(tennisCourt);

    // Glowing Neon White/Orange Tennis Boundary Lines
    const tennisLinesGeo = new THREE.EdgesGeometry(tennisCourtGeo);
    const tennisLinesMat = new THREE.LineBasicMaterial({ color: '#fdba74', linewidth: 3 });
    const tennisLines = new THREE.LineSegments(tennisLinesGeo, tennisLinesMat);
    tennisLines.rotation.x = -Math.PI / 2;
    tennisLines.position.y = 0.03;
    tennisGroup.add(tennisLines);

    // Tennis Net with Sleek Tension Posts
    const tennisNetGeo = new THREE.PlaneGeometry(12, 1.15);
    const tennisNetMat = new THREE.MeshBasicMaterial({ 
      color: '#ffffff', 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.85 
    });
    const tennisNet = new THREE.Mesh(tennisNetGeo, tennisNetMat);
    tennisNet.rotation.y = Math.PI / 2;
    tennisNet.position.set(0, 0.58, 0);
    tennisGroup.add(tennisNet);

    const postGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.4);
    const postMat = new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.9, roughness: 0.2 });
    const post1 = new THREE.Mesh(postGeo, postMat);
    post1.position.set(0, 0.7, 6);
    const post2 = new THREE.Mesh(postGeo, postMat);
    post2.position.set(0, 0.7, -6);
    tennisGroup.add(post1, post2);

    // Optic Yellow Neon Tennis Ball
    const tBallGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const tBallMat = new THREE.MeshStandardMaterial({ 
      color: '#a3e635', 
      roughness: 0.3,
      emissive: '#84cc16',
      emissiveIntensity: 0.4
    });
    const tBall = new THREE.Mesh(tBallGeo, tBallMat);
    tBall.position.set(3, 0.3, -2);
    tBall.castShadow = true;
    tennisGroup.add(tBall);

    scene.add(tennisGroup);
    courtLocations.push({ 
      id: 'crt-tennis',
      x: 32, 
      z: -14, 
      title: 'Centre Red Clay & Grand Slam Court', 
      sport: 'tennis', 
      color: '#f97316', 
      zone: 'tennis',
      status: 'available',
      slotsOpen: 5
    });

    // -------------------------------------------------------------------------
    // SPORT 3: PADEL (Panoramic Glass Cage & Electric Blue Turf)
    // Position: x = 32, z = 14
    // -------------------------------------------------------------------------
    const padelGroup = new THREE.Group();
    padelGroup.position.set(32, 0.08, 14);

    const padelFloorGeo = new THREE.PlaneGeometry(20, 10);
    const padelFloorMat = new THREE.MeshStandardMaterial({ 
      color: '#1d4ed8', 
      roughness: 0.65 
    });
    const padelFloor = new THREE.Mesh(padelFloorGeo, padelFloorMat);
    padelFloor.rotation.x = -Math.PI / 2;
    padelFloor.receiveShadow = true;
    padelGroup.add(padelFloor);

    // Neon Cyan Padel Boundary Lines
    const padelLinesGeo = new THREE.EdgesGeometry(padelFloorGeo);
    const padelLinesMat = new THREE.LineBasicMaterial({ color: '#38bdf8', linewidth: 3 });
    const padelLines = new THREE.LineSegments(padelLinesGeo, padelLinesMat);
    padelLines.rotation.x = -Math.PI / 2;
    padelLines.position.y = 0.03;
    padelGroup.add(padelLines);

    // 12mm Crystal Clear Panoramic Glass Walls with Cyan Glowing Edges
    const glassWallGeo = new THREE.BoxGeometry(20, 3.8, 0.12);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#38bdf8',
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      transmission: 0.9,
      reflectivity: 0.95
    });
    const backWall1 = new THREE.Mesh(glassWallGeo, glassMat);
    backWall1.position.set(0, 1.9, 5);
    const backWall2 = new THREE.Mesh(glassWallGeo, glassMat);
    backWall2.position.set(0, 1.9, -5);
    padelGroup.add(backWall1, backWall2);

    // End Glass Walls
    const endWallGeo = new THREE.BoxGeometry(0.12, 3.8, 10);
    const endWall1 = new THREE.Mesh(endWallGeo, glassMat);
    endWall1.position.set(10, 1.9, 0);
    const endWall2 = new THREE.Mesh(endWallGeo, glassMat);
    endWall2.position.set(-10, 1.9, 0);
    padelGroup.add(endWall1, endWall2);

    // Padel Net
    const padelNetGeo = new THREE.PlaneGeometry(10, 0.95);
    const padelNetMat = new THREE.MeshBasicMaterial({ 
      color: '#ffffff', 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.8 
    });
    const padelNet = new THREE.Mesh(padelNetGeo, padelNetMat);
    padelNet.rotation.y = Math.PI / 2;
    padelNet.position.set(0, 0.5, 0);
    padelGroup.add(padelNet);

    scene.add(padelGroup);
    courtLocations.push({ 
      id: 'crt-padel',
      x: 32, 
      z: 14, 
      title: 'Panoramic Glass Padel Arena', 
      sport: 'padel', 
      color: '#06b6d4', 
      zone: 'padel',
      status: 'booked',
      slotsOpen: 0
    });

    // -------------------------------------------------------------------------
    // SPORT 4: CRICKET (Floodlit Box Pitch & Stumps)
    // Position: x = -32, z = 14
    // -------------------------------------------------------------------------
    const cricketGroup = new THREE.Group();
    cricketGroup.position.set(-32, 0.08, 14);

    const pitchGeo = new THREE.PlaneGeometry(24, 6);
    const pitchMat = new THREE.MeshStandardMaterial({ 
      color: '#854d0e', // Clay / Hard turf pitch
      roughness: 0.8 
    });
    const pitchMesh = new THREE.Mesh(pitchGeo, pitchMat);
    pitchMesh.rotation.x = -Math.PI / 2;
    pitchMesh.receiveShadow = true;
    cricketGroup.add(pitchMesh);

    // Glowing Neon Amber Crease Lines
    const creaseGeo = new THREE.EdgesGeometry(pitchGeo);
    const creaseMat = new THREE.LineBasicMaterial({ color: '#facc15', linewidth: 3 });
    const creaseLines = new THREE.LineSegments(creaseGeo, creaseMat);
    creaseLines.rotation.x = -Math.PI / 2;
    creaseLines.position.y = 0.03;
    cricketGroup.add(creaseLines);

    // Stumps & Bails with Glow
    for (let i = -1; i <= 1; i++) {
      const stumpGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.25);
      const stumpMat = new THREE.MeshStandardMaterial({ 
        color: '#fef08a', 
        roughness: 0.3,
        emissive: '#ca8a04',
        emissiveIntensity: 0.3 
      });
      const stump1 = new THREE.Mesh(stumpGeo, stumpMat);
      stump1.position.set(-11, 0.62, i * 0.45);
      const stump2 = new THREE.Mesh(stumpGeo, stumpMat);
      stump2.position.set(11, 0.62, i * 0.45);
      cricketGroup.add(stump1, stump2);
    }

    // Glowing Crimson Cricket Leather Ball
    const cricketBallGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const cricketBallMat = new THREE.MeshStandardMaterial({ 
      color: '#dc2626', 
      roughness: 0.2,
      emissive: '#b91c1c',
      emissiveIntensity: 0.4 
    });
    const cricketBall = new THREE.Mesh(cricketBallGeo, cricketBallMat);
    cricketBall.position.set(2, 0.3, 0.4);
    cricketBall.castShadow = true;
    cricketGroup.add(cricketBall);

    scene.add(cricketGroup);
    courtLocations.push({ 
      id: 'crt-cricket',
      x: -32, 
      z: 14, 
      title: 'Floodlit Astro Turf Box Cricket Pitch', 
      sport: 'cricket', 
      color: '#eab308', 
      zone: 'cricket',
      status: 'available',
      slotsOpen: 4
    });

    // -------------------------------------------------------------------------
    // SPORT 5: BADMINTON (Indoor BWF Certified Sprung Wood Court)
    // Position: x = -10, z = -24
    // -------------------------------------------------------------------------
    const badmintonGroup = new THREE.Group();
    badmintonGroup.position.set(-10, 0.08, -24);

    const badmCourtGeo = new THREE.PlaneGeometry(13.4, 6.1);
    const badmCourtMat = new THREE.MeshStandardMaterial({ 
      color: '#065f46', // BWF Dark Emerald
      roughness: 0.65 
    });
    const badmCourt = new THREE.Mesh(badmCourtGeo, badmCourtMat);
    badmCourt.rotation.x = -Math.PI / 2;
    badmCourt.receiveShadow = true;
    badmintonGroup.add(badmCourt);

    // Glowing Neon Emerald Boundary Lines
    const badmLinesGeo = new THREE.EdgesGeometry(badmCourtGeo);
    const badmLinesMat = new THREE.LineBasicMaterial({ color: '#34d399', linewidth: 3 });
    const badmLines = new THREE.LineSegments(badmLinesGeo, badmLinesMat);
    badmLines.rotation.x = -Math.PI / 2;
    badmLines.position.y = 0.03;
    badmintonGroup.add(badmLines);

    // Badminton Net
    const badmNetGeo = new THREE.PlaneGeometry(6.1, 0.88);
    const badmNetMat = new THREE.MeshBasicMaterial({ 
      color: '#ffffff', 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.85 
    });
    const badmNet = new THREE.Mesh(badmNetGeo, badmNetMat);
    badmNet.rotation.y = Math.PI / 2;
    badmNet.position.set(0, 1.1, 0);
    badmintonGroup.add(badmNet);

    // 3D Shuttlecock with Feather Glow
    const shuttleConeGeo = new THREE.ConeGeometry(0.2, 0.4, 12, 1, true);
    const shuttleConeMat = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
    const shuttleCone = new THREE.Mesh(shuttleConeGeo, shuttleConeMat);
    shuttleCone.rotation.x = Math.PI;
    shuttleCone.position.set(0, 1.35, 0.35);
    badmintonGroup.add(shuttleCone);

    scene.add(badmintonGroup);
    courtLocations.push({ 
      id: 'crt-badminton',
      x: -10, 
      z: -24, 
      title: 'Indoor BWF Sprung Wood Court', 
      sport: 'badminton', 
      color: '#10b981', 
      zone: 'badminton',
      status: 'available',
      slotsOpen: 6
    });

    // -------------------------------------------------------------------------
    // SPORT 6: ATHLETICS RUNNING TRACK (400m Tartan Oval + Light-Trail Motion)
    // -------------------------------------------------------------------------
    // 4 Lane Oval Tartan Lines
    for (let lane = 0; lane < 4; lane++) {
      const radiusX = 52 + lane * 1.6;
      const radiusZ = 34 + lane * 1.6;
      const trackCurve = new THREE.EllipseCurve(0, 0, radiusX, radiusZ, 0, 2 * Math.PI, false, 0);
      const trackPoints = trackCurve.getPoints(120);
      const trackGeo = new THREE.BufferGeometry().setFromPoints(trackPoints);
      const trackMat = new THREE.LineBasicMaterial({ 
        color: lane === 0 ? '#f43f5e' : '#fb7185', 
        linewidth: 2 
      });
      const laneLine = new THREE.Line(trackGeo, trackMat);
      laneLine.rotation.x = Math.PI / 2;
      laneLine.position.y = 0.05 + lane * 0.005;
      scene.add(laneLine);
    }

    // Light-Trail Motion Effect Particles (Running along track oval)
    const trailCount = 48;
    const trailPositions = new Float32Array(trailCount * 3);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMaterial = new THREE.PointsMaterial({
      color: '#f43f5e',
      size: 1.4,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const trailPoints = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trailPoints);

    courtLocations.push({ 
      id: 'crt-running',
      x: 0, 
      z: -36, 
      title: '400m Olympic Tartan Sprint Track', 
      sport: 'running', 
      color: '#f43f5e', 
      zone: 'running',
      status: 'available',
      slotsOpen: 12
    });

    // -------------------------------------------------------------------------
    // SPORT 7: VOLLEYBALL (Taraflex Hardwood & Washed River Sand)
    // Position: x = 10, z = 24
    // -------------------------------------------------------------------------
    const volleyballGroup = new THREE.Group();
    volleyballGroup.position.set(10, 0.08, 24);

    const vbCourtGeo = new THREE.PlaneGeometry(18, 9);
    const vbCourtMat = new THREE.MeshStandardMaterial({ 
      color: '#ea580c', // Bright competition orange
      roughness: 0.6 
    });
    const vbCourt = new THREE.Mesh(vbCourtGeo, vbCourtMat);
    vbCourt.rotation.x = -Math.PI / 2;
    vbCourt.receiveShadow = true;
    volleyballGroup.add(vbCourt);

    // Glowing Neon Yellow Boundary Lines
    const vbLinesGeo = new THREE.EdgesGeometry(vbCourtGeo);
    const vbLinesMat = new THREE.LineBasicMaterial({ color: '#fef08a', linewidth: 3 });
    const vbLines = new THREE.LineSegments(vbLinesGeo, vbLinesMat);
    vbLines.rotation.x = -Math.PI / 2;
    vbLines.position.y = 0.03;
    volleyballGroup.add(vbLines);

    // Volleyball Net & Posts
    const vbNetGeo = new THREE.PlaneGeometry(9, 1.2);
    const vbNetMat = new THREE.MeshBasicMaterial({ 
      color: '#ffffff', 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.85 
    });
    const vbNet = new THREE.Mesh(vbNetGeo, vbNetMat);
    vbNet.rotation.y = Math.PI / 2;
    vbNet.position.set(0, 1.4, 0);
    volleyballGroup.add(vbNet);

    const vbBallGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const vbBallMat = new THREE.MeshStandardMaterial({ 
      color: '#fbbf24', 
      roughness: 0.2,
      emissive: '#d97706',
      emissiveIntensity: 0.3
    });
    const vbBall = new THREE.Mesh(vbBallGeo, vbBallMat);
    vbBall.position.set(1, 1.8, 1);
    volleyballGroup.add(vbBall);

    scene.add(volleyballGroup);
    courtLocations.push({ 
      id: 'crt-volleyball',
      x: 10, 
      z: 24, 
      title: 'Indoor & Beach Volleyball Colosseum', 
      sport: 'volleyball', 
      color: '#ea580c', 
      zone: 'volleyball',
      status: 'available',
      slotsOpen: 6
    });

    // -------------------------------------------------------------------------
    // SPORT 8: POOL & SNOOKER (VIP 9ft Slate Tournament Lounge)
    // Position: x = -10, z = -6
    // -------------------------------------------------------------------------
    const poolGroup = new THREE.Group();
    poolGroup.position.set(-10, 0.08, -6);

    const poolTableGeo = new THREE.BoxGeometry(10, 1.1, 5.5);
    const poolTableMat = new THREE.MeshStandardMaterial({ 
      color: '#064e3b', // Simonis 860 Tournament Green Cloth
      roughness: 0.4 
    });
    const poolTable = new THREE.Mesh(poolTableGeo, poolTableMat);
    poolTable.position.y = 0.55;
    poolTable.castShadow = true;
    poolTable.receiveShadow = true;
    poolGroup.add(poolTable);

    // Mahogany Wood Cushion Border
    const borderGeo = new THREE.EdgesGeometry(poolTableGeo);
    const borderMat = new THREE.LineBasicMaterial({ color: '#78350f', linewidth: 3 });
    const borders = new THREE.LineSegments(borderGeo, borderMat);
    borders.position.y = 0.55;
    poolGroup.add(borders);

    // Overhead Canopy LED Lighting Box
    const canopyGeo = new THREE.BoxGeometry(8, 0.3, 3);
    const canopyMat = new THREE.MeshStandardMaterial({ 
      color: '#0f172a', 
      emissive: '#10b981', 
      emissiveIntensity: 0.6 
    });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 3.2, 0);
    poolGroup.add(canopy);

    scene.add(poolGroup);
    courtLocations.push({ 
      id: 'crt-pool',
      x: -10, 
      z: -6, 
      title: 'VIP 8-Ball & Snooker Lounge', 
      sport: 'pool', 
      color: '#10b981', 
      zone: 'pool',
      status: 'available',
      slotsOpen: 2
    });

    // =========================================================================
    // 6. VOLUMETRIC SCI-FI HUD COURT BEACONS (AVAILABLE / BOOKED / SELECTED)
    // =========================================================================
    const hudPins: { 
      group: THREE.Group; 
      item: CourtLocationMarker; 
      ring: THREE.Mesh;
      diamond: THREE.Mesh;
    }[] = [];

    courtLocations.forEach((c) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(c.x, 3.8, c.z);

      // Color based on status: Available = #10b981 (Green), Booked = #ef4444 (Red), Selected = #06b6d4 (Cyan)
      const beaconColor = c.status === 'booked' 
        ? '#ef4444' 
        : c.status === 'selected' 
          ? '#06b6d4' 
          : '#10b981';

      // Ground Radar Ring
      const beaconGeo = new THREE.RingGeometry(1.0, 1.35, 24);
      const beaconMat = new THREE.MeshBasicMaterial({ 
        color: beaconColor, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.rotation.x = Math.PI / 2;
      pinGroup.add(beacon);

      // Vertical Laser Light Stem
      const beamG = new THREE.CylinderGeometry(0.05, 0.05, 3.4);
      const beamM = new THREE.MeshBasicMaterial({ 
        color: beaconColor, 
        transparent: true, 
        opacity: 0.8 
      });
      const beamMesh = new THREE.Mesh(beamG, beamM);
      beamMesh.position.y = 1.7;
      pinGroup.add(beamMesh);

      // Floating Sci-Fi Diamond Crystal
      const diamondGeo = new THREE.OctahedronGeometry(0.48);
      const diamondMat = new THREE.MeshStandardMaterial({ 
        color: beaconColor, 
        roughness: 0.1, 
        metalness: 0.9,
        emissive: beaconColor,
        emissiveIntensity: 0.5
      });
      const diamond = new THREE.Mesh(diamondGeo, diamondMat);
      diamond.position.y = 3.4;
      pinGroup.add(diamond);

      scene.add(pinGroup);
      hudPins.push({ group: pinGroup, item: c, ring: beacon, diamond });
    });

    // =========================================================================
    // 7. ATMOSPHERIC PARTICLES SYSTEM (IRON MAN HUD DUST)
    // =========================================================================
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 160;
      particlePos[i + 1] = Math.random() * 32 + 1;
      particlePos[i + 2] = (Math.random() - 0.5) * 160;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: '#38bdf8',
      size: 0.85,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // =========================================================================
    // 8. INTERACTIVE RAYCASTER (CLICK TO FOCUS CAMERA & SELECT COURT)
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0].point;
        let closest: CourtLocationMarker | null = null;
        let minDist = Infinity;
        for (const c of courtLocations) {
          const d = Math.hypot(c.x - hit.x, c.z - hit.z);
          if (d < minDist) {
            minDist = d;
            closest = c;
          }
        }

        if (closest && minDist < 24) {
          const selected = closest as CourtLocationMarker;
          if (onSelectCourt) onSelectCourt(selected.title, selected.sport);
          if (onSelectZone) onSelectZone(selected.zone);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // =========================================================================
    // 9. RESIZE HANDLER
    // =========================================================================
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 10. ANIMATION LOOP & SMOOTH CAMERA INTERPOLATION
    // =========================================================================
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Continuous Hologram Rotations
      centerRing.rotation.z = elapsed * 0.18;
      innerCenterRing.rotation.z = -elapsed * 0.25;
      stadiumRim.rotation.z = -elapsed * 0.05;
      neonRing.rotation.z = -elapsed * 0.05;

      // Logo Core Float & Rotation
      shield.rotation.z = elapsed * 0.2;
      coreMesh.rotation.y = elapsed * 0.8;
      coreMesh.rotation.x = elapsed * 0.4;
      logoGroup.position.y = 16 + Math.sin(elapsed * 1.5) * 0.8;

      // Pulse Beacons & Diamond Spin
      hudPins.forEach((pin, i) => {
        const pulse = Math.sin(elapsed * 3.0 + i * 1.1);
        pin.group.position.y = 3.8 + pulse * 0.35;
        pin.diamond.rotation.y = elapsed * 1.5;
        // Ring scale pulse
        const s = 1 + pulse * 0.15;
        pin.ring.scale.set(s, s, s);
      });

      // Update Running Track Light-Trail Motion Effect
      const positions = trailGeometry.attributes.position.array as Float32Array;
      for (let t = 0; t < trailCount; t++) {
        const speed = 0.45;
        const offset = (t / trailCount) * Math.PI * 2;
        const angle = (elapsed * speed + offset) % (Math.PI * 2);
        const radiusX = 53.6;
        const radiusZ = 35.6;
        positions[t * 3] = Math.cos(angle) * radiusX;
        positions[t * 3 + 1] = 0.12;
        positions[t * 3 + 2] = Math.sin(angle) * radiusZ;
      }
      trailGeometry.attributes.position.needsUpdate = true;

      // Smooth Camera Lerping (Snappy, cinematic dampened interpolation)
      currentCamPos.current.lerp(targetCamPos.current, 0.12);
      currentCamLookAt.current.lerp(targetCamLookAt.current, 0.12);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentCamLookAt.current);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // ===========================================================================
  // 11. AUTOMATIC CAMERA FLIGHT TO CLICKED GAME / COURT OR SCROLL TIMELINE
  // ===========================================================================
  useEffect(() => {
    let pos = new THREE.Vector3(0, 52, 75);
    let look = new THREE.Vector3(0, 0, 0);

    // Exact court focus coordinates for all sports:
    switch (activeZone) {
      case 'football':
        // Sweeps directly down to FIFA 5v5 turf level (Pitch at x=-32, z=-14)
        pos.set(-32, 2.4, 1.5);
        look.set(-32, 0.9, -14);
        break;

      case 'tennis':
        // Centre Red Clay court baseline ground focus (Court at x=32, z=-14)
        pos.set(45, 2.2, -14);
        look.set(30, 0.9, -14);
        break;

      case 'padel':
        // Inside Panoramic Glass Padel arena on blue turf (Cage at x=32, z=14)
        pos.set(42, 2.2, 14);
        look.set(30, 0.9, 14);
        break;

      case 'cricket':
        // At the bowling crease facing floodlit stumps (Pitch at x=-32, z=14)
        pos.set(-18, 2.2, 14);
        look.set(-34, 0.9, 14);
        break;

      case 'badminton':
        // Service line on BWF sprung wood court (Court at x=-10, z=-24)
        pos.set(-10, 2.0, -14);
        look.set(-10, 0.9, -25);
        break;

      case 'volleyball':
        // Direct net-level beach and indoor court (Court at x=10, z=24)
        pos.set(20, 2.2, 24);
        look.set(8, 0.9, 24);
        break;

      case 'running':
        // Standing right on Lane 1 of 400m Tartan Track (Track at z=-36)
        pos.set(0, 2.0, -46);
        look.set(0, 0.9, -22);
        break;

      case 'pool':
        // VIP Snooker Lounge right at table level (Table at x=-10, z=-6)
        pos.set(-10, 2.0, 1.0);
        look.set(-10, 0.9, -6);
        break;

      case 'map':
        // 100% High-Altitude Interactive Overview Map
        pos.set(0, 78, 42);
        look.set(0, 0, 0);
        break;

      case 'hero':
      default:
        // Stadium Hero Overhead
        pos.set(0, 52, 75);
        look.set(0, 0, 0);
        break;
    }

    targetCamPos.current.copy(pos);
    targetCamLookAt.current.copy(look);
  }, [activeZone]);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};
