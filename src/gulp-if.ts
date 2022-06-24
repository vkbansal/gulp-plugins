import { PassThrough, type Stream } from "node:stream";

export default function gulpIf(
  condition: boolean,
  trueStream: Stream,
  falseStream: Stream = new PassThrough({ objectMode: true })
) {
  return condition ? trueStream : falseStream;
}
