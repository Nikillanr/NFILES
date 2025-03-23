let currentFileToDelete = null;

// Function to open the delete confirmation modal
const openDeleteModal = (filename) => {
  currentFileToDelete = filename;
  const modal = document.getElementById("deleteModal");
  const modalMessage = document.getElementById("modalMessage");
  modalMessage.textContent = `Are you sure you want to delete ${filename}?`;
  modal.style.display = "flex";
};

// Function to close the delete confirmation modal
const closeDeleteModal = () => {
  const modal = document.getElementById("deleteModal");
  modal.style.display = "none";
  currentFileToDelete = null;
};

// Function to delete a file
const deleteFile = async (filename) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/delete/${filename}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (data.message && data.message === "File deleted successfully") {
      alert("File deleted successfully");
      fetchFileList(); // Refresh the file list after deletion
    } else {
      alert("Error deleting file.");
    }
  } catch (error) {
    alert("Error deleting file.");
  }
  closeDeleteModal();
};

// Function to fetch and display the list of files
const fetchFileList = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/files");
    const data = await response.json();
    const fileList = document.getElementById("fileList");

    if (data.files && data.files.length > 0) {
      fileList.innerHTML = data.files
        .map(
          (file) => `
                <div class="file-item">
                    <div class="file-details">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">Size: ${(
                          file.size / 1024
                        ).toFixed(2)} KB</div>
                        <div class="file-date">Uploaded: ${
                          file.upload_date
                        }</div>
                    </div>
                    <div>
                        <button onclick="downloadFile('${
                          file.name
                        }')">Download</button>
                        <button class="delete" onclick="openDeleteModal('${
                          file.name
                        }')">Delete</button>
                    </div>
                </div>
            `
        )
        .join("");
    } else {
      fileList.innerHTML = "<p>No files found.</p>";
    }
  } catch (error) {
    console.error("Error fetching file list:", error);
  }
};

// Function to handle file download
const downloadFile = (filename) => {
  window.open(`http://127.0.0.1:5000/download/${filename}`);
};

// Fetch the file list when the page loads
document.addEventListener("DOMContentLoaded", fetchFileList);

// Upload file functionality
document.getElementById("uploadButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const uploadStatus = document.getElementById("uploadStatus");

  if (fileInput.files.length === 0) {
    uploadStatus.textContent = "Please select a file to upload.";
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.message && data.message === "File uploaded successfully") {
      uploadStatus.textContent = `File uploaded successfully: ${data.filename}`;
      fetchFileList(); // Refresh the file list after upload
    } else {
      uploadStatus.textContent = "Error uploading file.";
    }
  } catch (error) {
    uploadStatus.textContent = "Error uploading file.";
  }
});

// Modal event listeners
document.getElementById("confirmDeleteButton").addEventListener("click", () => {
  if (currentFileToDelete) {
    deleteFile(currentFileToDelete);
  }
});

document
  .getElementById("cancelDeleteButton")
  .addEventListener("click", closeDeleteModal);
