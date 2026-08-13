export default function parseObject(str) {
    const result = {}

    const body = str
        .replace("{", "")
        .replace("}", "")

    body.split(",").forEach(item => {
        const [k, v] = item.split(":")
        if (!k || !v) return

        const key = k.trim()

        let value = v.trim()

        value = value
            .replace(/^["']|["']$/g, "")

        if (!isNaN(Number(value))) {
            result[key] = Number(value)
        } else if (value === "true") {
            result[key] = true
        } else if (value === "false") {
            result[key] = false
        } else {
            result[key] = value
        }
    })

    return result
}