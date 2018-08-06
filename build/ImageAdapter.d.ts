import { IProject, IFileMeta, IFileBlob, IFileAdapter } from "psdetch-core";
export declare class ImageAdapter implements IFileAdapter {
    acceptExtensions: string[];
    fileTypeName: string;
    private getImage;
    private getPage;
    decodeProject(designFile: IFileBlob): Promise<IProject>;
    checkFileMeta(meta: IFileMeta): boolean;
}
