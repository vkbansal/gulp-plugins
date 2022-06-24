import crypto from "node:crypto";
import Stream from "node:stream";
import path from "node:path";

import Vinyl from "vinyl";

const hashesMap = new Map();

/**
 * @param {Number} options.hashLength      Length of the hash. Default is 6.
 * @param {Number} options.hashFile        Path to output a file containing the map of original file paths to hashed file paths.
 * @param {Number} options.relativeSrcPath Path to be used as base path while generating hash file.
 * @param {Number} options.algorithm       Algorithm to be used for hashing. Default is "sha256".
 */
export default function gulpFilesHash(options = {}) {
  const stream = new Stream.Transform({ objectMode: true });

  stream._transform = function (file, buffer, done) {
    if (file.isNull()) {
      done(null, file);
      return;
    }

    if (file.isStream()) {
      done(null, file);
      return;
    }

    const hash = crypto
      .createHash(options.algorithm || "sha256")
      .update(file.contents, buffer)
      .digest("hex")
      .slice(0, options.hashLength || 6);

    const ext = path.extname(file.relative);
    const relative = file.relative.replace(ext, `.${hash}${ext}`);
    const newPath = path.join(file.base, relative);
    file.path = newPath;

    if (options.hashFile) {
      const mapPath = path.relative(
        options.relativeSrcPath || process.cwd(),
        file.path
      );

      hashesMap.set(mapPath, relative);
    }

    done(null, file);
  };

  stream._flush = function (done) {
    if (options.hashFile) {
      const file = new Vinyl({
        cwd: process.cwd(),
        base: ".",
        path: options.hashFile,
        contents: Buffer.from(
          JSON.stringify(Object.fromEntries([...hashesMap.entries()]), null, 2)
        ),
      });
      this.push(file);

      hashesMap.clear();
    }

    done();
  };

  return stream;
}
