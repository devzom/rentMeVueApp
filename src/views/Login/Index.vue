<template>
  <layout-minimal>
    <card contextual-style="dark">
      <span slot="header">
        Login
      </span>
      <div slot="body">
        <form @submit.prevent="login">
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-envelope fa-fw" />
                </span>
              </div>
              <input
                v-model="user.email"
                type="email"
                placeholder="Email"
                class="form-control"
              >
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-lock fa-fw" />
                </span>
              </div>
              <input
                v-model="user.password"
                type="password"
                placeholder="Password"
                class="form-control"
              >
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-outline-primary">
              Login
            </button>
          </div>
        </form>
      </div>
      <div slot="footer">
        @RentME - Jakub Zomerfeld
      </div>
    </card>
  </layout-minimal>
</template>

<script>
import LayoutMinimal from '@/layouts/Minimal.vue';
import Card from '@/components/Card.vue';

export default {
  name: 'LoginIndex',
  components: {
    LayoutMinimal,
    Card,
  },

  data() {
    return {
      user: {
        email: 'user@example.com',
        password: 'rand0m2021',
      },
    };
  },

  methods: {
    login() {
      this.$store.dispatch('auth/login', this.user);
    },
  },
};
</script>
