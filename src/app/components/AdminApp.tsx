"use client";

// import { useEffect } from "react";
import { Admin, Resource, ShowGuesser, CustomRoutes } from "react-admin";
import dataProvider from "@/providers/dataProvider";
import authProvider from "@/providers/authProvider";
// import { GenericLoggerService } from "@/services/GenericLoggerService";
import { Route } from "react-router-dom";
import ListView from "@/components/posts/ListView";
import UpdateForm from "@/components/posts/UpdateForm";
import CreateForm from "@/components/posts/CreateForm";

const AdminApp = () => {
  // useEffect(() => {
  //   // Initialize logger
  //   const initializeLogger = async () => {
  //     const logger = GenericLoggerService.getInstance();
  //     const config = {
  //       region: process.env.AWS_REGION || "ap-southeast-1",
  //       logGroupName: process.env.AWS_LOG_GROUP_NAME || "default-log-group",
  //       logStreamName: process.env.AWS_LOG_STREAM_NAME || "default-log-stream",
  //       // TODO: implement config.ts for mapping hardcode & use from that file.
  //       ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  //         ? {
  //             credentials: {
  //               accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //               secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //             },
  //           }
  //         : {}),
  //     };
  //     console.log("Initializing logger with config:", config);

  //     try {
  //       await logger.initialize(config);
  //       console.log("Logger initialized successfully");
  //     } catch (error) {
  //       console.error("Failed to initialize logger:", error);
  //     }
  //   };

  //   initializeLogger();
  // }, []);

  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource
        name="posts"
        list={ListView}
        edit={UpdateForm}
        show={ShowGuesser}
        hasEdit
        hasShow
      />
      <CustomRoutes>
        <Route path="/posts/create" element={<CreateForm />} />
      </CustomRoutes>
    </Admin>
  );
};

export default AdminApp;
