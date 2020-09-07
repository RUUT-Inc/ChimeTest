/**
 * 配列内のオブジェクトのキーを再帰的にキャメルケースに変換する。
 */
export const mapKeysCamelCase = data => _mapKeysDeep(data, (_value, key) => _.upperFirst(_.camelCase(key)))

/**
 * 配列内のオブジェクトのキーを再帰的にスネークケースに変換する。
 */
export const mapKeysSnakeCase = data => _mapKeysDeep(data, (_value, key) => {
  /*
   * address1がaddress_1に変換されてしまう
   * snake_caseの仕様かわからんが、明らかに変換する必要のないものは変換しない
   */
  return /^[a-z0-9]+$/.test(key) ? key : _.snakeCase(key)
})

const _mapKeysDeep = (data, callback) => {
  if (_.isArray(data)) {
    return data.map(innerData => _mapKeysDeep(innerData, callback))
  } else if (_.isPlainObject(data)) {
    return _.mapValues(_.mapKeys(data, callback), val => _mapKeysDeep(val, callback))
  } else {
    return data
  }
}
