import crypto from "node:crypto";
import Stream from "node:stream";
import path from "node:path";

import Vinyl from "vinyl";

const hashesMap = new Map();

export interface GulpFilesHashOptions {
  /**
   *  Algorithm to be used for hashing.
   *  @default "sha256"
   */
  algorithm?: string;
  /**
   *  Length of the hash.
   *  @default 6
   */
  hashLength?: number;
  /**
   * Path to output a file containing the map of original file paths to hashed file paths.
   */
  hashFile?: string;
  /**
   * A function to customize the hash file before writing to disk
   */
  customizeHashFile?(hash: Record<string, string>): string;
}

export default function gulpFilesHash(options: GulpFilesHashOptions = {}) {
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

    if (options.hashFile) {
      const mapPath = path.relative(process.cwd(), file.path);

      hashesMap.set(mapPath, relative);
    }

    file.path = newPath;

    done(null, file);
  };

  stream._flush = function (done) {
    if (options.hashFile) {
      const hashes: Record<string, string> = Object.fromEntries([
        ...hashesMap.entries(),
      ]);

      let contents = "";

      if (typeof options.customizeHashFile === "function") {
        contents = options.customizeHashFile(hashes);
      } else {
        contents = JSON.stringify(contents, null, 2);
      }

      const file = new Vinyl({
        cwd: process.cwd(),
        base: ".",
        path: options.hashFile,
        contents: Buffer.from(contents),
      });
      this.push(file);

      hashesMap.clear();
    }

    done();
  };

  return stream;
}
