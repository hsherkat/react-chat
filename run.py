from flask_backend import app, socket

if __name__ == "__main__":
    socket.run(app, host='192.168.1.155', port=5000, debug=True)
