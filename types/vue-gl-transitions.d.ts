import Vue from "vue";

declare function install(vue: typeof Vue): void;

declare class VueGlTransition extends Vue {}

declare const _default: {
  install: typeof install;
};

export { VueGlTransition };

export default _default;
