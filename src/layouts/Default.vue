<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-5">
      <router-link
        :to="{ name: 'home.index' }"
        class="navbar-brand"
      >
        {{ appName }}
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
      >
        <span class="navbar-toggler-icon" />
      </button>

      <div
        :class="{ show : menuCollapsed}"
        class="collapse navbar-collapse w-100 "
      >
        <ul class="navbar-nav">
          <router-link
            :to="{ name: 'home.index' }"
            active-class="active"
            class="nav-item"
            tag="li"
          >
            <a class="nav-link">
              Vehicles list
            </a>
          </router-link>

          <router-link
            :to="{ name: 'bookings.index' }"
            active-class="active"
            class="nav-item"
            tag="li"
          >
            <a class="nav-link">
              Bookings
            </a>
          </router-link>
        </ul>
        <button
          class="btn btn-secondary navbar-text "
          style="margin-left: auto !important;"
          @click="logout"
        >
          Logout <i class="fa fa-sign-out" />
        </button>
      </div>
    </nav>

    <section class="container pt-4">
      <div class="row">
        <div class="col col-12">
          <!-- Content will be placed here -->
          <slot />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      menuCollapsed: false,
      appName: 'RentME'
    };
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
    },
    toggleMenu() {
      this.menuCollapsed = !this.menuCollapsed;
    },
  },
};
</script>
