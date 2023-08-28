<script>
export default {
  props: {
    modelValue: {},
  },
};
</script>
<template>
  <div class="max-w-md mx-auto mt-8 mb-4">
    <div
      class="relative flex dark:bg-gray-800 items-center w-full h-12 px-2 rounded-full border border-gray-200/60 dark:border-gray-100/20 bg-white overflow-hidden"
    >
      <div class="grid place-items-center h-full w-12 text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 filter-arrow"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        class="h-full w-full mt-1 outline-none text-base dark:text-white dark:bg-gray-800"
        type="text"
        id="search"
        placeholder="بحث.."
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>
