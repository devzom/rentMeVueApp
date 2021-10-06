<template>
  <v-layout>
    <v-card contextual-style="dark">
      <div slot="body">
        <h5>Welcome <strong>{{ username | capitalize }}</strong></h5>
      </div>
    </v-card>


    <v-card contextual-style="dark">
      <div slot="header">
        <h6>Available vehicles</h6>
      </div>

      <div slot="body">
        <div v-if="filteredVehicles.length">
          <div class="col-3">
            <label
              for="vehiclesSelect"
              class="mr-sm-2"
            >Filter vehicles by sharing type</label>
            <select
              id="vehiclesSelect"
              v-model="sharingType"
              class="form-select  mr-sm-2"
            >
              <option
                v-for="(type, index) in typeOfSharing"
                :key="index"
                :value="type.value"
              >
                {{ type.text }}
              </option>
            </select>
          </div>

          <div class="row">
            <VehicleCard
              v-for="vehicle in filteredVehicles"
              :key="vehicle.id"
              :vehicle="vehicle"
            />
          </div>
        </div>
        <Loading v-else>
          Loading available vehicles...
        </Loading>
      </div>
    </v-card>
  </v-layout>
</template>

<script>
import VLayout from '@/layouts/Default.vue';
import VCard from '@/components/Card.vue';
import VehicleCard from '@/components/VehicleCard';
import Loading from '@/components/Loading';

export default {
  name: 'HomeIndex',

  components: {
    Loading,
    VehicleCard,
    VLayout,
    VCard,
  },
  data() {
    return {
      isLoading: true,
      vehicles: [],
      sharingType: null,
      typeOfSharing:[
        {
          value: null,
          text: 'All types'
        },
        { value: 'planned', text: 'Planned'},
        { value: 'spontaneous', text: 'Spontaneous'}
      ],
    };
  },

  computed: {
    username() {
      return this.$store.state.account.username;
    },
    filteredVehicles(){
      return !this.sharingType? this.vehicles
      : this.vehicles.filter(vehicle=> vehicle.sharing_type === this.sharingType)
    }
  },
  created() {
    this.fetchVehicles();
  },
  methods: {
    async fetchVehicles() {
      this.vehicles = await axios.get('/vehicles')
        .then((response => response.data.data))
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
};
</script>
