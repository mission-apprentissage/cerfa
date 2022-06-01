import { useQuery } from "react-query";
import { _get } from "../common/httpClient";

export const useLinkToPds = () => {
  const { data: linkToPds } = useQuery(
    "pdsLink",
    async () => {
      const data = await _get(`/api/v1/pds/getUrl`);
      return data.authorizationUrl;
    },
    { refetchOnWindowFocus: false }
  );
  return linkToPds;
};
