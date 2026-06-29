export function parseManga(json){
    return{
        panels:json.panels.map(parsePanel)
    }
}

function parsePanel(panel){
    return{
        position:panel.position,
        size:panel.size,
        layers:(panel.layers??[])
            .map(parseLayer)
    }
}

function parseLayer(layer){
    return{
        layer:layer.layer??50,
        ...layer
    }
}