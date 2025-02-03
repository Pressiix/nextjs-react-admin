import { AuthProvider as AuthProviderType, HttpError } from "react-admin";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../utils/LocalStorageUtils";
import GenericHttpClientService from "../services/GenericHttpClientService";
import { SignInResponse, User } from "../types/Authentication";
import axios from "axios";
import RbacService from "../services/rbacService";
import { GenericLoggerService } from "../services/GenericLoggerService";

const logger = GenericLoggerService.getInstance();

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */
export const AuthProvider: AuthProviderType = {
  login: async ({ username, password }) => {
    try {
      const httpClientService = await GenericHttpClientService.initInstance(
        axios.create({
          baseURL: import.meta.env.VITE_STRAPI_BASE_URL,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }),
      );
      const userCredential: SignInResponse = await httpClientService.post<any>(
        "/api/auth/local",
        JSON.stringify({ identifier: username, password }),
      );

      const currentUser: User = await httpClientService.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${userCredential.jwt}`,
        },
      });

      // Use Strapi JWT token for future API calls
      if (userCredential?.jwt) {
        setLocalStorageItem("user_jwt", userCredential.jwt);
      }

      if (currentUser) {
        const userInfo = {
          ...currentUser,
          fullName: currentUser.username,
          avatar:
            "https://e7.pngegg.com/pngimages/73/118/png-clipart-my-melody-hello-kitty-kuromi-sanrio-hello-miscellaneous-white-thumbnail.png",
        };
        // Log the login attempt
        await logger.info(
          `Login success for user: ${userInfo.username}`,
          userInfo,
        );
        setLocalStorageItem("user", JSON.stringify(userInfo));
        // TODO(@watcharaphonp): change to JWT way
        setLocalStorageItem("role", "admin");
        return Promise.resolve();
      }

      return Promise.reject(
        new HttpError("Unauthorized", 401, {
          message: "Invalid username or password",
        }),
      );
    } catch (error) {
      await logger.error("Login error:", { error: error });
      throw error;
    }
  },
  logout: () => {
    setLocalStorageItem("user", null); // Clear localStorage
    setLocalStorageItem("user_jwt", null);
    setLocalStorageItem("role", null);
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    getLocalStorageItem("user") ? Promise.resolve() : Promise.reject(),
  canAccess: (params) => {
    const user = getLocalStorageItem("user");
    const { action, resource } = params;
    if (!user || !resource || !action) {
      return Promise.resolve(false);
    }

    const role = getLocalStorageItem("role");
    const rbacService = new RbacService();

    return Promise.resolve(
      rbacService.hasPermission(role, `${action}_${resource}`),
    );
  },
  getIdentity: () => {
    const persistedUser = getLocalStorageItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    return Promise.resolve(user);
  },
};

export default AuthProvider;
