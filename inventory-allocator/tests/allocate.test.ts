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

  it("singleton insufficient", function () {
    expect(insufficientInventory([1])).equal(true);
  });

  it("order is zeroed out (sufficient inventory)", function () {
    let result = insufficientInventory([0, 0, 0]);
    expect(result).equal(false);
  });

  it("order still has non-zero item (insufficient inventory)", function () {
    let result = insufficientInventory([0, 1, 0]);
    expect(result).equal(true);
  });
});

describe("provided test cases", function () {
  it("exact inventory match", function () {
    let result = allocateInventory({ apple: 1 }, [
      { name: "owd", inventory: { apple: 1 } },
    ]);
    let expected = [{ owd: { apple: 1 } }];

    // test if the *contents* are equivalent
    expect(result).to.deep.equal(expected);
  });

  it("not enough inventory", function () {
    let result = allocateInventory({ apple: 1 }, [
      { name: "owd", inventory: { apple: 0 } },
    ]);

    expect(result).to.deep.equal([]);
    expect(result).to.have.lengthOf(0, "non-empty output");
  });

  it("split item across warehouses", function () {
    let result = allocateInventory({ apple: 10 }, [
      { name: "owd", inventory: { apple: 5 } },
      { name: "dm", inventory: { apple: 5 } },
    ]);
    // note: I re-ordered the expected case.
    // Keeping it in provided order made more sense than speculating if
    // I was supposed to use a sort (ie alphabetical)
    let expected = [{ owd: { apple: 5 } }, { dm: { apple: 5 } }];

    expect(result).to.deep.equal(expected);
  });

  it("long example", function () {
    let result = allocateInventory({ apple: 5, banana: 5, orange: 5 }, [
      { name: "owd", inventory: { apple: 5, orange: 10 } },
      { name: "dm", inventory: { banana: 5, orange: 10 } },
    ]);
    let expected = [{ owd: { apple: 5, orange: 5 } }, { dm: { banana: 5 } }];

    expect(result).to.deep.equal(expected);
  });
});

export {};
