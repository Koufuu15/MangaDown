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

    const filename = path.split("/").pop()
    const name = filename.replace(/\.[^.]+$/, "")
    const folderId = path.split("/").at(-2)

    return {
      id: `${folderId}/${name}`,
      name,
      src,
      folderId,
      tags: [name],
      createdAt: 0,
      updatedAt: 0,
      type: "default"
    }
  }
)

export default defaultAssets