# @neos21/in-browser-ts : In Browser TS

[![NPM Version](https://img.shields.io/npm/v/@neos21/in-browser-ts.svg)](https://www.npmjs.com/package/@neos21/in-browser-ts) [![GPR Version](https://img.shields.io/github/package-json/v/neos21/in-browser-ts?label=github)](https://github.com/Neos21/in-browser-ts/packages/__ID__)

ブラウザ上で TypeScript コードをコンパイルし Web ページに適用するライブラリ。


## Demo

__[Demo (GitHub Pages)](https://neos21.github.io/in-browser-ts/)__


## How To Use

- 分離バージョンの場合 : `typescript.js` と `in-browser-ts.js` を読み込む
    - 圧縮板 : `in-browser-ts.min.js`

```html
<script src="./typescript.js"></script>
<script src="./in-browser-ts.js"></script>
```

- バンドルバージョンの場合 : `in-browser-ts.bundle.js` を読み込む
    - 圧縮板 : `in-browser-ts.bundle.min.js`

```html
<script src="./in-browser-ts.bundle.js"></script>
```

次のように `type="text/typescript"` 属性を付与して TypeScript コードを書く。

```html
<!-- 外部 TypeScript ファイルを読み込む -->
<script type="text/typescript" src="./example.ts"></script>

<!-- インラインに TypeScript を記述する -->
<script type="text/typescript">
  const text: string = 'Hello World';
</script>
```

DOMContentLoaded のタイミングで TypeScript コードが JavaScript にトランスパイルされ `body` 要素の末尾にインライン `script` 要素として挿入される。

In Browser TS の動作ログをコンソール出力するには `in-browser-ts.js` を読み込む前に次のグローバル変数を定義しておく。

```html
<script>
  window.inBrowserTsIsOutputLog = true;
</script>

<script src="./in-browser-ts.bundle.min.js"></script>
```


## Links

- [Neo's World](https://neos21.net/)
- [GitHub - Neos21](https://github.com/Neos21/)
- [GitHub - in-browser-ts](https://github.com/Neos21/in-browser-ts)
- [GitHub Pages - @neos21/in-browser-ts : In Browser TS](https://neos21.github.io/in-browser-ts)
- [npm - @neos21/in-browser-ts](https://www.npmjs.com/package/@neos21/in-browser-ts)
