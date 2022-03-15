# unichain-promise

> An async/await based wrapper for [unichain](https://github.com/bitwebs/unichain) (v9+)

## <a name="install"></a> Install

```
$ npm install @web4/unichain-promise
```

## <a name="usage"></a> Usage

```javascript
const unichain = require('@web4/unichain-promise')

;(async () => {
  const feed = unichain('./my-first-dataset', {valueEncoding: 'utf-8'})

  await feed.append('hello')
  await feed.append('world')

  console.log(await feed.get(0)) // prints hello
  console.log(await feed.get(1)) // prints world
})
```

### Differences with Unichain

Some methods like `get` and `download` not only use callbacks but also returns a value directly.

```javascript
const id = feed.get(0, (err, data) => {
  console.log(data)
})
```

Since our methods return promises what you need to do to get the internal value is to use our function helper `getValue`.

```javascript
const { getValue } = require('unichain-promise')

const promise = feed.get(0)
const id = getValue(promise)
promise.then(data => console.log(data))
```

`unichain-promise` already detects the internal value so you don't need to use `getValue` in that case.

```javascript
const promise = feed.get(0)
feed.cancel(promise)
promise.catch(err => {
  console.log('was canceled')
})
```

## <a name="issues"></a> Issues

:bug: If you found an issue we encourage you to report it on [github](https://github.com/bitwebs/unichain-promise/issues). Please specify your OS and the actions to reproduce it.

## <a name="contribute"></a> Contributing

:busts_in_silhouette: Ideas and contributions to the project are welcome. You must follow this [guideline](https://github.com/bitwebs/unichain-promise/blob/master/CONTRIBUTING.md).

## License

MIT