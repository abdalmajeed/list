<script>
export default {
  props: {
    id: {
      type: Number,
      default: null,
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "",
    },
  },
};
</script>
<template>
  <li
    @click="$emit('select', { id, title, description, img })"
    class="border-b border-gray-200/80 dark:border-gray-600/50 py-1 cursor-pointer"
  >
    <div
      class="py-2 hover:bg-gray-200/50 dark:hover:bg-gray-900/30 px-3 rounded-xl"
    >
      <div class="flex items-center space-x-4 gap-x-4">
        <div
          :class="`w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ${
            !img && 'bg-gray-200'
          }`"
        >
          <img
            v-if="img"
            class="w-full h-full"
            :src="'/files' + img"
            alt="image"
          />
        </div>
        <div class="flex-1 min-w-0">
          <h1
            v-html="title"
            class="text-lg font-medium text-gray-900 truncate dark:text-white"
          />
          <p
            v-html="description"
            class="text-xs w-full text-ellipsis text-gray-500 truncate dark:text-gray-400"
          />
        </div>
        <div
          class="inline-flex !mx-0 items-center text-base font-semibold text-gray-900 dark:text-white"
        >
          <img class="w-6 filter-arrow" src="../assets/arrow.svg" alt="arrow" />
        </div>
      </div>
    </div>
  </li>
</template>
