<script>
export default {
  props: {
    img: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
};
</script>
<template>
  <div class="whatsapp-message" id="card">
    <div class="message-content">
      <img v-if="img" :src="'/files' + img" alt="image" />
      <p
        v-html="description"
        @click="$emit('copy')"
        id="message"
        class="message cursor-pointer whitespace-pre-line"
      />
    </div>
  </div>
</template>
