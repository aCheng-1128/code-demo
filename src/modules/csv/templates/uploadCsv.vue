<template>
  <div class="box">
    <h1>Upload CSV File To JSON</h1>
    <form @submit.prevent="uploadFile">
      <div class="ipt-box">
        <input type="file" name="file" accept=".csv" required ref="fileInput" />
        <span>
          {{ showText }}
        </span>
      </div>
      <button type="submit">下载JSON</button>
    </form>
  </div>
</template>

<script setup>
// import { computed } from 'vue';
// import { ref } from 'vue';

const fileInput = ref(null);

const showText = Vue.computed(() => {
  if (fileInput.value && fileInput.value.files.length) {
    return fileInput.value.files[0].name;
  }
  return 'Select CSV File';
});

const uploadFile = async () => {
  const file = fileInput.value.files[0];
  if (!file) {
    alert('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/csv/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // const result = await response.json();
    downloadFile(response);
    // console.log(result);
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('File upload failed');
  }
};

const downloadFile = async (response) => {
  try {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded_file.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    console.log('File downloaded successfully');
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('File download failed');
  }
};

return { fileInput, showText, uploadFile, downloadFile };
</script>

<style scoped>
.box {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #f9f9f9;
}

h1 {
  font-size: 24px;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.ipt-box {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  transition: border-color 0.3s;
  position: relative;
}

.ipt-box:hover {
  border-color: #007bff;
}

input[type='file'] {
  opacity: 0;
  position: absolute;
  cursor: pointer;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

button:active {
  background-color: #004494;
}
</style>
