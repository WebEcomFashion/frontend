import { createRoot } from "react-dom/client";
import AuthProvider from "react-auth-kit";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import App from "./App.tsx";
import "./index.css";
import { authStore } from "./redux/slices/authSlice.ts";
import { NotificationProvider } from "./context/NotificationContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationContainer } from "./components/Notification";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorBoundary } from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider store={authStore}>
        <Provider store={store}>
          <ThemeProvider>
            <NotificationProvider>
              <LoadingProvider>
                <App />
                <NotificationContainer />
                <LoadingSpinner />
              </LoadingProvider>
            </NotificationProvider>
          </ThemeProvider>
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
