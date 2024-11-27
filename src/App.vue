<template>
  <div v-if="isLoading" class="loader">Loading...</div>
  <div class="flex p-3 wrapper" v-else>
    <div class="w-1/2 p-3">
      <button
        @click="addTextField"
        class="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Text Field
      </button>
      <FormGenerator
        :fields="formFieldsReactive"
        :initialValues="initialValues"
        @submit="handleFormSubmit"
      />
    </div>
    <div class="w-1/2 p-3">
      <pre class="whitespace-pre-wrap">{{ formData }}</pre>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { z } from "zod";
import FormGenerator from "@/components/Forms/FormGenerator.vue";
import formFields from "./formFields.js";

const formFieldsReactive = reactive([...formFields]);
const initialValues = reactive({});
const formData = reactive({});
const isLoading = ref(false);

function handleFormSubmit(form) {
  Object.assign(formData, form.values);
  console.log("Form submitted:", form.values);
}

function addTextField() {
  const newField = {
    type: "text",
    name: `dynamicField${formFieldsReactive.length + 1}`,
    label: `Dynamic Field ${formFieldsReactive.length + 1}`,
    placeholder: "Enter text",
    rules: z.string().min(1, "This field is required"),
  };
  formFieldsReactive.push(newField);
}

async function fetchData() {
  isLoading.value = true;
  // Simulate fetching data from a database
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
        bio: "This is a bio.",
        gender: "male",
        subscribe: true,
        newsletter: "yes",
        initials: "JD",
        age: 30,
        dob: new Date("1990-01-01"),
        hobbies: ["reading", "traveling"],
      });
    }, 1000);
  });
  isLoading.value = false;
  Object.assign(initialValues, data);
}

onMounted(() => {
  fetchData();
});
</script>
