document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('previewArea');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    const uploadBox = document.querySelector('.upload-box');

    // 拖拽上传
    uploadBox.addEventListener('dragenter', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.style.borderColor = '#007AFF';
    });

    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.style.borderColor = '#007AFF';
    });

    uploadBox.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.style.borderColor = '#ddd';
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadBox.style.borderColor = '#ddd';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            handleImage(file);
        }
    });

    // 文件选择处理
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            handleImage(file);
        }
    });

    // 质量滑块变化事件
    quality.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        const file = fileInput.files[0];
        if (file) {
            compressImage(file, e.target.value / 100);
        }
    });

    // 处理图片
    function handleImage(file) {
        if (!file.type.match('image.*')) {
            alert('请上传图片文件！');
            return;
        }
        
        // 显示原始图片
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalSize.textContent = formatFileSize(file.size);
            compressImage(file, quality.value / 100);
            previewArea.hidden = false;
        };
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(file, qualityValue) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', qualityValue);
                compressedImage.src = compressedDataUrl;

                // 计算压缩后的大小
                const compressedSize = Math.round((compressedDataUrl.length - 22) * 3 / 4);
                document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);

                // 设置下载按钮
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.download = `compressed_${file.name}`;
                    link.href = compressedDataUrl;
                    link.click();
                };
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 