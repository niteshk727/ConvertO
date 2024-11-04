document.getElementById('convertBtn').addEventListener('click', () => {
    const input = document.getElementById('imageInput');
    if (input.files.length === 0) {
        alert('Please select an image file first.');
        return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const imgData = e.target.result;
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // Add image to PDF
        pdf.addImage(imgData, 'JPEG', 10, 10, 190, 0); // You can adjust the dimensions
        pdf.save('converted.pdf');
    };

    reader.readAsDataURL(file);
});

document.getElementById('compressBtn').addEventListener('click', () => {
    const input = document.getElementById('compressImageInput');
    if (input.files.length === 0) {
        alert('Please select an image file first.');
        return;
    }

    const file = input.files[0];

    new Compressor(file, {
        quality: 0.6, // Adjust quality as needed
        success(result) {
            const url = URL.createObjectURL(result);
            const downloadLink = document.getElementById('downloadCompressed');
            downloadLink.href = url;
            downloadLink.download = 'compressed_' + file.name;
            downloadLink.style.display = 'inline'; // Show download link
        },
        error(err) {
            console.error(err.message);
        },
    });
});

document.getElementById('generatePdfBtn').addEventListener('click', () => {
    const doc = new jsPDF();
    const text = document.getElementById('textInput').value;

    if (text.trim() === "") {
        alert('Please enter some text to generate a PDF.');
        return;
    }

    doc.text(text, 10, 10); // Add text to PDF
    const pdfOutput = doc.output('blob');
    const url = URL.createObjectURL(pdfOutput);
    const downloadLink = document.getElementById('downloadPdf');
    downloadLink.href = url;
    downloadLink.download = 'text.pdf';
    downloadLink.style.display = 'inline'; // Show download link
});

document.getElementById('splitPdfBtn').addEventListener('click', async () => {
    const pdfInput = document.getElementById('pdfInput').files[0];
    if (!pdfInput) {
        alert('Please upload a PDF file to split.');
        return;
    }

    const pdfDoc = await PDFLib.PDFDocument.load(await pdfInput.arrayBuffer());
    const totalPages = pdfDoc.getPageCount();
    const splitDocs = [];

    for (let i = 0; i < totalPages; i++) {
        const newDoc = await PDFLib.PDFDocument.create();
        const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
        newDoc.addPage(copiedPage);
        const pdfBytes = await newDoc.save();
        splitDocs.push(pdfBytes);
    }

    // Creating download links for split PDFs
    splitDocs.forEach((doc, index) => {
        const url = URL.createObjectURL(new Blob([doc]));
        const downloadLink = document.getElementById('downloadSplit');
        downloadLink.href = url;
        downloadLink.download = `split_page_${index + 1}.pdf`;
        downloadLink.style.display = 'inline'; // Show download link
    });
});

document.getElementById('mergePdfBtn').addEventListener('click', async () => {
    const pdfInput = document.getElementById('pdfInput').files[0];
    if (!pdfInput) {
        alert('Please upload a PDF file to merge.');
        return;
    }

    const pdfDoc = await PDFLib.PDFDocument.load(await pdfInput.arrayBuffer());
    const newDoc = await PDFLib.PDFDocument.create();
    const copiedPages = await newDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach(page => newDoc.addPage(page));
    const mergedPdf = await newDoc.save();

    const url = URL.createObjectURL(new Blob([mergedPdf]));
    const downloadLink = document.getElementById('downloadMerge');
    downloadLink.href = url;
    downloadLink.download = 'merged.pdf';
    downloadLink.style.display = 'inline'; // Show download link
});

document.getElementById('convertToPngBtn').addEventListener('click', async () => {
    const imageFile = document.getElementById('imageToPngInput').files[0];
    if (!imageFile) {
        alert('Please upload an image file.');
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(imageFile);
    img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const url = URL.createObjectURL(pngBlob);
        const downloadLink = document.getElementById('downloadPng');
        downloadLink.href = url;
        downloadLink.download = 'converted_image.png';
        downloadLink.style.display = 'inline'; // Show download link
    };
});

document.getElementById('convertToJpegBtn').addEventListener('click', async () => {
    const imageFile = document.getElementById('imageToJpegInput').files[0];
    if (!imageFile) {
        alert('Please upload an image file.');
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(imageFile);
    img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const jpegBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
        const url = URL.createObjectURL(jpegBlob);
        const downloadLink = document.getElementById('downloadJpeg');
        downloadLink.href = url;
        downloadLink.download = 'converted_image.jpeg';
        downloadLink.style.display = 'inline'; // Show download link
    };
});

// For audio conversion, this is just a placeholder since direct conversion is complex
document.getElementById('convertToMp3Btn').addEventListener('click', async () => {
    const audioFile = document.getElementById('audioToMp3Input').files[0];
    if (!audioFile) {
        alert('Please upload an audio file.');
        return;
    }

    // Placeholder for actual conversion logic (audio conversion is complex)
    alert('Audio conversion is complex and requires server-side processing. Please upload an audio file to convert it.');
});

document.getElementById('addWatermarkBtn').addEventListener('click', async () => {
    const imageFile = document.getElementById('watermarkInput').files[0];
    const watermarkText = document.getElementById('watermarkText').value;

    if (!imageFile) {
        alert('Please upload an image file.');
        return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(imageFile);
    img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // White color with transparency
        ctx.textAlign = 'center';
        ctx.fillText(watermarkText, canvas.width / 2, canvas.height - 30); // Place the watermark

        const watermarkedBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const url = URL.createObjectURL(watermarkedBlob);
        const downloadLink = document.getElementById('downloadWatermarked');
        downloadLink.href = url;
        downloadLink.download = 'watermarked_image.png';
        downloadLink.style.display = 'inline'; // Show download link
    };
});

