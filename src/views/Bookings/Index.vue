<template>
  <v-layout>
    <v-card contextual-style="dark">
      <span slot="header">
        My Bookings
      </span>
      <div slot="body">
        <table
          v-if="!isLoading"
          class="table table-bordered table-hover"
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
              <th>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(booking) in bookings"
              :key="booking.id"
              :class="{'text-warning': !booking.end_at}"
            >
              <td>
                {{
                  booking | rentStatus
                }}
              </td>
              <td>
                {{
                  booking.vehicle.name
                }}
              </td>
              <td>
                {{
                  booking.start_at | formatDateTime
                }}
              </td>
              <td>
                {{
                  booking.end_at | formatDateTime
                }}
              </td>

              <td>
                {{
                  booking.vehicle.sharing_type | capitalize
                }}
              </td>
              <td>
                {{ booking | calculateRentPrice }}
              </td>
              <td>
                <router-link
                  :to="{ name: 'bookings.id', params:{ id: booking.id} }"
                >
                  <button class="btn btn-sm btn-outline-dark">
                    Details
                  </button>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>

        <Loading v-else>
          Loading your bookings...
        </Loading>
      </div>
    </v-card>
  </v-layout>
</template>

<script>
import VLayout from '@/layouts/Default.vue';
import VCard from '@/components/Card.vue';
import Loading from '@/components/Loading';

export default {
  name: 'BookingList',
  components: {
    Loading,
    VLayout,
    VCard,
  },
  data() {
    return {
      bookings: [],
      isLoading: true
    };
  },
  created() {
      this.fetchBookings();
  },
  methods: {
    async fetchBookings() {
      await axios.get('/bookings')
        .then((response => {
          this.bookings = response.data.data.reverse()
        }))
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
