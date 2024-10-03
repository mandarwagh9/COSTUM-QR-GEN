// Custom encoding function
function customEncode(data) {
    return btoa(data); // Simple Base64 encoding
}

function customDecode(encodedData) {
    return atob(encodedData); // Simple Base64 decoding
}

// QR Code Generation (index.html)
$(document).ready(function() {
    $('#generateButton').click(function() {
        const dataToEncode = $('#urlInput').val();
        const encodedData = customEncode(dataToEncode);
        
        $('#qrCode').empty().qrcode(encodedData);
    });

    $('#downloadButton').click(function() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const qrCodeElement = $('#qrCode img')[0];

        canvas.width = qrCodeElement.width;
        canvas.height = qrCodeElement.height;
        context.drawImage(qrCodeElement, 0, 0);

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'qrcode.png';
        link.click();
    });
});

// QR Code Reading (reader.html)
$(document).ready(function() {
    $('#fileInput').change(function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const canvas = document.getElementById('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const decodedData = jsQR(imageData.data, canvas.width, canvas.height);
                    if (decodedData) {
                        $('#result').text('Decoded Data: ' + customDecode(decodedData.data));
                    } else {
                        $('#result').text('No QR code found.');
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    });
});
