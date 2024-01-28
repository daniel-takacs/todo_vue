<script setup lang="ts">
import '../global.scss';
import { ref, provide } from "vue";
import TodoList from "./components/TodoList.vue";

const isDarkMode = ref(false);

    const toggleDarkMode = (event: Event) => {
      isDarkMode.value = !isDarkMode.value;
    };

    provide('isDarkMode', isDarkMode);
    provide('toggleDarkMode', toggleDarkMode);

</script>

<template>
    <div :class="{ 'dark-mode': isDarkMode }">
      <TodoList />
    </div>
</template>

<style scoped lang="scss">

</style>
