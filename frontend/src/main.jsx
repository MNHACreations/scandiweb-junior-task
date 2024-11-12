import { StrictMode } from "react";
import config from '../../config.json'
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import Products from "./components/Products.jsx";
const inMemoryCache = new InMemoryCache();
const apolloClient = new ApolloClient({

    uri: (config.mode === "local") ? "http://localhost/graphql" : "http://mnhacreations.great-site.net/graphql",
          cache: inMemoryCache,
    })
const root = document.getElementById("root");
createRoot(root).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
        <App />
    </ApolloProvider>
  </StrictMode>,
);
