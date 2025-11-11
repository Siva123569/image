from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/movies')
def movies():
    movie_list = ["Pushpa 2", "Salaar", "Devara", "Jawan", "KGF 3"]
    return render_template('movies.html', movies=movie_list)

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
