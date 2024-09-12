import { assetManager, AudioClip, ImageAsset, Prefab, resources, SpriteFrame, Texture2D, _decorator, Material, TextAsset } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceUtils')
export class ResourceUtils {
    start() {

    }
    public static loadPrefab(path): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, Prefab, (err, prefab: Prefab) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(prefab);
                }
            });
        });
    }
    public static loadAudio(path): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, AudioClip, (err, audio: AudioClip) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(audio);
                }
            });
        });
    }

    public static loadSprite(path): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, ImageAsset, (err, imageAsset: ImageAsset) => {
                if (err) {
                    reject(err);
                } else {
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = imageAsset;
                    spriteFrame.texture = texture;
                    resolve(spriteFrame);
                }
            });
        });
    }

    public static loadImageAsset(path): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, ImageAsset, (err, imageAsset: ImageAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(imageAsset);
                }
            });
        });
    }

    public static loadDirSprite(dirPath): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.loadDir(dirPath, SpriteFrame, (err, spriteFrameList: SpriteFrame[]) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(spriteFrameList);
                }
            });
        });
    }

    public static loadImageFromURL(remoteUrl): Promise<any> {
        return new Promise((resolve, reject) => {
            // Remote texture url with file extensions
            assetManager.loadRemote<ImageAsset>(remoteUrl, { ext: ".png" }, function (err, imageAsset: ImageAsset) {

                if (err) {
                    reject(err);
                }
                else {
                    const spriteFrame = new SpriteFrame();
                    const texture = new Texture2D();
                    texture.image = imageAsset;
                    spriteFrame.texture = texture;

                    resolve(spriteFrame);
                }
            });
        });
    }

    public static loadImageAssetFromURL(remoteUrl): Promise<any> {
        return new Promise((resolve, reject) => {
            // Remote texture url with file extensions
            assetManager.loadRemote<ImageAsset>(remoteUrl, function (err, imageAsset: ImageAsset) {
                if (!err) {
                    resolve(imageAsset);
                } else {
                    reject(err);
                }
            });
        });
    }

    public static loadMaterial(dirPath): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(dirPath, Material, (err, material: Material) => {
                if (!err) {
                    resolve(material);
                } else {
                    reject(err);
                }
            });
        });
    }

    public static loadFileText(path): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(path, TextAsset, (err, text: TextAsset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(text);
                }
            });
        });
    }
}