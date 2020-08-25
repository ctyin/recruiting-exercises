"use strict";
exports.__esModule = true;
exports.allocateInventory = void 0;
function allocateInventory(orderedItems, warehouses) {
    var warehouseOutputs = [];
    warehouses.forEach(function (w) {
        var tempOutput = {};
        Object.entries(w.inventory).forEach(function (_a) {
            // Look at each item in the warehouse and checks if the order needs it
            // Going in sorted order so greedy approach tells us to take as many items at the current warehouse
            var itemInWarehouse = _a[0], amountInWarehouse = _a[1];
            if (amountInWarehouse > 0 &&
                Object.keys(orderedItems).indexOf(itemInWarehouse) !== -1) {
                var tempOrder = {};
                var amountNeeded = orderedItems[itemInWarehouse];
                if (amountInWarehouse > amountNeeded) {
                    tempOrder[itemInWarehouse] = amountNeeded;
                    orderedItems[itemInWarehouse] = 0;
                }
                else {
                    tempOrder[itemInWarehouse] = amountInWarehouse;
                    orderedItems[itemInWarehouse] -= amountInWarehouse;
                }
                tempOutput[w.name] = tempOrder;
            }
        });
        warehouseOutputs.push(tempOutput);
    });
    // Checks for remaining (non-zero) items in the order
    for (var i = 0; i < Object.values(orderedItems).length; i++) {
        if (Object.values(orderedItems)[i] > 0) {
            return [];
        }
    }
    return warehouseOutputs;
}
exports.allocateInventory = allocateInventory;
// { apple: 1 }, [{ name: owd, inventory: { apple: 0 } }]
var testOrder = { apple: 10 };
var testWarehouses = [
    { name: "owd", inventory: { apple: 5 } },
    { name: "dm", inventory: { apple: 5 } },
];
console.log(allocateInventory(testOrder, testWarehouses));
