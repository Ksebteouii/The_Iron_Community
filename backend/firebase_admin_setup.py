import firebase_admin
from firebase_admin import credentials, auth
import os

def initialize_firebase():
    # Path to Firebase service account key JSON file
    service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
    if not service_account_path:
        raise Exception("FIREBASE_SERVICE_ACCOUNT_PATH environment variable not set")

    if not firebase_admin._apps:
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)

def verify_firebase_token(id_token):
    """
    Verify Firebase ID token and return decoded token info.
    Raises exception if token is invalid.
    """
    initialize_firebase()
    decoded_token = auth.verify_id_token(id_token)
    return decoded_token
