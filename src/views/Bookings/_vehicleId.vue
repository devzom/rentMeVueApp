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
          <span>
            Select datetime range for vehicle reservation.<br>
            It's allowed to reserve maximum period of 7 days.
          </span>
          <hr>
          <div class="d-flex justify-content-center mb-4">
            <section>
              <date-picker
                v-model="datetimePickerValues"
                type="datetime"
                placeholder="Select datetime range"
                range
                :disabled-date="notBeforeNowDate"
                :disabled-time="notBeforeNowTime"
                :minute-step="15"
                :show-second="false"
                value-type="timestamp"
                :show-time-panel="showTimeRangePanel"
                @close="handleRangeClose"
                @change="timeFormat"
              >
                <template v-slot:footer>
                  <button
                    class="mx-btn mx-btn-text"
                    @click="toggleTimeRangePanel"
                  >
                    {{ showTimeRangePanel ? 'select date':'select time' }}
                  </button>
                </template>
              </date-picker>
            </section>
          </div>
        </div>
        <div
          class="row justify-content-center mt-3"
        >
          <button
            :disabled="!reservationAllowed"
            class="btn btn-success"
            @click="reserveVehicle"
          >
            Start
          </button>
        </div>
        <div
          v-if="isError"
          class="text-danger mt-3"
        >
          <ul>
            <li
              v-for="(error,index) in errors"
              :key="index"
            >
              {{ error }}
            </li>
          </ul>
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

import { dateDifferenceDays} from '@/utils/time'
import StatesMixin from '@/mixins/states';

export default {
  name: 'VehicleReservation',
  components: {
    LayoutMinimal,
    Card,
    DatePicker
  },
  mixins: [
    StatesMixin
  ],
  props: {
    vehicle: {
      type: Object,
      default: () => {
      }
    },
  },
  data() {
    return {
      vehicleData: {},
      datetimePickerValues: [],
      isValidPeriod: true,
      maxDaysDuration: 7,
      show: true,
      showTimePanel: false,
      showTimeRangePanel: false,
    };
  },
  computed: {
    sharingType() {
      return this.vehicleData?.sharing_type;
    },
    reservationAllowed() {
      return this.sharingType !== 'planned'? true : this.isValidPeriod;
    }
  },
  beforeRouteLeave(to, from, next) {
    localStorage.removeItem('vehicleToBook');
    next();
  },
  created() {
    this.vehicleData = this.vehicle?.id ? this.vehicle : this.$store.getters['vehicle/getStorageData'];
    if (this.sharingType === 'planned') {
      this.setNow();
    }
  },

  methods: {
    reserveVehicle() {
      this.setError(false)
      if (!this.isValidPeriod){
        this.$toasted.error(
          'Picked period of start and end datetime is invalid'
        );

        return
      }

      let reservationData = {
        'vehicle_id': this.vehicleData.id,
        'type': this.sharingType,
      };

      if (this.sharingType === 'planned') {

        function pad(number) {
          if (number < 10) {
            return '0' + number;
          }
          return number;
        }

        Date.prototype.toISOString = function () {
          return this.getUTCFullYear() +
            '-' + pad(this.getUTCMonth() + 1) +
            '-' + pad(this.getUTCDate()) +
            'T' + pad(this.getUTCHours()) +
            ':' + pad(this.getUTCMinutes()) +
            ':' + pad(this.getUTCSeconds()) +
            '+00:00'
        };

        const start_at = new Date(this.datetimePickerValues[0]).toISOString();
        const end_at = new Date(this.datetimePickerValues[1]).toISOString();


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
        .then(() => {
          this.$toasted.success(
            'Reservation has been started'
          );

          this.$store.commit('vehicle/deleteData')
          this.$router.replace({ name: 'home.index' });
        })
        .catch(error => {
          this.setError()

          const errorData = error.response.data

          this.$toasted.error(
            errorData.message
          );

          for (const errorDataKey in errorData.errors) {
            console.log(errorData.errors[errorDataKey]);
            this.errors.push(errorData.errors[errorDataKey][0])
          }
        });
    },
    notBeforeNowDate(date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0));
    },
    notBeforeNowTime(date) {
      return date < new Date(new Date().getTime());
    },
    setNow() {
      const now = new Date();
      const startTime = now.getTime();
      const endTime = now.setMinutes(now.getMinutes() + 60) // set default end time +1 from now
      this.datetimePickerValues= [startTime, endTime]

    },
  timeFormat(timestamps=[]){
      const start = timestamps[0]
      const end = timestamps[0]

    const daysDifference = dateDifferenceDays(start, end)
    this.isValidPeriod = daysDifference <= this.maxDaysDuration
  },

    toggleTimeRangePanel() {
      this.showTimeRangePanel = !this.showTimeRangePanel;
    },
    handleOpenChange() {
      this.showTimePanel = false;
    },
    handleRangeClose() {
      this.showTimeRangePanel = false;
    },
  },
};
</script>
