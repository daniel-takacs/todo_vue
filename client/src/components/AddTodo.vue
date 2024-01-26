<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { defineEmits } from "vue";

const emit = defineEmits(["add"]);
const newTodoTitle = ref("");

const addNewTodo = async () => {
  if (newTodoTitle.value.trim()) {
    try {
      const response = await axios.post(
        `${process.env.VUE_APP_API_URL}/api/todos`,
        {
          title: newTodoTitle.value,
          completed: false,
        }
      );
      emit("add", response.data); // Emit the new todo item or a success message
      newTodoTitle.value = "";
    } catch (error) {
      console.error("Error adding todo:", error);
      // Handle error (e.g., show an error message)
    }
  }
};
</script>

<template>
  <div class="create-todo-container">
    <form @submit.prevent="addNewTodo">
      <input v-model="newTodoTitle" placeholder="Create a new todo..." />
    </form>
  </div>
</template>

<style>
.create-todo-container {
  position: absolute;
  bottom: 50px;
  left: 17%;

  input {
    padding: 10px 40px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
}
</style>
