const MIN_SAFE_INTEGER = -9007199254740991

const MAX_SAFE_INTEGER = 9007199254740991

const Number = u => typeof u === 'number' && u <= MAX_SAFE_INTEGER && u >= MIN_SAFE_INTEGER

const Integer = u => Number(u) && u === Math.floor(u)

const UnknownStruct = u => typeof u === 'object' && !(Nil(u) || UnknownList(u))

const string = u => typeof u === 'string'

const NonEmptyString = u => string(u) && u.length > 0

const Nil = u => u === null

const Undefined = u => u === void 0

const UnknownList = Array.isArray

const Func = u => typeof u === 'function'

module.exports = {
  MIN_SAFE_INTEGER,
  MAX_SAFE_INTEGER,
  String: string,
  Number,
  Integer,
  UnknownStruct,
  NonEmptyString,
  Nil,
  Undefined,
  Boolean: u => u === true || u === false,
  UnknownList,
  Func,
}
