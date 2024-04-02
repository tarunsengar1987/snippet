import os
import logging
import sys
import requests
import json
from dotenv import load_dotenv
from pymongo import MongoClient

from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)

# Load environment variables from .env file
load_dotenv()

# Set up paths and URLs using environment variables
PERSIST_DIR = os.getenv("PERSIST_DIR")
TOKEN_URL = os.getenv("TOKEN_URL")
API_URL = os.getenv("API_URL")
USERNAME = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
DATA_DIR = os.getenv("DATA_DIR")
DATABASE = os.getenv("DATABASE")
MONGO_URL = os.getenv("MONGO_URL")

# Define the path for the JSON file
JSON_FILE_PATH = os.path.join(DATA_DIR, "api_data.json")

# Function to get access token from the API
def get_access_token():
    try:
        # Make a POST request to fetch the access token
        response = requests.post(TOKEN_URL, data={"grant_type": "password", "username": USERNAME, "password": PASSWORD})
        response.raise_for_status()
        token_data = response.json()
        return token_data.get("access_token")
    except requests.exceptions.RequestException as e:
        # Handle exception if request fails
        print(f"Failed to fetch access token: {e}")
        sys.exit(1)

# Function to fetch data from the API
def fetch_data(access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        # Make a GET request to fetch data from the API
        response = requests.get(API_URL, headers=headers)
        response.raise_for_status()
        data = response.json()

        # Ensure that the data directory exists, create if not
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR)

        # Save fetched data to a JSON file
        with open(JSON_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(f"Data fetched from the API and stored locally as {JSON_FILE_PATH}")
        
        # Embed data into storage
        embedded_data(DATA_DIR)
    except requests.exceptions.RequestException as e:
        # Handle exception if request fails
        print(f"Failed to fetch data from the API: {e}")
        sys.exit(1)

# Function to embed data into storage
def embedded_data(data_dir):
    persist_dir = "./storage"
    if not os.path.exists(persist_dir):
        os.makedirs(persist_dir)  

    if not os.path.exists(os.path.join(persist_dir, "docstore.json")):
        # Load documents from directory and create index
        documents = SimpleDirectoryReader(data_dir).load_data()
        index = VectorStoreIndex.from_documents(documents)
        index.storage_context.persist(persist_dir=persist_dir)
        
        # Insert files to MongoDB
        insert_files_to_mongodb(persist_dir)
    else:
        # Load index from storage
        storage_context = StorageContext.from_defaults(persist_dir=persist_dir)
        index = load_index_from_storage(storage_context)
        

# Function to insert files into MongoDB
def insert_files_to_mongodb(directory):
    client = MongoClient(MONGO_URL)
    db = client[DATABASE]
    for file_name in os.listdir(directory):
        collection_name = os.path.splitext(file_name)[0]  
        collection = db[collection_name]
        with open(os.path.join(directory, file_name), 'r') as file:
            file_content = file.read()
            document = {'content': file_content}  
            collection.insert_one(document)

if __name__ == "__main__":
    # Get access token and fetch data from the API
    access_token = get_access_token()
    fetch_data(access_token)

# Set up logging configuration
logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))
