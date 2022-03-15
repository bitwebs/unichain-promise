const test = require('tape')
const proxyquire = require('proxyquire').noCallThru()
const ram = require('random-access-memory')

const unichainPromise = require('..')
const { callbackMethods } = require('../methods')

function create (key, opts) {
  return toCallback(unichainPromise(ram, key, opts))
}

function unichain (...args) {
  return toCallback(unichainPromise(...args))
}

const callbackTested = {}
callbackMethods.forEach(method => {
  // ignore open since it's an alias of ready
  if (method === 'open') return
  callbackTested[method] = false
})

function toCallback (feed) {
  return new Proxy(feed, {
    get (target, propKey) {
      const value = Reflect.get(target, propKey)

      if (callbackMethods.includes(propKey)) {
        callbackTested[propKey] = true

        return (...args) => {
          if (typeof args[args.length - 1] === 'function') {
            const cb = args.pop()
            const p = value(...args)

            p.then(result => {
              // This functions returns multiple arguments
              if (['seek', 'rootHashes'].includes(propKey)) {
                return cb(null, ...result)
              }
              return cb(null, result)
            }).catch(err => {
              cb(err)
            })

            return unichainPromise.getValue(p)
          }
          return value(...args)
        }
      }
      return value
    }
  })
}

const tests = [
  'ack',
  'audit',
  'basic',
  'bitfield',
  'cache',
  'compat',
  'copy',
  'default-storage',
  'extensions',
  'get',
  'head',
  'replicate',
  'seek',
  'selections',
  'set-uploading-downloading',
  'stats',
  'streams',
  'timeouts',
  'tree-index',
  'update',
  'value-encoding'
]

// We convert the promise style into callbacks (again) to test against the original unichain test code, if the promises are ok, the callbacks should work fine.
tests.forEach(test => proxyquire(`unichain/test/${test}`, { './helpers/create': create, '../': unichain }))

test('all callback methods must be tested', async function (t) {
  t.plan(1)

  const result = Object.keys(callbackTested).reduce((prev, curr) => {
    return prev && callbackTested[curr]
  }, true)

  t.ok(result, `callback methods passed ${JSON.stringify(callbackTested)}`)
})
