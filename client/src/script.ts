const gallery = document.getElementById("gallery");
const form = document.getElementById("resizeForm") as HTMLFormElement;
const uploadForm = document.getElementById("uploadForm") as HTMLFormElement;
const fileInput = document.getElementById("imageInput") as HTMLInputElement;
async function checkServerStatus(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:3000/images/image-list");
    return response.ok;
  } catch (error) {
    console.error("Server check failed:", error);
    if (gallery) {
      gallery.innerHTML = `
        <div class="error-message">
          <p>Cannot connect to server. Please ensure:</p>
          <ul>
            <li>Server is running (npm start in server directory)</li>
            <li>Server is accessible on http://localhost:3000</li>
          </ul>
        </div>
      `;
    }
    return false;
  }
}
let fileName: string = "";
document.addEventListener("DOMContentLoaded", () => {
  form?.addEventListener("submit", (event: Event) => {
    event.preventDefault();
    const url: string = createUrl();
    const urlInput = document.getElementById("urlInput") as HTMLInputElement;
    urlInput.value = url;
    document.getElementById("generatedLink")?.classList.remove("hidden");
  });

  uploadForm?.addEventListener("submit", async (event: Event) => {
    event.preventDefault();
    const file: File | undefined = fileInput.files?.[0];
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res: Response = await fetch("http://localhost:3000/images/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Upload success:", data);
      debugger;
      createCard(data.filename);
      debugger;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  });

  checkServerStatus().then((isServerRunning) => {
    if (isServerRunning) {
      fetch("http://localhost:3000/images/image-list")
        .then((res: Response) => {
          if (!res.ok) {
            throw new Error(`Server responded with status: ${res.status}`);
          }
          return res.json();
        })
        .then((files: string[]) => {
          if (!gallery) throw new Error("Gallery element not found");

          if (!files || files.length === 0) {
            gallery.innerHTML =
              '<p class="no-images">No images found. Please upload some images first.</p>';
            return;
          }
          files.forEach((file: string) => createCard(file));
        })
        .catch((error: Error) => {
          console.error("Gallery loading error:", error);
          if (gallery) {
            gallery.innerHTML = `
              <div class="error-message">
                <p>Failed to load gallery. Please ensure:</p>
                <ul>
                  <li>The server is running on port 3000</li>
                  <li>The images directory exists and has permissions</li>
                  <li>You have images uploaded to the server</li>
                </ul>
                <p>Error: ${error.message}</p>
              </div>
            `;
          }
        });
    }
  });
});

/** @type {HTMLButtonElement} onClick handler */

function copyUrl(): void {
  const urlInput = document.getElementById("urlInput") as HTMLInputElement;
  urlInput?.select();
  document.execCommand("copy");
  alert("URL copied!");
}

function openResizeForm(imgName: string): void {
  fileName = imgName;
  const overlay = document.getElementById("overlay");
  const resizeForm = document.getElementById("resizeForm");
  if (overlay && resizeForm) {
    overlay.style.display = "block";
    resizeForm.style.display = "block";
  }
}
/** @type {HTMLButtonElement} onClick handler */
function closeResizeForm(): void {
  const overlay = document.getElementById("overlay");
  const resizeForm = document.getElementById("resizeForm");
  if (overlay && resizeForm) {
    overlay.style.display = "none";
    resizeForm.style.display = "none";
  }
}

function createUrl(): string {
  const heightInput = document.getElementById(
    "heightInput",
  ) as HTMLInputElement;
  const widthInput = document.getElementById("widthInput") as HTMLInputElement;
  if (!heightInput || !widthInput) throw new Error("Form inputs not found");
  return `http://localhost:3000/images/${fileName}?height=${heightInput.value}&width=${widthInput.value}`;
}
function createCard(file: string): void {
  const card = document.createElement("div");
  card.className = "image-card";

  const img = document.createElement("img");
  img.src = `http://localhost:3000/images/${file}`;
  img.alt = file;

  const button = document.createElement("button");
  button.className = "resize-btn";
  button.innerText = "Resize";
  button.onclick = (): void => openResizeForm(file);

  card.appendChild(img);
  card.appendChild(button);
  if (!gallery) throw new Error("Gallery element not found");
  gallery.appendChild(card);
}
