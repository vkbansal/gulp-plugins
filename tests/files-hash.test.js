import { Stream } from "node:stream";
import assert from "node:assert";

import Vinyl from "vinyl";
import gulpFilesHash from "../plugins/files-hash.js";

describe("sass tests", () => {
  it("should append hash to files", () => {
    const stream = gulpFilesHash();
    const fakeBuffer = new Buffer("some content");
    const fakeFile = new Vinyl({ contents: fakeBuffer, path: "myfile.txt" });

    const through = new Stream.Transform({ objectMode: true });

    through.write = (file) => {
      assert.equal(file.relative, "myfile.290f49.txt");
      assert.equal(file.path.endsWith("myfile.290f49.txt"), true);
    };

    stream.pipe(through);
    stream.write(fakeFile);
    stream.end();
  });
});
