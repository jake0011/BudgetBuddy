import { SWRConfiguration } from "swr";

const swrConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateIfStale: true,
  revalidateOnMount: true,
  revalidateOnReconnect: true,
  refreshInterval: 1000,
};

export default swrConfig;
