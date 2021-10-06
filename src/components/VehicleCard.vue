<template>
  <div
    class="card m-2 col-12 col-md-5"
  >
    <div class="row">
      <div class="col-3 d-flex flex-column justify-content-center align-items-center p-2">
        <img
          alt="Vehicle image"
          src="img/logo.png"
        >

        <button
          class="btn btn-sm btn-outline-dark"
          @click="bookVehicle"
        >
          Book
        </button>
      </div>

      <div class="col-9">
        <div class="card-body px-0">
          <h6 class="card-title">
            Vehicle: {{ vehicle.name }}
          </h6>

          <div class="text-small text-black-50">
            Pricing:
            <ul class="pl-3">
              <li>{{ vehicle.price_list.price_per_minute | price }} / minute</li>
              <li>{{ vehicle.price_list.price_per_hour | price }} / hour</li>
            </ul>
          </div>

          <p class="card-text">
            <small class="text-muted">Available sharing type: <strong>{{
              vehicle.sharing_type |capitalize
            }}</strong></small>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VehicleCard',
  props: {
    vehicle: {
      type: Object,
      default: () => {
      },
      required: true
    }
  },

  methods: {
    bookVehicle() {
      this.saveVehicleToStorage(this.vehicle);
      this.$router.push({
        name: 'reservation-vehicle',
        params: {
          id: this.vehicle.id,
          vehicle: this.vehicle
        }
      });
    },
    saveVehicleToStorage(data) {
      localStorage.setItem('vehicleToBook', JSON.stringify({ vehicle: data }));
    }
  }

};
</script>
