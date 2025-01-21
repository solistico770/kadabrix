import kdb from "./kadabrix"
import { requestForToken } from "./firebase";
import eventBus from "./event";
import { useCartStore } from "./cartState";

eventBus.on("onAuthStateChange", async (session) => {

  if (!session?.user?.email ) return;

  const tokenID = await requestForToken();
  await kdb.run({
    module: "kadabrix_fcm",
    name: "register_token",
    data: { token: tokenID },
  });

});


