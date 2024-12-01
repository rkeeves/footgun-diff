const JS = (() => {
  const typ = (x) => x === null ? 'null' : Array.isArray(x) ? 'array' : /* https://youtu.be/eiWIOKKuyGE?t=237 */ typeof x
  const show = (x) => {
    const t = typ(x)
    return t === 'array' ? '[..]' : t === 'object' ? '{..}' : t === 'string' ? `'${x}'` : String(x)
  }
  return { typ, show }
})()

// data MergeTree = Assocs JS JS [(String, ZipJS)] | Both JS JS | Left JS | Right JS
const MergeTree = (() => {
  const Assocs = (l, r, kvs) => (fa, _b, _l, _r) => fa(l, r, kvs)
  const Both   = (l, r)      => (_a, fb, _l, _r) => fb(l, r)
  const Left   = (x)         => (_a, _b, fl, _r) => fl(x)
  const Right  = (x)         => (_a, _b, _l, fr) => fr(x)
  // fromJS :: (JS, JS) -> MergeTree
  const fromJS  = (l, r) => {
    const [lt, rt] = [l, r].map(JS.typ)
    if (lt === rt && ['array', 'object'].includes(lt) && l !== r) {
      const keys = [...new Set(Object.keys(l).concat(Object.keys(r))).values()].sort()
      return Assocs(l, r, keys.map(k => [k, (k in l && k in r) ? fromJS(l[k], r[k]) : (k in l) ? Left(l[k]) : Right(r[k])]))
    }
    return Both(l, r)
  }
  return { fromJS }
})()

const Diff = (() => {
  const cmd = (mark) => (d, s, x) => `${mark} ${' '.repeat(d * 2)} ${s}${s.length < 1 ? '' : ': '}${mark === ' ' ? x : JS.show(x)}`
  const add = cmd('+')
  const rem = cmd('-')
  const nop = cmd(' ')
  // fromMergeTree :: (MergeTree, Int, String) -> [String]
  const fromMergeTree = (mt, d = 0, s = '') => mt(
    (l, _, kmts) => {
      const [open, close] = Array.isArray(l) ? ['[', ']'] : ['{', '}']
      const cmds = kmts.flatMap(([k, mt]) => fromMergeTree(mt, d + 1, k))
      return cmds.length < 1 ? [] : [nop(d, s, open) , ...cmds, nop(d, '', close)]
    },
    (l, r)       => l === r ? [] : [rem(d, s, l), add(d, s, r)],
    (l)          => [rem(d, s, l)],
    (r)          => [add(d, s, r)]
  )
  // jsToDiffLines :: (JS, JS) -> [String]
  const jsToDiffLines = (l, r) => fromMergeTree(MergeTree.fromJS(l, r))
  return { jsToDiffLines }
})()

module.exports = { Diff }
