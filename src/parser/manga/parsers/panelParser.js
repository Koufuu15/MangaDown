import parseObject from "../utils/parseObject"

export default function parsePanel(panel,key,value){
    switch(key){
        case "backgroundColor":
            panel.backgroundColor=value
            break

        case "backgroundImage":
            panel.backgroundImage=value
            break

        case "position":
            const pos=parseObject(value)
            panel.position={
                x:pos.x??0,
                y:pos.y??0
            }
            break

        case "size":
            const size=parseObject(value)
            panel.size={
                width:size.w??500,
                height:size.h??500
            }
    }
}