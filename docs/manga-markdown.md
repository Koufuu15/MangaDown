# MangaDown 独自Markdown記法

この文書は、MangaDownが現在のパーサーで解釈する独自Markdown記法の仕様です。AIや別のツールに漫画データを生成させる場合は、この文書の「基本構造」と「現在の実装に関する注意」を優先してください。

## 基本構造

漫画記法は `:::manga` と `:::` で囲みます。囲みの外側には通常のMarkdownを書けます。

````markdown
# ページの説明

通常のMarkdown本文。

:::manga
# panel
- backgroundColor: #eeeeee
- position: { x: 0, y: 0 }
- size: { w: 500, h: 500 }

## bubble
- layer: 1
- shape: round
- position: { x: 20, y: 20 }
- size: { w: 180, h: 100 }

### text
- content: "こんにちは！"
- size: 20
- color: #111111
- direction: rl
:::
````

### 記法の規則

- 属性は `- key: value` の形式で書きます。
- 属性名と値の前後の空白は無視されます。
- `{ x: 20, y: 30 }` のようなオブジェクト値を使えます。
- オブジェクトの座標キーは `x` と `y`、サイズのキーは `w` と `h` です。
- 数値は数値として解釈されます。真偽値は `true` または `false` と書きます。
- 未知の属性は無視されます。
- `# panel` が1コマを作ります。複数の `# panel` を書くと、上から順に複数コマになります。

## 要素の階層

```text
:::manga
  # panel
    ## bubble
      ### text
      ### tail
    ## image
:::
```

`bubble` と `image` は直前の `panel` に追加されます。`text` と `tail` は直前の `bubble` に追加されます。

## Panel

開始行:

```markdown
# panel
```

| 属性 | 型 | 説明 | 既定値 |
| --- | --- | --- | --- |
| `backgroundColor` | 文字列 | 背景色。CSSの色指定 | `#ffffff` 相当の表示側既定値 |
| `backgroundImage` | 文字列 | 背景画像の値として解析される | なし |
| `border` | 文字列 | 枠線のスタイル | `solid` |
| `borderWidth` | 数値 | 枠線の太さ | `2` |
| `borderColor` | 文字列 | 枠線の色 | `#18181b` |
| `position` | オブジェクト | パネル位置。`x` と `y` はピクセル値 | `{ x: 0, y: 0 }` |
| `size` | オブジェクト | パネルサイズ。`w` と `h` はピクセル値 | `{ w: 500, h: 500 }` |

例:

```markdown
# panel
- backgroundColor: lightblue
- border: solid
- borderWidth: 2
- borderColor: #333333
- position: { x: 0, y: 0 }
- size: { w: 500, h: 400 }
```

## Bubble

開始行:

```markdown
## bubble
```

| 属性 | 型 | 説明 | 既定値 |
| --- | --- | --- | --- |
| `layer` | 数値 | 重なり順。大きい値ほど前面 | なし（並び替え時は `0`） |
| `shape` | 文字列 | `round`、`square`、`thought`、`shout`、`star` などの形 | `round` |
| `position` | オブジェクト | パネル内の位置。`x` と `y` はパーセント | `{ x: 0, y: 0 }` |
| `size` | オブジェクト | 吹き出しサイズ。`w` と `h` はピクセル値 | `{ w: 100, h: 60 }` |
| `background` | 文字列 | 吹き出しの塗り色 | `#ffffff` |
| `border` | 真偽値 | 枠線の表示。`true` または `false` | `true` |
| `borderWidth` | 数値 | 枠線の太さ | `3` |
| `borderColor` | 文字列 | 枠線の色 | `#111111` |

### Text

吹き出しには通常 `### text` を続けます。

