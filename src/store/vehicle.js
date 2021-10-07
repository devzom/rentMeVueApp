export default {
  namespaced: true,
  state: () => ({
    vehicleStorageKey: "vehicleToBook"
  }),
  mutations: {
    saveToStorage(state, payload) {
      localStorage.setItem(state.vehicleStorageKey, JSON.stringify(payload));
    },
    deleteData(state) {
      localStorage.removeItem(state.vehicleStorageKey);
    }
  },
  getters: {
    getStorageData(state) {
      return JSON.parse(localStorage.getItem(state.vehicleStorageKey)) || {};
    }
  },
  actions: {}
};
