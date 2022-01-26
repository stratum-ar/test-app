const { StratumApp, log } = require("./api/app")

const appId = process.argv[2]

log(appId)

let lineX = 0, lineY = 0

const app = new StratumApp(
    (buffer) => {
        const cmd = buffer.readUInt8(0)
        if (cmd === 15) { // Input!
            const x = buffer.readUInt8(1)
            const y = buffer.readUInt8(2)

            lineX = x
            lineY = y

            log(`${x}, ${y}`)
        }

        app.sendRender()
    },
    (request) => {
        const gfx = request.getGraphics()
    
        gfx.drawLine(lineX, lineY, 100, 100, 255, 255, 255)
    }
)
app.start(appId)