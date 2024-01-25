<template>
  <div>
    <h1>My To-Do List</h1>
    <ul>
      <li v-for="todo in todos" :key="todo._id">
        <TodoItem
          :todo="todo"
          @onDelete="handleDelete"
          @onUpdate="handleUpdate"
        />
      </li>
    </ul>
    <button @click="showAddTodoModal">Add New To-Do</button>
    <AddTodoModal :is-visible="isModalVisible" @close="isModalVisible = false" @add="addTodo" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TodoItem from "./TodoItem.vue";
import axios from "axios";
import { Todo } from "../types/todo"; // Assuming you have a Todo interface
import AddTodoModal from './AddTodoModal.vue'; 

const todos = ref<Todo[]>([]);

onMounted(() => {
  fetchTodos()
});

const fetchTodos = async () => {
  try {
    const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/todos`);
    todos.value = response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};
const isModalVisible = ref(false);
const addTodo = (title: string) => {
  // Logic to add a new todo
  // After adding, close the modal
  fetchTodos()
  isModalVisible.value = false;
};
const showAddTodoModal = () => {
  isModalVisible.value = true;
};



const handleDelete = (todoId: string) => {
  todos.value = todos.value.filter(todo => todo._id !== todoId);
};


const handleUpdate = (updatedTodo: string) => {
  const index = todos.value.findIndex(t => t._id === updatedTodo);
  if (index !== -1) {
    todos.value[index] = updatedTodo;
  }
};
</script>
