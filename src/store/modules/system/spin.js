/*
 * loading
 */
import { defineStore } from 'pinia';

export const useSpinStore = defineStore({
  id: 'spin',
  state: () => ({
    loading: false,
  }),

  actions: {
    getSpin() {
      return document.querySelector('.ant-spin-nested-loading');
    },
    hide() {
      this.loading = false;
      setTimeout(() => {
        let spins = document.querySelector('.ant-spin-nested-loading');
        spins.style.zIndex = 999;
      }, 1000);
    },
    show() {
      this.loading = true;
      let spins = document.querySelector('.ant-spin-nested-loading');
      spins.style.zIndex = 1001;
    },
  },
});
