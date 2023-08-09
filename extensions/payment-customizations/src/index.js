// @ts-check

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 * @typedef {import("../generated/api").MoveOperation} MoveOperation
 */

/**
 * @type {FunctionResult}
 */
const NO_CHANGES = {
  operations: [],
};

// The @shopify/shopify_function package will use the default export as your function entrypoint
export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
(input) => {
  // Check if paymentCustomization or metafield is null or undefined
  if (!input.paymentCustomization || !input.paymentCustomization.metafield) {
    return NO_CHANGES;
  }

  // Get the JSON value from the metafield
  const functionConfig = JSON.parse(input.paymentCustomization.metafield.value);

  // Find the payment method to move based on the value from the metafield
  const movePaymentMethod = input.paymentMethods.find((method) =>
    method.name.includes(functionConfig.methodToMove)
  );

  if (!movePaymentMethod) {
    return NO_CHANGES;
  }

  // Filter out the payment method that needs to be moved
  const otherPaymentMethods = input.paymentMethods.filter(
    (method) => method.id !== movePaymentMethod.id
  );

  // Create a new array with the specified method as the first element
  const reorderedPaymentMethods = [
    movePaymentMethod.id,
    ...otherPaymentMethods.map((method) => method.id),
  ];

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    operations: [
      {
        move: {
          paymentMethodId: movePaymentMethod.id,
          index: functionConfig.moveToIndex,
        },
      },
    ],
  };
};
