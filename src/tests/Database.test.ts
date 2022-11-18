import { DATA_SNAPSHOT_REFRESH_INTERVAL } from "src/const";
import { isDataSnapshotRefreshRequired } from "database";

it("Data requires refresh", () => {
  expect(
    isDataSnapshotRefreshRequired(
      new Date(
        new Date().getTime() - DATA_SNAPSHOT_REFRESH_INTERVAL
      ).toISOString()
    )
  ).toBeTruthy();
});

it("Data doesnt require refresh", () => {
  expect(isDataSnapshotRefreshRequired(new Date().toISOString())).toBeFalsy();
});
