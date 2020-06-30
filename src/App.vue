<template>
  <div id="app">
    <video ref="toVideo" loop src="/flower.mp4" controls></video>
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
    <input type="number" v-model="duration" />
    <input type="number" v-model="progress" />
    <select name id v-model="name">
      <option value="GridFlip">GridFlip</option>
      <option value="Directional">Directional</option>
      <option value="LinearBlur">LinearBlur</option>
      <option value="abc">abc</option>
    </select>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueGlTransition from "@/components/VueGlTransition.vue";

@Component({
  components: {
    VueGlTransition
  }
})
export default class App extends Vue {
  private debug = true;
  private pixelRatio = Number(
    (typeof window === "object" && window.devicePixelRatio) || 1
  );
  private name = "doorway";
  private duration = 5;
  private progress = 0;
  private from: string | HTMLVideoElement = "/logo.png";
  private to = "/logo.png";
  private width = 360;
  private height = 203;
  private canvas: HTMLCanvasElement | null = null;

  mounted() {
    this.canvas = this.$refs.glCanvas as HTMLCanvasElement;
    this.from = this.$refs.toVideo as HTMLVideoElement;
  }
}
</script>

<style></style>
