# vue-gl-transitions

## install

```shell
yarn install vue-gl-transitions
```

### use

```tsx
...
import VueGlTransitions from 'vue-gl-transitions'

@Component({components: { 'vue-gl-transitions' : VueGlTransitions }})
export default DEMO extends Vue {
  private canvas: HTMLCanvasElement | null = null;
  private from: string | HTMLVideoElement | HTMLImageElement | ImageData = "/logo.png";
  private to: string | HTMLVideoElement | HTMLImageElement | ImageData = "/logo.png";

  mounted() {
    this.canvas = this.$refs.glCanvas as HTMLCanvasElement;
    this.from = this.$refs.toVideo as HTMLVideoElement;
  }

  protected render() {
    return (
      <canvas ref="glCanvas" :width="width * pixelRatio" :height="height * pixelRatio"></canvas>
      <VueGlTransition
      :canvas="canvas"
      :name="name"
      :from="from"
      :to="to"
      :progress.sync="progress"
      :duration="duration"
      :defaultParams="{ depth: 2, perspective: 0.4, reflection: 1 }"
      />
    )
  }
}

```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
