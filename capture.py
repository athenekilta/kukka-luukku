import cv2
import requests
import numpy as np
from threading import Thread
import time
from datetime import datetime

# Constants
WEBCAM_INDEX = 0  # Index of your USB webcam, typically 0
FPS = 10          # Frames per second for capturing
POST_URL = 'https://SERVER_URL:PORT/upload'  # URL to which images will be POSTed

class ImageCapture:
    def __init__(self):
        self.capture = cv2.VideoCapture(WEBCAM_INDEX)
        self.capture.set(cv2.CAP_PROP_FPS, FPS)
        self.is_capturing = False

    def start_capture(self):
        self.is_capturing = True
        self.capture_thread = Thread(target=self._capture_loop)
        self.capture_thread.start()

    def stop_capture(self):
        self.is_capturing = False
        self.capture_thread.join()

    def _capture_loop(self):
        while self.is_capturing:
            ret, frame = self.capture.read()
            if ret:
                self._send_frame(frame)
            else:
                print("Failed to capture frame.")
            time.sleep(1/FPS)

    def _send_frame(self, frame):
        cv2.putText(frame, "SUB-CAM-1", (10, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
        
        current_date = datetime.now().strftime("%Y-%m-%d")
        cv2.putText(frame, current_date, (frame.shape[1] - 150, frame.shape[0] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

        rec_text = "REC"
        cv2.putText(frame, rec_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 2, cv2.LINE_AA)
        cv2.circle(frame, (90, 20), 13, (0, 0, 255), -1)  # Draw a red filled circle (ball)
        
        _, img_encoded = cv2.imencode('.jpg', frame)
        
        try:
            response = requests.post(POST_URL, files={'image': ('image.jpg', img_encoded.tostring())})
            if response.status_code != 200:
                print("Failed to send frame to server.")
        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    try:
        capture = ImageCapture()
        capture.start_capture()
        input("Press Enter to stop capture.")
        capture.stop_capture()
    except KeyboardInterrupt:
        capture.stop_capture()
