## Subicam Kukkaluukku

Subcam server ja Webcam capture scribu.

### Vaatimukset

- Raspberry Pi tms. pythonilla ja pipillä
- USB webcam
- Joku pannu

### Raspi Setup

1. Kloonaa repo tai kopioi "capture.py" raspille.
2. Asenna pip paketit
   `pip install opencv-python-headless requests`
3. Vaihda oikea POST_URL tiedostoon
4. Aja capture.py

Jos haluaa ajaa servicenä [täällä](https://medium.com/codex/setup-a-python-script-as-a-service-through-systemctl-systemd-f0cc55a42267) on ohje.

### Server Setup ?
