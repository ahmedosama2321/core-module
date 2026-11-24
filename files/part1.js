const path = require("path");
const fs = require("fs");
const os = require("os");
const zlib = require("zlib");
const EventEmitter = require("events");
const { pipeline } = require("stream");

// 1
const getFileInfo = () => ({ File: __filename, Dir: __dirname });

// 2
const getFileName = (p) => path.basename(p);

// 3
const buildPath = (obj) => path.format(obj);

// 4
const getExt = (p) => path.extname(p);

// 5
const parsePath = (p) => {
  const { name, ext } = path.parse(p);
  return { Name: name, Ext: ext };
};

// 6
const isAbsolutePath = (p) => path.isAbsolute(p);

// 7
const joinSegments = (...segments) => path.join(...segments);

// 8
const resolvePath = (p) => path.resolve(p);

// 9
const joinTwoPaths = (p1, p2) => path.join(p1, p2);

// 10 (async delete)
const deleteFile = (p) => {
  fs.unlink(p, (err) => {
    if (err) return console.log(err.message);
    console.log(`The ${path.basename(p)} is deleted.`);
  });
};

// 11 (sync create folder)
const createFolder = (p) => {
  fs.mkdirSync(p, { recursive: true });
  console.log("Success");
};

// 12
const emitter = new EventEmitter();
emitter.on("start", () => console.log("Welcome event triggered!"));
// emitter.emit("start");

// 13
emitter.on("login", (username) => console.log(`User logged in: ${username}`));
// emitter.emit("login", "Ahmed");

// 14 (sync read)
const readFileSyncLog = (p) => {
  const content = fs.readFileSync(p, "utf-8");
  console.log("the file content =>", content);
};

// 15 (async write)
const writeFileAsync = (p, content) => {
  fs.writeFile(p, content, (err) => {
    if (err) return console.log(err.message);
    console.log("File written successfully");
  });
};

// 16
const dirExists = (p) => fs.existsSync(p);

// 17
const getOsInfo = () => ({ Platform: os.platform(), Arch: os.arch() });

// 18 (readable stream in chunks)
const readInChunks = (p) => {
  const rs = fs.createReadStream(p, { encoding: "utf-8", highWaterMark: 16 });
  rs.on("data", (chunk) => console.log("Chunk:", chunk));
  rs.on("end", () => console.log("Done reading"));
  rs.on("error", (err) => console.log(err.message));
};

// 19 (copy with streams)
const copyWithStreams = (src, dest) => {
  const rs = fs.createReadStream(src);
  const ws = fs.createWriteStream(dest);
  rs.pipe(ws);
  ws.on("finish", () => console.log("File copied using streams"));
  rs.on("error", (err) => console.log(err.message));
};

// 20 (pipeline + gzip)
const compressFile = (src, dest) => {
  pipeline(
    fs.createReadStream(src),
    zlib.createGzip(),
    fs.createWriteStream(dest),
    (err) => {
      if (err) return console.log("Pipeline failed:", err.message);
      console.log("File compressed successfully");
    }
  );
};

module.exports = {
  getFileInfo, getFileName, buildPath, getExt, parsePath, isAbsolutePath,
  joinSegments, resolvePath, joinTwoPaths, deleteFile, createFolder, emitter,
  readFileSyncLog, writeFileAsync, dirExists, getOsInfo, readInChunks,
  copyWithStreams, compressFile,
};

// ---- quick demo (run: node part1.js) ----
if (require.main === module) {
  console.log(getFileInfo());
  console.log(getFileName("/user/files/report.pdf"));
  console.log(buildPath({ dir: "/folder", name: "app", ext: ".js" }));
  console.log(getExt("/docs/readme.md"));
  console.log(parsePath("/home/app/main.js"));
  console.log(isAbsolutePath("/home/user/file.txt"));
  console.log(joinSegments("src", "components", "App.js"));
  console.log(resolvePath("./index.js"));
  console.log(joinTwoPaths("/folder1", "folder2/file.txt"));
  createFolder("./demo-folder");
  emitter.emit("start");
  emitter.emit("login", "Ahmed");
  console.log(getOsInfo());
}
