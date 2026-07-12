import parseObject from "../utils/parseObject"

export default function parseBackground(panel,key,value){

    switch(key){

        case "color":
            panel.backgroundColor=value
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