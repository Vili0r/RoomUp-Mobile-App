import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./navigation";
import { AuthProvider } from "./context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StripeProvider } from "@stripe/stripe-react-native";

const STRIPE_KEY =
  "pk_test_51JEInnFCYmMIJlsoWcnZi9A24yO1IKvUUjYXqqQniYNwADuuSjngvb5jbKOKrvpGTPzqUV8yZDvghscdKJzxFOZw0032NuOXW8";

const queryClient = new QueryClient();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider publishableKey={STRIPE_KEY}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <SafeAreaProvider>
              <Navigation />
              <StatusBar />
            </SafeAreaProvider>
          </QueryClientProvider>
        </AuthProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
