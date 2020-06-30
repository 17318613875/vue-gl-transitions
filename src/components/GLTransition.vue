<script lang="tsx">
import { Component, Vue, Prop, PropSync, Watch } from "vue-property-decorator";
import createTransition from "gl-transition";

type CreateTransition = ReturnType<typeof createTransition>;

@Component({})
export default class GlTransition extends Vue {
  @Prop() glContext!: WebGLRenderingContext;
  @Prop() from!: GLTextureLike;
  @Prop() to!: GLTextureLike;
  @Prop({ default: () => ({ glsl: "", defaultParams: {} }), type: Object })
  transition!: {
    glsl: string;
    name?: string;
    defaultParams?: { direction: [number, number] };
    paramsTypes?: { direction: "vec2" };
  };
  @PropSync("progress") progressSync!: number;
  @Prop({ default: 1, type: Number }) duration!: number;

  @Prop() width!: number;
  @Prop() height!: number;

  private Transition!: CreateTransition;
  public init() {
    const { glContext: gl, from, to, width, height, transition } = this;

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 4, 4, -1]), // see a-big-triangle
      gl.STATIC_DRAW
    );
    gl.viewport(0, 0, width, height);

    from.minFilter = gl.LINEAR;
    from.magFilter = gl.LINEAR;

    to.minFilter = gl.LINEAR;
    to.magFilter = gl.LINEAR;
    this.Transition = createTransition(gl, transition);
    this.loop();
  }

  @Watch("progress")
  onChangeProgressVal(val: number, oldVal: number) {
    if (val != oldVal) {
      if (val < 0) {
        this.dispose();
      } else if (val >= 100) {
        this.dispose();
      } else {
        this.loop();
      }
    }
  }

  @Watch("transition")
  onChangeTransitionVal() {
    this.init();
  }

  public loop() {
    const {
      from,
      to,
      width,
      height,
      progressSync,
      duration,
      Transition
    } = this;
    try {
      Transition.draw((progressSync / duration) % 1, from, to, width, height, {
        persp: 1.5,
        unzoom: 0.6
      });
    } catch (error) {
      this.init();
    }
  }

  public dispose() {
    this.Transition.dispose();
    this.cleanCanvas();
  }

  public cleanCanvas() {
    this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
  }

  created() {
    this.init();
  }

  protected render() {
    return;
  }
}

type GLTextureLike = {
  bind: (unit: number) => number;
  shape: [number, number];
  minFilter?: number;
  magFilter?: number;
};
</script>

<style></style>
