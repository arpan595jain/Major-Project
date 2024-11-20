let cropData = [];

// Load the dataset
document.getElementById('dataset-file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvContent = e.target.result;
            parseCSV(csvContent);
        };
        reader.readAsText(file);
    }
});

// Parse CSV content into an array
function parseCSV(data) {
    const rows = data.split('\n').slice(1); // Skip the header row
    cropData = rows.map(row => {
        const cols = row.split(',');
        return {
            nitrogen: parseFloat(cols[0]),
            phosphorus: parseFloat(cols[1]),
            potassium: parseFloat(cols[2]),
            phValue: parseFloat(cols[3]),
            humidity: parseFloat(cols[4]),
            temperature: parseFloat(cols[5]),
            crop: cols[6]?.trim()
        };
    });
    console.log("Dataset loaded:", cropData);
}

// Predict the crop based on user inputs
function predictCrop() {
    const nitrogen = parseFloat(document.getElementById('nitrogen').value);
    const phosphorus = parseFloat(document.getElementById('phosphorus').value);
    const potassium = parseFloat(document.getElementById('potassium').value);
    const phValue = parseFloat(document.getElementById('phValue').value);
    const humidity = parseFloat(document.getElementById('humidity').value);
    const temperature = parseFloat(document.getElementById('temperature').value);

    if (!cropData.length) {
        alert('Please upload the dataset first!');
        return;
    }

    // Find the closest match from the dataset
    let bestMatch = null;
    let minDifference = Infinity;

    cropData.forEach(row => {
        const diff = Math.abs(row.nitrogen - nitrogen) +
                     Math.abs(row.phosphorus - phosphorus) +
                     Math.abs(row.potassium - potassium) +
                     Math.abs(row.phValue - phValue) +
                     Math.abs(row.humidity - humidity) +
                     Math.abs(row.temperature - temperature);

        if (diff < minDifference) {
            minDifference = diff;
            bestMatch = row.crop;
        }
    });

    // Display the result
    document.getElementById('prediction-result').innerText = bestMatch 
        ? `Recommended Crop: ${bestMatch}` 
        : 'No suitable crop found!';
}
