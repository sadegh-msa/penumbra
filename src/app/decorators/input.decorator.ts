/* eslint-disable @typescript-eslint/no-explicit-any */
export const inputField = '_inputAttributes';

export function Input(attribute?: string) {
  return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor) {
    if (descriptor) {
      descriptor.enumerable = true;
    }

    if (!target[inputField]) {
      target[inputField] = {};
    }

    target[inputField][attribute || propertyKey] = propertyKey;
  };
}
