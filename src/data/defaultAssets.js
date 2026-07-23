/*export default [
  {
    id: "girl",
    name: "girl",
    src: girl,
    category: "character",
    tags: ["girl"],
    type: "default"
  }
]
*/

const modules = import.meta.glob(
  "/src/data/images/**/*.{png,jpg,jpeg,webp,svg}",
  {
    eager: true,
    import: "default"
  }
)

const defaultAssets = Object.entries(modules).map(
  ([path, src]) => {

    // 例:
// /src/data/images/characters/girl.png

    const filename =
      path.split("/").pop()

    const name =
      filename.replace(/\.[^.]+$/, "")

    const category =
      path.split("/").at(-2)

    return {

      id:  `${category}/${name}`,

      name,

      src,

      category,

      tags: [name],

      type: "default"

    }

  }
)

export default defaultAssets