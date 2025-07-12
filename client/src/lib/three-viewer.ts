import * as THREE from 'three';
import { Room } from '@shared/schema';

export function initThreeViewer(canvas: HTMLCanvasElement, rooms: Room[]) {
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x222222);

  // Create a simple panoramic room representation
  const geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1); // Inside-out sphere
  
  // Create materials for different rooms with gradient textures
  const createGradientTexture = (color1: string, color2: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 512;
    
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  const roomMaterials = [
    new THREE.MeshBasicMaterial({ map: createGradientTexture('#667eea', '#764ba2') }), // Living Room
    new THREE.MeshBasicMaterial({ map: createGradientTexture('#f093fb', '#f5576c') }), // Kitchen
    new THREE.MeshBasicMaterial({ map: createGradientTexture('#4facfe', '#00f2fe') }), // Bedroom
    new THREE.MeshBasicMaterial({ map: createGradientTexture('#43e97b', '#38f9d7') }), // Bathroom
  ];

  const mesh = new THREE.Mesh(geometry, roomMaterials[0]);
  scene.add(mesh);

  // Add some simple room elements
  const addRoomElements = () => {
    // Add a simple floor
    const floorGeometry = new THREE.PlaneGeometry(1000, 1000);
    const floorMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x404040, 
      transparent: true, 
      opacity: 0.3 
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -250;
    scene.add(floor);

    // Add some floating geometric shapes as decoration
    for (let i = 0; i < 5; i++) {
      const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
      const boxMaterial = new THREE.MeshBasicMaterial({ 
        color: Math.random() * 0xffffff,
        transparent: true,
        opacity: 0.6
      });
      const box = new THREE.Mesh(boxGeometry, boxMaterial);
      
      box.position.set(
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 400
      );
      
      box.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      scene.add(box);
    }
  };

  addRoomElements();

  // Camera controls
  let isMouseDown = false;
  let mouseX = 0;
  let mouseY = 0;
  let cameraRotationX = 0;
  let cameraRotationY = 0;

  const onMouseDown = (event: MouseEvent) => {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
    canvas.style.cursor = 'grabbing';
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isMouseDown) return;

    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;

    cameraRotationY -= deltaX * 0.005;
    cameraRotationX -= deltaY * 0.005;

    // Clamp vertical rotation
    cameraRotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraRotationX));

    camera.rotation.order = 'YXZ';
    camera.rotation.y = cameraRotationY;
    camera.rotation.x = cameraRotationX;

    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  const onMouseUp = () => {
    isMouseDown = false;
    canvas.style.cursor = 'grab';
  };

  // Touch controls for mobile
  let touchX = 0;
  let touchY = 0;

  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      touchX = event.touches[0].clientX;
      touchY = event.touches[0].clientY;
    }
  };

  const onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    if (event.touches.length === 1) {
      const deltaX = event.touches[0].clientX - touchX;
      const deltaY = event.touches[0].clientY - touchY;

      cameraRotationY -= deltaX * 0.005;
      cameraRotationX -= deltaY * 0.005;

      cameraRotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, cameraRotationX));

      camera.rotation.order = 'YXZ';
      camera.rotation.y = cameraRotationY;
      camera.rotation.x = cameraRotationX;

      touchX = event.touches[0].clientX;
      touchY = event.touches[0].clientY;
    }
  };

  // Add event listeners
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('touchstart', onTouchStart);
  canvas.addEventListener('touchmove', onTouchMove);

  // Resize handler
  const onResize = () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  };

  window.addEventListener('resize', onResize);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    
    // Gentle rotation animation when not interacting
    if (!isMouseDown) {
      cameraRotationY += 0.001;
      camera.rotation.y = cameraRotationY;
    }
    
    renderer.render(scene, camera);
  };

  animate();

  // Room switching function
  let currentRoomIndex = 0;
  const switchRoom = (roomIndex: number) => {
    if (roomIndex >= 0 && roomIndex < Math.min(roomMaterials.length, rooms.length)) {
      currentRoomIndex = roomIndex;
      mesh.material = roomMaterials[roomIndex % roomMaterials.length];
      
      // Add transition effect
      const originalOpacity = (mesh.material as THREE.MeshBasicMaterial).opacity || 1;
      (mesh.material as THREE.MeshBasicMaterial).transparent = true;
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0;
      
      const fadeIn = () => {
        const opacity = (mesh.material as THREE.MeshBasicMaterial).opacity;
        if (opacity < originalOpacity) {
          (mesh.material as THREE.MeshBasicMaterial).opacity += 0.05;
          requestAnimationFrame(fadeIn);
        }
      };
      
      setTimeout(fadeIn, 100);
    }
  };

  // Store switch function on canvas for external access
  (canvas as any).switchRoom = switchRoom;

  // Cleanup function
  return () => {
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('touchstart', onTouchStart);
    canvas.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('resize', onResize);
    
    scene.clear();
    renderer.dispose();
  };
}
