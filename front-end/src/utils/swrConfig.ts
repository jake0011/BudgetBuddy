import { SWRConfiguration } from "swr"; // Importing SWRConfiguration type from swr

// Define the configuration for SWR (stale-while-revalidate)
const swrConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateIfStale: true,
  revalidateOnMount: true,
  revalidateOnReconnect: true,
  refreshInterval: 1000,
};

export default swrConfig; // Export the SWR configuration as default
