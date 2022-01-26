// UI Server API test

class UIRequest {
    bytes = [0]

    addCommand(commandBytes) {
        this.bytes[0] += 1

        this.bytes.push(...commandBytes)
        this.bytes.push(1)
    }

    end() {
        if (this.bytes.length === 1) {
            this.bytes.push(2)
        } else {
            this.bytes[this.bytes.length - 1] = 2
        }
    }

    toBuffer() {
        return Buffer.from(this.bytes)
    }

    getGraphics() {
        return new Graphics(this)
    }
}

class Graphics {
    constructor(request) {
        this.request = request
    }

    drawLine(sx, sy, ex, ey, r, g, b) {
        this.request.addCommand([
            16,
            sx, sy, ex, ey,
            r, g, b
        ])
    }
}

module.exports = {UIRequest, Graphics}