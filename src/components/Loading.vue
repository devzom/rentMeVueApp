<template>
  <div
    class="d-flex justify-content-center mb-3"
  >
    <slot>Loading...</slot>
    <b-spinner label="Loading..." />
  </div>
</template>

<script>
export default {
  name: 'Loading'
};
</script>
