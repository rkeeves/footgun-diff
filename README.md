# footgun diff

We are going to diff JS objects and primitives, based just on equality.

## Intro

Let's compare `June` and `Jule`!

Let `June` and `Yule` be:

```
{                     |  {
  "fname": "June",    |    "nick": "Yule",
  "lname": "Mindy",   |    "lname": null,
  "loves": [          |    "twitch": "F1r3Puma142",
    "Long walks",     |    "loves": [
    "Family",         |      "Fingerling Potatoes",
    "Wine"            |      "Family",
  ]                   |      "Twitch"
}                     |    ]
                      |  }
```

_This starting example is in JSON because it is easy to ser/deserialize..._

What are the differences between `June` and `Jule`? Let's do:

```shell
npm i
app/footgun-diff.js samples/june.json samples/yule.json
```

See on stdout:

```text
   {
-    fname: 'June'
-    lname: 'Mindy'
+    lname: null
     loves: [
-      0: 'Long walks'
+      0: 'Fingerling Potatoes'
-      2: 'Wine'
+      2: 'Twitch'
     ]
+    nick: 'Yule'
+    twitch: 'F1r3Puma142'
   }
```

## Q&A

### A - I want to call it from code. How?

Use `Diff.jsToDiffLines`:

```javascript
const result = Diff.jsToDiffLines(
                  { fname: 'Barbara' },
                  undefined
                )

const resultIsLike = [
  "-  {..}",
  "+  undefined"
]
```

Other example:

```javascript
const result = Diff.jsToDiffLines(
                  [1, { breed: 'Persian', cost: 69 }, Infinity],
                  ["1", { breed: 'Cheshire', price: 69 }, Infinity]
                )

const resultIsLike = [
  "   [",
  "-    0: 1",
  "+    0: '1'",
  "     1: {",
  "-      breed: 'Persian'",
  "+      breed: 'Cheshire'",
  "-      cost: 69",
  "+      price: 69",
  "     }",
  "   ]"
]
```

### B - Wait... what happened to `lib/index.js`? Is `lib/index.js` all right? It looks like `lib/index.js` is ill or dying or something...

We are doing `poor man's matching` via [Scott](https://en.wikipedia.org/wiki/Mogensen%E2%80%93Scott_encoding) / [Church](https://en.wikipedia.org/wiki/Church_encoding) encoding.

[Welcome to my code!](https://youtu.be/T5fXB1Dr1Tc)
