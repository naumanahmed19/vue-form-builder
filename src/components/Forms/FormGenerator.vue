<template>
  <Form
    v-slot="$form"
    @submit="handleSubmit"
    :initialValues="formData"
    :resolver="resolver"
  >
    <div
      v-for="(field, index) in computedFormFields"
      :key="index"
      class="grid grid-cols-2 gap-2 md:grid-cols-1 pt-3"
    >
      <label :for="field.name" class="mt-2">{{ field.label }}</label>
      <InputText
        v-if="
          field.type === 'text' || field.type === 'email' || field.type === 'password'
        "
        v-bind="field"
        v-model="formData[field.name]"
        @input="handleChange(field.name, $event.target.value)"
        :class="['w-full', field.class]"
      />
      <Textarea
        v-else-if="field.type === 'textarea'"
        v-bind="field"
        v-model="formData[field.name]"
        :class="['w-full', field.class]"
        @input="handleChange(field.name, $event.target.value)"
      ></Textarea>
      <Dropdown
        v-else-if="field.type === 'select'"
        v-bind="field"
        v-model="formData[field.name]"
        :optionLabel="'text'"
        :optionValue="'value'"
        :class="['w-full', field.class]"
        @change="handleChange(field.name, $event.value)"
      />
      <Checkbox
        v-else-if="field.type === 'checkbox'"
        v-bind="field"
        v-model="formData[field.name]"
        @change="handleChange(field.name, $event.checked)"
      />
      <RadioButton
        v-else-if="field.type === 'radio'"
        v-bind="field"
        v-model="formData[field.name]"
        @change="handleChange(field.name, $event.value)"
      />
      <InputNumber
        v-else-if="field.type === 'number'"
        v-bind="field"
        v-model="formData[field.name]"
        :class="['w-full', field.class]"
        @input="handleChange(field.name, $event.value)"
      />
      <Calendar
        v-else-if="field.type === 'date'"
        v-bind="field"
        v-model="formData[field.name]"
        :class="['w-full', field.class]"
        @change="handleChange(field.name, $event.value)"
      />
      <MultiSelect
        v-else-if="field.type === 'multiselect'"
        v-bind="field"
        v-model="formData[field.name]"
        :optionLabel="'text'"
        :optionValue="'value'"
        :class="['w-full', field.class]"
        @change="handleChange(field.name, $event.value)"
      />
      <Message
        v-if="$form[field.name]?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $form[field.name].error?.message }}</Message
      >
    </div>
    <div class="pt-3">
      <Button type="submit" label="Submit" />
    </div>
  </Form>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { defineProps, defineEmits } from "vue";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { Form } from "@primevue/forms";

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  beforeValidate: {
    type: Function,
    default: (schema) => schema,
  },
});

const emit = defineEmits(["submit"]);

// Initialize formData with default values for all fields Reactively rquired for condtional fields to work
const formData = reactive(
  props.fields.reduce((acc, field) => {
    acc[field.name] = props.initialValues[field.name] || "";
    return acc;
  }, {})
);

// // Watch for changes in the fields prop and update the formData
// it helps to how correct validations on dynamic fields
// watch(
//   () => formData,
//   (newValues) => {
//     Object.keys(newValues).forEach((key) => {
//       formData[key] = newValues[key];
//     });
//   },
//   { immediate: true, deep: true }
// );

// Compute the form fields based on the condition
const computedFormFields = computed(() => {
  return props.fields.filter((field) => {
    return !field.condition || field.condition(formData);
  });
});
// Create a resolver for the form using zodResolver
const resolver = ref();
// Function to update the resolver
function updateResolver(fields) {
  const schema = fields.reduce((acc, field) => {
    if (field.rules) {
      acc[field.name] = field.rules;
    } else {
      acc[field.name] = z.optional(z.any()); // Add optional fields with a default rule
    }
    return acc;
  }, {});

  const zobject = props.beforeValidate(z.object(schema));

  resolver.value = zodResolver(zobject);

  console.log("resolver", zobject);
}

// // Watch for changes in the fields prop and update the resolver
// watch(
//   () => props.fields,
//   (newFields) => {
//     const schema = newFields.reduce((acc, field) => {
//       if (field.rules) {
//         acc[field.name] = field.rules;
//       } else {
//         acc[field.name] = z.optional(z.any()); // Add optional fields with a default rule
//       }
//       return acc;
//     }, {});

//     const zobject = props.beforeValidate(z.object(schema));

//     resolver.value = zodResolver(zobject);

//     console.log("resolver", zobject);
//   },
//   { immediate: true, deep: true }
// );

// Watch for changes in the fields prop and update the resolver

// Reactive array to manage form fields
const formFieldsReactive = reactive([...props.fields]);

// Watch for changes in formFieldsReactive and update the resolver
// watch(
//   () => formFieldsReactive,
//   (newFields) => {
//     updateResolver(newFields);
//   },
//   { immediate: true, deep: true }
// );

// Watch for changes in formFieldsReactive and update formData
watch(
  () => props.fields,
  (newFields) => {
    newFields.forEach((field) => {
      if (!(field.name in formData)) {
        console.log("Adding field", field.name);
        formData[field.name] = props.initialValues[field.name] || "";
      }
    });
  },
  { immediate: true, deep: true }
);

// Watch for changes in formFieldsReactive and update the resolver
watch(
  () => props.fields,
  (newFields) => {
    updateResolver(newFields);
  },
  { immediate: true, deep: true }
);

// Handle change events for form fields
function handleChange(fieldName, value) {
  formData[fieldName] = value;
  const field = props.fields.find((f) => f.name === fieldName);
  if (field && field.onChange) {
    field.onChange(value, formData);
  }
}

function handleFormChange(values) {
  emit("update:values", values);
}

function handleSubmit(values) {
  console.log(values);
  emit("submit", values);
}
</script>

<style scoped>
/* Add your styles here */
</style>
