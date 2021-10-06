<template>
  <div class="container py-5 px-2">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <!-- Content will be placed here -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MinimalLayout',
};
</script>
