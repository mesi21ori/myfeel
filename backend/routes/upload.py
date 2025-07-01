from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import uuid

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'pptx', 'jpg', 'jpeg', 'png'}
MAX_UPLOADS = 5
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    uploaded_files = request.files.getlist('file')
    if not uploaded_files:
        return jsonify({'error': 'No files uploaded'}), 400

    if len(uploaded_files) > MAX_UPLOADS:
        return jsonify({'error': f'Maximum of {MAX_UPLOADS} files allowed'}), 400

    saved_files = []

    for file in uploaded_files:
        if file.filename == '':
            continue
        if not allowed_file(file.filename):
            continue

        filename = secure_filename(file.filename)
        unique_id = str(uuid.uuid4())
        saved_path = os.path.join(UPLOAD_FOLDER, f"{unique_id}_{filename}")
        file.save(saved_path)

        saved_files.append({
            'file_id': unique_id,
            'original_name': filename,
            'path': saved_path
        })

    if not saved_files:
        return jsonify({'error': 'No valid files uploaded'}), 400

    return jsonify({
        'message': 'Files uploaded successfully.',
        'files': saved_files
    }), 200
