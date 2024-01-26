<script setup lang="ts">
import { defineProps, ref } from "vue";
import { Todo } from "../types/todo";
import axios from "axios";

const props = defineProps<{
  todo: Todo;
}>();
const emit = defineEmits(["onDelete", "onUpdate"]);
const editableTitle = ref(props.todo.title);
const isEditing = ref(false);
const editTodo = () => {
  isEditing.value = true;
};
const deleteTodo = async () => {
  console.log("Deleting todo with id:", props.todo._id);
  if (props.todo._id === undefined) {
    console.error("Todo ID is undefined");
    return;
  }

  try {
    await axios.delete(
      `${process.env.VUE_APP_API_URL}/api/todos/${props.todo._id}`
    );
    emit("onDelete", props.todo._id);
  } catch (error) {
    console.error("Error deleting todo", error);
  }
};
const saveChanges = async () => {
  console.log("Attempting to save changes");
  try {
    const updatedTodo = {
      ...props.todo,
      title: editableTitle.value,
    };
    await axios.put(
      `${process.env.VUE_APP_API_URL}/api/todos/${props.todo._id}`,
      updatedTodo
    );
    emit("onUpdate", updatedTodo);
    isEditing.value = false;
  } catch (error) {
    console.error("Error updating todo", error);
  }
};

const toggleCompletion = async () => {
  // Update the completion status on the server
  try {
    const updatedTodo = { ...props.todo, completed: !props.todo.completed };
    await axios.put(`${process.env.VUE_APP_API_URL}/api/todos/${props.todo._id}`, updatedTodo);
    emit("onUpdate", updatedTodo);
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="todo-item">
    <label class="checkbox-container">
      <input type="checkbox" v-model="todo.completed" @click="toggleCompletion" />
      <span class="checkmark"></span>
    </label>
    <!-- <label><input type="checkbox" v-model="todo.completed" @change="toggleCompletion" /></label> -->
    <input
      v-model="editableTitle"
      @click="editTodo"
      @keyup.enter.prevent="saveChanges"
      @blur="saveChanges"
      :readonly="!isEditing"
      :class="{ 'completed': todo.completed, 'read-only': !isEditing }"
    />
    <img @click="deleteTodo" src="../assets/images/icon-cross.svg" />
  </div>
</template>

<style>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
  margin: 1em;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: var(--todo-item-color);

  input {
    border: none;
    width: 120%;
    padding: 10px;
  }

  img {
    margin-left: 2em;
  }
}
.todo-item input.completed {
  text-decoration: line-through;
}

.checkbox-container {
  display: flex; /* Use flexbox */
  align-items: center; /* Vertically center the children */
  position: relative;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 25px;
  width: 25px;
  background-color: #FAFAFA; /* Light background color */
  border-radius: 50%; /* Make it circular */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Add some shadow */
  border: 1px solid #BDBDBD; /* Add a darker border */
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #3A7CFF; /* Color of the header image */
  background-image: url('../assets/images/icon-check.svg');
  background-repeat: no-repeat;
  background-position: center;
}
</style>
