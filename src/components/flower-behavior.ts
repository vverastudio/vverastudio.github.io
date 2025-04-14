console.log('Initializing...');

function encroach(
  from: number,
  to: number,
  factorPerSecond: number,
  deltaSeconds: number
): number {
  const diff = to - from;
  const factor = factorPerSecond ** deltaSeconds;
  return from + diff * (1 - factor);
}

function createInteractiveFlower(elem: HTMLImageElement) {
  if (elem.dataset.initialized) {
    return;
  }

  elem.dataset.initialized = 'true';

  const MAX_ABS_ANG_VEL = 200;
  let angVelocity = -50;
  let angle = 0;
  let lastTime = Date.now();
  let lastMousePos: readonly [number, number] | undefined;

  function onMouseMove(event: MouseEvent) {
    const pos = [event.pageX, event.pageY] as const;
    if (lastMousePos === undefined) {
      lastMousePos = pos;
      return;
    }

    const diff = [pos[0] - lastMousePos[0], pos[1] - lastMousePos[1]];
    // const diffMag = Math.sqrt(diff[0] ** 2 + diff[1] ** 2);
    // console.log(diffMag);
    angVelocity -= diff[0] * 0.5;

    if (angVelocity > MAX_ABS_ANG_VEL) {
      angVelocity = MAX_ABS_ANG_VEL;
    }
    if (angVelocity < -MAX_ABS_ANG_VEL) {
      angVelocity = -MAX_ABS_ANG_VEL;
    }
    lastMousePos = pos;
  }

  function onBlur() {
    lastMousePos = undefined;
  }

  elem.addEventListener('mousemove', onMouseMove);
  elem.addEventListener('blur', onBlur);

  function frame() {
    const now = Date.now();
    const dt = (now - lastTime) * 0.001;
    lastTime = now;

    // Applying gravity
    angVelocity += -angle * 0.5;
    // Damping
    angVelocity = encroach(angVelocity, 0, 0.1, dt);

    // Applying velocity
    angle += angVelocity * dt;

    elem.style.setProperty('--flower-swing', `${angle}deg`);
    requestAnimationFrame(frame);
  }

  frame();
}


export function init() {
  for (const elem of document.querySelectorAll<HTMLImageElement>(
    '.interactive-flower'
  )) {
    createInteractiveFlower(elem);
  }
}