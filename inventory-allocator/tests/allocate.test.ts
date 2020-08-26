import { expect } from "chai";
import {
  insufficientInventory,
  allocateInventory,
} from "../src/InventoryAllocator";

describe("identifying insufficient inventory method", function () {
  it("nothing ordered", function () {
    let result = insufficientInventory([]);
    expect(result).equal(false);
  });

  it("order is zeroed out (sufficient inventory)", function () {
    let result = insufficientInventory([0, 0, 0]);
    expect(result).equal(false);
  });
});

export {};
