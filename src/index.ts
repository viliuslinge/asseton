import { router } from "./router";
import { API_PORT } from "./config";

router.listen(API_PORT, () => {
  console.log(`[HTTP_SERVER] listening on port ${API_PORT}`);
});
