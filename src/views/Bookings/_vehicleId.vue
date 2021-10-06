<template>
  <layout-minimal>
    <card contextual-style="dark">
      <div
        slot="header"
        class="d-flex justify-content-between align-items-center"
      >
        <div>
          Reserve vehicle: <strong> {{ vehicleData.name }}</strong>
        </div>
        <router-link
          :to="{ name: 'home.index'}"
        >
          <button class="btn btn-sm btn-outline-light">
            Go to homepage
          </button>
        </router-link>
      </div>
      <div slot="body">
        <div class="text-black-50">
          Pricing:
          <ul class="pl-0">
            <li>{{ vehicleData.price_list.price_per_minute | price }} / minute</li>
            <li>{{ vehicleData.price_list.price_per_hour | price }} / hour</li>
          </ul>
        </div>
        <hr>
        <h6 class="text-center">
          Available trip type: <strong> {{ sharingType }}</strong>
        </h6>
        <hr>
        <div
          v-if="sharingType === 'planned'"
        >
          Select datetime range for vehicle reservation.<br>
          It's allowed to reserve maximum period of 7 days.

          <div class="d-flex justify-content-center mb-4">
            <div>
              <p>Start time and date</p>
              <date-picker
                v-model="reservation.start"
                :disabled-date="notBeforeNowDate"
                :disabled-time="notBeforeNowTime"
                :minute-step="15"
                :show-second="false"
                type="datetime"
                value-type="timestamp"
              />
            </div>
          </div>
          <div class="d-flex justify-content-center">
            <div>
              <p>End time and date</p>
              <date-picker
                v-model="reservation.end"
                :default-value="reservation.end"
                :disabled-date="disabledBeforeTodayAndAfterAWeek"
                :disabled-time="notBeforeNowTime"
                :minute-step="15"
                :show-second="false"
                type="datetime"
                value-type="timestamp"
              />
            </div>
          </div>
        </div>

        <div
          v-if="!btnDisabled"
          class="row justify-content-center mt-3"
        >
          <button
            :disabled="btnDisabled"
            class="btn btn-success"
            @click="reserveVehicle"
          >
            Start
          </button>
        </div>
      </div>
    </card>
  </layout-minimal>
</template>

<script>
import LayoutMinimal from '@/layouts/Minimal.vue';
import Card from '@/components/Card.vue';

import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
  name: 'VehicleReservation',
  components: {
    LayoutMinimal,
    Card,
    DatePicker
  },
  props: {
    vehicle: {
      type: Object,
      default: () => {
      }
    },
  },
  data() {
    const now = new Date();
    const startTime = now.getTime();
    const endTime = now.setMinutes(now.getMinutes() + 15);

    const time = now.toTimeString()
      .slice(0, 8);

    return {
      vehicleData: {},
      reservation: {
        start: startTime,
        end: endTime,
      },
      limit: {
        start: {
          stateTime: null,
          stateDate: null,
          minTime: '',
          minDate: '',
          maxTime: '',
          maxDate: '',
        },
        end: {
          stateTime: null,
          stateDate: null,
          minTime: '',
          minDate: '',
          maxTime: '',
          maxDate: '',
        }
      },
      btnDisabled: false,
      maxDaysDuration: 7,
      show: true
    };
  },
  computed: {
    sharingType() {
      return this.vehicleData?.sharing_type;
    }
  },
  beforeRouteLeave(to, from, next) {
    localStorage.removeItem('vehicleToBook');
    next();
  },
  created() {
    this.vehicleData = this.vehicle?.id ? this.vehicle:this.$store.getters['vehicle/getStorageData'];
  },

  mounted() {
    if (this.sharingType === 'planned') {
      // this.btnDisabled=true
      this.setNow();
      this.setToday();
    }
  },
  methods: {
    reserveVehicle() {
      let reservationData = {
        'vehicle_id': this.vehicleData.id,
        'type': this.sharingType,
      };

      if (this.sharingType === 'planned') {
        const start_at = new Date(this.reservation.start).toISOString();
        const end_at = new Date(this.reservation.end).toISOString();

        reservationData = {
          ...reservationData,
          ...{
            start_at,
            end_at
          }
        };
      }

      this.sendReservation(reservationData);
    },
    async sendReservation(data) {
      await axios.post('/bookings', data)
        .then(({ data }) => {

          console.log(data);

          this.$toasted.success(
            'Reservation has been started'
          );

          localStorage.removeItem('vehicleToBook');
          this.$router.replace({ name: 'home.index' });
        })
        .catch(error => {
          this.$toasted.error(
            error.response.error.status
          );
        });
    },
    notBeforeNowDate(date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0));
    },
    notBeforeNowTime(date) {
      return date < new Date(new Date().getTime());
    },
    disabledBeforeTodayAndAfterAWeek(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date < today.getTime() || date > new Date(today.getTime() + 7 * 24 * 3600 * 1000);
    },
    setNow() {
      const now = new Date();
      // Grab the HH:mm:ss part of the time string
      const time = now.toTimeString()
        .slice(0, 8);

      this.reservation.startTime = this.limit.start.minTime = time;
    },
    clearTime() {
      this.reservation.startTime = '';
    },
    setToday() {
      const now = new Date();
      const dateNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      this.reservation.startDate = this.limit.start.minDate = dateNow;
    },

    startTimeFormatter(startTime) {
      console.log(startTime);

      if (startTime.value) {
        this.limit.start.stateTime = false;
      }
    },
    onReset(event) {
      event.preventDefault();
      // Reset our form values

      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  },
};
</script>
