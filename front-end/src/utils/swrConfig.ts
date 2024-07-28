import { SWRConfiguration } from "swr"; // Importing SWRConfiguration type from swr

// Define the configuration for SWR (stale-while-revalidate)
const swrConfig: SWRConfiguration = {
  revalidateOnFocus: true, // Revalidate data when the window is focused
  revalidateIfStale: true, // Revalidate data if it is stale
  revalidateOnMount: true, // Revalidate data when the component mounts
  revalidateOnReconnect: true, // Revalidate data when the network reconnects
  refreshInterval: 1000, // Refresh data every 1000 milliseconds (1 second)
};

export default swrConfig; // Export the SWR configuration as default
