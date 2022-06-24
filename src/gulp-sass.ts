import { Transform } from "node:stream";
import { pathToFileURL } from "node:url";
import path from "node:path";

import sass from "sass";
import PluginError from "plugin-error";

export default function gulpSass() {
  const stream = new Transform({ objectMode: true });

  stream._transform = function (file, buffer, done) {
    if (file.isNull()) {
      done(null, file);
      return;
    }

    if (file.isStream()) {
      done(null, file);
      return;
    }

    if (file.contents.length === 0) {
      done(null, file);
      return;
    }

    try {
      const ext = path.extname(file.relative);
      const newPath = path.join(file.base, file.relative.replace(ext, `.css`));
      const sassObj = sass.compile(file.path, {
        importers: [
          {
            findFileUrl(url) {
              if (!url.startsWith("~")) {
                return null;
              }

              return new URL(
                url.substring(1),
                pathToFileURL("./node_modules/")
              );
            },
          },
        ],
      });

      file.contents = Buffer.from(sassObj.css);
      file.path = newPath;
    } catch (e: unknown) {
      done(new PluginError("gulp-sass", e as Error));
      return;
    }

    done(null, file);
  };

  return stream;
}
