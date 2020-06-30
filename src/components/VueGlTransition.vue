<script lang="tsx">
/**
 * @description
 */
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import GLTransition from "./GLTransition.vue";
import createTexture from "gl-texture2d";
import {
  GetContext,
  GetTransition,
  LoadSource,
  Transitions,
  Source,
  Texture,
  DefaultParams
} from "./util";

@Component({
  components: { "gl-transition": GLTransition }
})
export default class VueGlTransition extends Vue {
  @Prop() canvas!: HTMLCanvasElement;
  @Prop({ default: "SimpleZoom", type: String }) name!: string;
  @Prop() from!: Source;
  @Prop() to!: Source;
  @PropSync("progress") progressSync!: number;
  @Prop() duration!: number;
  @Prop() defaultParams!: DefaultParams;

  get transition(): Transitions {
    return GetTransition(this.name, this.defaultParams);
  }

  get glContext(): WebGLRenderingContext | void {
    const { canvas, debug, webglContextAttributes } = this;
    const glContext =
      canvas &&
      GetContext(
        canvas,
        debug
          ? { ...webglContextAttributes, preserveDrawingBuffer: true }
          : webglContextAttributes
      );
    if (glContext) {
      this.initLoadSource(glContext as WebGLRenderingContext);
      return glContext as WebGLRenderingContext;
    }
    return void 0;
  }

  get glSize() {
    const { canvas } = this;
    return (canvas && [canvas.width, canvas.height]) || [0, 0];
  }

  /**
   * 默认参数
   */
  @Prop({ default: false, type: Boolean }) debug!: boolean;
  @Prop({ default: () => ({}), type: Object })
  webglContextAttributes!: WebGLContextAttributes;

  /**
   * 功能参数
   */
  private loadedSourceFlag = false;
  private GlFrom!: Texture;
  private GlTo!: Texture;

  /**
   * 功能函数
   */
  public initLoadSource(glContext?: WebGLRenderingContext) {
    this.loadedSourceFlag = false;
    const glContext_ = glContext || this.glContext;
    glContext_ &&
      Promise.all([
        LoadSource(this.from, this, "GlFrom"),
        LoadSource(this.to, this, "GlTo")
      ]).then(([from, to]) => {
        this.GlFrom = createTexture(glContext_, from);
        this.GlTo = createTexture(glContext_, to);
        this.loadedSourceFlag = true;
      });
  }

  /**
   * 生命周期
   */
  created() {
    this.canvas && this.initLoadSource();
  }

  protected render() {
    const {
      loadedSourceFlag,
      glContext,
      GlFrom,
      GlTo,
      progressSync,
      transition,
      duration,
      glSize: [width, height]
    } = this;
    return (
      loadedSourceFlag &&
      transition.glsl && (
        <gl-transition
          glContext={glContext}
          from={GlFrom}
          to={GlTo}
          progress={progressSync}
          transition={transition}
          duration={duration}
          width={width}
          height={height}
        />
      )
    );
  }
}
</script>

<style></style>
