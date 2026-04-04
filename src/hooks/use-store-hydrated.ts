import { useSyncExternalStore } from "react";

interface PersistApiLike {
  hasHydrated: () => boolean;
  onHydrate: (listener: () => void) => () => void;
  onFinishHydration: (listener: () => void) => () => void;
}

export default function useStoreHydrated(persist: PersistApiLike) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsubscribeHydrate = persist.onHydrate(onStoreChange);
      const unsubscribeFinish = persist.onFinishHydration(onStoreChange);

      return () => {
        unsubscribeHydrate();
        unsubscribeFinish();
      };
    },
    () => persist.hasHydrated(),
    () => false
  );
}
