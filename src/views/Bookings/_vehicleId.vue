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

        <div>
          <h5>Available trip type:</h5>
          <b-tabs
            content-class="mt-3"
            fill
          >
            <b-tab
              v-if="sharingType === 'planned'"
              active
              class="p-2"
              title="Planned"
            >
              <div class="d-flex justify-content-center mb-4">
                <div>
                  <p>Start time and date</p>
                  <date-picker
                    v-model="reservation.start"
                    type="datetime"
                    :show-second="false"
                    :minute-step="15"
                    :disabled-date="notBeforeNowDate"
                    :disabled-time="notBeforeNowTime"
                    value-type="timestamp"
                  />
                </div>
              </div>
              <div class="d-flex justify-content-center">
                <div>
                  <p>End time and date</p>
                  <date-picker
                    v-model="reservation.end"
                    type="datetime"
                    :show-second="false"
                    :minute-step="15"
                    :default-value="reservation.end"
                    :disabled-date="disabledBeforeTodayAndAfterAWeek"
                    :disabled-time="notBeforeNowTime"
                    value-type="timestamp"
                  />
                </div>
              </div>

              <!--              <b-form-->
              <!--                v-if="show"-->
              <!--                @reset="onReset"-->
              <!--                @submit="reserveVehicle"-->
              <!--              >-->
              <!--                <div>-->
              <!--                  <strong>Start trip preferences</strong>-->
              <!--                  <b-form-datepicker-->
              <!--                    id="datepicker-invalid"-->
              <!--                    v-model="reservation.startDate"-->
              <!--                    :state="limit.start.stateDate"-->
              <!--                    class="mb-2"-->
              <!--                    size="sm"-->
              <!--                    :min="limit.start.minDate"-->
              <!--                    :max="limit.start.maxDate"-->
              <!--                  />-->
              <!--                  <b-form-timepicker-->
              <!--                    id="timepicker-start"-->
              <!--                    v-model="reservation.startTime"-->
              <!--                    :state="limit.start.stateTime"-->
              <!--                    class="mb-2"-->
              <!--                    size="sm"-->
              <!--                    @context="startTimeFormatter"-->
              <!--                  />-->


              <!--                  <hr>-->
              <!--                  <strong>End trip preferences</strong>-->
              <!--                  <b-form-datepicker-->
              <!--                    id="datepicker-valid"-->
              <!--                    v-model="reservation.endDate"-->
              <!--                    :state="limit.end.stateDate"-->
              <!--                    class="mb-2"-->
              <!--                    size="sm"-->
              <!--                    :min="limit.end.minDate"-->
              <!--                    :max="limit.end.maxDate"-->
              <!--                  />-->
              <!--                  <b-form-timepicker-->
              <!--                    id="timepicker-sm"-->
              <!--                    v-model="reservation.endTime"-->
              <!--                    :state="limit.end.stateTime"-->
              <!--                    class="mb-2"-->
              <!--                    size="sm"-->
              <!--                  />-->
              <!--                </div>-->

              <!--                <div class="row d-flex mt-3">-->
              <!--                  <button-->
              <!--                    :disabled="btnDisabled"-->
              <!--                    class="btn btn-success"-->
              <!--                  >-->
              <!--                    Reserve-->
              <!--                  </button>-->
              <!--                </div>-->
              <!--              </b-form>-->
            </b-tab>
            <b-tab
              v-if="sharingType === 'spontaneous'"
              class="text-center p-2"
              lazy
              title="Spontaneous"
            >
              <button
                class="btn btn-success"
                @click="reserveVehicle"
              >
                Start
              </button>
            </b-tab>
          </b-tabs>
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
  name: 'LoginIndex',
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
    const startTime = now.getTime()
    const endTime  = now.setMinutes(now.getMinutes() + 15)

    const time = now.toTimeString()
      .slice(0, 8);

    return {
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
      btnDisabled: true,
      maxDaysDuration: 7,
      show: true
    };
  },
  computed: {
    vehicleData() {
      return this.vehicle?.id ? this.vehicle:JSON.parse(localStorage.getItem('vehicleToBook')).vehicle;
    },
    sharingType() {
      return this.vehicleData?.sharing_type;
    }
  },

  beforeRouteLeave(to, from, next) {
    localStorage.removeItem('vehicleToBook');
    next();
  },
  mounted() {
    this.setNow();
    this.setToday();
  },
  methods: {
    reserveVehicle() {
      let reservationData = {
        'vehicle_id': this.vehicleData.id,
        'type': this.sharingType,
      };

      if (this.sharingType === 'planed') {
        const startDateTime = this.reservation.startTime
        const actualDateTime = new Date().toISOString();

        reservationData = {
          ...{
            'start_at': actualDateTime,
            'end_at': null
          }
        };
      }

      console.log(reservationData);

      this.sendReservation(reservationData);
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


    async sendReservation(data) {
      await axios.post('/bookings', data)
        .then(({ data }) => {

          this.$toasted.success(
            'Reservation has been started'
          )

          localStorage.removeItem('vehicleToBook');
          this.$router.replace({name: 'home.index'});
        }).catch(error =>{
          this.$toasted.error(
            error.response.data.message
          )
      });
    },
    setNow() {
      const now = new Date();
      // Grab the HH:mm:ss part of the time string
      const time = now.toTimeString()
        .slice(0, 8);

      this.reservation.startTime = this.limit.start.minTime = time
    },
    clearTime() {
      this.reservation.startTime = '';
    },
    setToday() {
      const now = new Date()
      const dateNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      this.reservation.startDate = this.limit.start.minDate=  dateNow
    },

    startTimeFormatter(startTime){
      console.log(startTime);

      if (startTime.value) {
        this.limit.start.stateTime = false
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
