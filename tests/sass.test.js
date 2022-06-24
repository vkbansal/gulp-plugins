import { Stream } from "node:stream";
import assert from "node:assert";

import Vinyl from "vinyl";
import gulpSass from "../plugins/sass.js";

const input = `body {
  padding: 0;

  & .container {
    max-width: 1240px;
  }
}`;

const output = `body {
  padding: 0;
}
body .container {
  max-width: 1240px;
}`;

describe("sass tests", () => {
  it("should transform files", () => {
    const stream = gulpSass();
    const fakeBuffer = new Buffer(input);
    const fakeFile = new Vinyl({ contents: fakeBuffer, path: "foo.scss" });

    const through = new Stream.Transform({ objectMode: true });

    through.write = (file) => {
      assert.equal(file.contents.toString(), output);
    };

    stream.pipe(through);
    stream.write(fakeFile);
    stream.end();
  });
});
