<template>
    <div v-if="isVisible" class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close">&times;</span>
        <h2>Add New To-Do</h2>
        <input v-model="newTodoTitle" placeholder="Enter new to-do" />
        <button @click="addNewTodo">Add</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  
  const emit = defineEmits(['add', 'close']);
  const props = defineProps({
    isVisible: Boolean
  });
  
  const newTodoTitle = ref('');
  
  const closeModal = () => {
    newTodoTitle.value = '';
    emit('close');
  };
  
  const addNewTodo = async () => {
    if (newTodoTitle.value.trim()) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/todos`, {
          title: newTodoTitle.value,
          completed: false
        });
        emit('add', response.data); // Emit the new todo item or a success message
        newTodoTitle.value = '';
        closeModal(); // Close the modal after adding
      } catch (error) {
        console.error('Error adding todo:', error);
        // Handle error (e.g., show an error message)
      }
    }
  };
  </script>
  
  <style>
  /* Add your modal CSS here */
  .modal { /* ... */ }
  .modal-content { /* ... */ }
  .close { /* ... */ }
  </style>
  