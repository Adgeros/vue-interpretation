import { track, trigger } from './effect'
import { OperationTypes } from './operations'
import { isObject } from '@vue/shared'
import { reactive } from './reactive'

export interface Ref<T> {
  _isRef: true
  value: UnwrapNestedRefs<T>
}

// TS 语法解释：T 的类型如果继承自 Ref 类型（也就是结构），那 UnwrapNestedRefs 的类型就是 T
// 反之是 UnwrapRef<T>
export type UnwrapNestedRefs<T> = T extends Ref<any> ? T : UnwrapRef<T>

const convert = (val: any): any => (isObject(val) ? reactive(val) : val)

export function ref<T>(raw: T): Ref<T> {
  raw = convert(raw)
  const v = {
    _isRef: true,
    get value() {
      track(v, OperationTypes.GET, '')
      return raw
    },
    set value(newVal) {
      raw = convert(newVal)
      trigger(v, OperationTypes.SET, '')
    }
  }
  return v as Ref<T>
}

export function isRef(v: any): v is Ref<any> {
  return v ? v._isRef === true : false
}

export function toRefs<T extends object>(
  object: T
): { [K in keyof T]: Ref<T[K]> } {
  const ret: any = {}
  for (const key in object) {
    ret[key] = toProxyRef(object, key)
  }
  return ret
}

function toProxyRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): Ref<T[K]> {
  const v = {
    _isRef: true,
    get value() {
      return object[key]
    },
    set value(newVal) {
      object[key] = newVal
    }
  }
  return v as Ref<T[K]>
}

type BailTypes =
  | Function
  | Map<any, any>
  | Set<any>
  | WeakMap<any, any>
  | WeakSet<any>

// Recursively unwraps nested value bindings.
// Unfortunately TS cannot do recursive types, but this should be enough for
// practical use cases...
// TS 语法解释：这里有点绕，其实就是三元运算符罢了，在判断是不是这个类型
// infer 的话用来推导类型。
// 举个简单例子：T extends (infer V) => void ? V : T，这句语法意思是如果 T 是这样类型的函数，我就把参数类型推导出来然后返回出去
export type UnwrapRef<T> = T extends Ref<infer V>
  ? UnwrapRef2<V>
  : T extends Array<infer V>
    ? Array<UnwrapRef2<V>>
    : T extends BailTypes
      ? T // bail out on types that shouldn't be unwrapped
      : T extends object ? { [K in keyof T]: UnwrapRef2<T[K]> } : T

type UnwrapRef2<T> = T extends Ref<infer V>
  ? UnwrapRef3<V>
  : T extends Array<infer V>
    ? Array<UnwrapRef3<V>>
    : T extends BailTypes
      ? T
      : T extends object ? { [K in keyof T]: UnwrapRef3<T[K]> } : T

type UnwrapRef3<T> = T extends Ref<infer V>
  ? UnwrapRef4<V>
  : T extends Array<infer V>
    ? Array<UnwrapRef4<V>>
    : T extends BailTypes
      ? T
      : T extends object ? { [K in keyof T]: UnwrapRef4<T[K]> } : T

type UnwrapRef4<T> = T extends Ref<infer V>
  ? UnwrapRef5<V>
  : T extends Array<infer V>
    ? Array<UnwrapRef5<V>>
    : T extends BailTypes
      ? T
      : T extends object ? { [K in keyof T]: UnwrapRef5<T[K]> } : T

type UnwrapRef5<T> = T extends Ref<infer V>
  ? UnwrapRef6<V>
  : T extends Array<infer V>
    ? Array<UnwrapRef6<V>>
    : T extends BailTypes
      ? T
      : T extends object ? { [K in keyof T]: UnwrapRef6<T[K]> } : T

type UnwrapRef6<T> = T extends Ref<infer V>
  ? UnwrapRef7<V>
  : T extends Array<infer V>
    ? Array<UnwrapRef7<V>>
    : T extends BailTypes
      ? T
      : T extends object ? { [K in keyof T]: UnwrapRef7<T[K]> } : T

type UnwrapRef7<T> = T extends Ref<infer V>
  ? UnwrapRef8<V>
  : T extends Array<infer V>
    ? Array<UnwrapRef8<V>>
    : T extends BailTypes
      ? T
      : T extends object ? { [K in keyof T]: UnwrapRef8<T[K]> } : T

type UnwrapRef8<T> = T extends Ref<infer V>
  ? UnwrapRef9<V>
  : T extends Array<infer V>
    ? Array<UnwrapRef9<V>>
    : T extends BailTypes
      ? T
      : T extends object ? { [K in keyof T]: UnwrapRef9<T[K]> } : T

type UnwrapRef9<T> = T extends Ref<infer V>
  ? UnwrapRef10<V>
  : T extends Array<infer V>
    ? Array<UnwrapRef10<V>>
    : T extends BailTypes
      ? T
      : T extends object ? { [K in keyof T]: UnwrapRef10<T[K]> } : T

type UnwrapRef10<T> = T extends Ref<infer V>
  ? V // stop recursion
  : T
