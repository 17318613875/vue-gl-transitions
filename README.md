# vue-gl-transitions

## Effect

![cube](https://camo.githubusercontent.com/c42ecc6197b0f51a106fb50723f9bc6d2e1f925c/687474703a2f2f692e696d6775722e636f6d2f74573331704a452e676966)
![crosswarp](https://camo.githubusercontent.com/7e34cd12d5a9afa94f470395b04b0914c978ce01/687474703a2f2f692e696d6775722e636f6d2f555a5a727775552e676966)
![flyeye](https://camo.githubusercontent.com/0456d4ed8753fbce027f1174dc8b22da548eeade/687474703a2f2f692e696d6775722e636f6d2f654974426a33582e676966)

See [gl-transitions](https://www.npmjs.com/package/gl-transitions).

## install

```shell
yarn add vue-gl-transitions
```

### use

```tsx
...
import VueGlTransition from "vue-gl-transitions";

type Source = ImageData | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
type Name = 
type DefaultParams = { [key: string]: mixed }

@Component({
  components: { VueGlTransition }
})
export default DEMO extends Vue {
  // 过渡绘制的画布
  private canvas: HTMLCanvasElement | null = null;
  // 是否打开 gl-transition 的 debug模式
  private debug = true;
  // gl-transitions 支持的过渡模板名称
  private name: Name = "doorway";
  // gl-transitions 修改过渡模板支持的参数
  private defaultParams = {}
  // 过渡时长
  private duration = 5;
  // 过渡进度 0 ~ duration
  private progress = 0;
  // 过渡 开始资源
  private from: Source = "";
  // 过渡 结束资源
  private to: Source = "/logo.png";
  private width = 360;
  private height = 203;
  private pixelRatio = Number(
    (typeof window === "object" && window.devicePixelRatio) || 1
  );

  get widthPR() {
    const { width, pixelRatio } = this;
    return width * pixelRatio;
  }

  get heightPR() {
    const { height, pixelRatio } = this;
    return height * pixelRatio;
  }

  mounted() {
    this.canvas = this.$refs.glCanvas as HTMLCanvasElement;
    this.from = this.$refs.toVideo as HTMLVideoElement;
  }

  protected render() {
    return (
      <canvas ref="glCanvas" :width=widthPR" :height="heightPR"></canvas>
      <VueGlTransition
        :canvas="canvas"
        :name="name"
        :from="from"
        :to="to"
        :progress.sync="progress"
        :duration="duration"
        :defaultParams="defaultParams"/>
    )
  }
}

```
