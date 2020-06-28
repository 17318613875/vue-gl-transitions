type mixed = string | number | boolean | [number, number];
type TransitionObjectLike = {
  glsl: string;
  name?: string;
  defaultParams?: { [key: string]: mixed };
  paramsTypes?: { [key: string]: string };
};

type GLTextureLike = {
  bind: (unit: number) => number;
  shape: [number, number];
};

type Options = {
  resizeMode?: "cover" | "contain" | "stretch";
};

declare class CreateTransition {
  draw(
    progress: number,
    from: GLTextureLike,
    to: GLTextureLike,
    width: number,
    height: number,
    params: { [key: string]: number | boolean | GLTextureLike }
  ): void;

  // dispose and destory all objects created by the funciton call
  dispose(): void;
}

declare function createTransition(
  glContext: WebGLRenderingContext,
  transition: TransitionObjectLike,
  options?: Options
): CreateTransition;

declare module "gl-transition" {
  export = createTransition;
}
