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
    statusText: state => payload => {
      const { status, end_at } = payload;

      if (end_at && new Date(end_at) < Date.now()) {
        return state.statusType[2].text;
      }

      return (
        state.statusType.find(type => type.status === status)?.text || "Error"
      );
    }
  },
  actions: {}
};
