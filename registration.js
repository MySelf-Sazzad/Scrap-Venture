const form = document.getElementById("registrationForm");
const photoInput = document.getElementById("studentPhoto");
const photoPreview = document.getElementById("photoPreview");
const previewImage = document.getElementById("previewImage");
const photoUploadLabel = document.getElementById("photoUploadLabel");
const photoUploadText = document.getElementById("photoUploadText");
const success = document.getElementById("registrationSuccess");
const REGISTRATIONS_KEY = "sv_campus_ambassador_registrations_v1";

function setError(input, message) {
  const field = input.closest(".registration-field");
  field.classList.add("invalid");
  field.querySelector(".field-error").textContent = message;
}

function clearError(input) {
  const field = input.closest(".registration-field");
  field.classList.remove("invalid");
  field.querySelector(".field-error").textContent = "";
}

function validateForm() {
  let valid = true;
  [...form.querySelectorAll("input[required]:not([type=file]), select[required]")].forEach((input) => {
    if (!input.value.trim()) {
      setError(input, "এই তথ্যটি পূরণ করা আবশ্যক। ");
      valid = false;
    } else clearError(input);
  });
  if (!photoInput.files.length) {
    setError(photoInput, "শিক্ষার্থীর একটি ছবি নির্বাচন করো।");
    valid = false;
  } else clearError(photoInput);
  return valid;
}

function imageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read image."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Invalid image."));
      image.onload = () => {
        const maxSize = 700;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function saveRegistration(registration) {
  let registrations = [];
  try { registrations = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY)) || []; } catch { registrations = []; }
  registrations.unshift(registration);
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
  window.dispatchEvent(new CustomEvent("sv:registrations-updated"));
}

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
    photoInput.value = "";
    setError(photoInput, "জেপিজি, পিএনজি বা ওয়েবপি ছবি নির্বাচন করো (সর্বোচ্চ ৫ এমবি)।");
    return;
  }
  clearError(photoInput);
  previewImage.src = URL.createObjectURL(file);
  photoUploadLabel.hidden = true;
  photoPreview.hidden = false;
  photoUploadLabel.classList.add("is-ready");
});

document.getElementById("removePhoto").addEventListener("click", () => {
  photoInput.value = "";
  previewImage.removeAttribute("src");
  photoPreview.hidden = true;
  photoUploadLabel.hidden = false;
  photoUploadText.textContent = "ছবি আপলোড করুন";
  photoUploadLabel.classList.remove("is-ready");
});

form.addEventListener("input", (event) => clearError(event.target));
form.addEventListener("change", (event) => clearError(event.target));
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  success.hidden = true;
  if (!validateForm()) return;
  const submitButton = form.querySelector(".registration-submit");
  submitButton.disabled = true;
  try {
    const photo = await imageFileToDataUrl(photoInput.files[0]);
    saveRegistration({
      id: `REG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      studentName: document.getElementById("studentName").value.trim(),
      studentId: document.getElementById("studentId").value.trim(),
      studentClass: document.getElementById("studentClass").value,
      schoolName: document.getElementById("schoolName").value.trim(),
      photo,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    setError(photoInput, "নিবন্ধন সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
    submitButton.disabled = false;
    return;
  }
  form.reset();
  previewImage.removeAttribute("src");
  photoPreview.hidden = true;
  photoUploadLabel.hidden = false;
  photoUploadLabel.classList.remove("is-ready");
  submitButton.disabled = false;
  photoUploadText.textContent = "ছবি আপলোড করুন";
  success.hidden = false;
  success.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

