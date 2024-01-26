<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import TodoItem from "./TodoItem.vue";
import axios from "axios";
import { Todo } from "../types/todo"; // Assuming you have a Todo interface
import AddTodo from "./AddTodo.vue";

const todos = ref<Todo[]>([]);
const itemsLeft = computed(() => todos.value.length);

onMounted(() => {
  fetchTodos();
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
</script>

<template>
  <div>
    <div class="header">
      <h1>Todo</h1>
      <AddTodo @add="addTodo" />
      <img src="../assets/images/bg-mobile-light.jpg" alt="Header Image" />
    </div>
    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo._id">
        <TodoItem
          :todo="todo"
          @onDelete="handleDelete"
          @onUpdate="handleUpdate"
        />
      </li>
      <!-- Items left -->
      <div class="items-left">{{ itemsLeft }} items left</div>
    </ul>
  </div>
</template>

<style lang="scss">
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  margin: auto;
}

.header {
  display: flex;
  flex-direction: column;
  position: relative;
}

h1 {
  color: white;
  position: absolute;
  left: 40px;
  text-transform: uppercase;
}

.items-left {
  display: flex;
  align-items: center;
  justify-content: left;
  padding: 1em;
  margin: 1em;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--todo-item-color);
}
</style>
