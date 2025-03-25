Run the Frontend Properly
If you're opening the index.html file directly in the browser (e.g., using file://), the browser may block requests to localhost or 127.0.0.1. To avoid this:

Use a Local Server:

Use a simple HTTP server to serve your frontend files. For example, with Python:</br>
python -m http.server 8000 </br>
Then open http://localhost:8000/frontend/index.html in your browser. </br>


start the Flask backend:

python app.py
