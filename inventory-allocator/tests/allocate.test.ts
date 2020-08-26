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

describe("custom empty / singleton cases", function () {
  it("empty warehouse empty order", function () {
    let result = allocateInventory({}, []);
    expect(result).to.deep.equal([]);
  });

  it("empty order nonempty warehouse", function () {
    let result = allocateInventory({}, [
      { name: "warehouse1", inventory: { apple: 2, orange: 3 } },
    ]);

    expect(result).to.deep.equal([]);
  });

  it("empty warehouse array insufficient", function () {
    let result = allocateInventory({ apple: 1 }, []);
    expect(result).to.deep.equal([]);
  });
});

describe("custom more complex cases", function () {
  it("empty string for warehouse name", function () {
    let result = allocateInventory({ apple: 4 }, [
      { name: "", inventory: { apple: 2 } },
      { name: "ord", inventory: { apple: 2 } },
    ]);
    expect(result).to.deep.equal([{ "": { apple: 2 } }, { ord: { apple: 2 } }]);
  });

  it("split with duplicate warehouse names", function () {
    let result = allocateInventory({ apple: 4 }, [
      { name: "ord", inventory: { apple: 2 } },
      { name: "ord", inventory: { apple: 2 } },
    ]);
    expect(result).to.deep.equal([
      { ord: { apple: 2 } },
      { ord: { apple: 2 } },
    ]);
  });

  it("longer exact match", function () {
    let result = allocateInventory({ apple: 1, orange: 10 }, [
      { name: "warehouse1", inventory: { orange: 10 } },
      { name: "warehouse2", inventory: { apple: 2 } },
    ]);
    let expected = [
      { warehouse1: { orange: 10 } },
      { warehouse2: { apple: 1 } },
    ];

    expect(result).to.deep.equal(expected);
  });

  it("split unevenly between >2 warehouses", function () {
    let result = allocateInventory({ apple: 15 }, [
      { name: "warehouse1", inventory: { apple: 2, orange: 3 } },
      { name: "warehouse2", inventory: { apple: 5 } },
      { name: "warehouse3", inventory: { apple: 15 } },
    ]);
    let expected = [
      { warehouse1: { apple: 2 } },
      { warehouse2: { apple: 5 } },
      { warehouse3: { apple: 8 } },
    ];

    expect(result).to.deep.equal(expected);
  });

  it("maintains state after seeing irrelevant warehouses", function () {
    let result = allocateInventory({ apple: 10, grapes: 14 }, [
      { name: "warehouse1", inventory: { orange: 9, grapes: 14 } },
      { name: "warehouse1", inventory: { orange: 9 } },
      { name: "warehouse1", inventory: { orange: 9 } },
      { name: "warehouse1", inventory: { orange: 9 } },
      { name: "warehouse1", inventory: { apple: 10 } },
    ]);
    let expected = [
      { warehouse1: { grapes: 14 } },
      { warehouse1: { apple: 10 } },
    ];

    expect(result).to.deep.equal(expected);
  });
});

export {};
