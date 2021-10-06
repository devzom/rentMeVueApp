export default {
  data() {
    return {
      isLoading: true,
      isError: false
    };
  },
  methods: {
    setLoading(state = true) {
      this.isLoading = state;
    },
    setError(state = true) {
      this.isError = state;
    }
  }
};
