import * as React from "react";
import {
  Datagrid,
  DateField,
  TextField,
  List,
  useResourceContext,
  FunctionField,
  SearchInput,
  TextInput,
} from "react-admin";
import { ListActions } from "../ListAction";
import { Typography } from "@mui/material";

const postFilters = [
  <SearchInput key="search" source="title" alwaysOn />,
  <TextInput key="title" label="Title" source="title" defaultValue="" />,
];

export default function ListView() {
  const resource = useResourceContext();
  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        {resource}
      </Typography>
      <List actions={<ListActions hasCreate />} filters={postFilters}>
        <>
          <Datagrid>
            <FunctionField
              source="id"
              sortable={true}
              label="Id"
              render={(record) => `${record.key}`}
            />
            <TextField source="title" />
            <TextField source="content" />
            <DateField source="createdAt" />
          </Datagrid>
        </>
      </List>
    </>
  );
}
