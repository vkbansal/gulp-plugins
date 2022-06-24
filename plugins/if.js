import { PassThrough } from "node:stream";

export default function gulpIf(
  condition,
  trueStream,
  falseStream = new PassThrough({ objectMode: true })
) {
  return condition ? trueStream : falseStream;
}
