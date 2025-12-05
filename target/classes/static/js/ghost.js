class Ghost {
    constructor(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * 4);
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
        setInterval(() => this.changeRandomDirection(), 10000);
    }

    isInRange() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        return Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range;
    }

    changeRandomDirection() {
        this.randomTargetIndex = (this.randomTargetIndex + 1) % 4;
    }

    moveProcess() {
        this.target = (powerUpActive || this.isInRange()) ? pacman : randomTargetsForGhosts[this.randomTargetIndex];
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
        }
    }

    moveBackwards() {
        switch (this.direction) {
            case 4:
                this.x -= this.speed;
                break;
            case 3:
                this.y += this.speed;
                break;
            case 2:
                this.x += this.speed;
                break;
            case 1:
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        switch (this.direction) {
            case 4:
                this.x += this.speed;
                break;
            case 3:
                this.y -= this.speed;
                break;
            case 2:
                this.x -= this.speed;
                break;
            case 1:
                this.y += this.speed;
                break;
        }
    }

    checkCollisions() {
        return map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize)] == 1 ||
            map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize + 0.9999)] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][parseInt(this.x / oneBlockSize + 0.9999)] == 1;
    }

    changeDirectionIfPossible() {
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection(map, parseInt(this.target.x / oneBlockSize), parseInt(this.target.y / oneBlockSize));
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        if (this.getMapY() != this.getMapYRightSide() && (this.direction == DIRECTION_LEFT || this.direction == DIRECTION_RIGHT)) {
            this.direction = DIRECTION_UP;
        }
        if (this.getMapX() != this.getMapXRightSide() && this.direction == DIRECTION_UP) {
            this.direction = DIRECTION_LEFT;
        }
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    calculateNewDirection(map, destX, destY) {
        let mp = map.map(row => row.slice());
        let queue = [{
            x: this.getMapX(),
            y: this.getMapY(),
            rightX: this.getMapXRightSide(),
            rightY: this.getMapYRightSide(),
            moves: [],
        }];
        
        while (queue.length > 0) {
            let poped = queue.shift();
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            }
            mp[poped.y][poped.x] = 1;
            queue.push(...this.addNeighbors(poped, mp));
        }
        return 1;
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (poped.x - 1 >= 0 && poped.x - 1 < numOfRows && mp[poped.y][poped.x - 1] != 1) {
            queue.push({ x: poped.x - 1, y: poped.y, moves: [...poped.moves, DIRECTION_LEFT] });
        }
        if (poped.x + 1 >= 0 && poped.x + 1 < numOfRows && mp[poped.y][poped.x + 1] != 1) {
            queue.push({ x: poped.x + 1, y: poped.y, moves: [...poped.moves, DIRECTION_RIGHT] });
        }
        if (poped.y - 1 >= 0 && poped.y - 1 < numOfColumns && mp[poped.y - 1][poped.x] != 1) {
            queue.push({ x: poped.x, y: poped.y - 1, moves: [...poped.moves, DIRECTION_UP] });
        }
        if (poped.y + 1 >= 0 && poped.y + 1 < numOfColumns && mp[poped.y + 1][poped.x] != 1) {
            queue.push({ x: poped.x, y: poped.y + 1, moves: [...poped.moves, DIRECTION_BOTTOM] });
        }
        return queue;
    }

    getMapX() {
        return parseInt(this.x / oneBlockSize);
    }

    getMapY() {
        return parseInt(this.y / oneBlockSize);
    }

    getMapXRightSide() {
        return parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
    }

    getMapYRightSide() {
        return parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
    }

    draw() {
        canvasContext.save();
        if (powerUpActive) {
            canvasContext.filter = 'invert(1) hue-rotate(180deg)';
        }
        canvasContext.drawImage(ghostFrames, this.imageX, this.imageY, this.imageWidth, this.imageHeight, this.x, this.y, this.width, this.height);
        canvasContext.restore();
    }
}

let updateGhosts = () => {
    ghosts.forEach(ghost => ghost.moveProcess());
};

let drawGhosts = () => {
    ghosts.forEach(ghost => ghost.draw());
};
