import { z } from 'zod'

const formFields = [
  {
    type: 'text',
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    maxlength: 20,
    rules: z.string().min(1, 'Username is required'),
    onChange: (value, formData) => {
      if (formData) {
        formData.initials = typeof value === 'string' ? value.substring(0, 2).toUpperCase() : ''
      }
    },
  },
  {
    type: 'text',
    name: 'initials',
    label: 'Initials',
    placeholder: 'Enter your initials',
    rules: z.string().min(1, 'Initials is required'),
  },
  {
    type: 'text',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
    //   rules: z.string().min(1, 'Initials is required'),
  },
  {
    type: 'text',
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter your last name',
    rules: z.string().min(1, 'Last Name is required'),
    refine: (data) => {
      if (!data.firstName) {
        return false
      }
      return true
    },
  },
  {
    type: 'email',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    rules: z.string().email('Invalid email'),
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    minlength: 6,
    rules: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .min(1, 'Password is required'),
  },
  {
    type: 'textarea',
    name: 'bio',
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    rows: 4,
    condition: (formData) => formData.gender === 'male',
    rules: z.string().min(1, 'Bio is required'),
  },
  {
    type: 'select',
    name: 'gender',
    label: 'Gender',
    options: [
      { value: 'male', text: 'Male' },
      { value: 'female', text: 'Female' },
      { value: 'other', text: 'Other' },
    ],
    placeholder: 'Select your gender',
    rules: z.string().min(1, 'Gender is required'),
  },
  { type: 'checkbox', name: 'subscribe', label: 'Subscribe to newsletter', value: true },
  { type: 'radio', name: 'newsletter', label: 'Receive Newsletter', value: 'yes' },
  {
    type: 'number',
    name: 'age',
    label: 'Age',
    placeholder: 'Enter your age',
    rules: z
      .number()
      .positive()
      .int()
      .refine((value) => value !== undefined, 'Age is required'),
  },
  {
    type: 'date',
    name: 'dob',
    label: 'Date of Birth',
    placeholder: 'Select your date of birth',
    rules: z.date().refine((value) => value !== undefined, 'Date of Birth is required'),
  },

  {
    type: 'multiselect',
    name: 'hobbies',
    label: 'Hobbies',
    options: [
      { value: 'reading', text: 'Reading' },
      { value: 'traveling', text: 'Traveling' },
      { value: 'sports', text: 'Sports' },
    ],
    placeholder: 'Select your hobbies',
    rules: z.array(z.string()).min(1, 'Select at least one hobby'),
  },
]

export default formFields
