interface DefaultParams {
  [paramKey: string]: string;
}
interface ParamsTypes {
  direction?: string;
  amplitude?: string;
  speed?: string;
}
interface Transition {
  name: string;
  defaultParams?: DefaultParams;
  paramsTypes?: ParamsTypes;
  glsl?: string;
}

interface TransitionParams {
  [paramKey: string]: string;
}

interface GLTransitionI extends Transition {
  author: string;
  createdAt: string;
}

declare module "gl-transitions" {
  let transition: GLTransitionI[]
  export = transition
}
