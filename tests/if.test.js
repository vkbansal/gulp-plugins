import { Stream } from "node:stream";
import assert from "node:assert";

import Vinyl from "vinyl";
import gulpIf from "../plugins/if.js";

const changeContents = (contents) => {
  const stream = new Stream.Transform({ objectMode: true });

  stream._transform = function (file, buffer, done) {
    file.contents = new Buffer(contents);
    done(null, file);
  };

  return stream;
};

describe("gulp-if tests", () => {
  describe("works with only true condition", () => {
    it("condition is true", () => {
      const stream = gulpIf(true, changeContents("new content"));
      const fakeBuffer = new Buffer("old content");
      const fakeFile = new Vinyl({ contents: fakeBuffer });

      const through = new Stream.Transform({ objectMode: true });

      through.write = (file) => {
        assert.equal(file.contents.toString(), "new content");
      };

      stream.pipe(through);
      stream.write(fakeFile);
      stream.end();
    });

    it("condition is false", () => {
      const stream = gulpIf(false, changeContents("new content"));
      const fakeBuffer = new Buffer("old content");
      const fakeFile = new Vinyl({ contents: fakeBuffer });

      const through = new Stream.Transform({ objectMode: true });

      through.write = (file) => {
        assert.equal(file.contents.toString(), "old content");
      };

      stream.pipe(through);
      stream.write(fakeFile);
      stream.end();
    });
  });

  describe("works with both true and false conditions", () => {
    it("condition is true", () => {
      const stream = gulpIf(
        true,
        changeContents("true"),
        changeContents("false")
      );
      const fakeBuffer = new Buffer("old content");
      const fakeFile = new Vinyl({ contents: fakeBuffer });

      const through = new Stream.Transform({ objectMode: true });

      through.write = (file) => {
        assert.equal(file.contents.toString(), "true");
      };

      stream.pipe(through);
      stream.write(fakeFile);
      stream.end();
    });

    it("condition is false", () => {
      const stream = gulpIf(
        false,
        changeContents("true"),
        changeContents("false")
      );
      const fakeBuffer = new Buffer("old content");
      const fakeFile = new Vinyl({ contents: fakeBuffer });

      const through = new Stream.Transform({ objectMode: true });

      through.write = (file) => {
        assert.equal(file.contents.toString(), "false");
      };

      stream.pipe(through);
      stream.write(fakeFile);
      stream.end();
    });
  });
});
