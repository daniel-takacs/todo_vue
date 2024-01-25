<template>
  <div>
    <div>
      <input v-model="editableTitle" :disabled="!isEditing" />
      <button @click="isEditing ? saveChanges() : editTodo()">
        {{ isEditing ? "Save" : "Edit" }}
      </button>
      <button @click="deleteTodo">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from "vue";
import { Todo } from "../types/todo";
import axios from "axios"; // Make sure to install axios with `npm install axios`

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
  console.log("Deleting todo with id:", props.todo._id); // Add this line to check the id
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
</script>
