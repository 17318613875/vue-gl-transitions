import GLTransitions from "gl-transitions";
import createTexture from "gl-texture2d";
export type Texture = ReturnType<typeof createTexture>;
export type Path = string;
export type Source =
  | ImageData
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement;
export type Transitions = {
  name: string;
  glsl: string;
};
export type DefaultParams = {
  [key: string]: number | string;
};
type That = {
  progressSync: number;
  glContext: WebGLRenderingContext | void;
  GlFrom: Texture;
  GlTo: Texture;
  from: Source;
  to: Source;
  glSize: number[];
};
type ContCextAttributes = {
  alpha?: boolean;
  antialias?: boolean;
  depth?: boolean;
  failIfMajorPerformanceCaveat?: boolean;
  powerPreference?: "default" | "high-performance" | "low-power";
  premultipliedAlpha?: boolean;
  preserveDrawingBuffer?: boolean;
  stencil?: boolean;
};

/**
 * @description 设置跨域资源
 * @param src 资源路径
 * @param target HTMLVideoElement | HTMLImageElement
 */
export function SetCrossOrigin(
  src: string,
  target: HTMLVideoElement | HTMLImageElement
) {
  new URL(src, window.location.href).origin !== window.location.origin &&
    (target.crossOrigin = "anonymous");
}

/**
 * @description 获取transition
 * @param transitionName string transitions name
 */
export const GetTransition = (
  transitionName: string,
  defaultParams: DefaultParams
): Transitions => {
  const transition = GLTransitions.find(({ name }) => transitionName === name);
  if (transition) {
    transition.defaultParams &&
      Object.keys(transition.defaultParams).forEach((keyName) => {
        const val = defaultParams[keyName];
        val !== undefined &&
          transition.defaultParams &&
          (transition.defaultParams[keyName] = val);
      });
    return transition;
  } else {
    throw new Error(`未匹配到可用过渡模板：${transitionName}`);
  }
};

/**
 * @description 创建canvas 的上下文
 * @param canvas HTMLCanvasElement
 * @param opts 上下文属性
 */
export function GetContext(
  canvas: HTMLCanvasElement,
  opts?: ContCextAttributes
) {
  const opts_ = Object.assign(opts || {}, {
    powerPreference: "default",
  });
  return (
    canvas.getContext("webgl", opts_) ||
    canvas.getContext("webgl-experimental", opts_) ||
    canvas.getContext("experimental-webgl", opts_)
  );
}

/**
 * @description 通过地址加载图片
 * @param src 图片地址
 */
export const LoadImg = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    SetCrossOrigin(src, img);
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};
interface VideoR extends HTMLVideoElement {
  reqId: number;
  trackingCallBack: () => void;
}
function startTracking(ev: Event) {
  const video = ev.target as VideoR;
  if (video) {
    video.reqId = requestAnimationFrame(function play() {
      video.reqId = requestAnimationFrame(play);
      video.trackingCallBack();
    });
  }
}
function seekTrack(ev: Event) {
  const video = ev.target as VideoR;
  video && video.trackingCallBack();
}
function stopTracking(ev: Event) {
  const video = ev.target as VideoR;
  video && cancelAnimationFrame(video.reqId);
}

/**
 * @description 通过HTML Element 加载视频
 * @param video HTMLVideoElement
 */
export const LoadVideo = (
  video: HTMLVideoElement,
  that: That,
  keyName: "GlFrom" | "GlTo"
): Promise<HTMLVideoElement> => {
  const [width, height] = that.glSize;
  video.width = width;
  video.height = height;
  SetCrossOrigin(video.src, video);
  (video as VideoR).trackingCallBack = () => {
    that[keyName] = createTexture(
      that.glContext as WebGLRenderingContext,
      video
    );
    that.progressSync = video.currentTime;
  };
  return new Promise((resolve) => {
    video.removeEventListener("play", startTracking);
    video.addEventListener("play", startTracking);
    video.removeEventListener("pause", stopTracking);
    video.addEventListener("pause", stopTracking);
    video.removeEventListener("seeked", seekTrack);
    video.addEventListener("seeked", seekTrack);
    resolve(video);
  });
};

/**
 * @description 加载资源
 * @param source
 */
export async function LoadSource(
  this: That,
  keyName: "GlFrom" | "GlTo"
): Promise<Source> {
  const source = keyName === "GlFrom" ? this.from : this.to;
  let target!: Source;
  if (typeof source === "string") {
    if (/\.(jpg|png|jpeg)$/.test(source)) {
      target = (await LoadImg(source)) as HTMLImageElement;
    }
  } else {
    const tagName = (source as HTMLElement).tagName;
    switch (tagName) {
      case "VIDEO":
        target = await LoadVideo(source as HTMLVideoElement, this, keyName);
        break;
      case "IMG":
        target = source as HTMLImageElement;
        break;
      case "CANVAS":
        target = source as HTMLCanvasElement;
        break;
    }
  }
  return target;
}
