<script setup lang="ts">
import { ref, onMounted, computed, inject, onBeforeUnmount } from "vue";
import TodoItem from "./TodoItem.vue";
import axios from "axios";
import { Todo } from "../types/todo"; // Assuming you have a Todo interface
import AddTodo from "./AddTodo.vue";

const todos = ref<Todo[]>([]);
const itemsLeft = computed(() => todos.value.length);
const bgMobileLight = require("../assets/images/bg-mobile-light.jpg");
const bgMobileDark = require("../assets/images/bg-mobile-dark.jpg");
const bgDesktopLight = require("../assets/images/bg-desktop-light.jpg");
const bgDesktopDark = require("../assets/images/bg-desktop-dark.jpg");
const isDarkMode = inject("isDarkMode");
const toggleDarkMode = inject("toggleDarkMode");

onMounted(() => {
  fetchTodos();
  window.addEventListener("resize", updateWindowWidth);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("resize", updateWindowWidth);
});

const fetchTodos = async () => {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_URL}/api/todos`
    );
    todos.value = response.data;
    console.log("data", response.data);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

const handleDelete = (todoId: string) => {
  todos.value = todos.value.filter((todo) => todo._id !== todoId);
};

const handleUpdate = (updatedTodo: string) => {
  const index = todos.value.findIndex((t) => t._id === updatedTodo);
  if (index !== -1) {
    todos.value[index] = updatedTodo;
  }
};

const addTodo = () => {
  fetchTodos();
};

const handleResize = () => {
  isDarkMode.value = isDarkMode.value;
};
// Reactive window width
const windowWidth = ref(window.innerWidth);

// Update windowWidth on window resize
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

const headerBgImage = computed(() => {
  if (windowWidth.value >= 1024) {
    // Desktop
    return isDarkMode.value ? bgDesktopDark : bgDesktopLight;
  } else {
    // Mobile
    return isDarkMode.value ? bgMobileDark : bgMobileLight;
  }
});
</script>

<template>
  <div>
    <div class="header">
      <img :src="headerBgImage" alt="Header Image" />
    </div>
    <ul class="todo-list">
      <div class="header-container">
        <h1>Todo</h1>
        <div class="mode" @click="toggleDarkMode">
          <img
            :src="
              isDarkMode
                ? require('@/assets/images/icon-sun.svg')
                : require('@/assets/images/icon-moon.svg')
            "
            alt="Mode Image"
          />
        </div>
      </div>
      <AddTodo @add="addTodo" />
      <li v-for="todo in todos" :key="todo._id">
        <TodoItem
          :todo="todo"
          @onDelete="handleDelete"
          @onUpdate="handleUpdate"
        />
      </li>
      <div class="items-left">{{ itemsLeft }} items left</div>
    </ul>
  </div>
</template>
