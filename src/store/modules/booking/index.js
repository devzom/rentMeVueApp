export default {
  namespaced: true,
  state: () => ({
    statusType: [
      {
        status: 1,
        text: "During"
      },
      {
        status: 2,
        text: "Canceled"
      },
      {
        status: 3,
        text: "Finished"
      }
    ]
  }),
  mutations: {},
  getters: {
    statusText: state => statusId => {
      return (
        state.statusType.find(type => type.status === statusId)?.text || "Error"
      );
    }
  },
  actions: {}
};
