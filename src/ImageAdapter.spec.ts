import { ImageAdapter } from "./ImageAdapter";
import { loadRemoteFile } from "psdetch-utils/build/loadRemoteFile";

describe("ImageAdapter", () => {
  const adapter = new ImageAdapter();
  it("should match with image file", () => {
    expect(adapter.checkFileMeta({
      name: "nature.jpeg",
      mime: "",
    })).toBe(true);
  });
  describe(`"Image File: "base/testAssets/nature.jpeg"`, () => {
    async function decodeProject() {
      const f = await loadRemoteFile({ url: "base/testAssets/nature.jpeg" }).toPromise();
      if (f) {
        const project = await adapter.decodeProject(f);
        return project;
      }
    }
    async function getPages() {
      const project = await decodeProject();
      if (project) {
        return project.getPages();
      }
    }
    async function getLayers() {
      const pages = await getPages();
      if (pages) {
        return pages[0].getLayers();
      }
    }
    it("should decode an image file", async () => {
      const project = await decodeProject();
      if (project) {
        expect(project.name).toEqual("nature.jpeg");
      } else {
        fail("Project is undefiend");
      }
    });
    it("should get page from a project", async () => {
      const page = await getPages();
      if (page) {
        expect(page.length).toEqual(1);
        expect(page[0].name).toBe("nature.jpeg");
        expect(page[0].width).toBe(275);
        expect(page[0].height).toBe(183);
      } else {
        fail("Page returned as undefined");
      }
    });
    it("should get preview", async () => {
      const page = await getPages();
      if (page) {
        const img = await page[0].getPreview(1);
        expect(img).toBeDefined();
      }
    });
    it("should not get layers", async () => {
      const page = await getPages();
      if (page) {
        const layers = await page[0].getLayers();
        expect(layers.length).toBe(0);
      }
    });
  });
});