| 属性 | 型 | 説明 |
| --- | --- | --- |
| `content` | 文字列 | 表示する文章。吹き出し内ではMarkdownとして描画される |
| `font` | 文字列 | フォント名など。現在の描画での反映は実装依存 |
| `size` | 数値 | 文字サイズ（ピクセル） |
| `color` | 文字列 | 文字色 |
| `direction` | `tb` または `rl` | `tb` は縦書き、`rl` は横書き。その他の値は横書き扱い |
| `position` | オブジェクト | 文字位置。`x` と `y` | 

属性形式:

```markdown
### text
- content: "右から左へ読む文章"
- font: sans-serif
- size: 20
- color: #111111
- direction: rl
- position: { x: 0, y: 0 }
```

`content` は属性として書く方法に加え、`### text` の後に属性でない行を書いて本文にする方法もあります。空行は本文中の改行として保持されます。

```markdown
### text
これは本文です。
複数行も書けます。
```

### Tail

吹き出しのしっぽは `### tail` を使います。1つの吹き出しに複数書けます。

| 属性 | 型 | 説明 | 制約・既定値 |
| --- | --- | --- | --- |
| `shape` | 文字列 | しっぽの形 | `triangle` または `circle`。既定値は `triangle` |
| `position` | 数値 | 角度。0度は右、90度は上、180度は左、270度は下 | `0` から `360` |
| `size` | 数値 | しっぽの倍率 | 0以上。既定値 `1` |
| `distance` | 数値 | 吹き出し中心から描画開始位置までの距離 | 0以上。既定値 `47` |

例:

```markdown
### tail
- shape: triangle
- position: 225
- size: 1
- distance: 47
```

## Image

開始行:

```markdown
## image
```

| 属性 | 型 | 説明 | 既定値 |
| --- | --- | --- | --- |
| `name` | 文字列 | 素材名。組み込み素材またはアップロード済み素材の名前 | なし |
| `layer` | 数値 | 重なり順。大きい値ほど前面 | なし（並び替え時は `0`） |
| `position` | オブジェクト | パネル内の位置。`x` と `y` はパーセント | `{ x: 0, y: 0 }` |
| `size` | オブジェクト | 画像サイズ。`w` と `h` はピクセル値 | `{ w: 100, h: 100 }` |

例:

```markdown
## image
- name: tarou
- layer: 0
- position: { x: 20, y: 20 }
- size: { w: 180, h: 220 }
```

## 完全な例

```markdown
:::manga
# panel
- backgroundColor: #f4f0e8
- position: { x: 0, y: 0 }
- size: { w: 500, h: 500 }

## image
- name: tarou
- layer: 0
- position: { x: 25, y: 15 }
- size: { w: 220, h: 300 }

## bubble
- layer: 1
- shape: round
- background: white
- border: true
- position: { x: 55, y: 15 }
- size: { w: 180, h: 110 }

### text
- content: "こんにちは！"
- size: 20
- color: #111111
- direction: rl

### tail
- shape: triangle
- position: 225
- size: 1
- distance: 47
:::
```

## 現在の実装に関する注意

- ブロックの開始・終了は `:::manga` と `:::` です。終了記号がない場合、その部分は漫画ブロックとして確定しません。
- 要素名は現在のパーサーに合わせて `## image` と書きます。`## images` は認識されません。
- エディターの一部コードには `### image` を生成する処理が残っていますが、現在の `parseManga` が認識する画像開始行は `## image` です。画像を確実に表示するには `## image` を使用してください。
- `### text` は `bubble` の中でのみ有効です。`### tail` も同様に `bubble` の中で使用します。
- `position` の `x` と `y` は、パネルではピクセル、吹き出しと画像ではパーセントとして扱われます。
- オブジェクト値は単純なカンマ区切りで解析されるため、値の中にカンマを含めないでください。
- 数値属性に数値以外を指定した場合や、tailの制約に違反した場合はエラーになります。未知の属性はエラーにならず無視されます。
- 吹き出し本文の `content` はMarkdownとして解釈されます。必要に応じて太字、改行などの通常のMarkdownを利用できます。