export default {
  data() {
    return {
      isLoading: true,
      isError: false,
      errors: []
    };
  },
  methods: {
    setLoading(state = true) {
      this.isLoading = state;
    },
    setError(state = true) {
      this.errors = [];
      this.isError = state;
    }
  }
};
