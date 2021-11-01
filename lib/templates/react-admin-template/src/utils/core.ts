/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function isPromise(obj: any): obj is Promise<any> {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof (obj as any).then === 'function';
}

export function typeOf(obj: any): string {
  return Object.prototype.toString.call(obj).replace(/\[object\s|]/g, '');
}

export function isPlainObject(obj: any): boolean {
  if (typeOf(obj) !== 'Object') {
    return false;
  }

  const ctor = obj.constructor;

  if (typeof ctor !== 'function') {
    return false;
  }

  const prot = ctor.prototype;

  if (typeOf(prot) !== 'Object') {
    return false;
  }

  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  return true;
}
