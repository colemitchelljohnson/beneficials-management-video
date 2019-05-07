import SceneManager from '../../components/SceneManager';

const ThreeEntryPoint = () => {
  const canvas = this.createCanvas(document, ThreeEntryPoint);
  const sceneManager = new SceneManager(canvas);

  const createCanvas = (document, ThreeEntryPoint) => {
    const canvas = document.createElement('canvas');
    ThreeEntryPoint.appendChild(canvas);
    return canvas;
  }
  const bindEventListeners = () => {
    window.onresize = resizeCanvas;
    resizeCanvas();
  }
  const resizeCanvas = () => {
    canvas.style.width = '100%';
    canvas.style.height= '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    sceneManager.onWindowResize();
  }
  const render = (time) => {
    requestAnimationFrame(render);
    sceneManager.update();
  }

  this.bindEventListeners();
  this.render();
}

export default ThreeEntryPoint;