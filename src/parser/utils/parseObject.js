export default function parseObject(str) {
    const result = {}

    const body = str
        .replace("{", "")
        .replace("}", "")

    body.split(",").forEach(item => {
        const [k, v] = item.split(":")
        if (!k || !v) return

        result[k.trim()] = Number(v.trim())
    })

    return result
}