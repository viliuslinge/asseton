import { DATA_SNAPSHOT_REFRESH_INTERVAL } from "src/const";

export function isDataSnapshotRefreshRequired(createdAt: string): boolean {
  const prevTimestamp = new Date(createdAt).getTime();
  const currentTimestamp = new Date().getTime();

  return currentTimestamp - prevTimestamp >= DATA_SNAPSHOT_REFRESH_INTERVAL;
}
