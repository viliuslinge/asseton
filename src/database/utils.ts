import { DATA_SNAPSHOT_REFRESH_INTERVAL } from "src/config";

export function isDataSnapshotRefreshRequired(createdAt: string): boolean {
  const prevTimestamp = new Date(createdAt).getTime();
  const currentTimestamp = new Date().getTime();

  return currentTimestamp - prevTimestamp >= DATA_SNAPSHOT_REFRESH_INTERVAL;
}
