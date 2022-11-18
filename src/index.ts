import { api } from "./api";
import { API_PORT } from "./config";

api.listen(API_PORT, () => {
  console.log(`[HTTP_SERVER] listening on port ${API_PORT}`);
});
