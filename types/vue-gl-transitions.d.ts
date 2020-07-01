import Vue from "vue";

declare class VueGlTransition extends Vue {
  install(vue: typeof Vue): void;
}

export default VueGlTransition;
