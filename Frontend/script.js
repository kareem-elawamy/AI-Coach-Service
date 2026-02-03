// script.js

// Elements
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("file-info");
const filenameSpan = document.getElementById("filename");
const removeFileBtn = document.getElementById("removeFile");
const analyzeBtn = document.getElementById("analyzeBtn");
const loadingDiv = document.getElementById("loading");
const resultsDiv = document.getElementById("results");

let selectedFile = null;

// 1. Drag & Drop Logic
dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const files = e.dataTransfer.files;
  handleFile(files[0]);
});

fileInput.addEventListener("change", (e) => {
  handleFile(e.target.files[0]);
});

function handleFile(file) {
  if (file && file.name.endsWith(".docx")) {
    selectedFile = file;
    filenameSpan.textContent = file.name;
    fileInfo.classList.remove("hidden");
    analyzeBtn.disabled = false;
    // إخفاء الـ placeholder
    dropZone.querySelector("h3").classList.add("hidden");
    dropZone.querySelector("p").classList.add("hidden");
    dropZone.querySelector(".upload-icon").classList.add("hidden");
  } else {
    Swal.fire({
      icon: "error",
      title: "ملف غير مدعوم",
      text: "يرجى رفع ملف بصيغة Word (.docx) فقط",
      confirmButtonText: "حسناً",
    });
  }
}

// Remove File Logic
removeFileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  selectedFile = null;
  fileInput.value = "";
  fileInfo.classList.add("hidden");
  analyzeBtn.disabled = true;
  resultsDiv.classList.add("hidden");

  // إظهار الـ placeholder
  dropZone.querySelector("h3").classList.remove("hidden");
  dropZone.querySelector("p").classList.remove("hidden");
  dropZone.querySelector(".upload-icon").classList.remove("hidden");
});

// 2. Analyze Button Logic (The Main Event)
analyzeBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  // UI Updates
  analyzeBtn.disabled = true;
  loadingDiv.classList.remove("hidden");
  resultsDiv.classList.add("hidden");

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    // الاتصال بالـ Backend
    const response = await fetch("http://localhost:3000/api/analyze", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "حدث خطأ في الخادم");
    }

    // النجاح
    displayResults(result.data);

    Swal.fire({
      icon: "success",
      title: "تم التحليل بنجاح!",
      text: "قام الذكاء الاصطناعي باستخراج البيانات وتوليد التوصيات.",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: "error",
      title: "فشل التحليل",
      text: error.message,
      confirmButtonText: "حاول مرة أخرى",
    });
  } finally {
    loadingDiv.classList.add("hidden");
    analyzeBtn.disabled = false;
  }
});

// 3. عرض البيانات في الكروت
function displayResults(data) {
  resultsDiv.classList.remove("hidden");

  // تعبئة البيانات
  setText("res-summary", data.personal_summary);
  setList("res-medical", data.medical_history);
  setList("res-nutrition", data.nutritional_habits);
  setList("res-env", data.environmental_factors);
  setList("res-psych", data.psychological_plan);
  setList("res-recommendations", data.recommended_activities);

  // Scroll to results
  resultsDiv.scrollIntoView({ behavior: "smooth" });
}

function setText(id, text) {
  const el = document.getElementById(id);
  el.textContent = text || "لا توجد بيانات متاحة";
}

function setList(id, array) {
  const ul = document.getElementById(id);
  ul.innerHTML = ""; // مسح القديم

  if (array && array.length > 0) {
    array.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
  } else {
    ul.innerHTML = '<li style="color: #9ca3af;">لا توجد ملاحظات مسجلة</li>';
  }
}
