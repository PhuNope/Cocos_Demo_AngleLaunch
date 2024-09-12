import { Rect, Vec2, Vec3, Node, UITransform } from "cc";

export class MathUtil {
    public static Remap(x: number, currentMin: number, currentMax: number, newMin: number, newMax: number) {
        return newMin + (x - currentMin) * (newMax - newMin) / (currentMax - currentMin);
    }


    public static RandomAround(vector: Vec2, radius: number): Vec2;
    public static RandomAround(vector: Vec3, radius: number): Vec3;
    public static RandomAround(vector: Vec2 | Vec3, radius: number): Vec2 | Vec3 {
        const angle = Math.random() * 2 * Math.PI; // Góc ngẫu nhiên từ 0 đến 2*PI
        const distance = Math.random() * radius; // Bán kính ngẫu nhiên từ 0 đến radius

        const x = vector.x + distance * Math.cos(angle);
        const y = vector.y + distance * Math.sin(angle);

        if (vector instanceof Vec2) return new Vec2(x, y);

        return new Vec3(x, y, vector.z);
    }

    /**
     * @description convert bounding box to world and AABBs of children don't matter
     * @constructor
     */
    public static ConvertBoundingBoxToWorld(node: Node | UITransform): Rect {
        // const localRect = node.getBoundingBox();
        const transform = node instanceof Node ? node.getComponent(UITransform) : node;
        const localRect = transform.getBoundingBox();

        const parent = node instanceof Node ? node.parent : node.node.parent;

        let worldPos: any;
        if (parent) {
            const parentTransform = parent.getComponent(UITransform);
            worldPos = parentTransform.convertToWorldSpaceAR(transform.node.getPosition());
        } else {
            worldPos = transform.convertToWorldSpaceAR(Vec3.ZERO);
        }

        const worldRect = new Rect(worldPos.x - localRect.width / 2, worldPos.y - localRect.height / 2, localRect.width, localRect.height);

        return worldRect;
    }

    /**
     * @description convert local position of node A to local position of node B
     * @param nodeA
     * @param nodeB
     * @constructor
     */
    public static ConvertPositionLocalNodeAToLocalNodeB(localPos: Vec3, nodeA: Node | UITransform, nodeB: Node | UITransform) {
        const transformA = nodeA instanceof Node ? nodeA.getComponent(UITransform) : nodeA;
        const worldPositionA = transformA.convertToWorldSpaceAR(localPos);

        const transformB = nodeB instanceof Node ? nodeB.getComponent(UITransform) : nodeB;
        return transformB.convertToNodeSpaceAR(worldPositionA);
    }

    /**
     * @description random int with min <= x < max
     * @param min
     * @param max
     * @constructor
     */
    public static RandomRangeInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}