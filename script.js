var canvas = new fabric.Canvas("canvas", {
  backgroundColor: "rgb(100,100,200)",
  height: window.innerHeight - 100,
  width: window.innerWidth - 50,
});

const text = new fabric.Text(
  "Drag and Drop on the canvas or Choose from below !!!!",
  {
    top: canvas.getHeight() / 2,
    left: canvas.getWidth() / 2 - 400,
  }
);
canvas.add(text);

let upload = document.getElementById("upload");

upload.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith("image/")) {
      continue;
    }

    const reader = new FileReader();
    reader.onload = function ({ target: { result } }) {
      addImgToCanvas(result);
    };
    reader.readAsDataURL(file);
  }
}

function addImgToCanvas(src) {
  fabric.Image.fromURL(src, function (oImg) {
    oImg.selectable = false;
    const c_h = canvas.getHeight(),
      c_w = canvas.getWidth(),
      i_w = oImg.width,
      i_h = oImg.height,
      del = 0.01;
    let i = 1,
      scale = 1 - i * del;
    while (i_h * scale > c_h || i_w * scale > c_w) {
      i++;
      scale = 1 - i * del;
    }
    oImg.scale(scale);
    canvas.add(oImg);
  });
}

canvas.on("mouse:wheel", function (opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  // console.log(zoom);
  if (zoom > 20) zoom = 20;
  if (zoom < 1) zoom = 1;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
  var vpt = this.viewportTransform;
  // console.log(vpt);
  const height = canvas.getHeight();
  const width = canvas.getWidth();
  if (zoom < 400 / 1000) {
    vpt[4] = 200 - (width * zoom) / 2;
    vpt[5] = 200 - (height * zoom) / 2;
  } else {
    if (vpt[4] >= 0) {
      vpt[4] = 0;
    } else if (vpt[4] < canvas.getWidth() - width * zoom) {
      vpt[4] = canvas.getWidth() - width * zoom;
    }
    if (vpt[5] >= 0) {
      vpt[5] = 0;
    } else if (vpt[5] < canvas.getHeight() - height * zoom) {
      vpt[5] = canvas.getHeight() - height * zoom;
    }
  }
});
