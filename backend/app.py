from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # Import CORS
import pandas as pd
import hashlib

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    df = pd.read_csv(file)
    column_names = df.columns.tolist()

    
    return jsonify({'columns': column_names})


@app.route('/anonymize', methods=['POST'])
def anonymize():
    columns_to_anonymize = request.form.getlist('columns[]')
    
    file = request.files['file']
    df = pd.read_csv(file)

    
    for column in columns_to_anonymize:
        if column in df.columns:
            df[column] = df[column].apply(lambda x: hashlib.sha256(str(x).encode()).hexdigest())

    
    output_file = 'anonymized.csv'
    df.to_csv(output_file, index=False)

    
    return send_file(output_file, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  