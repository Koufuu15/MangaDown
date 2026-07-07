import { BLOCK_TYPES } from "./blockTypes"

export default function parseMarkdown(md){

    const blocks=[]

    const regex=/:::manga\s*([\s\S]*?):::/g

    let lastIndex=0

    let match

    while((match=regex.exec(md))!==null){

        if(match.index>lastIndex){
            blocks.push({
                type:BLOCK_TYPES.MARKDOWN,
                content:md.slice(lastIndex,match.index)
            })
        }

        blocks.push({
            type:BLOCK_TYPES.MANGA,
            content:match[1].trim()
        })

        lastIndex=regex.lastIndex
    }

    if(lastIndex<md.length){
        blocks.push({
            type:BLOCK_TYPES.MARKDOWN,
            content:md.slice(lastIndex)
        })
    }

    return blocks
}