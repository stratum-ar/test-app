const { UIRequest } = require("./ui")
const { Socket } = require("net")
const { SmartBuffer } = require("smart-buffer")

const { appendFileSync } = require("fs")
const { join } = require("path")

const log = (msg) => {
    appendFileSync(
        join(__dirname, "app.log"),
        msg + "\n", "utf-8"
    )
}

class StratumApp {
    client = new Socket()

    constructor(dataReceived, render) {
        this.dataReceived = dataReceived
        this.render = render
    }

    start(appId) {
        this.client.connect(50665, "localhost", () => {
            log(`Connected to App Server`)

            const buffer = new SmartBuffer()
            buffer.writeUInt8(0)
            buffer.writeString(appId)
    
            this.client.write(buffer.toBuffer())
        })

        this.client.on("data", (data) => {
            this.dataReceived(data)
        })
        
        this.client.on("close", () => {
            log(`Connection closed`)
        })
    }

    sendRender() {
        const request = new UIRequest()
        this.render(request)
        request.end()

        const reqBuffer = request.toBuffer()

        const buffer = new SmartBuffer()
    
        buffer.writeUInt8(0x10)
        buffer.writeUInt16BE(reqBuffer.length)
        buffer.writeBuffer(reqBuffer)
    
        this.client.write(buffer.toBuffer())
    }
}

module.exports = {StratumApp, log}