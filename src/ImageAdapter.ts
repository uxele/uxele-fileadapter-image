import { IProject, IPage, ILayer, IFileMeta, IFileBlob, IFileAdapter } from "psdetch-core";
import * as path from "path";
import { zoomImg } from "psdetch-utils/build/canvas";
export class ImageAdapter implements IFileAdapter {
  acceptExtensions: string[] = [".jpeg", ".png", ".jpg"];
  fileTypeName: string = "Image File";
  private getImage(imgURL: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => {
        resolve(img);
      };
      img.src = imgURL;
    });
  }
  private getPage(imageName: string, imageElement: HTMLImageElement): IPage {
    return {
      name: imageName,
      width: imageElement.width,
      height: imageElement.height,
      getPreview:async (zoom: number) => {
        return zoomImg(imageElement,zoom);
      },
      getLayers: (): Promise<ILayer[]> => {
        return Promise.resolve([] as ILayer[]);
      },
    };
  }
  async decodeProject(designFile: IFileBlob): Promise<IProject> {
    const file = designFile.file;
    designFile.meta.mime = file.type;
    const imageUrl = URL.createObjectURL(file);
    const imageElement = await this.getImage(imageUrl);
    const page: IPage = this.getPage(designFile.meta.name, imageElement);
    return {
      name: designFile.meta.name,
      fileMeta: designFile.meta,
      getPages: () => {

        return Promise.resolve([page]);
      },
    };
  }
  checkFileMeta(meta: IFileMeta): boolean {
    const name = meta.name;
    const mime = meta.mime;
    if (mime.toLowerCase().indexOf("image") > -1 || this.acceptExtensions.indexOf(path.extname(name).toLowerCase()) > -1) {
      return true;
    }
    return false;
  }
}
