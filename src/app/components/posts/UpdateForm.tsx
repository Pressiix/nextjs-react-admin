import { Edit, SimpleForm, TextInput, DateInput, required } from "react-admin";

export default function UpdateForm() {
  return (
    <Edit title="Edit">
      <SimpleForm>
        <TextInput source="title" validate={required()} />
        <TextInput multiline source="content" validate={required()} />
      </SimpleForm>
    </Edit>
  );
}
