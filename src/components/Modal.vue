<script>
export default {
  props: {
    type: {
      type: String,
      default: "card",
    },
  },
};
</script>
<template>
  <div
    class="min-w-screen h-screen py-12 overflow-y-auto animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
    id="modal-id"
  >
    <div
      @click="$emit('close')"
      class="fixed bg-black opacity-60 inset-0 z-0"
    ></div>
    <div
      :class="`w-full ${
        type === 'card' ? 'max-w-md' : 'max-w-sm'
      } p-6 relative mx-auto my-auto rounded-xl shadow-lg bg-gray-100 dark:bg-gray-700`"
    >
      <!--content-->
      <slot></slot>
    </div>
  </div>
</template>
