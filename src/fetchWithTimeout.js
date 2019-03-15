const DEFAULT_TIMEOUT = 5000 // default timeout is 5[sec]

export default function (url, options, timeout = DEFAULT_TIMEOUT) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout)
    )
  ]);
}