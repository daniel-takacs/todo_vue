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
    await axios.put(
      `${process.env.VUE_APP_API_URL}/api/todos/${props.todo._id}`,
      updatedTodo
    );
    emit("onUpdate", updatedTodo);
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="todo-item">
    <label class="checkbox-container">
      <input
        type="checkbox"
        v-model="todo.completed"
        @click="toggleCompletion"
      />
      <span class="checkmark"></span>
    </label>
    <input
      v-model="editableTitle"
      @click="editTodo"
      @keyup.enter.prevent="saveChanges"
      @blur="saveChanges"
      :readonly="!isEditing"
      :class="{ completed: todo.completed, 'read-only': !isEditing }"
    />
    <img @click="deleteTodo" src="../assets/images/icon-cross.svg" />
  </div>
</template>
