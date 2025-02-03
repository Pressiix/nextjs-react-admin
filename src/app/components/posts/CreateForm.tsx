import { Typography } from "@mui/material";
import { Create, SimpleForm, TextInput } from "react-admin";

export default function CreateForm() {
  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Create a new post
      </Typography>
      <Create
        title="New post"
        resource="posts"
        redirect="list"
        mutationOptions={{ meta: { foo: "bar" } }}
      >
        <SimpleForm>
          <TextInput source="title" />
          <TextInput source="content" />
        </SimpleForm>
      </Create>
    </>
  );
}
