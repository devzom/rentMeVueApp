<template>
  <v-layout>
    <v-card contextual-style="dark">
      <div
        slot="header"
        class="d-flex justify-content-between align-items-center"
      >
        <div>
          Booking ID: {{ id }}
        </div>

        <router-link
          :to="{ name: 'bookings.index'}"
        >
          <button class="btn btn-sm btn-outline-light">
            Go back to bookings
          </button>
        </router-link>
      </div>
      <div slot="body">
        <div v-if="!isLoading">
          <table
            class="table table-bordered table-hover "
          >
            <thead class="thead-dark">
              <tr>
                <th>
                  Status
                </th>
                <th>
                  Vehicle name
                </th>
                <th>
                  Start time
                </th>
                <th>
                  End time
                </th>
                <th>
                  Sharing type
                </th>
                <th>
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {{
                    bookingData | rentStatus
                  }}
                </td>
                <td>
                  {{
                    bookingData.vehicle.name
                  }}
                </td>
                <td>
                  {{
                    bookingData.start_at | formatDateTime
                  }}
                </td>
                <td>
                  {{
                    bookingData.end_at | formatDateTime
                  }}
                </td>
                <td>
                  {{
                    bookingData.vehicle.sharing_type | capitalize
                  }}
                </td>
                <td>
                  {{ bookingData | calculateRentPrice }}
                </td>
              </tr>
            </tbody>
          </table>

          <div
            v-if="isActive"
            class="mb-3"
          >
            <h5 class="text-warning">
              Rent time has started
            </h5>
            <button
              class="btn btn-sm btn-outline-warning"
              @click="cancelBooking"
            >
              Cancel booking
            </button>
            <hr>
          </div>
        </div>

        <Loading v-else>
          Loading your booking details...
        </Loading>
      </div>
    </v-card>
  </v-layout>
</template>

<script>
import VLayout from '@/layouts/Default.vue';
import VCard from '@/components/Card.vue';
import StatesMixin from '@/mixins/states';
import Loading from '@/components/Loading';

export default {
  name: 'BookingId',
  components: {
    Loading,
    VLayout,
    VCard,
  },
  mixins: [
    StatesMixin
  ],
  props: {
    id: {
      type: [Number, String],
      default: null,
      required: true
    },
  },
  data() {
    return {
      bookingData: null,
    };
  },

  computed: {
    isActive() {
      // check if the booking is already running based on existing 'end_date==end_at'
      return !Boolean(this.bookingData?.end_at) && this.bookingData?.status === 1;
    }
  },
  created() {
    this.fetchBookingData();
  },

  methods: {
    async fetchBookingData() {
      await axios.get(`/bookings/${this.id}`)
        .then((response => {
          this.bookingData = response.data.data;
          this.setLoading(false);
        }))
        .catch(() => {
          this.setError();

          setTimeout(() => {
            this.$router.push({ name: 'bookings.index' });
          }, 1500);
        })
        .finally(() => {

        });
    },
    async cancelBooking() {

      this.$bvModal.msgBoxConfirm('Please confirm that you want to cancel this booking.', {
          title: 'Please confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Yes, delete',
          cancelTitle: 'No, cancel',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value) {
            this.setLoading();
            axios.delete(`/bookings/${this.id}`)
              .then(() => {
                this.$toasted.success(
                  'Booking has been stopped'
                );

                this.$router.push({ name: 'bookings.index' });
              })
              .catch((error) => {
                this.$toasted.error(
                  error.response.data.errors.status
                );

                setTimeout(() => {
                  this.$router.push('/bookings');
                }, 1500);
              })
              .finally(() => {
                this.setLoading(false);
              });
          }
        });
    },

    async stopBooking() {
      this.setLoading();

      await axios.delete(`/bookings/${this.id}`)
        .then(() => {
          this.$toasted.success(
            'Booking has been stopped'
          );

          setTimeout(() => {
            this.$router.push({ name: 'bookings.index' });
          }, 1500);
        })
        .catch((error) => {
          this.$toasted.error(
            error.response.data.errors.status
          );

          setTimeout(() => {
            this.$router.push('/bookings');
          }, 1500);
        })
        .finally(() => {
          this.setLoading(false);
        });
    }
  },
};
</script>
